import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Issue,
  CivicIncident,
  IssueEvent,
  Notification,
  IssueStatus,
  IssueCategory,
  Location,
  ExternalCivicSignal,
  CivicTask,
  VolunteerApplication,
  VolunteerCheckIn,
  VolunteerActivity,
  CivicPost,
  Comment,
  ContributorCredit,
  User,
  ContributionStats
} from '../types';
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
  volunteersNeeded?: number;
}

interface CreateTaskInput {
  incidentId: string;
  title: string;
  description: string;
  workType: string;
  location: Location;
  date: string;
  startTime: string;
  expectedDuration: string;
  volunteersNeeded: number;
  requiredSkills?: string[];
  safetyInstructions?: string;
  authorityId: string;
  authorityName: string;
}

interface SubmitProofInput {
  applicationId: string;
  taskId: string;
  volunteerId: string;
  volunteerName: string;
  workDescription: string;
  beforePhotoUrl?: string;
  afterPhotoUrl: string;
  hoursSpent: number;
  location: Location;
}

interface DataContextType {
  issues: Issue[];
  incidents: CivicIncident[];
  events: IssueEvent[];
  notifications: Notification[];
  externalSignals: ExternalCivicSignal[];
  tasks: CivicTask[];
  applications: VolunteerApplication[];
  checkIns: VolunteerCheckIn[];
  activities: VolunteerActivity[];
  posts: CivicPost[];
  comments: Comment[];
  credits: ContributorCredit[];
  usersMap: Record<string, User>;
  isAnalyzing: boolean;

  addReport: (input: AddReportInput) => Promise<{ issue: Issue; incident?: CivicIncident; aiConfidence: number }>;
  updateIncidentStatus: (incidentId: string, newStatus: IssueStatus, actorName: string, note?: string) => void;
  assignIncident: (incidentId: string, department: string, officerName?: string) => void;
  addIncidentNote: (incidentId: string, note: string, actorName: string) => void;
  markNotificationRead: (notificationId: string) => void;

  createCivicTask: (input: CreateTaskInput) => CivicTask;
  applyForTask: (taskId: string) => VolunteerApplication;
  cancelVolunteerApplication: (applicationId: string) => void;
  checkInTask: (applicationId: string, latitude: number, longitude: number) => VolunteerCheckIn;
  submitTaskProofOfWork: (input: SubmitProofInput) => VolunteerActivity;
  verifyVolunteerActivity: (activityId: string, authorityId: string, authorityName: string, action: 'VERIFY' | 'REJECT') => void;
  addPostComment: (postId: string, text: string) => Comment;
  creditContributor: (activityId: string, recipientUserId: string, recipientUserName: string, message: string) => ContributorCredit;
  togglePostLike: (postId: string) => void;
  getTaskCapacityStats: (taskId: string) => { needed: number; registered: number; remaining: number; isFull: boolean };
  getTopContributors: () => { user: User; stats: ContributionStats }[];
}

