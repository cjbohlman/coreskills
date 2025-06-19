/*
  # Add solution data to challenges table

  1. Changes
    - Add solution_approaches column to store multiple solution approaches
    - Add community_discussion_enabled flag
    - Add solution_access_level to control who can view solutions

  2. Security
    - No RLS changes needed as this extends existing table structure
*/

-- Add solution-related columns to challenges table
DO $$
BEGIN
  -- Add solution_approaches column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'challenges' AND column_name = 'solution_approaches'
  ) THEN
    ALTER TABLE challenges ADD COLUMN solution_approaches jsonb DEFAULT '[]'::jsonb;
  END IF;

  -- Add community_discussion_enabled column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'challenges' AND column_name = 'community_discussion_enabled'
  ) THEN
    ALTER TABLE challenges ADD COLUMN community_discussion_enabled boolean DEFAULT true;
  END IF;

  -- Add solution_access_level column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'challenges' AND column_name = 'solution_access_level'
  ) THEN
    ALTER TABLE challenges ADD COLUMN solution_access_level text DEFAULT 'submission_required';
  END IF;
END $$;

-- Update existing challenges with sample solution approaches for system design challenges
UPDATE challenges 
SET solution_approaches = '[
  {
    "id": "microservices",
    "title": "Microservices Architecture",
    "description": "A distributed architecture with independent services for each business domain.",
    "complexity": "high",
    "scalability": "high",
    "cost": "high",
    "pros": [
      "High scalability and flexibility",
      "Independent deployment and development",
      "Technology diversity allowed",
      "Fault isolation between services"
    ],
    "cons": [
      "Increased complexity in service coordination",
      "Network latency between services",
      "Distributed system challenges",
      "Higher operational overhead"
    ],
    "bestFor": [
      "Large-scale applications",
      "Teams with microservices expertise",
      "Applications requiring high availability",
      "Complex business domains"
    ],
    "considerations": [
      "Implement proper service discovery",
      "Use API gateways for external communication",
      "Implement distributed tracing",
      "Plan for eventual consistency"
    ]
  },
  {
    "id": "monolithic",
    "title": "Modular Monolith",
    "description": "A single deployable unit with well-defined internal module boundaries.",
    "complexity": "low",
    "scalability": "medium",
    "cost": "low",
    "pros": [
      "Simpler deployment and testing",
      "Better performance (no network calls)",
      "Easier debugging and monitoring",
      "Lower operational complexity"
    ],
    "cons": [
      "Limited scalability options",
      "Technology stack lock-in",
      "Potential for tight coupling",
      "Larger deployment units"
    ],
    "bestFor": [
      "Small to medium applications",
      "Teams new to distributed systems",
      "Applications with simple domains",
      "Rapid prototyping and MVP development"
    ],
    "considerations": [
      "Maintain clear module boundaries",
      "Use dependency injection",
      "Implement proper layering",
      "Plan for future decomposition"
    ]
  },
  {
    "id": "serverless",
    "title": "Serverless Architecture",
    "description": "Event-driven architecture using cloud functions and managed services.",
    "complexity": "medium",
    "scalability": "high",
    "cost": "low",
    "pros": [
      "Automatic scaling and high availability",
      "Pay-per-use pricing model",
      "No server management required",
      "Fast development and deployment"
    ],
    "cons": [
      "Vendor lock-in concerns",
      "Cold start latency",
      "Limited execution time",
      "Debugging complexity"
    ],
    "bestFor": [
      "Event-driven applications",
      "Variable or unpredictable traffic",
      "Rapid development cycles",
      "Cost-sensitive projects"
    ],
    "considerations": [
      "Design for stateless functions",
      "Implement proper error handling",
      "Monitor cold start performance",
      "Use managed services when possible"
    ]
  }
]'::jsonb
WHERE challenge_type = 'system_design';

-- Create index for solution approaches queries
CREATE INDEX IF NOT EXISTS idx_challenges_solution_approaches 
ON challenges USING gin (solution_approaches);

-- Create index for community discussion enabled
CREATE INDEX IF NOT EXISTS idx_challenges_community_discussion 
ON challenges (community_discussion_enabled);