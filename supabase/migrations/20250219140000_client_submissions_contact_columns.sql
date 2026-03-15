-- Add contactname, contactemail, contactphone for new schema
-- Handles existing DBs that had name, email, phone

ALTER TABLE client_submissions ADD COLUMN IF NOT EXISTS contactname TEXT;
ALTER TABLE client_submissions ADD COLUMN IF NOT EXISTS contactemail TEXT;
ALTER TABLE client_submissions ADD COLUMN IF NOT EXISTS contactphone TEXT;

-- Copy from legacy columns if they exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='client_submissions' AND column_name='name') THEN
    UPDATE client_submissions 
    SET contactname = COALESCE(contactname, name),
        contactemail = COALESCE(contactemail, email),
        contactphone = COALESCE(contactphone, phone);
  END IF;
END $$;
