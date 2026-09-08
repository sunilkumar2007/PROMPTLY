/**
 * PROMPTLY CONTEXT SELECTION ENGINE
 * Intelligently curates and filters project memory to provide targeted context slices for each phase.
 */

import { SoftwareProject, ProjectPhase, ExtractedRequirements } from "./software-projects.store";

export interface CuratedPhaseContext {
  phaseNumber: number;
  phaseTitle: string;
  rolePersona: string;
  contextSlice: string;
  dependenciesSummary: string;
  estimatedTokens: number;
  immutableConstraints: string[];
}

export class ContextEngine {
  /**
   * Generates a token-efficient, targeted context payload for a given phase
   */
  public static curatePhaseContext(
    project: SoftwareProject,
    currentPhase: ProjectPhase,
    allPhases: ProjectPhase[]
  ): CuratedPhaseContext {
    const rolePersona = this.determineRolePersona(currentPhase.title);
    const constraints: string[] = [
      ...(project.requirements.constraints || []),
      "Do not modify modules outside of this phase's scope.",
      "Ensure clean separation of concerns and type safety."
    ];

    // Build context slice based on dependencies and phase category
    const completedPrerequisites = allPhases
      .filter(p => currentPhase.dependencies.includes(p.phaseNumber) || p.phaseNumber < currentPhase.phaseNumber)
      .filter(p => p.status === "Completed" || p.generationStatus === "completed");

    let contextSections: string[] = [];

    // 1. Core Project Objective
    contextSections.push(`### 1. Project Overview\n- Name: ${project.name}\n- Objective: ${project.requirements.objective || project.description}`);

    // 2. Tech Stack & Decisions
    if (project.requirements.techStack && project.requirements.techStack.length > 0) {
      contextSections.push(`### 2. Approved Tech Stack\n${project.requirements.techStack.map(t => `- ${t}`).join("\n")}`);
    }

    // 3. User Clarifications & Decisions
    if (project.userAnswers && Object.keys(project.userAnswers).length > 0) {
      const answers = Object.entries(project.userAnswers)
        .map(([q, a]) => `- ${q}: **${a}**`)
        .join("\n");
      contextSections.push(`### 3. Architecture & User Decisions\n${answers}`);
    }

    // 4. Completed Prior Phase Artifacts (Selected Slices)
    if (completedPrerequisites.length > 0) {
      const priorArtifacts = completedPrerequisites.map(p => {
        return `#### Phase ${p.phaseNumber}: ${p.title}\n- **Output Produced**: ${p.expectedOutput}\n- **Files Created**: ${p.filesAffected.create.join(", ") || "None"}\n- **Files Modified**: ${p.filesAffected.modify.join(", ") || "None"}`;
      }).join("\n\n");
      contextSections.push(`### 4. Upstream Phase Context & Artifacts\n${priorArtifacts}`);
    }

    // 5. Phase-Specific Targeted Data
    const targetedInfo = this.extractPhaseSpecificData(currentPhase.title, project.requirements);
    if (targetedInfo) {
      contextSections.push(`### 5. Domain Specific Requirements\n${targetedInfo}`);
    }

    // 6. RAG Document Chunk Ingestion
    if (project.rawDocumentContent) {
      const chunks = this.chunkDocumentText(project.rawDocumentContent);
      const scoredChunks = chunks
        .map(c => ({ chunk: c, score: this.scoreChunkRelevance(currentPhase.title + " " + currentPhase.objective, c) }))
        .filter(sc => sc.score > 0.2)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      if (scoredChunks.length > 0) {
        contextSections.push(`### 6. Relevant Document Excerpts (RAG Context)\n${scoredChunks.map((sc, i) => `> **Excerpt ${i + 1} (Relevance: ${Math.round(sc.score * 100)}%)**:\n${sc.chunk}`).join("\n\n")}`);
      }
    }

    const contextSlice = contextSections.join("\n\n");
    const estimatedTokens = Math.ceil(contextSlice.length / 4);

    return {
      phaseNumber: currentPhase.phaseNumber,
      phaseTitle: currentPhase.title,
      rolePersona,
      contextSlice,
      dependenciesSummary: currentPhase.dependencies.length > 0
        ? `Depends on Phase(s): ${currentPhase.dependencies.join(", ")}`
        : "Initial Independent Foundation Phase",
      estimatedTokens,
      immutableConstraints: constraints
    };
  }

