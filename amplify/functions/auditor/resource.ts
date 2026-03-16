import { defineFunction } from '@aws-amplify/backend';

export const auditorFunction = defineFunction({
  name: 'auditorFunction',
  entry: './handler.ts',
  timeoutSeconds: 30, // Bedrock calls can take a few seconds
  environment: {
    MODEL_ID: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
  },
});
