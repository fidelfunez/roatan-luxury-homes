-- Add listing_type and price_period to client_submissions for rental property submissions

ALTER TABLE client_submissions 
ADD COLUMN IF NOT EXISTS listing_type TEXT DEFAULT 'sale';

ALTER TABLE client_submissions 
ADD COLUMN IF NOT EXISTS price_period TEXT;
