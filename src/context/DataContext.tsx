import React, { createContext, useContext, useState, useEffect } from 'react';
import { Issue, CivicIncident, IssueEvent, Notification, IssueStatus, IssueCategory, Location, ExternalCivicSignal, VolunteerOpportunity } from '../types';
import { DEMO_INITIAL_ISSUES, DEMO_INITIAL_INCIDENTS, DEMO_INITIAL_EVENTS, DEMO_EXTERNAL_SIGNALS, DEMO_VOLUNTEER_OPPORTUNITIES } from '../data/demoSeedData';
import { analyzeReportWithBedrock } from '../services/bedrockService';
import { findPotentiallyRelatedIncidents } from '../services/relationshipEngine';
import { useAuth } from './AuthContext';

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
  externalSignals: ExternalCivicSignal[];
  volunteerOpportunities: VolunteerOpportunity[];
  isAnalyzing: boolean;
  addReport: (input: AddReportInput) => Promise<{ issue: Issue; incident?: CivicIncident; aiConfidence: number }>;
  updateIncidentStatus: (incidentId: string, newStatus: IssueStatus, actorName: string, note?: string) => void;
  assignIncident: (incidentId: string, department: string, officerName?: string) => void;
  addIncidentNote: (incidentId: string, note: string, actorName: string) => void;
  markNotificationRead: (notificationId: string) => void;
  enrollVolunteerOpportunity: (opportunityId: string) => void;
  resetDemoData: () => void;
}

