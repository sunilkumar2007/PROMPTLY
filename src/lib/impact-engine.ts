/**
 * PROMPTLY IMPACT ANALYSIS ENGINE
 * Calculates ripple effects across phases, artifacts, and decisions when requirements change.
 */

import { SoftwareProject, ProjectPhase } from "./software-projects.store";
import { ProjectMemoryEngine, ArchitectureDecisionRecord, RequirementItem } from "./project-memory";

export interface AffectedPhaseDetail {
  phaseId: string;
  phaseNumber: number;
  phaseTitle: string;
  impactReason: string;
  recommendedAction: "REGENERATE_PROMPT" | "UPDATE_CODE" | "AUDIT_SECURITY" | "VERIFY_TESTS";
}

export interface ComprehensiveImpactReport {
  changeDescription: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  affectedPhases: AffectedPhaseDetail[];
  affectedArtifactPaths: string[];
  affectedDecisions: string[];
  changePlanSummary: string[];
  suggestedAutomations: string[];
  timestamp: string;
}

export class ImpactEngine {
  public static analyzeChangeImpact(
    project: SoftwareProject,
    modifiedElementTitle: string,
    changeType: "REQUIREMENT" | "TECH_STACK" | "DATABASE" | "AUTH" | "PAYMENT" | "CUSTOM"
  ): ComprehensiveImpactReport {
    const lowerChange = modifiedElementTitle.toLowerCase();
    const affectedPhases: AffectedPhaseDetail[] = [];
    const affectedArtifacts: string[] = [];
    const affectedDecisions: string[] = [];

    // Load Project Brain Memory
    const memory = ProjectMemoryEngine.loadMemory(project.id, project.name);

    // 1. Analyze Phases
    project.phases.forEach((phase) => {
      const phaseText = `${phase.title} ${phase.objective} ${phase.description} ${phase.technologies.join(" ")}`.toLowerCase();
      let isAffected = false;
      let reason = "";
      let action: AffectedPhaseDetail["recommendedAction"] = "REGENERATE_PROMPT";

      if (changeType === "DATABASE" || lowerChange.includes("database") || lowerChange.includes("sql") || lowerChange.includes("postgres") || lowerChange.includes("mongo")) {
        if (phaseText.includes("database") || phaseText.includes("schema") || phaseText.includes("backend") || phaseText.includes("api") || phaseText.includes("model")) {
          isAffected = true;
          reason = "Direct database schema and query dependency.";
          action = "UPDATE_CODE";
        }
      } else if (changeType === "AUTH" || lowerChange.includes("auth") || lowerChange.includes("jwt") || lowerChange.includes("oauth") || lowerChange.includes("session")) {
        if (phaseText.includes("auth") || phaseText.includes("security") || phaseText.includes("api") || phaseText.includes("ui") || phaseText.includes("login")) {
          isAffected = true;
          reason = "Authentication flow & session security affected.";
          action = "AUDIT_SECURITY";
        }
      } else if (changeType === "PAYMENT" || lowerChange.includes("stripe") || lowerChange.includes("payment") || lowerChange.includes("billing")) {
        if (phaseText.includes("payment") || phaseText.includes("checkout") || phaseText.includes("webhook") || phaseText.includes("security")) {
          isAffected = true;
          reason = "Payment webhook handlers and PCI compliance affected.";
          action = "AUDIT_SECURITY";
        }
      } else {
        // Keyword-based semantic matching
        const keywords = lowerChange.split(" ").filter(w => w.length > 3);
        const matches = keywords.some(k => phaseText.includes(k));
        if (matches) {
          isAffected = true;
          reason = `Phase context references modified topic '${modifiedElementTitle}'.`;
          action = "REGENERATE_PROMPT";
        }
      }

      if (isAffected) {
        affectedPhases.push({
          phaseId: phase.id,
          phaseNumber: phase.phaseNumber,
          phaseTitle: phase.title,
          impactReason: reason,
          recommendedAction: action
        });

        // Collect affected artifacts
        if (phase.filesAffected.create) affectedArtifacts.push(...phase.filesAffected.create);
        if (phase.filesAffected.modify) affectedArtifacts.push(...phase.filesAffected.modify);
      }
    });

    // 2. Analyze Architecture Decisions in Memory
    memory.decisions.forEach((adr) => {
      const adrText = `${adr.title} ${adr.decision} ${adr.context}`.toLowerCase();
      if (adrText.includes(lowerChange) || lowerChange.split(" ").some(w => w.length > 3 && adrText.includes(w))) {
        affectedDecisions.push(adr.title);
      }
    });

    // 3. Determine Severity
    const severity: ComprehensiveImpactReport["severity"] =
      affectedPhases.length >= 4 ? "CRITICAL"
      : affectedPhases.length >= 2 ? "HIGH"
      : affectedPhases.length === 1 ? "MEDIUM"
      : "LOW";

    // 4. Build Change Plan Summary
    const changePlanSummary = [
      `1. Record requirement revision for "${modifiedElementTitle}".`,
      `2. Mark ${affectedPhases.length} downstream phase(s) for review: ${affectedPhases.map(p => `Phase ${p.phaseNumber}`).join(", ") || "None"}.`,
      `3. Invalidate cached prompt versions for affected milestones to prevent context drift.`,
      `4. Execute automated cross-agent audit across affected artifacts.`
    ];

    const suggestedAutomations = [
      "Auto-regenerate prompts for highlighted phases",
      "Run Multi-API Security & Compliance audit",
      "Update project memory ADR log with user rationale"
    ];

    return {
      changeDescription: modifiedElementTitle,
      severity,
      affectedPhases,
      affectedArtifactPaths: Array.from(new Set(affectedArtifacts)),
      affectedDecisions,
      changePlanSummary,
      suggestedAutomations,
      timestamp: new Date().toISOString()
    };
  }
}
