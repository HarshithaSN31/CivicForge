import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION || 'us-east-1' });

export const handler = async (event: any) => {
  try {
    const { title, description, categoryHint } = JSON.parse(event.body || '{}');

    const prompt = `
You are CivicForge AI assistant for civic infrastructure and safety analysis.
Analyze the following report and output ONLY raw valid JSON:
{
  "category": "Road Infrastructure" | "Water & Sewerage" | "Sanitation & Waste" | "Electricity & Lighting" | "Public Safety" | "Parks & Environment" | "Other",
  "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "recommendedDepartment": "Road Maintenance Division" | "Water Works" | "Sanitation Dept" | "Electrical Operations" | "Public Safety",
  "summary": "1 sentence concise summary",
  "aiConfidence": 91
}

Report Title: ${title}
Description: ${description}
Category Hint: ${categoryHint || 'None'}
`;

    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }]
    };

    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-haiku-20240307-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload)
    });

    const response = await bedrockClient.send(command);
    const decoded = new TextDecoder().decode(response.body);
    const resJson = JSON.parse(decoded);
    const contentText = resJson.content?.[0]?.text || '{}';
    const cleanJson = JSON.parse(contentText.replace(/```json/g, '').replace(/```/g, '').trim());

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanJson)
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Failed to analyze report via Bedrock" })
    };
  }
};
