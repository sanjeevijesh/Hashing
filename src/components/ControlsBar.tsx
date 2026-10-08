import React from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  RotateCcw, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Dices, 
  Zap
} from 'lucide-react';
import type { AlgorithmType } from '../types/hashing';

interface ControlsBarProps {
  inputKey: string;
  setInputKey: (val: string) => void;
  onInsert: () => void;
  onSearch: () => void;
  onDelete: () => void;
  onReset: () => void;
  tableSize: number;
  setTableSize: (size: number) => void;
  algorithm: AlgorithmType;
  // Step-by-step controls
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  // Preset injectors
  onInjectPreset: (keys: number[]) => void;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  inputKey,
  setInputKey,
  onInsert,
  onSearch,
  onDelete,
  onReset,
  tableSize,
  setTableSize,
  algorithm: _algorithm,
  currentStepIndex,
  totalSteps,
  isPlaying,
  onTogglePlay,
  onPrevStep,
  onNextStep,
  playbackSpeed,
  setPlaybackSpeed,
  onInjectPreset
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onInsert();
    }
  };

  const isPrime = (num: number): boolean => {
    if (num <= 1) return false;
    for (let i = 2; i * i <= num; i++) {
      if (num % i === 0) return false;
    }
    return true;
  };

  const handleGenerateRandom = () => {
    const randomKey = Math.floor(Math.random() * 90) + 10;
    setInputKey(String(randomKey));
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-5 shadow-md space-y-3.5 sm:space-y-4">
      {/* Top Row: Primary Operations */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Key Input & Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 flex-1">
          <div className="relative flex-1 sm:flex-initial min-w-[110px] sm:min-w-[140px]">
            <input
              type="number"
              placeholder="Enter Key..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-2xs"
            />
          </div>

          <button
            onClick={onInsert}
            disabled={isPlaying}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Insert</span>
          </button>

          <button
            onClick={onSearch}
            disabled={isPlaying}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 font-semibold text-xs sm:text-sm shadow-2xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
            <span>Search</span>
          </button>

          <button
            onClick={onDelete}
            disabled={isPlaying}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 hover:border-rose-300 font-semibold text-xs sm:text-sm shadow-2xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500" />
            <span>Delete</span>
          </button>

          <button
            onClick={handleGenerateRandom}
            className="p-2 sm:p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs transition-colors cursor-pointer"
            title="Generate Random Key"
          >
            <Dices className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-300 shadow-2xs transition-all text-xs font-semibold cursor-pointer"
            title="Reset Table"
          >
            <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden xs:inline">Reset</span>
          </button>
        </div>

        {/* Table Size Setting */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <label className="text-xs font-semibold text-slate-600">Table Size (m):</label>
          <div className="flex items-center gap-1.5">
            <select
              value={tableSize}
              onChange={(e) => setTableSize(Number(e.target.value))}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800 shadow-2xs focus:outline-none focus:border-indigo-600 cursor-pointer"
            >
              <option value={7}>7 (Prime)</option>
              <option value={10}>10 (Standard)</option>
              <option value={11}>11 (Prime)</option>
              <option value={13}>13 (Prime)</option>
              <option value={17}>17 (Prime)</option>
            </select>
            {isPrime(tableSize) && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold">
                Prime
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Middle Row: Step-by-Step Playback Controls for Classroom Lecturing */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <span className="text-xs uppercase font-mono font-bold text-slate-500 mr-1 hidden sm:inline">
            Playback:
          </span>

          <button
            onClick={onPrevStep}
            disabled={totalSteps === 0 || currentStepIndex <= 0}
            className="p-1.5 sm:p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Previous Step"
          >
            <SkipBack className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={onTogglePlay}
            disabled={totalSteps === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all border shadow-xs cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600 shadow-sm'
            } disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            <span>{isPlaying ? 'Pause' : 'Play Step'}</span>
          </button>

          <button
            onClick={onNextStep}
            disabled={totalSteps === 0 || currentStepIndex >= totalSteps - 1}
            className="p-1.5 sm:p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Next Step"
          >
            <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Current Step Counter */}
          <span className="text-[11px] sm:text-xs font-mono text-slate-700 font-bold px-2 py-1 rounded-md bg-slate-100 border border-slate-200">
            Step {totalSteps > 0 ? currentStepIndex + 1 : 0} / {totalSteps}
          </span>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="text-xs font-medium text-slate-500">Speed:</span>
          {[0.5, 1, 2].map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaybackSpeed(spd)}
              className={`px-2 py-0.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                playbackSpeed === spd
                  ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Row: Demonstration Key Sequences */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-slate-500 font-medium text-xs flex items-center gap-1 flex-shrink-0">
            <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" /> Presets:
          </span>

          <button
            onClick={() => onInjectPreset([12, 22, 32, 42, 52])}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 font-mono text-[11px] transition-colors whitespace-nowrap flex-shrink-0 cursor-pointer"
          >
            Classic Collisions [12, 22, 32, 42, 52]
          </button>

          <button
            onClick={() => onInjectPreset([10, 11, 12, 13, 20])}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 font-mono text-[11px] transition-colors whitespace-nowrap flex-shrink-0 cursor-pointer"
          >
            Primary Cluster [10, 11, 12, 13, 20]
          </button>

          <button
            onClick={() => {
              const arr = Array.from({ length: 6 }, () => Math.floor(Math.random() * 80) + 10);
              onInjectPreset(arr);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 font-mono text-[11px] transition-colors whitespace-nowrap flex-shrink-0 cursor-pointer"
          >
            Random 6 Keys
          </button>
        </div>
      </div>
    </div>
  );
};
