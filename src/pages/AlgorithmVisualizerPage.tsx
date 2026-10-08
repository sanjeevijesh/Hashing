import React, { useState, useEffect, useRef } from 'react';
import type { AlgorithmType, HashSlot, StepExecution, HistoryItem } from '../types/hashing';
import { 
  createInitialTable, 
  generateInsertSteps, 
  generateSearchSteps, 
  generateDeleteSteps, 
  computeStats 
} from '../algorithms/hashingEngine';
import { TECHNIQUES_THEORY } from '../data/theoryContent';
import { HashTableVisualizer } from '../components/HashTableVisualizer';
import { ControlsBar } from '../components/ControlsBar';
import { StepExplanationCard } from '../components/StepExplanationCard';
import { PseudocodePanel } from '../components/PseudocodePanel';
import { StatisticsPanel } from '../components/StatisticsPanel';
import { OperationHistory } from '../components/OperationHistory';
import { CodeModal } from '../components/CodeModal';
import { LectureModeModal } from '../components/LectureModeModal';
import { 
  Code, 
  Presentation, 
  Layers, 
  GitCommit, 
  Network, 
  Repeat, 
  AlertCircle,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';

interface AlgorithmVisualizerPageProps {
  algorithm: AlgorithmType;
  isLectureMode: boolean;
  setIsLectureMode: (val: boolean) => void;
}

export const AlgorithmVisualizerPage: React.FC<AlgorithmVisualizerPageProps> = ({
  algorithm,
  isLectureMode,
  setIsLectureMode
}) => {
  const [tableSize, setTableSize] = useState<number>(10);
  const [table, setTable] = useState<HashSlot[]>([]);
  const [inputKey, setInputKey] = useState<string>('42');

  // Step-by-step playback state
  const [steps, setSteps] = useState<StepExecution[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentOperation, setCurrentOperation] = useState<'insert' | 'search' | 'delete'>('insert');

  // Audit history & metrics
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [totalCollisions, setTotalCollisions] = useState<number>(0);
  const [successfulSearches, setSuccessfulSearches] = useState<number>(0);
  const [failedSearches, setFailedSearches] = useState<number>(0);
  const [totalProbes, setTotalProbes] = useState<number>(0);
  const [totalOps, setTotalOps] = useState<number>(0);

  // Modals
  const [codeModalOpen, setCodeModalOpen] = useState<boolean>(false);

  // Playback timer ref
  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const theory = TECHNIQUES_THEORY[algorithm];

  // Initialize or reset table on algorithm or size change
  useEffect(() => {
    handleReset();
  }, [algorithm, tableSize]);

  // Handle auto-playback step progression
  useEffect(() => {
    if (isPlaying) {
      const delay = Math.max(250, 1000 / playbackSpeed);
      playTimerRef.current = setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          goToStep(currentStepIndex + 1);
        } else {
          setIsPlaying(false);
        }
      }, delay);
    } else if (playTimerRef.current) {
      clearTimeout(playTimerRef.current);
    }

    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, [isPlaying, currentStepIndex, steps, playbackSpeed]);

  const goToStep = (stepIdx: number) => {
    if (stepIdx >= 0 && stepIdx < steps.length) {
      setCurrentStepIndex(stepIdx);
      const step = steps[stepIdx];
      setTable(step.tableSnapshot);
    }
  };

  const handlePrevStep = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  };

  const handleNextStep = () => {
    setIsPlaying(false);
    if (currentStepIndex < steps.length - 1) {
      goToStep(currentStepIndex + 1);
    }
  };

  const handleTogglePlay = () => {
    if (steps.length === 0) return;
    if (currentStepIndex >= steps.length - 1) {
      // Replay from start
      goToStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // 1. INSERT OPERATION
  const handleInsert = () => {
    const key = parseInt(inputKey);
    if (isNaN(key)) return;

    setIsPlaying(false);
    setCurrentOperation('insert');

    const result = generateInsertSteps(table, key, algorithm, tableSize);
    setSteps(result.steps);
    setCurrentStepIndex(0);
    setTable(result.steps[0].tableSnapshot);

    setTotalOps(prev => prev + 1);
    setTotalProbes(prev => prev + result.totalProbes);
    if (result.collisionOccurred) {
      setTotalCollisions(prev => prev + 1);
    }

    // Add to audit history
    const now = new Date().toLocaleTimeString();
    const historyItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: now,
      algorithm,
      operation: 'INSERT',
      key,
      status: result.success ? (result.collisionOccurred ? 'COLLISION' : 'SUCCESS') : 'FULL',
      probes: result.totalProbes,
      message: result.success
        ? `Inserted key ${key} (${result.totalProbes} probe${result.totalProbes > 1 ? 's' : ''}${result.collisionOccurred ? ', collision resolved' : ''})`
        : `Failed to insert key ${key}: table limit or duplicate detected`
    };
    setHistory(prev => [historyItem, ...prev]);

    // Auto play through steps
    setIsPlaying(true);
  };

  // 2. SEARCH OPERATION
  const handleSearch = () => {
    const key = parseInt(inputKey);
    if (isNaN(key)) return;

    setIsPlaying(false);
    setCurrentOperation('search');

    const result = generateSearchSteps(table, key, algorithm, tableSize);
    setSteps(result.steps);
    setCurrentStepIndex(0);
    setTable(result.steps[0].tableSnapshot);

    setTotalOps(prev => prev + 1);
    setTotalProbes(prev => prev + result.totalProbes);
    if (result.found) {
      setSuccessfulSearches(prev => prev + 1);
    } else {
      setFailedSearches(prev => prev + 1);
    }

    const now = new Date().toLocaleTimeString();
    const historyItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: now,
      algorithm,
      operation: 'SEARCH',
      key,
      status: result.found ? 'SUCCESS' : 'NOT_FOUND',
      probes: result.totalProbes,
      message: result.found
        ? `Found key ${key} at index ${result.index} (${result.totalProbes} probe${result.totalProbes > 1 ? 's' : ''})`
        : `Key ${key} not found after ${result.totalProbes} probes`
    };
    setHistory(prev => [historyItem, ...prev]);

    setIsPlaying(true);
  };

  // 3. DELETE OPERATION
  const handleDelete = () => {
    const key = parseInt(inputKey);
    if (isNaN(key)) return;

    setIsPlaying(false);
    setCurrentOperation('delete');

    const result = generateDeleteSteps(table, key, algorithm, tableSize);
    setSteps(result.steps);
    setCurrentStepIndex(0);
    setTable(result.steps[0].tableSnapshot);

    setTotalOps(prev => prev + 1);

    const now = new Date().toLocaleTimeString();
    const historyItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: now,
      algorithm,
      operation: 'DELETE',
      key,
      status: result.success ? 'SUCCESS' : 'NOT_FOUND',
      probes: 1,
      message: result.success
        ? algorithm === 'chaining'
          ? `Deleted key ${key} from chain and reconnected pointers`
          : `Deleted key ${key} and marked index with DELETED tombstone`
        : `Could not delete key ${key}: element absent from table`
    };
    setHistory(prev => [historyItem, ...prev]);

    setIsPlaying(true);
  };

  // 4. RESET OPERATION
  const handleReset = () => {
    setIsPlaying(false);
    const freshTable = createInitialTable(tableSize, algorithm);
    setTable(freshTable);
    setSteps([]);
    setCurrentStepIndex(-1);

    const now = new Date().toLocaleTimeString();
    const historyItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: now,
      algorithm,
      operation: 'RESET',
      status: 'RESET',
      probes: 0,
      message: `Table reset to empty state (size: ${tableSize})`
    };
    setHistory(prev => [historyItem, ...prev]);
  };

  // Inject demo presets
  const handleInjectPreset = (keys: number[]) => {
    setIsPlaying(false);
    let current = createInitialTable(tableSize, algorithm);
    let colCount = 0;
    let probeSum = 0;

    for (const k of keys) {
      const res = generateInsertSteps(current, k, algorithm, tableSize);
      if (res.success) {
        current = res.newTable;
      }
      if (res.collisionOccurred) colCount++;
      probeSum += res.totalProbes;
    }

    setTable(current);
    setSteps([]);
    setCurrentStepIndex(-1);
    setTotalCollisions(prev => prev + colCount);
    setTotalProbes(prev => prev + probeSum);
    setTotalOps(prev => prev + keys.length);

    const now = new Date().toLocaleTimeString();
    const historyItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: now,
      algorithm,
      operation: 'BATCH',
      keys,
      status: 'SUCCESS',
      probes: probeSum,
      message: `Batch inserted keys [${keys.join(', ')}] with ${colCount} collisions`
    };
    setHistory(prev => [historyItem, ...prev]);
  };

  const currentStep = steps[currentStepIndex] || null;
  const stats = computeStats(
    table,
    algorithm,
    totalCollisions,
    successfulSearches,
    failedSearches,
    totalProbes,
    totalOps
  );

  const getAlgoIcon = () => {
    switch (algorithm) {
      case 'linear': return <Layers className="w-6 h-6 text-indigo-400" />;
      case 'quadratic': return <GitCommit className="w-6 h-6 text-emerald-400" />;
      case 'chaining': return <Network className="w-6 h-6 text-amber-400" />;
      case 'double': return <Repeat className="w-6 h-6 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-start sm:items-center gap-3 sm:gap-3.5">
            <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 flex-shrink-0">
              {getAlgoIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {theory.category}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {theory.clusteringType}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                {theory.name} Visualizer
              </h1>
            </div>
          </div>

          {/* Action buttons: Code & Lecture Mode */}
          <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto w-full md:w-auto">
            <button
              onClick={() => setCodeModalOpen(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Code className="w-4 h-4 text-indigo-600" />
              <span>C / C++ / Java / Python</span>
            </button>

            <button
              onClick={() => setIsLectureMode(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Presentation className="w-4 h-4" />
              <span>Lecture Mode</span>
            </button>
          </div>
        </div>

        {/* Formula & Concept bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 items-center">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs overflow-x-auto">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Mathematical Formula</span>
            <span className="text-indigo-700 font-bold">{theory.formula}</span>
            {theory.secondaryFormula && (
              <span className="text-slate-600 block mt-0.5 text-[11px]">{theory.secondaryFormula}</span>
            )}
          </div>

          <div className="md:col-span-2 text-xs text-slate-600 leading-relaxed">
            {theory.coreConcept}
          </div>
        </div>
      </div>

      {/* 2. Primary Clustering / Secondary Clustering Pedagogical Banner */}
      {algorithm === 'linear' && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 font-bold text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Classroom Demonstration: Primary Clustering Phenomenon</span>
          </div>
          <p className="leading-relaxed text-slate-700">
            Linear Probing creates continuous blocks of occupied slots like <code className="text-amber-900 font-mono font-bold bg-amber-100/80 px-1 py-0.5 rounded break-all sm:break-normal">[22][32][42][52][62]</code>. When keys hash into or near this block, the search path snowballs, drastically slowing down later insertions. Try clicking the <strong className="text-slate-900">"Primary Cluster"</strong> preset below to demonstrate this live to students!
          </p>
        </div>
      )}

      {algorithm === 'quadratic' && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 font-bold text-emerald-800">
            <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Why Quadratic Offsets (1², 2², 3²...) Reduce Clustering</span>
          </div>
          <p className="leading-relaxed text-slate-700">
            Unlike Linear Probing which checks adjacent slots, Quadratic Probing leaps across the array. While this eliminates Primary Clustering, keys hashing to the exact same initial index still follow the same jump sequence (<strong className="text-emerald-800">Secondary Clustering</strong>). Choosing a prime table size guarantees finding an open slot when α &lt; 0.5.
          </p>
        </div>
      )}

      {algorithm === 'chaining' && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 font-bold text-indigo-800">
            <Info className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span>Closed Addressing &amp; Pointer Mechanics</span>
          </div>
          <p className="leading-relaxed text-slate-700">
            Separate Chaining handles collisions without consuming slots designated for other buckets. Notice that <strong className="text-indigo-800">deletion does NOT require tombstones</strong>; simply unlinking the node and reconnecting pointers restores the list. Load factor α can even exceed 1.0 safely!
          </p>
        </div>
      )}

      {algorithm === 'double' && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 font-bold text-purple-800">
            <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
            <span>Eliminating Both Primary &amp; Secondary Clustering</span>
          </div>
          <p className="leading-relaxed text-slate-700">
            Double Hashing uses a second hash function <code className="text-purple-900 font-mono font-bold bg-purple-100/80 px-1 py-0.5 rounded break-all sm:break-normal">h₂(k) = 1 + (k % (m - 1))</code> to calculate a custom step size for each key. Even if two keys produce the same initial index h₁(k), their step sizes h₂(k) differ, breaking identical probe sequences.
          </p>
        </div>
      )}

      {/* 3. Controls Bar */}
      <ControlsBar
        inputKey={inputKey}
        setInputKey={setInputKey}
        onInsert={handleInsert}
        onSearch={handleSearch}
        onDelete={handleDelete}
        onReset={handleReset}
        tableSize={tableSize}
        setTableSize={setTableSize}
        algorithm={algorithm}
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onPrevStep={handlePrevStep}
        onNextStep={handleNextStep}
        playbackSpeed={playbackSpeed}
        setPlaybackSpeed={setPlaybackSpeed}
        onInjectPreset={handleInjectPreset}
      />

      {/* 4. Live Step Explanation Card */}
      <StepExplanationCard
        currentStep={currentStep}
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
      />

      {/* 5. Central Hash Table Visualizer */}
      <HashTableVisualizer
        table={table}
        algorithm={algorithm}
        highlightIndex={currentStep?.highlightIndex}
      />

      {/* 6. Lower Workspace: Pseudocode, Statistics, and History */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Pseudocode Panel with active line highlighting */}
        <div className="md:col-span-1 lg:col-span-1">
          <PseudocodePanel
            algorithm={algorithm}
            currentOperation={currentOperation}
            activeLine={currentStep?.activeLine}
          />
        </div>

        {/* Real-time Statistics */}
        <div className="md:col-span-1 lg:col-span-1">
          <StatisticsPanel
            stats={stats}
            algorithm={algorithm}
          />
        </div>

        {/* Operation Audit History */}
        <div className="md:col-span-2 lg:col-span-1">
          <OperationHistory
            history={history}
            onClearHistory={() => setHistory([])}
          />
        </div>
      </div>

      {/* Code Modal */}
      <CodeModal
        algorithm={algorithm}
        isOpen={codeModalOpen}
        onClose={() => setCodeModalOpen(false)}
      />

      {/* Lecture Mode Modal */}
      <LectureModeModal
        isOpen={isLectureMode}
        onClose={() => setIsLectureMode(false)}
        algorithm={algorithm}
        table={table}
        currentStep={currentStep}
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onPrevStep={handlePrevStep}
        onNextStep={handleNextStep}
        onReset={handleReset}
      />

    </div>
  );
};
