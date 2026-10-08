export type AlgorithmType = 'linear' | 'quadratic' | 'chaining' | 'double';

export type SlotState = 
  | 'idle'
  | 'probing'
  | 'collision'
  | 'inserted'
  | 'found'
  | 'not-found'
  | 'deleting'
  | 'deleted';

export interface HashSlot {
  index: number;
  value: number | null;
  isDeleted: boolean; // Tombstone for open addressing
  state: SlotState;
  probeNumber?: number;
  chain?: number[]; // For separate chaining: list of values in this bucket
}

export interface StepExecution {
  stepIndex: number;
  totalSteps: number;
  title: string;
  description: string;
  formula: string;
  activeLine: number; // For pseudocode highlighting
  highlightIndex: number;
  probeIndex?: number;
  isCollision?: boolean;
  isSuccess?: boolean;
  isFailure?: boolean;
  tableSnapshot: HashSlot[];
  historyNote?: string;
}

export interface HashStats {
  tableSize: number;
  elementCount: number;
  loadFactor: number;
  collisions: number;
  successfulSearches: number;
  failedSearches: number;
  totalProbes: number;
  averageProbes: number;
  maxChainLength: number;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  algorithm: AlgorithmType;
  operation: 'INSERT' | 'SEARCH' | 'DELETE' | 'RESET' | 'BATCH';
  key?: number;
  keys?: number[];
  status: 'SUCCESS' | 'COLLISION' | 'NOT_FOUND' | 'FULL' | 'RESET';
  probes: number;
  message: string;
}
