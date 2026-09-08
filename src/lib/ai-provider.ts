import OpenAI from "openai";

export interface AICompletionOptions {
  systemPrompt?: string;
  userMessage: string;
  model?: string;
  temperature?: number;
  responseFormatJson?: boolean;
}

export interface AIProvider {
  name: string;
  generateText(options: AICompletionOptions): Promise<string>;
}

export class LovableOpenAIProvider implements AIProvider {
  name = "Lovable OpenAI Provider";
  private client: OpenAI | null = null;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.LOVABLE_API_KEY || "";
    if (key) {
      try {
        this.client = new OpenAI({
          apiKey: key,
          baseURL: "https://api.lovable.ai/v1",
          dangerouslyAllowBrowser: true
        });
      } catch (e) {
        console.warn("Could not initialize OpenAI client:", e);
      }
    }
  }

  async generateText(options: AICompletionOptions): Promise<string> {
    if (!this.client) {
      throw new Error("No API key configured for OpenAI Provider");
    }

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
    if (options.systemPrompt) {
      messages.push({ role: "system", content: options.systemPrompt });
    }
    messages.push({ role: "user", content: options.userMessage });

    const completion = await this.client.chat.completions.create({
      model: options.model || "gpt-4o-mini",
      messages,
      temperature: options.temperature ?? 0.7,
      ...(options.responseFormatJson ? { response_format: { type: "json_object" } } : {})
    });

    return completion.choices[0]?.message?.content || "";
  }
}

export class SmartSimulatedProvider implements AIProvider {
  name = "Smart Simulated Engine";

  async generateText(options: AICompletionOptions): Promise<string> {
    // Artificial slight delay for realistic processing feel
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (options.responseFormatJson) {
      return JSON.stringify({
        status: "success",
        data: "Structured mock output successfully generated."
      });
    }

    return `Simulated response generated for request: "${options.userMessage.substring(0, 80)}..."`;
  }
}

// Global active provider instance getter
export function getActiveAIProvider(customApiKey?: string): AIProvider {
  const apiKey = customApiKey || (typeof window !== "undefined" ? localStorage.getItem("promptly_api_key") || "" : "");
  if (apiKey) {
    return new LovableOpenAIProvider(apiKey);
  }
  return new SmartSimulatedProvider();
}
