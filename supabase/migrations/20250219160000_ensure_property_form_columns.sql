-- Ensure all "List a New Property" form fields exist in properties table
-- Form fields: title, titleEs, location, locationEs, price, description, descriptionEs,
-- type, beds, baths, parking, area, listingType, pricePeriod, image, images, features,
-- ownershipYears, timeToAttractions

-- ownership_years and time_to_attractions are in initial schema; ensure they exist
ALTER TABLE properties ADD COLUMN IF NOT EXISTS ownership_years TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS time_to_attractions TEXT;

COMMENT ON COLUMN properties.ownership_years IS 'Years owned by current owner or "New Construction"';
COMMENT ON COLUMN properties.time_to_attractions IS 'Time to main attractions (e.g., 5 mins to beach)';