const REAL_ISSUES_KEY = 'civicforge_real_issues';
const REAL_INCIDENTS_KEY = 'civicforge_real_incidents';
const REAL_EVENTS_KEY = 'civicforge_real_events';
const REAL_NOTIFS_KEY = 'civicforge_real_notifications';
const REAL_TASKS_KEY = 'civicforge_real_tasks';
const REAL_APPLICATIONS_KEY = 'civicforge_real_applications';
const REAL_CHECKINS_KEY = 'civicforge_real_checkins';
const REAL_ACTIVITIES_KEY = 'civicforge_real_activities';
const REAL_POSTS_KEY = 'civicforge_real_posts';
const REAL_COMMENTS_KEY = 'civicforge_real_comments';
const REAL_CREDITS_KEY = 'civicforge_real_credits';
const REAL_USERS_KEY = 'civicforge_real_users';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [issues, setIssues] = useState<Issue[]>(() => {
    const saved = localStorage.getItem(REAL_ISSUES_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [incidents, setIncidents] = useState<CivicIncident[]>(() => {
    const saved = localStorage.getItem(REAL_INCIDENTS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [events, setEvents] = useState<IssueEvent[]>(() => {
    const saved = localStorage.getItem(REAL_EVENTS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem(REAL_NOTIFS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [externalSignals, setExternalSignals] = useState<ExternalCivicSignal[]>([]);

  const [tasks, setTasks] = useState<CivicTask[]>(() => {
    const saved = localStorage.getItem(REAL_TASKS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [applications, setApplications] = useState<VolunteerApplication[]>(() => {
    const saved = localStorage.getItem(REAL_APPLICATIONS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [checkIns, setCheckIns] = useState<VolunteerCheckIn[]>(() => {
    const saved = localStorage.getItem(REAL_CHECKINS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [activities, setActivities] = useState<VolunteerActivity[]>(() => {
    const saved = localStorage.getItem(REAL_ACTIVITIES_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [posts, setPosts] = useState<CivicPost[]>(() => {
    const saved = localStorage.getItem(REAL_POSTS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem(REAL_COMMENTS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [credits, setCredits] = useState<ContributorCredit[]>(() => {
    const saved = localStorage.getItem(REAL_CREDITS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [usersMap, setUsersMap] = useState<Record<string, User>>(() => {
    const saved = localStorage.getItem(REAL_USERS_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Sync currentUser into usersMap if logged in
  useEffect(() => {
    if (currentUser) {
      setUsersMap((prev) => ({ ...prev, [currentUser.id]: currentUser }));
    }
  }, [currentUser]);

  // Real Database Persistence
  useEffect(() => {
    localStorage.setItem(REAL_ISSUES_KEY, JSON.stringify(issues));
    localStorage.setItem(REAL_INCIDENTS_KEY, JSON.stringify(incidents));
    localStorage.setItem(REAL_EVENTS_KEY, JSON.stringify(events));
    localStorage.setItem(REAL_NOTIFS_KEY, JSON.stringify(notifications));
    localStorage.setItem(REAL_TASKS_KEY, JSON.stringify(tasks));
    localStorage.setItem(REAL_APPLICATIONS_KEY, JSON.stringify(applications));
    localStorage.setItem(REAL_CHECKINS_KEY, JSON.stringify(checkIns));
    localStorage.setItem(REAL_ACTIVITIES_KEY, JSON.stringify(activities));
    localStorage.setItem(REAL_POSTS_KEY, JSON.stringify(posts));
    localStorage.setItem(REAL_COMMENTS_KEY, JSON.stringify(comments));
    localStorage.setItem(REAL_CREDITS_KEY, JSON.stringify(credits));
    localStorage.setItem(REAL_USERS_KEY, JSON.stringify(usersMap));
  }, [issues, incidents, events, notifications, tasks, applications, checkIns, activities, posts, comments, credits, usersMap]);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const addReport = async (input: AddReportInput) => {
    if (!currentUser) throw new Error('You must be signed in to submit a civic report.');

    if (input.location.countryCode && input.location.countryCode !== 'IN') {
      throw new Error('🇮🇳 CivicForge currently operates only for civic issues within India.');
    }

    setIsAnalyzing(true);
    try {
      const aiResult = await analyzeReportWithBedrock(input.title, input.description, input.category);

      const issueId = `issue-${Date.now()}`;
      const now = new Date().toISOString();

      const vNeeded = input.volunteersNeeded ?? 2;

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
        reporterId: currentUser.id,
        reporterName: currentUser.name,
        volunteersNeeded: vNeeded,
        volunteersJoined: 0,
        joinedVolunteerIds: [],
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

      // Automatically create a corresponding volunteer task for this submitted issue
      const newTask: CivicTask = {
        id: `task-issue-${newIssue.id}`,
        incidentId: targetIncident?.id || `incident-${Date.now()}`,
        title: input.title,
        description: input.description,
        workType: input.category,
        location: {
          ...input.location,
          country: 'India',
          countryCode: 'IN',
        },
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00 AM',
        expectedDuration: '2 Hours',
        volunteersNeeded: vNeeded,
        enrolledVolunteersCount: 0,
        status: 'OPEN',
        createdByAuthorityId: currentUser.id,
        createdByAuthorityName: currentUser.name,
        createdAt: now,
      };

      setTasks((prev) => [newTask, ...prev]);
      setIssues((prev) => [newIssue, ...prev]);

      const newEvent: IssueEvent = {
        id: `event-${Date.now()}`,
        issueId: newIssue.id,
        incidentId: targetIncident?.id,
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: currentUser.role,
        action: 'Report Filed & Verified (India)',
        newStatus: 'UNDER_REVIEW',
        note: `AI Analysis complete (${aiResult.severity} severity). Grouped under Possible Incident #${targetIncident?.incidentNumber}.`,
        timestamp: now,
      };

      setEvents((prev) => [newEvent, ...prev]);

      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          userId: currentUser.id,
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
    if (!currentUser) return;
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
              actorId: currentUser.id,
              actorName: currentUser.name,
              actorRole: 'AUTHORITY',
              action: `Status changed from ${prevStatus} to ${newStatus}`,
              previousStatus: prevStatus,
              newStatus,
              note: note || `Incident status updated by ${actorName}`,
              timestamp: now,
            },
            ...eventList,
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
    if (!currentUser) return;
    const now = new Date().toISOString();
    setEvents((prev) => [
      {
        id: `event-${Date.now()}`,
        incidentId,
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: 'AUTHORITY',
        action: 'Officer Note Added',
        note,
        timestamp: now,
      },
      ...prev,
    ]);
  };

  const createCivicTask = (input: CreateTaskInput): CivicTask => {
    if (!currentUser) throw new Error('Authority login required.');
    const taskId = `task-${Date.now()}`;
    const now = new Date().toISOString();

    const newTask: CivicTask = {
      id: taskId,
      incidentId: input.incidentId,
      title: input.title,
      description: input.description,
      workType: input.workType,
      location: input.location,
      date: input.date,
      startTime: input.startTime,
      expectedDuration: input.expectedDuration,
      volunteersNeeded: input.volunteersNeeded,
      enrolledVolunteersCount: 0,
      requiredSkills: input.requiredSkills || [],
      safetyInstructions: input.safetyInstructions || '',
      status: 'OPEN',
      createdByAuthorityId: currentUser.id,
      createdByAuthorityName: currentUser.name,
      createdAt: now,
    };

    setTasks((prev) => [newTask, ...prev]);

    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === input.incidentId
          ? { ...inc, taskIds: [...(inc.taskIds || []), taskId], updatedAt: now }
          : inc
      )
    );

    setEvents((prev) => [
      {
        id: `event-${Date.now()}`,
        incidentId: input.incidentId,
        taskId,
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: 'AUTHORITY',
        action: 'Verified Civic Task Created',
        note: `Authority created volunteer task with ${input.volunteersNeeded} spots: "${input.title}"`,
        timestamp: now,
      },
      ...prev,
    ]);

    return newTask;
  };

  const getTaskCapacityStats = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    const needed = task?.volunteersNeeded || 0;

    const activeApps = applications.filter(
      (a) => a.taskId === taskId && a.status !== 'CANCELLED' && a.status !== 'DECLINED'
    );
    const registered = activeApps.length;
    const remaining = Math.max(0, needed - registered);
    const isFull = registered >= needed;

    return { needed, registered, remaining, isFull };
  };

  const applyForTask = (taskId: string): VolunteerApplication => {
    if (!currentUser) {
      throw new Error('Please sign in or register to volunteer.');
    }

    const task = tasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found');

    const capacity = getTaskCapacityStats(taskId);
    if (capacity.isFull) {
      throw new Error('Volunteer spots are full for this task.');
    }

    // Prevent duplicate active registration
    const existing = applications.find(
      (a) => a.taskId === taskId && a.userId === currentUser.id && a.status !== 'CANCELLED' && a.status !== 'DECLINED'
    );
    if (existing) {
      throw new Error('You are already registered for this task.');
    }

    const appId = `app-${Date.now()}`;
    const now = new Date().toISOString();

    const newApp: VolunteerApplication = {
      id: appId,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      taskId,
      taskTitle: task.title,
      incidentId: task.incidentId,
      appliedTimestamp: now,
      status: 'ACCEPTED',
    };

    setApplications((prev) => [newApp, ...prev]);

    // Update enrolled count on task
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newCount = t.enrolledVolunteersCount + 1;
          const newStatus = newCount >= t.volunteersNeeded ? 'FULL' : t.status;
          return { ...t, enrolledVolunteersCount: newCount, status: newStatus };
        }
        return t;
      })
    );

    // Update matching issue volunteersJoined and joinedVolunteerIds
    setIssues((prev) =>
      prev.map((iss) => {
        if (`task-issue-${iss.id}` === taskId || iss.id === taskId) {
          const joinedIds = iss.joinedVolunteerIds || [];
          if (!joinedIds.includes(currentUser.id)) {
            return {
              ...iss,
              volunteersJoined: (iss.volunteersJoined || 0) + 1,
              joinedVolunteerIds: [...joinedIds, currentUser.id],
            };
          }
        }
        return iss;
      })
    );

    // Send Real Notification to authenticated volunteer
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        userId: currentUser.id,
        taskId,
        title: `Registered for "${task.title}"`,
        message: `You are registered! Scheduled for ${task.date} at ${task.startTime}. Location: ${task.location.formattedAddress || 'Task Site'}.`,
        type: 'APPLICATION_UPDATE',
        read: false,
        createdAt: now,
      },
      ...prev,
    ]);

    return newApp;
  };

  const cancelVolunteerApplication = (applicationId: string) => {
    if (!currentUser) return;
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;

    const now = new Date().toISOString();

    setApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status: 'CANCELLED' } : a))
    );

    // Update task enrolled count & status
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === app.taskId) {
          const newCount = Math.max(0, t.enrolledVolunteersCount - 1);
          return {
            ...t,
            enrolledVolunteersCount: newCount,
            status: t.status === 'FULL' ? 'OPEN' : t.status,
          };
        }
        return t;
      })
    );

    // Real Notification for cancellation
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        userId: currentUser.id,
        taskId: app.taskId,
        title: 'Volunteer Registration Cancelled',
        message: `Your registration for "${app.taskTitle}" has been cancelled. Available spot reopened for other volunteers.`,
        type: 'APPLICATION_UPDATE',
        read: false,
        createdAt: now,
      },
      ...prev,
    ]);
  };

  const checkInTask = (applicationId: string, latitude: number, longitude: number): VolunteerCheckIn => {
    if (!currentUser) throw new Error('Authentication required.');
    const app = applications.find((a) => a.id === applicationId);
    if (!app) throw new Error('Application not found');

    const checkInId = `checkin-${Date.now()}`;
    const now = new Date().toISOString();

    const checkIn: VolunteerCheckIn = {
      id: checkInId,
      applicationId,
      taskId: app.taskId,
      userId: currentUser.id,
      checkInTimestamp: now,
      latitude,
      longitude,
    };

    setCheckIns((prev) => [checkIn, ...prev]);

    setApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId
          ? {
              ...a,
              status: 'CHECKED_IN',
              checkInTimestamp: now,
              checkInLocation: {
                latitude,
                longitude,
                country: 'India',
                countryCode: 'IN',
              },
            }
          : a
      )
    );

    return checkIn;
  };

  const submitTaskProofOfWork = (input: SubmitProofInput): VolunteerActivity => {
    if (!currentUser) throw new Error('Authentication required.');

    const app = applications.find((a) => a.id === input.applicationId);
    if (!app || app.userId !== currentUser.id) {
      throw new Error('Only the registered volunteer can submit proof of work for this task.');
    }

    const task = tasks.find((t) => t.id === input.taskId);
    if (!task) throw new Error('Task not found');

    const activityId = `act-${Date.now()}`;
    const now = new Date().toISOString();

    const newActivity: VolunteerActivity = {
      id: activityId,
      applicationId: input.applicationId,
      taskId: input.taskId,
      taskTitle: task.title,
      incidentId: task.incidentId,
      volunteerId: currentUser.id,
      volunteerName: currentUser.name,
      workDescription: input.workDescription,
      beforePhotoUrl: input.beforePhotoUrl,
      afterPhotoUrl: input.afterPhotoUrl,
      completionTimestamp: now,
      status: 'SUBMITTED_FOR_VERIFICATION',
      hoursSpent: input.hoursSpent,
      location: input.location,
    };

    setActivities((prev) => [newActivity, ...prev]);

    setApplications((prev) =>
      prev.map((a) => (a.id === input.applicationId ? { ...a, status: 'COMPLETED' } : a))
    );

    setEvents((prev) => [
      {
        id: `event-${Date.now()}`,
        incidentId: task.incidentId,
        taskId: task.id,
        activityId,
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: 'VOLUNTEER',
        action: 'Proof of Work Submitted',
        note: `Volunteer submitted proof of work for authority verification.`,
        timestamp: now,
      },
      ...prev,
    ]);

    return newActivity;
  };

  const verifyVolunteerActivity = (
    activityId: string,
    authorityId: string,
    authorityName: string,
    action: 'VERIFY' | 'REJECT'
  ) => {
    if (!currentUser) return;
    const activity = activities.find((a) => a.id === activityId);
    if (!activity) return;

    const now = new Date().toISOString();

    if (action === 'VERIFY') {
      const updatedActivity: VolunteerActivity = {
        ...activity,
        status: 'VERIFIED',
        verifiedByAuthorityId: currentUser.id,
        verifiedByAuthorityName: currentUser.name,
        verifiedAt: now,
      };

      setActivities((prev) => prev.map((a) => (a.id === activityId ? updatedActivity : a)));

      setApplications((prev) =>
        prev.map((app) => (app.id === activity.applicationId ? { ...app, status: 'VERIFIED' } : app))
      );

      const postId = `post-${Date.now()}`;
      const newPost: CivicPost = {
        id: postId,
        activityId,
        volunteerId: activity.volunteerId,
        volunteerName: activity.volunteerName,
        title: `Verified Action: ${activity.taskTitle}`,
        description: activity.workDescription,
        location: activity.location,
        beforePhotoUrl: activity.beforePhotoUrl,
        afterPhotoUrl: activity.afterPhotoUrl,
        reactionCount: 1,
        commentCount: 0,
        createdAt: now,
      };

      setPosts((prev) => [newPost, ...prev]);

      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          userId: activity.volunteerId,
          taskId: activity.taskId,
          title: 'Proof of Work Verified!',
          message: `Your volunteer task "${activity.taskTitle}" was verified by ${currentUser.name}. Contribution stats updated!`,
          type: 'STATUS_CHANGED',
          read: false,
          createdAt: now,
        },
        ...prev,
      ]);
    } else {
      setActivities((prev) =>
        prev.map((a) => (a.id === activityId ? { ...a, status: 'REJECTED' } : a))
      );
    }
  };

  const addPostComment = (postId: string, text: string): Comment => {
    if (!currentUser) throw new Error('Authentication required to comment.');
    const commentId = `comm-${Date.now()}`;
    const now = new Date().toISOString();

    const newComment: Comment = {
      id: commentId,
      postId,
      userId: currentUser.id,
      userName: currentUser.name,
      text,
      timestamp: now,
    };

    setComments((prev) => [...prev, newComment]);

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p))
    );

    return newComment;
  };

  const creditContributor = (
    activityId: string,
    recipientUserId: string,
    recipientUserName: string,
    message: string
  ): ContributorCredit => {
    if (!currentUser) throw new Error('Authentication required.');

    const creditId = `credit-${Date.now()}`;
    const now = new Date().toISOString();

    const newCredit: ContributorCredit = {
      id: creditId,
      giverUserId: currentUser.id,
      giverUserName: currentUser.name,
      recipientUserId,
      recipientUserName,
      activityId,
      message,
      timestamp: now,
    };

    setCredits((prev) => [newCredit, ...prev]);

    return newCredit;
  };

  const togglePostLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const liked = !p.userLiked;
          return {
            ...p,
            userLiked: liked,
            reactionCount: liked ? p.reactionCount + 1 : p.reactionCount - 1,
          };
        }
        return p;
      })
    );
  };

  const getTopContributors = () => {
    return Object.values(usersMap)
      .filter((u) => u.role === 'CITIZEN' || u.isVolunteer)
      .map((u) => {
        const userActs = activities.filter((a) => a.volunteerId === u.id && a.status === 'VERIFIED');
        const userCreds = credits.filter((c) => c.recipientUserId === u.id);
        const totalHours = userActs.reduce((acc, curr) => acc + curr.hoursSpent, 0);

        const computedStats: ContributionStats = {
          verifiedActivitiesCount: userActs.length,
          volunteerHours: totalHours,
          tasksCompleted: userActs.length,
          areasHelpedCount: userActs.length > 0 ? 1 : 0,
          incidentsSupportedCount: userActs.length,
          creditsReceivedCount: userCreds.length,
        };

        return { user: u, stats: computedStats };
      })
      .sort(
        (a, b) =>
          b.stats.verifiedActivitiesCount * 10 +
          b.stats.volunteerHours * 2 +
          b.stats.creditsReceivedCount -
          (a.stats.verifiedActivitiesCount * 10 +
            a.stats.volunteerHours * 2 +
            a.stats.creditsReceivedCount)
      );
  };

  return (
    <DataContext.Provider
      value={{
        issues,
        incidents,
        events,
        notifications,
        externalSignals,
        tasks,
        applications,
        checkIns,
        activities,
        posts,
        comments,
        credits,
        usersMap,
        isAnalyzing,
        addReport,
        updateIncidentStatus,
        assignIncident,
        addIncidentNote,
        markNotificationRead,
        createCivicTask,
        applyForTask,
        cancelVolunteerApplication,
        checkInTask,
        submitTaskProofOfWork,
        verifyVolunteerActivity,
        addPostComment,
        creditContributor,
        togglePostLike,
        getTaskCapacityStats,
        getTopContributors,
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
