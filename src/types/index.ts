export type UserRole = 'CITIZEN' | 'VOLUNTEER' | 'AUTHORITY' | 'ADMIN';

export type IssueStatus = 'REPORTED' | 'UNDER_REVIEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';

export type IssueSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type ApplicationStatus = 'APPLIED' | 'ACCEPTED' | 'CHECKED_IN' | 'COMPLETED' | 'VERIFIED' | 'DECLINED' | 'CANCELLED';

export type ActivityStatus = 'SUBMITTED_FOR_VERIFICATION' | 'VERIFIED' | 'REJECTED';

export type IssueCategory =
  | 'Roads & Potholes'
  | 'Garbage & Waste'
  | 'Water Supply'
  | 'Drainage & Sewage'
  | 'Flooding & Waterlogging'
  | 'Streetlights'
  | 'Traffic & Footpaths'
  | 'Public Safety & Infrastructure'
  | 'Parks & Public Spaces'
  | 'Electricity Infrastructure'
  | 'Other Municipal Issues';

export interface Location {
  latitude: number;
  longitude: number;
  formattedAddress?: string;
  address?: string;
  locality?: string;
  city?: string;
  district?: string;
  state?: string;
  country: string;       // Must be "India"
  countryCode: string;   // Must be "IN"
}

export interface ContributionStats {
  verifiedActivitiesCount: number;
  volunteerHours: number;
  tasksCompleted: number;
  areasHelpedCount: number;
  incidentsSupportedCount: number;
  creditsReceivedCount: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profilePhoto?: string;
  phone?: string;
  department?: string;
  city?: string;
  state?: string;
  district?: string;
  isVolunteer: boolean;
  volunteerStatus: 'ACTIVE' | 'INACTIVE';
  stats: ContributionStats;
  createdAt: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  location: Location;
  photoUrls: string[];
  status: IssueStatus;
  severity: IssueSeverity;
  department: string;
  reporterId: string;
  reporterName: string;
  incidentId?: string;
  aiAnalysisId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RelationshipSignals {
  distanceMeters: number;
  distanceScore: number;
  categoryMatchScore: number;
  textSimilarityScore: number;
  temporalScore: number;
  compositeScore: number;
  explanation: string[];
}

export interface RelatedIncidentCandidate {
  incidentId: string;
  incidentTitle: string;
  confidencePercentage: number;
  signals: RelationshipSignals;
}

export interface CivicIncident {
  id: string;
  incidentNumber: number;
  title: string;
  summary: string;
  category: IssueCategory;
  severity: IssueSeverity;
  status: IssueStatus;
  reportIds: string[];
  externalSignalIds?: string[];
  taskIds?: string[];
  primaryLocation: Location;
  aiConfidence: number;
  relationshipSignals?: RelationshipSignals;
  assignedDepartment: string;
  assignedTo?: string;
  affectedCitizensCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CivicTask {
  id: string;
  incidentId: string;
  title: string;
  description: string;
  workType: string; // e.g. "Waste Cleanup", "Pothole Audit", "Evidence Collection"
  location: Location;
  date: string; // e.g. "2026-09-26"
  startTime: string; // e.g. "08:00 AM"
  expectedDuration: string; // e.g. "2 Hours"
  volunteersNeeded: number;
  enrolledVolunteersCount: number;
  requiredSkills?: string[];
  safetyInstructions?: string;
  status: TaskStatus;
  createdByAuthorityId: string;
  createdByAuthorityName: string;
  createdAt: string;
}

export interface VolunteerApplication {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  taskId: string;
  taskTitle: string;
  incidentId: string;
  appliedTimestamp: string;
  status: ApplicationStatus;
  checkInTimestamp?: string;
  checkInLocation?: Location;
}

export interface VolunteerCheckIn {
  id: string;
  applicationId: string;
  taskId: string;
  userId: string;
  checkInTimestamp: string;
  latitude: number;
  longitude: number;
}

export interface VolunteerActivity {
  id: string;
  applicationId: string;
  taskId: string;
  taskTitle: string;
  incidentId: string;
  volunteerId: string;
  volunteerName: string;
  volunteerPhoto?: string;
  workDescription: string;
  beforePhotoUrl?: string;
  afterPhotoUrl: string;
  videoUrl?: string;
  completionTimestamp: string;
  status: ActivityStatus;
  verifiedByAuthorityId?: string;
  verifiedByAuthorityName?: string;
  verifiedAt?: string;
  hoursSpent: number;
  location: Location;
}

export interface CivicPost {
  id: string;
  activityId: string;
  volunteerId: string;
  volunteerName: string;
  volunteerPhoto?: string;
  title: string;
  description: string;
  location: Location;
  beforePhotoUrl?: string;
  afterPhotoUrl: string;
  reactionCount: number;
  commentCount: number;
  userLiked?: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  text: string;
  timestamp: string;
}

export interface ContributorCredit {
  id: string;
  giverUserId: string;
  giverUserName: string;
  recipientUserId: string;
  recipientUserName: string;
  activityId: string;
  message: string;
  timestamp: string;
}

export interface IssueEvent {
  id: string;
  issueId?: string;
  incidentId?: string;
  taskId?: string;
  activityId?: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  previousStatus?: string;
  newStatus?: string;
  note?: string;
  timestamp: string;
}

export interface AIAnalysis {
  id: string;
  issueId: string;
  category: IssueCategory;
  severity: IssueSeverity;
  recommendedDepartment: string;
  summary: string;
  possibleIncidentIds: string[];
  confidence: number;
  relatedCandidates: RelatedIncidentCandidate[];
  processedAt: string;
  modelUsed: string;
  status: 'SUCCESS' | 'LOW_CONFIDENCE' | 'FALLBACK' | 'ERROR';
}

export interface Evidence {
  id: string;
  issueId: string;
  s3Key: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  issueId?: string;
  incidentId?: string;
  taskId?: string;
  title: string;
  message: string;
  type: 'REPORT_RECEIVED' | 'REPORT_REVIEWED' | 'INCIDENT_ASSOCIATED' | 'TASK_CREATED' | 'APPLICATION_UPDATE' | 'STATUS_CHANGED' | 'RESOLVED';
  read: boolean;
  createdAt: string;
}

export interface ExternalCivicSignal {
  id: string;
  sourceName: string;
  sourceType: 'OPEN_DATA_API' | 'PUBLIC_SOCIAL_SIGNAL' | 'MUNICIPAL_FEED';
  title: string;
  content: string;
  category: IssueCategory;
  location: Location;
  timestamp: string;
  originalUrl?: string;
  verifiedIndiaLocation: boolean;
}
