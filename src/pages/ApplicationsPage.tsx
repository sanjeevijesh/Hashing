import React from 'react';
import { HASHING_APPLICATIONS } from '../data/theoryContent';
import { 
  GraduationCap, 
  Database, 
  Cpu, 
  Zap, 
  ShieldAlert, 
  Layers, 
  HardDrive,
  AlertTriangle
} from 'lucide-react';

export const ApplicationsPage: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Database': return <Database className="w-5 h-5 text-indigo-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-emerald-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'Layers': return <Layers className="w-5 h-5 text-purple-400" />;
      case 'HardDrive': return <HardDrive className="w-5 h-5 text-blue-400" />;
      default: return <Database className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      
      {/* 1. Header */}
      <div className="border-b border-slate-200 pb-4 sm:pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold uppercase tracking-wider mb-2">
          <GraduationCap className="w-3.5 h-3.5" /> Industry &amp; Real-World Practice
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Real-World Applications of Hashing
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
          From compiler symbol tables and database indexing engines to high-speed distributed in-memory caches, hashing powers foundational computing systems.
        </p>
      </div>

      {/* 2. Critical Security Distinction Callout (Required in Section 29) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 shadow-sm space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-800 text-xs sm:text-sm">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-amber-600" />
          <span>Crucial Security Concept: Hash Tables vs. Cryptographic Password Hashing</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          In undergraduate coursework, students frequently confuse <strong className="text-slate-900">Hash Tables</strong> with <strong className="text-slate-900">Password Storage Security</strong>. Hash tables use non-cryptographic, lightning-fast hash functions (like modulo or MurmurHash) designed for low collision in RAM. Password verification requires slow, salted, computationally expensive <em>one-way cryptographic hash functions</em> (such as <code className="text-amber-900 font-mono font-bold bg-amber-100 px-1 py-0.5 rounded break-all sm:break-normal">Argon2id</code> or <code className="text-amber-900 font-mono font-bold bg-amber-100 px-1 py-0.5 rounded break-all sm:break-normal">bcrypt</code>) to deliberately resist GPU brute-force attacks!
        </p>
      </div>

      {/* 3. Applications Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {HASHING_APPLICATIONS.map((app, idx) => (
          <div
            key={idx}
            className={`bg-white border rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
              app.caution ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200 hover:border-indigo-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200">
                  {getIcon(app.icon)}
                </div>
                <span className={`text-[10px] font-mono uppercase px-2 sm:px-2.5 py-0.5 rounded-full border font-bold ${
                  app.caution 
                    ? 'bg-amber-100 text-amber-800 border-amber-300' 
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {app.badge}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 sm:mb-2">
                {app.title}
              </h3>

              <p className="text-xs text-indigo-600 font-semibold mb-2 sm:mb-3">
                {app.summary}
              </p>

              <p className="text-xs text-slate-600 leading-relaxed">
                {app.details}
              </p>
            </div>

            {app.caution && (
              <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-amber-200 text-[10.5px] sm:text-[11px] text-amber-800 font-medium italic">
                ⚠ {app.caution}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
