import OpenAI from "openai";

const apiKey = process.env['LOVABLE_API_KEY'] || "";

// Helper to get the AI Gateway client configured with the Lovable API Key
export const aiGateway = new OpenAI({
  apiKey,
  baseURL: "https://api.lovable.ai/v1", // Lovable AI Gateway URL
});
