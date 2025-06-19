/*
  # Add System Design Interview Learning Path

  1. New Learning Path
    - `System Design Interviews` - Focus on system architecture and design patterns
    - Icon: `layout` for system design representation
    - Order index: 4 (after existing paths)

  2. New Challenge Type
    - Add `challenge_type` enum to support different types of challenges
    - `coding` - Traditional coding challenges
    - `system_design` - System design challenges with drawing canvas

  3. New Challenges
    - Design a URL Shortener (like bit.ly)
    - Design a Chat System (like WhatsApp)
    - Design a Social Media Feed (like Twitter)

  4. Schema Updates
    - Add `challenge_type` column to challenges table
    - Add `canvas_data` column for storing drawing data
    - Update existing challenges to have `coding` type

  5. Security
    - Enable RLS on all tables (already enabled)
    - Existing policies will cover new data
*/

-- Create challenge type enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'challenge_type') THEN
    CREATE TYPE challenge_type AS ENUM ('coding', 'system_design');
  END IF;
END $$;

-- Add challenge_type and canvas_data columns to challenges table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'challenges' AND column_name = 'challenge_type'
  ) THEN
    ALTER TABLE challenges ADD COLUMN challenge_type challenge_type NOT NULL DEFAULT 'coding';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'challenges' AND column_name = 'canvas_data'
  ) THEN
    ALTER TABLE challenges ADD COLUMN canvas_data JSONB;
  END IF;
END $$;

-- Add canvas_submission column to user_progress table for storing drawing data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_progress' AND column_name = 'canvas_submission'
  ) THEN
    ALTER TABLE user_progress ADD COLUMN canvas_submission JSONB;
  END IF;
END $$;

-- Insert System Design Interview learning path
INSERT INTO learning_paths (title, description, icon, order_index) VALUES
(
    'System Design Interviews',
    'Master system architecture and design patterns for technical interviews',
    'layout',
    4
) ON CONFLICT DO NOTHING;