const PROD_ISSUES_KEY = 'civicforge_prod_issues';
const PROD_INCIDENTS_KEY = 'civicforge_prod_incidents';
const PROD_EVENTS_KEY = 'civicforge_prod_events';
const PROD_NOTIFS_KEY = 'civicforge_prod_notifications';
const PROD_VOLUNTEERS_KEY = 'civicforge_prod_volunteers';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDemoMode } = useAuth();

  const [issues, setIssues] = useState<Issue[]>(() => {
    if (isDemoMode) return DEMO_INITIAL_ISSUES;
    const saved = localStorage.getItem(PROD_ISSUES_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [incidents, setIncidents] = useState<CivicIncident[]>(() => {
    if (isDemoMode) return DEMO_INITIAL_INCIDENTS;
    const saved = localStorage.getItem(PROD_INCIDENTS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [events, setEvents] = useState<IssueEvent[]>(() => {
    if (isDemoMode) return DEMO_INITIAL_EVENTS;
    const saved = localStorage.getItem(PROD_EVENTS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    if (isDemoMode) {
      return [
        {
          id: 'notif-1',
          userId: 'user-citizen-1',
          issueId: 'issue-101',
          incidentId: 'incident-42',
          title: 'Report Under Authority Review',
          message: 'Your report "Severe Deep Potholes on 100 Feet Road, Koramangala" has been grouped into Possible Civic Incident #42 for authority review.',
          type: 'INCIDENT_ASSOCIATED',
          read: false,
          createdAt: '2026-09-19T08:50:00Z',
        },
      ];
    }
    const saved = localStorage.getItem(PROD_NOTIFS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [externalSignals, setExternalSignals] = useState<ExternalCivicSignal[]>(DEMO_EXTERNAL_SIGNALS);

  const [volunteerOpportunities, setVolunteerOpportunities] = useState<VolunteerOpportunity[]>(() => {
    if (isDemoMode) return DEMO_VOLUNTEER_OPPORTUNITIES;
    const saved = localStorage.getItem(PROD_VOLUNTEERS_KEY);
    return saved ? JSON.parse(saved) : DEMO_VOLUNTEER_OPPORTUNITIES;
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (isDemoMode) {
      setIssues(DEMO_INITIAL_ISSUES);
      setIncidents(DEMO_INITIAL_INCIDENTS);
      setEvents(DEMO_INITIAL_EVENTS);
      setExternalSignals(DEMO_EXTERNAL_SIGNALS);
      setVolunteerOpportunities(DEMO_VOLUNTEER_OPPORTUNITIES);
    } else {
      const savedIss = localStorage.getItem(PROD_ISSUES_KEY);
      const savedInc = localStorage.getItem(PROD_INCIDENTS_KEY);
      const savedEv = localStorage.getItem(PROD_EVENTS_KEY);
      const savedNot = localStorage.getItem(PROD_NOTIFS_KEY);
      const savedVol = localStorage.getItem(PROD_VOLUNTEERS_KEY);
      setIssues(savedIss ? JSON.parse(savedIss) : []);
      setIncidents(savedInc ? JSON.parse(savedInc) : []);
      setEvents(savedEv ? JSON.parse(savedEv) : []);
      setNotifications(savedNot ? JSON.parse(savedNot) : []);
      setVolunteerOpportunities(savedVol ? JSON.parse(savedVol) : DEMO_VOLUNTEER_OPPORTUNITIES);
    }
  }, [isDemoMode]);

  useEffect(() => {
    if (!isDemoMode) {
      localStorage.setItem(PROD_ISSUES_KEY, JSON.stringify(issues));
      localStorage.setItem(PROD_INCIDENTS_KEY, JSON.stringify(incidents));
      localStorage.setItem(PROD_EVENTS_KEY, JSON.stringify(events));
      localStorage.setItem(PROD_NOTIFS_KEY, JSON.stringify(notifications));
      localStorage.setItem(PROD_VOLUNTEERS_KEY, JSON.stringify(volunteerOpportunities));
    }
  }, [issues, incidents, events, notifications, volunteerOpportunities, isDemoMode]);

  const resetDemoData = () => {
    if (!isDemoMode) return;
    setIssues(DEMO_INITIAL_ISSUES);
    setIncidents(DEMO_INITIAL_INCIDENTS);
    setEvents(DEMO_INITIAL_EVENTS);
    setExternalSignals(DEMO_EXTERNAL_SIGNALS);
    setVolunteerOpportunities(DEMO_VOLUNTEER_OPPORTUNITIES);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const enrollVolunteerOpportunity = (opportunityId: string) => {
    setVolunteerOpportunities((prev) =>
      prev.map((v) =>
        v.id === opportunityId
          ? { ...v, enrolledVolunteers: v.enrolledVolunteers + 1 }
          : v
      )
    );
  };

  const addReport = async (input: AddReportInput) => {
    // SERVER-SIDE INDIA GEOGRAPHIC VALIDATION
    if (input.location.countryCode && input.location.countryCode !== 'IN') {
      throw new Error('🇮🇳 CivicForge currently operates only for civic issues within India.');
    }

    setIsAnalyzing(true);
    try {
      const aiResult = await analyzeReportWithBedrock(input.title, input.description, input.category);

      const issueId = `issue-${Date.now()}`;
      const now = new Date().toISOString();

      const newIssue: Issue = {
        id: issueId,
        title: input.title,
        description: input.description,
        category: aiResult.category,
        location: {
          ...input.location,
          country: 'India',
          countryCode: 'IN',
        },
        photoUrls: input.photoUrls,
        status: 'UNDER_REVIEW',
        severity: aiResult.severity,
        department: aiResult.recommendedDepartment,
        reporterId: input.reporterId,
        reporterName: input.reporterName,
        createdAt: now,
        updatedAt: now,
      };

      const potentialMatches = findPotentiallyRelatedIncidents(newIssue, incidents, issues);

      let targetIncident: CivicIncident | undefined = undefined;

      if (potentialMatches.length > 0 && potentialMatches[0].confidencePercentage >= 55) {
        const topMatch = potentialMatches[0];
        const existingIncident = incidents.find((inc) => inc.id === topMatch.incidentId);

        if (existingIncident) {
          newIssue.incidentId = existingIncident.id;

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
        const nextNumber = incidents.length > 0 ? Math.max(...incidents.map((i) => i.incidentNumber)) + 1 : 1;
        const newIncidentId = `incident-${nextNumber}`;

        newIssue.incidentId = newIncidentId;

        const newIncident: CivicIncident = {
          id: newIncidentId,
          incidentNumber: nextNumber,
          title: `Possible ${newIssue.category} Incident near ${input.location.address || 'Reported Location'}`,
          summary: aiResult.summary,
          category: newIssue.category,
          severity: newIssue.severity,
          status: 'UNDER_REVIEW',
          reportIds: [newIssue.id],
          primaryLocation: {
            ...input.location,
            country: 'India',
            countryCode: 'IN',
          },
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

      const newEvent: IssueEvent = {
        id: `event-${Date.now()}`,
        issueId: newIssue.id,
        incidentId: targetIncident?.id,
        actorId: input.reporterId,
        actorName: input.reporterName,
        actorRole: 'CITIZEN',
        action: 'Report Filed & Verified (India)',
        newStatus: 'UNDER_REVIEW',
        note: `AI Analysis complete (${aiResult.severity} severity). Grouped under Possible Incident #${targetIncident?.incidentNumber}.`,
        timestamp: now,
      };

      setEvents((prev) => [newEvent, ...prev]);

      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          userId: input.reporterId,
          issueId: newIssue.id,
          incidentId: targetIncident?.id,
          title: 'Report Received & Verified',
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

          setIssues((issueList) =>
            issueList.map((iss) => (inc.reportIds.includes(iss.id) ? { ...iss, status: newStatus, updatedAt: now } : iss))
          );

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
        externalSignals,
        volunteerOpportunities,
        isAnalyzing,
        addReport,
        updateIncidentStatus,
        assignIncident,
        addIncidentNote,
        markNotificationRead,
        enrollVolunteerOpportunity,
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
