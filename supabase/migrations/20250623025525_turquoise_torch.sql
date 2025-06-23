/*
  # Add Challenges for Algorithm Debugging and System Design Debugging

  1. New Challenges for Algorithm Debugging Learning Path
    - Binary Search Bug Hunt (Easy)
    - Sorting Algorithm Issues (Medium)
    - Dynamic Programming Debugging (Hard)
    - Graph Algorithm Optimization (Hard)

  2. New Challenges for System Design Debugging Learning Path
    - Debug a Slow E-commerce System (Medium)
    - Fix Microservices Communication Issues (Hard)
    - Resolve Database Performance Problems (Hard)

  3. Security
    - No RLS changes needed as this extends existing table structure
*/

-- Get learning path IDs
DO $$
DECLARE
    algorithm_path_id uuid;
    system_debug_path_id uuid;
BEGIN
    -- Get Algorithm Debugging path ID
    SELECT id INTO algorithm_path_id 
    FROM learning_paths 
    WHERE title = 'Algorithm Debugging';

    -- Get System Design Debugging path ID
    SELECT id INTO system_debug_path_id 
    FROM learning_paths 
    WHERE title = 'System Design Debugging';

    -- Algorithm Debugging Challenges (Coding Type)
    
    -- Easy Challenge
    INSERT INTO challenges (title, description, difficulty, challenge_type, initial_code, solution_code, test_cases, path_id, order_index) VALUES 
    (
        'Binary Search Bug Hunt',
        'This binary search implementation has several bugs that cause it to fail on certain inputs. Your task is to identify and fix all the issues.

**Context**: Search algorithm debugging
**Language**: JavaScript
**Time Limit**: 15 minutes

**Your Task**:
1. Identify all bugs in the binary search implementation
2. Fix the issues to make it work correctly
3. Ensure it handles edge cases properly

**Test Cases**:
- Empty arrays
- Single element arrays
- Target not found
- Target at boundaries
- Duplicate elements',
        'easy',
        'coding',
        'function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length;
    
    while (left <= right) {
        let mid = (left + right) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid;
        } else {
            right = mid;
        }
    }
    
    return -1;
}',
        'function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}',
        '[
            {
                "input": [[1, 2, 3, 4, 5], 3],
                "expected_output": 2,
                "description": "Find element in middle of array"
            },
            {
                "input": [[1, 2, 3, 4, 5], 1],
                "expected_output": 0,
                "description": "Find first element"
            },
            {
                "input": [[1, 2, 3, 4, 5], 5],
                "expected_output": 4,
                "description": "Find last element"
            },
            {
                "input": [[1, 2, 3, 4, 5], 6],
                "expected_output": -1,
                "description": "Element not found"
            },
            {
                "input": [[], 1],
                "expected_output": -1,
                "description": "Empty array"
            }
        ]',
        algorithm_path_id,
        1
    );

    -- Medium Challenge
    INSERT INTO challenges (title, description, difficulty, challenge_type, initial_code, solution_code, test_cases, path_id, order_index) VALUES 
    (
        'Sorting Algorithm Issues',
        'This quicksort implementation has multiple bugs that cause incorrect sorting and infinite loops. Debug and fix all issues.

**Context**: Sorting algorithm debugging
**Language**: JavaScript
**Time Limit**: 20 minutes

**Your Task**:
1. Fix the partition function bugs
2. Resolve infinite loop issues
3. Handle edge cases properly
4. Ensure stable sorting behavior

**Common Issues**:
- Incorrect pivot selection
- Wrong partition logic
- Infinite recursion
- Array boundary errors',
        'medium',
        'coding',
        'function quickSort(arr, low = 0, high = arr.length) {
    if (low < high) {
        let pi = partition(arr, low, high);
        quickSort(arr, low, pi);
        quickSort(arr, pi, high);
    }
    return arr;
}

function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}',
        'function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        let pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
    return arr;
}

