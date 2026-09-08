/**
 * PROMPTLY SPECIALIZED AGENT ORCHESTRATOR
 * Manages the 11 specialized AI agent personas, their capabilities, tools, and execution routing.
 */

import { SoftwareProject, ProjectPhase } from "./software-projects.store";
import { multiAPIRouter, ModelExecutionResult } from "./multi-api-router";

export type AgentRoleID =
  | "requirements"
  | "product"
  | "architecture"
  | "uiux"
  | "database"
  | "coding"
  | "testing"
  | "debugging"
  | "security"
  | "performance"
  | "deployment";

export interface AgentDefinition {
  id: AgentRoleID;
  name: string;
  roleTitle: string;
  systemPrompt: string;
  preferredModel: string;
  tools: string[];
  capabilities: string[];
}

export const SPECIALIZED_AGENTS: Record<AgentRoleID, AgentDefinition> = {
  requirements: {
    id: "requirements",
    name: "Requirement Agent",
    roleTitle: "Lead Requirements Engineer & Product Systems Analyst",
    systemPrompt: "Analyze raw product ideas, SRS documents, and PRDs. Extract structured requirements, detect missing specifications, and define strict acceptance criteria.",
    preferredModel: "claude-3-5-sonnet",
    tools: ["PARSE_SRS", "EXTRACT_REQUIREMENTS", "DETECT_AMBIGUITY"],
    capabilities: ["SRS Analysis", "Ambiguity Detection", "Acceptance Criteria Definition"]
  },
  product: {
    id: "product",
    name: "Product Agent",
    roleTitle: "Principal Product Manager & Systems Strategist",
    systemPrompt: "Convert requirements into product feature hierarchies, user journeys, milestone phase roadmaps, and priority matrices.",
    preferredModel: "gpt-4o",
    tools: ["PLAN_PHASES", "PRIORITIZE_FEATURES", "MAP_USER_JOURNEY"],
    capabilities: ["Feature Prioritization", "User Flow Mapping", "Phase Granularity Planning"]
  },
  architecture: {
    id: "architecture",
    name: "Architecture Agent",
    roleTitle: "Principal Enterprise Software Architect",
    systemPrompt: "Design modular system architectures, service boundaries, API specifications, component trees, and data flow diagrams.",
    preferredModel: "claude-3-5-sonnet",
    tools: ["DESIGN_ARCHITECTURE", "DEFINE_APIS", "IDENTIFY_RISKS"],
    capabilities: ["System Design", "API Routing", "Security Boundaries"]
  },
  uiux: {
    id: "uiux",
    name: "UI/UX Agent",
    roleTitle: "Senior Lead Frontend & Design Systems Engineer",
    systemPrompt: "Design intuitive user interfaces, responsive component hierarchies, Tailwind design tokens, and WCAG 2.1 AA accessibility guidelines.",
    preferredModel: "gpt-4o",
    tools: ["DESIGN_COMPONENTS", "TOKEN_PALETTE", "ACCESSIBILITY_AUDIT"],
    capabilities: ["Component Design", "Tailwind Tokens", "UX Flow Optimization"]
  },
  database: {
    id: "database",
    name: "Database Agent",
    roleTitle: "Staff Database Architect & Data Engineer",
    systemPrompt: "Design relational PostgreSQL DDL schemas, foreign key relationships, indexes, constraints, and migration strategies.",
    preferredModel: "claude-3-5-sonnet",
    tools: ["GENERATE_DDL", "OPTIMIZE_INDEXES", "MIGRATION_PREVIEW"],
    capabilities: ["Relational DDL", "Index Optimization", "Connection Pooling"]
  },
  coding: {
    id: "coding",
    name: "Coding Agent",
    roleTitle: "Senior Staff Full-Stack Software Engineer",
    systemPrompt: "Implement production-grade source code files with strict TypeScript, Zod input validation, error handling, and clean code conventions.",
    preferredModel: "claude-3-5-sonnet",
    tools: ["WRITE_FILE", "MODIFY_FILE", "GENERATE_DIFF"],
    capabilities: ["Multi-File Implementation", "Type Safety", "Clean Code Formatting"]
  },
  testing: {
    id: "testing",
    name: "Testing Agent",
    roleTitle: "Lead QA Automation & Test Strategy Engineer",
    systemPrompt: "Generate Vitest/Jest unit test suites, boundary condition assertions, and integration test scripts.",
    preferredModel: "gpt-4o-mini",
    tools: ["RUN_UNIT_TESTS", "ASSERT_COVERAGE", "VERIFY_BOUNDARIES"],
    capabilities: ["Test Suite Generation", "Boundary Assertion", "Coverage Analysis"]
  },
  debugging: {
    id: "debugging",
    name: "Debugging Agent",
    roleTitle: "Senior Debugging & Root Cause Analysis Specialist",
    systemPrompt: "Analyze stack traces, runtime failures, and unhandled exceptions. Propose precise code remedies and re-trigger validation.",
    preferredModel: "o3-mini",
    tools: ["ANALYZE_STACKTRACE", "DIAGNOSE_ROOT_CAUSE", "APPLY_AUTOFIX"],
    capabilities: ["Root Cause Analysis", "Self-Correction Loop", "Issue Remediation"]
  },
  security: {
    id: "security",
    name: "Security Agent",
    roleTitle: "Principal Application Security & Compliance Engineer",
    systemPrompt: "Perform OWASP Top 10 security audits, authentication analysis, RBAC permission verification, and secrets exposure checks.",
    preferredModel: "deepseek-r1",
    tools: ["AUDIT_OWASP", "CHECK_SECRETS", "VERIFY_RBAC"],
    capabilities: ["OWASP Audit", "XSS/SQLi Defenses", "Secrets Scanning"]
  },
  performance: {
    id: "performance",
    name: "Performance Agent",
    roleTitle: "Senior Cloud Reliability & Performance Engineer",
    systemPrompt: "Analyze bundle sizes, database query latency, memory consumption, and caching strategies.",
    preferredModel: "gemini-2-0-flash",
    tools: ["BENCHMARK_LATENCY", "CHECK_BUNDLE_SIZE", "RECOMMEND_CACHE"],
    capabilities: ["Latency Optimization", "Memory Profiling", "Cache Strategy"]
  },
  deployment: {
    id: "deployment",
    name: "Deployment Agent",
    roleTitle: "Senior DevOps & Cloud Reliability Engineer",
    systemPrompt: "Configure Docker containers, Kubernetes manifests, environment variable schemas, and CI/CD pipelines.",
    preferredModel: "gpt-4o",
    tools: ["GENERATE_DOCKERFILE", "BUILD_CI_CD", "VALIDATE_ENV"],
    capabilities: ["Docker Configuration", "CI/CD Pipeline", "Environment Validation"]
  }
};

