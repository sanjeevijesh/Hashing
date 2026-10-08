import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import type { ActiveTab } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { HashingIntroPage } from './pages/HashingIntroPage';
import { AlgorithmVisualizerPage } from './pages/AlgorithmVisualizerPage';
import { UniversalLab } from './components/UniversalLab';
import { ComparePage } from './pages/ComparePage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { Footer } from './components/Footer';
import { Watermark } from './components/Watermark';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isLectureMode, setIsLectureMode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Fullscreen state listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Scroll to top upon tab navigation
  const handleTabChange = (newTab: ActiveTab) => {
    setActiveTab(newTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-900">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isLectureMode={isLectureMode}
        setIsLectureMode={setIsLectureMode}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-8 relative z-10">
        {activeTab === 'home' && (
          <HomePage setActiveTab={handleTabChange} />
        )}

        {activeTab === 'hashing-intro' && (
          <HashingIntroPage setActiveTab={handleTabChange} />
        )}

        {activeTab === 'linear' && (
          <AlgorithmVisualizerPage
            algorithm="linear"
            isLectureMode={isLectureMode}
            setIsLectureMode={setIsLectureMode}
          />
        )}

        {activeTab === 'quadratic' && (
          <AlgorithmVisualizerPage
            algorithm="quadratic"
            isLectureMode={isLectureMode}
            setIsLectureMode={setIsLectureMode}
          />
        )}

        {activeTab === 'chaining' && (
          <AlgorithmVisualizerPage
            algorithm="chaining"
            isLectureMode={isLectureMode}
            setIsLectureMode={setIsLectureMode}
          />
        )}

        {activeTab === 'double' && (
          <AlgorithmVisualizerPage
            algorithm="double"
            isLectureMode={isLectureMode}
            setIsLectureMode={setIsLectureMode}
          />
        )}

        {activeTab === 'universal-lab' && (
          <div className="space-y-8">
            <UniversalLab />
          </div>
        )}

        {activeTab === 'compare' && (
          <ComparePage />
        )}

        {activeTab === 'applications' && (
          <ApplicationsPage />
        )}
      </main>

      {/* Academic Attribution Footer */}
      <Footer setActiveTab={handleTabChange} />

      {/* Official Academic Watermark */}
      <Watermark />
    </div>
  );
};

export default App;
