import { Issue, CivicIncident, IssueEvent, Notification, User } from '../types';

export const DEMO_USERS: Record<string, User> = {
  citizen1: {
    id: 'user-citizen-1',
    email: 'sarah.jenkins@example.com',
    name: 'Sarah Jenkins',
    role: 'CITIZEN',
    createdAt: '2026-09-01T08:00:00Z',
  },
  citizen2: {
    id: 'user-citizen-2',
    email: 'marcus.chen@example.com',
    name: 'Marcus Chen',
    role: 'CITIZEN',
    createdAt: '2026-09-02T09:30:00Z',
  },
  citizen3: {
    id: 'user-citizen-3',
    email: 'elena.rodriguez@example.com',
    name: 'Elena Rodriguez',
    role: 'CITIZEN',
    createdAt: '2026-09-03T11:15:00Z',
  },
  authority1: {
    id: 'user-auth-1',
    email: 'officer.davis@civic.gov',
    name: 'Captain Robert Davis',
    role: 'AUTHORITY',
    department: 'Road Maintenance Division',
    createdAt: '2026-08-15T10:00:00Z',
  }
};

// Realistic SVG Data URIs for evidence photos
const SVG_PHOTO_POTHOLE_1 = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23334155"/><path d="M150 220 Q 250 150 400 240 Q 480 300 300 320 Z" fill="%230f172a"/><circle cx="280" cy="230" r="45" fill="%231e293b"/><text x="300" y="80" fill="%23f8fafc" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">EVIDENCE PHOTO: Severe Asphalt Collapse</text><text x="300" y="370" fill="%2394a3b8" font-family="sans-serif" font-size="14" text-anchor="middle">Main St %26 4th Ave • Depth ~12cm</text></svg>';

const SVG_PHOTO_POTHOLE_2 = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23475569"/><ellipse cx="300" cy="210" rx="180" ry="90" fill="%231e293b"/><path d="M220 180 L380 240 M240 250 L360 170" stroke="%23dc2626" stroke-width="4"/><text x="300" y="70" fill="%23f8fafc" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">EVIDENCE PHOTO: Road Crater Hazard</text><text x="300" y="370" fill="%23cbd5e1" font-family="sans-serif" font-size="14" text-anchor="middle">Main St Westbound Lane</text></svg>';

const SVG_PHOTO_WATER_LEAK = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%231e3a8a"/><path d="M0 250 Q 150 200 300 250 T 600 250 L 600 400 L 0 400 Z" fill="%232563eb"/><circle cx="300" cy="220" r="15" fill="%2360a5fa"/><text x="300" y="80" fill="%23ffffff" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">EVIDENCE PHOTO: Water Pipe Burst</text><text x="300" y="360" fill="%23bfdbfe" font-family="sans-serif" font-size="14" text-anchor="middle">Elm St Sector 4 • Gushing Water</text></svg>';

