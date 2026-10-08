import React from 'react';
import type { AlgorithmType, HashSlot, StepExecution } from '../types/hashing';
import { HashTableVisualizer } from './HashTableVisualizer';
import { StepExplanationCard } from './StepExplanationCard';
import { 
  X, 
  Presentation, 
  SkipBack, 
  SkipForward, 
  Play, 
  Pause, 
  RotateCcw
} from 'lucide-react';

interface LectureModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  algorithm: AlgorithmType;
  table: HashSlot[];
  currentStep: StepExecution | null;
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onReset: () => void;
}

export const LectureModeModal: React.FC<LectureModeModalProps> = ({
  isOpen,
  onClose,
  algorithm,
  table,
  currentStep,
  currentStepIndex,
  totalSteps,
  isPlaying,
  onTogglePlay,
  onPrevStep,
  onNextStep,
  onReset
}) => {
  if (!isOpen) return null;

  const getAlgoTitle = () => {
    switch (algorithm) {
      case 'linear': return 'Linear Probing';
      case 'quadratic': return 'Quadratic Probing';
      case 'chaining': return 'Separate Chaining';
      case 'double': return 'Double Hashing';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col p-3 sm:p-6 md:p-8 overflow-y-auto">
      {/* Top Banner for Classroom Lecturers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 mb-4 sm:mb-6 border-b border-slate-200">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500 text-white font-bold shadow-sm flex-shrink-0">
            <Presentation className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                CLASSROOM LECTURE MODE
              </span>
              <span className="text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                SIVAKAMA SUNDARI AP/CSE
              </span>
              <span className="text-xs text-slate-500 font-medium hidden md:inline">
                • National Engineering College
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {getAlgoTitle()} Walkthrough
            </h1>
          </div>
        </div>

        {/* Exit Lecture Mode */}
        <button
          onClick={onClose}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs sm:text-sm shadow-sm transition-all cursor-pointer flex-shrink-0"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Exit Lecture Mode</span>
        </button>
      </div>

      {/* Main Centered Lecture Workspace */}
      <div className="max-w-6xl w-full mx-auto space-y-4 sm:space-y-6 flex-1 flex flex-col justify-center">
        {/* Step Explanation Card: Large Font & High Contrast */}
        <StepExplanationCard
          currentStep={currentStep}
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
          isLectureMode={true}
        />

        {/* Enlarged Hash Table */}
        <div className="scale-100 transition-transform">
          <HashTableVisualizer
            table={table}
            algorithm={algorithm}
            highlightIndex={currentStep?.highlightIndex}
            isLectureMode={true}
          />
        </div>

        {/* Floating Instructor Navigation Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
            <button
              onClick={onPrevStep}
              disabled={totalSteps === 0 || currentStepIndex <= 0}
              className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
              <span>Prev<span className="hidden xs:inline"> Step</span></span>
            </button>

            <button
              onClick={onTogglePlay}
              disabled={totalSteps === 0}
              className={`flex-1 sm:flex-initial px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
              } disabled:opacity-30 disabled:cursor-not-allowed`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={onNextStep}
              disabled={totalSteps === 0 || currentStepIndex >= totalSteps - 1}
              className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Next<span className="hidden xs:inline"> Step</span></span>
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <div className="text-xs sm:text-sm font-mono text-slate-600">
              <span className="text-slate-500 font-medium">Step:</span>{' '}
              <strong className="text-indigo-600 text-sm sm:text-base font-bold">
                {totalSteps > 0 ? currentStepIndex + 1 : 0}
              </strong>{' '}
              / {totalSteps}
            </div>

            <button
              onClick={onReset}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
