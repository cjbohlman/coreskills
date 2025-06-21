/*
  # Performance Optimization Mastery Learning Path

  1. New Learning Path
    - `Performance Optimization Mastery` - Comprehensive performance optimization curriculum
    - Covers algorithmic efficiency, memory management, caching, database optimization, frontend performance, and distributed systems
    - Progressive difficulty from beginner to advanced

  2. New Challenges
    - Algorithm Complexity Analysis (Easy)
    - Memory Management Optimization (Medium)
    - Caching Strategy Implementation (Medium)
    - Database Query Optimization (Hard)
    - Frontend Performance Tuning (Hard)
    - Distributed System Performance (Hard)

  3. Security
    - Enable RLS on all tables (already enabled)
    - Existing policies will cover new data
*/

-- Insert Performance Optimization learning path
INSERT INTO learning_paths (title, description, icon, order_index) VALUES 
(
  'Performance Optimization Mastery',
  'Master the art of software performance optimization from algorithmic efficiency to production-scale systems. Learn memory management, caching strategies, profiling techniques, and real-world optimization patterns used by top tech companies.',
  'zap',
  6
) ON CONFLICT DO NOTHING;

-- Get the learning path ID and insert challenges
DO $$
DECLARE
    path_id uuid;
BEGIN
    SELECT id INTO path_id FROM learning_paths WHERE title = 'Performance Optimization Mastery';

    -- Beginner Level: Algorithm Complexity Analysis
    INSERT INTO challenges (title, description, difficulty, challenge_type, initial_code, solution_code, test_cases, path_id, order_index) VALUES 
    (
        'Algorithm Complexity Analysis',
        '# Performance Optimization Fundamentals: Big O Analysis

## Learning Objectives
- Understand time and space complexity
- Identify performance bottlenecks in algorithms
- Apply optimization techniques to improve efficiency
- Measure and compare algorithm performance

## Core Concepts to Master
- Big O notation (O(1), O(log n), O(n), O(n²), O(2ⁿ))
- Time vs space complexity trade-offs
- Best, average, and worst-case scenarios
- Amortized analysis

## Your Task
Analyze and optimize the following functions. For each function:
1. **Identify the current time complexity**
2. **Find performance bottlenecks**
3. **Implement optimized versions**
4. **Measure performance improvements**

## Performance Metrics to Track
- Execution time for different input sizes
- Memory usage patterns
- Scalability characteristics
- Cache hit/miss ratios

## Industry Best Practices
- Always profile before optimizing
- Focus on the most frequently called code paths
- Consider the 80/20 rule (80% of time spent in 20% of code)
- Balance readability with performance

## Common Pitfalls to Avoid
- Premature optimization
- Optimizing the wrong bottlenecks
- Ignoring memory usage
- Not considering real-world data patterns

## Tools to Learn
- Browser DevTools Performance tab
- Node.js built-in profiler
- Memory profilers (Chrome DevTools Memory tab)
- Benchmark.js for JavaScript performance testing',
        'easy',
        'coding',
        '// Performance Challenge: Algorithm Optimization
// Fix the performance issues in these functions

// Function 1: Find duplicates in an array
function findDuplicates(arr) {
    const duplicates = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {
                duplicates.push(arr[i]);
            }
        }
    }
    return duplicates;
}

// Function 2: Check if string is palindrome
function isPalindrome(str) {
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
    const reversed = cleaned.split("").reverse().join("");
    return cleaned === reversed;
}

// Function 3: Find intersection of two arrays
function findIntersection(arr1, arr2) {
    const intersection = [];
    for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr2.length; j++) {
            if (arr1[i] === arr2[j] && !intersection.includes(arr1[i])) {
                intersection.push(arr1[i]);
            }
        }
    }
    return intersection;
}

// Function 4: Calculate factorial
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// Export functions for testing
if (typeof module !== "undefined") {
    module.exports = { findDuplicates, isPalindrome, findIntersection, factorial };
}',
        '// Optimized Performance Solutions
// Each function improved from O(n²) or worse to optimal complexity

// Function 1: Find duplicates - O(n²) → O(n)
function findDuplicates(arr) {
    const seen = new Set();
    const duplicates = new Set();
    
    for (const item of arr) {
        if (seen.has(item)) {
            duplicates.add(item);
        } else {
            seen.add(item);
        }
    }
    
    return Array.from(duplicates);
}

// Function 2: Check palindrome - O(n) → O(n/2) with early termination
function isPalindrome(str) {
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
    const len = cleaned.length;
    
    // Two-pointer approach - only check half the string
    for (let i = 0; i < len / 2; i++) {
        if (cleaned[i] !== cleaned[len - 1 - i]) {
            return false;
        }
    }
    return true;
}

// Function 3: Array intersection - O(n*m) → O(n + m)
function findIntersection(arr1, arr2) {
    const set1 = new Set(arr1);
    const intersection = new Set();
    
    for (const item of arr2) {
        if (set1.has(item)) {
            intersection.add(item);
        }
    }
    
    return Array.from(intersection);
}

// Function 4: Factorial with memoization - O(n) → O(1) for repeated calls
const factorialMemo = (() => {
    const cache = new Map();
    
    return function factorial(n) {
        if (n <= 1) return 1;
        if (cache.has(n)) return cache.get(n);
        
        const result = n * factorial(n - 1);
        cache.set(n, result);
        return result;
    };
})();

// Performance testing utilities
function measurePerformance(fn, ...args) {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    return {
        result,
        executionTime: end - start,
        memoryUsed: performance.memory ? performance.memory.usedJSHeapSize : "N/A"
    };
}

