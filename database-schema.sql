-- Caribbean Lux Realty Database Schema
-- Run this in Supabase SQL Editor

-- Enable Row Level Security (RLS)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Properties Table
CREATE TABLE properties (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2),
  location TEXT,
  type TEXT,
  beds INTEGER,
  baths DECIMAL(3,1),
  parking INTEGER,
  area INTEGER,
  image TEXT,
  images TEXT[], -- Array of image URLs
  features TEXT[], -- Array of features
  ownership_years INTEGER,
  time_to_attractions TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog Posts Table
CREATE TABLE blog_posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  author TEXT,
  featured_image TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Client Submissions Table
CREATE TABLE client_submissions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  property_type TEXT,
  budget DECIMAL(12,2),
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Page Content Table (for CMS)
CREATE TABLE page_content (
  id BIGSERIAL PRIMARY KEY,
  page_name TEXT UNIQUE NOT NULL,
  section_name TEXT NOT NULL,
  content TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_client_submissions_status ON client_submissions(status);
CREATE INDEX idx_page_content_page_section ON page_content(page_name, section_name);

-- Enable Row Level Security on all tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Properties
-- Anyone can read published properties
CREATE POLICY "Properties are viewable by everyone" ON properties
  FOR SELECT USING (true);

-- Only authenticated users can insert/update/delete
CREATE POLICY "Properties are insertable by authenticated users" ON properties
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Properties are updatable by authenticated users" ON properties
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Properties are deletable by authenticated users" ON properties
  FOR DELETE USING (auth.role() = 'authenticated');

-- RLS Policies for Blog Posts
-- Anyone can read published posts
CREATE POLICY "Blog posts are viewable by everyone" ON blog_posts
  FOR SELECT USING (published = true OR auth.role() = 'authenticated');

-- Only authenticated users can insert/update/delete
CREATE POLICY "Blog posts are insertable by authenticated users" ON blog_posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Blog posts are updatable by authenticated users" ON blog_posts
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Blog posts are deletable by authenticated users" ON blog_posts
  FOR DELETE USING (auth.role() = 'authenticated');

-- RLS Policies for Client Submissions
-- Only authenticated users can read submissions
CREATE POLICY "Submissions are viewable by authenticated users" ON client_submissions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Anyone can insert submissions
CREATE POLICY "Submissions are insertable by everyone" ON client_submissions
  FOR INSERT WITH CHECK (true);

-- Only authenticated users can update/delete
CREATE POLICY "Submissions are updatable by authenticated users" ON client_submissions
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Submissions are deletable by authenticated users" ON client_submissions
  FOR DELETE USING (auth.role() = 'authenticated');

-- RLS Policies for Page Content
-- Anyone can read page content
CREATE POLICY "Page content is viewable by everyone" ON page_content
  FOR SELECT USING (true);

-- Only authenticated users can insert/update/delete
CREATE POLICY "Page content is insertable by authenticated users" ON page_content
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Page content is updatable by authenticated users" ON page_content
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Page content is deletable by authenticated users" ON page_content
  FOR DELETE USING (auth.role() = 'authenticated');

-- Insert some sample data
INSERT INTO page_content (page_name, section_name, content) VALUES
('home', 'hero_title', 'Discover Your Dream Property in the Caribbean'),
('home', 'hero_subtitle', 'Luxury real estate opportunities in Roatán, Honduras'),
('services', 'title', 'Our Services'),
('services', 'subtitle', 'Comprehensive real estate solutions tailored to your needs');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 