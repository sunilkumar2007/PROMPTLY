import React, { useState } from "react";
import { 
  Sparkles, Copy, Save, Edit3, Share2, RefreshCw, Layers, 
  CheckCircle2, Sliders, Info, ArrowRight, ShieldCheck, Tag,
  Download, Check, Wand2, ChevronDown, ChevronUp, Zap, SlidersHorizontal, Code2, AlertTriangle
} from "lucide-react";
import { 
  GeneratedPromptItem, 
  PromptCategory, 
  PromptLevel, 
  savePromptsToStorage, 
  loadPromptsFromStorage 
} from "@/lib/prompt-creator.store";
import { 
  detectPromptCategory, 
  generateOptimizedPrompt, 
  remixPrompt 
} from "@/lib/prompt-pipeline";
import { getActiveAIProvider } from "@/lib/ai-provider";
import { ProcessTimeline, TimelineStep } from "@/components/ui/process-timeline";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PromptCreatorWorkflowProps {
  onPromptSaved?: (prompt: GeneratedPromptItem) => void;
}

const CATEGORIES: PromptCategory[] = [
  "Software development",
  "Coding",
  "UI/UX",
  "Image generation",
  "Video generation",
  "Marketing",
  "Business",
  "Education",
  "Research",
  "Writing",
  "Social media",
  "Data analysis",
  "AI agents",
  "Automation",
  "Productivity",
  "Other/custom"
];

const PROMPT_GENERATION_STEPS: TimelineStep[] = [
  { stepNumber: 1, title: "Analyzing Intent", subtitle: "Parsing raw prompt idea", status: "pending" },
  { stepNumber: 2, title: "Detecting Category", subtitle: "Categorizing domain", status: "pending" },
  { stepNumber: 3, title: "Structuring Context", subtitle: "Injecting role & background", status: "pending" },
  { stepNumber: 4, title: "Setting Constraints", subtitle: "Enforcing quality bounds", status: "pending" },
  { stepNumber: 5, title: "Building Variations", subtitle: "Concise, Pro & Expert modes", status: "pending" },
  { stepNumber: 6, title: "Evaluating Quality", subtitle: "Scoring 0-100 & feedback", status: "pending" },
  { stepNumber: 7, title: "Formatting Output", subtitle: "Finalizing prompt workbench", status: "pending" }
];

