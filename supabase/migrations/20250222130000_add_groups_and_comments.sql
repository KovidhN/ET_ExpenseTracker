/*
  # Add Groups and Comments Support

  ## Query Description:
  1. Creates `groups` table to manage separate expense rooms.
  2. Creates `comments` table for group discussions.
  3. Adds `group_id` to `people` and `expenses` to link them to specific groups.
  
  ## Metadata:
  - Schema-Category: Structural
  - Impact-Level: Medium
  - Requires-Backup: false
  - Reversible: true
  
  ## Structure Details:
  - New Table: groups (id, code, name, created_at)
  - New Table: comments (id, group_id, author_name, content, created_at)
  - Modified Table: people (added group_id)
  - Modified Table: expenses (added group_id)
*/

-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add group_id to people
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'people' AND column_name = 'group_id') THEN
    ALTER TABLE people ADD COLUMN group_id UUID REFERENCES groups(id) ON DELETE CASCADE;
    CREATE INDEX idx_people_group ON people(group_id);
  END IF;
END $$;

-- Add group_id to expenses
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'expenses' AND column_name = 'group_id') THEN
    ALTER TABLE expenses ADD COLUMN group_id UUID REFERENCES groups(id) ON DELETE CASCADE;
    CREATE INDEX idx_expenses_group ON expenses(group_id);
  END IF;
END $$;

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_comments_group ON comments(group_id);
