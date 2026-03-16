import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { auditorFunction } from '../functions/auditor/resource';

const schema = a.schema({
  Project: a
    .model({
      name: a.string().required(),
      goal: a.string().required(),
      deadline: a.date().required(),
      budget: a.float(),
      pulseStatus: a.enum(['HEALTHY', 'WARNING', 'CRITICAL']),
      ownerId: a.string().required(),
      weeklyReports: a.hasMany('WeeklyReport', 'projectId'),
    })
    .authorization((allow) => [
      allow.group('Directors'),
      allow.ownerDefinedIn('ownerId').to(['read', 'update']),
    ]),

  WeeklyReport: a
    .model({
      projectId: a.id().required(),
      project: a.belongsTo('Project', 'projectId'),
      managerNotes: a.string().required(),
      aiAuditSummary: a.string(),
      weekNumber: a.integer().required(),
      timestamp: a.datetime().required(),
    })
    .authorization((allow) => [
      allow.group('Directors').to(['read']),
      allow.owner().to(['create', 'read']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
