-- Create enum types
CREATE TYPE challenge_difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE progress_status AS ENUM ('attempted', 'completed');

-- Create challenges table
CREATE TABLE challenges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    difficulty challenge_difficulty NOT NULL,
    initial_code TEXT NOT NULL,
    solution_code TEXT NOT NULL,
    test_cases JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create user progress table
CREATE TABLE user_progress (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    status progress_status NOT NULL DEFAULT 'attempted',
    attempts INTEGER NOT NULL DEFAULT 0,
    last_submission TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (user_id, challenge_id)
);

-- Add some initial challenges
INSERT INTO challenges (title, description, difficulty, initial_code, solution_code, test_cases) VALUES
(
    'Fix the Array Sum Function',
    'The following function is supposed to calculate the sum of all numbers in an array, but it has a bug. Find and fix the issue.',
    'easy',
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
    ]'
),
(
    'Debug the String Reversal',
    'This function should reverse a string, but it''s not working correctly. Debug and fix the implementation.',
    'easy',
    'function reverseString(str) {
  let reversed = "";
  for (let i = 0; i <= str.length; i++) {
    reversed = str[i] + reversed;
  }
  return reversed;
}',
    'function reverseString(str) {
  let reversed = "";
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}',
    '[
        {
            "input": "hello",
            "expected_output": "olleh",
            "description": "Reverse a simple word"
        },
        {
            "input": "JavaScript",
            "expected_output": "tpircSavaJ",
            "description": "Reverse a word with mixed case"
        },
        {
            "input": "",
            "expected_output": "",
            "description": "Reverse an empty string"
        }
    ]'
),
(
    'Fix the Palindrome Checker',
    'The palindrome checker function has multiple bugs. Find and fix them all.',
    'medium',
    'function isPalindrome(str) {
  str = str.toLowerCase();
  for (let i = 0; i < str.length; i++) {
    if (str[i] !== str[str.length - i]) {
      return false;
    }
  }
  return true;
}',
    'function isPalindrome(str) {
  str = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  for (let i = 0; i < str.length / 2; i++) {
    if (str[i] !== str[str.length - 1 - i]) {
      return false;
    }
  }
  return true;
}',
    '[
        {
            "input": "racecar",
            "expected_output": true,
            "description": "Simple palindrome"
        },
        {
            "input": "A man, a plan, a canal: Panama",
            "expected_output": true,
            "description": "Complex palindrome with punctuation"
        },
        {
            "input": "race a car",
            "expected_output": false,
            "description": "Non-palindrome with spaces"
        }
    ]'
);

-- Create indexes
CREATE INDEX idx_challenges_difficulty ON challenges(difficulty);
CREATE INDEX idx_user_progress_status ON user_progress(status);
CREATE INDEX idx_user_progress_user ON user_progress(user_id);