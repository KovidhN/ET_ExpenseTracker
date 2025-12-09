/*
  # Add date column to expenses table

  ## Query Description:
  This migration adds a 'date' column to the existing 'expenses' table. 
  This is required because the new UI allows users to select a custom date for expenses, 
  which is distinct from the system-generated 'created_at' timestamp.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true

  ## Structure Details:
  - Table: expenses
  - New Column: date (DATE type, defaults to CURRENT_DATE)
*/

ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS date DATE DEFAULT CURRENT_DATE;
