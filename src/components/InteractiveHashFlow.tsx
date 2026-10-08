import React, { useState } from 'react';
import { ArrowRight, ArrowDown, Cpu, Hash, AlertTriangle, RotateCcw } from 'lucide-react';

interface InteractiveHashFlowProps {
  onSelectTechnique?: (tech: string) => void;
}

export const InteractiveHashFlow: React.FC<InteractiveHashFlowProps> = ({ onSelectTechnique }) => {
  const [inputKey, setInputKey] = useState<number>(42);
  const [tableSize, setTableSize] = useState<number>(10);
  const [activeStep, setActiveStep] = useState<number>(3); // 1: Key, 2: Hash Fn, 3: Index, 4: Table
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [miniTable, setMiniTable] = useState<(number | null)[]>([null, null, 42, null, null, null, null, null, null, null]);
  const [collisionWarning, setCollisionWarning] = useState<string | null>(null);

  const calculatedIndex = ((inputKey % tableSize) + tableSize) % tableSize;

  const sampleCollisionKeys = [12, 22, 32, 42, 52];

  const handleCompute = (keyToUse: number = inputKey) => {
    setInputKey(keyToUse);
    setIsAnimating(true);
    setActiveStep(1);
    setCollisionWarning(null);

    const index = ((keyToUse % tableSize) + tableSize) % tableSize;

    setTimeout(() => {
      setActiveStep(2);
    }, 450);

    setTimeout(() => {
      setActiveStep(3);
    }, 900);

    setTimeout(() => {
      setActiveStep(4);
      // Check collision in mini-table
      if (miniTable[index] !== null && miniTable[index] !== keyToUse) {
        setCollisionWarning(`Collision! Slot ${index} already holds key ${miniTable[index]}. Collision resolution needed!`);
      } else {
        const next = [...miniTable];
        next[index] = keyToUse;
        setMiniTable(next);
      }
      setIsAnimating(false);
    }, 1350);
  };

  const handleResetMiniTable = () => {
    setMiniTable(Array(tableSize).fill(null));
    setCollisionWarning(null);
    setActiveStep(0);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-md relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 sm:pb-6 mb-4 sm:mb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-xs font-semibold uppercase tracking-wider mb-2">
            <Cpu className="w-3.5 h-3.5" /> Conceptual Pipeline
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            How Hashing Works: Step-by-Step Flow
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Observe the mathematical mapping from an arbitrary data <span className="text-indigo-600 font-semibold">Key</span> to an exact <span className="text-emerald-600 font-semibold">Array Slot Index</span>.
          </p>
        </div>

        {/* Quick Collision Keys Preset */}
        <div className="flex flex-col sm:items-end gap-1.5">
          <span className="text-xs font-medium text-slate-500">Try Collision Sequence:</span>
          <div className="flex flex-wrap gap-1.5">
            {sampleCollisionKeys.map(k => (
              <button
                key={k}
                onClick={() => handleCompute(k)}
                disabled={isAnimating}
                className="px-2.5 py-1 text-xs font-mono font-bold rounded-md bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white border border-slate-200 hover:border-indigo-600 transition-all cursor-pointer disabled:opacity-50"
              >
                {k}
              </button>
            ))}
            <button
              onClick={handleResetMiniTable}
              className="px-2 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors ml-1 cursor-pointer"
              title="Reset Mini Table"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 sm:mb-8 bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200/80">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Input Key (k)
          </label>
          <input
            type="number"
            value={inputKey}
            onChange={(e) => setInputKey(parseInt(e.target.value) || 0)}
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Table Size (m)
          </label>
          <input
            type="number"
            min="3"
            max="20"
            value={tableSize}
            onChange={(e) => {
              const val = Math.max(3, Math.min(20, parseInt(e.target.value) || 10));
              setTableSize(val);
              setMiniTable(Array(val).fill(null));
            }}
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors shadow-2xs"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={() => handleCompute()}
            disabled={isAnimating}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Hash className="w-4 h-4" />
            <span>Map to Table</span>
          </button>
        </div>
      </div>

      {/* Visual Animated Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 sm:gap-4 items-center mb-6 sm:mb-8 relative">
        {/* Stage 1: Key */}
        <div className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-300 text-center ${
          activeStep >= 1 ? 'bg-indigo-50/80 border-indigo-300 shadow-xs' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="text-[11px] sm:text-xs uppercase font-mono tracking-wider text-slate-500 mb-1">Step 1: Input Key</div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-600">{inputKey}</div>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-1 sm:mt-2">Data identifier / record key</p>
        </div>

        <div className="hidden md:flex justify-center text-slate-400">
          <ArrowRight className={`w-5 h-5 lg:w-6 lg:h-6 transition-colors duration-300 ${activeStep >= 2 ? 'text-indigo-600 animate-pulse' : ''}`} />
        </div>
        <div className="md:hidden flex justify-center text-slate-400 my-0.5">
          <ArrowDown className={`w-4 h-4 transition-colors duration-300 ${activeStep >= 2 ? 'text-indigo-600' : ''}`} />
        </div>

        {/* Stage 2: Hash Function */}
        <div className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-300 text-center ${
          activeStep >= 2 ? 'bg-indigo-50/80 border-indigo-300 shadow-xs' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="text-[11px] sm:text-xs uppercase font-mono tracking-wider text-slate-500 mb-1">Step 2: Hash Function</div>
          <div className="text-sm sm:text-base font-bold font-mono text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 inline-block shadow-2xs">
            h(k) = {inputKey} % {tableSize}
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-1 sm:mt-2">Modulo reduction to bounds</p>
        </div>

        <div className="hidden md:flex justify-center text-slate-400">
          <ArrowRight className={`w-5 h-5 lg:w-6 lg:h-6 transition-colors duration-300 ${activeStep >= 3 ? 'text-emerald-600 animate-pulse' : ''}`} />
        </div>
        <div className="md:hidden flex justify-center text-slate-400 my-0.5">
          <ArrowDown className={`w-4 h-4 transition-colors duration-300 ${activeStep >= 3 ? 'text-emerald-600' : ''}`} />
        </div>

        {/* Stage 3: Slot Index */}
        <div className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-300 text-center ${
          activeStep >= 3 ? 'bg-emerald-50/80 border-emerald-300 shadow-xs' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="text-[11px] sm:text-xs uppercase font-mono tracking-wider text-slate-500 mb-1">Step 3: Calculated Index</div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600">[{calculatedIndex}]</div>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-1 sm:mt-2">Exact bucket location</p>
        </div>
      </div>

      {/* Collision Alert if applicable */}
      {collisionWarning && (
        <div className="mb-6 p-3.5 sm:p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 sm:gap-3 text-amber-900">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 text-amber-600" />
          <div className="text-xs sm:text-sm">
            <span className="font-bold">Collision Detected at Index {calculatedIndex}!</span> {collisionWarning}
            {onSelectTechnique && (
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-xs text-slate-600 self-center">Explore Resolution:</span>
                <button
                  onClick={() => onSelectTechnique('linear')}
                  className="px-2.5 py-1 text-xs rounded bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 font-semibold cursor-pointer"
                >
                  Linear Probing →
                </button>
                <button
                  onClick={() => onSelectTechnique('chaining')}
                  className="px-2.5 py-1 text-xs rounded bg-indigo-100 hover:bg-indigo-200 border border-indigo-300 text-indigo-900 font-semibold cursor-pointer"
                >
                  Separate Chaining →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Hash Table Slots Representation */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-600 font-mono">
            Live Hash Table Slots (Array Representation)
          </h3>
          <span className="text-[11px] text-slate-500">
            Click any slot to inspect
          </span>
        </div>

        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 md:grid-cols-10 gap-2">
          {Array.from({ length: tableSize }, (_, i) => {
            const val = miniTable[i];
            const isTarget = i === calculatedIndex && activeStep >= 3;
            const isCollisionSlot = isTarget && val !== null && val !== inputKey;

            return (
              <div
                key={i}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-300 ${
                  isCollisionSlot
                    ? 'bg-amber-50 border-amber-400 shadow-sm ring-2 ring-amber-400/30 scale-105'
                    : isTarget
                    ? 'bg-emerald-50 border-emerald-400 shadow-sm ring-2 ring-emerald-400/30 scale-105'
                    : val !== null
                    ? 'bg-white border-slate-300 text-slate-800 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <span className="text-[11px] font-mono font-bold text-slate-500 mb-1">
                  [{i}]
                </span>
                <span className={`text-base font-mono font-extrabold ${
                  isCollisionSlot ? 'text-amber-800' : isTarget ? 'text-emerald-700' : val !== null ? 'text-slate-900' : 'text-slate-400'
                }`}>
                  {val !== null ? val : '—'}
                </span>
                <span className="text-[10px] mt-1 text-slate-500">
                  {isCollisionSlot ? 'COLLISION' : isTarget ? 'TARGET' : val !== null ? 'Occupied' : 'Empty'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
