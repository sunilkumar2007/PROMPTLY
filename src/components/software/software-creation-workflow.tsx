import React, { useState, useEffect } from "react";
import { 
  FileText, Upload, Trash2, CheckCircle2, ArrowRight, Layers, 
  Settings, Copy, RefreshCw, AlertTriangle, Plus, Edit3, Eye, 
  History, Sparkles, Code, Check, X, HelpCircle, ChevronRight, ChevronDown, Loader2,
  Image as ImageIcon, Cpu, Play, FastForward, CheckCircle, AlertCircle, ArrowLeft, Download, FileCode 
} from "lucide-react";
import { 
  SoftwareProject, 
  ProjectPhase, 
  ExtractedRequirements, 
  RequirementQuestion,
  saveProjectsToStorage, 
  loadProjectsFromStorage 
} from "@/lib/software-projects.store";
import { triggerZipDownload } from "@/lib/zip-download";
import { ArtifactEngine, ProjectArtifact } from "@/lib/artifact-engine";
import { 
  parseFileDocument, 
  analyzeSRSRequirements, 
  extractMissingRequirementQuestions,
  planExactNPhases,
  generateSinglePhasePromptWithAPI,
  performImpactAnalysis,
  ExecutionMode
} from "@/lib/software-pipeline";
import { MultiAPISettingsModal } from "./multi-api-settings-modal";
import { ProjectChatDrawer } from "@/components/chat/project-chat-drawer";
import { ArtifactDiffModal } from "@/components/artifacts/artifact-diff-modal";
import { ProjectMemoryEngine } from "@/lib/project-memory";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SoftwareCreationWorkflowProps {
  initialProjectId?: string;
  onProjectSaved?: (project: SoftwareProject) => void;
}

const AI_MODELS = [
  "Concurrent Multi-API Ensemble (Claude + GPT + Gemini)",
  "Claude 3.5 Sonnet (Anthropic)",
  "GPT-4o (OpenAI)",
  "Gemini 2.0 Flash (Google)",
  "Gemini 1.5 Pro (Google)",
  "DeepSeek R1 (Reasoning)",
  "DeepSeek V3 (Coding)",
  "Promptly Intelligent Simulator"
];

