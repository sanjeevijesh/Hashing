export interface TechniqueTheory {
  id: string;
  name: string;
  category: 'Open Addressing' | 'Closed Addressing';
  formula: string;
  secondaryFormula?: string;
  coreConcept: string;
  howItWorks: string[];
  advantages: string[];
  limitations: string[];
  clusteringType: 'Primary Clustering' | 'Secondary Clustering' | 'No Clustering (Bucket Chains)' | 'Minimal / Uniform';
  clusteringExplanation: string;
  timeComplexity: {
    insertAvg: string;
    insertWorst: string;
    searchAvg: string;
    searchWorst: string;
    deleteAvg: string;
    deleteWorst: string;
  };
  spaceComplexity: string;
  tombstoneNeeded: boolean;
}

export const TECHNIQUES_THEORY: Record<string, TechniqueTheory> = {
  linear: {
    id: 'linear',
    name: 'Linear Probing',
    category: 'Open Addressing',
    formula: 'h(k, i) = (h(k) + i) % m',
    coreConcept: 'When a collision occurs at index h(k), sequentially scan adjacent slots (i = 0, 1, 2, ...) until an empty or tombstoned slot is found.',
    howItWorks: [
      'Compute base index: index = key % tableSize.',
      'If table[index] is occupied, advance probe step: i = 1, 2, 3...',
      'Check slot (index + i) % tableSize.',
      'Stop when an empty or DELETED slot is discovered.',
      'Store key at the discovered slot.'
    ],
    advantages: [
      'Exceptionally simple to understand and implement.',
      'Superb CPU cache locality: sequential memory access takes advantage of cache lines.',
      'No extra pointer or dynamic memory allocation overhead.'
    ],
    limitations: [
      'Suffers heavily from Primary Clustering: long contiguous blocks of occupied slots form.',
      'As load factor α approaches 1.0, probe sequences become drastically longer.',
      'Deletions require tombstone markers (DELETED) to preserve probe chains.'
    ],
    clusteringType: 'Primary Clustering',
    clusteringExplanation: 'Primary Clustering occurs because any key hashing into or immediately adjacent to a cluster extends that cluster further. The probability of hitting an occupied slot grows proportional to the size of the cluster, creating a snowball effect of sluggish searches.',
    timeComplexity: {
      insertAvg: 'O(1)',
      insertWorst: 'O(n)',
      searchAvg: 'O(1)',
      searchWorst: 'O(n)',
      deleteAvg: 'O(1)',
      deleteWorst: 'O(n)'
    },
    spaceComplexity: 'O(m) where m is table size',
    tombstoneNeeded: true
  },
  quadratic: {
    id: 'quadratic',
    name: 'Quadratic Probing',
    category: 'Open Addressing',
    formula: 'h(k, i) = (h(k) + c₁·i + c₂·i²) % m   [Standard: (h(k) + i²) % m]',
    coreConcept: 'Upon collision, search using increasing quadratic offsets (1², 2², 3², 4²...) to rapidly jump away from the collision cluster.',
    howItWorks: [
      'Compute initial hash: index = key % tableSize.',
      'If occupied, offset quadratically: index + 1², index + 2², index + 3²...',
      'Apply modulo tableSize at each probe to wrap within array bounds.',
      'Continue until an unoccupied slot or tombstone is found.',
      'To guarantee probing at least 50% of slots, table size m should be a prime number and load factor α < 0.5.'
    ],
    advantages: [
      'Virtually eliminates Primary Clustering by jumping quadratically away from dense clusters.',
      'Still achieves good spatial locality compared to linked chains.',
      'No additional dynamic memory structures required.'
    ],
    limitations: [
      'Prone to Secondary Clustering: keys hashing to the exact same initial index trace the identical quadratic probe sequence.',
      'May fail to find an empty slot even if the table is not completely full, unless table size is prime and α ≤ 0.5.',
      'Requires tombstone markers for deletions.'
    ],
    clusteringType: 'Secondary Clustering',
    clusteringExplanation: 'Secondary Clustering means keys that share the same initial hash h(k) will explore the exact same sequence of probes: h(k)+1², h(k)+2², etc. While far milder than primary clustering, it still causes localized contention when many keys collide at the same starting index.',
    timeComplexity: {
      insertAvg: 'O(1)',
      insertWorst: 'O(n)',
      searchAvg: 'O(1)',
      searchWorst: 'O(n)',
      deleteAvg: 'O(1)',
      deleteWorst: 'O(n)'
    },
    spaceComplexity: 'O(m) where m is table size',
    tombstoneNeeded: true
  },
  chaining: {
    id: 'chaining',
    name: 'Separate Chaining',
    category: 'Closed Addressing',
    formula: 'Index = key % tableSize → Bucket[Index] is a Linked List',
    coreConcept: 'Each bucket in the hash table acts as the head of an independent linked list. All keys mapping to the same bucket index are simply chained as nodes.',
    howItWorks: [
      'Compute target bucket: bucketIndex = key % tableSize.',
      'Access linked list at table[bucketIndex].',
      'Traverse list to confirm key is not already stored (duplicate check).',
      'If collision occurs, append/prepend new node [key | next] to the chain.',
      'Load factor α can exceed 1.0 without table overflowing.'
    ],
    advantages: [
      'Handles collisions naturally and gracefully; the table never becomes "full".',
      'Straightforward deletions: simply unlink node from the linked list without needing tombstones.',
      'Completely immune to both Primary and Secondary clustering.'
    ],
    limitations: [
      'Memory overhead for storing pointer links (next pointer in each node).',
      'Inferior CPU cache locality because linked list nodes are scattered arbitrarily in heap memory.',
      'If hash function is poor, all keys could map to one bucket, degenerating into an O(n) linked list search.'
    ],
    clusteringType: 'No Clustering (Bucket Chains)',
    clusteringExplanation: 'Because collisions remain confined strictly to their mapped bucket, elements never interfere with or block other table slots. Clustering between distinct buckets is completely absent.',
    timeComplexity: {
      insertAvg: 'O(1)',
      insertWorst: 'O(n)',
      searchAvg: 'O(1 + α)',
      searchWorst: 'O(n)',
      deleteAvg: 'O(1)',
      deleteWorst: 'O(n)'
    },
    spaceComplexity: 'O(m + n) where n is total elements and m is buckets',
    tombstoneNeeded: false
  },
  double: {
    id: 'double',
    name: 'Double Hashing',
    category: 'Open Addressing',
    formula: 'h(k, i) = (h₁(k) + i × h₂(k)) % m',
    secondaryFormula: 'h₁(k) = k % m,   h₂(k) = 1 + (k % (m - 1))',
    coreConcept: 'Uses a secondary hash function h₂(k) to determine a unique jump step for each key, ensuring that even keys sharing the same initial index probe distinct paths.',
    howItWorks: [
      'Calculate primary hash index: h1 = key % tableSize.',
      'Calculate secondary step size: h2 = 1 + (key % (tableSize - 1)). The "+ 1" guarantees the step is NEVER zero.',
      'Probe 0: check index h1.',
      'Probe 1: check (h1 + 1 × h2) % tableSize.',
      'Probe i: check (h1 + i × h2) % tableSize until an empty slot or tombstone is found.',
      'Table size m should ideally be prime to ensure h2 is coprime to m and the probe explores all slots.'
    ],
    advantages: [
      'Provides the most uniform probe distribution among all open addressing methods.',
      'Eliminates both Primary Clustering AND Secondary Clustering.',
      'Requires no linked list pointers or heap allocations.'
    ],
    limitations: [
      'Slightly higher computation cost due to evaluating two distinct hash functions per key.',
      'Requires tombstones for deletions.',
      'Table size must be chosen carefully (prime number) to guarantee full table coverage.'
    ],
    clusteringType: 'Minimal / Uniform',
    clusteringExplanation: 'Because two keys with the same primary hash h₁(k₁) = h₁(k₂) will almost certainly yield different secondary steps h₂(k₁) ≠ h₂(k₂), they will probe completely different paths. This eliminates both primary and secondary clustering.',
    timeComplexity: {
      insertAvg: 'O(1)',
      insertWorst: 'O(n)',
      searchAvg: 'O(1)',
      searchWorst: 'O(n)',
      deleteAvg: 'O(1)',
      deleteWorst: 'O(n)'
    },
    spaceComplexity: 'O(m) where m is table size',
    tombstoneNeeded: true
  }
};

