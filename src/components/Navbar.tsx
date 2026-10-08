import React, { useState, useRef, useEffect } from 'react';
import { 
  Hash, 
  Layers, 
  GitCommit, 
  Network, 
  Repeat, 
  BarChart3, 
  BookOpen, 
  Presentation, 
  Maximize, 
  Minimize, 
  Menu, 
  X,
  GraduationCap,
  Sparkles,
  ChevronDown,
  Check,
  Flame,
  ArrowRight
} from 'lucide-react';

export type ActiveTab = 
  | 'home' 
  | 'hashing-intro' 
  | 'linear' 
  | 'quadratic' 
  | 'chaining' 
  | 'double' 
  | 'universal-lab' 
  | 'compare' 
  | 'applications';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isLectureMode: boolean;
  setIsLectureMode: (val: boolean) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isLectureMode,
  setIsLectureMode,
  isFullscreen,
  toggleFullscreen
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [algorithmsDropdownOpen, setAlgorithmsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close algorithms dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAlgorithmsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const algorithmList: { id: ActiveTab; label: string; formula: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'linear',
      label: 'Linear Probing',
      formula: 'h(k, i) = (h(k) + i) % m',
      desc: 'Sequential slot scanning • Primary clustering',
      icon: <Layers className="w-4 h-4 text-indigo-600" />
    },
    {
      id: 'quadratic',
      label: 'Quadratic Probing',
      formula: 'h(k, i) = (h(k) + i²) % m',
      desc: 'Quadratic intervals • Secondary clustering',
      icon: <GitCommit className="w-4 h-4 text-emerald-600" />
    },
    {
      id: 'chaining',
      label: 'Separate Chaining',
      formula: 'Bucket[k % m] → List',
      desc: 'Dynamic linked lists • No tombstones',
      icon: <Network className="w-4 h-4 text-amber-600" />
    },
    {
      id: 'double',
      label: 'Double Hashing',
      formula: 'h(k, i) = (h₁(k) + i × h₂(k)) % m',
      desc: 'Dual hash functions • Uniform distribution',
      icon: <Repeat className="w-4 h-4 text-purple-600" />
    }
  ];

  const quickPills: { id: ActiveTab; label: string; shortLabel: string; icon: React.ReactNode; isLab?: boolean }[] = [
    { id: 'home', label: 'Home', shortLabel: 'Home', icon: <Hash className="w-3.5 h-3.5" /> },
    { id: 'hashing-intro', label: 'Intro', shortLabel: 'Intro', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'linear', label: 'Linear', shortLabel: 'Linear', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'quadratic', label: 'Quadratic', shortLabel: 'Quad', icon: <GitCommit className="w-3.5 h-3.5" /> },
    { id: 'chaining', label: 'Chaining', shortLabel: 'Chain', icon: <Network className="w-3.5 h-3.5" /> },
    { id: 'double', label: 'Double', shortLabel: 'Double', icon: <Repeat className="w-3.5 h-3.5" /> },
    { id: 'universal-lab', label: 'Collision Lab', shortLabel: 'Lab', icon: <Sparkles className="w-3.5 h-3.5" />, isLab: true },
    { id: 'compare', label: 'Compare', shortLabel: 'Compare', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'applications', label: 'Applications', shortLabel: 'Apps', icon: <GraduationCap className="w-3.5 h-3.5" /> },
  ];

  const isAlgorithmActive = ['linear', 'quadratic', 'chaining', 'double'].includes(activeTab);
  const currentAlgorithmObj = algorithmList.find(a => a.id === activeTab);

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setAlgorithmsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs transition-all duration-200">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 sm:h-16">
          
          {/* Brand Identity */}
          <div 
            onClick={() => handleTabClick('home')} 
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none min-w-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
              <Hash className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-sm sm:text-base md:text-lg tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                  Hashing Visualizer
                </span>
                <span className="hidden md:inline-block text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/80 flex-shrink-0">
                  NEC CSE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block truncate">
                Interactive Hashing &amp; Collision Resolution
              </p>
            </div>
          </div>

          {/* Desktop Navigation (lg+) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {/* 1. Home */}
            <button
              onClick={() => handleTabClick('home')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'home'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/90 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            {/* 2. Hashing Concepts */}
            <button
              onClick={() => handleTabClick('hashing-intro')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'hashing-intro'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/90 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Concepts</span>
            </button>

            {/* 3. Algorithms Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setAlgorithmsDropdownOpen(!algorithmsDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border ${
                  isAlgorithmActive
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200/90 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'
                }`}
              >
                {isAlgorithmActive && currentAlgorithmObj ? (
                  <>
                    {currentAlgorithmObj.icon}
                    <span>{currentAlgorithmObj.label}</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Algorithms</span>
                  </>
                )}
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${algorithmsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Panel */}
              {algorithmsDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-fade-in space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100">
                    Collision Techniques
                  </div>
                  {algorithmList.map(algo => {
                    const isSelected = activeTab === algo.id;
                    return (
                      <button
                        key={algo.id}
                        onClick={() => handleTabClick(algo.id)}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50/80 border border-indigo-200 text-indigo-900'
                            : 'hover:bg-slate-50 border border-transparent text-slate-700'
                        }`}
                      >
                        <div className="mt-0.5 p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                          {algo.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900">{algo.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 stroke-[3]" />}
                          </div>
                          <p className="font-mono text-[10px] text-indigo-600 truncate mt-0.5 font-medium">{algo.formula}</p>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">{algo.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. Universal Collision Lab */}
            <button
              onClick={() => handleTabClick('universal-lab')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'universal-lab'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Collision Lab</span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase ${
                activeTab === 'universal-lab' ? 'bg-amber-600 text-white' : 'bg-amber-200/80 text-amber-900'
              }`}>
                4-in-1
              </span>
            </button>

            {/* 5. Theory & Compare */}
            <button
              onClick={() => handleTabClick('compare')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'compare'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/90 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Theory &amp; Compare</span>
            </button>

            {/* 6. Applications */}
            <button
              onClick={() => handleTabClick('applications')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'applications'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/90 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Applications</span>
            </button>
          </nav>

          {/* Action Tools & Mobile Toggles */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Lecture Mode Toggle */}
            <button
              onClick={() => setIsLectureMode(!isLectureMode)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border shadow-2xs cursor-pointer ${
                isLectureMode
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-amber-400 hover:text-amber-700'
              }`}
              title="Toggle Classroom Lecture Mode"
            >
              <Presentation className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Lecture Mode</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 sm:p-2 rounded-lg bg-white text-slate-700 border border-slate-300 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Presentation'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg bg-white text-slate-700 border border-slate-300 hover:text-slate-900 hover:bg-slate-50 shadow-2xs cursor-pointer"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>

      {/* Horizontal Quick-Scroll Pill Bar for Mobile & Tablet (< lg) */}
      <div className="lg:hidden border-t border-slate-100 bg-slate-50/80 px-2 py-1.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max px-1">
          {quickPills.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? item.isLab 
                      ? 'bg-amber-500 text-white shadow-2xs' 
                      : 'bg-indigo-600 text-white shadow-2xs'
                    : item.isLab
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Full-Feature Mobile Off-Canvas Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fade-in">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-sm sm:max-w-md bg-white shadow-2xl z-50 flex flex-col justify-between overflow-y-auto animate-slide-left border-l border-slate-200">
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
                    <Hash className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">Hashing Visualizer</h3>
                    <span className="text-[10px] font-mono text-indigo-600 font-semibold">National Engineering College</span>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links Sections */}
              <div className="p-4 sm:p-5 space-y-5">
                {/* 1. Core Overview */}
                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                    Foundational
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleTabClick('home')}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-left text-xs font-semibold transition-colors border ${
                        activeTab === 'home'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Hash className="w-4 h-4 text-indigo-600" />
                      <span>Home</span>
                    </button>
                    <button
                      onClick={() => handleTabClick('hashing-intro')}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-left text-xs font-semibold transition-colors border ${
                        activeTab === 'hashing-intro'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                      <span>Concepts</span>
                    </button>
                  </div>
                </div>

                {/* 2. The 4 Collision Resolution Algorithms */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                      Collision Algorithms
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">4 Modes</span>
                  </div>
                  <div className="space-y-1.5">
                    {algorithmList.map(algo => {
                      const isActive = activeTab === algo.id;
                      return (
                        <button
                          key={algo.id}
                          onClick={() => handleTabClick(algo.id)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors border ${
                            isActive
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-950 font-bold shadow-2xs'
                              : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="p-1.5 rounded-lg bg-white border border-slate-200">
                              {algo.icon}
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold block truncate text-slate-900">{algo.label}</span>
                              <span className="text-[10px] font-mono text-indigo-600 block truncate">{algo.formula}</span>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Analysis & Comparative Labs */}
                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                    Comparative Study
                  </h4>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => handleTabClick('universal-lab')}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left border transition-colors ${
                        activeTab === 'universal-lab'
                          ? 'bg-amber-500 text-white border-amber-600 font-bold shadow-sm'
                          : 'bg-amber-50/60 text-amber-900 border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <div>
                          <span className="text-xs font-bold block">Universal Collision Lab</span>
                          <span className="text-[10px] opacity-80 block">Run all 4 techniques side-by-side</span>
                        </div>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase bg-amber-200/70 text-amber-900">
                        Live Lab
                      </span>
                    </button>

                    <button
                      onClick={() => handleTabClick('compare')}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left border transition-colors ${
                        activeTab === 'compare'
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-indigo-600" />
                        <div>
                          <span className="text-xs font-bold block text-slate-900">Theory &amp; Big-O Matrix</span>
                          <span className="text-[10px] text-slate-500 block">Feature comparison &amp; clustering trade-offs</span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => handleTabClick('applications')}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left border transition-colors ${
                        activeTab === 'applications'
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-indigo-600" />
                        <div>
                          <span className="text-xs font-bold block text-slate-900">Real-World Applications</span>
                          <span className="text-[10px] text-slate-500 block">Databases, symbol tables, &amp; security</span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* 4. Classroom Presentation Mode Shortcut in Drawer */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsLectureMode(!isLectureMode);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer ${
                      isLectureMode
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <Presentation className="w-4 h-4" />
                    <span>{isLectureMode ? 'Exit Classroom Lecture Mode' : 'Enter Classroom Lecture Mode'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Academic Attribution Footer inside Drawer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/70 text-xs text-slate-500">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-bold text-slate-800">Academic Attribution</span>
              </div>
              <p className="font-bold text-slate-900 text-xs">G. Sivakama Sundari</p>
              <p className="text-[11px] text-slate-600">Associate Professor – Department of CSE</p>
              <p className="text-[11px] text-indigo-600 font-semibold">National Engineering College</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