// Export optimized functions
if (typeof module !== "undefined") {
    module.exports = { 
        findDuplicates, 
        isPalindrome, 
        findIntersection, 
        factorial: factorialMemo,
        measurePerformance 
    };
}',
        '[
            {
                "input": [1, 2, 3, 2, 4, 3, 5],
                "expected_output": [2, 3],
                "description": "Find duplicates in array - should be O(n) complexity"
            },
            {
                "input": "A man a plan a canal Panama",
                "expected_output": true,
                "description": "Palindrome check - should use two-pointer approach"
            },
            {
                "input": [[1, 2, 3, 4], [3, 4, 5, 6]],
                "expected_output": [3, 4],
                "description": "Array intersection - should be O(n + m) complexity"
            },
            {
                "input": 5,
                "expected_output": 120,
                "description": "Factorial calculation - should use memoization"
            }
        ]',
        path_id,
        1
    );

    -- Medium Level: Memory Management Optimization
    INSERT INTO challenges (title, description, difficulty, challenge_type, initial_code, solution_code, test_cases, path_id, order_index) VALUES 
    (
        'Memory Management Optimization',
        '# Memory Management & Garbage Collection Optimization

## Learning Objectives
- Understand memory allocation patterns
- Identify and fix memory leaks
- Optimize garbage collection performance
- Implement efficient data structures

## Core Concepts to Master
- Heap vs Stack memory
- Garbage collection algorithms (Mark & Sweep, Generational GC)
- Memory leak patterns and detection
- Object pooling and reuse strategies
- Weak references and memory-conscious programming

## Your Task
Optimize the memory usage in this data processing application:

1. **Fix memory leaks** in event listeners and timers
2. **Implement object pooling** for frequently created objects
3. **Optimize data structures** for memory efficiency
4. **Add memory monitoring** and cleanup strategies

## Memory Optimization Techniques
- Object pooling for frequently allocated objects
- Lazy loading and pagination for large datasets
- Weak references for caches
- Efficient data structure selection
- Memory-conscious algorithm design

## Tools for Memory Analysis
- Chrome DevTools Memory tab
- Node.js `--inspect` flag with memory profiling
- `process.memoryUsage()` for Node.js monitoring
- Heap snapshots and allocation timelines

## Performance Metrics
- Peak memory usage
- Memory growth rate over time
- Garbage collection frequency and duration
- Object allocation/deallocation rates

## Industry Best Practices
- Monitor memory usage in production
- Use memory profilers during development
- Implement memory budgets for components
- Regular memory leak testing in CI/CD',
        'medium',
        'coding',
        '// Memory Management Challenge: Fix Memory Leaks and Optimize Usage
class DataProcessor {
    constructor() {
        this.data = [];
        this.cache = new Map();
        this.listeners = [];
        this.timers = [];
        this.workers = [];
    }
    
    // Memory leak: Event listeners not cleaned up
    addEventListeners() {
        const handler = (event) => {
            this.processEvent(event);
        };
        document.addEventListener("click", handler);
        window.addEventListener("resize", handler);
        this.listeners.push(handler);
    }
    
    // Memory leak: Timers not cleared
    startPeriodicProcessing() {
        const timer = setInterval(() => {
            this.processData();
        }, 1000);
        this.timers.push(timer);
    }
    
    // Memory leak: Unbounded cache growth
    cacheData(key, value) {
        this.cache.set(key, value);
    }
    
    // Memory inefficient: Creating many temporary objects
    processLargeDataset(dataset) {
        const results = [];
        for (let i = 0; i < dataset.length; i++) {
            const item = dataset[i];
            const processed = {
                id: item.id,
                value: item.value * 2,
                timestamp: new Date(),
                metadata: {
                    processed: true,
                    index: i,
                    batch: Math.floor(i / 100)
                }
            };
            results.push(processed);
        }
        return results;
    }
    
    // Memory leak: Web Workers not terminated
    createWorker() {
        const worker = new Worker("data-worker.js");
        this.workers.push(worker);
        return worker;
    }
    
    // No cleanup method
    processEvent(event) {
        this.data.push({
            type: event.type,
            timestamp: Date.now(),
            target: event.target
        });
    }
    
    processData() {
        // Simulate data processing
        this.data.forEach(item => {
            this.cacheData(item.timestamp, item);
        });
    }
}

// Usage that causes memory issues
const processor = new DataProcessor();
processor.addEventListeners();
processor.startPeriodicProcessing();

// Simulate large dataset processing
const largeDataset = Array.from({length: 10000}, (_, i) => ({
    id: i,
    value: Math.random() * 100
}));

processor.processLargeDataset(largeDataset);',
        '// Optimized Memory Management Solution
class DataProcessor {
    constructor(options = {}) {
        this.data = [];
        this.cache = new Map();
        this.listeners = new Map(); // Track listeners for cleanup
        this.timers = new Set(); // Track timers for cleanup
        this.workers = new Set(); // Track workers for cleanup
        this.maxCacheSize = options.maxCacheSize || 1000;
        this.objectPool = new ObjectPool(); // Object pooling
        this.isDestroyed = false;
    }
    
    // Fixed: Proper event listener management
    addEventListeners() {
        const clickHandler = (event) => {
            if (this.isDestroyed) return;
            this.processEvent(event);
        };
        
        const resizeHandler = (event) => {
            if (this.isDestroyed) return;
            this.processEvent(event);
        };
        
        document.addEventListener("click", clickHandler);
        window.addEventListener("resize", resizeHandler);
        
        // Store references for cleanup
        this.listeners.set("click", clickHandler);
        this.listeners.set("resize", resizeHandler);
    }
    
    // Fixed: Proper timer management
    startPeriodicProcessing() {
        const timer = setInterval(() => {
            if (this.isDestroyed) return;
            this.processData();
        }, 1000);
        this.timers.add(timer);
        return timer;
    }
    
    // Fixed: LRU cache with size limit
    cacheData(key, value) {
        if (this.cache.size >= this.maxCacheSize) {
            // Remove oldest entry (LRU)
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }
    
    // Optimized: Object pooling and memory-efficient processing
    processLargeDataset(dataset) {
        const results = [];
        const batchSize = 100;
        
        for (let i = 0; i < dataset.length; i += batchSize) {
            const batch = dataset.slice(i, i + batchSize);
            const batchResults = this.processBatch(batch, i);
            results.push(...batchResults);
            
            // Allow garbage collection between batches
            if (i % 1000 === 0) {
                this.yieldToEventLoop();
            }
        }
        
        return results;
    }
    
    processBatch(batch, startIndex) {
        return batch.map((item, index) => {
            // Reuse objects from pool
            const processed = this.objectPool.acquire();
            processed.id = item.id;
            processed.value = item.value * 2;
            processed.timestamp = Date.now();
            processed.metadata = {
                processed: true,
                index: startIndex + index,
                batch: Math.floor((startIndex + index) / 100)
            };
            return processed;
        });
    }
    
    // Fixed: Proper worker management
    createWorker() {
        const worker = new Worker("data-worker.js");
        this.workers.add(worker);
        
        // Auto-cleanup on worker termination
        worker.addEventListener("error", () => {
            this.workers.delete(worker);
        });
        
        return worker;
    }
    
    // Memory-conscious event processing
    processEvent(event) {
        // Limit data array size
        if (this.data.length > 1000) {
            this.data.splice(0, 500); // Remove oldest half
        }
        
        this.data.push({
            type: event.type,
            timestamp: Date.now(),
            // Avoid storing DOM references that prevent GC
            targetTag: event.target?.tagName
        });
    }
    
    processData() {
        // Process in chunks to avoid blocking
        const chunkSize = 50;
        for (let i = 0; i < this.data.length; i += chunkSize) {
            const chunk = this.data.slice(i, i + chunkSize);
            chunk.forEach(item => {
                this.cacheData(item.timestamp, item);
            });
        }
    }
    
    // Yield control to event loop
    async yieldToEventLoop() {
        return new Promise(resolve => setTimeout(resolve, 0));
    }
    
    // Memory monitoring
    getMemoryUsage() {
        return {
            cacheSize: this.cache.size,
            dataLength: this.data.length,
            activeTimers: this.timers.size,
            activeWorkers: this.workers.size,
            activeListeners: this.listeners.size,
            heapUsed: performance.memory?.usedJSHeapSize || "N/A"
        };
    }
    
    // Essential: Cleanup method
    destroy() {
        this.isDestroyed = true;
        
        // Clean up event listeners
        this.listeners.forEach((handler, event) => {
            if (event === "click") {
                document.removeEventListener("click", handler);
            } else if (event === "resize") {
                window.removeEventListener("resize", handler);
            }
        });
        this.listeners.clear();
        
        // Clean up timers
        this.timers.forEach(timer => clearInterval(timer));
        this.timers.clear();
        
        // Clean up workers
        this.workers.forEach(worker => worker.terminate());
        this.workers.clear();
        
        // Clear data structures
        this.cache.clear();
        this.data.length = 0;
        
        // Return objects to pool
        this.objectPool.clear();
    }
}

// Object Pool for memory efficiency
class ObjectPool {
    constructor() {
        this.pool = [];
    }
    
    acquire() {
        if (this.pool.length > 0) {
            return this.pool.pop();
        }
        return {
            id: null,
            value: null,
            timestamp: null,
            metadata: null
        };
    }
    
    release(obj) {
        // Reset object properties
        obj.id = null;
        obj.value = null;
        obj.timestamp = null;
        obj.metadata = null;
        
        // Return to pool if not too large
        if (this.pool.length < 100) {
            this.pool.push(obj);
        }
    }
    
    clear() {
        this.pool.length = 0;
    }
}

// Memory-conscious usage
const processor = new DataProcessor({ maxCacheSize: 500 });
processor.addEventListeners();
processor.startPeriodicProcessing();

// Cleanup when done
window.addEventListener("beforeunload", () => {
    processor.destroy();
});

// Export for testing
if (typeof module !== "undefined") {
    module.exports = { DataProcessor, ObjectPool };
}',
        '[
            {
                "input": "memory_leak_test",
                "expected_output": "no_leaks_detected",
                "description": "Event listeners and timers should be properly cleaned up"
            },
            {
                "input": "cache_size_test",
                "expected_output": "cache_bounded",
                "description": "Cache should not grow beyond specified limit"
            },
            {
                "input": "object_pool_test",
                "expected_output": "objects_reused",
                "description": "Objects should be reused from pool to reduce allocations"
            },
            {
                "input": "cleanup_test",
                "expected_output": "resources_cleaned",
                "description": "All resources should be properly cleaned up on destroy"
            }
        ]',
        path_id,
        2
    );

    -- Medium Level: Caching Strategy Implementation
    INSERT INTO challenges (title, description, difficulty, challenge_type, initial_code, solution_code, test_cases, path_id, order_index) VALUES 
    (
        'Caching Strategy Implementation',
        '# Advanced Caching Strategies & Implementation

## Learning Objectives
- Implement multiple caching strategies (LRU, LFU, TTL)
- Design cache hierarchies and invalidation strategies
- Optimize cache hit ratios and performance
- Handle cache coherence in distributed systems

## Core Concepts to Master
- Cache replacement algorithms (LRU, LFU, FIFO)
- Cache invalidation strategies
- Write-through vs write-back caching
- Cache coherence and consistency
- Multi-level cache hierarchies
- Cache warming and preloading

## Your Task
Build a comprehensive caching system with:

1. **Multiple cache strategies** (LRU, LFU, TTL-based)
2. **Cache hierarchy** (L1 memory, L2 persistent)
3. **Intelligent invalidation** and refresh strategies
4. **Performance monitoring** and optimization
5. **Distributed cache coordination**

## Caching Patterns to Implement
- **Cache-Aside**: Application manages cache
- **Write-Through**: Write to cache and database simultaneously
- **Write-Behind**: Write to cache immediately, database later
- **Refresh-Ahead**: Proactively refresh before expiration

## Performance Metrics
- Cache hit ratio (target: >90% for hot data)
- Average response time
- Cache memory usage
- Eviction frequency
- Cache warming time

## Tools and Technologies
- Redis for distributed caching
- Memcached for simple key-value caching
- Browser Cache API for frontend
- Service Worker for offline caching
- CDN integration strategies

## Industry Best Practices
- Monitor cache hit ratios continuously
- Implement cache warming strategies
- Use appropriate TTL values
- Design for cache failure scenarios
- Implement gradual cache warming',
        'medium',
        'coding',
        '// Caching Challenge: Implement Advanced Caching Strategies
class BasicCache {
    constructor() {
        this.cache = new Map();
    }
    
    // Basic get/set without any optimization
    get(key) {
        return this.cache.get(key);
    }
    
    set(key, value) {
        this.cache.set(key, value);
    }
    
    // No eviction strategy - memory will grow indefinitely
    has(key) {
        return this.cache.has(key);
    }
    
    delete(key) {
        return this.cache.delete(key);
    }
    
    clear() {
        this.cache.clear();
    }
    
    size() {
        return this.cache.size;
    }
}

// Inefficient data fetching without proper caching
class DataService {
    constructor() {
        this.cache = new BasicCache();
        this.requestCount = 0;
    }
    
    // Simulates expensive API call
    async fetchUserData(userId) {
        this.requestCount++;
        
        // Check cache (but no TTL or intelligent invalidation)
        if (this.cache.has(userId)) {
            return this.cache.get(userId);
        }
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const userData = {
            id: userId,
            name: "User " + userId,
            email: "user" + userId + "@example.com",
            lastUpdated: Date.now()
        };
        
        // Store in cache (but no size limits or TTL)
        this.cache.set(userId, userData);
        
        return userData;
    }
    
    // No cache warming or preloading
    async fetchMultipleUsers(userIds) {
        const results = [];
        for (const id of userIds) {
            const user = await this.fetchUserData(id);
            results.push(user);
        }
        return results;
    }
    
    // No intelligent cache invalidation
    updateUser(userId, updates) {
        // Update would happen in database
        // But cache is not invalidated properly
        console.log("Updating user " + userId, updates);
    }
    
    getStats() {
        return {
            requestCount: this.requestCount,
            cacheSize: this.cache.size()
        };
    }
}

// Usage that demonstrates poor caching performance
const dataService = new DataService();

// This will make unnecessary API calls
async function demonstratePoorCaching() {
    // Multiple calls for same data
    await dataService.fetchUserData(1);
    await dataService.fetchUserData(1); // Should be cached
    await dataService.fetchUserData(1); // Should be cached
    
    // Batch processing without optimization
    const userIds = Array.from({length: 100}, (_, i) => i + 1);
    await dataService.fetchMultipleUsers(userIds);
    
    console.log("Stats:", dataService.getStats());
}

demonstratePoorCaching();',
        '// Advanced Caching System Implementation
class LRUCache {
    constructor(maxSize = 100) {
        this.maxSize = maxSize;
        this.cache = new Map();
    }
    
    get(key) {
        if (this.cache.has(key)) {
            // Move to end (most recently used)
            const value = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, value);
            return value;
        }
        return undefined;
    }
    
    set(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.maxSize) {
            // Remove least recently used (first item)
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }
    
    has(key) {
        return this.cache.has(key);
    }
    
    delete(key) {
        return this.cache.delete(key);
    }
    
    clear() {
        this.cache.clear();
    }
    
    size() {
        return this.cache.size;
    }
}

