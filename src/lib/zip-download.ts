import { SoftwareProject } from "./software-projects.store";
import { ArtifactEngine } from "./artifact-engine";

// Helper function to create a pure client-side ZIP file from string files without external libraries
export function generateProjectZip(project: SoftwareProject): Blob {
  const files: { path: string; content: string }[] = [];

  // Add Readme
  files.push({
    path: "README.md",
    content: `# ${project.name}\n\n${project.description || "Generated with Promptly AI Project Execution Platform."}\n\n## Tech Stack\n${project.requirements.techStack.join(", ")}\n\n## Phases\n${project.phases.map(p => `- Phase ${p.phaseNumber}: ${p.title} (${p.status})`).join("\n")}\n`
  });

  // Add Package Config
  files.push({
    path: "package.json",
    content: JSON.stringify({
      name: project.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      version: "1.0.0",
      description: project.description || "Project created with Promptly",
      main: "src/index.ts",
      scripts: {
        "dev": "tsx watch src/index.ts",
        "build": "tsc",
        "start": "node dist/index.js",
        "test": "vitest run"
      },
      dependencies: {
        "zod": "^3.24.2",
        "jsonwebtoken": "^9.0.2",
        "express": "^4.21.2",
        "react": "^19.0.0",
        "react-dom": "^19.0.0"
      },
      devDependencies: {
        "typescript": "^5.8.3",
        "@types/node": "^22.15.0",
        "@types/express": "^5.0.0",
        "@types/jsonwebtoken": "^9.0.8",
        "@types/react": "^19.0.0",
        "vitest": "^3.0.0",
        "tsx": "^4.19.4"
      }
    }, null, 2)
  });

  // Add SRS / Requirements Document
  if (project.rawDocumentContent) {
    files.push({
      path: "docs/REQUIREMENTS.md",
      content: project.rawDocumentContent
    });
  }

  // Add Phase Prompts & Real Code Artifacts
  project.phases.forEach((phase) => {
    const slug = phase.title.toLowerCase().replace(/[^a-z0-9]/g, "_");
    
    // Add Phase Prompt
    if (phase.prompt) {
      files.push({
        path: `prompts/phase_${phase.phaseNumber}_${slug}.md`,
        content: phase.prompt
      });

      // Extract all real code artifacts from the prompt
      const artifacts = ArtifactEngine.extractArtifactsFromOutput(phase.phaseNumber, phase.title, phase.prompt);
      artifacts.forEach((art) => {
        if (art.fileType !== "markdown" || art.filePath.endsWith(".md")) {
          files.push({
            path: art.filePath,
            content: art.content
          });
        }
      });
    }
  });

  // Pure JS uncompressed ZIP builder
  const zipParts: Uint8Array[] = [];
  const centralDirectory: Uint8Array[] = [];
  let offset = 0;

  const textEncoder = new TextEncoder();

  files.forEach((file) => {
    const fileNameBytes = textEncoder.encode(file.path);
    const fileContentBytes = textEncoder.encode(file.content);
    const crc = crc32(fileContentBytes);

    // Local file header (30 bytes)
    const localHeader = new Uint8Array(30 + fileNameBytes.length);
    const view = new DataView(localHeader.buffer);

    view.setUint32(0, 0x04034b50, true); // Local file header signature
    view.setUint16(4, 20, true);         // Version needed to extract
    view.setUint16(6, 0, true);          // General purpose bit flag
    view.setUint16(8, 0, true);          // Compression method (0 = store)
    view.setUint16(10, 0, true);         // Last mod file time
    view.setUint16(12, 0, true);         // Last mod file date
    view.setUint32(14, crc, true);       // CRC-32
    view.setUint32(18, fileContentBytes.length, true); // Compressed size
    view.setUint32(22, fileContentBytes.length, true); // Uncompressed size
    view.setUint16(26, fileNameBytes.length, true);    // File name length
    view.setUint16(28, 0, true);         // Extra field length

    localHeader.set(fileNameBytes, 30);

    zipParts.push(localHeader);
    zipParts.push(fileContentBytes);

    // Central directory header (46 bytes)
    const centralHeader = new Uint8Array(46 + fileNameBytes.length);
    const cView = new DataView(centralHeader.buffer);

    cView.setUint32(0, 0x02014b50, true); // Central directory file header signature
    cView.setUint16(4, 20, true);         // Version made by
    cView.setUint16(6, 20, true);         // Version needed to extract
    cView.setUint16(8, 0, true);          // General purpose bit flag
    cView.setUint16(10, 0, true);         // Compression method (0 = store)
    cView.setUint16(12, 0, true);         // Last mod file time
    cView.setUint16(14, 0, true);         // Last mod file date
    cView.setUint32(16, crc, true);       // CRC-32
    cView.setUint32(20, fileContentBytes.length, true); // Compressed size
    cView.setUint32(24, fileContentBytes.length, true); // Uncompressed size
    cView.setUint16(28, fileNameBytes.length, true);    // File name length
    cView.setUint16(30, 0, true);         // Extra field length
    cView.setUint16(32, 0, true);         // File comment length
    cView.setUint16(34, 0, true);         // Disk number start
    cView.setUint16(36, 0, true);         // Internal file attributes
    cView.setUint32(38, 0, true);         // External file attributes
    cView.setUint32(42, offset, true);    // Relative offset of local header

    centralHeader.set(fileNameBytes, 46);
    centralDirectory.push(centralHeader);

    offset += localHeader.length + fileContentBytes.length;
  });

  const centralDirOffset = offset;
  let centralDirSize = 0;

  centralDirectory.forEach((cd) => {
    zipParts.push(cd);
    centralDirSize += cd.length;
  });

  // End of central directory record (22 bytes)
  const eocd = new Uint8Array(22);
  const eView = new DataView(eocd.buffer);

  eView.setUint32(0, 0x06054b50, true); // End of central dir signature
  eView.setUint16(4, 0, true);          // Number of this disk
  eView.setUint16(6, 0, true);          // Disk where central directory starts
  eView.setUint16(8, files.length, true);  // Number of central directory records on this disk
  eView.setUint16(10, files.length, true); // Total number of central directory records
  eView.setUint32(12, centralDirSize, true); // Size of central directory
  eView.setUint32(16, centralDirOffset, true); // Offset of start of central directory
  eView.setUint16(20, 0, true);          // ZIP comment length

  zipParts.push(eocd);

  return new Blob(zipParts as BlobPart[], { type: "application/zip" });
}

export function triggerZipDownload(project: SoftwareProject): void {
  const zipBlob = generateProjectZip(project);
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}_code.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}
