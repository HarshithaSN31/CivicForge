import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Issue: a
    .model({
      title: a.string().required(),
      description: a.string().required(),
      category: a.string().required(),
      latitude: a.float().required(),
      longitude: a.float().required(),
      address: a.string(),
      district: a.string(),
      photoUrls: a.string().array(),
      status: a.enum(['REPORTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED']),
      severity: a.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
      department: a.string().required(),
      reporterId: a.string().required(),
      reporterName: a.string().required(),
      incidentId: a.string(),
      aiAnalysisId: a.string(),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
    })
    .authorization((allow) => [allow.authenticated()]),

  CivicIncident: a
    .model({
      incidentNumber: a.integer().required(),
      title: a.string().required(),
      summary: a.string().required(),
      category: a.string().required(),
      severity: a.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
      status: a.enum(['REPORTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED']),
      reportIds: a.string().required().array(),
      primaryLatitude: a.float().required(),
      primaryLongitude: a.float().required(),
      address: a.string(),
      aiConfidence: a.integer().required(),
      assignedDepartment: a.string().required(),
      assignedTo: a.string(),
      affectedCitizensCount: a.integer().required(),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
    })
    .authorization((allow) => [allow.authenticated()]),

  IssueEvent: a
    .model({
      issueId: a.string(),
      incidentId: a.string(),
      actorId: a.string().required(),
      actorName: a.string().required(),
      actorRole: a.string().required(),
      action: a.string().required(),
      previousStatus: a.string(),
      newStatus: a.string(),
      note: a.string(),
      timestamp: a.datetime().required(),
    })
    .authorization((allow) => [allow.authenticated()]),

  AIAnalysis: a
    .model({
      issueId: a.string().required(),
      category: a.string().required(),
      severity: a.string().required(),
      recommendedDepartment: a.string().required(),
      summary: a.string().required(),
      confidence: a.integer().required(),
      modelUsed: a.string().required(),
      status: a.string().required(),
      processedAt: a.datetime().required(),
    })
    .authorization((allow) => [allow.authenticated()]),

  Evidence: a
    .model({
      issueId: a.string().required(),
      s3Key: a.string().required(),
      url: a.string().required(),
      mimeType: a.string().required(),
      sizeBytes: a.integer().required(),
      uploadedAt: a.datetime().required(),
    })
    .authorization((allow) => [allow.authenticated()]),

  Notification: a
    .model({
      userId: a.string().required(),
      issueId: a.string(),
      incidentId: a.string(),
      title: a.string().required(),
      message: a.string().required(),
      type: a.string().required(),
      read: a.boolean().required(),
      createdAt: a.datetime().required(),
    })
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