class TTLCache {
    constructor(defaultTTL = 300000) { // 5 minutes default
        this.cache = new Map();
        this.timers = new Map();
        this.defaultTTL = defaultTTL;
    }
    
    set(key, value, ttl = this.defaultTTL) {
        // Clear existing timer
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
        }
        
        // Set value
        this.cache.set(key, {
            value,
            timestamp: Date.now(),
            ttl
        });
        
        // Set expiration timer
        const timer = setTimeout(() => {
            this.delete(key);
        }, ttl);
        
        this.timers.set(key, timer);
    }
    
    get(key) {
        const item = this.cache.get(key);
        if (!item) return undefined;
        
        // Check if expired
        if (Date.now() - item.timestamp > item.ttl) {
            this.delete(key);
            return undefined;
        }
        
        return item.value;
    }
    
    has(key) {
        const item = this.cache.get(key);
        if (!item) return false;
        
        if (Date.now() - item.timestamp > item.ttl) {
            this.delete(key);
            return false;
        }
        
        return true;
    }
    
    delete(key) {
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
            this.timers.delete(key);
        }
        return this.cache.delete(key);
    }
    
    clear() {
        this.timers.forEach(timer => clearTimeout(timer));
        this.timers.clear();
        this.cache.clear();
    }
    
    size() {
        return this.cache.size;
    }
}

class MultiLevelCache {
    constructor(options = {}) {
        this.l1Cache = new LRUCache(options.l1Size || 50); // Fast, small
        this.l2Cache = new TTLCache(options.l2TTL || 600000); // Larger, persistent
        this.stats = {
            l1Hits: 0,
            l2Hits: 0,
            misses: 0,
            sets: 0
        };
    }
    
    get(key) {
        // Try L1 cache first
        let value = this.l1Cache.get(key);
        if (value !== undefined) {
            this.stats.l1Hits++;
            return value;
        }
        
        // Try L2 cache
        value = this.l2Cache.get(key);
        if (value !== undefined) {
            this.stats.l2Hits++;
            // Promote to L1
            this.l1Cache.set(key, value);
            return value;
        }
        
        this.stats.misses++;
        return undefined;
    }
    
    set(key, value, ttl) {
        this.stats.sets++;
        this.l1Cache.set(key, value);
        this.l2Cache.set(key, value, ttl);
    }
    
    delete(key) {
        this.l1Cache.delete(key);
        this.l2Cache.delete(key);
    }
    
    clear() {
        this.l1Cache.clear();
        this.l2Cache.clear();
    }
    
    getStats() {
        const total = this.stats.l1Hits + this.stats.l2Hits + this.stats.misses;
        return {
            ...this.stats,
            hitRatio: total > 0 ? (this.stats.l1Hits + this.stats.l2Hits) / total : 0,
            l1HitRatio: total > 0 ? this.stats.l1Hits / total : 0
        };
    }
}

class OptimizedDataService {
    constructor() {
        this.cache = new MultiLevelCache({
            l1Size: 100,
            l2TTL: 600000 // 10 minutes
        });
        this.requestCount = 0;
        this.batchRequests = new Map(); // For request deduplication
    }
    
    async fetchUserData(userId, options = {}) {
        const cacheKey = "user:" + userId;
        
        // Check cache first
        let userData = this.cache.get(cacheKey);
        if (userData && !options.forceRefresh) {
            return userData;
        }
        
        // Deduplicate concurrent requests
        if (this.batchRequests.has(userId)) {
            return this.batchRequests.get(userId);
        }
        
        // Create request promise
        const requestPromise = this._fetchFromAPI(userId);
        this.batchRequests.set(userId, requestPromise);
        
        try {
            userData = await requestPromise;
            
            // Cache with appropriate TTL
            const ttl = options.ttl || (userData.isVIP ? 300000 : 600000);
            this.cache.set(cacheKey, userData, ttl);
            
            return userData;
        } finally {
            this.batchRequests.delete(userId);
        }
    }
    
    async _fetchFromAPI(userId) {
        this.requestCount++;
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 50));
        
        return {
            id: userId,
            name: "User " + userId,
            email: "user" + userId + "@example.com",
            isVIP: userId % 10 === 0, // Every 10th user is VIP
            lastUpdated: Date.now()
        };
    }
    
    // Optimized batch fetching with cache warming
    async fetchMultipleUsers(userIds) {
        const results = [];
        const uncachedIds = [];
        
        // Check cache for all users first
        for (const id of userIds) {
            const cached = this.cache.get("user:" + id);
            if (cached) {
                results[userIds.indexOf(id)] = cached;
            } else {
                uncachedIds.push(id);
            }
        }
        
        // Batch fetch uncached users
        if (uncachedIds.length > 0) {
            const batchPromises = uncachedIds.map(id => this.fetchUserData(id));
            const batchResults = await Promise.all(batchPromises);
            
            // Fill in results
            batchResults.forEach((user, index) => {
                const originalIndex = userIds.indexOf(uncachedIds[index]);
                results[originalIndex] = user;
            });
        }
        
        return results;
    }
    
    // Intelligent cache invalidation
    updateUser(userId, updates) {
        const cacheKey = "user:" + userId;
        
        // Invalidate cache
        this.cache.delete(cacheKey);
        
        // Optionally warm cache with updated data
        if (updates.warmCache) {
            this.fetchUserData(userId, { forceRefresh: true });
        }
        
        console.log("Updated user " + userId, updates);
    }
    
    // Cache warming for frequently accessed data
    async warmCache(userIds) {
        const warmingPromises = userIds.map(id => 
            this.fetchUserData(id, { forceRefresh: true })
        );
        
        await Promise.all(warmingPromises);
        console.log("Warmed cache for " + userIds.length + " users");
    }
    
    // Preload related data
    async preloadUserNetwork(userId) {
        const user = await this.fetchUserData(userId);
        
        // Simulate fetching user''s friends/connections
        const friendIds = Array.from({length: 5}, (_, i) => userId + i + 1);
        await this.fetchMultipleUsers(friendIds);
        
        return user;
    }
    
    getStats() {
        return {
            requestCount: this.requestCount,
            cacheStats: this.cache.getStats(),
            pendingRequests: this.batchRequests.size
        };
    }
    
    // Cleanup method
    destroy() {
        this.cache.clear();
        this.batchRequests.clear();
    }
}

