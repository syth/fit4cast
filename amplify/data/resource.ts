import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  UserPreferences: a
    .model({
      userId: a.string().required(),
      activities: a.list(a.string()),
      intensity: a.string().required(), // 'low', 'medium', 'high'
      preferredTime: a.string(), // 'morning', 'afternoon', 'evening'
      indoorOutdoor: a.string(), // 'indoor', 'outdoor', 'both'
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
