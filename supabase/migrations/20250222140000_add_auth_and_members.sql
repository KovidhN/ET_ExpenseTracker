/*
  # Add Auth Support and Group Memberships

  1. New Tables
    - `group_members`: Tracks which users belong to which groups.
      - `id` (uuid, primary key)
      - `group_id` (uuid, references groups)
      - `user_id` (uuid, references auth.users)
      - `joined_at` (timestamp)

  2. Changes to Groups
    - Add `created_by` column to `groups` table to track the admin.

  3. Security
    - Enable RLS on new tables.
    - Add policies for reading/writing group memberships.
*/

-- Add created_by to groups if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'groups' AND column_name = 'created_by') THEN
    ALTER TABLE public.groups ADD COLUMN created_by UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Create group_members table
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Enable RLS
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Policies for group_members
-- Users can see memberships for groups they belong to
CREATE POLICY "Users can view their own memberships" 
ON public.group_members FOR SELECT 
USING (auth.uid() = user_id);

-- Users can join groups (insert their own membership)
CREATE POLICY "Users can join groups" 
ON public.group_members FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Update Groups Policies to allow authenticated creation
DROP POLICY IF EXISTS "Enable read access for all users" ON public.groups;
CREATE POLICY "Enable read access for all users" ON public.groups FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" 
ON public.groups FOR INSERT 
WITH CHECK (auth.uid() = created_by);

-- Allow admins to update/delete their groups
CREATE POLICY "Admins can update their groups" 
ON public.groups FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Admins can delete their groups" 
ON public.groups FOR DELETE 
USING (auth.uid() = created_by);