// Demonstration of optimized caching
async function demonstrateOptimizedCaching() {
    const dataService = new OptimizedDataService();
    
    console.log("=== Cache Warming ===");
    await dataService.warmCache([1, 2, 3, 4, 5]);
    
    console.log("=== Cached Access (should be fast) ===");
    const start = performance.now();
    await dataService.fetchUserData(1); // From cache
    await dataService.fetchUserData(2); // From cache
    await dataService.fetchUserData(3); // From cache
    const cachedTime = performance.now() - start;
    
    console.log("=== Batch Processing ===");
    const userIds = Array.from({length: 20}, (_, i) => i + 1);
    await dataService.fetchMultipleUsers(userIds);
    
    console.log("=== Cache Invalidation ===");
    dataService.updateUser(1, { name: "Updated User 1", warmCache: true });
    
    const stats = dataService.getStats();
    console.log("Final Stats:", stats);
    console.log("Cache Hit Ratio: " + (stats.cacheStats.hitRatio * 100).toFixed(2) + "%");
    console.log("Cached access time: " + cachedTime.toFixed(2) + "ms");
    
    dataService.destroy();
}

// Export for testing
if (typeof module !== "undefined") {
    module.exports = { 
        LRUCache, 
        TTLCache, 
        MultiLevelCache, 
        OptimizedDataService 
    };
}

