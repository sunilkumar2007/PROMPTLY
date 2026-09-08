import { 
  GeneratedPromptItem, 
  PromptCategory, 
  PromptLevel, 
  PromptVariation, 
  PromptVariable 
} from "./prompt-creator.store";

export function detectPromptCategory(userIdea: string): PromptCategory {
  const lower = userIdea.toLowerCase();

  if (lower.includes("react") || lower.includes("code") || lower.includes("python") || lower.includes("api") || lower.includes("sql") || lower.includes("bug")) {
    return "Coding";
  }
  if (lower.includes("figma") || lower.includes("design") || lower.includes("ui") || lower.includes("ux") || lower.includes("landing page") || lower.includes("layout")) {
    return "UI/UX";
  }
  if (lower.includes("image") || lower.includes("midjourney") || lower.includes("photo") || lower.includes("logo") || lower.includes("art") || lower.includes("dall-e")) {
    return "Image generation";
  }
  if (lower.includes("video") || lower.includes("animation") || lower.includes("sora") || lower.includes("runway") || lower.includes("youtube script")) {
    return "Video generation";
  }
  if (lower.includes("ad") || lower.includes("marketing") || lower.includes("seo") || lower.includes("campaign") || lower.includes("copywriting")) {
    return "Marketing";
  }
  if (lower.includes("business") || lower.includes("strategy") || lower.includes("pitch") || lower.includes("finance") || lower.includes("startup")) {
    return "Business";
  }
  if (lower.includes("research") || lower.includes("academic") || lower.includes("analysis") || lower.includes("study")) {
    return "Research";
  }
  if (lower.includes("social") || lower.includes("instagram") || lower.includes("twitter") || lower.includes("linkedin") || lower.includes("tiktok")) {
    return "Social media";
  }
  if (lower.includes("agent") || lower.includes("autogen") || lower.includes("langchain") || lower.includes("workflow")) {
    return "AI agents";
  }
  if (lower.includes("data") || lower.includes("pandas") || lower.includes("chart") || lower.includes("statistics")) {
    return "Data analysis";
  }

  return "Productivity";
}

export function evaluatePromptQuality(promptText: string): { score: number; suggestions: string[] } {
  let score = 70;
  const suggestions: string[] = [];
  const lower = promptText.toLowerCase();

  if (lower.includes("role") || lower.includes("you are a")) {
    score += 8;
  } else {
    suggestions.push("Specify an explicit persona or Role (e.g., 'You are a Senior Data Scientist').");
  }

  if (lower.includes("context") || lower.includes("background")) {
    score += 7;
  } else {
    suggestions.push("Provide background Context for why this task is being performed.");
  }

  if (lower.includes("constraint") || lower.includes("do not") || lower.includes("must")) {
    score += 8;
  } else {
    suggestions.push("Define negative Constraints or boundaries to prevent hallucinations.");
  }

  if (lower.includes("output format") || lower.includes("format:") || lower.includes("json") || lower.includes("structure")) {
    score += 7;
  } else {
    suggestions.push("Specify exact Output Format requirements (e.g. Markdown table, JSON schema).");
  }

  const finalScore = Math.min(100, Math.max(45, score));
  return { score: finalScore, suggestions };
}

