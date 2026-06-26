-- Fix: Drop all policies first, then recreate
-- Run this if 001 partially succeeded

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view all data" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated users can insert own profile" ON user_profiles;

DROP POLICY IF EXISTS "Authenticated read projects" ON projects;
DROP POLICY IF EXISTS "Admin/agent manage projects" ON projects;
DROP POLICY IF EXISTS "Public read projects" ON projects;

DROP POLICY IF EXISTS "Authenticated read properties" ON properties;
DROP POLICY IF EXISTS "Admin/agent manage properties" ON properties;
DROP POLICY IF EXISTS "Public read properties" ON properties;

DROP POLICY IF EXISTS "Authenticated read leads" ON leads;
DROP POLICY IF EXISTS "Admin/agent manage leads" ON leads;

DROP POLICY IF EXISTS "Authenticated read activities" ON activities;
DROP POLICY IF EXISTS "Admin/agent manage activities" ON activities;

DROP POLICY IF EXISTS "Authenticated read bookings" ON bookings;
DROP POLICY IF EXISTS "Admin/agent manage bookings" ON bookings;

DROP POLICY IF EXISTS "Authenticated read payments" ON payments;
DROP POLICY IF EXISTS "Admin/agent manage payments" ON payments;

DROP POLICY IF EXISTS "Authenticated read documents" ON documents;
DROP POLICY IF EXISTS "Admin/agent manage documents" ON documents;

DROP POLICY IF EXISTS "Authenticated read settings" ON settings;
DROP POLICY IF EXISTS "Admin manage settings" ON settings;

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Recreate all policies
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

-- Public access (no login required for browsing)
CREATE POLICY "Public read projects" ON projects FOR SELECT TO anon USING (status != 'upcoming');
CREATE POLICY "Public read properties" ON properties FOR SELECT TO anon USING (true);