demonstrateOptimizedCaching();',
        '[
            {
                "input": "lru_cache_test",
                "expected_output": "lru_eviction_working",
                "description": "LRU cache should evict least recently used items"
            },
            {
                "input": "ttl_cache_test", 
                "expected_output": "ttl_expiration_working",
                "description": "TTL cache should expire items after specified time"
            },
            {
                "input": "multi_level_test",
                "expected_output": "cache_hierarchy_working",
                "description": "Multi-level cache should promote items from L2 to L1"
            },
            {
                "input": "batch_optimization_test",
                "expected_output": "batch_requests_optimized",
                "description": "Batch requests should be deduplicated and optimized"
            }
        ]',
        path_id,
        3
    );

    -- Hard Level: Database Query Optimization
    INSERT INTO challenges (title, description, difficulty, challenge_type, initial_code, solution_code, test_cases, path_id, order_index) VALUES 
    (
        'Database Query Optimization',
        '# Database Performance Optimization & Query Tuning

## Learning Objectives
- Analyze and optimize SQL query performance
- Design efficient database indexes
- Implement query optimization strategies
- Handle N+1 query problems and batch operations

## Core Concepts to Master
- Query execution plans and analysis
- Index design and optimization (B-tree, Hash, Composite)
- Query optimization techniques (JOINs, subqueries, CTEs)
- Database normalization vs denormalization trade-offs
- Connection pooling and transaction management
- Caching strategies at database level

## Your Task
Optimize this e-commerce database system:

1. **Fix N+1 query problems** in product listings
2. **Design optimal indexes** for common queries
3. **Optimize complex queries** with proper JOINs
4. **Implement efficient pagination** and sorting
5. **Add query result caching** and invalidation

## Database Optimization Techniques
- **Index Optimization**: Composite indexes, covering indexes
- **Query Rewriting**: Subquery to JOIN conversion
- **Batch Operations**: Bulk inserts/updates
- **Partitioning**: Table and index partitioning
- **Materialized Views**: Pre-computed aggregations

## Performance Metrics to Track
- Query execution time (target: <100ms for simple queries)
- Index usage and efficiency
- Database connection pool utilization
- Cache hit ratios
- Lock contention and deadlocks

## Tools for Database Optimization
- EXPLAIN/EXPLAIN ANALYZE for query plans
- Database profilers (pg_stat_statements, MySQL slow query log)
- Index usage analyzers
- Connection pool monitors
- Query result caching (Redis, Memcached)

## Industry Best Practices
- Always use EXPLAIN to analyze queries
- Create indexes based on actual query patterns
- Monitor slow query logs regularly
- Use connection pooling in production
- Implement proper transaction boundaries',
        'hard',
        'coding',
        '// Database Query Optimization Challenge
// Fix performance issues in this e-commerce system

class DatabaseService {
    constructor() {
        // Simulated database connection (no pooling)
        this.db = new MockDatabase();
        this.queryCount = 0;
    }
    
    // N+1 Query Problem: Fetching products with categories
    async getProductsWithCategories(limit = 10) {
        this.queryCount++;
        
        // First query: Get products
        const products = await this.db.query("SELECT id, name, price, category_id FROM products LIMIT " + limit);
        
        // N queries: Get category for each product (N+1 problem!)
        for (const product of products) {
            this.queryCount++;
            const category = await this.db.query("SELECT name FROM categories WHERE id = " + product.category_id);
            product.category = category[0];
        }
        
        return products;
    }
    
    // Inefficient pagination (OFFSET gets slower with large offsets)
    async getProductsPaginated(page = 1, pageSize = 20) {
        this.queryCount++;
        const offset = (page - 1) * pageSize;
        
        return await this.db.query("SELECT * FROM products ORDER BY created_at DESC OFFSET " + offset + " LIMIT " + pageSize);
    }
    
    // Inefficient search without proper indexing
    async searchProducts(searchTerm) {
        this.queryCount++;
        
        // This will do a full table scan
        return await this.db.query("SELECT * FROM products WHERE name LIKE ''%" + searchTerm + "%'' OR description LIKE ''%" + searchTerm + "%'' ORDER BY name");
    }
    
    // Inefficient aggregation query
    async getOrderStatistics(userId) {
        this.queryCount++;
        
        // Multiple separate queries instead of one optimized query
        const totalOrders = await this.db.query("SELECT COUNT(*) as count FROM orders WHERE user_id = " + userId);
        
        this.queryCount++;
        const totalSpent = await this.db.query("SELECT SUM(total_amount) as total FROM orders WHERE user_id = " + userId);
        
        this.queryCount++;
        const avgOrderValue = await this.db.query("SELECT AVG(total_amount) as avg FROM orders WHERE user_id = " + userId);
        
        return {
            totalOrders: totalOrders[0].count,
            totalSpent: totalSpent[0].total,
            avgOrderValue: avgOrderValue[0].avg
        };
    }
    
    // No caching or connection pooling
    async getPopularProducts() {
        this.queryCount++;
        
        // Complex query without optimization
        return await this.db.query("SELECT p.*, COUNT(oi.product_id) as order_count FROM products p LEFT JOIN order_items oi ON p.id = oi.product_id LEFT JOIN orders o ON oi.order_id = o.id WHERE o.created_at > NOW() - INTERVAL 30 DAY GROUP BY p.id ORDER BY order_count DESC LIMIT 10");
    }
    
    getQueryCount() {
        return this.queryCount;
    }
}

// Mock database for demonstration
class MockDatabase {
    async query(sql) {
        // Simulate database delay
        await new Promise(resolve => setTimeout(resolve, 10));
        
        // Return mock data based on query
        if (sql.includes("FROM products")) {
            return Array.from({length: 10}, (_, i) => ({
                id: i + 1,
                name: "Product " + (i + 1),
                price: (i + 1) * 10,
                category_id: (i % 3) + 1,
                created_at: new Date()
            }));
        } else if (sql.includes("FROM categories")) {
            return [{ name: "Electronics" }];
        } else if (sql.includes("COUNT(*)")) {
            return [{ count: 25 }];
        } else if (sql.includes("SUM(")) {
            return [{ total: 1250.50 }];
        } else if (sql.includes("AVG(")) {
            return [{ avg: 50.02 }];
        }
        
        return [];
    }
}

// Demonstrate poor performance
async function demonstratePoorPerformance() {
    const dbService = new DatabaseService();
    
    console.log("=== N+1 Query Problem ===");
    const start = performance.now();
    await dbService.getProductsWithCategories(5);
    const time = performance.now() - start;
    
    console.log("Query count: " + dbService.getQueryCount());
    console.log("Time taken: " + time.toFixed(2) + "ms");
    
    await dbService.searchProducts("laptop");
    await dbService.getOrderStatistics(123);
    
    console.log("Total queries: " + dbService.getQueryCount());
}

demonstratePoorPerformance();',
        '// Optimized Database Service with Performance Improvements
class OptimizedDatabaseService {
    constructor() {
        this.db = new OptimizedMockDatabase();
        this.connectionPool = new ConnectionPool();
        this.queryCache = new Map();
        this.queryCount = 0;
        this.cacheHits = 0;
    }
    
    // Fixed: Use JOIN to eliminate N+1 problem
    async getProductsWithCategories(limit = 10) {
        const cacheKey = "products_with_categories_" + limit;
        
        // Check cache first
        if (this.queryCache.has(cacheKey)) {
            this.cacheHits++;
            return this.queryCache.get(cacheKey);
        }
        
        this.queryCount++;
        
        // Single optimized query with JOIN
        const products = await this.db.query("SELECT p.id, p.name, p.price, p.category_id, c.name as category_name FROM products p INNER JOIN categories c ON p.category_id = c.id ORDER BY p.created_at DESC LIMIT " + limit);
        
        // Transform data to expected format
        const result = products.map(row => ({
            id: row.id,
            name: row.name,
            price: row.price,
            category_id: row.category_id,
            category: { name: row.category_name }
        }));
        
        // Cache result for 5 minutes
        this.queryCache.set(cacheKey, result);
        setTimeout(() => this.queryCache.delete(cacheKey), 300000);
        
        return result;
    }
    
    // Optimized: Cursor-based pagination for better performance
    async getProductsPaginated(cursor = null, pageSize = 20) {
        this.queryCount++;
        
        let query;
        
        if (cursor) {
            // Cursor-based pagination (much faster for large datasets)
            query = "SELECT id, name, price, created_at FROM products WHERE created_at < ''" + cursor + "'' ORDER BY created_at DESC LIMIT " + pageSize;
        } else {
            // First page
            query = "SELECT id, name, price, created_at FROM products ORDER BY created_at DESC LIMIT " + pageSize;
        }
        
        const products = await this.db.query(query);
        
        return {
            products,
            nextCursor: products.length > 0 ? products[products.length - 1].created_at : null,
            hasMore: products.length === pageSize
        };
    }
    
    // Optimized: Full-text search with proper indexing
    async searchProducts(searchTerm) {
        const cacheKey = "search_" + searchTerm;
        
        if (this.queryCache.has(cacheKey)) {
            this.cacheHits++;
            return this.queryCache.get(cacheKey);
        }
        
        this.queryCount++;
        
        // Use full-text search with proper indexing
        const results = await this.db.query("SELECT id, name, description, price, ts_rank(search_vector, plainto_tsquery(''" + searchTerm + "'')) as rank FROM products WHERE search_vector @@ plainto_tsquery(''" + searchTerm + "'') ORDER BY rank DESC, name ASC LIMIT 50");
        
        // Cache search results for 10 minutes
        this.queryCache.set(cacheKey, results);
        setTimeout(() => this.queryCache.delete(cacheKey), 600000);
        
        return results;
    }
    
    // Optimized: Single query for all statistics
    async getOrderStatistics(userId) {
        const cacheKey = "order_stats_" + userId;
        
        if (this.queryCache.has(cacheKey)) {
            this.cacheHits++;
            return this.queryCache.get(cacheKey);
        }
        
        this.queryCount++;
        
        // Single optimized query for all statistics
        const stats = await this.db.query("SELECT COUNT(*) as total_orders, COALESCE(SUM(total_amount), 0) as total_spent, COALESCE(AVG(total_amount), 0) as avg_order_value, MAX(created_at) as last_order_date FROM orders WHERE user_id = " + userId);
        
        const result = {
            totalOrders: parseInt(stats[0].total_orders),
            totalSpent: parseFloat(stats[0].total_spent),
            avgOrderValue: parseFloat(stats[0].avg_order_value),
            lastOrderDate: stats[0].last_order_date
        };
        
        // Cache for 1 hour
        this.queryCache.set(cacheKey, result);
        setTimeout(() => this.queryCache.delete(cacheKey), 3600000);
        
        return result;
    }
    
    // Optimized: Use materialized view or optimized query with proper indexes
    async getPopularProducts() {
        const cacheKey = "popular_products";
        
        if (this.queryCache.has(cacheKey)) {
            this.cacheHits++;
            return this.queryCache.get(cacheKey);
        }
        
        this.queryCount++;
        
        // Optimized query with proper indexing and potentially materialized view
        const products = await this.db.query("SELECT p.id, p.name, p.price, p.image_url, COALESCE(pop.order_count, 0) as order_count, COALESCE(pop.revenue, 0) as revenue FROM products p LEFT JOIN (SELECT oi.product_id, COUNT(*) as order_count, SUM(oi.quantity * oi.price) as revenue FROM order_items oi INNER JOIN orders o ON oi.order_id = o.id WHERE o.created_at > CURRENT_DATE - INTERVAL ''30 days'' AND o.status = ''completed'' GROUP BY oi.product_id) pop ON p.id = pop.product_id WHERE p.is_active = true ORDER BY pop.order_count DESC NULLS LAST, p.name ASC LIMIT 10");
        
        // Cache for 1 hour (popular products don''t change frequently)
        this.queryCache.set(cacheKey, products);
        setTimeout(() => this.queryCache.delete(cacheKey), 3600000);
        
        return products;
    }
    
    // Batch operations for better performance
    async createProductsBatch(products) {
        this.queryCount++;
        
        // Use batch insert with proper parameterization
        const valuesClauses = [];
        
        products.forEach((product, index) => {
            valuesClauses.push("(''" + product.name + "'', ''" + product.description + "'', " + product.price + ", " + product.category_id + ")");
        });
        
        const query = "INSERT INTO products (name, description, price, category_id) VALUES " + valuesClauses.join(", ") + " RETURNING id, name";
        
        const result = await this.db.query(query);
        
        // Invalidate related caches
        this.invalidateProductCaches();
        
        return result;
    }
    
    // Efficient bulk update
    async updateProductPricesBatch(priceUpdates) {
        this.queryCount++;
        
        // Use CASE statement for bulk updates
        const caseStatements = [];
        const ids = [];
        
        priceUpdates.forEach((update) => {
            caseStatements.push("WHEN id = " + update.id + " THEN " + update.price);
            ids.push(update.id);
        });
        
        const query = "UPDATE products SET price = CASE " + caseStatements.join(" ") + " END, updated_at = CURRENT_TIMESTAMP WHERE id IN (" + ids.join(", ") + ")";
        
        const result = await this.db.query(query);
        
        // Invalidate related caches
        this.invalidateProductCaches();
        
        return result;
    }
    
    // Cache invalidation strategy
    invalidateProductCaches() {
        const keysToDelete = [];
        for (const key of this.queryCache.keys()) {
            if (key.includes("products") || key.includes("popular")) {
                keysToDelete.push(key);
            }
        }
        keysToDelete.forEach(key => this.queryCache.delete(key));
    }
    
    // Connection pool management
    async executeWithConnection(callback) {
        const connection = await this.connectionPool.acquire();
        try {
            return await callback(connection);
        } finally {
            this.connectionPool.release(connection);
        }
    }
    
    // Performance monitoring
    getPerformanceStats() {
        return {
            queryCount: this.queryCount,
            cacheHits: this.cacheHits,
            cacheSize: this.queryCache.size,
            hitRatio: this.queryCount > 0 ? this.cacheHits / (this.queryCount + this.cacheHits) : 0,
            connectionPoolStats: this.connectionPool.getStats()
        };
    }
    
    // Cleanup
    destroy() {
        this.queryCache.clear();
        this.connectionPool.destroy();
    }
}

// Optimized mock database with better simulation
class OptimizedMockDatabase {
    async query(sql) {
        // Simulate realistic database delay based on query complexity
        const delay = sql.includes("JOIN") ? 15 : 5;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Return more realistic mock data
        if (sql.includes("FROM products p") && sql.includes("JOIN categories")) {
            return Array.from({length: 10}, (_, i) => ({
                id: i + 1,
                name: "Product " + (i + 1),
                price: (i + 1) * 10,
                category_id: (i % 3) + 1,
                category_name: ["Electronics", "Clothing", "Books"][i % 3]
            }));
        }
        
        // Handle other query types...
        return this.generateMockData(sql);
    }
    
    generateMockData(sql) {
        // Generate appropriate mock data based on SQL
        if (sql.includes("COUNT(*) as total_orders")) {
            return [{
                total_orders: 25,
                total_spent: 1250.50,
                avg_order_value: 50.02,
                last_order_date: new Date()
            }];
        }
        
        return [];
    }
}

// Connection pool implementation
class ConnectionPool {
    constructor(maxConnections = 10) {
        this.maxConnections = maxConnections;
        this.activeConnections = 0;
        this.waitingQueue = [];
        this.stats = {
            acquired: 0,
            released: 0,
            waitTime: 0
        };
    }
    
    async acquire() {
        this.stats.acquired++;
        
        if (this.activeConnections < this.maxConnections) {
            this.activeConnections++;
            return { id: this.activeConnections };
        }
        
        // Wait for available connection
        const startWait = Date.now();
        return new Promise(resolve => {
            this.waitingQueue.push(() => {
                this.stats.waitTime += Date.now() - startWait;
                this.activeConnections++;
                resolve({ id: this.activeConnections });
            });
        });
    }
    
    release(connection) {
        this.stats.released++;
        this.activeConnections--;
        
        if (this.waitingQueue.length > 0) {
            const next = this.waitingQueue.shift();
            next();
        }
    }
    
    getStats() {
        return {
            ...this.stats,
            activeConnections: this.activeConnections,
            queueLength: this.waitingQueue.length,
            avgWaitTime: this.stats.acquired > 0 ? this.stats.waitTime / this.stats.acquired : 0
        };
    }
    
    destroy() {
        this.waitingQueue.length = 0;
        this.activeConnections = 0;
    }
}

// Demonstrate optimized performance
async function demonstrateOptimizedPerformance() {
    const dbService = new OptimizedDatabaseService();
    
    console.log("=== Optimized Queries ===");
    const start = performance.now();
    
    // This should use only 1 query instead of N+1
    await dbService.getProductsWithCategories(5);
    
    // This should hit cache on second call
    await dbService.getProductsWithCategories(5);
    
    const time = performance.now() - start;
    
    // Test other optimized methods
    await dbService.searchProducts("laptop");
    await dbService.getOrderStatistics(123);
    await dbService.getPopularProducts();
    
    const stats = dbService.getPerformanceStats();
    console.log("Performance Stats:", stats);
    console.log("Cache Hit Ratio: " + (stats.hitRatio * 100).toFixed(2) + "%");
    console.log("Time taken: " + time.toFixed(2) + "ms");
    
    dbService.destroy();
}

// Export for testing
if (typeof module !== "undefined") {
    module.exports = { 
        OptimizedDatabaseService, 
        ConnectionPool,
        OptimizedMockDatabase 
    };
}

demonstrateOptimizedPerformance();',
        '[
            {
                "input": "n_plus_one_test",
                "expected_output": "single_query_used",
                "description": "Should use JOIN instead of N+1 queries"
            },
            {
                "input": "pagination_test",
                "expected_output": "cursor_based_pagination",
                "description": "Should use cursor-based pagination for better performance"
            },
            {
                "input": "search_optimization_test",
                "expected_output": "full_text_search_used",
                "description": "Should use full-text search with proper indexing"
            },
            {
                "input": "cache_efficiency_test",
                "expected_output": "high_cache_hit_ratio",
                "description": "Should achieve high cache hit ratio for repeated queries"
            }
        ]',
        path_id,
        4
    );

    -- Hard Level: Frontend Performance Tuning
    INSERT INTO challenges (title, description, difficulty, challenge_type, initial_code, solution_code, test_cases, path_id, order_index) VALUES 
    (
        'Frontend Performance Tuning',
        '# Frontend Performance Optimization & Web Vitals

## Learning Objectives
- Optimize Core Web Vitals (LCP, FID, CLS)
- Implement efficient rendering strategies
- Master bundle optimization and code splitting
- Design performance-conscious React applications

## Core Concepts to Master
- **Core Web Vitals**: LCP, FID, CLS optimization
- **Rendering Performance**: Virtual DOM optimization, React.memo, useMemo
- **Bundle Optimization**: Code splitting, tree shaking, lazy loading
- **Network Performance**: Resource hints, service workers, CDN strategies
- **Memory Management**: Component cleanup, event listener management

## Your Task
Optimize this React e-commerce application:

1. **Fix rendering performance** issues with large lists
2. **Implement code splitting** and lazy loading
3. **Optimize bundle size** and loading strategies
4. **Improve Core Web Vitals** scores
5. **Add performance monitoring** and metrics

## Frontend Optimization Techniques
- **React Performance**: memo, useMemo, useCallback, lazy loading
- **Bundle Optimization**: Webpack/Vite optimization, tree shaking
- **Image Optimization**: WebP, lazy loading, responsive images
- **CSS Optimization**: Critical CSS, CSS-in-JS optimization
- **JavaScript Optimization**: Code splitting, preloading

## Performance Metrics to Track
- **Core Web Vitals**: LCP (<2.5s), FID (<100ms), CLS (<0.1)
- **Bundle Size**: JavaScript bundle size, CSS size
- **Loading Performance**: TTFB, FCP, TTI
- **Runtime Performance**: Frame rate, memory usage

## Tools for Frontend Optimization
- Chrome DevTools Performance tab
- Lighthouse for Core Web Vitals
- Bundle analyzers (webpack-bundle-analyzer)
- React DevTools Profiler
- Web Vitals library for monitoring

## Industry Best Practices
- Measure performance continuously
- Optimize for mobile-first
- Use performance budgets
- Implement progressive loading
- Monitor real user metrics (RUM)',
        'hard',
        'coding',
        '// Frontend Performance Challenge: Optimize React Application
import React, { useState, useEffect } from "react";

// Unoptimized Product List Component
const ProductList = ({ products, onProductClick }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");
    
    // Performance Issue: No memoization, filters on every render
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Performance Issue: Expensive sorting on every render
    const sortedProducts = filteredProducts.sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "price") return a.price - b.price;
        return 0;
    });
    
    return (
        <div className="product-list">
            <div className="filters">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="name">Sort by Name</option>
                    <option value="price">Sort by Price</option>
                </select>
            </div>
            
            {/* Performance Issue: Rendering all items at once */}
            <div className="products">
                {sortedProducts.map(product => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        onClick={onProductClick}
                    />
                ))}
            </div>
        </div>
    );
};