function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}',
        '[
            {
                "input": [[3, 6, 8, 10, 1, 2, 1]],
                "expected_output": [1, 1, 2, 3, 6, 8, 10],
                "description": "Sort array with duplicates"
            },
            {
                "input": [[5, 4, 3, 2, 1]],
                "expected_output": [1, 2, 3, 4, 5],
                "description": "Sort reverse sorted array"
            },
            {
                "input": [[1]],
                "expected_output": [1],
                "description": "Sort single element"
            },
            {
                "input": [[]],
                "expected_output": [],
                "description": "Sort empty array"
            }
        ]',
        algorithm_path_id,
        2
    );

    -- Hard Challenge 1
    INSERT INTO challenges (title, description, difficulty, challenge_type, initial_code, solution_code, test_cases, path_id, order_index) VALUES 
    (
        'Dynamic Programming Debugging',
        'This dynamic programming solution for the longest common subsequence has several subtle bugs that cause incorrect results. Debug and optimize the implementation.

**Context**: Dynamic programming algorithm debugging
**Language**: JavaScript
**Time Limit**: 30 minutes

**Your Task**:
1. Fix the DP table initialization
2. Correct the recurrence relation
3. Fix the result reconstruction
4. Optimize space complexity

**Focus Areas**:
- DP table boundaries
- State transitions
- Base cases
- Result extraction',
        'hard',
        'coding',
        'function longestCommonSubsequence(text1, text2) {
    const m = text1.length;
    const n = text2.length;
    
    // Create DP table
    const dp = Array(m).fill().map(() => Array(n).fill(0));
    
    // Fill DP table
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (text1[i] === text2[j]) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    
    // Reconstruct LCS
    let lcs = "";
    let i = m - 1, j = n - 1;
    
    while (i > 0 && j > 0) {
        if (text1[i] === text2[j]) {
            lcs = text1[i] + lcs;
            i--;
            j--;
        } else if (dp[i-1][j] > dp[i][j-1]) {
            i--;
        } else {
            j--;
        }
    }
    
    return lcs;
}',
        'function longestCommonSubsequence(text1, text2) {
    const m = text1.length;
    const n = text2.length;
    
    // Create DP table with proper dimensions
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    // Fill DP table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i-1] === text2[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    
    // Reconstruct LCS
    let lcs = "";
    let i = m, j = n;
    
    while (i > 0 && j > 0) {
        if (text1[i-1] === text2[j-1]) {
            lcs = text1[i-1] + lcs;
            i--;
            j--;
        } else if (dp[i-1][j] > dp[i][j-1]) {
            i--;
        } else {
            j--;
        }
    }
    
    return lcs;
}',
        '[
            {
                "input": ["abcde", "ace"],
                "expected_output": "ace",
                "description": "Basic LCS example"
            },
            {
                "input": ["abc", "abc"],
                "expected_output": "abc",
                "description": "Identical strings"
            },
            {
                "input": ["abc", "def"],
                "expected_output": "",
                "description": "No common subsequence"
            },
            {
                "input": ["", "abc"],
                "expected_output": "",
                "description": "Empty string"
            }
        ]',
        algorithm_path_id,
        3
    );

    -- Hard Challenge 2
    INSERT INTO challenges (title, description, difficulty, challenge_type, initial_code, solution_code, test_cases, path_id, order_index) VALUES 
    (
        'Graph Algorithm Optimization',
        'This Dijkstra''s shortest path implementation has performance issues and bugs that cause incorrect results. Debug and optimize for better performance.

**Context**: Graph algorithm debugging and optimization
**Language**: JavaScript
**Time Limit**: 35 minutes

**Your Task**:
1. Fix the priority queue implementation
2. Correct the distance updates
3. Optimize the algorithm complexity
4. Handle edge cases properly

**Focus Areas**:
- Priority queue efficiency
- Distance initialization
- Visited node tracking
- Path reconstruction',
        'hard',
        'coding',
        'function dijkstra(graph, start) {
    const distances = {};
    const visited = {};
    const previous = {};
    const queue = [];
    
    // Initialize distances
    for (let vertex in graph) {
        distances[vertex] = vertex === start ? 0 : Number.MAX_VALUE;
        queue.push(vertex);
    }
    
    while (queue.length > 0) {
        // Find minimum distance vertex (inefficient)
        let minVertex = queue[0];
        for (let i = 1; i < queue.length; i++) {
            if (distances[queue[i]] < distances[minVertex]) {
                minVertex = queue[i];
            }
        }
        
        // Remove from queue
        queue.splice(queue.indexOf(minVertex), 1);
        visited[minVertex] = true;
        
        // Update distances
        for (let neighbor in graph[minVertex]) {
            if (!visited[neighbor]) {
                const newDistance = distances[minVertex] + graph[minVertex][neighbor];
                if (newDistance < distances[neighbor]) {
                    distances[neighbor] = newDistance;
                    previous[neighbor] = minVertex;
                }
            }
        }
    }
    
    return { distances, previous };
}',
        'class PriorityQueue {
    constructor() {
        this.queue = [];
    }
    
    enqueue(item, priority) {
        this.queue.push({ item, priority });
        this.queue.sort((a, b) => a.priority - b.priority);
    }
    
    dequeue() {
        return this.queue.shift();
    }
    
    isEmpty() {
        return this.queue.length === 0;
    }
}

