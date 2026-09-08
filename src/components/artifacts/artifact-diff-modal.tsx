import React, { useState } from "react";
import { X, GitCompare, History, FileCode, Check } from "lucide-react";
import { ProjectPhase, PromptVersion } from "@/lib/software-projects.store";

interface ArtifactDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  phase: ProjectPhase;
}

export const ArtifactDiffModal: React.FC<ArtifactDiffModalProps> = ({ isOpen, onClose, phase }) => {
  const versions = phase.versions || [];
  const [selectedV1, setSelectedV1] = useState<number>(versions.length > 1 ? versions[versions.length - 2].version : (versions[0]?.version || 1));
  const [selectedV2, setSelectedV2] = useState<number>(phase.currentVersion || (versions[versions.length - 1]?.version || 1));

  if (!isOpen) return null;

  const v1Obj = versions.find(v => v.version === selectedV1) || versions[0];
  const v2Obj = versions.find(v => v.version === selectedV2) || versions[versions.length - 1];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sora font-bold text-sm">Artifact Version Inspector & Diff</h3>
              <p className="text-[11px] text-slate-300 font-mono">Phase {phase.phaseNumber}: {phase.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Version selectors */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Compare Version:</span>
            <select
              value={selectedV1}
              onChange={(e) => setSelectedV1(Number(e.target.value))}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-800"
            >
              {versions.map(v => (
                <option key={`v1-${v.version}`} value={v.version}>v{v.version} ({new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</option>
              ))}
            </select>
            <span className="font-bold text-slate-400">vs</span>
            <select
              value={selectedV2}
              onChange={(e) => setSelectedV2(Number(e.target.value))}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-800"
            >
              {versions.map(v => (
                <option key={`v2-${v.version}`} value={v.version}>v{v.version} (Active)</option>
              ))}
            </select>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            {versions.length} total version(s) recorded
          </div>
        </div>

        {/* Diff Content Side-by-Side */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 custom-scrollbar">
          {/* Left Column - Older Version */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-1 border-b">
              <span>Version {v1Obj?.version || 1}</span>
              <span className="text-[10px] text-slate-400 font-mono">{v1Obj?.notes || "Initial generation"}</span>
            </div>
            <div className="p-4 bg-slate-900 text-slate-300 rounded-2xl font-mono text-[11px] whitespace-pre-wrap max-h-[450px] overflow-y-auto custom-scrollbar border border-slate-800">
              {v1Obj?.promptText || "No version text available"}
            </div>
          </div>

          {/* Right Column - Newer Version */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-800 pb-1 border-b">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <Check className="w-3.5 h-3.5" /> Version {v2Obj?.version || 1} (Latest)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{v2Obj?.notes || "Current active version"}</span>
            </div>
            <div className="p-4 bg-slate-900 text-emerald-400 rounded-2xl font-mono text-[11px] whitespace-pre-wrap max-h-[450px] overflow-y-auto custom-scrollbar border border-slate-800">
              {v2Obj?.promptText || "No version text available"}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
