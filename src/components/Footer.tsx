import React from 'react';
import { Hash, GraduationCap, ShieldCheck } from 'lucide-react';
import type { ActiveTab } from './Navbar';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="mt-12 sm:mt-20 border-t border-slate-200 bg-white pt-8 sm:pt-12 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-10">
          
          {/* Col 1: Platform & Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
                <Hash className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-base text-slate-900 tracking-tight">
                Hashing Visualizer
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-md leading-relaxed">
              Interactive educational platform engineered for classroom demonstrations, algorithmic visualization, and self-paced mastery of Hash Tables and Collision Resolution strategies.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] text-slate-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Mathematically Rigorous Step Engine
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-900 mb-3">
              Algorithms
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <button onClick={() => setActiveTab('linear')} className="hover:text-indigo-600 transition-colors">
                  Linear Probing
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('quadratic')} className="hover:text-indigo-600 transition-colors">
                  Quadratic Probing
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('chaining')} className="hover:text-indigo-600 transition-colors">
                  Separate Chaining
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('double')} className="hover:text-indigo-600 transition-colors">
                  Double Hashing
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('universal-lab')} className="hover:text-amber-600 transition-colors">
                  Universal Collision Lab
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Attribution */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-indigo-600" /> Academic Attribution
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <p className="font-bold text-slate-900">G. Sivakama Sundari</p>
              <p className="text-slate-600 text-[11px] mt-0.5">Associate Professor</p>
              <p className="text-slate-600 text-[11px]">Department of Computer Science and Engineering</p>
              <p className="text-indigo-600 font-semibold text-[11px] mt-1">National Engineering College</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Hashing Visualizer • Educational Technology Project</p>
          <p className="flex items-center gap-1 font-medium">
            Built for National Engineering College CSE Students &amp; Faculty
          </p>
        </div>
      </div>
    </footer>
  );
};
