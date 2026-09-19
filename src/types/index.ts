export type UserRole = 'CITIZEN' | 'AUTHORITY' | 'ADMIN';

export type IssueStatus = 'REPORTED' | 'UNDER_REVIEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';

export type IssueSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IssueCategory =
  | 'Road Infrastructure'
  | 'Water & Sewerage'
  | 'Sanitation & Waste'
  | 'Electricity & Lighting'
  | 'Public Safety'
  | 'Parks & Environment'
  | 'Other';

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  district?: string;
}

export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
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
  incidentId?: string; // Optional association with a CivicIncident
  aiAnalysisId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RelationshipSignals {
  distanceMeters: number;
  distanceScore: number;       // 0.0 to 1.0 (Haversine distance weight)
  categoryMatchScore: number;   // 0.0 to 1.0 (Category match weight)
  textSimilarityScore: number;  // 0.0 to 1.0 (Text token Jaccard/Cosine weight)
  temporalScore: number;        // 0.0 to 1.0 (Hours difference weight)
  compositeScore: number;       // Weighted overall relationship confidence (0.0 to 1.0)
  explanation: string[];        // Transparent human-readable explanations ("420m apart", "Same category", etc.)
}

export interface RelatedIncidentCandidate {
  incidentId: string;
  incidentTitle: string;
  confidencePercentage: number;
  signals: RelationshipSignals;
}

export interface CivicIncident {
  id: string;
  incidentNumber: number; // e.g. 42 -> Possible Civic Incident #42
  title: string;
  summary: string;
  category: IssueCategory;
  severity: IssueSeverity;
  status: IssueStatus;
  reportIds: string[]; // List of original citizen report IDs associated with this incident
  primaryLocation: Location;
  boundingBox?: BoundingBox;
  aiConfidence: number; // Percentage (e.g. 91)
  relationshipSignals?: RelationshipSignals;
  assignedDepartment: string;
  assignedTo?: string;
  affectedCitizensCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IssueEvent {
  id: string;
  issueId?: string;
  incidentId?: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  previousStatus?: IssueStatus;
  newStatus?: IssueStatus;
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
  confidence: number; // e.g. 91
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
  title: string;
  message: string;
  type: 'REPORT_RECEIVED' | 'REPORT_REVIEWED' | 'INCIDENT_ASSOCIATED' | 'STATUS_CHANGED' | 'RESOLVED';
  read: boolean;
  createdAt: string;
}