export function generatePromptVariations(userIdea: string, category: PromptCategory): PromptVariation[] {
  const cleanIdea = userIdea.trim();
  const lowerCat = category.toLowerCase();

  // IMAGE GENERATION SPECIFIC HIGH-IMPACT PROMPTS
  if (lowerCat.includes("image") || cleanIdea.toLowerCase().includes("image") || cleanIdea.toLowerCase().includes("photo") || cleanIdea.toLowerCase().includes("kid")) {
    return [
      {
        id: "var-concise",
        level: "Concise",
        title: "Direct & Fast (Midjourney / DALL-E 3)",
        promptText: `Photorealistic portrait of ${cleanIdea.replace(/create an? image for/i, "")}, warm golden hour natural lighting, tender emotional expression, shallow depth of field, 85mm f/1.8 lens, soft bokeh, highly detailed skin textures --ar 16:9 --style raw --v 6.0`,
        strategyDescription: "Focused, low-token Midjourney v6 prompt ready to copy directly into Midjourney or DALL-E 3."
      },
      {
        id: "var-professional",
        level: "Professional",
        title: "Optimized & Structured (Studio Quality)",
        promptText: `PROMPT FOR DALL-E 3 / MIDJOURNEY V6:\n\n` +
          `Subject: ${cleanIdea.replace(/create an? image for/i, "").trim()}, capturing an authentic, high-emotion moment with natural poses.\n` +
          `Lighting: Soft Rembrandt lighting with subtle golden hour sun flares streaming from the side.\n` +
          `Camera & Lens: Captured on Hasselblad H6D-100c, 90mm prime lens, f/2.0 aperture, razor-sharp focus on subject eyes and hands.\n` +
          `Atmosphere: Heartwarming, serene, award-winning editorial portrait style.\n` +
          `Color Grading: Warm amber tones, subtle film grain, muted background contrast.\n` +
          `Parameters: --ar 16:9 --v 6.0 --stylize 250 --no extra limbs, bad anatomy, blur, plastic skin, CGI rendering`,
        strategyDescription: "Balanced studio-grade prompt with camera specs, lighting, color grading, and negative constraints."
      },
      {
        id: "var-expert",
        level: "Expert",
        title: "Deep Architecture & Edge Cases (Cinematic Masterpiece)",
        promptText: `ENTERPRISE MIDJOURNEY V6 & STABLE DIFFUSION PROMPT:\n\n` +
          `[SUBJECT & COMPOSITION]\n` +
          `An award-winning, photorealistic cinematic shot of ${cleanIdea.replace(/create an? image for/i, "").trim()}. The composition follows the golden ratio with natural human emotion, authentic skin pores, and soft anatomical precision.\n\n` +
          `[LIGHTING & CINEMATOGRAPHY]\n` +
          `Volumetric window light with gentle atmosphere dust motes. High dynamic range (HDR), subtle fill light, soft rim light highlighting hair and hand contours.\n\n` +
          `[TECHNICAL SPECIFICATIONS]\n` +
          `- Camera: Sony A7R V\n` +
          `- Lens: 85mm f/1.4 GM\n` +
          `- Shutter: 1/500s | ISO 100\n` +
          `- Film Stock: Kodak Portra 400 aesthetic\n\n` +
          `[NEGATIVE CONSTRAINTS]\n` +
          `--no deformed hands, missing fingers, extra digits, unnatural skin smoothing, AI artifacts, cartoon style, distorted eyes\n\n` +
          `[RENDER PARAMETERS]\n` +
          `--ar 16:9 --v 6.0 --style raw --chaos 5 --stylize 500 --quality 2`,
        strategyDescription: "Multi-layered production prompt featuring camera optics, lighting setup, negative prompts, and Midjourney v6 render flags."
      }
    ];
  }

  // CODING / SOFTWARE DEVELOPMENT PROMPTS
  if (lowerCat.includes("coding") || lowerCat.includes("software") || lowerCat.includes("code")) {
    return [
      {
        id: "var-concise",
        level: "Concise",
        title: "Direct & Fast Code Spec",
        promptText: `Act as a Senior Full-Stack Engineer. Task: Write complete TypeScript implementation for: ${cleanIdea}.\n\nRequirements:\n- Include strict type definitions and interface schemas.\n- Follow clean code principles and modular architecture.\n- Provide runnable code without truncated snippets.`,
        strategyDescription: "Focused coding prompt ideal for rapid code generation."
      },
      {
        id: "var-professional",
        level: "Professional",
        title: "Optimized & Structured Engineering Prompt",
        promptText: `ROLE:\nSenior Software Architect & Staff Engineer\n\nOBJECTIVE:\nDesign and implement production-ready code for: ${cleanIdea}\n\nTECHNICAL SPECIFICATIONS:\n1. Architecture: Modular TypeScript code with clean separation of concerns.\n2. Validation: Zod schemas for input validation & safety checks.\n3. Error Handling: Custom error classes and HTTP status codes.\n4. Unit Testing: Vitest/Jest unit test cases covering happy path and edge cases.\n\nCONSTRAINTS:\n- No placeholders or stub functions.\n- Ensure strict TypeScript (no \`any\` types).`,
        strategyDescription: "Structured engineering specification with architecture, validation, and test requirements."
      },
      {
        id: "var-expert",
        level: "Expert",
        title: "Deep Architecture & Production System",
        promptText: `ENTERPRISE CODING & ARCHITECTURE SPECIFICATION:\n\n` +
          `[SYSTEM DESIGN OBJECTIVE]\n` +
          `Build an enterprise-grade solution for: ${cleanIdea}\n\n` +
          `[DELIVERABLE REQUIREMENTS]\n` +
          `1. Domain Interfaces & Data Models (TypeScript / Database DDL)\n` +
          `2. Core Business Logic Service with Async Error Boundaries\n` +
          `3. Controller Router Handlers with Request Schema Validation\n` +
          `4. Unit & Integration Test Suite with 100% boundary assertion coverage\n\n` +
          `[NON-FUNCTIONAL REQUIREMENTS]\n` +
          `- Time Complexity: O(1) or O(N log N)\n` +
          `- Memory Efficiency: Zero memory leaks on long-running instances\n` +
          `- Security: OWASP Top 10 defenses (SQL injection, XSS, CSRF protection)\n\n` +
          `[OUTPUT FORMAT]\n` +
          `Provide full multi-file code blocks with explicit file paths (\`filepath=src/...\`).`,
        strategyDescription: "Enterprise system specification detailing non-functional requirements, security controls, and file structure."
      }
    ];
  }

  // GENERAL PROMPT VARIATIONS
  return [
    {
      id: "var-concise",
      level: "Concise",
      title: "Direct & Fast",
      promptText: `Act as a leading expert in ${category}. Fulfill this request directly and concisely: ${cleanIdea}. Deliver actionable, well-structured output without filler text.`,
      strategyDescription: "Focused, low-token prompt ideal for quick iterations and direct answers."
    },
    {
      id: "var-professional",
      level: "Professional",
      title: "Optimized & Structured",
      promptText: `Role: Principal ${category} Specialist\n\nContext: Fulfilling high-impact request: ${cleanIdea}.\n\nTasks:\n1. Analyze key requirements and target outcomes\n2. Provide structured, step-by-step deliverable\n3. Include verification checks and quality criteria\n\nConstraints: Adhere to professional standards, avoid vague generalities, and maintain absolute precision.`,
      strategyDescription: "Balanced professional prompt with structured role, tasks, and constraints."
    },
    {
      id: "var-expert",
      level: "Expert",
      title: "Deep Architecture & Edge Cases",
      promptText: `ROLE:\nYou are a World-Class Authority and Thought Leader in ${category}.\n\nOBJECTIVE:\nExecute a comprehensive, production-grade deliverable for: ${cleanIdea}.\n\nMETHODOLOGY:\n1. Deconstruct request into core components and dependencies\n2. Address edge cases, constraints, and risk factors\n3. Produce complete, fully structured output with actionable guidelines\n\nQUALITY ASSURANCE:\n- Must include step-by-step verification logic\n- Zero placeholder assumptions\n- Enterprise quality metrics enforced.`,
      strategyDescription: "Multi-layered enterprise prompt featuring process checklists and quality assurance criteria."
    }
  ];
}

