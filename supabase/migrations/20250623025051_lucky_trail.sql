/*
  # Ensure Learning Paths and Challenges Exist

  1. Verify Learning Paths
    - Check if learning paths exist and create them if missing
    - Ensure proper ordering and icons

  2. Verify Challenges
    - Check if challenges are properly linked to learning paths
    - Ensure all challenge types are represented

  3. Data Integrity
    - Fix any orphaned challenges
    - Ensure proper foreign key relationships
*/

-- Insert learning paths if they don't exist
INSERT INTO learning_paths (title, description, icon, order_index) VALUES
(
    'Debugging Fundamentals',
    'Master the essential skills of identifying and fixing common programming bugs',
    'bug',
    1
),
(
    'Algorithm Debugging',
    'Debug and optimize algorithmic solutions to complex problems',
    'code-2',
    2
),
(
    'System Design Debugging',
    'Identify and resolve issues in system architecture and design patterns',
    'network',
    3
),
(
    'System Design Interviews',
    'Master system architecture and design patterns for technical interviews',
    'layout',
    4
),
(
    'Code Review Mastery',
    'Master the art of code review by identifying and fixing common programming issues. Learn to spot security vulnerabilities, performance bottlenecks, design pattern misuse, and maintainability problems.',
    'search',
    5
)
ON CONFLICT (title) DO UPDATE SET
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index;

-- Ensure all existing challenges have proper path assignments
UPDATE challenges 
SET path_id = (SELECT id FROM learning_paths WHERE title = 'Debugging Fundamentals')
WHERE path_id IS NULL AND challenge_type = 'coding' AND difficulty = 'easy';

UPDATE challenges 
SET path_id = (SELECT id FROM learning_paths WHERE title = 'Algorithm Debugging')
WHERE path_id IS NULL AND challenge_type = 'coding' AND difficulty IN ('medium', 'hard');

UPDATE challenges 
SET path_id = (SELECT id FROM learning_paths WHERE title = 'System Design Interviews')
WHERE path_id IS NULL AND challenge_type = 'system_design';

UPDATE challenges 
SET path_id = (SELECT id FROM learning_paths WHERE title = 'Code Review Mastery')
WHERE path_id IS NULL AND challenge_type = 'code_review';

-- Add a basic coding challenge if none exist
INSERT INTO challenges (
    title, 
    description, 
    difficulty, 
    challenge_type,
    initial_code, 
    solution_code, 
    test_cases,
    path_id,
    order_index
) 
SELECT 
    'Fix the Array Sum Function',
    'The following function is supposed to calculate the sum of all numbers in an array, but it has a bug. Find and fix the issue.

**Your Task:**
1. Identify the bug in the code
2. Fix the issue to make all tests pass
3. Ensure the function handles edge cases properly

**Hint:** Look carefully at the variable initialization.',
    'easy',
    'coding',
    'function arraySum(numbers) {
  let sum;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  return sum;
}',
    'function arraySum(numbers) {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  return sum;
}',
    '[
        {
            "input": [1, 2, 3, 4, 5],
            "expected_output": 15,
            "description": "Sum of positive numbers"
        },
        {
            "input": [-1, -2, 3, -4, 5],
            "expected_output": 1,
            "description": "Sum of mixed positive and negative numbers"
        },
        {
            "input": [],
            "expected_output": 0,
            "description": "Sum of empty array"
        }
    ]',
    (SELECT id FROM learning_paths WHERE title = 'Debugging Fundamentals'),
    1
WHERE NOT EXISTS (
    SELECT 1 FROM challenges 
    WHERE title = 'Fix the Array Sum Function'
);

-- Add a system design challenge if none exist
INSERT INTO challenges (
    title, 
    description, 
    difficulty, 
    challenge_type,
    initial_code, 
    solution_code, 
    test_cases,
    path_id,
    order_index
) 
SELECT 
    'Design a URL Shortener Service',
    'Design a URL shortening service like bit.ly or tinyurl.com. Consider the following requirements:

• **Functional Requirements:**
  - Shorten long URLs to short aliases
  - Redirect short URLs to original URLs
  - Custom aliases (optional)
  - URL expiration (optional)

• **Non-Functional Requirements:**
  - Handle 100M URLs per day
  - 100:1 read/write ratio
  - Service should be highly available
  - Real-time analytics would be nice

• **Capacity Estimation:**
  - 100M URLs/day = ~1160 URLs/second
  - Read QPS = 116K/second
  - Storage: 100M * 365 * 5 years * 500 bytes = ~100TB

**Your Task:**
Draw your system architecture including:
- Load balancers
- Application servers
- Databases
- Caching layers
- CDN (if needed)
- Analytics components',
    'medium',
    'system_design',
    '// System Design Challenge - No coding required
// Use the drawing canvas to design your system architecture
// Consider the following components in your design:

/*
Key Components to Include:
1. Load Balancer
2. Application Servers
3. Database (SQL/NoSQL)
4. Cache (Redis/Memcached)
5. URL Encoding Service
6. Analytics Service
7. CDN (optional)

Key Design Decisions:
- Database choice (SQL vs NoSQL)
- Caching strategy
- URL encoding algorithm
- Sharding strategy
- How to handle custom aliases
- Analytics and monitoring
*/

console.log("Use the drawing canvas to design your URL shortener architecture");',
    '// Example System Design Solution for URL Shortener

/*
High-Level Architecture:

1. Load Balancer (HAProxy/AWS ALB)
   - Distributes traffic across app servers
   - Health checks

2. Application Servers (Multiple instances)
   - URL shortening logic
   - URL redirection logic
   - Rate limiting
   - Authentication

3. Database Layer:
   - Primary: NoSQL (Cassandra/DynamoDB) for URL mappings
   - Secondary: SQL (PostgreSQL) for user data and analytics
   - Sharding by URL hash

4. Caching Layer:
   - Redis/Memcached for frequently accessed URLs
   - Cache-aside pattern
   - TTL based on URL popularity

5. URL Encoding Service:
   - Base62 encoding (a-z, A-Z, 0-9)
   - Counter-based or hash-based approach
   - Handle collisions

6. Analytics Service:
   - Kafka for real-time data streaming
   - Elasticsearch for search and analytics
   - Batch processing for reports

7. CDN (CloudFlare/AWS CloudFront):
   - Cache popular redirections
   - Reduce latency globally

Key Design Decisions:
- Use NoSQL for horizontal scaling
- Implement consistent hashing for sharding
- Cache popular URLs (80/20 rule)
- Async analytics processing
- Rate limiting to prevent abuse
*/

console.log("This is an example solution - your design may vary based on requirements");',
    '[
        {
            "input": "system_design",
            "expected_output": "architecture_diagram",
            "description": "Design a scalable URL shortener system architecture"
        }
    ]',
    (SELECT id FROM learning_paths WHERE title = 'System Design Interviews'),
    1
WHERE NOT EXISTS (
    SELECT 1 FROM challenges 
    WHERE title = 'Design a URL Shortener Service'
);

-- Verify data integrity
DO $$
DECLARE
    path_count INTEGER;
    challenge_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO path_count FROM learning_paths;
    SELECT COUNT(*) INTO challenge_count FROM challenges;
    
    RAISE NOTICE 'Learning paths count: %', path_count;
    RAISE NOTICE 'Challenges count: %', challenge_count;
    
    IF path_count = 0 THEN
        RAISE EXCEPTION 'No learning paths found after migration';
    END IF;
    
    IF challenge_count = 0 THEN
        RAISE EXCEPTION 'No challenges found after migration';
    END IF;
END $$;