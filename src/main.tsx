import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';
import App from './App';
import './index.css';

// Read environment variables from .env (import.meta.env) with fallback to amplify_outputs.json
const envUserPoolId = import.meta.env.VITE_AWS_USER_POOLS_ID;
const envClientId = import.meta.env.VITE_AWS_USER_POOLS_WEB_CLIENT_ID;
const envGraphqlUrl = import.meta.env.VITE_AWS_APPSYNC_GRAPHQL_ENDPOINT;
const envRegion = import.meta.env.VITE_AWS_REGION || 'us-east-1';
const envS3Bucket = import.meta.env.VITE_AWS_S3_BUCKET;

const isPlaceholder = (val?: string) => {
  if (!val) return true;
  return val.startsWith('YOUR_') || val.includes('XXXXXXXXX') || val.includes('1234567890');
};

const awsAmplifyConfig = {
  auth: {
    user_pool_id: !isPlaceholder(envUserPoolId) ? envUserPoolId : outputs.auth?.user_pool_id,
    user_pool_client_id: !isPlaceholder(envClientId) ? envClientId : outputs.auth?.user_pool_client_id,
    aws_region: envRegion || outputs.auth?.aws_region || 'us-east-1',
    signup_attributes: outputs.auth?.signup_attributes || ['email', 'name'],
    password_policy: outputs.auth?.password_policy || {
      min_length: 8,
      require_numbers: true,
      require_lowercase: true,
      require_uppercase: true,
      require_symbols: true
    },
    verification_mechanisms: ['EMAIL']
  },
  data: {
    url: !isPlaceholder(envGraphqlUrl) ? envGraphqlUrl : outputs.data?.url,
    aws_region: envRegion || outputs.data?.aws_region || 'us-east-1',
    default_authorization_type: 'AMAZON_COGNITO_USER_POOLS',
    model_introspection: outputs.data?.model_introspection
  },
  storage: {
    bucket_name: !isPlaceholder(envS3Bucket) ? envS3Bucket : outputs.storage?.bucket_name,
    aws_region: envRegion || outputs.storage?.aws_region || 'us-east-1'
  },
  version: '1.3'
};

// Configure AWS Amplify with real backend outputs or environment variables
try {
  Amplify.configure(awsAmplifyConfig as any);
} catch (err) {
  console.error('Failed to configure AWS Amplify:', err);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

