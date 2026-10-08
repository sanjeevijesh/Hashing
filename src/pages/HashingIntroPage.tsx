import React, { useState } from 'react';
import { 
  Key, 
  Zap, 
  Database, 
  Flame, 
  Gauge, 
  ArrowRight, 
  Layers, 
  GitCommit, 
  Network, 
  Repeat, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  Lightbulb
} from 'lucide-react';
import type { ActiveTab } from '../components/Navbar';
import { InteractiveHashFlow } from '../components/InteractiveHashFlow';

interface HashingIntroPageProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const HashingIntroPage: React.FC<HashingIntroPageProps> = ({ setActiveTab }) => {
  const [demoLoadFactor, setDemoLoadFactor] = useState<number>(0.6);

  return (
    <div className="space-y-12">
      
      {/* 1. Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold uppercase tracking-wider mb-2">
          <BookOpen className="w-3.5 h-3.5" /> Conceptual Lecture Notes
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          What is Hashing?
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
          <strong className="text-slate-900">Hashing</strong> is a computer science technique used to map a large key space to a compact, fixed-size range of indices in a hash table using a deterministic mathematical algorithm called a <strong className="text-indigo-600">Hash Function</strong>.
        </p>
      </div>

      {/* 2. Visual Component Anatomy: Key, Hash Function, Bucket, Collision */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Key Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex-shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Key (k)</h3>
              <span className="text-[11px] font-mono text-slate-500">The Input Identifier</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The unique piece of data provided by a user or program (e.g., student roll number, database ID, username). Can be an integer or string.
          </p>
          <div className="p-2.5 rounded-lg bg-slate-50 font-mono text-xs text-indigo-700 border border-slate-200 font-semibold">
            Example: Key = 42, 12, 1024
          </div>
        </div>

        {/* Hash Function Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Hash Function h(k)</h3>
              <span className="text-[11px] font-mono text-slate-500">The Reduction Engine</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            A fast, deterministic function that transforms an arbitrarily large key into an integer index strictly within the range [0, m - 1].
          </p>
          <div className="p-2.5 rounded-lg bg-slate-50 font-mono text-xs text-amber-700 border border-slate-200 font-semibold">
            Formula: h(k) = k % tableSize
          </div>
        </div>

        {/* Hash Table / Bucket Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex-shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Hash Table &amp; Bucket</h3>
              <span className="text-[11px] font-mono text-slate-500">Storage Array</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            An array of fixed length <code className="text-emerald-700 font-semibold">m</code>. Each slot or bucket stores values directly (open addressing) or references a list (chaining).
          </p>
          <div className="p-2.5 rounded-lg bg-slate-50 font-mono text-xs text-emerald-700 border border-slate-200 font-semibold">
            Table[0 ... m - 1]
          </div>
        </div>

      </div>

      {/* 3. Interactive Hash Function Visualizer */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Interactive Hash Function Visualizer
          </h2>
        </div>
        <p className="text-xs text-slate-600">
          Try inserting keys to observe the direct mapping: <span className="font-mono text-indigo-600 font-semibold">h(key) = key % tableSize</span>.
        </p>

        <InteractiveHashFlow onSelectTechnique={(tech) => setActiveTab(tech as ActiveTab)} />
      </section>

      {/* 4. What is a Collision? (Section 8) */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex-shrink-0">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
                Understanding Collisions
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                The Pigeonhole Principle guarantees collisions in bounded hash tables.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold self-start sm:self-auto">
            h(k₁) == h(k₂)
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          A <strong className="text-slate-900">collision</strong> occurs when multiple distinct keys produce the exact same table index. Since the universe of keys <code className="text-indigo-600 font-semibold">U</code> is always vastly larger than the table size <code className="text-indigo-600 font-semibold">m</code>, collisions are mathematically inevitable.
        </p>

        {/* Visual Collision Example Diagram as required in Section 8 */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-5 space-y-2.5 sm:space-y-3 font-mono">
          <div className="text-xs text-slate-600 font-semibold mb-2">
            Example: Table Size m = 10
          </div>

          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
              <span className="text-indigo-600 font-bold w-16 sm:w-20">h(12)</span>
              <span className="text-slate-500 font-medium">12 % 10 =</span>
              <span className="text-emerald-700 font-bold">Index 2</span>
              <span className="text-slate-400 text-[11px] sm:text-xs w-full sm:w-auto sm:ml-auto font-sans font-medium">First key occupies slot 2</span>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg bg-amber-50 border border-amber-300 shadow-2xs">
              <span className="text-indigo-600 font-bold w-16 sm:w-20">h(22)</span>
              <span className="text-slate-500 font-medium">22 % 10 =</span>
              <span className="text-amber-700 font-bold">Index 2</span>
              <span className="text-amber-800 text-[11px] sm:text-xs font-bold w-full sm:w-auto sm:ml-auto flex items-center gap-1 font-sans">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" /> ⚠ Collision with 12!
              </span>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg bg-amber-50 border border-amber-300 shadow-2xs">
              <span className="text-indigo-600 font-bold w-16 sm:w-20">h(32)</span>
              <span className="text-slate-500 font-medium">32 % 10 =</span>
              <span className="text-amber-700 font-bold">Index 2</span>
              <span className="text-amber-800 text-[11px] sm:text-xs font-bold w-full sm:w-auto sm:ml-auto flex items-center gap-1 font-sans">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" /> ⚠ Collision with 12 &amp; 22!
              </span>
            </div>
          </div>
        </div>

        {/* How Do We Resolve Collisions? */}
        <div className="pt-2">
          <h3 className="text-base font-bold text-slate-900 mb-2 sm:mb-3">
            How Do We Resolve Collisions?
          </h3>
          <p className="text-xs text-slate-600 mb-4">
            Collision resolution algorithms fall into two broad classifications:
            <strong className="text-indigo-600"> Open Addressing</strong> (finding another empty slot in the table) and 
            <strong className="text-indigo-600"> Closed Addressing / Chaining</strong> (chaining collided elements in external buckets).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <button
              onClick={() => setActiveTab('linear')}
              className="p-3.5 sm:p-4 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-sm transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <Layers className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Linear Probing</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Sequentially probe index + 1, index + 2...
              </p>
            </button>

            <button
              onClick={() => setActiveTab('quadratic')}
              className="p-3.5 sm:p-4 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-sm transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <GitCommit className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Quadratic Probing</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Jump quadratically: +1², +2², +3²...
              </p>
            </button>

            <button
              onClick={() => setActiveTab('chaining')}
              className="p-3.5 sm:p-4 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-amber-400 hover:shadow-sm transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <Network className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Separate Chaining</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Attach collided keys as linked lists.
              </p>
            </button>

            <button
              onClick={() => setActiveTab('double')}
              className="p-3.5 sm:p-4 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-purple-400 hover:shadow-sm transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <Repeat className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Double Hashing</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Jump by step size: h₁(k) + i × h₂(k).
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* 5. Load Factor Educational Section (Section 21) */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">
              The Load Factor (α)
            </h2>
          </div>
          <span className="font-mono text-xs font-bold text-indigo-600">
            α = n / m
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The <strong className="text-slate-900">Load Factor α</strong> measures how full the hash table is. It is defined as the ratio of stored elements <code className="text-indigo-600 font-semibold">n</code> to the total table capacity <code className="text-indigo-600 font-semibold">m</code>.
        </p>

        {/* Interactive Load Factor Slider */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-semibold">Simulate Load Factor:</span>
            <span className="font-mono font-bold text-indigo-600 text-sm">
              α = {demoLoadFactor.toFixed(2)} ({Math.round(demoLoadFactor * 10)} keys in 10 slots)
            </span>
          </div>

          <input
            type="range"
            min="0.1"
            max="0.95"
            step="0.05"
            value={demoLoadFactor}
            onChange={(e) => setDemoLoadFactor(parseFloat(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />

          {/* Indicator Scale */}
          <div className="flex flex-col xs:flex-row justify-between text-[10px] font-mono text-slate-500 gap-1 xs:gap-0">
            <span className="text-emerald-700 font-medium">0.10 (Sparse: Low Collision)</span>
            <span className="text-amber-700 font-medium xs:text-center">0.50 (Ideal Threshold)</span>
            <span className="text-rose-700 font-medium xs:text-right">0.90 (Critical Density)</span>
          </div>

          <div className="text-xs p-3 rounded-lg bg-white border border-slate-200 mt-2">
            {demoLoadFactor < 0.5 ? (
              <span className="text-emerald-700 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Table is healthy. Probability of collision is low, operations run in nearly O(1) time.
              </span>
            ) : demoLoadFactor < 0.75 ? (
              <span className="text-amber-700 flex items-center gap-1.5 font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Collisions occur frequently. Probing sequences grow longer.
              </span>
            ) : (
              <span className="text-rose-700 flex items-center gap-1.5 font-medium">
                <Flame className="w-4 h-4 text-rose-600" />
                Critical Load Factor! Searches degrade towards O(n). Real-world implementations trigger automatic Rehashing (doubling table size).
              </span>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};
