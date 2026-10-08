import type { AlgorithmType, HashSlot, StepExecution, HashStats, SlotState } from '../types/hashing';

export function createInitialTable(size: number, algorithm: AlgorithmType): HashSlot[] {
  return Array.from({ length: size }, (_, i) => ({
    index: i,
    value: null,
    isDeleted: false,
    state: 'idle',
    chain: algorithm === 'chaining' ? [] : undefined
  }));
}

export function calculateHash(key: number, tableSize: number): number {
  return ((key % tableSize) + tableSize) % tableSize;
}

export function calculateSecondaryHash(key: number, tableSize: number): number {
  // m2 = tableSize - 1 (or 7 if tableSize is large/small)
  const m2 = Math.max(1, tableSize - 1);
  return 1 + (((key % m2) + m2) % m2);
}

export function calculateProbeIndex(
  algorithm: AlgorithmType,
  key: number,
  probeIndex: number,
  tableSize: number
): { index: number; formulaStr: string } {
  const h1 = calculateHash(key, tableSize);

  if (algorithm === 'linear') {
    const raw = (h1 + probeIndex) % tableSize;
    return {
      index: raw,
      formulaStr: `h(${key}, ${probeIndex}) = (${h1} + ${probeIndex}) % ${tableSize} = ${raw}`
    };
  }

  if (algorithm === 'quadratic') {
    const raw = (h1 + probeIndex * probeIndex) % tableSize;
    return {
      index: raw,
      formulaStr: `h(${key}, ${probeIndex}) = (${h1} + ${probeIndex}²) % ${tableSize} = (${h1} + ${probeIndex * probeIndex}) % ${tableSize} = ${raw}`
    };
  }

  if (algorithm === 'double') {
    const h2 = calculateSecondaryHash(key, tableSize);
    const raw = (h1 + probeIndex * h2) % tableSize;
    return {
      index: raw,
      formulaStr: `h(${key}, ${probeIndex}) = (${h1} + ${probeIndex} × ${h2}) % ${tableSize} = ${raw}`
    };
  }

  // Separate Chaining doesn't probe multiple slots
  return {
    index: h1,
    formulaStr: `h(${key}) = ${key} % ${tableSize} = ${h1}`
  };
}

