import React from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineStep {
  stepNumber: number;
  title: string;
  subtitle?: string;
  status: "pending" | "active" | "completed";
}

interface ProcessTimelineProps {
  steps: TimelineStep[];
  currentStepIndex: number;
}

export const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ steps, currentStepIndex }) => {
  const progressPercent = Math.min(100, Math.max(0, (currentStepIndex / (steps.length - 1)) * 100));

  return (
    <div className="w-full bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-sora font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" /> AI Generation Pipeline Process
        </h3>
        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          Step {Math.min(currentStepIndex + 1, steps.length)} of {steps.length}
        </span>
      </div>

      {/* HORIZONTAL NODE CONNECTED LINE (MATCHING IMAGE 2) */}
      <div className="relative pt-4 pb-2">
        {/* Background Grey Line */}
        <div className="absolute top-[26px] left-8 right-8 h-1 bg-slate-200 rounded-full z-0" />
        
        {/* Active Purple Progress Line */}
        <div 
          className="absolute top-[26px] left-8 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full z-0 transition-all duration-700 ease-out" 
          style={{ width: `calc(${progressPercent}% - 3rem)` }}
        />

        {/* NODES ROW */}
        <div className="relative z-10 flex items-center justify-between">
          {steps.map((step, idx) => {
            const isCompleted = step.status === "completed";
            const isActive = step.status === "active";
            const numStr = step.stepNumber < 10 ? `0${step.stepNumber}` : `${step.stepNumber}`;

            return (
              <div key={idx} className="flex flex-col items-center group">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-sora text-xs font-bold transition-all duration-300 border-2 bg-white",
                    isCompleted
                      ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/20 scale-105"
                      : isActive
                      ? "border-purple-600 text-purple-600 ring-4 ring-purple-100 shadow-lg scale-110"
                      : "border-slate-300 text-slate-400"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white stroke-[3]" />
                  ) : isActive ? (
                    <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                  ) : (
                    <span>{numStr}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP CARDS GRID BELOW NODES (MATCHING IMAGE 2) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
        {steps.map((step, idx) => {
          const isCompleted = step.status === "completed";
          const isActive = step.status === "active";

          return (
            <div
              key={idx}
              className={cn(
                "p-3 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-28 text-left",
                isCompleted
                  ? "bg-purple-50/50 border-purple-200/80 shadow-2xs"
                  : isActive
                  ? "bg-white border-purple-600 shadow-md ring-2 ring-purple-600/10 scale-[1.02]"
                  : "bg-slate-50/50 border-slate-200/60 opacity-60"
              )}
            >
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Step {step.stepNumber < 10 ? `0${step.stepNumber}` : step.stepNumber}
                </span>
                <span className={cn(
                  "text-xs font-sora font-bold line-clamp-2 leading-snug",
                  isCompleted ? "text-purple-950" : isActive ? "text-purple-900 font-extrabold" : "text-slate-700"
                )}>
                  {step.title}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] font-semibold">
                {isCompleted ? (
                  <span className="text-purple-700 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3 text-purple-600" /> Done
                  </span>
                ) : isActive ? (
                  <span className="text-purple-600 font-bold flex items-center gap-1 animate-pulse">
                    Processing...
                  </span>
                ) : (
                  <span className="text-slate-400">Waiting</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
