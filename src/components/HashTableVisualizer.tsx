import React from 'react';
import type { AlgorithmType, HashSlot } from '../types/hashing';
import { ArrowRight, AlertTriangle, Check, Search, Trash2 } from 'lucide-react';

interface HashTableVisualizerProps {
  table: HashSlot[];
  algorithm: AlgorithmType;
  highlightIndex?: number;
  isLectureMode?: boolean;
}

export const HashTableVisualizer: React.FC<HashTableVisualizerProps> = ({
  table,
  algorithm,
  highlightIndex,
  isLectureMode = false
}) => {
  if (algorithm === 'chaining') {
    return (
      <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-6 shadow-md overflow-x-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b border-slate-100 pb-3 gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 flex-wrap">
              <span>Separate Chaining Hash Table</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Array of Linked Lists
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Each bucket holds a linked chain of collided nodes [VALUE | NEXT] pointing to successive elements.
            </p>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            NULL = End of Chain
          </div>
        </div>

        <div className="space-y-2 sm:space-y-2.5 min-w-[320px] sm:min-w-[480px]">
          {table.map((slot) => {
            const isHighlighted = slot.index === highlightIndex;
            const chain = slot.chain || [];

            return (
              <div
                key={slot.index}
                className={`flex items-center gap-1.5 sm:gap-3 p-1.5 sm:p-2.5 rounded-xl border transition-all duration-200 ${
                  isHighlighted
                    ? 'bg-indigo-50/80 border-indigo-300 shadow-xs'
                    : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Bucket Header */}
                <div className={`flex items-center justify-center w-12 sm:w-16 py-1 sm:py-1.5 rounded-lg font-mono text-[10px] sm:text-xs font-bold border transition-colors shadow-2xs flex-shrink-0 ${
                  isHighlighted 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-white text-slate-700 border-slate-300'
                }`}>
                  B[{slot.index}]
                </div>

                <div className="text-slate-400 flex-shrink-0">
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>

                {/* Linked List Nodes */}
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  {chain.length === 0 ? (
                    <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] sm:text-xs font-mono text-slate-400 italic">
                      NULL (empty)
                    </div>
                  ) : (
                    chain.map((val, idx) => {
                      const isNodeHighlighted = isHighlighted && (slot.state === 'found' || slot.state === 'inserted');
                      const isCollisionNode = isHighlighted && slot.state === 'collision';

                      return (
                        <React.Fragment key={`${slot.index}-${idx}-${val}`}>
                          <div className={`flex items-stretch rounded-lg border overflow-hidden shadow-2xs transition-all duration-300 ${
                            isCollisionNode
                              ? 'border-amber-400 bg-amber-50 text-amber-900 animate-pulse'
                              : isNodeHighlighted && idx === chain.length - 1
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-900 animate-insert-flash'
                              : 'border-slate-300 bg-white text-slate-800'
                          }`}>
                            {/* Value field */}
                            <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 font-mono text-xs sm:text-sm font-bold flex items-center">
                              {val}
                            </div>
                            {/* Next pointer connector field */}
                            <div className="px-1.5 sm:px-2 py-1 sm:py-1.5 bg-slate-100 border-l border-slate-200 text-[9px] sm:text-[10px] font-mono text-indigo-600 flex items-center justify-center">
                              •
                            </div>
                          </div>

                          {/* Link arrow to next node or NULL */}
                          <div className="text-indigo-600 text-xs font-mono font-bold flex items-center">
                            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </div>
                        </React.Fragment>
                      );
                    })
                  )}

                  {chain.length > 0 && (
                    <div className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded bg-slate-100 border border-slate-200 text-[10px] sm:text-[11px] font-mono text-slate-500 font-semibold">
                      NULL
                    </div>
                  )}
                </div>

                {/* Chain length counter pill */}
                <div className="ml-auto text-[10px] sm:text-[11px] font-mono text-slate-500 px-1.5 sm:px-2 py-0.5 rounded bg-white border border-slate-200 shadow-2xs flex-shrink-0">
                  len: {chain.length}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // OPEN ADDRESSING TABLE (Linear, Quadratic, Double Hashing)
  return (
    <div className={`w-full bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-md transition-all ${
      isLectureMode ? 'p-6 sm:p-8 bg-white border-indigo-400 shadow-xl' : ''
    }`}>
      {/* Table Header Details */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b border-slate-100 pb-3 gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>
              {algorithm === 'linear' && 'Linear Probing Hash Table'}
              {algorithm === 'quadratic' && 'Quadratic Probing Hash Table'}
              {algorithm === 'double' && 'Double Hashing Hash Table'}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-semibold">
              m = {table.length} slots
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Open addressing stores all elements directly within the fixed array slots using collision probe sequences.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-300" /> Empty
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Occupied
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Collision / Probing
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Tombstone [DEL]
          </span>
        </div>
      </div>

      {/* Hash Table Grid / Array of Slots */}
      <div className={`grid gap-1.5 sm:gap-2.5 md:gap-3 ${
        table.length <= 10 
          ? 'grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-10' 
          : table.length <= 13
          ? 'grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-13'
          : 'grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8'
      }`}>
        {table.map((slot) => {
          const isHighlighted = slot.index === highlightIndex;
          const isOccupied = slot.value !== null && !slot.isDeleted;
          const isTombstone = slot.isDeleted;

          let slotBorderColor = 'border-slate-200';
          let slotBgColor = 'bg-slate-50/70';
          let statusBadge = null;

          if (slot.state === 'collision') {
            slotBorderColor = 'border-amber-400 ring-2 ring-amber-400/30';
            slotBgColor = 'bg-amber-50';
            statusBadge = (
              <span className="inline-flex items-center gap-0.5 text-[8.5px] sm:text-[10px] font-bold text-amber-700">
                <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Collision
              </span>
            );
          } else if (slot.state === 'probing') {
            slotBorderColor = 'border-indigo-400 ring-2 ring-indigo-400/30';
            slotBgColor = 'bg-indigo-50/70';
            statusBadge = (
              <span className="text-[8.5px] sm:text-[10px] font-bold text-indigo-700">
                Probe {slot.probeNumber ?? 0}
              </span>
            );
          } else if (slot.state === 'inserted') {
            slotBorderColor = 'border-emerald-500 ring-2 ring-emerald-500/30';
            slotBgColor = 'bg-emerald-50 animate-insert-flash';
            statusBadge = (
              <span className="inline-flex items-center gap-0.5 text-[8.5px] sm:text-[10px] font-bold text-emerald-700">
                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Inserted
              </span>
            );
          } else if (slot.state === 'found') {
            slotBorderColor = 'border-emerald-500 ring-2 ring-emerald-500/30';
            slotBgColor = 'bg-emerald-50';
            statusBadge = (
              <span className="inline-flex items-center gap-0.5 text-[8.5px] sm:text-[10px] font-bold text-emerald-700">
                <Search className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Found
              </span>
            );
          } else if (slot.state === 'deleting') {
            slotBorderColor = 'border-rose-400 ring-2 ring-rose-400/30';
            slotBgColor = 'bg-rose-50';
            statusBadge = (
              <span className="inline-flex items-center gap-0.5 text-[8.5px] sm:text-[10px] font-bold text-rose-700">
                <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Deleting
              </span>
            );
          } else if (isTombstone) {
            slotBorderColor = 'border-rose-300';
            slotBgColor = 'bg-rose-50/60';
            statusBadge = (
              <span className="text-[8.5px] sm:text-[10px] font-mono font-bold text-rose-600">
                [DEL] Tombstone
              </span>
            );
          } else if (isOccupied) {
            slotBorderColor = 'border-slate-300';
            slotBgColor = 'bg-white shadow-2xs';
            statusBadge = (
              <span className="text-[8.5px] sm:text-[10px] text-slate-500 font-medium">
                Occupied
              </span>
            );
          } else {
            statusBadge = (
              <span className="text-[8.5px] sm:text-[10px] text-slate-400 font-medium">
                Empty
              </span>
            );
          }

          return (
            <div
              key={slot.index}
              className={`flex flex-col items-center justify-between p-1.5 sm:p-2.5 md:p-3 rounded-xl border transition-all duration-200 relative group ${slotBgColor} ${slotBorderColor} ${
                isHighlighted && slot.state === 'idle' ? 'ring-2 ring-indigo-400/40' : ''
              } ${isLectureMode ? 'min-h-[88px] sm:min-h-[110px] p-2.5 sm:p-4' : 'min-h-[76px] sm:min-h-[88px] md:min-h-[95px]'}`}
            >
              {/* Slot Index Badge */}
              <div className="flex items-center justify-between w-full mb-0.5">
                <span className={`text-[9px] sm:text-[10px] md:text-[11px] font-mono font-bold px-1.5 py-0.2 rounded ${
                  isHighlighted ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  #{slot.index}
                </span>

                {slot.probeNumber !== undefined && (slot.state === 'probing' || slot.state === 'collision') && (
                  <span className="text-[7.5px] sm:text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                    P{slot.probeNumber}
                  </span>
                )}
              </div>

              {/* Slot Value */}
              <div className="my-0.5 flex items-center justify-center">
                {isTombstone ? (
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-rose-600 bg-rose-100 px-1 sm:px-2 py-0.5 rounded border border-rose-200">
                    DELETED
                  </span>
                ) : isOccupied ? (
                  <span className={`font-mono font-extrabold ${
                    isLectureMode ? 'text-lg sm:text-2xl md:text-3xl text-slate-900' : 'text-base sm:text-xl md:text-2xl text-slate-900'
                  }`}>
                    {slot.value}
                  </span>
                ) : (
                  <span className="text-base sm:text-xl md:text-2xl font-mono text-slate-300 font-light">
                    —
                  </span>
                )}
              </div>

              {/* Status footer */}
              <div className="w-full text-center mt-0.5 truncate">
                {statusBadge}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