export interface HashingApplication {
  title: string;
  icon: string;
  summary: string;
  details: string;
  badge: string;
  caution?: string;
}

export const HASHING_APPLICATIONS: HashingApplication[] = [
  {
    title: 'Database Indexing & Hash Joins',
    icon: 'Database',
    summary: 'Instant O(1) equality lookups for database records and lightning-fast in-memory hash joins.',
    details: 'Relational and NoSQL database engines (PostgreSQL, MySQL, Redis, MongoDB) use hash indices for exact match queries (e.g. WHERE user_id = 42). During hash join operations, the database builds an in-memory hash table on the smaller relation and probes it with the larger table for O(M + N) joins.',
    badge: 'Core Infrastructure'
  },
  {
    title: 'Symbol Tables in Compilers',
    icon: 'Cpu',
    summary: 'Tracking variable names, types, scope levels, and function signatures during program compilation.',
    details: 'Compilers (GCC, Clang, Rustc) construct symbol tables as scoped hash tables. As lexical analysis and parsing parse identifiers, the symbol table resolves identifiers to memory addresses, types, and scopes in constant expected time.',
    badge: 'System Software'
  },
  {
    title: 'In-Memory Caches & Memcached',
    icon: 'Zap',
    summary: 'Ultra-low latency key-value data caching systems like Redis and browser memory stores.',
    details: 'High-throughput web services rely on Redis and Memcached to cache API results and database rows. Underneath, Redis uses an adaptive hash table with incremental rehashing to avoid blocking threads when resizing.',
    badge: 'Performance & Scale'
  },
  {
    title: 'Password Storage (Cryptographic Hashing vs Hash Tables)',
    icon: 'ShieldAlert',
    summary: 'Essential educational distinction: Passwords require slow, salted cryptographic one-way hashes.',
    details: 'In classroom teaching, students often confuse hash tables with password security. Standard hash-table functions (like key % tableSize or MurmurHash) are fast and non-cryptographic. Password verification demands slow, memory-hard cryptographic hash algorithms like bcrypt, Argon2id, or PBKDF2 with unique cryptographic salts to defend against GPU brute-forcing and rainbow table attacks.',
    badge: 'Security Warning',
    caution: 'NEVER use basic modulo hash tables or fast hash functions for storing credentials. Always use specialized cryptographic hashing functions (Argon2 / bcrypt).'
  },
  {
    title: 'Language Dictionaries & HashMaps',
    icon: 'Layers',
    summary: 'Native mapping data types in Python (dict), Java (HashMap), JavaScript (Map/Object), and C++ (unordered_map).',
    details: 'Modern programming languages implement hash tables for high-frequency associative data. Java 8+ HashMap uses Separate Chaining, automatically upgrading buckets into red-black balanced trees when a chain exceeds 8 elements to protect against HashDoS collision attacks.',
    badge: 'Programming Languages'
  },
  {
    title: 'File Systems & Deduplication',
    icon: 'HardDrive',
    summary: 'Locating file inodes, directories, and detecting duplicate blocks across massive storage pools.',
    details: 'File systems like ZFS and Btrfs use hash trees and hash tables to map pathnames to disk inodes, as well as detecting and deduplicating identical storage chunks across terabytes of data.',
    badge: 'Storage Systems'
  }
];
