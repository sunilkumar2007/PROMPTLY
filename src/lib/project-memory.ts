/**
 * PROMPTLY PROJECT BRAIN & PERSISTENT MEMORY ENGINE
 * Holds structured multi-dimensional project memory across the entire lifecycle.
 */

export interface RequirementItem {
  id: string;
  category: "functional" | "non_functional" | "business_rule" | "security" | "ui_ux" | "integration";
  title: string;
  description: string;
  status: "CONFIRMED" | "ASSUMED" | "UNKNOWN" | "RECOMMENDED";
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  sourcePhase?: number;
  approvedByUser: boolean;
  createdAt: string;
}

export interface ArchitectureDecisionRecord {
  id: string;
  title: string;
  status: "PROPOSED" | "ACCEPTED" | "REJECTED" | "SUPERSEDED";
  context: string;
  decision: string;
  rationale: string;
  consequences: string[];
  alternativesConsidered: string[];
  phaseNumber?: number;
  createdAt: string;
}

export interface ProjectConstraint {
  id: string;
  rule: string;
  category: "technical" | "scope" | "security" | "compliance";
  isImmutable: boolean;
  reason: string;
}

export interface ProjectRisk {
  id: string;
  title: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  mitigation: string;
  status: "OPEN" | "MITIGATED" | "ACCEPTED";
}

export interface TechnicalDebtItem {
  id: string;
  title: string;
  description: string;
  remediationPhase?: number;
  severity: "HIGH" | "MEDIUM" | "LOW";
}

export interface ActivityLogEvent {
  id: string;
  timestamp: string;
  type: "PROJECT_CREATED" | "REQUIREMENT_ADDED" | "DECISION_MADE" | "PHASE_STARTED" | "PHASE_COMPLETED" | "PROMPT_GENERATED" | "IMPACT_ANALYSIS_RUN" | "ARTIFACT_CREATED" | "MODEL_INVOKED";
  description: string;
  actor: "USER" | "AI_ENGINE" | "MULTI_API_ROUTER";
  metadata?: Record<string, any>;
}

export interface ProjectBrainMemory {
  projectId: string;
  projectName: string;
  requirements: RequirementItem[];
  decisions: ArchitectureDecisionRecord[];
  constraints: ProjectConstraint[];
  risks: ProjectRisk[];
  technicalDebt: TechnicalDebtItem[];
  activityLogs: ActivityLogEvent[];
  totalTokensUsed: number;
  estimatedTotalCostUSD: number;
  totalExecutions: number;
  lastUpdated: string;
}

const MEMORY_STORAGE_KEY_PREFIX = "promptly_brain_memory_";

export class ProjectMemoryEngine {
  public static getInitialMemory(projectId: string, projectName: string): ProjectBrainMemory {
    return {
      projectId,
      projectName,
      requirements: [
        {
          id: "req-init-1",
          category: "functional",
          title: "Clean Modular Architecture",
          description: "Maintain type safety, modular service layers, and explicit error boundaries.",
          status: "CONFIRMED",
          priority: "CRITICAL",
          approvedByUser: true,
          createdAt: new Date().toISOString()
        }
      ],
      decisions: [
        {
          id: "adr-init-1",
          title: "Use PostgreSQL for Core Relational Storage",
          status: "ACCEPTED",
          context: "Need strong consistency, relational joins, and ACID transactions.",
          decision: "Adopt PostgreSQL with schema migrations.",
          rationale: "Ensures transactional data integrity across multi-tenant models.",
          consequences: ["Requires connection pooling for serverless environments"],
          alternativesConsidered: ["MongoDB", "DynamoDB"],
          createdAt: new Date().toISOString()
        }
      ],
      constraints: [
        {
          id: "c-1",
          rule: "Do not modify unrelated modules outside the current active phase.",
          category: "scope",
          isImmutable: true,
          reason: "Prevents regressions and unwanted code side effects."
        },
        {
          id: "c-2",
          rule: "Strict TypeScript typing with zero implicit any.",
          category: "technical",
          isImmutable: true,
          reason: "Ensures production code quality."
        }
      ],
      risks: [
        {
          id: "r-1",
          title: "API Provider Rate Limits",
          severity: "MEDIUM",
          mitigation: "Enable dynamic fallback to secondary model providers.",
          status: "MITIGATED"
        }
      ],
      technicalDebt: [],
      activityLogs: [
        {
          id: `log-init-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: "PROJECT_CREATED",
          description: `Initialized project memory for "${projectName}"`,
          actor: "USER"
        }
      ],
      totalTokensUsed: 0,
      estimatedTotalCostUSD: 0,
      totalExecutions: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  public static loadMemory(projectId: string, projectName: string): ProjectBrainMemory {
    if (typeof window === "undefined") return this.getInitialMemory(projectId, projectName);
    try {
      const raw = localStorage.getItem(`${MEMORY_STORAGE_KEY_PREFIX}${projectId}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error("Failed to load project memory:", e);
    }
    const init = this.getInitialMemory(projectId, projectName);
    this.saveMemory(init);
    return init;
  }

  public static saveMemory(memory: ProjectBrainMemory): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(`${MEMORY_STORAGE_KEY_PREFIX}${memory.projectId}`, JSON.stringify(memory));
    } catch (e) {
      console.error("Failed to save project memory:", e);
    }
  }

  public static logActivity(
    projectId: string,
    projectName: string,
    type: ActivityLogEvent["type"],
    description: string,
    actor: ActivityLogEvent["actor"] = "AI_ENGINE",
    metadata?: Record<string, any>
  ): void {
    const mem = this.loadMemory(projectId, projectName);
    const event: ActivityLogEvent = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      type,
      description,
      actor,
      metadata
    };
    mem.activityLogs.unshift(event);
    if (mem.activityLogs.length > 200) mem.activityLogs.pop();
    mem.lastUpdated = new Date().toISOString();
    this.saveMemory(mem);
  }

  public static recordUsage(
    projectId: string,
    projectName: string,
    tokens: number,
    costUSD: number
  ): void {
    const mem = this.loadMemory(projectId, projectName);
    mem.totalTokensUsed += tokens;
    mem.estimatedTotalCostUSD += costUSD;
    mem.totalExecutions += 1;
    mem.lastUpdated = new Date().toISOString();
    this.saveMemory(mem);
  }
}
