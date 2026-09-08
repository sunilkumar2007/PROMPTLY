/**
 * PROMPTLY ARTIFACT ENGINE
 * Manages project artifacts, file trees, version history, and multi-file code exports.
 */

export interface ProjectArtifact {
  id: string;
  phaseNumber: number;
  fileName: string;
  filePath: string;
  fileType: "markdown" | "typescript" | "javascript" | "sql" | "json" | "yaml" | "css" | "html";
  content: string;
  version: number;
  createdAt: string;
  summary: string;
  tags: string[];
}

export class ArtifactEngine {
  /**
   * Extracts clean, structured artifacts from AI output
   */
  public static extractArtifactsFromOutput(
    phaseNumber: number,
    phaseTitle: string,
    rawOutput: string
  ): ProjectArtifact[] {
    const artifacts: ProjectArtifact[] = [];
    const codeBlockRegex = /```([a-zA-Z0-9_\-]+)?(?:\s+(?:filepath|file)=([^\n]+))?\n([\s\S]*?)```/g;
    let match;
    let index = 1;

    while ((match = codeBlockRegex.exec(rawOutput)) !== null) {
      const language = (match[1] || "text").toLowerCase();
      const customPath = match[2]?.trim();
      const codeContent = match[3];

      let fileType: ProjectArtifact["fileType"] = "markdown";
      let defaultFileName = `phase_${phaseNumber}_artifact_${index}.md`;

      if (language === "typescript" || language === "ts" || language === "tsx") {
        fileType = "typescript";
        defaultFileName = customPath || `src/phase_${phaseNumber}_component_${index}.tsx`;
      } else if (language === "sql") {
        fileType = "sql";
        defaultFileName = customPath || `database/phase_${phaseNumber}_schema.sql`;
      } else if (language === "json") {
        fileType = "json";
        defaultFileName = customPath || `config/phase_${phaseNumber}_spec.json`;
      } else if (language === "yaml" || language === "yml") {
        fileType = "yaml";
        defaultFileName = customPath || `api/phase_${phaseNumber}_spec.yaml`;
      } else if (language === "javascript" || language === "js") {
        fileType = "javascript";
        defaultFileName = customPath || `src/phase_${phaseNumber}_script_${index}.js`;
      }

      artifacts.push({
        id: `artifact-${phaseNumber}-${index}-${Date.now()}`,
        phaseNumber,
        fileName: defaultFileName.split("/").pop() || defaultFileName,
        filePath: defaultFileName,
        fileType,
        content: codeContent.trim(),
        version: 1,
        createdAt: new Date().toISOString(),
        summary: `Generated for Phase ${phaseNumber}: ${phaseTitle}`,
        tags: [language, `phase-${phaseNumber}`]
      });

      index++;
    }

    // If no code blocks were found, treat entire output as a Markdown documentation artifact
    if (artifacts.length === 0 && rawOutput.trim().length > 0) {
      const sanitizedName = phaseTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
      artifacts.push({
        id: `artifact-${phaseNumber}-doc-${Date.now()}`,
        phaseNumber,
        fileName: `${sanitizedName}.md`,
        filePath: `docs/${sanitizedName}.md`,
        fileType: "markdown",
        content: rawOutput.trim(),
        version: 1,
        createdAt: new Date().toISOString(),
        summary: `Phase ${phaseNumber} Complete Specification & Documentation`,
        tags: ["documentation", `phase-${phaseNumber}`]
      });
    }

    return artifacts;
  }
}