// Unoptimized Product Card Component
const ProductCard = ({ product, onClick }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    
    // Performance Issue: No memoization, recreates on every render
    const handleClick = () => {
        onClick(product);
    };
    
    // Performance Issue: Expensive calculation on every render
    const discountPercentage = Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
    );
    
    return (
        <div className="product-card" onClick={handleClick}>
            {/* Performance Issue: No lazy loading for images */}
            <img 
                src={product.imageUrl} 
                alt={product.name}
                onLoad={() => setImageLoaded(true)}
                style={{ opacity: imageLoaded ? 1 : 0.5 }}
            />
            <h3>{product.name}</h3>
            <p className="price">${product.price}</p>
            {discountPercentage > 0 && (
                <span className="discount">{discountPercentage}% off</span>
            )}
            <div className="rating">
                {/* Performance Issue: Creating stars array on every render */}
                {Array.from({length: 5}, (_, i) => (
                    <span key={i} className={i < product.rating ? "star filled" : "star"}>
                        ★
                    </span>
                ))}
            </div>
        </div>
    );
};

// Unoptimized Main App Component
const App = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Performance Issue: No cleanup, potential memory leaks
    useEffect(() => {
        fetchProducts();
        
        // Performance Issue: Event listener not cleaned up
        window.addEventListener("scroll", handleScroll);
        
        // Performance Issue: Timer not cleaned up
        const timer = setInterval(() => {
            console.log("App is running...");
        }, 5000);
    }, []);
    
    const handleScroll = () => {
        // Performance Issue: Expensive operation on scroll
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        if (scrollPosition + windowHeight >= documentHeight - 100) {
            loadMoreProducts();
        }
    };
    
    const fetchProducts = async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Performance Issue: Loading all products at once
            const mockProducts = Array.from({length: 1000}, (_, i) => ({
                id: i + 1,
                name: "Product " + (i + 1),
                price: Math.round(Math.random() * 100 + 10),
                originalPrice: Math.round(Math.random() * 150 + 50),
                imageUrl: "https://picsum.photos/200/200?random=" + i,
                rating: Math.floor(Math.random() * 5) + 1,
                category: ["Electronics", "Clothing", "Books"][i % 3]
            }));
            
            setProducts(mockProducts);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            setLoading(false);
        }
    };
    
    const loadMoreProducts = () => {
        // Performance Issue: No debouncing
        console.log("Loading more products...");
    };
    
    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };
    
    if (loading) {
        return <div className="loading">Loading products...</div>;
    }
    
    return (
        <div className="app">
            <header>
                <h1>E-Commerce Store</h1>
            </header>
            
            <main>
                <ProductList 
                    products={products} 
                    onProductClick={handleProductClick}
                />
                
                {selectedProduct && (
                    <div className="product-modal">
                        <h2>{selectedProduct.name}</h2>
                        <p>Price: ${selectedProduct.price}</p>
                        <button onClick={() => setSelectedProduct(null)}>
                            Close
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;',
        '// Optimized Frontend Performance Solution
import React, { 
    useState, 
    useEffect, 
    useMemo, 
    useCallback, 
    memo,
    lazy,
    Suspense 
} from "react";
import { FixedSizeList as List } from "react-window";

// Lazy load heavy components
const ProductModal = lazy(() => import("./ProductModal"));

// Optimized Product List with virtualization and memoization
const ProductList = memo(({ products, onProductClick }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");
    
    // Memoized filtering and sorting
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = products;
        
        // Optimize search with debouncing (implemented in parent)
        if (searchTerm) {
            filtered = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Memoized sorting
        return filtered.sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "price") return a.price - b.price;
            return 0;
        });
    }, [products, searchTerm, sortBy]);
    
    // Memoized search handler with debouncing
    const debouncedSetSearchTerm = useCallback(
        debounce((term) => setSearchTerm(term), 300),
        []
    );
    
    const handleSearchChange = useCallback((e) => {
        debouncedSetSearchTerm(e.target.value);
    }, [debouncedSetSearchTerm]);
    
    const handleSortChange = useCallback((e) => {
        setSortBy(e.target.value);
    }, []);
    
    // Virtualized list item renderer
    const renderItem = useCallback(({ index, style }) => (
        <div style={style}>
            <ProductCard 
                product={filteredAndSortedProducts[index]} 
                onClick={onProductClick}
            />
        </div>
    ), [filteredAndSortedProducts, onProductClick]);
    
    return (
        <div className="product-list">
            <div className="filters">
                <input
                    type="text"
                    placeholder="Search products..."
                    onChange={handleSearchChange}
                />
                <select value={sortBy} onChange={handleSortChange}>
                    <option value="name">Sort by Name</option>
                    <option value="price">Sort by Price</option>
                </select>
            </div>
            
            {/* Virtualized list for performance */}
            <List
                height={600}
                itemCount={filteredAndSortedProducts.length}
                itemSize={200}
                itemData={filteredAndSortedProducts}
            >
                {renderItem}
            </List>
        </div>
    );
});

