import React, { useState } from 'react';
import type { AlgorithmType } from '../types/hashing';
import { CODE_IMPLEMENTATIONS } from '../data/codeImplementations';
import type { SupportedLanguage } from '../data/codeImplementations';
import { Copy, Check, Code, X } from 'lucide-react';

interface CodeModalProps {
  algorithm: AlgorithmType;
  isOpen: boolean;
  onClose: () => void;
}

export const CodeModal: React.FC<CodeModalProps> = ({ algorithm, isOpen, onClose }) => {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('cpp');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const code = CODE_IMPLEMENTATIONS[algorithm][selectedLang];

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const languages: { id: SupportedLanguage; label: string }[] = [
    { id: 'c', label: 'C' },
    { id: 'cpp', label: 'C++' },
    { id: 'java', label: 'Java' },
    { id: 'python', label: 'Python' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex-shrink-0">
              <Code className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 capitalize">
                {algorithm} Probing Implementation
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Production-grade, educational code for classroom reference &amp; student study
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Tabs & Copy Button */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 sm:px-6 py-2 sm:py-3 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLang(lang.id)}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  selectedLang === lang.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer ml-auto"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content Box */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 bg-slate-950 font-mono text-[11px] sm:text-xs leading-relaxed text-slate-100 selection:bg-indigo-500/40 selection:text-white">
          <pre className="whitespace-pre">
            {code}
          </pre>
        </div>

        {/* Footer info */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-t border-slate-100 bg-slate-50 text-[11px] sm:text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
          <span>Department of Computer Science and Engineering, National Engineering College</span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