// Generate execution steps for INSERT
export function generateInsertSteps(
  currentTable: HashSlot[],
  key: number,
  algorithm: AlgorithmType,
  tableSize: number
): { steps: StepExecution[]; newTable: HashSlot[]; collisionOccurred: boolean; totalProbes: number; success: boolean } {
  const steps: StepExecution[] = [];
  const table = currentTable.map(slot => ({
    ...slot,
    state: 'idle' as SlotState,
    chain: slot.chain ? [...slot.chain] : undefined
  }));

  const h1 = calculateHash(key, tableSize);

  // Step 1: Initial hash calculation
  steps.push({
    stepIndex: 1,
    totalSteps: 0,
    title: 'Calculate Primary Hash',
    description: `Compute the base hash index using h(k) = k % tableSize.`,
    formula: `h(${key}) = ${key} % ${tableSize} = ${h1}`,
    activeLine: 1,
    highlightIndex: h1,
    tableSnapshot: JSON.parse(JSON.stringify(table)),
    historyNote: `h(${key}) = ${h1}`
  });

  // SEPARATE CHAINING SPECIFIC LOGIC
  if (algorithm === 'chaining') {
    const bucket = table[h1];
    const existingChain = bucket.chain || [];

    // Step 2: Check target bucket
    steps.push({
      stepIndex: 2,
      totalSteps: 0,
      title: `Check Bucket ${h1}`,
      description: `Locate bucket at index ${h1}. Current chain length: ${existingChain.length}.`,
      formula: `Bucket[${h1}] contains ${existingChain.length === 0 ? 'NULL (empty)' : existingChain.join(' → ')}`,
      activeLine: 2,
      highlightIndex: h1,
      tableSnapshot: JSON.parse(JSON.stringify(table))
    });

    // Check duplicate
    if (existingChain.includes(key)) {
      table[h1].state = 'collision';
      steps.push({
        stepIndex: 3,
        totalSteps: 0,
        title: 'Duplicate Key Detected',
        description: `Key ${key} is already present in bucket ${h1}. Duplicates are not allowed.`,
        formula: `Search in bucket: Key ${key} found!`,
        activeLine: 3,
        highlightIndex: h1,
        isFailure: true,
        tableSnapshot: JSON.parse(JSON.stringify(table)),
        historyNote: `Key ${key} already exists in bucket ${h1}`
      });
      fixTotalSteps(steps);
      return { steps, newTable: currentTable, collisionOccurred: false, totalProbes: 1, success: false };
    }

    const collision = existingChain.length > 0;
    if (collision) {
      table[h1].state = 'collision';
      steps.push({
        stepIndex: 3,
        totalSteps: 0,
        title: 'Collision Detected in Bucket',
        description: `Bucket ${h1} already contains [${existingChain.join(', ')}]. A new node will be linked to the chain.`,
        formula: `Collision at index ${h1}! Chaining appends key ${key} to the linked list.`,
        activeLine: 4,
        highlightIndex: h1,
        isCollision: true,
        tableSnapshot: JSON.parse(JSON.stringify(table))
      });
    }

    // Attach node
    table[h1].chain = [...existingChain, key];
    table[h1].value = table[h1].chain[0]; // representative for display
    table[h1].state = 'inserted';

    steps.push({
      stepIndex: collision ? 4 : 3,
      totalSteps: 0,
      title: 'Node Attached to Chain',
      description: `New node [${key} | NEXT] successfully attached to bucket ${h1}'s chain.`,
      formula: `Bucket[${h1}] → ${table[h1].chain.join(' → ')} → NULL`,
      activeLine: 5,
      highlightIndex: h1,
      isSuccess: true,
      tableSnapshot: JSON.parse(JSON.stringify(table)),
      historyNote: `Inserted ${key} into bucket ${h1} (chain size: ${table[h1].chain.length})`
    });

    fixTotalSteps(steps);
    return { steps, newTable: table, collisionOccurred: collision, totalProbes: existingChain.length + 1, success: true };
  }

  // OPEN ADDRESSING (Linear, Quadratic, Double Hashing)
  let collisionOccurred = false;
  let probeCount = 0;
  let insertedSlot = -1;
  const maxProbes = tableSize; // prevent infinite loops
  const visitedIndices = new Set<number>();

  let h2 = 0;
  if (algorithm === 'double') {
    h2 = calculateSecondaryHash(key, tableSize);
    steps.push({
      stepIndex: 2,
      totalSteps: 0,
      title: 'Calculate Secondary Hash (Step Size)',
      description: `For double hashing, h2(k) determines the jump offset. h2(k) = 1 + (k % (m-1)).`,
      formula: `h2(${key}) = 1 + (${key} % ${tableSize - 1}) = ${h2}`,
      activeLine: 2,
      highlightIndex: h1,
      tableSnapshot: JSON.parse(JSON.stringify(table))
    });
  }

  // First verify duplicate doesn't exist in table
  for (let i = 0; i < maxProbes; i++) {
    const { index: pIndex } = calculateProbeIndex(algorithm, key, i, tableSize);
    const slot = table[pIndex];
    if (slot.value === key && !slot.isDeleted) {
      table[pIndex].state = 'collision';
      steps.push({
        stepIndex: steps.length + 1,
        totalSteps: 0,
        title: 'Duplicate Key Error',
        description: `Key ${key} is already stored at index ${pIndex}. Duplicate keys are rejected.`,
        formula: `Slot[${pIndex}] == ${key}`,
        activeLine: 3,
        highlightIndex: pIndex,
        isFailure: true,
        tableSnapshot: JSON.parse(JSON.stringify(table)),
        historyNote: `Insert rejected: ${key} already exists at index ${pIndex}`
      });
      fixTotalSteps(steps);
      return { steps, newTable: currentTable, collisionOccurred: false, totalProbes: i + 1, success: false };
    }
    if (slot.value === null && !slot.isDeleted) {
      // Empty slot reached without finding duplicate, safe to proceed
      break;
    }
  }

  // Probing sequence for insertion
  for (let i = 0; i < maxProbes; i++) {
    probeCount++;
    const { index: targetIndex, formulaStr } = calculateProbeIndex(algorithm, key, i, tableSize);
    visitedIndices.add(targetIndex);

    const slot = table[targetIndex];
    const isOccupied = slot.value !== null && !slot.isDeleted;

    // Snapshot with current probing highlight
    table.forEach((s, idx) => {
      if (idx === targetIndex) {
        s.state = isOccupied ? 'collision' : 'probing';
        s.probeNumber = i;
      } else if (s.state === 'probing' || s.state === 'collision') {
        s.state = 'idle';
      }
    });

    if (isOccupied) {
      collisionOccurred = true;
      steps.push({
        stepIndex: steps.length + 1,
        totalSteps: 0,
        title: `Probe ${i}: Collision at Index ${targetIndex}`,
        description: `Slot ${targetIndex} is already occupied by key ${slot.value}. Must probe next location using formula.`,
        formula: formulaStr,
        activeLine: 4,
        highlightIndex: targetIndex,
        probeIndex: i,
        isCollision: true,
        tableSnapshot: JSON.parse(JSON.stringify(table)),
        historyNote: `Probe ${i} → Index ${targetIndex} (COLLISION with ${slot.value})`
      });
    } else {
      // Empty slot or Tombstone found!
      insertedSlot = targetIndex;
      const wasTombstone = slot.isDeleted;

      steps.push({
        stepIndex: steps.length + 1,
        totalSteps: 0,
        title: `Probe ${i}: Slot ${targetIndex} Available!`,
        description: wasTombstone
          ? `Slot ${targetIndex} holds a DELETED tombstone. It can be safely reused for key ${key}.`
          : `Slot ${targetIndex} is empty. Key ${key} will be placed here.`,
        formula: formulaStr,
        activeLine: 5,
        highlightIndex: targetIndex,
        probeIndex: i,
        tableSnapshot: JSON.parse(JSON.stringify(table))
      });

      // Insert
      table[targetIndex].value = key;
      table[targetIndex].isDeleted = false;
      table[targetIndex].state = 'inserted';
      table[targetIndex].probeNumber = i;

      steps.push({
        stepIndex: steps.length + 1,
        totalSteps: 0,
        title: `Key ${key} Inserted at Index ${targetIndex}`,
        description: `Successfully placed key ${key} into index ${targetIndex} after ${probeCount} probe${probeCount > 1 ? 's' : ''}.`,
        formula: `Slot[${targetIndex}] = ${key}`,
        activeLine: 6,
        highlightIndex: targetIndex,
        probeIndex: i,
        isSuccess: true,
        tableSnapshot: JSON.parse(JSON.stringify(table)),
        historyNote: `Inserted ${key} at index ${targetIndex} (${probeCount} probe${probeCount > 1 ? 's' : ''})`
      });

      break;
    }
  }

  if (insertedSlot === -1) {
    // Table full or infinite loop in quadratic/double probing
    steps.push({
      stepIndex: steps.length + 1,
      totalSteps: 0,
      title: 'Table Full or Probe Limit Exceeded',
      description: `Could not find an empty slot for key ${key} within ${maxProbes} probes. Either table is full or probing cycle occurred.`,
      formula: `Checked ${visitedIndices.size} distinct slots without finding an open position.`,
      activeLine: 7,
      highlightIndex: h1,
      isFailure: true,
      tableSnapshot: JSON.parse(JSON.stringify(table)),
      historyNote: `Insert failed: Table full or probe cycle detected for key ${key}`
    });
    fixTotalSteps(steps);
    return { steps, newTable: currentTable, collisionOccurred: true, totalProbes: probeCount, success: false };
  }

  fixTotalSteps(steps);
  return { steps, newTable: table, collisionOccurred, totalProbes: probeCount, success: true };
}

