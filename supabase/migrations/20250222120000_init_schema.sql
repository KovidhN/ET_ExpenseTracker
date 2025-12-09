/*
  # Initial Schema for Expense Tracker

  ## Query Description:
  This migration creates the necessary tables to store people and expenses.
  It enables Row Level Security (RLS) but allows public access (anon role) 
  since the app does not have a login system. It also enables Realtime 
  subscriptions for these tables.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Medium"
  - Requires-Backup: false
  - Reversible: true

  ## Structure Details:
  - Table: people
    - id: uuid (PK)
    - name: text (Unique)
  - Table: expenses
    - id: uuid (PK)
    - person: text
    - place: text
    - description: text
    - amount: integer
    - expense_date: date

  ## Security Implications:
  - RLS Status: Enabled
  - Policy Changes: Created public access policies for 'anon' role.
*/

-- Create people table
CREATE TABLE IF NOT EXISTS public.people (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT people_pkey PRIMARY KEY (id),
  CONSTRAINT people_name_key UNIQUE (name)
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person text NOT NULL,
  place text NOT NULL,
  description text NOT NULL,
  amount integer NOT NULL,
  expense_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT expenses_pkey PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (since no login system is required)
-- Policy for People
CREATE POLICY "Allow public access to people"
ON public.people
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Policy for Expenses
CREATE POLICY "Allow public access to expenses"
ON public.expenses
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Enable Realtime
-- Note: This requires the publication 'supabase_realtime' to exist (default in Supabase)
ALTER PUBLICATION supabase_realtime ADD TABLE people;
ALTER PUBLICATION supabase_realtime ADD TABLE expenses;
