import React, { createContext, useContext, useState } from 'react';
import { Issue, CivicIncident, IssueEvent, Notification, IssueStatus, IssueCategory, IssueSeverity, Location } from '../types';
import { DEMO_INITIAL_ISSUES, DEMO_INITIAL_INCIDENTS, DEMO_INITIAL_EVENTS } from '../data/demoSeedData';
import { analyzeReportWithBedrock } from '../services/bedrockService';
import { findPotentiallyRelatedIncidents, evaluateIssueIncidentRelationship } from '../services/relationshipEngine';

interface AddReportInput {
  title: string;
  description: string;
  category: IssueCategory;
  location: Location;
  photoUrls: string[];
  reporterId: string;
  reporterName: string;
}

interface DataContextType {
  issues: Issue[];
  incidents: CivicIncident[];
  events: IssueEvent[];
  notifications: Notification[];
  isAnalyzing: boolean;
  addReport: (input: AddReportInput) => Promise<{ issue: Issue; incident?: CivicIncident; aiConfidence: number }>;
  updateIncidentStatus: (incidentId: string, newStatus: IssueStatus, actorName: string, note?: string) => void;
  assignIncident: (incidentId: string, department: string, officerName?: string) => void;
  addIncidentNote: (incidentId: string, note: string, actorName: string) => void;
  markNotificationRead: (notificationId: string) => void;
  resetDemoData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [issues, setIssues] = useState<Issue[]>(DEMO_INITIAL_ISSUES);
  const [incidents, setIncidents] = useState<CivicIncident[]>(DEMO_INITIAL_INCIDENTS);
  const [events, setEvents] = useState<IssueEvent[]>(DEMO_INITIAL_EVENTS);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-1',
      userId: 'user-citizen-1',
      issueId: 'issue-101',
      incidentId: 'incident-42',
      title: 'Report Under Authority Review',
      message: 'Your report "Deep Pothole near Main St & 4th Ave" has been grouped into Possible Civic Incident #42 for authority review.',
      type: 'INCIDENT_ASSOCIATED',
      read: false,
      createdAt: '2026-09-19T08:50:00Z',
    }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const resetDemoData = () => {
    setIssues(DEMO_INITIAL_ISSUES);
    setIncidents(DEMO_INITIAL_INCIDENTS);
    setEvents(DEMO_INITIAL_EVENTS);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const addReport = async (input: AddReportInput) => {
    setIsAnalyzing(true);
    try {
      // Step 1: AI Classification & Severity Estimation via Bedrock
      const aiResult = await analyzeReportWithBedrock(input.title, input.description, input.category);

      const issueId = `issue-${Date.now()}`;
      const now = new Date().toISOString();

      const newIssue: Issue = {
        id: issueId,
        title: input.title,
        description: input.description,
        category: aiResult.category,
        location: input.location,
        photoUrls: input.photoUrls,
        status: 'UNDER_REVIEW',
        severity: aiResult.severity,
        department: aiResult.recommendedDepartment,
        reporterId: input.reporterId,
        reporterName: input.reporterName,
        createdAt: now,
        updatedAt: now,
      };

      // Step 2: Deterministic Related Report Search & Score Engine
      const potentialMatches = findPotentiallyRelatedIncidents(newIssue, incidents, issues);

      let targetIncident: CivicIncident | undefined = undefined;

      if (potentialMatches.length > 0 && potentialMatches[0].confidencePercentage >= 55) {
        // High/Medium relationship confidence match found -> associate with existing incident
        const topMatch = potentialMatches[0];
        const existingIncident = incidents.find((inc) => inc.id === topMatch.incidentId);

        if (existingIncident) {
          newIssue.incidentId = existingIncident.id;

          // Update incident without merging or deleting reports!
          const updatedIncident: CivicIncident = {
            ...existingIncident,
            reportIds: [...existingIncident.reportIds, newIssue.id],
            affectedCitizensCount: existingIncident.affectedCitizensCount + 1,
            relationshipSignals: topMatch.signals,
            aiConfidence: topMatch.confidencePercentage,
            updatedAt: now,
          };

          targetIncident = updatedIncident;
          setIncidents((prev) => prev.map((inc) => (inc.id === updatedIncident.id ? updatedIncident : inc)));
        }
      } else {
        // No match -> create new Possible Civic Incident candidate
        const newIncidentNumber = Math.max(...incidents.map((i) => i.incidentNumber), 40) + 1;
        const newIncidentId = `incident-${newIncidentNumber}`;

        newIssue.incidentId = newIncidentId;

        const newIncident: CivicIncident = {
          id: newIncidentId,
          incidentNumber: newIncidentNumber,
          title: `Possible ${newIssue.category} Incident near ${input.location.address || 'Reported Location'}`,
          summary: aiResult.summary,
          category: newIssue.category,
          severity: newIssue.severity,
          status: 'UNDER_REVIEW',
          reportIds: [newIssue.id],
          primaryLocation: input.location,
          aiConfidence: aiResult.aiConfidence,
          assignedDepartment: aiResult.recommendedDepartment,
          affectedCitizensCount: 1,
          createdAt: now,
          updatedAt: now,
        };

        targetIncident = newIncident;
        setIncidents((prev) => [newIncident, ...prev]);
      }

      setIssues((prev) => [newIssue, ...prev]);

      // Add audit event
      const newEvent: IssueEvent = {
        id: `event-${Date.now()}`,
        issueId: newIssue.id,
        incidentId: targetIncident?.id,
        actorId: input.reporterId,
        actorName: input.reporterName,
        actorRole: 'CITIZEN',
        action: 'Report Filed & Analyzed',
        newStatus: 'UNDER_REVIEW',
        note: `AI Analysis complete (${aiResult.severity} severity). Grouped under Possible Incident #${targetIncident?.incidentNumber}.`,
        timestamp: now,
      };

      setEvents((prev) => [newEvent, ...prev]);

      // Add Notification
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          userId: input.reporterId,
          issueId: newIssue.id,
          incidentId: targetIncident?.id,
          title: 'Report Received & Analyzed',
          message: `Your report "${input.title}" was analyzed and associated with Possible Civic Incident #${targetIncident?.incidentNumber}.`,
          type: 'REPORT_REVIEWED',
          read: false,
          createdAt: now,
        },
        ...prev,
      ]);

      return {
        issue: newIssue,
        incident: targetIncident,
        aiConfidence: targetIncident ? targetIncident.aiConfidence : 88,
      };
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateIncidentStatus = (
    incidentId: string,
    newStatus: IssueStatus,
    actorName: string,
    note?: string
  ) => {
    const now = new Date().toISOString();

    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          const prevStatus = inc.status;
          const updated = { ...inc, status: newStatus, updatedAt: now };

          // Update associated issues status
          setIssues((issueList) =>
            issueList.map((iss) => (inc.reportIds.includes(iss.id) ? { ...iss, status: newStatus, updatedAt: now } : iss))
          );

          // Add audit event
          setEvents((eventList) => [
            {
              id: `event-${Date.now()}`,
              incidentId,
              actorId: 'user-auth-1',
              actorName,
              actorRole: 'AUTHORITY',
              action: `Status changed from ${prevStatus} to ${newStatus}`,
              previousStatus: prevStatus,
              newStatus,
              note: note || `Incident status updated by ${actorName}`,
              timestamp: now,
            },
            ...eventList,
          ]);

          // Create notification for reporters
          setNotifications((notifList) => [
            {
              id: `notif-${Date.now()}`,
              userId: 'all-citizens',
              incidentId,
              title: `Incident #${inc.incidentNumber} Status Updated`,
              message: `Possible Civic Incident #${inc.incidentNumber} ("${inc.title}") is now ${newStatus}.`,
              type: newStatus === 'RESOLVED' ? 'RESOLVED' : 'STATUS_CHANGED',
              read: false,
              createdAt: now,
            },
            ...notifList,
          ]);

          return updated;
        }
        return inc;
      })
    );
  };

  const assignIncident = (incidentId: string, department: string, officerName?: string) => {
    const now = new Date().toISOString();
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              assignedDepartment: department,
              assignedTo: officerName || inc.assignedTo,
              status: inc.status === 'REPORTED' || inc.status === 'UNDER_REVIEW' ? 'ASSIGNED' : inc.status,
              updatedAt: now,
            }
          : inc
      )
    );
  };

  const addIncidentNote = (incidentId: string, note: string, actorName: string) => {
    const now = new Date().toISOString();
    setEvents((prev) => [
      {
        id: `event-${Date.now()}`,
        incidentId,
        actorId: 'user-auth-1',
        actorName,
        actorRole: 'AUTHORITY',
        action: 'Officer Note Added',
        note,
        timestamp: now,
      },
      ...prev,
    ]);
  };

  return (
    <DataContext.Provider
      value={{
        issues,
        incidents,
        events,
        notifications,
        isAnalyzing,
        addReport,
        updateIncidentStatus,
        assignIncident,
        addIncidentNote,
        markNotificationRead,
        resetDemoData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
