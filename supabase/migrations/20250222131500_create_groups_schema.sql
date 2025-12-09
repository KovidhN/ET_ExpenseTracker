/*
  # Create Groups and Comments Schema

  ## Query Description:
  This migration sets up the structure for the multi-group functionality.
  1. Creates 'groups' table to store group details and access codes.
  2. Creates 'comments' table for the discussion board.
  3. Modifies 'people' and 'expenses' tables to link them to specific groups.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "High"
  - Requires-Backup: false
  - Reversible: true

  ## Structure Details:
  - New Table: public.groups (id, name, code, created_at)
  - New Table: public.comments (id, group_id, author_name, content, created_at)
  - Alter Table: public.people (add group_id)
  - Alter Table: public.expenses (add group_id)
*/

-- Create groups table
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add group_id to people table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'people' AND column_name = 'group_id') THEN
        ALTER TABLE public.people ADD COLUMN group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add group_id to expenses table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'expenses' AND column_name = 'group_id') THEN
        ALTER TABLE public.expenses ADD COLUMN group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Enable Row Level Security (RLS)
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create open policies (since we are using a shared code system without auth)
-- These policies allow anyone with the anon key to read/write, which is handled by the app logic
DROP POLICY IF EXISTS "Public access to groups" ON public.groups;
CREATE POLICY "Public access to groups" ON public.groups FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access to comments" ON public.comments;
CREATE POLICY "Public access to comments" ON public.comments FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access to people" ON public.people;
CREATE POLICY "Public access to people" ON public.people FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access to expenses" ON public.expenses;
CREATE POLICY "Public access to expenses" ON public.expenses FOR ALL USING (true) WITH CHECK (true);
