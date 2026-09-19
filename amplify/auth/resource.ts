import { defineAuth } from '@aws-amplify/backend';

/**
 * Defines Amazon Cognito User Pool authentication resource for CivicForge.
 * Supports CITIZEN and AUTHORITY user roles.
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    name: {
      required: true,
      mutable: true,
    },
    'custom:role': {
      dataType: 'String',
      mutable: true,
    },
    'custom:department': {
      dataType: 'String',
      mutable: true,
    },
  },
  groups: ['CITIZENS', 'AUTHORITIES'],
});
