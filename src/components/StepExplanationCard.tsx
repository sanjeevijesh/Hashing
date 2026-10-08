import React from 'react';
import type { StepExecution } from '../types/hashing';
import { AlertTriangle, CheckCircle, Info, Target } from 'lucide-react';

interface StepExplanationCardProps {
  currentStep: StepExecution | null;
  currentStepIndex: number;
  totalSteps: number;
  isLectureMode?: boolean;
}

export const StepExplanationCard: React.FC<StepExplanationCardProps> = ({
  currentStep,
  currentStepIndex,
  totalSteps,
  isLectureMode = false
}) => {
  if (!currentStep) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center gap-3 text-slate-500">
        <Info className="w-5 h-5 text-indigo-600 flex-shrink-0" />
        <span className="text-sm">
          Select an operation above (Insert, Search, Delete) or pick a demo preset to begin step-by-step lecture walkthrough.
        </span>
      </div>
    );
  }

  let badgeColor = 'bg-indigo-50 text-indigo-700 border-indigo-200';
  let IconComponent = Info;

  if (currentStep.isCollision) {
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
    IconComponent = AlertTriangle;
  } else if (currentStep.isSuccess) {
    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    IconComponent = CheckCircle;
  } else if (currentStep.isFailure) {
    badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
    IconComponent = AlertTriangle;
  }

  return (
    <div className={`rounded-2xl border transition-all duration-200 ${
      currentStep.isCollision
        ? 'bg-amber-50/70 border-amber-300 shadow-sm'
        : currentStep.isSuccess
        ? 'bg-emerald-50/70 border-emerald-300 shadow-sm'
        : currentStep.isFailure
        ? 'bg-rose-50/70 border-rose-300 shadow-sm'
        : 'bg-white border-slate-200/90 shadow-md'
    } ${isLectureMode ? 'p-4 sm:p-7' : 'p-3.5 sm:p-5'}`}>
      
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 sm:mb-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
            <IconComponent className="w-3.5 h-3.5" />
            <span>Step {currentStepIndex + 1} of {totalSteps}</span>
          </span>

          <span className="text-xs font-mono text-slate-500 hidden sm:inline">
            Active Target Slot: #{currentStep.highlightIndex}
          </span>
        </div>

        {currentStep.probeIndex !== undefined && (
          <span className="text-[11px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded bg-white text-amber-800 border border-slate-200 shadow-2xs">
            Probe Offset i = {currentStep.probeIndex}
          </span>
        )}
      </div>

      {/* Main Title */}
      <h3 className={`font-bold text-slate-900 tracking-tight ${
        isLectureMode ? 'text-lg sm:text-2xl' : 'text-base sm:text-lg'
      }`}>
        {currentStep.title}
      </h3>

      {/* Natural Language Explanation */}
      <p className={`text-slate-700 mt-1 leading-relaxed ${
        isLectureMode ? 'text-sm sm:text-lg' : 'text-xs sm:text-sm'
      }`}>
        {currentStep.description}
      </p>

      {/* Mathematical Formula / Calculation Box */}
      {currentStep.formula && (
        <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono flex-shrink-0">
              Calculation:
            </span>
            <span className={`font-mono font-bold text-indigo-700 break-all sm:break-normal ${
              isLectureMode ? 'text-sm sm:text-lg' : 'text-xs sm:text-sm'
            }`}>
              {currentStep.formula}
            </span>
          </div>

          <div className="text-[10px] sm:text-[11px] font-mono text-slate-500 flex items-center gap-1 flex-shrink-0 self-end sm:self-auto">
            <Target className="w-3 h-3 text-indigo-600" /> Slot #{currentStep.highlightIndex}
          </div>
        </div>
      )}
    </div>
  );
};
