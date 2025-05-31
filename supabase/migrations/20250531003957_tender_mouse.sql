-- Create learning paths table
CREATE TABLE learning_paths (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add path_id to challenges table
ALTER TABLE challenges 
ADD COLUMN path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
ADD COLUMN order_index INTEGER NOT NULL DEFAULT 0;

-- Create index for challenge ordering
CREATE INDEX idx_challenges_path_order ON challenges(path_id, order_index);

-- Insert initial learning paths
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
);

-- Update existing challenges to belong to the Debugging Fundamentals path
UPDATE challenges 
SET path_id = (SELECT id FROM learning_paths WHERE title = 'Debugging Fundamentals'),
    order_index = CASE 
        WHEN title LIKE '%Array Sum%' THEN 1
        WHEN title LIKE '%String Reversal%' THEN 2
        WHEN title LIKE '%Palindrome%' THEN 3
        ELSE 0
    END;