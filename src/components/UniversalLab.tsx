import React, { useState, useEffect } from 'react';
import type { HashSlot } from '../types/hashing';
import { 
  createInitialTable, 
  generateInsertSteps
} from '../algorithms/hashingEngine';
import { Play, RotateCcw, Sparkles, Layers, GitCommit, Network, Repeat, Flame } from 'lucide-react';

export const UniversalLab: React.FC = () => {
  const [keySequenceText, setKeySequenceText] = useState<string>('12, 22, 32, 42, 52');
  const [tableSize, setTableSize] = useState<number>(10);

  // States for all 4 algorithms
  const [linearTable, setLinearTable] = useState<HashSlot[]>([]);
  const [quadTable, setQuadTable] = useState<HashSlot[]>([]);
  const [chainTable, setChainTable] = useState<HashSlot[]>([]);
  const [doubleTable, setDoubleTable] = useState<HashSlot[]>([]);

  // Telemetry for comparison
  const [metrics, setMetrics] = useState({
    linear: { collisions: 0, totalProbes: 0, insertedCount: 0 },
    quadratic: { collisions: 0, totalProbes: 0, insertedCount: 0 },
    chaining: { collisions: 0, totalProbes: 0, maxChain: 0, insertedCount: 0 },
    double: { collisions: 0, totalProbes: 0, insertedCount: 0 }
  });

  const parseKeys = (): number[] => {
    return keySequenceText
      .split(',')
      .map(k => parseInt(k.trim()))
      .filter(k => !isNaN(k));
  };

  const handleRunAll = () => {
    const keys = parseKeys();
    if (keys.length === 0) return;

    // 1. Linear Probing Run
    let lt = createInitialTable(tableSize, 'linear');
    let lCollisions = 0;
    let lProbes = 0;
    let lInserted = 0;

    for (const k of keys) {
      const res = generateInsertSteps(lt, k, 'linear', tableSize);
      if (res.success) {
        lt = res.newTable;
        lInserted++;
      }
      if (res.collisionOccurred) lCollisions++;
      lProbes += res.totalProbes;
    }

    // 2. Quadratic Probing Run
    let qt = createInitialTable(tableSize, 'quadratic');
    let qCollisions = 0;
    let qProbes = 0;
    let qInserted = 0;

    for (const k of keys) {
      const res = generateInsertSteps(qt, k, 'quadratic', tableSize);
      if (res.success) {
        qt = res.newTable;
        qInserted++;
      }
      if (res.collisionOccurred) qCollisions++;
      qProbes += res.totalProbes;
    }

    // 3. Separate Chaining Run
    let ct = createInitialTable(tableSize, 'chaining');
    let cCollisions = 0;
    let cProbes = 0;
    let cInserted = 0;
    let maxChain = 0;

    for (const k of keys) {
      const res = generateInsertSteps(ct, k, 'chaining', tableSize);
      if (res.success) {
        ct = res.newTable;
        cInserted++;
      }
      if (res.collisionOccurred) cCollisions++;
      cProbes += res.totalProbes;
    }
    ct.forEach(slot => {
      const len = slot.chain?.length || 0;
      if (len > maxChain) maxChain = len;
    });

    // 4. Double Hashing Run
    let dt = createInitialTable(tableSize, 'double');
    let dCollisions = 0;
    let dProbes = 0;
    let dInserted = 0;

    for (const k of keys) {
      const res = generateInsertSteps(dt, k, 'double', tableSize);
      if (res.success) {
        dt = res.newTable;
        dInserted++;
      }
      if (res.collisionOccurred) dCollisions++;
      dProbes += res.totalProbes;
    }

    setLinearTable(lt);
    setQuadTable(qt);
    setChainTable(ct);
    setDoubleTable(dt);

    setMetrics({
      linear: { collisions: lCollisions, totalProbes: lProbes, insertedCount: lInserted },
      quadratic: { collisions: qCollisions, totalProbes: qProbes, insertedCount: qInserted },
      chaining: { collisions: cCollisions, totalProbes: cProbes, maxChain, insertedCount: cInserted },
      double: { collisions: dCollisions, totalProbes: dProbes, insertedCount: dInserted }
    });
  };

  const handleReset = () => {
    setLinearTable(createInitialTable(tableSize, 'linear'));
    setQuadTable(createInitialTable(tableSize, 'quadratic'));
    setChainTable(createInitialTable(tableSize, 'chaining'));
    setDoubleTable(createInitialTable(tableSize, 'double'));
    setMetrics({
      linear: { collisions: 0, totalProbes: 0, insertedCount: 0 },
      quadratic: { collisions: 0, totalProbes: 0, insertedCount: 0 },
      chaining: { collisions: 0, totalProbes: 0, maxChain: 0, insertedCount: 0 },
      double: { collisions: 0, totalProbes: 0, insertedCount: 0 }
    });
  };

  useEffect(() => {
    handleRunAll();
  }, [tableSize]);

  const handleRandomize = () => {
    const randomSet = Array.from({ length: 5 }, () => Math.floor(Math.random() * 80) + 10);
    setKeySequenceText(randomSet.join(', '));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hero Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Universal Collision Technique Lab
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Side-by-Side Multi-Algorithm Comparison
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Feed the <span className="text-indigo-600 font-semibold">EXACT SAME sequence of keys</span> into Linear Probing, Quadratic Probing, Separate Chaining, and Double Hashing simultaneously. Observe how each technique resolves identical collisions.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleRunAll}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Run All 4 Techniques</span>
            </button>
            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
              title="Reset Lab"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Input Sequence Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 items-end">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Comma-Separated Input Keys Sequence:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={keySequenceText}
                onChange={(e) => setKeySequenceText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
              />
              <button
                onClick={handleRandomize}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 whitespace-nowrap cursor-pointer transition-colors"
              >
                Randomize
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Table Size (m):
            </label>
            <select
              value={tableSize}
              onChange={(e) => setTableSize(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
            >
              <option value={7}>7 (Prime)</option>
              <option value={10}>10 (Standard Modulo)</option>
              <option value={11}>11 (Prime)</option>
              <option value={13}>13 (Prime)</option>
            </select>
          </div>
        </div>

        {/* Preset sequence shortcuts */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 text-xs text-slate-600">
          <span className="font-semibold text-slate-700 text-[11px] sm:text-xs">Quick Sequences:</span>
          <button
            onClick={() => { setKeySequenceText('12, 22, 32, 42, 52'); setTimeout(handleRunAll, 50); }}
            className="px-2 sm:px-2.5 py-1 rounded bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white border border-slate-200 text-[10.5px] sm:text-[11px] font-mono transition-colors cursor-pointer"
          >
            All Colliding on Index 2: [12, 22, 32, 42, 52]
          </button>
          <button
            onClick={() => { setKeySequenceText('10, 11, 12, 13, 20'); setTimeout(handleRunAll, 50); }}
            className="px-2 sm:px-2.5 py-1 rounded bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white border border-slate-200 text-[10.5px] sm:text-[11px] font-mono transition-colors cursor-pointer"
          >
            Cluster Seed: [10, 11, 12, 13, 20]
          </button>
          <button
            onClick={() => { setKeySequenceText('5, 15, 25, 35, 45, 55'); setTimeout(handleRunAll, 50); }}
            className="px-2 sm:px-2.5 py-1 rounded bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white border border-slate-200 text-[10.5px] sm:text-[11px] font-mono transition-colors cursor-pointer"
          >
            Index 5 Heavy: [5, 15, 25, 35, 45, 55]
          </button>
        </div>
      </div>

      {/* 4 Simultaneous Visualizations Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        
        {/* 1. Linear Probing */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 flex-shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Linear Probing</h3>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono">h(k, i) = (k % m + i) % m</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono flex-wrap">
              <span className="text-amber-700 font-semibold flex items-center gap-1 text-[11px] sm:text-xs">
                <Flame className="w-3.5 h-3.5 text-amber-500" /> {metrics.linear.collisions} Collisions
              </span>
              <span className="text-emerald-700 font-semibold text-[11px] sm:text-xs">
                {metrics.linear.totalProbes} Total Probes
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-600 leading-relaxed">
            Sequential step search creates <strong className="text-amber-800 bg-amber-50 px-1 rounded">Primary Clustering</strong>: contiguous chains of occupied slots.
          </div>

          {/* Slots */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 sm:gap-1.5 pt-1">
            {linearTable.map(slot => (
              <div
                key={slot.index}
                className={`flex flex-col items-center justify-center p-1 sm:p-2 rounded-lg border text-center font-mono ${
                  slot.value !== null
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-950'
                    : 'bg-slate-50 border-slate-200/80 text-slate-400'
                }`}
              >
                <span className="text-[9px] sm:text-[10px] text-slate-400">#{slot.index}</span>
                <span className={`font-extrabold text-xs sm:text-sm mt-0.5 ${slot.value !== null ? 'text-indigo-700' : 'text-slate-300'}`}>
                  {slot.value !== null ? slot.value : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Quadratic Probing */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 flex-shrink-0">
                <GitCommit className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Quadratic Probing</h3>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono">h(k, i) = (k % m + i²) % m</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono flex-wrap">
              <span className="text-amber-700 font-semibold flex items-center gap-1 text-[11px] sm:text-xs">
                <Flame className="w-3.5 h-3.5 text-amber-500" /> {metrics.quadratic.collisions} Collisions
              </span>
              <span className="text-emerald-700 font-semibold text-[11px] sm:text-xs">
                {metrics.quadratic.totalProbes} Total Probes
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-600 leading-relaxed">
            Jump offsets (1, 4, 9, 16...) eliminate primary clustering, spreading entries across the table.
          </div>

          {/* Slots */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 sm:gap-1.5 pt-1">
            {quadTable.map(slot => (
              <div
                key={slot.index}
                className={`flex flex-col items-center justify-center p-1 sm:p-2 rounded-lg border text-center font-mono ${
                  slot.value !== null
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-slate-50 border-slate-200/80 text-slate-400'
                }`}
              >
                <span className="text-[9px] sm:text-[10px] text-slate-400">#{slot.index}</span>
                <span className={`font-extrabold text-xs sm:text-sm mt-0.5 ${slot.value !== null ? 'text-emerald-700' : 'text-slate-300'}`}>
                  {slot.value !== null ? slot.value : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Separate Chaining */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 flex-shrink-0">
                <Network className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Separate Chaining</h3>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono">Bucket[k % m] → Linked List</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono flex-wrap">
              <span className="text-indigo-700 font-semibold text-[11px] sm:text-xs">
                Max Chain: {metrics.chaining.maxChain} nodes
              </span>
              <span className="text-emerald-700 font-semibold text-[11px] sm:text-xs">
                {metrics.chaining.insertedCount} Inserted
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-600 leading-relaxed">
            Collisions append to independent bucket lists without interfering with other table slots.
          </div>

          {/* Buckets */}
          <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
            {chainTable.map(slot => (
              <div key={slot.index} className="flex items-center gap-2 text-xs font-mono">
                <span className="w-10 sm:w-12 text-slate-500 font-semibold text-[11px] sm:text-xs flex-shrink-0">[{slot.index}]:</span>
                <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                  {(slot.chain || []).length === 0 ? (
                    <span className="text-slate-400 text-[10px] sm:text-[11px]">NULL</span>
                  ) : (
                    (slot.chain || []).map((val, idx) => (
                      <span key={idx} className="flex items-center gap-1">
                        <span className="px-1.5 sm:px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-900 font-bold text-[11px] sm:text-xs">
                          {val}
                        </span>
                        <span className="text-slate-400 font-bold text-xs">→</span>
                      </span>
                    ))
                  )}
                  {(slot.chain || []).length > 0 && <span className="text-slate-400 text-[9px] sm:text-[10px] font-semibold">NULL</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Double Hashing */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 flex-shrink-0">
                <Repeat className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Double Hashing</h3>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono">h(k, i) = (h₁(k) + i × h₂(k)) % m</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono flex-wrap">
              <span className="text-amber-700 font-semibold flex items-center gap-1 text-[11px] sm:text-xs">
                <Flame className="w-3.5 h-3.5 text-amber-500" /> {metrics.double.collisions} Collisions
              </span>
              <span className="text-emerald-700 font-semibold text-[11px] sm:text-xs">
                {metrics.double.totalProbes} Total Probes
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-600 leading-relaxed">
            Secondary hash step h₂(k) ensures keys with same initial index trace completely different paths.
          </div>

          {/* Slots */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 sm:gap-1.5 pt-1">
            {doubleTable.map(slot => (
              <div
                key={slot.index}
                className={`flex flex-col items-center justify-center p-1 sm:p-2 rounded-lg border text-center font-mono ${
                  slot.value !== null
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-950'
                    : 'bg-slate-50 border-slate-200/80 text-slate-400'
                }`}
              >
                <span className="text-[9px] sm:text-[10px] text-slate-400">#{slot.index}</span>
                <span className={`font-extrabold text-xs sm:text-sm mt-0.5 ${slot.value !== null ? 'text-indigo-700' : 'text-slate-300'}`}>
                  {slot.value !== null ? slot.value : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
