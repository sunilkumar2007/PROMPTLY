import { useState } from "react";
import { FileCode, FileJson, FileText, ChevronRight, ChevronDown, FolderOpen, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeViewer } from "./code-viewer";

export interface ProjectFile {
  filename: string;
  extension: string;
  language: string;
  content: string;
}

interface FileExplorerProps {
  files: ProjectFile[];
}

export function FileExplorer({ files }: FileExplorerProps) {
  const [activeFile, setActiveFile] = useState<ProjectFile | null>(files[0] || null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!files || files.length === 0 || !activeFile) return null;

  const getFileIcon = (extension: string) => {
    switch (extension.toLowerCase()) {
      case '.jsx':
      case '.tsx':
      case '.js':
      case '.ts':
        return <FileCode className="w-4 h-4 text-blue-400" />;
      case '.json':
        return <FileJson className="w-4 h-4 text-yellow-400" />;
      default:
        return <FileText className="w-4 h-4 text-neutral-400" />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-[500px] bg-[#0a0a0a] rounded-[24px] overflow-hidden border border-white/10 shadow-2xl">
      
      {/* Sidebar - File Tree */}
      <div className={cn(
        "flex flex-col border-r border-white/5 transition-all duration-300 bg-[#0f0f0f]",
        isSidebarOpen ? "w-full md:w-64" : "w-0 md:w-12 overflow-hidden"
      )}>
        {/* Sidebar Header */}
        <div 
          className="h-14 flex items-center px-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 text-white/70 font-mono text-xs uppercase tracking-widest font-bold">
                <FolderOpen className="w-4 h-4" />
                <span>EXPLORER</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(false); }}
                className="text-white/50 hover:text-white transition-colors p-1"
                title="Close Explorer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center justify-center w-full">
              <ChevronRight className="w-5 h-5 text-white/50" />
            </div>
          )}
        </div>

        {/* Sidebar Content */}
        <div className={cn(
          "flex-1 overflow-y-auto custom-scrollbar py-2",
          !isSidebarOpen && "hidden md:hidden"
        )}>
          {files.map((file) => (
            <button
              key={file.filename}
              onClick={() => setActiveFile(file)}
              className={cn(
                "w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition-colors font-mono relative",
                activeFile.filename === file.filename 
                  ? "bg-white/10 text-white" 
                  : "text-white/50 hover:bg-white/5 hover:text-white/80"
              )}
            >
              {activeFile.filename === file.filename && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500" />
              )}
              {getFileIcon(file.extension)}
              <span className="truncate">{file.filename}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - Code Viewer */}
      <div className="flex-1 min-w-0 flex flex-col bg-[#0a0a0a]">
        <CodeViewer 
          code={activeFile.content} 
          filename={activeFile.filename}
          language={activeFile.language.toLowerCase()}
          inExplorer={true}
        />
      </div>
    </div>
  );
}
