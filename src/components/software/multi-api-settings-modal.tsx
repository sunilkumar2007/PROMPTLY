import React, { useState, useEffect } from "react";
import { Key, Shield, Sparkles, Check, X, Server, Zap, Cpu } from "lucide-react";
import { loadAPIKeySettings, saveAPIKeySettings, APIKeyStore, SUPPORTED_AI_MODELS } from "@/lib/multi-api-router";
import { toast } from "sonner";

interface MultiAPISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MultiAPISettingsModal: React.FC<MultiAPISettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<APIKeyStore>(loadAPIKeySettings());
  const [activeTab, setActiveTab] = useState<"keys" | "ensemble">("keys");

  useEffect(() => {
    if (isOpen) {
      setSettings(loadAPIKeySettings());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveAPIKeySettings(settings);
    toast.success("API Keys and Multi-Model settings saved securely in your browser!");
    onClose();
  };

  const toggleEnsembleModel = (modelId: string) => {
    const current = settings.ensembleModels || [];
    const exists = current.includes(modelId);
    let updated: string[];
    if (exists) {
      if (current.length <= 1) {
        toast.warning("At least one model must remain in the ensemble.");
        return;
      }
      updated = current.filter(id => id !== modelId);
    } else {
      updated = [...current, modelId];
    }
    setSettings({ ...settings, ensembleModels: updated });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sora font-bold text-lg">Multi-API & Model Router Settings</h3>
              <p className="text-xs text-slate-300">Manage API keys and configure concurrent ensemble models</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab("keys")}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl border-t border-x transition-all ${
              activeTab === "keys"
                ? "bg-white border-slate-200 text-slate-900 shadow-2xs"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Key className="w-3.5 h-3.5 inline mr-1.5" /> API Keys & Providers
          </button>
          <button
            onClick={() => setActiveTab("ensemble")}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl border-t border-x transition-all ${
              activeTab === "ensemble"
                ? "bg-white border-slate-200 text-slate-900 shadow-2xs"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 inline mr-1.5" /> Concurrent Ensemble Config
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === "keys" ? (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Keys are stored locally in your browser session. If no custom key is entered, Promptly automatically uses the <strong>Intelligent Fallback Engine</strong>.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  OpenAI API Key (GPT-4o, o3-mini)
                </label>
                <input
                  type="password"
                  placeholder="sk-..."
                  value={settings.openaiApiKey || ""}
                  onChange={(e) => setSettings({ ...settings, openaiApiKey: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:border-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Anthropic API Key (Claude 3.5 Sonnet / Haiku)
                </label>
                <input
                  type="password"
                  placeholder="sk-ant-..."
                  value={settings.anthropicApiKey || ""}
                  onChange={(e) => setSettings({ ...settings, anthropicApiKey: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:border-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Google Gemini API Key (Gemini 2.0 Flash / 1.5 Pro)
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={settings.geminiApiKey || ""}
                  onChange={(e) => setSettings({ ...settings, geminiApiKey: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:border-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  DeepSeek API Key (DeepSeek-R1 / V3)
                </label>
                <input
                  type="password"
                  placeholder="sk-..."
                  value={settings.deepseekApiKey || ""}
                  onChange={(e) => setSettings({ ...settings, deepseekApiKey: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:border-indigo-600 outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Concurrent Ensemble Model Selection</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  When "Concurrent Multi-API Ensemble" mode is chosen, Promptly queries selected models in parallel and synthesizes the highest quality consensus.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {SUPPORTED_AI_MODELS.filter(m => m.provider !== "simulated").map((model) => {
                  const isChecked = (settings.ensembleModels || []).includes(model.id);
                  return (
                    <div
                      key={model.id}
                      onClick={() => toggleEnsembleModel(model.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isChecked
                          ? "bg-indigo-50/70 border-indigo-500 shadow-xs"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{model.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                          {model.provider} • {model.category}
                        </span>
                      </div>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        isChecked ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300 bg-white"
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
