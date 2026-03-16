import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import type { Schema } from '../../data/resource';

const client = new BedrockRuntimeClient({ region: 'us-west-2' });

export const handler = async (event: any) => {
  // In a real scenario, this might be triggered by a DynamoDB Stream or an AppSync mutation
  // For this example, we assume we receive the project goal and manager notes in the event payload
  const { projectGoal, managerNotes } = event.arguments || event;

  const prompt = `You are an objective corporate project auditor. Compare the Manager's weekly notes against the project goal. Report exactly on: 1. Velocity (Is it on track?), 2. Accuracy, 3. Assign a Pulse (HEALTHY, WARNING, or CRITICAL). Keep it under 3 sentences. No advice, just facts.

Project Goal: ${projectGoal}
Manager Notes: ${managerNotes}`;

  const payload = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: [{ type: 'text', text: prompt }],
      },
    ],
  };

  try {
    const command = new InvokeModelCommand({
      modelId: process.env.MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    return responseBody.content[0].text;
  } catch (error) {
    console.error('Error invoking Bedrock:', error);
    throw new Error('Failed to generate audit summary');
  }
};
