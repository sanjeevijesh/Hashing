import type { AlgorithmType } from '../types/hashing';

export type SupportedLanguage = 'c' | 'cpp' | 'java' | 'python';

export interface CodeSnippet {
  language: SupportedLanguage;
  langLabel: string;
  code: string;
}

export const CODE_IMPLEMENTATIONS: Record<AlgorithmType, Record<SupportedLanguage, string>> = {
  linear: {
    c: `/* Linear Probing Hash Table in C 
 * Author: CSE Dept - National Engineering College
 */
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define TABLE_SIZE 10
#define EMPTY -1
#define DELETED -2

typedef struct {
    int table[TABLE_SIZE];
} HashTable;

void initTable(HashTable* ht) {
    for (int i = 0; i < TABLE_SIZE; i++) {
        ht->table[i] = EMPTY;
    }
}

int hash(int key) {
    return key % TABLE_SIZE;
}

bool insert(HashTable* ht, int key) {
    int index = hash(key);
    int i = 0;

    while (i < TABLE_SIZE) {
        int probeIndex = (index + i) % TABLE_SIZE;
        // Check for duplicate
        if (ht->table[probeIndex] == key) {
            printf("Key %d already exists!\\n", key);
            return false;
        }
        // Found empty or tombstone slot
        if (ht->table[probeIndex] == EMPTY || ht->table[probeIndex] == DELETED) {
            ht->table[probeIndex] = key;
            printf("Inserted %d at index %d (Probes: %d)\\n", key, probeIndex, i + 1);
            return true;
        }
        i++; // Linear step
    }
    printf("Table Full! Cannot insert %d\\n", key);
    return false;
}

int search(HashTable* ht, int key) {
    int index = hash(key);
    int i = 0;

    while (i < TABLE_SIZE) {
        int probeIndex = (index + i) % TABLE_SIZE;
        if (ht->table[probeIndex] == EMPTY) {
            return -1; // Not found: empty slot terminates search
        }
        if (ht->table[probeIndex] == key) {
            return probeIndex; // Found!
        }
        // If DELETED, keep probing!
        i++;
    }
    return -1;
}

bool deleteKey(HashTable* ht, int key) {
    int idx = search(ht, key);
    if (idx != -1) {
        ht->table[idx] = DELETED; // Mark as tombstone
        printf("Deleted %d from index %d\\n", key, idx);
        return true;
    }
    printf("Key %d not found for deletion\\n", key);
    return false;
}`,
    cpp: `// Linear Probing Hash Table in C++
#include <iostream>
#include <vector>
using namespace std;

class LinearProbingHashTable {
private:
    static const int EMPTY = -1;
    static const int DELETED = -2;
    int size;
    vector<int> table;

    int hash(int key) const {
        return ((key % size) + size) % size;
    }

public:
    LinearProbingHashTable(int m = 10) : size(m), table(m, EMPTY) {}

    bool insert(int key) {
        int index = hash(key);
        for (int i = 0; i < size; i++) {
            int pIndex = (index + i) % size;
            if (table[pIndex] == key) return false; // Duplicate
            if (table[pIndex] == EMPTY || table[pIndex] == DELETED) {
                table[pIndex] = key;
                return true;
            }
        }
        return false; // Table Full
    }

    int search(int key) const {
        int index = hash(key);
        for (int i = 0; i < size; i++) {
            int pIndex = (index + i) % size;
            if (table[pIndex] == EMPTY) return -1;
            if (table[pIndex] == key) return pIndex;
        }
        return -1;
    }

    bool remove(int key) {
        int pos = search(key);
        if (pos != -1) {
            table[pos] = DELETED; // Tombstone preservation
            return true;
        }
        return false;
    }
};`,
    java: `// Linear Probing Hash Table in Java
import java.util.Arrays;

public class LinearProbingHashTable {
    private static final int EMPTY = -1;
    private static final int DELETED = -2;
    private final int size;
    private final int[] table;

    public LinearProbingHashTable(int size) {
        this.size = size;
        this.table = new int[size];
        Arrays.fill(this.table, EMPTY);
    }

    private int hash(int key) {
        return Math.floorMod(key, size);
    }

    public boolean insert(int key) {
        int index = hash(key);
        for (int i = 0; i < size; i++) {
            int probeIndex = (index + i) % size;
            if (table[probeIndex] == key) return false;
            if (table[probeIndex] == EMPTY || table[probeIndex] == DELETED) {
                table[probeIndex] = key;
                return true;
            }
        }
        return false; // Table full
    }

    public int search(int key) {
        int index = hash(key);
        for (int i = 0; i < size; i++) {
            int probeIndex = (index + i) % size;
            if (table[probeIndex] == EMPTY) return -1;
            if (table[probeIndex] == key) return probeIndex;
        }
        return -1;
    }

    public boolean delete(int key) {
        int idx = search(key);
        if (idx != -1) {
            table[idx] = DELETED;
            return true;
        }
        return false;
    }
}`,
    python: `# Linear Probing Hash Table in Python
class LinearProbingHashTable:
    def __init__(self, size=10):
        self.size = size
        self.table = [None] * size
        self.DELETED = object()  # Unique tombstone sentinel

    def _hash(self, key):
        return key % self.size

    def insert(self, key):
        index = self._hash(key)
        for i in range(self.size):
            probe_idx = (index + i) % self.size
            if self.table[probe_idx] == key:
                return False  # Duplicate rejection
            if self.table[probe_idx] is None or self.table[probe_idx] is self.DELETED:
                self.table[probe_idx] = key
                return True
        return False  # Table full

    def search(self, key):
        index = self._hash(key)
        for i in range(self.size):
            probe_idx = (index + i) % self.size
            if self.table[probe_idx] is None:
                return None  # Empty slot: key never existed
            if self.table[probe_idx] == key:
                return probe_idx
        return None

    def delete(self, key):
        idx = self.search(key)
        if idx is not None:
            self.table[idx] = self.DELETED  # Tombstone
            return True
        return False`
  },
  quadratic: {
    c: `/* Quadratic Probing Hash Table in C
 * Formula: h(k, i) = (h(k) + i*i) % m
 */
#include <stdio.h>
#include <stdbool.h>

#define TABLE_SIZE 11 // Prime size recommended!
#define EMPTY -1
#define DELETED -2

int table[TABLE_SIZE];

void init() {
    for (int i = 0; i < TABLE_SIZE; i++) table[i] = EMPTY;
}

int hash(int key) { return key % TABLE_SIZE; }

bool insert(int key) {
    int base = hash(key);
    for (int i = 0; i < TABLE_SIZE; i++) {
        int idx = (base + i * i) % TABLE_SIZE;
        if (table[idx] == key) return false;
        if (table[idx] == EMPTY || table[idx] == DELETED) {
            table[idx] = key;
            return true;
        }
    }
    return false;
}

int search(int key) {
    int base = hash(key);
    for (int i = 0; i < TABLE_SIZE; i++) {
        int idx = (base + i * i) % TABLE_SIZE;
        if (table[idx] == EMPTY) return -1;
        if (table[idx] == key) return idx;
    }
    return -1;
}`,
    cpp: `// Quadratic Probing in C++
#include <vector>
#include <iostream>
using namespace std;

class QuadraticHashTable {
    vector<int> table;
    int m;
    const int EMPTY = -1, DELETED = -2;
public:
    QuadraticHashTable(int size = 11) : m(size), table(size, EMPTY) {}

    bool insert(int key) {
        int base = (key % m + m) % m;
        for (int i = 0; i < m; i++) {
            int idx = (base + i * i) % m;
            if (table[idx] == key) return false;
            if (table[idx] == EMPTY || table[idx] == DELETED) {
                table[idx] = key;
                return true;
            }
        }
        return false;
    }

    int search(int key) {
        int base = (key % m + m) % m;
        for (int i = 0; i < m; i++) {
            int idx = (base + i * i) % m;
            if (table[idx] == EMPTY) return -1;
            if (table[idx] == key) return idx;
        }
        return -1;
    }
};`,
    java: `// Quadratic Probing in Java
public class QuadraticProbingHashTable {
    private final int[] table;
    private final int size;
    private static final int EMPTY = -1;
    private static final int DELETED = -2;

    public QuadraticProbingHashTable(int size) {
        this.size = size;
        this.table = new int[size];
        java.util.Arrays.fill(this.table, EMPTY);
    }

    public boolean insert(int key) {
        int base = Math.floorMod(key, size);
        for (int i = 0; i < size; i++) {
            int idx = (base + i * i) % size;
            if (table[idx] == key) return false;
            if (table[idx] == EMPTY || table[idx] == DELETED) {
                table[idx] = key;
                return true;
            }
        }
        return false;
    }
}`,
    python: `# Quadratic Probing in Python
class QuadraticProbingHashTable:
    def __init__(self, size=11):
        self.size = size
        self.table = [None] * size
        self.DELETED = object()

    def insert(self, key):
        base = key % self.size
        for i in range(self.size):
            idx = (base + i * i) % self.size
            if self.table[idx] == key:
                return False
            if self.table[idx] is None or self.table[idx] is self.DELETED:
                self.table[idx] = key
                return True
        return False`
  },
  chaining: {
    c: `/* Separate Chaining Hash Table in C
 * Using Linked Lists for each bucket
 */
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define TABLE_SIZE 10

typedef struct Node {
    int value;
    struct Node* next;
} Node;

typedef struct {
    Node* buckets[TABLE_SIZE];
} HashTable;

void init(HashTable* ht) {
    for (int i = 0; i < TABLE_SIZE; i++) ht->buckets[i] = NULL;
}

int hash(int key) { return key % TABLE_SIZE; }

bool insert(HashTable* ht, int key) {
    int b = hash(key);
    Node* curr = ht->buckets[b];
    // Duplicate check
    while (curr) {
        if (curr->value == key) return false;
        curr = curr->next;
    }
    // Prepend new node
    Node* newNode = (Node*)malloc(sizeof(Node));
    newNode->value = key;
    newNode->next = ht->buckets[b];
    ht->buckets[b] = newNode;
    return true;
}

bool search(HashTable* ht, int key) {
    int b = hash(key);
    Node* curr = ht->buckets[b];
    while (curr) {
        if (curr->value == key) return true;
        curr = curr->next;
    }
    return false;
}

bool deleteKey(HashTable* ht, int key) {
    int b = hash(key);
    Node* curr = ht->buckets[b];
    Node* prev = NULL;

    while (curr && curr->value != key) {
        prev = curr;
        curr = curr->next;
    }
    if (!curr) return false;

    if (prev == NULL) ht->buckets[b] = curr->next;
    else prev->next = curr->next;

    free(curr);
    return true;
}`,
    cpp: `// Separate Chaining in C++ using std::list
#include <vector>
#include <list>
#include <algorithm>
using namespace std;

class SeparateChainingHashTable {
    int size;
    vector<list<int>> table;
public:
    SeparateChainingHashTable(int m = 10) : size(m), table(m) {}

    bool insert(int key) {
        int b = (key % size + size) % size;
        if (find(table[b].begin(), table[b].end(), key) != table[b].end()) {
            return false; // Duplicate
        }
        table[b].push_back(key);
        return true;
    }

    bool search(int key) {
        int b = (key % size + size) % size;
        return find(table[b].begin(), table[b].end(), key) != table[b].end();
    }

    bool remove(int key) {
        int b = (key % size + size) % size;
        auto it = find(table[b].begin(), table[b].end(), key);
        if (it != table[b].end()) {
            table[b].erase(it);
            return true;
        }
        return false;
    }
};`,
    java: `// Separate Chaining in Java using LinkedList
import java.util.LinkedList;

public class SeparateChainingHashTable {
    private final int size;
    private final LinkedList<Integer>[] buckets;

    @SuppressWarnings("unchecked")
    public SeparateChainingHashTable(int size) {
        this.size = size;
        this.buckets = new LinkedList[size];
        for (int i = 0; i < size; i++) {
            buckets[i] = new LinkedList<>();
        }
    }

    public boolean insert(int key) {
        int b = Math.floorMod(key, size);
        if (buckets[b].contains(key)) return false;
        buckets[b].add(key);
        return true;
    }

    public boolean search(int key) {
        int b = Math.floorMod(key, size);
        return buckets[b].contains(key);
    }

    public boolean delete(int key) {
        int b = Math.floorMod(key, size);
        return buckets[b].remove((Integer) key);
    }
}`,
    python: `# Separate Chaining in Python
class SeparateChainingHashTable:
    def __init__(self, size=10):
        self.size = size
        self.buckets = [[] for _ in range(size)]

    def insert(self, key):
        b = key % self.size
        if key in self.buckets[b]:
            return False
        self.buckets[b].append(key)
        return True

    def search(self, key):
        b = key % self.size
        return key in self.buckets[b]

    def delete(self, key):
        b = key % self.size
        if key in self.buckets[b]:
            self.buckets[b].remove(key)
            return True
        return False`
  },
  double: {
    c: `/* Double Hashing in C
 * h1(k) = k % m
 * h2(k) = 1 + (k % (m - 1))
 * h(k, i) = (h1 + i * h2) % m
 */
#include <stdio.h>
#include <stdbool.h>

#define TABLE_SIZE 11 // Prime size
#define EMPTY -1
#define DELETED -2

int table[TABLE_SIZE];

int h1(int key) { return key % TABLE_SIZE; }
int h2(int key) { return 1 + (key % (TABLE_SIZE - 1)); }

bool insert(int key) {
    int primary = h1(key);
    int step = h2(key);

    for (int i = 0; i < TABLE_SIZE; i++) {
        int idx = (primary + i * step) % TABLE_SIZE;
        if (table[idx] == key) return false;
        if (table[idx] == EMPTY || table[idx] == DELETED) {
            table[idx] = key;
            return true;
        }
    }
    return false;
}`,
    cpp: `// Double Hashing in C++
#include <vector>
using namespace std;

class DoubleHashTable {
    int m;
    vector<int> table;
    const int EMPTY = -1, DELETED = -2;

    int h1(int k) const { return (k % m + m) % m; }
    int h2(int k) const { return 1 + ((k % (m - 1) + (m - 1)) % (m - 1)); }
public:
    DoubleHashTable(int size = 11) : m(size), table(size, EMPTY) {}

    bool insert(int key) {
        int base = h1(key);
        int step = h2(key);
        for (int i = 0; i < m; i++) {
            int idx = (base + i * step) % m;
            if (table[idx] == key) return false;
            if (table[idx] == EMPTY || table[idx] == DELETED) {
                table[idx] = key;
                return true;
            }
        }
        return false;
    }
};`,
    java: `// Double Hashing in Java
public class DoubleHashTable {
    private final int m;
    private final int[] table;
    private static final int EMPTY = -1;
    private static final int DELETED = -2;

    public DoubleHashTable(int size) {
        this.m = size;
        this.table = new int[size];
        java.util.Arrays.fill(this.table, EMPTY);
    }

    private int h1(int k) { return Math.floorMod(k, m); }
    private int h2(int k) { return 1 + Math.floorMod(k, m - 1); }

    public boolean insert(int key) {
        int base = h1(key);
        int step = h2(key);
        for (int i = 0; i < m; i++) {
            int idx = (base + i * step) % m;
            if (table[idx] == key) return false;
            if (table[idx] == EMPTY || table[idx] == DELETED) {
                table[idx] = key;
                return true;
            }
        }
        return false;
    }
}`,
    python: `# Double Hashing in Python
class DoubleHashTable:
    def __init__(self, size=11):
        self.size = size
        self.table = [None] * size
        self.DELETED = object()

    def _h1(self, k):
        return k % self.size

    def _h2(self, k):
        return 1 + (k % (self.size - 1))

    def insert(self, key):
        base = self._h1(key)
        step = self._h2(key)
        for i in range(self.size):
            idx = (base + i * step) % self.size
            if self.table[idx] == key:
                return False
            if self.table[idx] is None or self.table[idx] is self.DELETED:
                self.table[idx] = key
                return True
        return False`
  }
};
