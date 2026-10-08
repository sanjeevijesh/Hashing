import React from 'react';
import { TECHNIQUES_THEORY } from '../data/theoryContent';
import { 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Info
} from 'lucide-react';

export const ComparePage: React.FC = () => {
  const comparisonData = [
    {
      name: 'Linear Probing',
      category: 'Open Addressing',
      formula: 'h(k, i) = (h(k) + i) % m',
      extraStructure: 'None (In-place array)',
      clustering: 'Severe Primary Clustering',
      cacheLocality: 'Excellent (Sequential memory)',
      deletionMechanism: 'Tombstones [DELETED] required',
      alphaLimit: 'α < 0.70 recommended'
    },
    {
      name: 'Quadratic Probing',
      category: 'Open Addressing',
      formula: 'h(k, i) = (h(k) + i²) % m',
      extraStructure: 'None (In-place array)',
      clustering: 'Secondary Clustering',
      cacheLocality: 'Good (Quadratic jumps)',
      deletionMechanism: 'Tombstones [DELETED] required',
      alphaLimit: 'α ≤ 0.50 + Prime table size'
    },
    {
      name: 'Separate Chaining',
      category: 'Closed Addressing',
      formula: 'Bucket[k % m] → List',
      extraStructure: 'Linked lists (Node pointers)',
      clustering: 'No Clustering between buckets',
      cacheLocality: 'Poor (Heap pointer chasing)',
      deletionMechanism: 'Standard node unlinking',
      alphaLimit: 'Can safely exceed α > 1.0'
    },
    {
      name: 'Double Hashing',
      category: 'Open Addressing',
      formula: 'h(k, i) = (h₁(k) + i × h₂(k)) % m',
      extraStructure: 'None (In-place array)',
      clustering: 'Minimal / Uniform distribution',
      cacheLocality: 'Moderate (Strided jumps)',
      deletionMechanism: 'Tombstones [DELETED] required',
      alphaLimit: 'α < 0.75 + Prime table size'
    }
  ];

  return (
    <div className="space-y-8 sm:space-y-12">
      
      {/* 1. Header */}
      <div className="border-b border-slate-200 pb-4 sm:pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold uppercase tracking-wider mb-2">
          <BarChart3 className="w-3.5 h-3.5" /> Comprehensive Algorithm Matrix
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Collision Resolution Comparison &amp; Complexity
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Detailed technical reference comparing open addressing vs. closed addressing across memory layout, clustering vulnerability, CPU cache behavior, and Big-O runtime bounds.
        </p>
      </div>

      {/* 2. Main Comparison Matrix Table (Section 20) */}
      <section className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-1 sm:gap-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Algorithm Feature Matrix</span>
          </h2>
          <span className="text-xs font-mono text-slate-500">
            Open vs. Closed Addressing
          </span>
        </div>

        <div className="overflow-x-auto no-scrollbar sm:no-scrollbar-none">
          <table className="w-full text-left text-xs border-collapse min-w-[620px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 font-mono uppercase text-[10px] sm:text-[11px] bg-slate-50">
                <th className="py-2.5 sm:py-3 px-3 sm:px-4">Technique</th>
                <th className="py-2.5 sm:py-3 px-3 sm:px-4">Approach</th>
                <th className="py-2.5 sm:py-3 px-3 sm:px-4">Extra Structure</th>
                <th className="py-2.5 sm:py-3 px-3 sm:px-4">Clustering Behavior</th>
                <th className="py-2.5 sm:py-3 px-3 sm:px-4">Cache Locality</th>
                <th className="py-2.5 sm:py-3 px-3 sm:px-4">Deletion Mechanism</th>
                <th className="py-2.5 sm:py-3 px-3 sm:px-4">Load Factor (α)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-slate-700">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 font-bold text-slate-900 font-mono">
                    {row.name}
                  </td>
                  <td className="py-2.5 sm:py-3.5 px-3 sm:px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {row.category}
                    </span>
                  </td>
                  <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 text-slate-600">{row.extraStructure}</td>
                  <td className="py-2.5 sm:py-3.5 px-3 sm:px-4">
                    <span className={`font-semibold ${
                      row.clustering.includes('Severe') ? 'text-rose-700' :
                      row.clustering.includes('Secondary') ? 'text-amber-700' :
                      'text-emerald-700'
                    }`}>
                      {row.clustering}
                    </span>
                  </td>
                  <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 text-slate-600">{row.cacheLocality}</td>
                  <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 font-mono text-[11px] text-slate-600">{row.deletionMechanism}</td>
                  <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 font-mono text-[11px] text-indigo-700 font-semibold">{row.alphaLimit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Complexity Reference Table (Section 32) */}
      <section className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-1 sm:gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Time &amp; Space Complexity Analysis
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Why hashing delivers expected O(1), NOT guaranteed O(1)!
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-700 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 font-bold self-start sm:self-auto">
            Expected: O(1)
          </span>
        </div>

        <div className="overflow-x-auto no-scrollbar sm:no-scrollbar-none">
          <table className="w-full text-left text-xs border-collapse min-w-[550px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 font-mono uppercase text-[10px] sm:text-[11px] bg-slate-50">
                <th className="py-2.5 sm:py-3 px-3 sm:px-4">Operation</th>
                <th className="py-2.5 sm:py-3 px-3 sm:px-4">Average Case</th>
                <th className="py-2.5 sm:py-3 px-3 sm:px-4">Worst Case</th>
                <th className="py-2.5 sm:py-3 px-3 sm:px-4">Trigger for Worst Case Degradation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-slate-700">
              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 font-bold text-slate-900 font-mono">Insert</td>
                <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 font-mono text-emerald-700 font-bold">O(1)</td>
                <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 font-mono text-rose-700 font-bold">O(n)</td>
                <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 text-slate-600 text-xs">Table nearly full (α → 1) or all keys hash to the same bucket</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 font-bold text-slate-900 font-mono">Search (Lookup)</td>
                <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 font-mono text-emerald-700 font-bold">O(1)</td>
                <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 font-mono text-rose-700 font-bold">O(n)</td>
                <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 text-slate-600 text-xs">Search requires probing through all collided elements or full chain length</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 font-bold text-slate-900 font-mono">Delete</td>
                <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 font-mono text-emerald-700 font-bold">O(1)</td>
                <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 font-mono text-rose-700 font-bold">O(n)</td>
                <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 text-slate-600 text-xs">Locating the element to delete requires full traversal of collision chain</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Vital Educational Note on Big-O */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-800">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Important Classroom Note on Hashing Complexity</span>
          </div>
          <p className="leading-relaxed">
            Students often mistakenly state that hash tables offer <em className="text-slate-900 font-semibold">"guaranteed O(1) time"</em>. In reality, actual hash table performance strictly depends on:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 ml-2">
            <li><strong>Uniformity of the Hash Function:</strong> Must distribute keys uniformly across buckets (Simple Uniform Hashing Assumption).</li>
            <li><strong>Load Factor (α):</strong> If α is allowed to exceed thresholds without rehashing, probe lengths explode.</li>
            <li><strong>Key Distribution:</strong> Pathological or malicious key sets (HashDoS attacks) can force all keys into a single bucket.</li>
          </ul>
        </div>
      </section>

      {/* 4. Advantages & Limitations Visual Cards (Section 31) */}
      <section className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Advantages &amp; Limitations Breakdown
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {Object.values(TECHNIQUES_THEORY).map((tech) => (
            <div key={tech.id} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">{tech.name}</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                  {tech.category}
                </span>
              </div>

              {/* Advantages */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Advantages
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {tech.advantages.map((adv, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Limitations */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" /> Limitations
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {tech.limitations.map((lim, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{lim}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Tombstones Deep-Dive */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm space-y-3 sm:space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex-shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Why Do Open Addressing Deletions Require Tombstones?</h3>
            <span className="text-xs text-slate-500">The danger of prematurely terminating probe chains</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          In Open Addressing, when searching for a key, the algorithm continues probing until it encounters an <strong>EMPTY slot</strong> (which proves the key was never inserted). If you simply deleted a key by setting its slot to <code className="text-indigo-700 font-mono bg-indigo-50 px-1 py-0.5 rounded font-semibold">EMPTY</code>, you would break the probe chain for all other keys that previously collided and probed past that slot!
        </p>

        <div className="p-3 sm:p-4 rounded-xl bg-slate-50 font-mono text-xs text-slate-700 border border-slate-200 space-y-1.5">
          <div className="text-slate-800 font-bold">The Tombstone Solution:</div>
          <div>1. Slot is marked as <span className="text-rose-700 font-bold bg-rose-50 px-1 rounded border border-rose-200">DELETED (Tombstone)</span> instead of EMPTY.</div>
          <div>2. <strong>Search Operation:</strong> Treats DELETED as occupied (keeps probing past it).</div>
          <div>3. <strong>Insert Operation:</strong> Can safely reuse a DELETED slot for a new key.</div>
        </div>
      </section>

    </div>
  );
};
