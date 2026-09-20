import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  UserProfile: a
    .model({
      userId: a.string().required(),
      email: a.string().required(),
      name: a.string().required(),
      role: a.enum(['CITIZEN', 'VOLUNTEER', 'AUTHORITY', 'ADMIN']),
      profilePhoto: a.string(),
      phone: a.string(),
      department: a.string(),
      city: a.string(),
      state: a.string(),
      district: a.string(),
      isVolunteer: a.boolean().required(),
      volunteerStatus: a.enum(['ACTIVE', 'INACTIVE']),
      verifiedActivitiesCount: a.integer().required(),
      volunteerHours: a.float().required(),
      tasksCompleted: a.integer().required(),
      areasHelpedCount: a.integer().required(),
      incidentsSupportedCount: a.integer().required(),
      creditsReceivedCount: a.integer().required(),
      createdAt: a.datetime().required(),
    })
    .authorization((allow) => [allow.authenticated(), allow.owner()]),

  Issue: a
    .model({
      title: a.string().required(),
      description: a.string().required(),
      category: a.string().required(),
      latitude: a.float().required(),
      longitude: a.float().required(),
      formattedAddress: a.string(),
      locality: a.string(),
      city: a.string(),
      district: a.string(),
      state: a.string(),
      country: a.string().required(),
      countryCode: a.string().required(),
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
      formattedAddress: a.string(),
      locality: a.string(),
      city: a.string(),
      district: a.string(),
      state: a.string(),
      country: a.string().required(),
      countryCode: a.string().required(),
      aiConfidence: a.integer().required(),
      assignedDepartment: a.string().required(),
      assignedTo: a.string(),
      affectedCitizensCount: a.integer().required(),
      taskIds: a.string().array(),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
    })
    .authorization((allow) => [allow.authenticated()]),

  CivicTask: a
    .model({
      incidentId: a.string().required(),
      title: a.string().required(),
      description: a.string().required(),
      workType: a.string().required(),
      latitude: a.float().required(),
      longitude: a.float().required(),
      formattedAddress: a.string(),
      locality: a.string(),
      city: a.string(),
      state: a.string(),
      date: a.string().required(),
      startTime: a.string().required(),
      expectedDuration: a.string().required(),
      volunteersNeeded: a.integer().required(),
      enrolledVolunteersCount: a.integer().required(),
      requiredSkills: a.string().array(),
      safetyInstructions: a.string(),
      status: a.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
      createdByAuthorityId: a.string().required(),
      createdByAuthorityName: a.string().required(),
      createdAt: a.datetime().required(),
    })
    .authorization((allow) => [allow.authenticated()]),

  VolunteerApplication: a
    .model({
      userId: a.string().required(),
      userName: a.string().required(),
      userEmail: a.string().required(),
      taskId: a.string().required(),
      taskTitle: a.string().required(),
      incidentId: a.string().required(),
      appliedTimestamp: a.datetime().required(),
      status: a.enum(['APPLIED', 'ACCEPTED', 'CHECKED_IN', 'COMPLETED', 'VERIFIED', 'DECLINED', 'CANCELLED']),
      checkInTimestamp: a.datetime(),
      checkInLatitude: a.float(),
      checkInLongitude: a.float(),
    })
    .authorization((allow) => [allow.authenticated()]),

  VolunteerActivity: a
    .model({
      applicationId: a.string().required(),
      taskId: a.string().required(),
      taskTitle: a.string().required(),
      incidentId: a.string().required(),
      volunteerId: a.string().required(),
      volunteerName: a.string().required(),
      volunteerPhoto: a.string(),
      workDescription: a.string().required(),
      beforePhotoUrl: a.string(),
      afterPhotoUrl: a.string().required(),
      videoUrl: a.string(),
      completionTimestamp: a.datetime().required(),
      status: a.enum(['SUBMITTED_FOR_VERIFICATION', 'VERIFIED', 'REJECTED']),
      verifiedByAuthorityId: a.string(),
      verifiedByAuthorityName: a.string(),
      verifiedAt: a.datetime(),
      hoursSpent: a.float().required(),
      latitude: a.float().required(),
      longitude: a.float().required(),
      formattedAddress: a.string(),
      city: a.string(),
      state: a.string(),
    })
    .authorization((allow) => [allow.authenticated()]),

  CivicPost: a
    .model({
      activityId: a.string().required(),
      volunteerId: a.string().required(),
      volunteerName: a.string().required(),
      volunteerPhoto: a.string(),
      title: a.string().required(),
      description: a.string().required(),
      latitude: a.float().required(),
      longitude: a.float().required(),
      formattedAddress: a.string(),
      city: a.string(),
      state: a.string(),
      beforePhotoUrl: a.string(),
      afterPhotoUrl: a.string().required(),
      reactionCount: a.integer().required(),
      commentCount: a.integer().required(),
      createdAt: a.datetime().required(),
    })
    .authorization((allow) => [allow.authenticated()]),

  Comment: a
    .model({
      postId: a.string().required(),
      userId: a.string().required(),
      userName: a.string().required(),
      userPhoto: a.string(),
      text: a.string().required(),
      timestamp: a.datetime().required(),
    })
    .authorization((allow) => [allow.authenticated()]),

  ContributorCredit: a
    .model({
      giverUserId: a.string().required(),
      giverUserName: a.string().required(),
      recipientUserId: a.string().required(),
      recipientUserName: a.string().required(),
      activityId: a.string().required(),
      message: a.string().required(),
      timestamp: a.datetime().required(),
    })
    .authorization((allow) => [allow.authenticated()]),

  IssueEvent: a
    .model({
      issueId: a.string(),
      incidentId: a.string(),
      taskId: a.string(),
      activityId: a.string(),
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
      taskId: a.string(),
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