// Generate execution steps for SEARCH
export function generateSearchSteps(
  currentTable: HashSlot[],
  key: number,
  algorithm: AlgorithmType,
  tableSize: number
): { steps: StepExecution[]; found: boolean; index: number; totalProbes: number } {
  const steps: StepExecution[] = [];
  const table = currentTable.map(slot => ({
    ...slot,
    state: 'idle' as SlotState,
    chain: slot.chain ? [...slot.chain] : undefined
  }));

  const h1 = calculateHash(key, tableSize);

  steps.push({
    stepIndex: 1,
    totalSteps: 0,
    title: 'Calculate Search Hash',
    description: `Compute the starting hash index for key ${key} using h(k) = k % tableSize.`,
    formula: `h(${key}) = ${key} % ${tableSize} = ${h1}`,
    activeLine: 1,
    highlightIndex: h1,
    tableSnapshot: JSON.parse(JSON.stringify(table)),
    historyNote: `Search: h(${key}) = ${h1}`
  });

  if (algorithm === 'chaining') {
    const bucket = table[h1];
    const chain = bucket.chain || [];

    steps.push({
      stepIndex: 2,
      totalSteps: 0,
      title: `Inspect Bucket ${h1}`,
      description: `Checking bucket ${h1}. Chain elements: [${chain.length > 0 ? chain.join(', ') : 'Empty'}].`,
      formula: `Traversing linked chain at index ${h1}`,
      activeLine: 2,
      highlightIndex: h1,
      tableSnapshot: JSON.parse(JSON.stringify(table))
    });

    let nodeFound = false;
    for (let i = 0; i < chain.length; i++) {
      const val = chain[i];
      if (val === key) {
        nodeFound = true;
        table[h1].state = 'found';
        steps.push({
          stepIndex: steps.length + 1,
          totalSteps: 0,
          title: `Key ${key} Found in Bucket ${h1}!`,
          description: `Located key ${key} at position ${i + 1} of bucket ${h1}'s linked chain.`,
          formula: `Chain[${i}] == ${key} ✓`,
          activeLine: 3,
          highlightIndex: h1,
          isSuccess: true,
          tableSnapshot: JSON.parse(JSON.stringify(table)),
          historyNote: `Search Success: ${key} found in bucket ${h1} at node ${i + 1}`
        });
        break;
      } else {
        steps.push({
          stepIndex: steps.length + 1,
          totalSteps: 0,
          title: `Checking Node: ${val}`,
          description: `Node value ${val} does not match target ${key}. Moving to next pointer.`,
          formula: `${val} ≠ ${key} → Next`,
          activeLine: 4,
          highlightIndex: h1,
          tableSnapshot: JSON.parse(JSON.stringify(table))
        });
      }
    }

    if (!nodeFound) {
      table[h1].state = 'not-found';
      steps.push({
        stepIndex: steps.length + 1,
        totalSteps: 0,
        title: `Key ${key} Not Found`,
        description: `Reached the end of bucket ${h1}'s chain (NULL) without finding ${key}.`,
        formula: `End of chain reached (NULL). Search terminates.`,
        activeLine: 5,
        highlightIndex: h1,
        isFailure: true,
        tableSnapshot: JSON.parse(JSON.stringify(table)),
        historyNote: `Search Failed: ${key} not found in bucket ${h1}`
      });
      fixTotalSteps(steps);
      return { steps, found: false, index: -1, totalProbes: Math.max(1, chain.length) };
    }

    fixTotalSteps(steps);
    return { steps, found: true, index: h1, totalProbes: steps.length - 2 };
  }

  // OPEN ADDRESSING SEARCH
  let found = false;
  let foundIndex = -1;
  let probeCount = 0;
  const maxProbes = tableSize;

  for (let i = 0; i < maxProbes; i++) {
    probeCount++;
    const { index: targetIndex, formulaStr } = calculateProbeIndex(algorithm, key, i, tableSize);
    const slot = table[targetIndex];

    table.forEach((s, idx) => {
      if (idx === targetIndex) {
        s.state = 'probing';
        s.probeNumber = i;
      } else if (s.state === 'probing') {
        s.state = 'idle';
      }
    });

    // Case 1: Slot is completely empty and was never deleted
    if (slot.value === null && !slot.isDeleted) {
      table[targetIndex].state = 'not-found';
      steps.push({
        stepIndex: steps.length + 1,
        totalSteps: 0,
        title: `Probe ${i}: Empty Slot at Index ${targetIndex}`,
        description: `Slot ${targetIndex} is completely empty. In open addressing, an empty slot guarantees the key was never inserted.`,
        formula: `${formulaStr} → Slot[${targetIndex}] is EMPTY`,
        activeLine: 3,
        highlightIndex: targetIndex,
        isFailure: true,
        tableSnapshot: JSON.parse(JSON.stringify(table)),
        historyNote: `Search Failed: Empty slot found at index ${targetIndex}. ${key} does not exist.`
      });
      break;
    }

    // Case 2: Slot contains Tombstone (DELETED)
    if (slot.isDeleted) {
      steps.push({
        stepIndex: steps.length + 1,
        totalSteps: 0,
        title: `Probe ${i}: Slot ${targetIndex} is DELETED (Tombstone)`,
        description: `Slot ${targetIndex} contains a tombstone. We CANNOT terminate here because the target key might have been inserted after this slot! Continuing probe...`,
        formula: `${formulaStr} → Tombstone encountered, skip and continue!`,
        activeLine: 4,
        highlightIndex: targetIndex,
        tableSnapshot: JSON.parse(JSON.stringify(table))
      });
      continue;
    }

    // Case 3: Matching Key Found
    if (slot.value === key) {
      found = true;
      foundIndex = targetIndex;
      table[targetIndex].state = 'found';
      steps.push({
        stepIndex: steps.length + 1,
        totalSteps: 0,
        title: `Probe ${i}: Key ${key} Found at Index ${targetIndex}!`,
        description: `Matching key ${key} discovered after ${probeCount} probe${probeCount > 1 ? 's' : ''}.`,
        formula: `${formulaStr} → Slot[${targetIndex}] == ${key} ✓`,
        activeLine: 5,
        highlightIndex: targetIndex,
        isSuccess: true,
        tableSnapshot: JSON.parse(JSON.stringify(table)),
        historyNote: `Search Success: ${key} found at index ${targetIndex} (${probeCount} probe${probeCount > 1 ? 's' : ''})`
      });
      break;
    }

    // Case 4: Occupied with another key -> Mismatch, probe further
    steps.push({
      stepIndex: steps.length + 1,
      totalSteps: 0,
      title: `Probe ${i}: Mismatch at Index ${targetIndex}`,
      description: `Slot ${targetIndex} holds value ${slot.value} (≠ ${key}). Continuing to next probe.`,
      formula: `${formulaStr} → ${slot.value} ≠ ${key}`,
      activeLine: 6,
      highlightIndex: targetIndex,
      tableSnapshot: JSON.parse(JSON.stringify(table))
    });
  }

  if (!found && steps[steps.length - 1]?.isFailure !== true) {
    steps.push({
      stepIndex: steps.length + 1,
      totalSteps: 0,
      title: 'Full Table Probed: Key Not Found',
      description: `Checked all ${maxProbes} slots in the probe sequence. Key ${key} does not exist in the hash table.`,
      formula: `Search exhausted after ${probeCount} probes.`,
      activeLine: 7,
      highlightIndex: h1,
      isFailure: true,
      tableSnapshot: JSON.parse(JSON.stringify(table)),
      historyNote: `Search Failed: Key ${key} not found after checking full probe cycle`
    });
  }

  fixTotalSteps(steps);
  return { steps, found, index: foundIndex, totalProbes: probeCount };
}

