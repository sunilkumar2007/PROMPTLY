import React, { useState } from "react";
import { MessageSquare, Send, Sparkles, AlertTriangle, Shield, Check, X, Bot, User, Layers, Cpu } from "lucide-react";
import { SoftwareProject } from "@/lib/software-projects.store";
import { ProjectMemoryEngine } from "@/lib/project-memory";
import { ImpactEngine, ComprehensiveImpactReport } from "@/lib/impact-engine";
import { multiAPIRouter } from "@/lib/multi-api-router";
import { toast } from "sonner";

interface ProjectChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: SoftwareProject;
  onApplyImpactAction?: (report: ComprehensiveImpactReport) => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "promptly";
  text: string;
  timestamp: string;
  impactReport?: ComprehensiveImpactReport;
}

export const ProjectChatDrawer: React.FC<ProjectChatDrawerProps> = ({
  isOpen,
  onClose,
  project,
  onApplyImpactAction
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-msg",
      sender: "promptly",
      text: `Hello! I am your **Promptly Project Brain Assistant** for **"${project.name}"**.\n\nYou can ask me questions about your architecture, requirements, decisions, or suggest changes to analyze downstream ripple effects.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isThinking) return;

    const userText = inputText.trim();
    setInputText("");

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    const memory = ProjectMemoryEngine.loadMemory(project.id, project.name);
    const lower = userText.toLowerCase();

    // Check if user is suggesting a change (triggers Impact Analysis)
    const isChangeIntent = lower.includes("change") || lower.includes("switch") || lower.includes("replace") || lower.includes("update") || lower.includes("instead of");

    try {
      if (isChangeIntent) {
        // Run Impact Engine
        const changeType = lower.includes("auth") ? "AUTH" : lower.includes("database") || lower.includes("sql") ? "DATABASE" : lower.includes("payment") ? "PAYMENT" : "CUSTOM";
        const impactReport = ImpactEngine.analyzeChangeImpact(project, userText, changeType);

        const replyText = `### ⚠️ Impact Analysis Detected for: "${userText}"\n\n` +
          `**Severity Level**: \`${impactReport.severity}\`\n\n` +
          `**Affected Downstream Phases**: ${impactReport.affectedPhases.length > 0 ? impactReport.affectedPhases.map(p => `Phase ${p.phaseNumber} (${p.phaseTitle})`).join(", ") : "None detected"}\n\n` +
          `**Affected Artifacts**: ${impactReport.affectedArtifactPaths.length > 0 ? impactReport.affectedArtifactPaths.join(", ") : "None"}\n\n` +
          `**Proposed Change Plan**:\n${impactReport.changePlanSummary.map(s => `- ${s}`).join("\n")}`;

        setMessages(prev => [
          ...prev,
          {
            id: `reply-${Date.now()}`,
            sender: "promptly",
            text: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            impactReport
          }
        ]);
        ProjectMemoryEngine.logActivity(project.id, project.name, "IMPACT_ANALYSIS_RUN", `Impact analysis requested for "${userText}"`, "USER");
      } else {
        // Query Project Memory Context
        const contextPayload = `PROJECT MEMORY:\n` +
          `- Objective: ${project.requirements.objective}\n` +
          `- Tech Stack: ${project.requirements.techStack.join(", ")}\n` +
          `- Decisions: ${memory.decisions.map(d => `${d.title} (${d.rationale})`).join("; ")}\n` +
          `- Requirements: ${project.requirements.functionalRequirements.slice(0, 5).join("; ")}\n` +
          `- Total Phases: ${project.phases.length}`;

        const aiResponse = await multiAPIRouter.executeSingleModel({
          modelId: "gemini-2-0-flash",
          rolePrompt: "You are the Promptly Project Brain Assistant. Answer the user's inquiry accurately using the project memory and architectural decisions.",
          contextData: contextPayload,
          taskPrompt: userText
        });

        setMessages(prev => [
          ...prev,
          {
            id: `reply-${Date.now()}`,
            sender: "promptly",
            text: aiResponse.output,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ]);
      }
    } catch (e: any) {
      toast.error(`Assistant error: ${e.message || "Could not complete query"}`);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sora font-bold text-sm">Project Brain Intelligence Chat</h3>
              <p className="text-[11px] text-slate-300 font-mono">Memory Grounded • Impact Aware</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar bg-slate-50/50">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              {m.sender === "promptly" && (
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5 border border-purple-200">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                m.sender === "user"
                  ? "bg-slate-900 text-white rounded-tr-none"
                  : "bg-white text-slate-800 border border-slate-200/80 shadow-2xs rounded-tl-none whitespace-pre-wrap font-sans"
              }`}>
                <div>{m.text}</div>
                {m.impactReport && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-700 uppercase">Ripple Action Ready</span>
                    {onApplyImpactAction && (
                      <button
                        onClick={() => {
                          onApplyImpactAction(m.impactReport!);
                          toast.success("Applied impact plan to project roadmap!");
                          onClose();
                        }}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-[11px]"
                      >
                        Apply Change Plan
                      </button>
                    )}
                  </div>
                )}
                <div className={`text-[9px] font-mono mt-1 ${m.sender === "user" ? "text-slate-400 text-right" : "text-slate-400"}`}>
                  {m.timestamp}
                </div>
              </div>
              {m.sender === "user" && (
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-purple-700 font-bold p-3 bg-purple-50 rounded-xl border border-purple-200 w-fit">
              <Sparkles className="w-4 h-4 animate-spin text-purple-600" /> Querying Project Brain Memory...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask about project architecture, or propose a change..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-purple-600 outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            className="p-2.5 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 rounded-xl transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
