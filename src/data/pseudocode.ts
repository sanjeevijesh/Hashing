import type { AlgorithmType } from '../types/hashing';

export interface CodeLine {
  lineNum: number;
  code: string;
  explanation: string;
}

export const PSEUDOCODE_MAP: Record<AlgorithmType, {
  insert: CodeLine[];
  search: CodeLine[];
  delete: CodeLine[];
}> = {
  linear: {
    insert: [
      { lineNum: 1, code: 'index = hash(key) % tableSize;', explanation: 'Compute initial slot using primary hash h(k) = k % m' },
      { lineNum: 2, code: 'i = 0;', explanation: 'Initialize probe count' },
      { lineNum: 3, code: 'if (table[index] == key) return DUPLICATE;', explanation: 'Reject duplicate insertions' },
      { lineNum: 4, code: 'while (table[probeIndex] is OCCUPIED) { i++; probeIndex = (index + i) % m; }', explanation: 'Sequential probing: advance by 1 slot upon collision' },
      { lineNum: 5, code: 'if (table[probeIndex] is EMPTY or DELETED)', explanation: 'Found open slot or reusable tombstone' },
      { lineNum: 6, code: '  table[probeIndex] = key; return SUCCESS;', explanation: 'Insert key into discovered slot' },
      { lineNum: 7, code: 'return TABLE_FULL;', explanation: 'No available slot after m probes' }
    ],
    search: [
      { lineNum: 1, code: 'index = hash(key) % tableSize; i = 0;', explanation: 'Compute initial base slot' },
      { lineNum: 2, code: 'while (i < tableSize) {', explanation: 'Probe up to table size limit' },
      { lineNum: 3, code: '  if (table[probeIndex] is EMPTY) return NOT_FOUND;', explanation: 'Empty slot terminates search (key never existed)' },
      { lineNum: 4, code: '  if (table[probeIndex] is DELETED) { i++; continue; }', explanation: 'Tombstone encountered: MUST continue probing!' },
      { lineNum: 5, code: '  if (table[probeIndex] == key) return FOUND at probeIndex;', explanation: 'Target key located' },
      { lineNum: 6, code: '  i++; probeIndex = (index + i) % m;', explanation: 'Step to next sequential slot' },
      { lineNum: 7, code: '}', explanation: 'All slots examined' }
    ],
    delete: [
      { lineNum: 1, code: 'index = hash(key) % tableSize; i = 0;', explanation: 'Compute hash to start search for key' },
      { lineNum: 2, code: 'while (table[probeIndex] is NOT EMPTY and i < m) {', explanation: 'Traverse probe chain' },
      { lineNum: 3, code: '  if (table[probeIndex] == key) {', explanation: 'Key located' },
      { lineNum: 4, code: '    table[probeIndex] = DELETED; // Tombstone', explanation: 'Set tombstone so future searches don\'t break' },
      { lineNum: 5, code: '    return SUCCESS; } i++;', explanation: 'Deletion complete' }
    ]
  },
  quadratic: {
    insert: [
      { lineNum: 1, code: 'index = hash(key) % tableSize;', explanation: 'Compute initial base slot' },
      { lineNum: 2, code: 'i = 0;', explanation: 'Initialize quadratic probe count' },
      { lineNum: 3, code: 'if (table[index] == key) return DUPLICATE;', explanation: 'Reject duplicate keys' },
      { lineNum: 4, code: 'while (table[probeIndex] is OCCUPIED) { i++; probeIndex = (index + i * i) % m; }', explanation: 'Quadratic offset: jump by i² (1, 4, 9, 16...)' },
      { lineNum: 5, code: 'if (table[probeIndex] is EMPTY or DELETED)', explanation: 'Found open slot or tombstone' },
      { lineNum: 6, code: '  table[probeIndex] = key; return SUCCESS;', explanation: 'Place element in slot' },
      { lineNum: 7, code: 'return TABLE_FULL_OR_CYCLE;', explanation: 'Limit exceeded or cycle detected' }
    ],
    search: [
      { lineNum: 1, code: 'index = hash(key) % tableSize; i = 0;', explanation: 'Compute initial base slot' },
      { lineNum: 2, code: 'while (i < tableSize) { probeIndex = (index + i * i) % m;', explanation: 'Quadratic probe loop' },
      { lineNum: 3, code: '  if (table[probeIndex] is EMPTY) return NOT_FOUND;', explanation: 'Unoccupied slot means key was never placed' },
      { lineNum: 4, code: '  if (table[probeIndex] is DELETED) { i++; continue; }', explanation: 'Skip tombstone and continue quadratic jumps' },
      { lineNum: 5, code: '  if (table[probeIndex] == key) return FOUND;', explanation: 'Key matched!' },
      { lineNum: 6, code: '  i++;', explanation: 'Advance probe exponent' },
      { lineNum: 7, code: '}', explanation: 'Search space exhausted' }
    ],
    delete: [
      { lineNum: 1, code: 'index = hash(key) % tableSize;', explanation: 'Compute starting slot' },
      { lineNum: 2, code: 'while (table[probeIndex] is NOT EMPTY and i < m) {', explanation: 'Probe quadratically' },
      { lineNum: 3, code: '  if (table[probeIndex] == key) {', explanation: 'Matching key found' },
      { lineNum: 4, code: '    table[probeIndex] = DELETED; // Tombstone', explanation: 'Convert to tombstone' },
      { lineNum: 5, code: '    return SUCCESS; } i++;', explanation: 'Finish removal' }
    ]
  },
  chaining: {
    insert: [
      { lineNum: 1, code: 'bucket = hash(key) % tableSize;', explanation: 'Map key to target bucket index' },
      { lineNum: 2, code: 'head = table[bucket];', explanation: 'Access linked list head for bucket' },
      { lineNum: 3, code: 'if (findNode(head, key) != NULL) return DUPLICATE;', explanation: 'Check for existing duplicate in list' },
      { lineNum: 4, code: 'if (head != NULL) // Collision occurred!;', explanation: 'Detect existing nodes in bucket' },
      { lineNum: 5, code: 'newNode = createNode(key); append(head, newNode);', explanation: 'Link new node [VALUE | NEXT] to chain' }
    ],
    search: [
      { lineNum: 1, code: 'bucket = hash(key) % tableSize;', explanation: 'Direct access to bucket linked list' },
      { lineNum: 2, code: 'curr = table[bucket];', explanation: 'Begin at chain head' },
      { lineNum: 3, code: 'while (curr != NULL) { if (curr.value == key) return FOUND; }', explanation: 'Traverse list node by node' },
      { lineNum: 4, code: 'curr = curr.next;', explanation: 'Follow next pointer' },
      { lineNum: 5, code: 'return NOT_FOUND; // Reached NULL', explanation: 'End of linked list reached' }
    ],
    delete: [
      { lineNum: 1, code: 'bucket = hash(key) % tableSize;', explanation: 'Identify bucket index' },
      { lineNum: 2, code: 'curr = table[bucket]; prev = NULL;', explanation: 'Initialize traversal pointers' },
      { lineNum: 3, code: 'while (curr && curr.value != key) { prev = curr; curr = curr.next; }', explanation: 'Search node to delete' },
      { lineNum: 4, code: 'if (curr) { prev.next = curr.next; free(curr); return SUCCESS; }', explanation: 'Unlink node and reconnect pointers' },
      { lineNum: 5, code: 'return NOT_FOUND;', explanation: 'Node absent from bucket' }
    ]
  },
  double: {
    insert: [
      { lineNum: 1, code: 'h1 = key % tableSize;', explanation: 'Compute primary hash index' },
      { lineNum: 2, code: 'h2 = 1 + (key % (tableSize - 1)); // Step size', explanation: 'Compute non-zero secondary hash offset' },
      { lineNum: 3, code: 'if (table[h1] == key) return DUPLICATE;', explanation: 'Verify key not already stored' },
      { lineNum: 4, code: 'while (table[pIndex] is OCCUPIED) { i++; pIndex = (h1 + i * h2) % m; }', explanation: 'Jump by variable step size h2(key)' },
      { lineNum: 5, code: 'if (table[pIndex] is EMPTY or DELETED)', explanation: 'Found open slot or tombstone' },
      { lineNum: 6, code: '  table[pIndex] = key; return SUCCESS;', explanation: 'Insert key into slot' },
      { lineNum: 7, code: 'return TABLE_FULL;', explanation: 'Probe limit reached' }
    ],
    search: [
      { lineNum: 1, code: 'h1 = key % tableSize; h2 = 1 + (key % (tableSize - 1));', explanation: 'Calculate both primary and secondary hashes' },
      { lineNum: 2, code: 'while (i < tableSize) { pIndex = (h1 + i * h2) % m;', explanation: 'Step through double hash probe sequence' },
      { lineNum: 3, code: '  if (table[pIndex] is EMPTY) return NOT_FOUND;', explanation: 'Empty slot terminates search' },
      { lineNum: 4, code: '  if (table[pIndex] is DELETED) { i++; continue; }', explanation: 'Tombstone: keep probing' },
      { lineNum: 5, code: '  if (table[pIndex] == key) return FOUND;', explanation: 'Matching key found' },
      { lineNum: 6, code: '  i++;', explanation: 'Add step h2' },
      { lineNum: 7, code: '}', explanation: 'Full cycle checked' }
    ],
    delete: [
      { lineNum: 1, code: 'h1 = key % tableSize; h2 = 1 + (key % (tableSize - 1));', explanation: 'Calculate hash functions' },
      { lineNum: 2, code: 'while (table[pIndex] is NOT EMPTY and i < m) {', explanation: 'Traverse double hash sequence' },
      { lineNum: 3, code: '  if (table[pIndex] == key) {', explanation: 'Target key located' },
      { lineNum: 4, code: '    table[pIndex] = DELETED; // Tombstone', explanation: 'Mark slot with tombstone' },
      { lineNum: 5, code: '    return SUCCESS; } i++;', explanation: 'Complete deletion' }
    ]
  }
};
