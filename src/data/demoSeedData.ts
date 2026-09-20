import {
  Issue,
  CivicIncident,
  IssueEvent,
  User,
  ExternalCivicSignal,
  CivicTask,
  VolunteerApplication,
  VolunteerActivity,
  CivicPost,
  Comment,
  ContributorCredit
} from '../types';

export const DEMO_USERS: Record<string, User> = {};
export const DEMO_INITIAL_ISSUES: Issue[] = [];
export const DEMO_INITIAL_INCIDENTS: CivicIncident[] = [];
export const DEMO_CIVIC_TASKS: CivicTask[] = [];
export const DEMO_VOLUNTEER_APPLICATIONS: VolunteerApplication[] = [];
export const DEMO_VOLUNTEER_ACTIVITIES: VolunteerActivity[] = [];
export const DEMO_CIVIC_POSTS: CivicPost[] = [];
export const DEMO_COMMENTS: Comment[] = [];
export const DEMO_CONTRIBUTOR_CREDITS: ContributorCredit[] = [];
export const DEMO_INITIAL_EVENTS: IssueEvent[] = [];
export const DEMO_EXTERNAL_SIGNALS: ExternalCivicSignal[] = [];