-- Insert system design challenges
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
) VALUES
(
    'Design a URL Shortener Service',
    'Design a URL shortening service like bit.ly or tinyurl.com. Consider the following requirements:

• Functional Requirements:
  - Shorten long URLs to short aliases
  - Redirect short URLs to original URLs
  - Custom aliases (optional)
  - URL expiration (optional)

• Non-Functional Requirements:
  - Handle 100M URLs per day
  - 100:1 read/write ratio
  - Service should be highly available
  - Real-time analytics would be nice

• Capacity Estimation:
  - 100M URLs/day = ~1160 URLs/second
  - Read QPS = 116K/second
  - Storage: 100M * 365 * 5 years * 500 bytes = ~100TB

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
),
(
    'Design a Chat System',
    'Design a real-time chat system like WhatsApp or Slack. Consider the following requirements:

• Functional Requirements:
  - Send and receive messages in real-time
  - Support for group chats (up to 100 users)
  - Message history and persistence
  - Online/offline status
  - Message delivery confirmation
  - File sharing (images, documents)

• Non-Functional Requirements:
  - Support 50M daily active users
  - Low latency for message delivery (<100ms)
  - High availability (99.9% uptime)
  - End-to-end encryption
  - Support for mobile and web clients

• Scale Estimation:
  - 50M DAU, each user sends 40 messages/day
  - 2B messages per day = ~23K messages/second
  - Peak traffic: 5x average = 115K messages/second
  - Storage: 2B messages * 100 bytes * 365 days = ~7TB/year

Draw your system architecture including:
- WebSocket connections
- Message queues
- Database design
- Notification systems
- File storage
- Load balancing strategy',
    'hard',
    'system_design',
    '// System Design Challenge - Chat System
// Use the drawing canvas to design your real-time chat architecture

/*
Key Components to Consider:
1. WebSocket Gateway
2. Message Queue System
3. Chat Service
4. User Service
5. Notification Service
6. File Storage Service
7. Database Design

Real-time Communication:
- WebSocket connections
- Message routing
- Connection management
- Presence service

Data Storage:
- Message persistence
- User data
- Chat metadata
- File storage

Scalability Considerations:
- Horizontal scaling
- Database sharding
- Message queue partitioning
- CDN for file delivery
*/

console.log("Design a scalable real-time chat system");',
    '// Example Chat System Architecture

/*
Real-time Communication Layer:
1. WebSocket Gateway
   - Maintains persistent connections
   - Connection pooling and management
   - Load balancing with sticky sessions

2. Message Router
   - Routes messages to correct recipients
   - Handles group message distribution
   - Message ordering and deduplication

Core Services:
3. Chat Service
   - Message processing and validation
   - Group management
   - Message threading

4. User Service
   - User authentication and profiles
   - Friend/contact management
   - Presence and status updates

5. Notification Service
   - Push notifications for offline users
   - Email notifications
   - Integration with FCM/APNS

Data Layer:
6. Message Database (Cassandra/MongoDB)
   - Partitioned by chat_id
   - Time-series data for messages
   - Efficient range queries

7. User Database (PostgreSQL)
   - User profiles and relationships
   - Chat metadata and permissions

8. Cache Layer (Redis)
   - Active user sessions
   - Recent messages
   - Presence information

File Storage:
9. Object Storage (S3/GCS)
   - Images, videos, documents
   - CDN for global distribution
   - Thumbnail generation

Message Queue:
10. Apache Kafka
    - Message persistence and replay
    - Event sourcing for audit
    - Integration with analytics

Security:
- End-to-end encryption
- Message signing
- Rate limiting
- Authentication tokens
*/

console.log("Comprehensive chat system with real-time capabilities");',
    '[
        {
            "input": "chat_system_design",
            "expected_output": "realtime_architecture",
            "description": "Design a scalable real-time chat system"
        }
    ]',
    (SELECT id FROM learning_paths WHERE title = 'System Design Interviews'),
    2
),
(
    'Design a Social Media Feed',
    'Design a social media news feed system like Twitter or Facebook. Consider the following requirements:

• Functional Requirements:
  - Users can post updates (text, images, videos)
  - Users can follow other users
  - Generate personalized news feed
  - Like and comment on posts
  - Search functionality
  - Trending topics

• Non-Functional Requirements:
  - Support 300M monthly active users
  - 200M daily active users
  - Each user follows 200 people on average
  - 2M new posts per day
  - Feed generation should be fast (<200ms)
  - High availability and consistency

• Scale Estimation:
  - Read:Write ratio = 100:1
  - 2M posts/day = ~23 posts/second
  - Feed reads = 200M users * 5 feeds/day = 1B reads/day
  - Peak read QPS = ~20K/second

Draw your system architecture including:
- Feed generation strategies (push vs pull)
- Content delivery and caching
- Database design for posts and relationships
- Search and recommendation systems
- Media storage and processing',
    'hard',
    'system_design',
    '// System Design Challenge - Social Media Feed
// Use the drawing canvas to design your news feed system

/*
Key Design Decisions:
1. Feed Generation Strategy:
   - Push Model (Fanout on Write)
   - Pull Model (Fanout on Read)
   - Hybrid Approach

2. Core Components:
   - User Service
   - Post Service
   - Timeline Service
   - Notification Service
   - Media Service
   - Search Service

3. Data Storage:
   - User relationships (graph database?)
   - Posts and metadata
   - Timeline/feed storage
   - Media files

4. Caching Strategy:
   - Hot user feeds
   - Popular posts
   - User metadata

5. Content Delivery:
   - CDN for media
   - Geographic distribution
   - Mobile optimization

Consider the trade-offs between consistency, availability, and performance.
*/

console.log("Design a scalable social media feed system");',
    '// Example Social Media Feed Architecture

/*
Feed Generation Strategy - Hybrid Approach:

1. Push Model for Active Users:
   - Pre-compute feeds for active users
   - Store in Redis/cache
   - Fast read performance

2. Pull Model for Inactive Users:
   - Generate feed on-demand
   - Reduce storage costs
   - Acceptable latency for inactive users

Core Services:

3. User Service:
   - User profiles and authentication
   - Follow/unfollow relationships
   - User preferences and settings

4. Post Service:
   - Create, update, delete posts
   - Media upload and processing
   - Post metadata and analytics

5. Timeline Service:
   - Feed generation and ranking
   - Fanout service for push model
   - Feed aggregation for pull model

6. Graph Service:
   - Social graph management
   - Friend recommendations
   - Influence scoring

Data Storage:

7. User Database (PostgreSQL):
   - User profiles and settings
   - ACID compliance for critical data

8. Posts Database (Cassandra):
   - Time-series data for posts
   - Horizontal scaling
   - High write throughput

9. Graph Database (Neo4j):
   - Social relationships
   - Complex graph queries
   - Recommendation algorithms

10. Timeline Cache (Redis):
    - Pre-computed feeds
    - Hot data storage
    - Fast read access

Media and Content:

11. Object Storage (S3):
    - Images, videos, documents
    - Versioning and backup
    - Integration with CDN

12. CDN (CloudFront):
    - Global content distribution
    - Edge caching
    - Media optimization

Search and Discovery:

13. Search Service (Elasticsearch):
    - Full-text search
    - Trending topics
    - Real-time indexing

14. Recommendation Engine:
    - ML-based content ranking
    - Collaborative filtering
    - A/B testing framework

Message Queue:

15. Apache Kafka:
    - Event streaming
    - Feed generation events
    - Analytics pipeline

Monitoring and Analytics:
- Real-time metrics
- User engagement tracking
- Performance monitoring
- A/B testing infrastructure
*/

console.log("Scalable social media feed with hybrid approach");',
    '[
        {
            "input": "social_feed_design",
            "expected_output": "feed_architecture",
            "description": "Design a scalable social media feed system"
        }
    ]',
    (SELECT id FROM learning_paths WHERE title = 'System Design Interviews'),
    3
);

-- Create index for challenge type
CREATE INDEX IF NOT EXISTS idx_challenges_type ON challenges(challenge_type);