// Generate execution steps for DELETE
export function generateDeleteSteps(
  currentTable: HashSlot[],
  key: number,
  algorithm: AlgorithmType,
  tableSize: number
): { steps: StepExecution[]; newTable: HashSlot[]; success: boolean } {
  const steps: StepExecution[] = [];
  const table = currentTable.map(slot => ({
    ...slot,
    state: 'idle' as SlotState,
    chain: slot.chain ? [...slot.chain] : undefined
  }));

  const h1 = calculateHash(key, tableSize);

  steps.push({
    stepIndex: 1,
    totalSteps: 0,
    title: 'Calculate Hash for Deletion',
    description: `Compute the hash index for key ${key} to begin locating it for removal.`,
    formula: `h(${key}) = ${key} % ${tableSize} = ${h1}`,
    activeLine: 1,
    highlightIndex: h1,
    tableSnapshot: JSON.parse(JSON.stringify(table)),
    historyNote: `Delete: h(${key}) = ${h1}`
  });

  if (algorithm === 'chaining') {
    const bucket = table[h1];
    const chain = bucket.chain || [];

    if (!chain.includes(key)) {
      table[h1].state = 'not-found';
      steps.push({
        stepIndex: 2,
        totalSteps: 0,
        title: `Key ${key} Not Found in Chain`,
        description: `Bucket ${h1} does not contain key ${key}. Deletion cannot proceed.`,
        formula: `Bucket[${h1}] contains [${chain.join(', ')}]`,
        activeLine: 2,
        highlightIndex: h1,
        isFailure: true,
        tableSnapshot: JSON.parse(JSON.stringify(table)),
        historyNote: `Delete Failed: ${key} not in bucket ${h1}`
      });
      fixTotalSteps(steps);
      return { steps, newTable: currentTable, success: false };
    }

    // Animate removal
    table[h1].state = 'deleting';
    steps.push({
      stepIndex: 2,
      totalSteps: 0,
      title: `Unlinking Node ${key} from Chain`,
      description: `Found key ${key} in bucket ${h1}'s linked list. Unlinking node and reconnecting remaining pointers.`,
      formula: `Removing node ${key} from chain`,
      activeLine: 3,
      highlightIndex: h1,
      tableSnapshot: JSON.parse(JSON.stringify(table))
    });

    const newChain = chain.filter(val => val !== key);
    table[h1].chain = newChain;
    table[h1].value = newChain.length > 0 ? newChain[0] : null;
    table[h1].state = 'inserted';

    steps.push({
      stepIndex: 3,
      totalSteps: 0,
      title: `Node ${key} Deleted & Pointers Reconnected`,
      description: `Successfully removed key ${key}. New chain for bucket ${h1}: ${newChain.length > 0 ? newChain.join(' → ') + ' → NULL' : 'NULL (empty)'}.`,
      formula: `Bucket[${h1}] updated`,
      activeLine: 4,
      highlightIndex: h1,
      isSuccess: true,
      tableSnapshot: JSON.parse(JSON.stringify(table)),
      historyNote: `Deleted ${key} from bucket ${h1} (chain size now ${newChain.length})`
    });

    fixTotalSteps(steps);
    return { steps, newTable: table, success: true };
  }

  // OPEN ADDRESSING DELETION WITH TOMBSTONES
  let found = false;
  const maxProbes = tableSize;

  for (let i = 0; i < maxProbes; i++) {
    const { index: pIndex, formulaStr } = calculateProbeIndex(algorithm, key, i, tableSize);
    const slot = table[pIndex];

    if (slot.value === null && !slot.isDeleted) {
      // Empty slot -> key does not exist
      table[pIndex].state = 'not-found';
      steps.push({
        stepIndex: steps.length + 1,
        totalSteps: 0,
        title: `Probe ${i}: Empty Slot Encountered`,
        description: `Slot ${pIndex} is empty. Key ${key} does not exist in the table.`,
        formula: `${formulaStr} → Empty slot, key missing!`,
        activeLine: 2,
        highlightIndex: pIndex,
        isFailure: true,
        tableSnapshot: JSON.parse(JSON.stringify(table)),
        historyNote: `Delete Failed: ${key} not found`
      });
      break;
    }

    if (slot.value === key && !slot.isDeleted) {
      found = true;
      table[pIndex].state = 'deleting';

      steps.push({
        stepIndex: steps.length + 1,
        totalSteps: 0,
        title: `Key ${key} Located at Index ${pIndex}`,
        description: `Target key ${key} found. In open addressing, simply clearing the slot would break future search chains. We mark it as DELETED (tombstone).`,
        formula: `Slot[${pIndex}] == ${key} → Marking as DELETED`,
        activeLine: 3,
        highlightIndex: pIndex,
        tableSnapshot: JSON.parse(JSON.stringify(table))
      });

      // Apply tombstone
      table[pIndex].value = null;
      table[pIndex].isDeleted = true;
      table[pIndex].state = 'deleted';

      steps.push({
        stepIndex: steps.length + 1,
        totalSteps: 0,
        title: `Tombstone [DEL] Placed at Index ${pIndex}`,
        description: `Slot ${pIndex} now marked as DELETED. Searches encountering this slot will continue probing, while future insertions can reuse this spot!`,
        formula: `Slot[${pIndex}] = [DELETED Tombstone]`,
        activeLine: 4,
        highlightIndex: pIndex,
        isSuccess: true,
        tableSnapshot: JSON.parse(JSON.stringify(table)),
        historyNote: `Deleted ${key} at index ${pIndex} (tombstone marked)`
      });

      break;
    }
  }

  if (!found && steps[steps.length - 1]?.isFailure !== true) {
    steps.push({
      stepIndex: steps.length + 1,
      totalSteps: 0,
      title: 'Deletion Terminated: Key Not Found',
      description: `Could not locate key ${key} in the table after checking the probe sequence.`,
      formula: `Key ${key} does not exist.`,
      activeLine: 5,
      highlightIndex: h1,
      isFailure: true,
      tableSnapshot: JSON.parse(JSON.stringify(table)),
      historyNote: `Delete Failed: ${key} not found`
    });
  }

  fixTotalSteps(steps);
  return { steps, newTable: found ? table : currentTable, success: found };
}

function fixTotalSteps(steps: StepExecution[]) {
  const total = steps.length;
  steps.forEach(s => {
    s.totalSteps = total;
  });
}

// Compute statistics from table state
export function computeStats(
  table: HashSlot[],
  algorithm: AlgorithmType,
  totalCollisions: number,
  successfulSearches: number,
  failedSearches: number,
  totalProbes: number,
  totalOps: number
): HashStats {
  const tableSize = table.length;
  let elementCount = 0;
  let maxChainLength = 0;

  if (algorithm === 'chaining') {
    table.forEach(slot => {
      const len = slot.chain?.length || 0;
      elementCount += len;
      if (len > maxChainLength) maxChainLength = len;
    });
  } else {
    elementCount = table.filter(slot => slot.value !== null && !slot.isDeleted).length;
  }

  const loadFactor = tableSize > 0 ? parseFloat((elementCount / tableSize).toFixed(2)) : 0;
  const averageProbes = totalOps > 0 ? parseFloat((totalProbes / totalOps).toFixed(2)) : 1.0;

  return {
    tableSize,
    elementCount,
    loadFactor,
    collisions: totalCollisions,
    successfulSearches,
    failedSearches,
    totalProbes,
    averageProbes,
    maxChainLength
  };
}