export const DEMO_INITIAL_ISSUES: Issue[] = [
  {
    id: 'issue-101',
    title: 'Deep Pothole near Main St & 4th Ave',
    description: 'Large, dangerous asphalt pothole right near the Main St intersection. Multiple cars swerving abruptly. Needs urgent repair before accidents happen.',
    category: 'Road Infrastructure',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: '402 Main St, San Francisco, CA',
      district: 'District 1 - Downtown'
    },
    photoUrls: [SVG_PHOTO_POTHOLE_1],
    status: 'UNDER_REVIEW',
    severity: 'HIGH',
    department: 'Road Maintenance Division',
    reporterId: DEMO_USERS.citizen1.id,
    reporterName: DEMO_USERS.citizen1.name,
    incidentId: 'incident-42',
    createdAt: '2026-09-19T06:15:00Z',
    updatedAt: '2026-09-19T06:16:00Z',
  },
  {
    id: 'issue-102',
    title: 'Hazardous Road Crater on Main St Westbound',
    description: 'Severe pavement damage in the middle of the westbound lane on Main St. At least 10 inches deep. Vehicle tires are getting damaged.',
    category: 'Road Infrastructure',
    location: {
      latitude: 37.7752,
      longitude: -122.4191,
      address: '420 Main St, San Francisco, CA',
      district: 'District 1 - Downtown'
    },
    photoUrls: [SVG_PHOTO_POTHOLE_2],
    status: 'UNDER_REVIEW',
    severity: 'HIGH',
    department: 'Road Maintenance Division',
    reporterId: DEMO_USERS.citizen2.id,
    reporterName: DEMO_USERS.citizen2.name,
    incidentId: 'incident-42',
    createdAt: '2026-09-19T07:30:00Z',
    updatedAt: '2026-09-19T07:31:00Z',
  },
  {
    id: 'issue-103',
    title: 'Vehicle Rim Damaged by Pothole on 4th Ave',
    description: 'Broke my front rim on a hidden pothole just turning off Main onto 4th Ave. Very poor visibility at night. High risk for cyclists.',
    category: 'Road Infrastructure',
    location: {
      latitude: 37.7746,
      longitude: -122.4198,
      address: '110 4th Ave, San Francisco, CA',
      district: 'District 1 - Downtown'
    },
    photoUrls: [SVG_PHOTO_POTHOLE_1],
    status: 'UNDER_REVIEW',
    severity: 'HIGH',
    department: 'Road Maintenance Division',
    reporterId: DEMO_USERS.citizen3.id,
    reporterName: DEMO_USERS.citizen3.name,
    incidentId: 'incident-42',
    createdAt: '2026-09-19T08:45:00Z',
    updatedAt: '2026-09-19T08:46:00Z',
  },
  {
    id: 'issue-104',
    title: 'Water Main Pipe Gushing Water on Elm St',
    description: 'Substantial water pipe burst flooding the sidewalk and parking area in front of Elm St residential buildings. Water pressure dropping.',
    category: 'Water & Sewerage',
    location: {
      latitude: 37.7812,
      longitude: -122.4110,
      address: '805 Elm St, San Francisco, CA',
      district: 'District 3 - North Bay'
    },
    photoUrls: [SVG_PHOTO_WATER_LEAK],
    status: 'ASSIGNED',
    severity: 'CRITICAL',
    department: 'Water & Sanitation Dept',
    reporterId: DEMO_USERS.citizen1.id,
    reporterName: DEMO_USERS.citizen1.name,
    incidentId: 'incident-43',
    createdAt: '2026-09-18T14:20:00Z',
    updatedAt: '2026-09-18T15:00:00Z',
  },
  {
    id: 'issue-105',
    title: 'Street Flooding & Storm Drain Overflow',
    description: 'Deep standing water overflowing onto the curb near 815 Elm St due to blocked drainage pipe.',
    category: 'Water & Sewerage',
    location: {
      latitude: 37.7815,
      longitude: -122.4114,
      address: '815 Elm St, San Francisco, CA',
      district: 'District 3 - North Bay'
    },
    photoUrls: [SVG_PHOTO_WATER_LEAK],
    status: 'ASSIGNED',
    severity: 'CRITICAL',
    department: 'Water & Sanitation Dept',
    reporterId: DEMO_USERS.citizen2.id,
    reporterName: DEMO_USERS.citizen2.name,
    incidentId: 'incident-43',
    createdAt: '2026-09-18T15:10:00Z',
    updatedAt: '2026-09-18T15:30:00Z',
  },
  {
    id: 'issue-106',
    title: 'Complete Dark Alley - Street Lights Out on 5th Ave',
    description: 'Three consecutive street light poles are non-functional between Pine and Bush on 5th Ave. Completely dark at night, raising safety concerns.',
    category: 'Electricity & Lighting',
    location: {
      latitude: 37.7890,
      longitude: -122.4040,
      address: '520 5th Ave, San Francisco, CA',
      district: 'District 2 - Central'
    },
    photoUrls: [],
    status: 'REPORTED',
    severity: 'MEDIUM',
    department: 'Power & Lighting Operations',
    reporterId: DEMO_USERS.citizen3.id,
    reporterName: DEMO_USERS.citizen3.name,
    incidentId: 'incident-44',
    createdAt: '2026-09-17T20:40:00Z',
    updatedAt: '2026-09-17T20:40:00Z',
  },
  {
    id: 'issue-107',
    title: 'Broken Light Pole Fixture Swinging Dangers',
    description: 'Lamp housing hangs loose from pole on 5th Ave. Looks ready to drop onto pedestrians in windy weather.',
    category: 'Electricity & Lighting',
    location: {
      latitude: 37.7893,
      longitude: -122.4044,
      address: '535 5th Ave, San Francisco, CA',
      district: 'District 2 - Central'
    },
    photoUrls: [],
    status: 'REPORTED',
    severity: 'HIGH',
    department: 'Power & Lighting Operations',
    reporterId: DEMO_USERS.citizen1.id,
    reporterName: DEMO_USERS.citizen1.name,
    incidentId: 'incident-44',
    createdAt: '2026-09-17T21:15:00Z',
    updatedAt: '2026-09-17T21:15:00Z',
  },
  {
    id: 'issue-108',
    title: 'Overflowing Recycling Bins at City Park',
    description: 'Public recycling containers overflowing near the East Entrance of City Park causing litter dispersal.',
    category: 'Sanitation & Waste',
    location: {
      latitude: 37.7690,
      longitude: -122.4480,
      address: 'City Park East Gate, San Francisco, CA',
      district: 'District 5 - West'
    },
    photoUrls: [],
    status: 'REPORTED',
    severity: 'LOW',
    department: 'Waste Management Bureau',
    reporterId: DEMO_USERS.citizen2.id,
    reporterName: DEMO_USERS.citizen2.name,
    createdAt: '2026-09-19T09:00:00Z',
    updatedAt: '2026-09-19T09:00:00Z',
  }
];

