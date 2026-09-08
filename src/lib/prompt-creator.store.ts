export type PromptCategory =
  | "Software development"
  | "Coding"
  | "UI/UX"
  | "Image generation"
  | "Video generation"
  | "Marketing"
  | "Business"
  | "Education"
  | "Research"
  | "Writing"
  | "Social media"
  | "Data analysis"
  | "AI agents"
  | "Automation"
  | "Productivity"
  | "Other/custom";

export type PromptLevel = "Quick" | "Professional" | "Expert" | "Custom";

export interface PromptVariable {
  name: string;
  description: string;
  defaultValue?: string;
}

export interface PromptVariation {
  id: string;
  level: "Concise" | "Professional" | "Expert";
  title: string;
  promptText: string;
  strategyDescription: string;
}

export interface GeneratedPromptItem {
  id: string;
  title: string;
  rawInputIdea: string;
  category: PromptCategory;
  level: PromptLevel;
  promptText: string;
  variables: PromptVariable[];
  recommendedModel: string;
  expectedOutput: string;
  qualityScore: number; // 0 to 100
  improvementSuggestions: string[];
  variations: PromptVariation[];
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
  remixHistory?: {
    timestamp: string;
    instruction: string;
    previousPromptText: string;
  }[];
}

const STORAGE_KEY = "promptly_creator_prompts_v1";

export function loadPromptsFromStorage(): GeneratedPromptItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : getInitialMockPrompts();
  } catch (e) {
    console.error("Failed to load prompts from storage:", e);
    return getInitialMockPrompts();
  }
}

export function savePromptsToStorage(items: GeneratedPromptItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save prompts to storage:", e);
  }
}

function getInitialMockPrompts(): GeneratedPromptItem[] {
  return [
    {
      id: "prompt-1",
      title: "Senior Solutions Architect - Systems Design",
      rawInputIdea: "Create an architecture review prompt for microservices",
      category: "Software development",
      level: "Expert",
      promptText: `You are a Senior Solutions Architect. Analyze the following microservice system design for scalability, single points of failure, latency bottlenecks, and cloud cost efficiency.

Inputs required:
- Infrastructure Diagram or Service List
- Peak QPS targets
- Database Engines used

Evaluation Checklist:
1. Data Consistency Model (ACID vs Eventual)
2. Message Queue Backpressure & Dead Letter Queues
3. Auth Token Propagation & Edge Caching
4. Automated Recovery & Circuit Breakers`,
      variables: [
        { name: "SYSTEM_DESCRIPTION", description: "Overview of your microservices architecture" },
        { name: "PEAK_QPS", description: "Target queries per second" }
      ],
      recommendedModel: "Claude 3.5 Sonnet / GPT-4o",
      expectedOutput: "A structured architectural review report with risk mitigation strategies.",
      qualityScore: 96,
      improvementSuggestions: ["Add explicit disaster recovery SLA metrics", "Include Kubernetes ingress configuration check"],
      variations: [
        {
          id: "var-1",
          level: "Concise",
          title: "Quick Microservice Audit",
          promptText: "Review this microservices architecture for scaling bottlenecks, DB locks, and security vulnerabilities.",
          strategyDescription: "Direct, high-yield evaluation prompt for quick turnarounds."
        },
        {
          id: "var-2",
          level: "Professional",
          title: "System Design Assessment",
          promptText: "Act as a Senior Architect. Evaluate the microservice design provided below. Provide feedback on data flow, auth security, and cloud cost optimizations.",
          strategyDescription: "Balanced context and criteria for thorough technical audits."
        },
        {
          id: "var-3",
          level: "Expert",
          title: "Full Infrastructure & Fault Tolerance Review",
          promptText: `You are a Principal Cloud Architect. Conduct a deep architectural assessment covering:\n1. Fault isolation & blast radius\n2. Database read/write split & sharding strategy\n3. Eventual consistency sync bugs\n4. Cost optimization recommendations.`,
          strategyDescription: "Comprehensive multi-point architectural deep-dive with edge case coverage."
        }
      ],
      isFavorite: true,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
    }
  ];
}
