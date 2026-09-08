import React, { useState, useEffect } from "react";
import { 
  Search, Filter, Bookmark, Star, Code2, Layers, Sparkles, 
  FileText, Copy, Trash2, ExternalLink, Calendar, Tag, CheckCircle2 
} from "lucide-react";
import { loadProjectsFromStorage, SoftwareProject } from "@/lib/software-projects.store";
import { loadPromptsFromStorage, GeneratedPromptItem } from "@/lib/prompt-creator.store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type LibrarySection = "all" | "software" | "prompts" | "favorites" | "phases";

export const UpgradedLibrary: React.FC = () => {
  const [activeSection, setActiveSection] = useState<LibrarySection>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  
  const [projects, setProjects] = useState<SoftwareProject[]>([]);
  const [prompts, setPrompts] = useState<GeneratedPromptItem[]>([]);

  useEffect(() => {
    setProjects(loadProjectsFromStorage());
    setPrompts(loadPromptsFromStorage());
  }, []);

  const handleToggleFavoritePrompt = (id: string) => {
    const updated = prompts.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
    setPrompts(updated);
    toast.info("Updated favorites");
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // Filter Logic
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredPrompts = prompts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.promptText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter === "all" || p.category === selectedCategoryFilter;
    const matchesFavorite = activeSection !== "favorites" || p.isFavorite;
    return matchesSearch && matchesCategory && matchesFavorite;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6 font-inter">
      {/* HEADER & SEARCH BAR */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-sora font-bold text-slate-900">Promptly Library</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Search, filter, and manage your saved Software Projects, 23-Section Phase Prompts, and Prompt Creator items.
            </p>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-slate-900 transition-all"
            />
          </div>
        </div>

        {/* SECTION TABS BAR */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto">
          {[
            { id: "all", label: "All Items", icon: Bookmark },
            { id: "software", label: "Software Projects", icon: Code2 },
            { id: "prompts", label: "Saved Prompts", icon: Sparkles },
            { id: "favorites", label: "Favorites", icon: Star }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0",
                  activeSection === tab.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SOFTWARE PROJECTS SECTION */}
      {(activeSection === "all" || activeSection === "software") && (
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 px-1">
            Software Projects ({filteredProjects.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((proj) => (
              <div key={proj.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 bg-slate-900 text-white rounded text-[10px] font-bold uppercase">
                        {proj.granularity === 0 ? "Single Phase" : `${proj.phases.length} Phases`}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold">
                        {proj.progress}% Completed
                      </span>
                    </div>
                    <h3 className="text-lg font-sora font-bold text-slate-900">{proj.name}</h3>
                  </div>
                </div>

                <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">{proj.description}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.requirements.techStack.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROMPTS CREATOR SECTION */}
      {(activeSection === "all" || activeSection === "prompts" || activeSection === "favorites") && (
        <div className="space-y-4 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 px-1">
            Prompt Creator Items ({filteredPrompts.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPrompts.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 bg-slate-900 text-white rounded text-[10px] font-bold uppercase">
                        {item.category}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">
                        Score {item.qualityScore}
                      </span>
                    </div>
                    <h3 className="text-base font-sora font-bold text-slate-900">{item.title}</h3>
                  </div>

                  <button
                    onClick={() => handleToggleFavoritePrompt(item.id)}
                    className={cn(
                      "p-2 rounded-xl transition-colors",
                      item.isFavorite ? "text-amber-500 bg-amber-50" : "text-slate-300 hover:text-slate-600 bg-slate-50"
                    )}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <div className="p-3 bg-slate-900 text-white rounded-xl text-xs font-mono line-clamp-3 leading-relaxed">
                  {item.promptText}
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[11px] font-medium text-slate-400">Model: {item.recommendedModel}</span>
                  <button
                    onClick={() => handleCopyText(item.promptText)}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 rounded-lg font-bold transition-all text-xs flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
