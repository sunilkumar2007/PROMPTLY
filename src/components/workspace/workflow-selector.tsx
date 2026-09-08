import React from "react";
import { Code2, Sparkles, MessageSquare, ArrowRight, Layers, FileText, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type WorkspaceMode = "software" | "prompt" | "chat";

interface WorkflowSelectorProps {
  currentMode: WorkspaceMode;
  onSelectMode: (mode: WorkspaceMode) => void;
}

export const WorkflowSelector: React.FC<WorkflowSelectorProps> = ({
  currentMode,
  onSelectMode
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full text-[11px] font-semibold uppercase tracking-widest shadow-sm mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Promptly.ai Platform
        </div>
        <h1 className="text-3xl sm:text-4xl font-sora font-bold text-slate-900 tracking-tight">
          What would you like to build today?
        </h1>
        <p className="text-sm font-medium text-slate-500 max-w-xl mx-auto">
          Choose a workflow below to transform requirements or natural ideas into production-ready prompts and execution roadmaps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* BUILD SOFTWARE CARD */}
        <div
          onClick={() => onSelectMode("software")}
          className={cn(
            "group relative p-6 sm:p-8 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden",
            currentMode === "software"
              ? "bg-slate-900 text-white border-slate-900 shadow-xl ring-2 ring-slate-900/20 scale-[1.01]"
              : "bg-white text-slate-900 border-slate-200/80 hover:border-slate-400 hover:shadow-lg"
          )}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                currentMode === "software" ? "bg-white/10 text-white" : "bg-slate-100 text-slate-900 group-hover:bg-slate-900 group-hover:text-white"
              )}>
                <Code2 className="w-6 h-6" />
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full",
                currentMode === "software" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
              )}>
                SRS to Roadmap
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-sora font-bold tracking-tight mb-2">Build Software</h2>
              <p className={cn("text-xs sm:text-sm font-medium leading-relaxed", currentMode === "software" ? "text-slate-300" : "text-slate-500")}>
                Turn your SRS, PRD, or project requirements into a complete phased development plan with 23-section context-aware production prompts.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-medium">
              <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-lg", currentMode === "software" ? "bg-white/10 text-slate-200" : "bg-slate-50 text-slate-600")}>
                <FileText className="w-3 h-3" /> SRS / PRD Parser
              </span>
              <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-lg", currentMode === "software" ? "bg-white/10 text-slate-200" : "bg-slate-50 text-slate-600")}>
                <Layers className="w-3 h-3" /> Dependency Engine
              </span>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-current/10 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Start Software Project</span>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1",
              currentMode === "software" ? "bg-white text-slate-900" : "bg-slate-900 text-white"
            )}>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* PROMPT CREATOR CARD */}
        <div
          onClick={() => onSelectMode("prompt")}
          className={cn(
            "group relative p-6 sm:p-8 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden",
            currentMode === "prompt"
              ? "bg-slate-900 text-white border-slate-900 shadow-xl ring-2 ring-slate-900/20 scale-[1.01]"
              : "bg-white text-slate-900 border-slate-200/80 hover:border-slate-400 hover:shadow-lg"
          )}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                currentMode === "prompt" ? "bg-white/10 text-white" : "bg-slate-100 text-slate-900 group-hover:bg-slate-900 group-hover:text-white"
              )}>
                <Sparkles className="w-6 h-6" />
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full",
                currentMode === "prompt" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
              )}>
                Idea to Prompt
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-sora font-bold tracking-tight mb-2">Prompt Creator</h2>
              <p className={cn("text-xs sm:text-sm font-medium leading-relaxed", currentMode === "prompt" ? "text-slate-300" : "text-slate-500")}>
                Turn your idea into an optimized AI prompt for coding, UI/UX, business, marketing, image generation, research, and more.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-medium">
              <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-lg", currentMode === "prompt" ? "bg-white/10 text-slate-200" : "bg-slate-50 text-slate-600")}>
                16 Smart Categories
              </span>
              <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-lg", currentMode === "prompt" ? "bg-white/10 text-slate-200" : "bg-slate-50 text-slate-600")}>
                Quality Score & Remix
              </span>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-current/10 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Create a Prompt</span>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1",
              currentMode === "prompt" ? "bg-white text-slate-900" : "bg-slate-900 text-white"
            )}>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* MODE TABS BAR */}
      <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-200/50 backdrop-blur-md rounded-2xl max-w-md mx-auto">
        <button
          onClick={() => onSelectMode("software")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all",
            currentMode === "software" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
          )}
        >
          <Code2 className="w-3.5 h-3.5" /> Software Mode
        </button>
        <button
          onClick={() => onSelectMode("prompt")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all",
            currentMode === "prompt" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
          )}
        >
          <Sparkles className="w-3.5 h-3.5" /> Prompt Creator
        </button>
        <button
          onClick={() => onSelectMode("chat")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all",
            currentMode === "chat" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
          )}
        >
          <MessageSquare className="w-3.5 h-3.5" /> General Chat
        </button>
      </div>
    </div>
  );
};