function dijkstra(graph, start) {
    const distances = {};
    const previous = {};
    const pq = new PriorityQueue();
    
    // Initialize distances
    for (let vertex in graph) {
        distances[vertex] = vertex === start ? 0 : Infinity;
        pq.enqueue(vertex, distances[vertex]);
    }
    
    while (!pq.isEmpty()) {
        const { item: currentVertex } = pq.dequeue();
        
        // Skip if we''ve found a better path already
        if (distances[currentVertex] === Infinity) break;
        
        // Update distances to neighbors
        for (let neighbor in graph[currentVertex]) {
            const newDistance = distances[currentVertex] + graph[currentVertex][neighbor];
            
            if (newDistance < distances[neighbor]) {
                distances[neighbor] = newDistance;
                previous[neighbor] = currentVertex;
                pq.enqueue(neighbor, newDistance);
            }
        }
    }
    
    return { distances, previous };
}',
        '[
            {
                "input": [{"A": {"B": 4, "C": 2}, "B": {"C": 1, "D": 5}, "C": {"D": 8, "E": 10}, "D": {"E": 2}, "E": {}}, "A"],
                "expected_output": {"distances": {"A": 0, "B": 4, "C": 2, "D": 9, "E": 11}, "previous": {"B": "A", "C": "A", "D": "B", "E": "D"}},
                "description": "Basic shortest path"
            }
        ]',
        algorithm_path_id,
        4
    );

    -- System Design Debugging Challenges (System Design Type)
    
    -- Medium Challenge
    INSERT INTO challenges (title, description, difficulty, challenge_type, initial_code, solution_code, test_cases, path_id, order_index) VALUES 
    (
        'Debug a Slow E-commerce System',
        'An e-commerce platform is experiencing severe performance issues. Users are complaining about slow page loads, timeouts during checkout, and search functionality that takes forever. Your task is to identify the bottlenecks and design solutions.

**Current Issues**:
• Homepage takes 8+ seconds to load
• Product search times out frequently  
• Checkout process fails under load
• Database queries are extremely slow
• Images load very slowly
• Mobile experience is poor

**System Context**:
• 100K daily active users
• 50K products in catalog
• Monolithic PHP application
• MySQL database (not optimized)
• Single server deployment
• No caching layer
• Images stored on same server

**Your Task**:
Design an improved architecture that addresses these performance issues. Consider:
- Database optimization strategies
- Caching layers
- CDN implementation
- Load balancing
- Microservices decomposition
- Search optimization

Draw your solution showing how you would restructure this system for better performance.',
        'medium',
        'system_design',
        '// Current Problematic E-commerce Architecture
// Single server handling everything - causing major bottlenecks

/*
Current Issues Analysis:

1. Database Problems:
   - No indexing on product searches
   - N+1 query problems
   - No query optimization
   - Single database handling all load

2. Application Issues:
   - Monolithic architecture
   - No caching
   - Synchronous processing
   - Poor code optimization

3. Infrastructure Issues:
   - Single server (SPOF)
   - No load balancing
   - Images served from same server
   - No CDN

4. Frontend Issues:
   - Large bundle sizes
   - No image optimization
   - Poor mobile optimization
   - Blocking JavaScript

Your task: Design a high-performance e-commerce architecture
*/

console.log("Design an optimized e-commerce system architecture");',
        '// Optimized E-commerce Architecture Solution

/*
Performance Optimization Strategy:

1. Database Layer:
   - Read replicas for search queries
   - Proper indexing on product attributes
   - Query optimization and caching
   - Consider NoSQL for product catalog

2. Caching Strategy:
   - Redis for session data and cart
   - Application-level caching for products
   - Database query result caching
   - CDN for static assets

3. Application Architecture:
   - Microservices for different domains
   - API Gateway for routing
   - Async processing for non-critical tasks
   - Search service (Elasticsearch)

4. Infrastructure:
   - Load balancers for high availability
   - Auto-scaling groups
   - CDN for global content delivery
   - Separate image storage service

5. Frontend Optimization:
   - Code splitting and lazy loading
   - Image optimization and WebP
   - Progressive Web App features
   - Mobile-first responsive design

Key Performance Improvements:
- Homepage: 8s → <2s
- Search: Timeout → <500ms
- Checkout: Failures → 99.9% success
- Mobile: Poor → Excellent UX
*/

console.log("Comprehensive e-commerce performance optimization");',
        '[
            {
                "input": "performance_analysis",
                "expected_output": "optimized_architecture",
                "description": "Design optimized e-commerce system architecture"
            }
        ]',
        system_debug_path_id,
        1
    );

    -- Hard Challenge 1
    INSERT INTO challenges (title, description, difficulty, challenge_type, initial_code, solution_code, test_cases, path_id, order_index) VALUES 
    (
        'Fix Microservices Communication Issues',
        'A microservices-based social media platform is experiencing critical communication issues between services. The system suffers from cascading failures, inconsistent data, and poor reliability.

**Current Problems**:
• Services frequently timeout when calling each other
• Data inconsistency across user profiles and posts
• Cascading failures bring down entire platform
• No proper error handling between services
• Authentication issues across service boundaries
• Monitoring and debugging is nearly impossible

**System Context**:
• 10 microservices (User, Post, Comment, Like, Notification, etc.)
• 5M daily active users
• Services deployed on Kubernetes
• REST APIs for inter-service communication
• Shared database per service
• No service mesh or API gateway

**Current Architecture Issues**:
• Direct service-to-service calls
• No circuit breakers or retry logic
• Synchronous communication everywhere
• No distributed tracing
• Inconsistent error handling
• No rate limiting

**Your Task**:
Design a robust microservices communication architecture that addresses these reliability and consistency issues. Focus on:
- Service mesh implementation
- Circuit breaker patterns
- Event-driven architecture
- Distributed tracing
- API gateway design
- Data consistency strategies

Draw your solution showing the improved communication patterns and reliability mechanisms.',
        'hard',
        'system_design',
        '// Problematic Microservices Communication Architecture
// Direct service calls causing cascading failures

/*
Current Communication Problems:

1. Synchronous Dependencies:
   - Direct HTTP calls between services
   - No timeout or retry mechanisms
   - Cascading failures when one service is down
   - No circuit breaker patterns

2. Data Consistency Issues:
   - No event sourcing or SAGA patterns
   - Distributed transactions failing
   - Eventual consistency not handled
   - No compensation mechanisms

3. Observability Problems:
   - No distributed tracing
   - Poor logging correlation
   - No service dependency mapping
   - Difficult to debug issues

4. Security and Auth:
   - No centralized authentication
   - Service-to-service auth inconsistent
   - No API gateway for security policies
   - JWT tokens passed everywhere

5. Reliability Issues:
   - No bulkhead patterns
   - No graceful degradation
   - No health checks
   - No load balancing strategies

Your task: Design resilient microservices communication
*/

console.log("Design resilient microservices communication architecture");',
        '// Resilient Microservices Communication Solution

/*
Robust Communication Architecture:

1. Service Mesh (Istio/Linkerd):
   - Automatic service discovery
   - Load balancing and failover
   - Mutual TLS for security
   - Traffic management and routing

2. API Gateway:
   - Single entry point for clients
   - Authentication and authorization
   - Rate limiting and throttling
   - Request/response transformation

3. Circuit Breaker Pattern:
   - Prevent cascading failures
   - Automatic fallback mechanisms
   - Health monitoring and recovery
   - Bulkhead isolation

4. Event-Driven Architecture:
   - Async communication via message queues
   - Event sourcing for data consistency
   - SAGA pattern for distributed transactions
   - Dead letter queues for error handling

5. Observability Stack:
   - Distributed tracing (Jaeger/Zipkin)
   - Centralized logging (ELK stack)
   - Metrics and monitoring (Prometheus)
   - Service dependency mapping

6. Resilience Patterns:
   - Retry with exponential backoff
   - Timeout configurations
   - Graceful degradation
   - Health checks and readiness probes

7. Data Consistency:
   - Event sourcing for audit trail
   - CQRS for read/write separation
   - Eventual consistency with compensation
   - Distributed locks where needed

Key Improvements:
- 99.9% → 99.99% availability
- Cascading failures eliminated
- Data consistency guaranteed
- Full observability and debugging
*/

console.log("Comprehensive microservices resilience architecture");',
        '[
            {
                "input": "microservices_communication_issues",
                "expected_output": "resilient_architecture",
                "description": "Design resilient microservices communication architecture"
            }
        ]',
        system_debug_path_id,
        2
    );

    -- Hard Challenge 2
    INSERT INTO challenges (title, description, difficulty, challenge_type, initial_code, solution_code, test_cases, path_id, order_index) VALUES 
    (
        'Resolve Database Performance Problems',
        'A fintech application is experiencing severe database performance issues that are affecting critical financial operations. The system handles millions of transactions daily but is struggling with query performance, deadlocks, and scalability.

**Critical Issues**:
• Transaction processing takes 30+ seconds
• Frequent deadlocks during peak hours
• Report generation queries timeout
• Database CPU constantly at 100%
• Memory usage growing uncontrollably
• Backup operations affect live performance

**System Context**:
• PostgreSQL database with 500GB+ data
• 10K concurrent users during peak
• 1M+ transactions per day
• Complex financial calculations
• Strict ACID compliance required
• Real-time fraud detection needed
• Regulatory reporting requirements

**Current Database Problems**:
• No proper indexing strategy
• Inefficient query patterns
• Long-running transactions
• No connection pooling
• Single master database
• No read replicas
• Poor partitioning strategy

**Performance Metrics**:
• Average query time: 5-30 seconds
• Peak CPU usage: 100%
• Memory usage: 95%+ constantly
• Deadlock frequency: 50+ per hour
• Backup time: 8+ hours

**Your Task**:
Design a high-performance database architecture that can handle the fintech workload efficiently. Address:
- Query optimization strategies
- Indexing and partitioning
- Read/write separation
- Connection management
- Deadlock prevention
- Backup and recovery optimization
- Monitoring and alerting

Draw your solution showing the optimized database architecture and performance improvements.',
        'hard',
        'system_design',
        '// Problematic Database Architecture for Fintech Application
// Single database struggling with high-volume financial transactions

/*
Current Database Performance Problems:

1. Query Performance Issues:
   - No proper indexing on transaction tables
   - Full table scans on large datasets
   - Inefficient JOIN operations
   - No query plan optimization
   - Complex reporting queries blocking OLTP

2. Concurrency Problems:
   - Frequent deadlocks on account updates
   - Long-running transactions holding locks
   - No proper isolation level management
   - Row-level locking conflicts

3. Scalability Issues:
   - Single master database (bottleneck)
   - No read replicas for reporting
   - No horizontal partitioning
   - Connection pool exhaustion

4. Resource Management:
   - Poor memory configuration
   - Inefficient buffer pool usage
   - No connection pooling
   - Backup operations blocking live traffic

5. Monitoring Gaps:
   - No query performance tracking
   - Poor deadlock analysis
   - No proactive alerting
   - Limited performance metrics

Your task: Design high-performance fintech database architecture
*/

console.log("Design optimized database architecture for fintech workload");',
        '// High-Performance Database Architecture Solution

/*
Optimized Fintech Database Architecture:

1. Database Topology:
   - Master-slave replication setup
   - Read replicas for reporting queries
   - Connection pooling (PgBouncer)
   - Load balancer for read distribution

2. Indexing Strategy:
   - Composite indexes on transaction queries
   - Partial indexes for filtered queries
   - Hash indexes for equality lookups
   - Regular index maintenance and analysis

3. Partitioning Strategy:
   - Time-based partitioning for transactions
   - Hash partitioning for user accounts
   - Automatic partition management
   - Partition pruning optimization

4. Query Optimization:
   - OLTP/OLAP workload separation
   - Materialized views for reports
   - Query plan caching
   - Prepared statement usage

5. Concurrency Control:
   - Optimistic locking where possible
   - Shorter transaction boundaries
   - Proper isolation levels
   - Deadlock detection and retry logic

6. Performance Tuning:
   - Memory configuration optimization
   - WAL optimization for writes
   - Checkpoint tuning
   - Vacuum and analyze automation

7. Backup and Recovery:
   - Streaming replication
   - Point-in-time recovery setup
   - Incremental backup strategy
   - Backup to separate storage

8. Monitoring and Alerting:
   - Query performance monitoring
   - Real-time deadlock detection
   - Resource usage alerts
   - Automated performance reports

9. Caching Layer:
   - Redis for frequently accessed data
   - Application-level query caching
   - Session state caching
   - Rate limiting data

Performance Improvements:
- Query time: 30s → <100ms
- CPU usage: 100% → <70%
- Deadlocks: 50/hour → <5/hour
- Backup time: 8h → 2h
- Concurrent users: 10K → 50K+
*/

console.log("Comprehensive database performance optimization for fintech");',
        '[
            {
                "input": "database_performance_issues",
                "expected_output": "optimized_database_architecture",
                "description": "Design high-performance database architecture for fintech"
            }
        ]',
        system_debug_path_id,
        3
    );

END $$;