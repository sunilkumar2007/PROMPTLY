import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { 
  Plus, 
  Search, 
  Settings, 
  History, 
  Bookmark, 
  User, 
  Send, 
  Paperclip, 
  Sparkles,
  ChevronDown,
  MoreVertical,
  Share2,
  Download,
  Copy,
  RotateCcw,
  Edit2,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  LayoutGrid,
  Menu,
  X,
  Loader2,
  Code2,
  FileText,
  FolderKanban
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getConversations, getMessages, generateAIResponse } from "@/lib/ai.functions";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { CodeViewer } from "@/components/resource/code-viewer";
import { toast } from "sonner";

// Product Enhancement Modules
import { WorkflowSelector, WorkspaceMode } from "@/components/workspace/workflow-selector";
import { SoftwareCreationWorkflow } from "@/components/software/software-creation-workflow";
import { PromptCreatorWorkflow } from "@/components/prompt-creator/prompt-creator-workflow";
import { UpgradedLibrary } from "@/components/library/upgraded-library";
import { loadProjectsFromStorage } from "@/lib/software-projects.store";

export const Route = createFileRoute("/ai")({
  component: AIWorkspace,
});

function AIWorkspace() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Active View State
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode | "library">("software");
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [selectedModel, setSelectedModel] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Projects stored count
  const storedProjects = loadProjectsFromStorage();

  const { data: conversations, isLoading: isLoadingConversations } = useQuery({
    queryKey: ["ai_conversations"],
    queryFn: () => getConversations(),
    enabled: !!user
  });

  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["ai_messages", activeConversationId],
    queryFn: () => getMessages({ data: { conversationId: activeConversationId! } }),
    enabled: !!activeConversationId
  });

  const generateMutation = useMutation({
    mutationFn: (msg: string) => generateAIResponse({ 
      data: { 
        conversationId: activeConversationId || undefined, 
        message: msg,
        model: selectedModel,
        category: selectedCategory
      } 
    }),
    onSuccess: (data: any) => {
      if (!activeConversationId) {
        setActiveConversationId(data.conversationId || null);
        queryClient.invalidateQueries({ queryKey: ["ai_conversations"] });
      }
      queryClient.invalidateQueries({ queryKey: ["ai_messages", data.conversationId] });
      setInputValue("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to generate response");
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, generateMutation.isPending]);

  const handleSend = () => {
    if (!inputValue.trim() || generateMutation.isPending) return;
    generateMutation.mutate(inputValue);
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-white p-6 text-center">
        <div className="max-w-md space-y-6">
          <h1 className="text-4xl font-black tracking-tighter uppercase">Access Denied</h1>
          <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">
            Sign in to access your Promptly.ai workspace.
          </p>
          <Link to="/" className="inline-block px-10 h-14 leading-[56px] bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-full">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-neutral-900 font-inter selection:bg-slate-900 selection:text-white relative">
      {/* SIDEBAR */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0, x: -20 }}
            animate={{ width: 280, opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: -20 }}
            className="border-r border-slate-200/60 flex flex-col h-full bg-white/70 backdrop-blur-2xl shadow-sm z-30 relative"
          >
            <div className="p-5 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center shadow-md">
                   <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-sora font-semibold text-[15px] tracking-tight text-slate-900">Promptly<span className="text-slate-400 font-normal">.ai</span></span>
              </Link>
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1.5 hover:bg-slate-100 rounded-md transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* WORKFLOW MODE NAVIGATION BUTTONS */}
            <div className="px-4 mb-4 space-y-1.5">
              <button 
                onClick={() => { setWorkspaceMode("software"); setActiveConversationId(null); }}
                className={cn(
                  "w-full flex items-center gap-2.5 h-10 px-3 rounded-xl text-xs font-bold transition-all shadow-2xs",
                  workspaceMode === "software" ? "bg-slate-900 text-white" : "bg-slate-100/80 text-slate-700 hover:bg-slate-200"
                )}
              >
                <Code2 className="w-4 h-4" />
                Build Software
              </button>

              <button 
                onClick={() => { setWorkspaceMode("prompt"); setActiveConversationId(null); }}
                className={cn(
                  "w-full flex items-center gap-2.5 h-10 px-3 rounded-xl text-xs font-bold transition-all shadow-2xs",
                  workspaceMode === "prompt" ? "bg-slate-900 text-white" : "bg-slate-100/80 text-slate-700 hover:bg-slate-200"
                )}
              >
                <Sparkles className="w-4 h-4" />
                Prompt Creator
              </button>
            </div>

            {/* RECENT SOFTWARE PROJECTS QUICK LINKS */}
            <div className="px-4 mb-4 space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Software Projects</span>
                <button
                  onClick={() => {
                    setSelectedProjectId(undefined);
                    setWorkspaceMode("software");
                    toast.info("Starting a new Software Project...");
                  }}
                  className="p-1 hover:bg-slate-100 rounded text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-1 text-[10px] font-bold"
                  title="Create New Software Project"
                >
                  <Plus className="w-3.5 h-3.5" /> New
                </button>
              </div>

              {storedProjects.length > 0 && (
                <div className="space-y-1">
                  {storedProjects.map((p) => {
                    const totalPhases = p.phases?.length || 0;
                    const completedPhases = p.phases?.filter((ph) => ph.status === "Completed").length || 0;
                    const inProgressPhases = p.phases?.filter((ph) => ph.status === "In Progress").length || 0;
                    
                    const isAllDone = totalPhases > 0 && completedPhases === totalPhases;
                    const isInProgress = inProgressPhases > 0 || (completedPhases > 0 && !isAllDone);
                    const isSelected = selectedProjectId === p.id && workspaceMode === "software";

                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedProjectId(p.id);
                          setWorkspaceMode("software");
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-semibold transition-all group",
                          isSelected
                            ? "bg-slate-900 text-white shadow-2xs"
                            : "text-slate-700 hover:bg-slate-100/80"
                        )}
                      >
                        <div className="flex items-center gap-2 truncate min-w-0 pr-1">
                          <FolderKanban className={cn("w-3.5 h-3.5 flex-shrink-0", isSelected ? "text-white" : "text-slate-400")} />
                          <span className="truncate">{p.name}</span>
                        </div>

                        {/* STATUS BADGE */}
                        <span
                          className={cn(
                            "text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 flex items-center gap-1",
                            isAllDone
                              ? isSelected ? "bg-emerald-500/30 text-emerald-200" : "bg-emerald-100 text-emerald-800"
                              : isInProgress
                              ? isSelected ? "bg-amber-500/30 text-amber-200" : "bg-amber-100 text-amber-800"
                              : isSelected ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-500"
                          )}
                        >
                          {isAllDone ? (
                            `✓ Done (${completedPhases}/${totalPhases})`
                          ) : isInProgress ? (
                            `Active (${completedPhases}/${totalPhases})`
                          ) : (
                            `Not Started`
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RECENT CHATS */}
            <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar border-t border-slate-100 pt-3">
              <div className="px-3 py-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">General Chats</span>
              </div>
              {isLoadingConversations ? (
                <div className="p-4 flex justify-center"><Loader2 className="w-4 h-4 animate-spin text-slate-300" /></div>
              ) : conversations?.map((conv: any) => (
                <button
                  key={conv.id}
                  onClick={() => { setWorkspaceMode("chat"); setActiveConversationId(conv.id); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all group",
                    activeConversationId === conv.id && workspaceMode === "chat" ? "bg-white shadow-sm border border-slate-100 text-slate-900 font-bold" : "hover:bg-slate-100/50 text-slate-500 font-medium"
                  )}
                >
                  <History className={cn("w-3.5 h-3.5 flex-shrink-0 transition-colors", activeConversationId === conv.id ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600")} />
                  <span className="text-xs truncate flex-1">{conv.title}</span>
                </button>
              ))}
            </div>

            {/* BOTTOM NAV FOOTER */}
            <div className="p-4 border-t border-slate-200/60 space-y-1 bg-white/30">
               <button 
                onClick={() => setWorkspaceMode("library")}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-xs font-semibold",
                  workspaceMode === "library" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                )}
               >
                 <Bookmark className="w-4 h-4" />
                 <span>Library</span>
               </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative h-full bg-slate-50/50 overflow-y-auto custom-scrollbar">
        {/* HEADER */}
        <header className="h-16 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md border-b border-slate-200/60 z-20 sticky top-0">
          <div className="flex items-center gap-3">
             {!isSidebarOpen && (
               <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-white rounded-xl shadow-sm border border-slate-200/60 bg-white/50 backdrop-blur-md transition-all">
                 <Menu className="w-4 h-4 text-slate-600" />
               </button>
             )}

             <div className="flex items-center gap-2">
               <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider">
                 {workspaceMode === "software" ? "Software Mode" : workspaceMode === "prompt" ? "Prompt Creator" : workspaceMode === "library" ? "Promptly Library" : "General AI Chat"}
               </span>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate({ to: "/profile/$username", params: { username: user.id } })}
              className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md hover:scale-105 transition-transform"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* WORKFLOW SELECTOR HERO BAR (ONLY SHOWN IN GENERAL CHAT MODE) */}
        {workspaceMode === "chat" && !activeConversationId && (
          <div className="pt-4">
            <WorkflowSelector currentMode={workspaceMode as WorkspaceMode} onSelectMode={setWorkspaceMode} />
          </div>
        )}

        {/* RENDER ACTIVE WORKFLOW COMPONENT */}
        <div className="flex-1 pb-24">
          {workspaceMode === "software" && (
            <SoftwareCreationWorkflow key={selectedProjectId || "new"} initialProjectId={selectedProjectId} />
          )}

          {workspaceMode === "prompt" && (
            <PromptCreatorWorkflow />
          )}

          {workspaceMode === "library" && (
            <UpgradedLibrary />
          )}

          {workspaceMode === "chat" && (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
              {messages?.map((msg: any) => (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={cn(
                    "flex flex-col gap-2",
                    msg.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[85%] rounded-[24px] px-6 py-5 shadow-sm",
                    msg.role === "user" 
                      ? "bg-slate-900 text-white rounded-tr-sm" 
                      : "bg-white border border-slate-200/60 text-slate-900 rounded-tl-sm"
                  )}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-slate max-w-none prose-p:text-[15px] prose-p:leading-relaxed prose-code:bg-slate-100 prose-code:text-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md font-medium">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-[15px] font-medium leading-relaxed">{msg.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* FLOATING CHAT INPUT BAR FOR GENERAL CHAT */}
        {workspaceMode === "chat" && (
          <div className="fixed bottom-6 left-0 right-0 px-4 sm:px-6 pointer-events-none z-20 flex justify-center">
             <div className="w-full max-w-3xl space-y-3 pointer-events-auto">
               <div className="relative bg-white/90 backdrop-blur-2xl border border-slate-200/80 rounded-[24px] shadow-xl shadow-slate-200/40 focus-within:border-slate-300 transition-all p-2 flex flex-col">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Message Promptly..."
                    className="w-full bg-transparent border-none outline-none resize-none px-4 pt-4 pb-2 text-[15px] font-medium min-h-[60px] max-h-[200px] placeholder:text-slate-400 custom-scrollbar"
                  />
                  <div className="flex items-center justify-between px-2 pb-1 pt-1">
                     <button 
                       onClick={handleSend}
                       disabled={!inputValue.trim() || generateMutation.isPending}
                       className={cn(
                         "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ml-auto",
                         inputValue.trim() ? "bg-slate-900 text-white shadow-md hover:scale-105" : "bg-slate-100 text-slate-300"
                       )}
                     >
                       <Send className="w-4 h-4 -ml-0.5" />
                     </button>
                  </div>
               </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
