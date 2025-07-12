-- Update client_submissions table to include all necessary fields
-- Run this in your Supabase SQL editor

-- Add missing columns to client_submissions table
ALTER TABLE client_submissions 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS price DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS type TEXT,
ADD COLUMN IF NOT EXISTS beds INTEGER,
ADD COLUMN IF NOT EXISTS baths DECIMAL(4,1),
ADD COLUMN IF NOT EXISTS parking INTEGER,
ADD COLUMN IF NOT EXISTS area DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS contactName TEXT,
ADD COLUMN IF NOT EXISTS contactEmail TEXT,
ADD COLUMN IF NOT EXISTS contactPhone TEXT,
ADD COLUMN IF NOT EXISTS image TEXT,
ADD COLUMN IF NOT EXISTS images JSONB,
ADD COLUMN IF NOT EXISTS features JSONB;

-- Update RLS policies to allow access to new columns
DROP POLICY IF EXISTS "Enable read access for all users" ON client_submissions;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON client_submissions;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON client_submissions;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON client_submissions;

-- Recreate policies with updated column access
CREATE POLICY "Enable read access for all users" ON client_submissions
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON client_submissions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON client_submissions
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON client_submissions
    FOR DELETE USING (auth.role() = 'authenticated');

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'client_submissions' 
ORDER BY ordinal_position; 