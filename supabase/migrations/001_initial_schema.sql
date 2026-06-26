-- REOS Database Schema
-- Vision Infra Tech - Real Estate Operating System

-- Enable PostGIS for geospatial queries
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================
-- Settings (company configuration - SaaS-ready)
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL DEFAULT 'Vision Infra Tech',
  company_logo TEXT,
  company_phone TEXT,
  company_email TEXT,
  company_address TEXT,
  company_website TEXT,
  primary_color TEXT NOT NULL DEFAULT '#1e40af',
  currency_symbol TEXT NOT NULL DEFAULT '₹',
  tds_percentage NUMERIC(5,2) NOT NULL DEFAULT 1.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- User Profiles
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'agent' CHECK (role IN ('admin', 'agent', 'viewer')),
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- Projects
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  description TEXT,
  rera_number TEXT,
  rera_state TEXT,
  status TEXT NOT NULL DEFAULT 'ongoing' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'sold_out')),
  total_units INTEGER NOT NULL DEFAULT 0,
  sold_units INTEGER NOT NULL DEFAULT 0,
  price_range_min BIGINT,
  price_range_max BIGINT,
  amenities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  thumbnail TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- Properties (plots / units)
-- ============================================
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  plot_number TEXT NOT NULL,
  area NUMERIC(12,2) NOT NULL,
  area_unit TEXT NOT NULL DEFAULT 'sq_yards' CHECK (area_unit IN ('sq_ft', 'sq_yards', 'sq_meters', 'acres', 'cents', 'guntas')),
  facing TEXT NOT NULL CHECK (facing IN ('north', 'south', 'east', 'west', 'north_east', 'north_west', 'south_east', 'south_west', 'corner')),
  price BIGINT NOT NULL,
  price_per_unit BIGINT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold', 'blocked', 'under_registration')),
  property_type TEXT NOT NULL DEFAULT 'plot' CHECK (property_type IN ('plot', 'apartment', 'villa', 'commercial', 'farmland')),
  dimensions TEXT,
  floor_number INTEGER,
  layout_x DOUBLE PRECISION,
  layout_y DOUBLE PRECISION,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, plot_number)
);

-- ============================================
-- Leads
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  source TEXT NOT NULL DEFAULT 'website' CHECK (source IN ('website', 'walkin', 'referral', 'portal_99acres', 'portal_magicbricks', 'whatsapp', 'phone', 'other')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'site_visit', 'negotiation', 'booked', 'lost')),
  assigned_agent_id UUID REFERENCES user_profiles(id),
  budget_min BIGINT,
  budget_max BIGINT,
  preferred_location TEXT,
  preferred_facing TEXT,
  preferred_type TEXT,
  notes TEXT,
  properties_interested UUID[] DEFAULT '{}',
  next_follow_up TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- Activities (lead timeline)
-- ============================================
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('call', 'site_visit', 'note', 'whatsapp', 'email', 'meeting', 'follow_up')),
  description TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- Bookings
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id),
  property_id UUID NOT NULL REFERENCES properties(id),
  booking_date DATE NOT NULL DEFAULT CURRENT_DATE,
  token_amount BIGINT NOT NULL DEFAULT 0,
  total_price BIGINT NOT NULL,
  agreement_date DATE,
  registration_date DATE,
  possession_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'registered')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- Payments
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount BIGINT NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_mode TEXT NOT NULL CHECK (payment_mode IN ('cash', 'cheque', 'bank_transfer', 'upi', 'demand_draft')),
  tds_amount BIGINT NOT NULL DEFAULT 0,
  receipt_number TEXT,
  status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('pending', 'received', 'bounced', 'refunded')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- Documents
-- ============================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('sale_deed', 'dtcp_approval', 'rera_certificate', 'layout_plan', 'brochure', 'kyc', 'agreement', 'receipt', 'other')),
  file_url TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  uploaded_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_properties_project ON properties(project_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_agent ON leads(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_leads_follow_up ON leads(next_follow_up);
CREATE INDEX IF NOT EXISTS idx_activities_lead ON activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_bookings_lead ON bookings(lead_id);
CREATE INDEX IF NOT EXISTS idx_bookings_property ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_documents_project ON documents(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_property ON documents(property_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type);

-- ============================================
-- Row Level Security (SaaS-ready pattern)
-- ============================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- For now, authenticated users can access everything (single-tenant)
-- When converting to SaaS, add organization_id column and filter by it
CREATE POLICY "Authenticated users can view all data" ON user_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update own profile" ON user_profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Authenticated users can insert own profile" ON user_profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

CREATE POLICY "Authenticated read projects" ON projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/agent manage projects" ON projects FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated read properties" ON properties FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/agent manage properties" ON properties FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated read leads" ON leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/agent manage leads" ON leads FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated read activities" ON activities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/agent manage activities" ON activities FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated read bookings" ON bookings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/agent manage bookings" ON bookings FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated read payments" ON payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/agent manage payments" ON payments FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated read documents" ON documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/agent manage documents" ON documents FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated read settings" ON settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manage settings" ON settings FOR ALL TO authenticated USING (true);

-- Public access for website (property listings visible to everyone)
CREATE POLICY "Public read projects" ON projects FOR SELECT TO anon USING (status != 'upcoming');
CREATE POLICY "Public read properties" ON properties FOR SELECT TO anon USING (true);
