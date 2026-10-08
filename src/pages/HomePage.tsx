import React from 'react';
import { 
  ArrowRight, 
  Layers, 
  GitCommit, 
  Network, 
  Repeat, 
  Sparkles, 
  Zap, 
  BookOpen, 
  Flame,
  Key,
  Database
} from 'lucide-react';
import type { ActiveTab } from '../components/Navbar';
import { InteractiveHashFlow } from '../components/InteractiveHashFlow';

interface HomePageProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab }) => {
  const techniqueCards = [
    {
      id: 'linear' as ActiveTab,
      name: 'Linear Probing',
      formula: 'h(k, i) = (h(k) + i) % m',
      category: 'Open Addressing',
      desc: 'Sequentially searches the next contiguous slot. Extremely cache-friendly, but creates primary clustering.',
      color: 'from-blue-600 to-indigo-600',
      badge: 'Sequential Probing',
      icon: <Layers className="w-5 h-5 text-indigo-400" />
    },
    {
      id: 'quadratic' as ActiveTab,
      name: 'Quadratic Probing',
      formula: 'h(k, i) = (h(k) + i²) % m',
      category: 'Open Addressing',
      desc: 'Jumps by quadratic intervals (1², 2², 3²...). Dramatically reduces primary clustering across the table.',
      color: 'from-emerald-600 to-teal-600',
      badge: 'Quadratic Offsets',
      icon: <GitCommit className="w-5 h-5 text-emerald-400" />
    },
    {
      id: 'chaining' as ActiveTab,
      name: 'Separate Chaining',
      formula: 'Bucket[k % m] → Linked List',
      category: 'Closed Addressing',
      desc: 'Stores collisions in dynamic linked chains. The table never gets full and deletes require no tombstones.',
      color: 'from-amber-600 to-orange-600',
      badge: 'Linked Lists',
      icon: <Network className="w-5 h-5 text-amber-400" />
    },
    {
      id: 'double' as ActiveTab,
      name: 'Double Hashing',
      formula: 'h(k, i) = (h₁(k) + i × h₂(k)) % m',
      category: 'Open Addressing',
      desc: 'Calculates jump step using a secondary hash h₂(k). Provides uniform probe distribution and avoids clustering.',
      color: 'from-purple-600 to-pink-600',
      badge: 'Secondary Step',
      icon: <Repeat className="w-5 h-5 text-purple-400" />
    }
  ];

  const coreConcepts = [
    {
      term: 'Key (k)',
      desc: 'The unique data item or identifier (e.g. 42, Roll Number, or User ID) being inserted or searched.',
      icon: <Key className="w-4 h-4 text-indigo-400" />
    },
    {
      term: 'Hash Function h(k)',
      desc: 'Mathematical formula mapping large keys into a bounded array index range [0, m - 1].',
      icon: <Zap className="w-4 h-4 text-amber-400" />
    },
    {
      term: 'Hash Table',
      desc: 'Fixed or dynamic array of buckets designed for high-speed constant-time O(1) lookups.',
      icon: <Database className="w-4 h-4 text-emerald-400" />
    },
    {
      term: 'Collision',
      desc: 'Occurs when two or more distinct keys produce the exact same hash index: h(k₁) == h(k₂).',
      icon: <Flame className="w-4 h-4 text-rose-400" />
    }
  ];

  return (
    <div className="space-y-10 sm:space-y-16">
      
      {/* 1. Hero Section */}
      <section className="text-center pt-4 sm:pt-8 pb-2 sm:pb-4 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold uppercase tracking-wider mb-4 sm:mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Interactive Academic Teaching Platform
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Understand Hashing Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800">Visualization</span>
        </h1>

        <p className="text-sm sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mt-3 sm:mt-5 leading-relaxed font-light">
          Explore hash tables, collision resolution, and probing techniques through interactive step-by-step demonstrations.
        </p>

        {/* Primary and Secondary CTAs */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2.5 sm:gap-4 mt-6 sm:mt-8">
          <button
            onClick={() => setActiveTab('hashing-intro')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base shadow-sm transition-all hover:scale-105 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Start Learning</span>
          </button>

          <button
            onClick={() => setActiveTab('linear')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-slate-400 font-bold text-sm sm:text-base shadow-sm transition-all hover:scale-105 cursor-pointer"
          >
            <span>Open Visualizer</span>
            <ArrowRight className="w-4 h-4 text-indigo-600" />
          </button>

          <button
            onClick={() => setActiveTab('universal-lab')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold text-sm sm:text-base shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Collision Lab (Compare All)</span>
          </button>
        </div>

        {/* Attribution Badge */}
        <div className="mt-6 sm:mt-8 text-xs text-slate-500 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 font-mono">
          <span>Curated for Classroom Instruction by</span>
          <span className="text-slate-800 font-bold">G. Sivakama Sundari</span>
          <span>• NEC CSE</span>
        </div>
      </section>

      {/* 2. Conceptual Visualization Pipeline */}
      <section>
        <InteractiveHashFlow onSelectTechnique={(tech) => setActiveTab(tech as ActiveTab)} />
      </section>

      {/* 3. The 4 Collision Resolution Techniques Cards */}
      <section className="space-y-4 sm:space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Four Collision Resolution Techniques
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            When multiple keys hash to the same bucket index, how does the data structure resolve the conflict?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {techniqueCards.map((card) => (
            <div
              key={card.id}
              className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 group-hover:scale-105 transition-transform">
                    {card.icon}
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                    {card.category}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {card.name}
                </h3>

                <div className="my-2 p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-indigo-700 font-semibold truncate">
                  {card.formula}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  {card.desc}
                </p>
              </div>

              <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500 font-medium">
                  {card.badge}
                </span>

                <button
                  onClick={() => setActiveTab(card.id)}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 group-hover:translate-x-1 transition-all cursor-pointer"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Core Concepts Quick Reference */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Essential Terminology</h2>
            <p className="text-xs text-slate-600 mt-0.5">Foundational concepts every computer science student must master.</p>
          </div>
          <button
            onClick={() => setActiveTab('hashing-intro')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 self-start sm:self-center cursor-pointer"
          >
            <span>Full Hashing Theory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {coreConcepts.map((item, idx) => (
            <div key={idx} className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-2">
                {item.icon}
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-mono">{item.term}</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
