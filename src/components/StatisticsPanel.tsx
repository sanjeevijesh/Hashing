import React from 'react';
import type { HashStats, AlgorithmType } from '../types/hashing';
import { Activity, Gauge, Flame, CheckCircle2, XCircle, Layers, AlertCircle } from 'lucide-react';

interface StatisticsPanelProps {
  stats: HashStats;
  algorithm: AlgorithmType;
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ stats, algorithm }) => {
  const isChaining = algorithm === 'chaining';
  const loadFactorPercent = Math.min(100, Math.round(stats.loadFactor * 100));

  // Determine load factor health
  let loadFactorColor = 'text-emerald-400';
  let loadFactorBg = 'bg-emerald-500';
  let loadFactorWarning = null;

  if (!isChaining) {
    if (stats.loadFactor >= 0.75) {
      loadFactorColor = 'text-rose-400';
      loadFactorBg = 'bg-rose-500';
      loadFactorWarning = 'Critical: α ≥ 0.75 in open addressing leads to extreme collision clustering!';
    } else if (stats.loadFactor >= 0.5) {
      loadFactorColor = 'text-amber-400';
      loadFactorBg = 'bg-amber-500';
      loadFactorWarning = 'Moderate: Collision probability increases as α exceeds 0.50.';
    }
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-800">
            Real-Time Lab Statistics
          </h4>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
          Live Telemetry
        </span>
      </div>

      {/* Load Factor Gauge */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-indigo-600" /> Load Factor (α = n / m):
          </span>
          <span className={`font-mono font-bold text-sm ${loadFactorColor}`}>
            {stats.loadFactor.toFixed(2)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
          <div
            className={`h-full transition-all duration-300 ${loadFactorBg}`}
            style={{ width: `${Math.min(100, isChaining ? stats.loadFactor * 50 : loadFactorPercent)}%` }}
          />
        </div>

        <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
          <span>0.00 (Empty)</span>
          <span>0.50 (Optimum)</span>
          <span>1.00 (Full)</span>
        </div>

        {loadFactorWarning && (
          <div className="mt-2 text-[11px] text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-600" />
            <span>{loadFactorWarning}</span>
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
        {/* Table Size & Elements */}
        <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] text-slate-500 block uppercase font-mono">Table Size (m)</span>
          <span className="text-base font-mono font-bold text-slate-900">{stats.tableSize} slots</span>
        </div>

        <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] text-slate-500 block uppercase font-mono">Stored Keys (n)</span>
          <span className="text-base font-mono font-bold text-indigo-700">{stats.elementCount}</span>
        </div>

        {/* Collisions */}
        <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] text-slate-500 block uppercase font-mono flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-500" /> Collisions
          </span>
          <span className="text-base font-mono font-bold text-amber-700">{stats.collisions}</span>
        </div>

        {/* Avg Probes */}
        <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] text-slate-500 block uppercase font-mono">Avg Probes / Op</span>
          <span className="text-base font-mono font-bold text-emerald-700">{stats.averageProbes}</span>
        </div>

        {/* Successful & Failed searches */}
        <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] text-slate-500 block uppercase font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Search Hits
          </span>
          <span className="text-base font-mono font-bold text-emerald-700">{stats.successfulSearches}</span>
        </div>

        {isChaining ? (
          <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] text-slate-500 block uppercase font-mono flex items-center gap-1">
              <Layers className="w-3 h-3 text-indigo-600" /> Max Chain
            </span>
            <span className="text-base font-mono font-bold text-indigo-700">{stats.maxChainLength} nodes</span>
          </div>
        ) : (
          <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] text-slate-500 block uppercase font-mono flex items-center gap-1">
              <XCircle className="w-3 h-3 text-rose-500" /> Search Misses
            </span>
            <span className="text-base font-mono font-bold text-rose-700">{stats.failedSearches}</span>
          </div>
        )}
      </div>
    </div>
  );
};