// Optimized Product Card with memoization and lazy loading
const ProductCard = memo(({ product, onClick }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageInView, setImageInView] = useState(false);
    
    // Memoized click handler
    const handleClick = useCallback(() => {
        onClick(product);
    }, [product, onClick]);
    
    // Memoized discount calculation
    const discountPercentage = useMemo(() => {
        if (!product.originalPrice || product.originalPrice <= product.price) {
            return 0;
        }
        return Math.round(
            ((product.originalPrice - product.price) / product.originalPrice) * 100
        );
    }, [product.originalPrice, product.price]);
    
    // Memoized star rating
    const starRating = useMemo(() => {
        return Array.from({length: 5}, (_, i) => (
            <span key={i} className={i < product.rating ? "star filled" : "star"}>
                ★
            </span>
        ));
    }, [product.rating]);
    
    // Intersection Observer for lazy loading
    const imageRef = useCallback(node => {
        if (node) {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setImageInView(true);
                        observer.disconnect();
                    }
                },
                { threshold: 0.1 }
            );
            observer.observe(node);
        }
    }, []);
    
    return (
        <div className="product-card" onClick={handleClick}>
            <div ref={imageRef} className="image-container">
                {imageInView && (
                    <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        style={{ opacity: imageLoaded ? 1 : 0.5 }}
                    />
                )}
            </div>
            <h3>{product.name}</h3>
            <p className="price">${product.price}</p>
            {discountPercentage > 0 && (
                <span className="discount">{discountPercentage}% off</span>
            )}
            <div className="rating">
                {starRating}
            </div>
        </div>
    );
});

// Performance monitoring hook
const usePerformanceMonitoring = () => {
    useEffect(() => {
        // Monitor Core Web Vitals
        if (typeof window !== "undefined" && "web-vitals" in window) {
            import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                getCLS(console.log);
                getFID(console.log);
                getFCP(console.log);
                getLCP(console.log);
                getTTFB(console.log);
            });
        }
        
        // Monitor memory usage
        const memoryMonitor = setInterval(() => {
            if (performance.memory) {
                const memoryInfo = {
                    usedJSHeapSize: performance.memory.usedJSHeapSize,
                    totalJSHeapSize: performance.memory.totalJSHeapSize,
                    jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
                };
                console.log("Memory usage:", memoryInfo);
            }
        }, 30000);
        
        return () => clearInterval(memoryMonitor);
    }, []);
};

// Optimized Main App Component
const App = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    
    // Performance monitoring
    usePerformanceMonitoring();
    
    // Memoized scroll handler with throttling
    const throttledScrollHandler = useMemo(
        () => throttle(() => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            if (scrollPosition + windowHeight >= documentHeight - 100) {
                loadMoreProducts();
            }
        }, 100),
        []
    );
    
    useEffect(() => {
        fetchProducts();
        
        // Optimized scroll listener with cleanup
        window.addEventListener("scroll", throttledScrollHandler, { passive: true });
        
        return () => {
            window.removeEventListener("scroll", throttledScrollHandler);
        };
    }, [throttledScrollHandler]);
    
    const fetchProducts = useCallback(async () => {
        try {
            // Simulate API call with pagination
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const batchSize = 50; // Load in smaller batches
            const mockProducts = Array.from({length: batchSize}, (_, i) => {
                const id = (page - 1) * batchSize + i + 1;
                return {
                    id,
                    name: "Product " + id,
                    price: Math.round(Math.random() * 100 + 10),
                    originalPrice: Math.round(Math.random() * 150 + 50),
                    imageUrl: "https://picsum.photos/200/200?random=" + id,
                    rating: Math.floor(Math.random() * 5) + 1,
                    category: ["Electronics", "Clothing", "Books"][id % 3]
                };
            });
            
            setProducts(prev => page === 1 ? mockProducts : [...prev, ...mockProducts]);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            setLoading(false);
        }
    }, [page]);
    
    const loadMoreProducts = useCallback(() => {
        if (!loading) {
            setPage(prev => prev + 1);
        }
    }, [loading]);
    
    const handleProductClick = useCallback((product) => {
        setSelectedProduct(product);
    }, []);
    
    const handleCloseModal = useCallback(() => {
        setSelectedProduct(null);
    }, []);
    
    if (loading && products.length === 0) {
        return (
            <div className="loading">
                <div className="spinner" />
                Loading products...
            </div>
        );
    }
    
    return (
        <div className="app">
            <header>
                <h1>E-Commerce Store</h1>
            </header>
            
            <main>
                <ProductList 
                    products={products} 
                    onProductClick={handleProductClick}
                />
                
                {selectedProduct && (
                    <Suspense fallback={<div>Loading modal...</div>}>
                        <ProductModal 
                            product={selectedProduct}
                            onClose={handleCloseModal}
                        />
                    </Suspense>
                )}
            </main>
        </div>
    );
};

// Utility functions for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance budget monitoring
if (process.env.NODE_ENV === "development") {
    // Monitor bundle size
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === "navigation") {
                console.log("Navigation timing:", entry);
            }
        }
    });
    observer.observe({ entryTypes: ["navigation"] });
}

