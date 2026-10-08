import React from 'react';
import type { AlgorithmType } from '../types/hashing';
import { PSEUDOCODE_MAP } from '../data/pseudocode';
import { Code2 } from 'lucide-react';

interface PseudocodePanelProps {
  algorithm: AlgorithmType;
  currentOperation: 'insert' | 'search' | 'delete';
  activeLine?: number;
}

export const PseudocodePanel: React.FC<PseudocodePanelProps> = ({
  algorithm,
  currentOperation,
  activeLine = 1
}) => {
  const codeLines = PSEUDOCODE_MAP[algorithm][currentOperation] || PSEUDOCODE_MAP[algorithm].insert;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-md flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-indigo-600" />
          <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-800">
            Algorithm Pseudocode
          </h4>
        </div>
        <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
          {algorithm} • {currentOperation}
        </span>
      </div>

      {/* Code Lines with Live Highlight */}
      <div className="font-mono text-xs space-y-1.5 flex-1 overflow-y-auto">
        {codeLines.map((line) => {
          const isActive = line.lineNum === activeLine;

          return (
            <div
              key={line.lineNum}
              className={`flex items-start gap-2.5 p-1.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-50 border border-indigo-300 text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              }`}
            >
              {/* Line number */}
              <span className={`text-[10px] w-5 text-right flex-shrink-0 select-none ${
                isActive ? 'text-indigo-600 font-bold' : 'text-slate-400'
              }`}>
                {line.lineNum}
              </span>

              {/* Code text & Explanation */}
              <div className="flex-1">
                <div className={`leading-relaxed ${isActive ? 'text-indigo-950 font-bold' : 'text-slate-800'}`}>
                  {line.code}
                </div>
                {isActive && line.explanation && (
                  <div className="text-[10px] text-indigo-700 font-sans mt-0.5 italic">
                    ↳ {line.explanation}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