export class AgentOrchestrator {
  /**
   * Routes a phase execution to the appropriate specialized agent persona
   */
  public static selectAgentForPhase(phaseTitle: string): AgentDefinition {
    const lower = phaseTitle.toLowerCase();
    if (lower.includes("requirement") || lower.includes("srs")) return SPECIALIZED_AGENTS.requirements;
    if (lower.includes("architecture") || lower.includes("system design")) return SPECIALIZED_AGENTS.architecture;
    if (lower.includes("database") || lower.includes("schema") || lower.includes("sql")) return SPECIALIZED_AGENTS.database;
    if (lower.includes("ui") || lower.includes("ux") || lower.includes("frontend")) return SPECIALIZED_AGENTS.uiux;
    if (lower.includes("security") || lower.includes("auth")) return SPECIALIZED_AGENTS.security;
    if (lower.includes("test") || lower.includes("qa")) return SPECIALIZED_AGENTS.testing;
    if (lower.includes("deploy") || lower.includes("ci/cd")) return SPECIALIZED_AGENTS.deployment;
    if (lower.includes("performance") || lower.includes("cache")) return SPECIALIZED_AGENTS.performance;
    return SPECIALIZED_AGENTS.coding;
  }

  /**
   * Executes a phase task using the assigned specialized agent persona
   */
  public static async executeAgentTask(
    agent: AgentDefinition,
    project: SoftwareProject,
    phase: ProjectPhase,
    taskPrompt: string
  ): Promise<ModelExecutionResult> {
    return multiAPIRouter.executeSingleModel({
      modelId: agent.preferredModel,
      rolePrompt: `${agent.name} — ${agent.roleTitle}\n\n${agent.systemPrompt}`,
      contextData: `Project: ${project.name}\nPhase: ${phase.phaseNumber} (${phase.title})\nTech Stack: ${project.requirements.techStack.join(", ")}`,
      taskPrompt
    });
  }
}