export const DEMO_INITIAL_INCIDENTS: CivicIncident[] = [
  {
    id: 'incident-42',
    incidentNumber: 42,
    title: 'Dangerous Road Pothole Cluster - Main St & 4th Ave',
    summary: 'A cluster of 3 independent citizen reports indicating severe asphalt collapse and deep road craters concentrated within a 140m radius around Main St and 4th Ave.',
    category: 'Road Infrastructure',
    severity: 'HIGH',
    status: 'UNDER_REVIEW',
    reportIds: ['issue-101', 'issue-102', 'issue-103'],
    primaryLocation: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: 'Main St & 4th Ave Intersection Zone',
      district: 'District 1 - Downtown'
    },
    boundingBox: {
      minLat: 37.7746,
      maxLat: 37.7752,
      minLng: -122.4198,
      maxLng: -122.4191,
    },
    aiConfidence: 91, // "AI confidence: 91%"
    relationshipSignals: {
      distanceMeters: 140,
      distanceScore: 0.95,
      categoryMatchScore: 1.0,
      textSimilarityScore: 0.84,
      temporalScore: 0.9,
      compositeScore: 0.91,
      explanation: [
        'Geographic proximity: 140m distance between report locations (95% proximity score)',
        'Exact category match: All 3 reports classified under Road Infrastructure',
        'Semantic similarity: High text overlap regarding asphalt collapse & rim damage (84% text match)',
        'Time window: All 3 reports submitted within a 2.5 hour timeframe'
      ]
    },
    assignedDepartment: 'Road Maintenance Division',
    affectedCitizensCount: 3,
    createdAt: '2026-09-19T06:15:00Z',
    updatedAt: '2026-09-19T08:46:00Z',
  },
  {
    id: 'incident-43',
    incidentNumber: 43,
    title: 'Water Pipe Burst & Street Flooding - Elm St',
    summary: 'Water pipe rupture causing sidewalk submersion and storm drain overflow reported independently by 2 residents on Elm Street.',
    category: 'Water & Sewerage',
    severity: 'CRITICAL',
    status: 'ASSIGNED',
    reportIds: ['issue-104', 'issue-105'],
    primaryLocation: {
      latitude: 37.7813,
      longitude: -122.4112,
      address: '805-815 Elm St Block',
      district: 'District 3 - North Bay'
    },
    boundingBox: {
      minLat: 37.7812,
      maxLat: 37.7815,
      minLng: -122.4114,
      maxLng: -122.4110,
    },
    aiConfidence: 88,
    relationshipSignals: {
      distanceMeters: 45,
      distanceScore: 1.0,
      categoryMatchScore: 1.0,
      textSimilarityScore: 0.78,
      temporalScore: 0.95,
      compositeScore: 0.88,
      explanation: [
        'Geographic proximity: 45m distance (100% proximity score)',
        'Exact category match: Water & Sewerage',
        'Semantic similarity: Pipe burst and standing water flooding (78% text match)',
        'Time window: Submitted 50 minutes apart'
      ]
    },
    assignedDepartment: 'Water & Sanitation Dept',
    assignedTo: 'Officer K. Vance',
    affectedCitizensCount: 2,
    createdAt: '2026-09-18T14:20:00Z',
    updatedAt: '2026-09-18T15:30:00Z',
  },
  {
    id: 'incident-44',
    incidentNumber: 44,
    title: 'Street Lighting Outage & Fixture Hazard - 5th Ave Corridor',
    summary: 'Corridor dark zone and loose swinging lamp fixture on 5th Ave between Pine and Bush.',
    category: 'Electricity & Lighting',
    severity: 'MEDIUM',
    status: 'REPORTED',
    reportIds: ['issue-106', 'issue-107'],
    primaryLocation: {
      latitude: 37.7891,
      longitude: -122.4042,
      address: '520-535 5th Ave Corridor',
      district: 'District 2 - Central'
    },
    aiConfidence: 84,
    relationshipSignals: {
      distanceMeters: 60,
      distanceScore: 0.98,
      categoryMatchScore: 1.0,
      textSimilarityScore: 0.65,
      temporalScore: 0.95,
      compositeScore: 0.84,
      explanation: [
        'Geographic proximity: 60m distance along 5th Ave corridor',
        'Exact category match: Electricity & Lighting',
        'Semantic similarity: Street light failure and loose fixture',
        'Time window: Submitted 35 minutes apart'
      ]
    },
    assignedDepartment: 'Power & Lighting Operations',
    affectedCitizensCount: 2,
    createdAt: '2026-09-17T20:40:00Z',
    updatedAt: '2026-09-17T21:15:00Z',
  }
];

export const DEMO_INITIAL_EVENTS: IssueEvent[] = [
  {
    id: 'event-1',
    issueId: 'issue-101',
    actorId: 'user-citizen-1',
    actorName: 'Sarah Jenkins',
    actorRole: 'CITIZEN',
    action: 'Report Submitted',
    newStatus: 'REPORTED',
    note: 'Initial citizen report filed with photo evidence.',
    timestamp: '2026-09-19T06:15:00Z'
  },
  {
    id: 'event-2',
    incidentId: 'incident-42',
    actorId: 'system-ai',
    actorName: 'CivicForge Engine',
    actorRole: 'ADMIN',
    action: 'Possible Incident Associated',
    newStatus: 'UNDER_REVIEW',
    note: 'Associated Issue #101, Issue #102, and Issue #103 into Possible Civic Incident #42 (AI Confidence: 91%). Human review recommended.',
    timestamp: '2026-09-19T08:50:00Z'
  }
];
