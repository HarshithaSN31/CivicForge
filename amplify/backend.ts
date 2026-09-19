import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

/**
 * CivicForge AWS Amplify Gen 2 Stack Definition
 * Combines Cognito Authentication, DynamoDB Data, and S3 Storage into a unified AWS stack.
 */
export default defineBackend({
  auth,
  data,
  storage,
});
