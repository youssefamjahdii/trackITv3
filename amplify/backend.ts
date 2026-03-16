import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { auditorFunction } from './functions/auditor/resource';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  auditorFunction,
});

// Grant the Lambda function permission to invoke the Claude 3.5 Sonnet model in Bedrock
const bedrockInvokePolicy = new PolicyStatement({
  actions: ['bedrock:InvokeModel'],
  resources: [
    'arn:aws:bedrock:us-west-2::foundation-model/anthropic.claude-3-5-sonnet-20240620-v1:0',
  ],
});

backend.auditorFunction.resources.lambda.addToRolePolicy(bedrockInvokePolicy);