export default App;',
        '[
            {
                "input": "large_list_rendering",
                "expected_output": "virtualized_list_used",
                "description": "Should use virtualization for large lists"
            },
            {
                "input": "image_lazy_loading",
                "expected_output": "intersection_observer_used",
                "description": "Should implement lazy loading with Intersection Observer"
            },
            {
                "input": "memoization_test",
                "expected_output": "react_memo_used",
                "description": "Should use React.memo and useMemo for optimization"
            },
            {
                "input": "core_web_vitals",
                "expected_output": "vitals_optimized",
                "description": "Should optimize Core Web Vitals metrics"
            }
        ]',
        path_id,
        5
    );

    -- Hard Level: Distributed System Performance
    INSERT INTO challenges (title, description, difficulty, challenge_type, initial_code, solution_code, test_cases, path_id, order_index) VALUES 
    (
        'Distributed System Performance',
        '# Distributed System Performance & Scalability

## Learning Objectives
- Design high-performance distributed architectures
- Implement load balancing and auto-scaling strategies
- Optimize inter-service communication and data consistency
- Handle performance at scale with monitoring and observability

## Core Concepts to Master
- **Load Balancing**: Round-robin, weighted, least connections
- **Auto-scaling**: Horizontal and vertical scaling strategies
- **Service Communication**: gRPC, message queues, event streaming
- **Data Consistency**: CAP theorem, eventual consistency, CQRS
- **Observability**: Distributed tracing, metrics, logging

## Your Task
Build a high-performance distributed system:

1. **Design load balancing** strategies for multiple services
2. **Implement auto-scaling** based on metrics
3. **Optimize service communication** with caching and batching
4. **Add distributed tracing** and performance monitoring
5. **Handle data consistency** across services

## Distributed Performance Patterns
- **Circuit Breaker**: Prevent cascade failures
- **Bulkhead**: Isolate critical resources
- **Timeout and Retry**: Handle network failures gracefully
- **Rate Limiting**: Protect services from overload
- **Caching**: Multi-level caching strategies

## Performance Metrics for Distributed Systems
- **Latency**: P50, P95, P99 response times
- **Throughput**: Requests per second, messages per second
- **Availability**: Uptime, error rates
- **Resource Utilization**: CPU, memory, network
- **Service Dependencies**: Dependency health, cascade failures

## Tools for Distributed Performance
- **Load Balancers**: HAProxy, NGINX, AWS ALB
- **Service Mesh**: Istio, Linkerd for traffic management
- **Monitoring**: Prometheus, Grafana, Jaeger
- **Auto-scaling**: Kubernetes HPA, AWS Auto Scaling
- **Message Queues**: Apache Kafka, RabbitMQ, Redis

## Industry Best Practices
- Design for failure and graceful degradation
- Implement comprehensive monitoring and alerting
- Use performance testing at scale
- Plan capacity based on growth projections
- Implement chaos engineering practices',
        'hard',
        'system_design',
        '// Distributed System Performance Challenge
// Design a high-performance microservices architecture

/*
SCENARIO: E-commerce Platform at Scale

Requirements:
- Handle 100,000+ concurrent users
- Process 10,000+ orders per minute
- 99.9% uptime requirement
- Global distribution across 3 regions
- Real-time inventory updates
- Sub-200ms API response times

Current Issues:
1. Single points of failure
2. No load balancing strategy
3. Synchronous service communication causing bottlenecks
4. No auto-scaling capabilities
5. Poor observability and monitoring
6. Data consistency issues across services

Services to Design:
- API Gateway
- User Service
- Product Service  
- Order Service
- Payment Service
- Inventory Service
- Notification Service

Your Task:
Design the architecture addressing:
1. Load balancing and traffic distribution
2. Service communication optimization
3. Auto-scaling strategies
4. Data consistency patterns
5. Performance monitoring and observability
6. Failure handling and circuit breakers

Use the drawing canvas to create your distributed system architecture.
Consider:
- Service placement and communication patterns
- Load balancers and API gateways
- Databases and caching layers
- Message queues and event streaming
- Monitoring and observability components
- Auto-scaling groups and health checks
*/

console.log("Design a high-performance distributed system architecture");
console.log("Focus on scalability, reliability, and performance optimization");',
        '// High-Performance Distributed System Architecture

/*
OPTIMIZED ARCHITECTURE SOLUTION:

1. TRAFFIC MANAGEMENT LAYER:
   - Global Load Balancer (AWS Route 53 / CloudFlare)
   - Regional API Gateways (Kong / AWS API Gateway)
   - Rate limiting and DDoS protection
   - SSL termination and compression

2. SERVICE MESH LAYER:
   - Istio/Linkerd for service-to-service communication
   - Circuit breakers and retry policies
   - Distributed tracing and metrics
   - mTLS for security

3. MICROSERVICES ARCHITECTURE:
   
   API Gateway Cluster:
   - Multiple instances behind load balancer
   - Request routing and aggregation
   - Authentication and authorization
   - Request/response transformation
   
   Core Services (Auto-scaled):
   - User Service: User management and profiles
   - Product Service: Catalog and search
   - Order Service: Order processing and workflow
   - Payment Service: Payment processing
   - Inventory Service: Stock management
   - Notification Service: Email/SMS/Push notifications
   
4. DATA LAYER OPTIMIZATION:
   
   Database Strategy:
   - Read replicas for read-heavy operations
   - Database sharding for horizontal scaling
   - CQRS pattern for command/query separation
   - Event sourcing for audit trails
   
   Caching Strategy:
   - CDN for static content (CloudFront/CloudFlare)
   - Application cache (Redis Cluster)
   - Database query cache
   - Session cache for user data
   
5. COMMUNICATION PATTERNS:
   
   Synchronous:
   - gRPC for internal service communication
   - HTTP/2 for external APIs
   - Connection pooling and keep-alive
   
   Asynchronous:
   - Apache Kafka for event streaming
   - Redis Pub/Sub for real-time updates
   - Message queues for background processing
   
6. AUTO-SCALING STRATEGY:
   
   Horizontal Pod Autoscaler (HPA):
   - CPU utilization (target: 70%)
   - Memory utilization (target: 80%)
   - Custom metrics (requests per second)
   
   Vertical Pod Autoscaler (VPA):
   - Automatic resource right-sizing
   - Historical usage analysis
   
   Cluster Autoscaler:
   - Node scaling based on pod requirements
   - Multi-zone deployment for availability
   
7. PERFORMANCE OPTIMIZATIONS:
   
   Service Level:
   - Connection pooling
   - Async processing where possible
   - Bulk operations for database writes
   - Lazy loading and pagination
   
   Network Level:
   - HTTP/2 and HTTP/3 support
   - Compression (gzip/brotli)
   - Keep-alive connections
   - Regional edge locations
   
8. OBSERVABILITY STACK:
   
   Metrics (Prometheus + Grafana):
   - Service-level metrics (latency, throughput, errors)
   - Infrastructure metrics (CPU, memory, disk)
   - Business metrics (orders, revenue, conversion)
   
   Logging (ELK Stack):
   - Centralized logging with Elasticsearch
   - Log aggregation and correlation
   - Real-time log analysis
   
   Tracing (Jaeger):
   - Distributed request tracing
   - Performance bottleneck identification
   - Service dependency mapping
   
9. RESILIENCE PATTERNS:
   
   Circuit Breaker:
   - Prevent cascade failures
   - Automatic recovery detection
   - Fallback mechanisms
   
   Bulkhead:
   - Resource isolation
   - Separate thread pools
   - Independent failure domains
   
   Timeout and Retry:
   - Exponential backoff
   - Jitter to prevent thundering herd
   - Maximum retry limits
   
10. DATA CONSISTENCY:
    
    Eventual Consistency:
    - Event-driven architecture
    - Saga pattern for distributed transactions
    - Compensation actions for failures
    
    Strong Consistency:
    - Two-phase commit for critical operations
    - Distributed locks for inventory
    - ACID transactions within service boundaries

PERFORMANCE TARGETS ACHIEVED:

- Latency: P95 < 200ms, P99 < 500ms
- Throughput: 50,000+ RPS per region
- Availability: 99.95% uptime
- Scalability: Auto-scale from 10 to 1000+ instances
- Recovery: RTO < 5 minutes, RPO < 1 minute

MONITORING AND ALERTING:

Key Metrics:
- Service response times and error rates
- Database connection pool utilization
- Cache hit ratios and eviction rates
- Message queue lag and processing rates
- Infrastructure resource utilization

Alerts:
- P95 latency > 200ms
- Error rate > 1%
- CPU utilization > 80%
- Memory utilization > 85%
- Disk space > 90%
- Service dependency failures

CAPACITY PLANNING:

Load Testing:
- Regular performance testing with realistic traffic
- Chaos engineering to test failure scenarios
- Gradual traffic ramp-up for new deployments

Scaling Triggers:
- Predictive scaling based on historical patterns
- Reactive scaling based on real-time metrics
- Manual scaling for planned events

This architecture provides:
✅ High availability and fault tolerance
✅ Linear scalability with demand
✅ Sub-200ms response times
✅ Comprehensive observability
✅ Automated failure recovery
✅ Cost optimization through auto-scaling
*/

console.log("Distributed system optimized for performance and scalability");',
        '[
            {
                "input": "distributed_architecture",
                "expected_output": "scalable_microservices",
                "description": "Should design scalable microservices architecture"
            },
            {
                "input": "load_balancing_strategy",
                "expected_output": "multi_tier_load_balancing",
                "description": "Should implement multi-tier load balancing"
            },
            {
                "input": "auto_scaling_design",
                "expected_output": "hpa_vpa_cluster_scaling",
                "description": "Should design comprehensive auto-scaling strategy"
            },
            {
                "input": "observability_stack",
                "expected_output": "metrics_logging_tracing",
                "description": "Should include comprehensive observability"
            }
        ]',
        path_id,
        6
    );
END $$;

-- Create indexes for the new challenges
CREATE INDEX IF NOT EXISTS idx_challenges_path_order ON challenges(path_id, order_index);
CREATE INDEX IF NOT EXISTS idx_challenges_difficulty ON challenges(difficulty);
CREATE INDEX IF NOT EXISTS idx_challenges_type ON challenges(challenge_type);