  private static determineRolePersona(phaseTitle: string): string {
    const lower = phaseTitle.toLowerCase();
    if (lower.includes("requirement") || lower.includes("srs") || lower.includes("scope")) {
      return "Lead Requirements Engineer & Product Systems Analyst";
    } else if (lower.includes("architecture") || lower.includes("system design") || lower.includes("foundation")) {
      return "Principal Enterprise Software Architect";
    } else if (lower.includes("database") || lower.includes("schema") || lower.includes("data model") || lower.includes("sql")) {
      return "Staff Database Architect & Data Engineer";
    } else if (lower.includes("ui") || lower.includes("ux") || lower.includes("design") || lower.includes("frontend") || lower.includes("component")) {
      return "Senior Lead Frontend & Design Systems Engineer";
    } else if (lower.includes("backend") || lower.includes("api") || lower.includes("endpoint") || lower.includes("service")) {
      return "Senior Backend & Cloud Infrastructure Engineer";
    } else if (lower.includes("auth") || lower.includes("security") || lower.includes("payment")) {
      return "Principal Application Security & Compliance Engineer";
    } else if (lower.includes("test") || lower.includes("qa") || lower.includes("validation")) {
      return "Lead QA Automation & Test Strategy Engineer";
    } else if (lower.includes("deploy") || lower.includes("ci/cd") || lower.includes("devops")) {
      return "Senior DevOps & Cloud Reliability Engineer";
    }
    return "Senior Full-Stack Software Engineer";
  }

  private static extractPhaseSpecificData(phaseTitle: string, req: ExtractedRequirements): string {
    const lower = phaseTitle.toLowerCase();
    if (lower.includes("database") || lower.includes("schema")) {
      return `- Database Engines: ${req.database.join(", ") || "PostgreSQL"}\n- Core Data Modules: ${req.modules.join(", ")}`;
    }
    if (lower.includes("auth") || lower.includes("security")) {
      return `- Auth Schemes: ${req.auth.join(", ") || "JWT / Session"}\n- Security Policies: ${req.security.join(", ")}`;
    }
    if (lower.includes("api") || lower.includes("backend")) {
      return `- APIs & Protocols: ${req.apis.join(", ")}\n- Integrations: ${req.integrations.join(", ")}`;
    }
    if (lower.includes("ui") || lower.includes("frontend")) {
      return `- UI/UX Guidelines: ${req.uiUx.join(", ")}\n- Target Users: ${req.targetUsers.join(", ")}`;
    }
    return `- Functional Specs: ${req.functionalRequirements.slice(0, 4).join("; ")}`;
  }

  /**
   * Split raw document text into overlapping chunks for semantic retrieval
   */
  public static chunkDocumentText(rawText: string, chunkSize: number = 400, overlap: number = 50): string[] {
    if (!rawText || rawText.trim().length === 0) return [];
    const paragraphs = rawText.split(/\n\s*\n/);
    const chunks: string[] = [];

    let currentChunk = "";
    for (const para of paragraphs) {
      if ((currentChunk + "\n\n" + para).length > chunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = currentChunk.slice(-overlap) + "\n\n" + para;
      } else {
        currentChunk = currentChunk ? currentChunk + "\n\n" + para : para;
      }
    }

    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  /**
   * Scores document chunk relevance to a target phase objective
   */
  public static scoreChunkRelevance(query: string, chunk: string): number {
    const queryWords = query.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(w => w.length > 3);
    if (queryWords.length === 0) return 0.5;

    const chunkLower = chunk.toLowerCase();
    let matches = 0;
    for (const word of queryWords) {
      if (chunkLower.includes(word)) matches++;
    }

    return Math.min(1.0, (matches / queryWords.length) * 1.2);
  }
}