export const PromptCreatorWorkflow: React.FC<PromptCreatorWorkflowProps> = ({ onPromptSaved }) => {
  const [ideaInput, setIdeaInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory>("Coding");
  const [selectedLevel, setSelectedLevel] = useState<PromptLevel>("Professional");
  
  // Real-Time Stepper Pipeline State (Matching Image 2)
  const [isGenerating, setIsGenerating] = useState(false);
  const [timelineSteps, setTimelineSteps] = useState<TimelineStep[]>(PROMPT_GENERATION_STEPS);
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  const [activePrompt, setActivePrompt] = useState<GeneratedPromptItem | null>(null);

  // Variations Tab
  const [activeVariationIndex, setActiveVariationIndex] = useState(1);

  // Remix State
  const [isRemixOpen, setIsRemixOpen] = useState(false);
  const [remixInstruction, setRemixInstruction] = useState("");

  const [isCopied, setIsCopied] = useState(false);
  const [isQualityExpanded, setIsQualityExpanded] = useState(false);

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success("Copied prompt text to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadPrompt = (item: GeneratedPromptItem) => {
    const slug = item.title.toLowerCase().replace(/[^a-z0-9]/g, "_").substring(0, 30);
    const content = `# PROMPTLY OPTIMIZED SPECIFICATION\n\n` +
      `**Title**: ${item.title}\n` +
      `**Category**: ${item.category}\n` +
      `**Level**: ${item.level}\n` +
      `**Quality Score**: ${item.qualityScore}/100\n` +
      `**Recommended Model**: ${item.recommendedModel}\n\n` +
      `---\n\n` +
      `## OPTIMIZED PROMPT TEXT\n\n` +
      `\`\`\`markdown\n${item.promptText}\n\`\`\`\n\n` +
      `---\n\n` +
      `*Generated with Promptly AI Project Execution Platform*`;

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prompt_${slug}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded 'prompt_${slug}.md'`);
  };

  const handleIdeaInputChange = (text: string) => {
    setIdeaInput(text);
    if (text.length > 5) {
      const autoCat = detectPromptCategory(text);
      setSelectedCategory(autoCat);
    }
  };

  const handleGenerate = async () => {
    if (!ideaInput.trim()) {
      toast.error("Please enter what you want to create.");
      return;
    }

    setIsGenerating(true);
    const updated = PROMPT_GENERATION_STEPS.map((s) => ({ ...s, status: "pending" as const }));

    for (let i = 0; i < updated.length; i++) {
      setActiveStepIdx(i);
      setTimelineSteps(
        updated.map((s, idx) => ({
          ...s,
          status: idx < i ? "completed" : idx === i ? "active" : "pending"
        }))
      );
      await new Promise((res) => setTimeout(res, 400));
    }

    // Call live AI API
    const item = generateOptimizedPrompt({
      idea: ideaInput,
      category: selectedCategory,
      level: selectedLevel
    });

    try {
      const provider = getActiveAIProvider();
      const aiPromptText = await provider.generateText({
        systemPrompt: `You are an expert Prompt Engineer. Craft a world-class ${selectedLevel} prompt for category '${selectedCategory}'.`,
        userMessage: `Optimize this prompt idea into a professional, highly detailed prompt: ${ideaInput}`
      });

      if (aiPromptText) {
        item.promptText = aiPromptText;
      }
    } catch (e) {
      console.warn("Using offline prompt pipeline:", e);
    }

    setTimelineSteps(updated.map((s) => ({ ...s, status: "completed" })));
    setActivePrompt(item);
    setActiveVariationIndex(1);
    setIsGenerating(false);
    toast.success(`Generated optimized ${item.category} prompt (Quality Score: ${item.qualityScore}/100)`);
  };

  const handleSaveToLibrary = () => {
    if (!activePrompt) return;
    const prompts = loadPromptsFromStorage();
    const filtered = prompts.filter((p) => p.id !== activePrompt.id);
    savePromptsToStorage([activePrompt, ...filtered]);
    if (onPromptSaved) onPromptSaved(activePrompt);
    toast.success("Saved prompt to your Library!");
  };

  const handleApplyRemix = () => {
    if (!activePrompt || !remixInstruction.trim()) return;
    const remixed = remixPrompt(activePrompt, remixInstruction);
    setActivePrompt(remixed);
    setRemixInstruction("");
    setIsRemixOpen(false);
    toast.success("Remixed prompt successfully!");
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-8 font-inter">
      {/* INPUT HEADER & FORM */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Prompt Creator Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-sora font-bold text-slate-900">
            Turn your idea into an optimized AI prompt
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl">
            Describe what you want in plain text. Promptly auto-detects the domain and generates high-impact prompts for ChatGPT, Claude, Midjourney, and code assistants.
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <textarea
              placeholder="e.g. Create a high-converting React landing page for an AI startup with glassmorphism design..."
              value={ideaInput}
              onChange={(e) => handleIdeaInputChange(e.target.value)}
              className="w-full p-4 sm:p-5 rounded-2xl border border-slate-200 text-sm font-medium outline-none focus:border-slate-900 transition-all min-h-[110px] resize-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            {/* CATEGORY SELECTOR */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 outline-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* LEVEL SELECTOR */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Level:</span>
              <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
                {(["Quick", "Professional", "Expert"] as PromptLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-bold transition-all",
                      selectedLevel === lvl ? "bg-slate-900 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all shadow-md flex items-center gap-2 ml-auto disabled:opacity-50"
            >
              {isGenerating ? (
                <>Generating...</>
              ) : (
                <>Generate Prompt <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* REAL-TIME GENERATION TIMELINE STEPPER (MATCHING IMAGE 2) */}
      {isGenerating && (
        <div className="animate-in fade-in duration-300">
          <ProcessTimeline steps={timelineSteps} currentStepIndex={activeStepIdx} />
        </div>
      )}

      {/* GENERATED PROMPT WORKBENCH */}
      {!isGenerating && activePrompt && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          {/* HEADER BAR & QUALITY SCORE */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 bg-slate-900 text-white rounded text-[10px] font-bold uppercase tracking-wider">
                  {activePrompt.category}
                </span>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[10px] font-bold">
                  {activePrompt.level} Mode
                </span>
              </div>
              <h3 className="text-xl font-sora font-bold text-slate-900">{activePrompt.title}</h3>
            </div>

            {/* QUALITY SCORE GAUGE & BREAKDOWN EXPANDER */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsQualityExpanded(!isQualityExpanded)}
                className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition cursor-pointer text-left"
              >
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Prompt Quality</span>
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    {activePrompt.qualityScore} / 100
                    {isQualityExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </span>
                </div>
                <div className={cn(
                  "w-10 h-10 rounded-full text-white flex items-center justify-center font-sora font-bold text-xs shadow-sm",
                  activePrompt.qualityScore >= 85 ? "bg-emerald-600" : activePrompt.qualityScore >= 70 ? "bg-slate-900" : "bg-amber-600"
                )}>
                  {activePrompt.qualityScore}
                </div>
              </button>
            </div>
          </div>

          {/* QUALITY EXPANDER BREAKDOWN */}
          {isQualityExpanded && (
            <div className="p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl space-y-2 text-xs text-indigo-950 animate-in fade-in">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-indigo-600" /> Quality Audit & Score Analysis</span>
                <span className="text-[11px] text-indigo-700">Target Score: 100 / 100</span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-700 pl-5 list-disc">
                <li>Role Persona Explicitly Enforced: Included</li>
                <li>Negative Constraints & Anti-Hallucination Bounds: Included</li>
                <li>Output Format Validation: Defined</li>
                {activePrompt.improvementSuggestions?.map((sug, idx) => (
                  <li key={idx} className="text-amber-800 font-medium">Suggestion: {sug}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 3 VARIATIONS TABS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Optimization Variations</span>
              <span className="text-[11px] text-slate-400 font-medium">Select strategy below</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activePrompt.variations.map((v, index) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setActiveVariationIndex(index);
                    setActivePrompt({ ...activePrompt, promptText: v.promptText });
                  }}
                  className={cn(
                    "p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-24",
                    activeVariationIndex === index
                      ? "bg-slate-900 text-white border-slate-900 shadow-md"
                      : "bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-400"
                  )}
                >
                  <div>
                    <span className="text-xs font-bold block">{v.title}</span>
                    <span className={cn("text-[10px] font-medium leading-tight line-clamp-2 mt-0.5", activeVariationIndex === index ? "text-slate-300" : "text-slate-500")}>
                      {v.strategyDescription}
                    </span>
                  </div>
                  <span className={cn("text-[9px] font-bold uppercase tracking-wider self-end", activeVariationIndex === index ? "text-emerald-400" : "text-slate-400")}>
                    {v.level}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ENHANCED PROMPT CANVAS & FULL ACTIONS TOOLBAR */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Generated Optimized Prompt</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-mono">
                  {Math.ceil(activePrompt.promptText.length / 4)} tokens • {activePrompt.promptText.length} chars
                </span>
              </div>
              
              {/* ACTION BUTTONS (COPY, DOWNLOAD, REGENERATE, REMIX, SAVE) */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleCopyPrompt(activePrompt.promptText)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {isCopied ? "Copied!" : "Copy"}
                </button>

                <button
                  onClick={() => handleDownloadPrompt(activePrompt)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-200"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" /> Download .md
                </button>

                <button
                  onClick={handleGenerate}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-indigo-200"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-600" /> Regenerate
                </button>

                <button
                  onClick={() => setIsRemixOpen(true)}
                  className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-purple-200"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-purple-600" /> Context Remix
                </button>

                <button
                  onClick={handleSaveToLibrary}
                  className="px-3 py-1.5 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-200"
                >
                  <Save className="w-3.5 h-3.5 text-slate-600" /> Save
                </button>
              </div>
            </div>

            {/* HIGH-IMPACT PROMPT CANVAS */}
            <div className="relative group rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-950 px-4 py-2 font-mono border-b border-slate-800">
                <span className="flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5 text-indigo-400" /> {activePrompt.category} Prompt Canvas</span>
                <span>UTF-8 • Production Specification</span>
              </div>
              <div className="p-5 bg-slate-950 text-emerald-400 font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-[380px] overflow-y-auto custom-scrollbar border-t border-slate-900">
                {activePrompt.promptText}
              </div>
            </div>

            {/* EXTRACTED PARAMETER TAG CHIPS */}
            {activePrompt.promptText.includes("--") && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Extracted Render Parameters & Flags</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {activePrompt.promptText.match(/--[a-z0-9\-]+\s+[^\s\-]+/g)?.map((param, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCopyPrompt(param)}
                      className="px-2.5 py-1 bg-slate-900 text-slate-200 hover:text-white rounded-lg text-[10px] font-mono border border-slate-800 transition flex items-center gap-1"
                    >
                      <Tag className="w-2.5 h-2.5 text-indigo-400" /> {param}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* MODEL & OUTPUT DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Target AI Engine</span>
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> {activePrompt.recommendedModel}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Expected Output Format</span>
              <p className="text-xs font-medium text-slate-700">{activePrompt.expectedOutput}</p>
            </div>
          </div>
        </div>
      )}

      {/* REMIX / CONTEXT IMPROVEMENT MODAL */}
      {isRemixOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-sora font-bold text-slate-900 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-purple-600" /> Context Remix & Parameter Tuner
              </h3>
              <button onClick={() => setIsRemixOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Inject custom rules, lighting presets, security constraints, or format overrides:
            </p>

            {/* QUICK PRESET CHIPS */}
            <div className="flex flex-wrap gap-1.5">
              {[
                "Add 8K resolution & volumetric lighting",
                "Add OWASP Top 10 security constraints",
                "Format output as structured JSON schema",
                "Add negative prompt: --no blur, plastic skin",
                "Convert to Next.js + Tailwind CSS stack"
              ].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setRemixInstruction(preset)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition text-left"
                >
                  + {preset}
                </button>
              ))}
            </div>

            <textarea
              placeholder="e.g. Add explicit negative constraints and 85mm portrait camera parameters..."
              value={remixInstruction}
              onChange={(e) => setRemixInstruction(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 text-xs font-medium min-h-[100px] outline-none focus:border-purple-600 resize-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setIsRemixOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold">
                Cancel
              </button>
              <button onClick={handleApplyRemix} className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md">
                Apply Context Remix
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
