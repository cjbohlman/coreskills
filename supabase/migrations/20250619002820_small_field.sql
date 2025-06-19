/*
  # Add Code Review Learning Path and Challenges

  1. New Enum Value
    - Add 'code_review' to challenge_type enum
    
  2. New Learning Path
    - `Code Review Mastery` - Focus on identifying and fixing code issues
    - Icon: `search` for code review representation
    - Order index: 5 (after existing paths)

  3. New Challenges
    - Basic Code Quality Issues (Easy)
    - Input Validation Vulnerabilities (Medium)
    - Performance and Memory Issues (Hard)
    - Concurrency and Race Conditions (Hard)
    - Architecture and Design Patterns (Hard)

  4. Security
    - Enable RLS on all tables (already enabled)
    - Existing policies will cover new data
*/

-- Add code_review to challenge_type enum if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'code_review' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'challenge_type')
  ) THEN
    ALTER TYPE challenge_type ADD VALUE 'code_review';
  END IF;
END $$;

-- Insert Code Review learning path
INSERT INTO learning_paths (title, description, icon, order_index) VALUES 
(
  'Code Review Mastery',
  'Master the art of code review by identifying and fixing common programming issues. Learn to spot security vulnerabilities, performance bottlenecks, design pattern misuse, and maintainability problems.',
  'search',
  5
) ON CONFLICT DO NOTHING;