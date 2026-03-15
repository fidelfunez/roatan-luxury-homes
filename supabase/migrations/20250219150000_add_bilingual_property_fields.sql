-- Add Spanish fields for bilingual property content
-- title, description, location remain as English; _es suffix for Spanish

ALTER TABLE properties ADD COLUMN IF NOT EXISTS title_es TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS description_es TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS location_es TEXT;

COMMENT ON COLUMN properties.title_es IS 'Spanish title';
COMMENT ON COLUMN properties.description_es IS 'Spanish description';
COMMENT ON COLUMN properties.location_es IS 'Spanish location';