export const SoftwareCreationWorkflow: React.FC<SoftwareCreationWorkflowProps> = ({ initialProjectId, onProjectSaved }) => {
  // WORKFLOW STAGE CONTROLLER
  const [workflowStage, setWorkflowStage] = useState<
    "create" | "questions" | "granularity" | "generating" | "completion" | "portal"
  >("create");

  // Multi-API Settings Modal State
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [activeExecutionMode, setActiveExecutionMode] = useState<ExecutionMode>("generate");
  const [isRerunningPhase, setIsRerunningPhase] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);
  const [diffTargetPhase, setDiffTargetPhase] = useState<ProjectPhase | null>(null);

  // Step 1 Inputs
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedAiModel, setSelectedAiModel] = useState("Claude 3.5 Sonnet");
  const [pastedText, setPastedText] = useState("");
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number; content: string } | null>(null);
  const [uploadedImage, setUploadedImage] = useState<{ name: string; url: string } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Step 2 Questions State
  const [questions, setQuestions] = useState<RequirementQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  // Step 3 Phase Count State
  const [selectedPhaseCount, setSelectedPhaseCount] = useState<number>(5);
  const [customPhaseInput, setCustomPhaseInput] = useState<string>("");

  // Step 4 Sequential API Generation State
  const [generatingPhases, setGeneratingPhases] = useState<ProjectPhase[]>([]);
  const [activeGeneratingIdx, setActiveGeneratingIdx] = useState<number>(0);
  const [generationErrorPhaseIdx, setGenerationErrorPhaseIdx] = useState<number | null>(null);

  // Active Project State
  const [currentProject, setCurrentProject] = useState<SoftwareProject | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<ProjectPhase | null>(null);
  const [selectedArtifactIdx, setSelectedArtifactIdx] = useState<number>(0);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [editedPromptText, setEditedPromptText] = useState("");
  const [newRequirementInput, setNewRequirementInput] = useState("");
  const [showPortalHeaderActions, setShowPortalHeaderActions] = useState(false);

  // Load existing project if initialProjectId is supplied
  useEffect(() => {
    if (initialProjectId) {
      const allProjects = loadProjectsFromStorage();
      const found = allProjects.find((p) => p.id === initialProjectId);
      if (found) {
        setCurrentProject(found);
        setGeneratingPhases(found.phases);
        setSelectedPhase(found.phases[0] || null);

        if (found.status === "READY_TO_BUILD") {
          setWorkflowStage("portal");
        } else {
          setWorkflowStage("completion");
        }
      }
    }
  }, [initialProjectId]);

  // File Upload Handlers
  const handleFileUpload = async (file: File) => {
    try {
      const parsed = await parseFileDocument(file);
      setUploadedFile({
        name: parsed.fileName,
        size: parsed.fileSize,
        content: parsed.content
      });
      toast.success(`Uploaded document '${file.name}'`);
    } catch (e: any) {
      toast.error(e.message || "Invalid file format");
    }
  };

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (.png, .jpg, .webp)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage({
        name: file.name,
        url: e.target?.result as string
      });
      toast.success(`Uploaded design screenshot '${file.name}'`);
    };
    reader.readAsDataURL(file);
  };

  // STAGE A - STEP 1: Upload Requirements -> Understand & Generate Questions
  const handleProcessUploadAndGenerateQuestions = () => {
    const rawContent = uploadedFile?.content || pastedText.trim();
    if (!rawContent && !projectName && !uploadedImage) {
      toast.error("Please enter a project name or upload an SRS document.");
      return;
    }

    const reqs = analyzeSRSRequirements(rawContent || projectName || "Task Management Application", projectName);
    const dynamicQuestions = extractMissingRequirementQuestions(rawContent, reqs.projectName);

    const initialAns: Record<string, string> = {};
    dynamicQuestions.forEach((q) => {
      initialAns[q.question] = q.selectedAnswer || q.options[0];
    });

    const newProj: SoftwareProject = {
      id: `proj-${Date.now()}`,
      name: projectName || reqs.projectName,
      description: projectDescription || reqs.objective,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "DRAFT_PROMPT_GEN",
      targetAiModel: selectedAiModel,
      referenceImageUrl: uploadedImage?.url,
      referenceImageName: uploadedImage?.name,
      rawDocumentName: uploadedFile?.name,
      rawDocumentContent: rawContent,
      requirements: reqs,
      questions: dynamicQuestions,
      userAnswers: initialAns,
      requirementsConfirmed: false,
      granularity: 5,
      phases: [],
      progress: 0
    };

    setCurrentProject(newProj);
    setQuestions(dynamicQuestions);
    setUserAnswers(initialAns);
    setWorkflowStage("questions");
    toast.success("Requirements analyzed! Answer a few details to refine prompt generation.");
  };

  // STAGE A - STEP 2: Submit User Answers
  const handleSubmitUserAnswers = () => {
    if (!currentProject) return;
    const updatedProj: SoftwareProject = {
      ...currentProject,
      userAnswers,
      requirementsConfirmed: true,
      updatedAt: new Date().toISOString()
    };
    setCurrentProject(updatedProj);
    setWorkflowStage("granularity");
    toast.success("Requirements Ready ✓ Select development phase count.");
  };

  // STAGE A - STEP 3 & 4: Select Phase Count & Start Sequential API Generation
  const handleStartSequentialAPIGeneration = (phaseCount: number) => {
    if (!currentProject) return;

    const count = Math.max(1, phaseCount);
    setSelectedPhaseCount(count);

    const plannedPhases = planExactNPhases(currentProject.requirements, userAnswers, count);
    
    setGeneratingPhases(plannedPhases);
    setActiveGeneratingIdx(0);
    setGenerationErrorPhaseIdx(null);
    setWorkflowStage("generating");

    generatePhaseSequentialAPILoop(currentProject, plannedPhases, 0);
  };

  // Sequential Generation Loop via Server AI API
  const generatePhaseSequentialAPILoop = async (
    proj: SoftwareProject, 
    phases: ProjectPhase[], 
    startIndex: number
  ) => {
    const updatedPhases = [...phases];

    for (let i = startIndex; i < phases.length; i++) {
      setActiveGeneratingIdx(i);
      setGenerationErrorPhaseIdx(null);
      
      updatedPhases[i] = { ...updatedPhases[i], generationStatus: "generating" };
      setGeneratingPhases([...updatedPhases]);

      const prevContext = updatedPhases
        .slice(0, i)
        .map((p) => `Phase ${p.phaseNumber} (${p.title}): ${p.objective}`)
        .join("\n");

      try {
        const promptText = await generateSinglePhasePromptWithAPI({
          project: proj,
          phaseNumber: updatedPhases[i].phaseNumber,
          totalPhases: phases.length,
          phaseTitle: updatedPhases[i].title,
          previousPhasesContext: prevContext,
          useEnsemble: proj.targetAiModel?.includes("Ensemble") || proj.targetAiModel?.includes("Concurrent") || false
        });

        updatedPhases[i] = {
          ...updatedPhases[i],
          prompt: promptText,
          versions: [{ version: 1, promptText, createdAt: new Date().toISOString() }],
          generationStatus: "completed"
        };

        setGeneratingPhases([...updatedPhases]);
      } catch (e: any) {
        console.error(`Failed to generate prompt for Phase ${i + 1}:`, e);
        updatedPhases[i] = { ...updatedPhases[i], generationStatus: "failed" };
        setGeneratingPhases([...updatedPhases]);
        setGenerationErrorPhaseIdx(i);
        toast.error(`API Generation failed for Phase ${i + 1}. Click 'Retry' to resume.`);
        return;
      }
    }

    const finalProj: SoftwareProject = {
      ...proj,
      granularity: phases.length,
      phases: updatedPhases,
      updatedAt: new Date().toISOString()
    };

    setCurrentProject(finalProj);
    setSelectedPhase(updatedPhases[0] || null);
    setWorkflowStage("completion");
    toast.success(`🎉 All ${phases.length} phase prompts generated successfully!`);
  };

  const handleRetryPhaseGeneration = (failedIdx: number) => {
    if (!currentProject) return;
    generatePhaseSequentialAPILoop(currentProject, generatingPhases, failedIdx);
  };

  // STAGE A - STEP 5: Complete & Enter Software Creation Portal
  const handleCompleteAndEnterPortal = () => {
    if (!currentProject) return;

    const readyProj: SoftwareProject = {
      ...currentProject,
      status: "READY_TO_BUILD",
      updatedAt: new Date().toISOString()
    };

    setCurrentProject(readyProj);
    
    const allProjects = loadProjectsFromStorage();
    const filtered = allProjects.filter((p) => p.id !== readyProj.id);
    saveProjectsToStorage([readyProj, ...filtered]);
    if (onProjectSaved) onProjectSaved(readyProj);

    setWorkflowStage("portal");
    toast.success(`Welcome to Software Creation Portal for '${readyProj.name}'!`);
  };

  // STAGE B - Portal Phase Status Toggle
  const handleTogglePortalPhaseStatus = (phaseId: string, status: "Not Started" | "In Progress" | "Completed") => {
    if (!currentProject) return;
    const updatedPhases = currentProject.phases.map((p) => (p.id === phaseId ? { ...p, status, updatedAt: new Date().toISOString() } : p));
    
    const completedCount = updatedPhases.filter((p) => p.status === "Completed").length;
    const progress = Math.round((completedCount / updatedPhases.length) * 100);

    const updatedProj = { ...currentProject, phases: updatedPhases, progress, updatedAt: new Date().toISOString() };
    setCurrentProject(updatedProj);
    if (selectedPhase?.id === phaseId) {
      setSelectedPhase({ ...selectedPhase, status });
    }

    const allProjects = loadProjectsFromStorage();
    saveProjectsToStorage(allProjects.map((p) => (p.id === updatedProj.id ? updatedProj : p)));
    toast.info(`Phase status updated to '${status}'`);
  };

  const handleSavePromptEdit = () => {
    if (!selectedPhase || !currentProject || !editedPromptText.trim()) return;

    const newVersionNum = selectedPhase.currentVersion + 1;
    const newVersionObj = {
      version: newVersionNum,
      promptText: editedPromptText,
      createdAt: new Date().toISOString(),
      notes: `Manual edit v${newVersionNum}`
    };

    const updatedPhase: ProjectPhase = {
      ...selectedPhase,
      prompt: editedPromptText,
      currentVersion: newVersionNum,
      versions: [...selectedPhase.versions, newVersionObj],
      updatedAt: new Date().toISOString()
    };

    const updatedPhases = currentProject.phases.map((p) => (p.id === updatedPhase.id ? updatedPhase : p));
    const updatedProj = { ...currentProject, phases: updatedPhases };

    setCurrentProject(updatedProj);
    setSelectedPhase(updatedPhase);
    setIsEditingPrompt(false);

    const allProjects = loadProjectsFromStorage();
    saveProjectsToStorage(allProjects.map((p) => (p.id === updatedProj.id ? updatedProj : p)));
    toast.success(`Saved Version ${newVersionNum}`);
  };

  const handleExecutePhaseMode = async (mode: ExecutionMode) => {
    if (!selectedPhase || !currentProject) return;
    setActiveExecutionMode(mode);
    setIsRerunningPhase(true);
    toast.info(`Running Phase ${selectedPhase.phaseNumber} in '${mode.toUpperCase()}' mode with Multi-API Router...`);

    try {
      const output = await generateSinglePhasePromptWithAPI({
        project: currentProject,
        phaseNumber: selectedPhase.phaseNumber,
        totalPhases: currentProject.phases.length,
        phaseTitle: selectedPhase.title,
        executionMode: mode,
        useEnsemble: currentProject.targetAiModel?.includes("Ensemble") || currentProject.targetAiModel?.includes("Concurrent") || false
      });

      const newVersion = selectedPhase.currentVersion + 1;
      const updatedPhase: ProjectPhase = {
        ...selectedPhase,
        prompt: output,
        currentVersion: newVersion,
        versions: [...selectedPhase.versions, { 
          version: newVersion, 
          promptText: output, 
          createdAt: new Date().toISOString(), 
          notes: `Executed in ${mode.toUpperCase()} mode` 
        }],
        updatedAt: new Date().toISOString()
      };

      const updatedPhases = currentProject.phases.map(p => p.id === updatedPhase.id ? updatedPhase : p);
      const updatedProject = { ...currentProject, phases: updatedPhases };

      setCurrentProject(updatedProject);
      setSelectedPhase(updatedPhase);

      const allProjects = loadProjectsFromStorage();
      saveProjectsToStorage(allProjects.map(p => p.id === updatedProject.id ? updatedProject : p));
      toast.success(`🎉 Phase ${selectedPhase.phaseNumber} successfully updated with ${mode.toUpperCase()} mode!`);
    } catch (e: any) {
      toast.error(`Execution failed: ${e.message || "Unknown error"}`);
    } finally {
      setIsRerunningPhase(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6 font-inter">
      {/* HEADER BREADCRUMB (HIDDEN IN PORTAL MODE FOR MAXIMUM CLEANLINESS) */}
      {workflowStage !== "portal" && (
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm overflow-x-auto">
          <span className={cn("px-3 py-1 rounded-xl transition-all", workflowStage === "create" ? "bg-slate-900 text-white font-bold" : "text-slate-600")}>
            1. Requirements (.md)
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className={cn("px-3 py-1 rounded-xl transition-all", workflowStage === "questions" ? "bg-slate-900 text-white font-bold" : "text-slate-600")}>
            2. Questions
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className={cn("px-3 py-1 rounded-xl transition-all", workflowStage === "granularity" ? "bg-slate-900 text-white font-bold" : "text-slate-600")}>
            3. Ask Phase Count
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className={cn("px-3 py-1 rounded-xl transition-all", workflowStage === "generating" || workflowStage === "completion" ? "bg-slate-900 text-white font-bold" : "text-slate-600")}>
            4. Generate Exact Prompts
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className={cn("px-3 py-1 rounded-xl transition-all", workflowStage === "portal" ? "bg-emerald-600 text-white font-bold" : "text-slate-600")}>
            5. Software Creation Portal
          </span>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* STAGE A - STEP 1: UPLOAD / ENTER REQUIREMENTS (.md, .txt, paste, photo)                  */}
      {/* ========================================================================================= */}
      {workflowStage === "create" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-2xl font-sora font-bold text-slate-900">Create New Software Project</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Upload your Software Requirements Specification (.md, .txt, .pdf, .docx) or paste requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. Task Management Application"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-slate-900 font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Target AI Engine / Provider</label>
                  <button
                    type="button"
                    onClick={() => setIsSettingsModalOpen(true)}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Settings className="w-3 h-3" /> Multi-API Keys & Ensemble
                  </button>
                </div>
                <select
                  value={selectedAiModel}
                  onChange={(e) => setSelectedAiModel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-slate-900 font-semibold text-slate-800 bg-white cursor-pointer"
                >
                  {AI_MODELS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Brief Description (Optional)</label>
                <textarea
                  placeholder="Summarize project goals..."
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-slate-900 font-medium min-h-[90px] resize-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Upload Requirements File & Design Photo</label>

              {/* DESIGN PHOTO CARD */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {uploadedImage ? (
                    <img src={uploadedImage.url} alt="Design reference" className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-200/80 flex items-center justify-center text-slate-500">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">UI Design Screenshot / Wireframe</span>
                    <span className="text-[10px] text-slate-400 font-medium">{uploadedImage ? uploadedImage.name : "Optional UI photo (.png, .jpg)"}</span>
                  </div>
                </div>

                <div>
                  <input type="file" id="photo-input" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                  <button onClick={() => document.getElementById("photo-input")?.click()} className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold">
                    {uploadedImage ? "Change" : "Upload Photo"}
                  </button>
                </div>
              </div>

              {/* .MD / .TXT FILE UPLOADER */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
                }}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-5 text-center transition-all flex flex-col items-center justify-center min-h-[130px] cursor-pointer",
                  isDragOver ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:border-slate-400 bg-slate-50/50"
                )}
              >
                <Upload className="w-6 h-6 text-slate-400 mb-1" />
                <p className="text-xs font-bold text-slate-700">Upload .md or .txt SRS File</p>

                <input type="file" id="srs-file-input" accept=".md,.txt,.pdf,.docx" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
                <button type="button" onClick={() => document.getElementById("srs-file-input")?.click()} className="mt-2 px-3 py-1 bg-slate-900 text-white rounded-lg text-[11px] font-bold">
                  Browse .md File
                </button>
              </div>

              {uploadedFile && (
                <div className="flex items-center justify-between p-3 bg-slate-100/80 rounded-xl border border-slate-200 text-xs font-medium">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-slate-700 flex-shrink-0" />
                    <span className="truncate font-semibold text-slate-800">{uploadedFile.name}</span>
                  </div>
                  <button onClick={() => setUploadedFile(null)} className="p-1 text-slate-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Or Paste Requirements Manually</label>
            <textarea
              placeholder="Paste raw requirements text or user stories here..."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-mono outline-none focus:border-slate-900 min-h-[100px] resize-y"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button onClick={handleProcessUploadAndGenerateQuestions} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all shadow-md">
              Process Requirements & Ask Questions <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* STAGE A - STEP 2: REQUIREMENT QUESTIONS QUESTIONNAIRE                                    */}
      {/* ========================================================================================= */}
      {workflowStage === "questions" && currentProject && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-2 border-b pb-4">
            <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
              Step 2: AI Requirement Refinement
            </span>
            <h2 className="text-2xl font-sora font-bold text-slate-900">Before generating development prompts, I need a few details.</h2>
            <p className="text-xs text-slate-500 font-medium">
              I understood your project as <span className="font-bold text-slate-800">"{currentProject.name}"</span>. Answer missing architecture details below.
            </p>
          </div>

          <div className="space-y-6">
            {questions.map((q, index) => (
              <div key={q.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-900 block">
                  {index + 1}. {q.question}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {q.options.map((opt) => {
                    const isSelected = userAnswers[q.question] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => setUserAnswers({ ...userAnswers, [q.question]: opt })}
                        className={cn(
                          "p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between",
                          isSelected
                            ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                        )}
                      >
                        <span>{opt}</span>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <button onClick={() => setWorkflowStage("create")} className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to Upload
            </button>
            <button onClick={handleSubmitUserAnswers} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 shadow-md">
              Submit Answers & Ask Phase Count <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* STAGE A - STEP 3: ASK NUMBER OF PHASES                                                    */}
      {/* ========================================================================================= */}
      {workflowStage === "granularity" && currentProject && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-8 text-center max-w-3xl mx-auto">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-sora font-bold text-slate-900">How many development phases do you want?</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-lg mx-auto">
              Choose the level of detail. Promptly will generate **EXACTLY N context-aware prompts** using the server AI API.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {[5, 10, 15, 20, 30, 50, 100].map((count) => (
              <button
                key={count}
                onClick={() => handleStartSequentialAPIGeneration(count)}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all text-left group flex flex-col justify-between h-24 shadow-2xs"
              >
                <span className="text-xl font-sora font-bold group-hover:text-white">{count}</span>
                <span className="text-xs font-bold text-slate-800 group-hover:text-slate-200">{count} Prompts</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* STAGE A - STEP 4: DEDICATED SEQUENTIAL PROMPT GENERATION SCREEN (EXACTLY N PROMPTS)      */}
      {/* ========================================================================================= */}
      {workflowStage === "generating" && currentProject && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-2 border-b pb-4">
            <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 w-fit">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating Development Prompts via Server AI API
            </span>
            <h2 className="text-2xl font-sora font-bold text-slate-900">{currentProject.name}</h2>
            <p className="text-xs text-slate-500 font-medium">
              Generating prompt {activeGeneratingIdx + 1} of {generatingPhases.length}...
            </p>
          </div>

          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1 custom-scrollbar">
            {generatingPhases.map((phase, idx) => {
              const isDone = phase.generationStatus === "completed";
              const isCurrent = idx === activeGeneratingIdx && phase.generationStatus === "generating";
              const isFailed = phase.generationStatus === "failed";

              return (
                <div
                  key={phase.id}
                  className={cn(
                    "p-4 rounded-2xl border transition-all flex items-center justify-between gap-4",
                    isDone
                      ? "bg-emerald-50/50 border-emerald-200 text-emerald-950"
                      : isCurrent
                      ? "bg-purple-50 border-purple-600 shadow-md ring-2 ring-purple-600/10"
                      : isFailed
                      ? "bg-red-50 border-red-200 text-red-950"
                      : "bg-slate-50 border-slate-200 opacity-60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs",
                      isDone ? "bg-emerald-600 text-white" : isCurrent ? "bg-purple-600 text-white animate-pulse" : "bg-slate-200 text-slate-600"
                    )}>
                      {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : isCurrent ? <Loader2 className="w-4 h-4 animate-spin" /> : idx + 1}
                    </div>
                    <div>
                      <span className="text-xs font-sora font-bold block">
                        Phase {phase.phaseNumber}: {phase.title}
                      </span>
                      <span className="text-[10px] font-medium text-slate-500">
                        {isDone ? "Prompt generated ✓" : isCurrent ? "Calling AI API..." : isFailed ? "Generation Failed" : "Waiting"}
                      </span>
                    </div>
                  </div>

                  {isFailed && (
                    <button
                      onClick={() => handleRetryPhaseGeneration(idx)}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-all flex items-center gap-1 shadow-sm"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Retry Phase {idx + 1}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* STAGE A - STEP 5: PROMPT COMPLETION SCREEN & [ COMPLETE & ENTER SOFTWARE CREATION ]       */}
      {/* ========================================================================================= */}
      {workflowStage === "completion" && currentProject && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="p-6 bg-slate-900 text-white rounded-3xl space-y-3 text-center">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-300 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-sora font-bold">🎉 Your development plan is ready!</h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              {generatingPhases.length} / {generatingPhases.length} context-aware prompts generated successfully for <span className="font-bold text-white">{currentProject.name}</span>.
            </p>

            <div className="pt-2">
              <button
                onClick={handleCompleteAndEnterPortal}
                className="px-8 py-4 bg-emerald-500 text-slate-950 font-sora font-extrabold text-sm uppercase tracking-wider rounded-2xl hover:bg-emerald-400 transition-all shadow-xl hover:scale-105"
              >
                Complete & Enter Software Creation Portal →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* STAGE B: SOFTWARE CREATION PORTAL (HORIZONTAL TIMELINE & PROMPT WORKBENCH)                */}
      {/* ========================================================================================= */}
      {workflowStage === "portal" && currentProject && (
        <div className="space-y-6">
          {/* ULTRA-MINIMAL COMPACT PORTAL HEADER BAR */}
          <div className="bg-white rounded-2xl border border-slate-200/80 px-4 py-3 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <h1 className="text-base font-sora font-bold text-slate-900 truncate">{currentProject.name}</h1>
              <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-[10px] font-bold uppercase tracking-wider hidden sm:inline-block">
                {currentProject.phases.length} Phases
              </span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Progress: {currentProject.phases.filter((p) => p.status === "Completed").length}/{currentProject.phases.length}</span>
              </div>
            </div>

            {/* PORTAL TOP ACTIONS BAR */}
            <div className="flex items-center gap-2 relative">
              <button
                type="button"
                onClick={() => setIsChatDrawerOpen(true)}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" /> Project Brain Chat
              </button>

              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(true)}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              >
                <Settings className="w-3.5 h-3.5 text-slate-500" /> Multi-API
              </button>

              <button
                onClick={() => setShowPortalHeaderActions(!showPortalHeaderActions)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border border-slate-200"
              >
                <span>Actions</span>
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showPortalHeaderActions && "rotate-180")} />
              </button>

              {/* DROPDOWN MENU - INITIALLY HIDDEN */}
              {showPortalHeaderActions && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-30 space-y-1 animate-in fade-in slide-in-from-top-2">
                  <button
                    onClick={() => {
                      triggerZipDownload(currentProject);
                      setShowPortalHeaderActions(false);
                      toast.success(`Downloaded '${currentProject.name}' code bundle as .zip!`);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 rounded-xl flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 text-emerald-600" /> Download Code (.zip)
                  </button>

                  <button
                    onClick={() => {
                      setCurrentProject(null);
                      setProjectName("");
                      setProjectDescription("");
                      setPastedText("");
                      setUploadedFile(null);
                      setUploadedImage(null);
                      setWorkflowStage("create");
                      setShowPortalHeaderActions(false);
                      toast.info("Starting a new Software Project setup...");
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 rounded-xl flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4 text-slate-600" /> New Software Project
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* HORIZONTAL PHASE PROCESS TIMELINE (MATCHING USER'S IMAGE DESIGN) */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6 overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-sora font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" /> Software Process Timeline
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">Click any step below to open prompt workbench</span>
            </div>

            {/* CONNECTED TIMELINE PROGRESS BAR */}
            <div className="relative pt-3 pb-2 overflow-x-auto custom-scrollbar">
              <div className="min-w-[700px]">
                {/* Background Line */}
                <div className="absolute top-[24px] left-8 right-8 h-1 bg-slate-200 rounded-full z-0" />

                {/* Active Purple Progress Line */}
                <div
                  className="absolute top-[24px] left-8 h-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-500 rounded-full z-0 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (currentProject.phases.filter((p) => p.status === "Completed").length /
                        Math.max(1, currentProject.phases.length - 1)) *
                        100
                    )}%`
                  }}
                />

                {/* NODES ROW */}
                <div className="relative z-10 flex items-center justify-between">
                  {currentProject.phases.map((phase, idx) => {
                    const isCompleted = phase.status === "Completed";
                    const isInProgress = phase.status === "In Progress";
                    const isSelected = selectedPhase?.id === phase.id;
                    const numStr = phase.phaseNumber < 10 ? `0${phase.phaseNumber}` : `${phase.phaseNumber}`;

                    return (
                      <div
                        key={phase.id}
                        onClick={() => {
                          setSelectedPhase(phase);
                          setIsEditingPrompt(false);
                        }}
                        className="flex flex-col items-center cursor-pointer group"
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center font-sora text-xs font-bold transition-all duration-300 border-2 bg-white relative",
                            isCompleted
                              ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/20 scale-105"
                              : isInProgress
                              ? "border-purple-600 text-purple-700 shadow-md scale-110 font-extrabold"
                              : isSelected
                              ? "border-slate-900 text-slate-900 ring-4 ring-slate-100 scale-105"
                              : "border-slate-300 text-slate-400 group-hover:border-slate-500"
                          )}
                        >
                          {/* Spinning Loading Ring around node when in progress */}
                          {isInProgress && (
                            <div className="absolute -inset-1 border-2 border-purple-600 border-t-transparent border-r-transparent rounded-full animate-spin" />
                          )}

                          {isCompleted ? (
                            <Check className="w-5 h-5 text-white stroke-[3]" />
                          ) : (
                            <span>{numStr}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* STEP CARDS BELOW NODES (SHOWING ALL PHASES UP TO 10+) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-4">
                  {currentProject.phases.map((phase) => {
                    const isCompleted = phase.status === "Completed";
                    const isInProgress = phase.status === "In Progress";
                    const isSelected = selectedPhase?.id === phase.id;

                    return (
                      <div
                        key={phase.id}
                        onClick={() => {
                          setSelectedPhase(phase);
                          setIsEditingPrompt(false);
                        }}
                        className={cn(
                          "p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-28 text-left relative overflow-hidden",
                          isCompleted
                            ? "bg-purple-50/60 border-purple-200"
                            : isInProgress
                            ? "bg-purple-50/30 border-purple-600 shadow-md ring-2 ring-purple-500/20"
                            : isSelected
                            ? "bg-white border-slate-900 shadow-md ring-2 ring-slate-900/10"
                            : "bg-slate-50/50 border-slate-200/80 hover:bg-white hover:border-slate-300"
                        )}
                      >
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                            Step {phase.phaseNumber < 10 ? `0${phase.phaseNumber}` : phase.phaseNumber}
                          </span>
                          <h4 className={cn(
                            "text-xs font-sora font-bold line-clamp-2 leading-tight",
                            isCompleted ? "text-purple-950" : isInProgress ? "text-purple-950 font-extrabold" : "text-slate-800"
                          )}>
                            {phase.title}
                          </h4>
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-bold">
                          {isCompleted ? (
                            <span className="text-purple-700 flex items-center gap-1 font-extrabold">
                              <Check className="w-3.5 h-3.5 text-purple-600 stroke-[3]" /> Completed
                            </span>
                          ) : isInProgress ? (
                            <span className="text-purple-700 flex items-center gap-1 font-extrabold">
                              <RefreshCw className="w-3.5 h-3.5 text-purple-600 animate-spin" /> Generating Code...
                            </span>
                          ) : (
                            <span className="text-slate-400">Not Started</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* TWO-COLUMN PORTAL: ROADMAP + WORKBENCH */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ROADMAP PHASE LIST */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Development Milestones</span>
                <span className="text-[11px] font-semibold text-slate-400">{currentProject.phases.length} Total</span>
              </div>

              <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1 custom-scrollbar">
                {currentProject.phases.map((phase) => {
                  const isSelected = selectedPhase?.id === phase.id;

                  return (
                    <div
                      key={phase.id}
                      onClick={() => {
                        setSelectedPhase(phase);
                        setIsEditingPrompt(false);
                      }}
                      className={cn(
                        "p-4 rounded-2xl border transition-all cursor-pointer space-y-2",
                        isSelected
                          ? "bg-white border-slate-900 shadow-md ring-2 ring-slate-900/10"
                          : "bg-white/80 border-slate-200 hover:border-slate-400"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          Phase {phase.phaseNumber < 10 ? `0${phase.phaseNumber}` : phase.phaseNumber}
                        </span>

                        <select
                          value={phase.status}
                          onChange={(e) => handleTogglePortalPhaseStatus(phase.id, e.target.value as any)}
                          className={cn(
                            "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border outline-none cursor-pointer",
                            phase.status === "Completed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : phase.status === "In Progress"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          )}
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>

                      <h3 className="text-xs font-sora font-bold text-slate-900">{phase.title}</h3>
                      <p className="text-[11px] text-slate-500 font-medium line-clamp-2">{phase.objective}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PHASE BUILDING WORKBENCH */}
            <div className="lg:col-span-7">
              {selectedPhase ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6 sticky top-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 bg-slate-900 text-white rounded text-[10px] font-bold uppercase">
                          Phase {selectedPhase.phaseNumber} Building Workbench
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                          v{selectedPhase.currentVersion}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setDiffTargetPhase(selectedPhase);
                            setIsDiffModalOpen(true);
                          }}
                          className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-[10px] font-bold flex items-center gap-1 transition-all"
                          title="Inspect Version History & Diffs"
                        >
                          <History className="w-3 h-3" /> History & Diffs
                        </button>
                      </div>
                      <h2 className="text-xl font-sora font-bold text-slate-900">{selectedPhase.title}</h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          triggerZipDownload(currentProject);
                          toast.success(`Downloaded '${currentProject.name}' project code as .zip!`);
                        }}
                        className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm hover:bg-emerald-500 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" /> Download Code (.zip)
                      </button>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedPhase.prompt);
                          toast.success(`Copied Phase ${selectedPhase.phaseNumber} Prompt!`);
                        }}
                        className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
                      >
                        <Copy className="w-3.5 h-3.5" /> Copy Prompt
                      </button>

                      {/* DYNAMIC REDESIGNED PHASE ACTION BUTTON */}
                      {selectedPhase.status === "Completed" ? (
                        <div className="flex items-center gap-1">
                          <span className="px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-sora font-bold flex items-center gap-1.5">
                            <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Phase Completed
                          </span>
                          <button
                            onClick={() => handleTogglePortalPhaseStatus(selectedPhase.id, "In Progress")}
                            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all"
                            title="Re-run / Restart Phase"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : selectedPhase.status === "In Progress" ? (
                        <button
                          onClick={() => handleTogglePortalPhaseStatus(selectedPhase.id, "Completed")}
                          className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-sora font-bold flex items-center gap-1.5 shadow-md transition-all"
                        >
                          <Check className="w-4 h-4" /> Complete Phase
                        </button>
                      ) : (
                        <button
                          onClick={() => handleTogglePortalPhaseStatus(selectedPhase.id, "In Progress")}
                          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-sora font-bold flex items-center gap-1.5 shadow-md transition-all"
                        >
                          <Play className="w-3.5 h-3.5 fill-slate-950" /> Start Phase
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* REAL AI API CONNECTION BANNER */}
                    <div className="p-3 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl flex items-center justify-between gap-3 shadow-md border border-indigo-900/50">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <div>
                          <p className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>Live Multi-API Router</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                              OpenAI • Anthropic • Gemini • DeepSeek • Ollama Local
                            </span>
                          </p>
                          <p className="text-[11px] text-slate-300">
                            Connect your cloud API keys or local Ollama URL for 100% real LLM model execution.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsSettingsModalOpen(true)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-1.5 shrink-0"
                      >
                        <Settings className="w-3.5 h-3.5" /> Connect Keys / Ollama
                      </button>
                    </div>

                    {/* MULTI-API EXECUTION MODES TOOLBAR */}
                    <div className="p-3 bg-slate-100/80 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">
                          Phase Execution Mode:
                        </span>
                        {(["generate", "review", "execute", "test", "fix"] as ExecutionMode[]).map((mode) => {
                          const isActive = activeExecutionMode === mode;
                          return (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => handleExecutePhaseMode(mode)}
                              disabled={isRerunningPhase}
                              className={cn(
                                "px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-all flex items-center gap-1",
                                isActive
                                  ? "bg-slate-900 text-white shadow-xs"
                                  : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50"
                              )}
                            >
                              {mode === "generate" && <Sparkles className="w-3 h-3 text-indigo-400" />}
                              {mode === "review" && <Eye className="w-3 h-3 text-amber-500" />}
                              {mode === "execute" && <Play className="w-3 h-3 text-emerald-500" />}
                              {mode === "test" && <CheckCircle className="w-3 h-3 text-cyan-500" />}
                              {mode === "fix" && <AlertTriangle className="w-3 h-3 text-rose-500" />}
                              {mode}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-2">
                        {isRerunningPhase && (
                          <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Routing APIs...
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsSettingsModalOpen(true)}
                          className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"
                        >
                          <Settings className="w-3 h-3 text-slate-500" /> Multi-API Config
                        </button>
                      </div>
                    </div>

                    {/* INTERACTIVE MULTI-FILE CODE EXPLORER */}
                    {(() => {
                      const phaseArtifacts = selectedPhase ? ArtifactEngine.extractArtifactsFromOutput(selectedPhase.phaseNumber, selectedPhase.title, selectedPhase.prompt) : [];
                      const safeIdx = selectedArtifactIdx < phaseArtifacts.length ? selectedArtifactIdx : 0;
                      const activeArtifact = phaseArtifacts[safeIdx];

                      return (
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-xl">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                              <FileCode className="w-4 h-4 text-purple-400" />
                              <span className="text-xs font-bold text-white tracking-wide">
                                Generated Code Artifacts ({phaseArtifacts.length} {phaseArtifacts.length === 1 ? 'file' : 'files'})
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  if (activeArtifact) {
                                    navigator.clipboard.writeText(activeArtifact.content);
                                    toast.success(`Copied '${activeArtifact.fileName}' to clipboard!`);
                                  }
                                }}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-bold flex items-center gap-1 transition"
                              >
                                <Copy className="w-3 h-3 text-slate-400" /> Copy File
                              </button>
                              <button
                                onClick={() => {
                                  triggerZipDownload(currentProject);
                                  toast.success("Downloading full codebase .zip archive...");
                                }}
                                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition shadow-lg shadow-indigo-600/20"
                              >
                                <Download className="w-3 h-3" /> Download .zip
                              </button>
                            </div>
                          </div>

                          {/* File Tabs */}
                          {phaseArtifacts.length > 0 && (
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                              {phaseArtifacts.map((art, idx) => {
                                const isActive = idx === safeIdx;
                                const isTS = art.filePath.endsWith('.ts') || art.filePath.endsWith('.tsx');
                                const isSQL = art.filePath.endsWith('.sql');
                                const isJSON = art.filePath.endsWith('.json');

                                return (
                                  <button
                                    key={art.id || idx}
                                    onClick={() => setSelectedArtifactIdx(idx)}
                                    className={cn(
                                      "px-3 py-1.5 rounded-lg text-[11px] font-mono flex items-center gap-1.5 transition-all whitespace-nowrap border",
                                      isActive 
                                        ? "bg-slate-800 text-white border-purple-500/50 shadow-sm font-semibold" 
                                        : "bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/60"
                                    )}
                                  >
                                    <span className={cn(
                                      "w-1.5 h-1.5 rounded-full",
                                      isTS ? "bg-blue-400" : isSQL ? "bg-emerald-400" : isJSON ? "bg-amber-400" : "bg-purple-400"
                                    )} />
                                    <span>{art.filePath}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* Code Content Window */}
                          {activeArtifact ? (
                            <div className="relative group">
                              <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-950 px-3 py-1.5 rounded-t-xl font-mono border-t border-x border-slate-800">
                                <span>{activeArtifact.filePath}</span>
                                <span>{activeArtifact.content.split('\n').length} lines</span>
                              </div>
                              <div className="p-4 bg-slate-950 text-emerald-400 rounded-b-xl font-mono text-[11px] max-h-[350px] overflow-y-auto overflow-x-auto leading-relaxed border border-slate-800 custom-scrollbar">
                                <pre className="whitespace-pre">{activeArtifact.content}</pre>
                              </div>
                            </div>
                          ) : (
                            <div className="p-6 text-center text-xs text-slate-400 border border-slate-800 rounded-xl bg-slate-950">
                              Click any execution mode above to generate code artifacts with AI.
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* 23-SECTION PROMPT BOX */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">23-Section Development Prompt & Specs</span>
                        <button
                          onClick={() => {
                            if (selectedPhase) {
                              navigator.clipboard.writeText(selectedPhase.prompt);
                              toast.success("Copied 23-section development prompt!");
                            }
                          }}
                          className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> Copy Full Prompt
                        </button>
                      </div>
                      <div className="p-4 bg-slate-900 text-slate-300 rounded-2xl text-xs font-mono max-h-[300px] overflow-y-auto whitespace-pre-wrap custom-scrollbar border border-slate-800 leading-relaxed">
                        {selectedPhase.prompt}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Multi-API Provider & Ensemble Settings Modal */}
      <MultiAPISettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      {/* Project Brain Intelligence Chat Drawer */}
      {currentProject && (
        <ProjectChatDrawer
          isOpen={isChatDrawerOpen}
          onClose={() => setIsChatDrawerOpen(false)}
          project={currentProject}
          onApplyImpactAction={(report) => {
            toast.info(`Applied change plan: ${report.affectedPhases.length} phase(s) marked for review.`);
          }}
        />
      )}

      {/* Artifact Version Diff Modal */}
      {diffTargetPhase && (
        <ArtifactDiffModal
          isOpen={isDiffModalOpen}
          onClose={() => {
            setIsDiffModalOpen(false);
            setDiffTargetPhase(null);
          }}
          phase={diffTargetPhase}
        />
      )}
    </div>
  );
};