export function generateOptimizedPrompt(params: {
  idea: string;
  category?: PromptCategory;
  level?: PromptLevel;
}): GeneratedPromptItem {
  const category = params.category || detectPromptCategory(params.idea);
  const level = params.level || "Professional";

  const variations = generatePromptVariations(params.idea, category);
  const selectedVar = level === "Quick" ? variations[0] : level === "Expert" ? variations[2] : variations[1];

  const quality = evaluatePromptQuality(selectedVar.promptText);

  // Extract variables
  const variables: PromptVariable[] = [
    { name: "TARGET_AUDIENCE", description: "The specific group or domain target for this request" },
    { name: "KEY_CONSTRAINTS", description: "Specific technical, design, or brand rules to enforce" }
  ];

  return {
    id: `prompt-item-${Date.now()}`,
    title: params.idea.length > 50 ? params.idea.substring(0, 47) + "..." : params.idea,
    rawInputIdea: params.idea,
    category,
    level,
    promptText: selectedVar.promptText,
    variables,
    recommendedModel: category === "Coding" ? "Claude 3.5 Sonnet / GPT-4o" : "GPT-4o / Midjourney v6",
    expectedOutput: `High-quality, production-ready ${category.toLowerCase()} prompt response.`,
    qualityScore: quality.score,
    improvementSuggestions: quality.suggestions,
    variations,
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    remixHistory: []
  };
}

export function remixPrompt(item: GeneratedPromptItem, remixInstruction: string): GeneratedPromptItem {
  const updatedPromptText = `${item.promptText}\n\n[REMIX MODIFIER]: Adopt the following modifications: ${remixInstruction}. Ensure all original objectives and constraints remain active.`;

  const updatedRemixHistory = [
    ...(item.remixHistory || []),
    {
      timestamp: new Date().toISOString(),
      instruction: remixInstruction,
      previousPromptText: item.promptText
    }
  ];

  return {
    ...item,
    promptText: updatedPromptText,
    updatedAt: new Date().toISOString(),
    remixHistory: updatedRemixHistory
  };
}
