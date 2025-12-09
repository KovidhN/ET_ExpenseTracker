/*
  # Fix Schema for Auth and Group Members
  
  ## Query Description:
  1. Creates `group_members` table to track user memberships.
  2. Adds `created_by` to `groups` to support Admin privileges.
  3. Enables RLS (Row Level Security) for secure access.

  ## Metadata:
  - Schema-Category: Structural
  - Impact-Level: High
  - Requires-Backup: false
  - Reversible: true
*/

-- 1. Add created_by to groups if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'groups' AND column_name = 'created_by') THEN
        ALTER TABLE "public"."groups" ADD COLUMN "created_by" uuid REFERENCES auth.users(id);
    END IF;
END $$;

-- 2. Create group_members table if it doesn't exist
CREATE TABLE IF NOT EXISTS "public"."group_members" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "group_id" uuid REFERENCES "public"."groups"("id") ON DELETE CASCADE NOT NULL,
    "user_id" uuid REFERENCES auth.users(id) NOT NULL,
    "created_at" timestamptz DEFAULT now(),
    UNIQUE("group_id", "user_id")
);

-- 3. Enable RLS
ALTER TABLE "public"."groups" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."group_members" ENABLE ROW LEVEL SECURITY;

-- 4. Policies for GROUPS
-- Allow authenticated users to view all groups (needed to join by code)
DROP POLICY IF EXISTS "Authenticated users can view groups" ON "public"."groups";
CREATE POLICY "Authenticated users can view groups" ON "public"."groups"
    FOR SELECT TO authenticated
    USING (true);

-- Allow users to create groups (and automatically become admin via code logic)
DROP POLICY IF EXISTS "Users can create groups" ON "public"."groups";
CREATE POLICY "Users can create groups" ON "public"."groups"
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = created_by);

-- Allow Admins to update/delete their groups
DROP POLICY IF EXISTS "Admins can update groups" ON "public"."groups";
CREATE POLICY "Admins can update groups" ON "public"."groups"
    FOR UPDATE TO authenticated
    USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Admins can delete groups" ON "public"."groups";
CREATE POLICY "Admins can delete groups" ON "public"."groups"
    FOR DELETE TO authenticated
    USING (auth.uid() = created_by);

-- 5. Policies for GROUP_MEMBERS
-- Users can view their own memberships
DROP POLICY IF EXISTS "Users can view own memberships" ON "public"."group_members";
CREATE POLICY "Users can view own memberships" ON "public"."group_members"
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

-- Users can join groups (insert themselves)
DROP POLICY IF EXISTS "Users can join groups" ON "public"."group_members";
CREATE POLICY "Users can join groups" ON "public"."group_members"
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());
