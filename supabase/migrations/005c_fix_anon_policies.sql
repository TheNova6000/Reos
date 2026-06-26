-- STEP 3: Fix anon policies for client websites
-- Run this in Supabase SQL Editor

-- Drop any existing anon policies that might conflict
DROP POLICY IF EXISTS "anon_leads_insert" ON leads;
DROP POLICY IF EXISTS "anon_projects_select" ON projects;
DROP POLICY IF EXISTS "anon_properties_select" ON properties;
DROP POLICY IF EXISTS "anon_settings_select" ON settings;

-- Recreate anon policies — these allow client websites to read data and submit leads
CREATE POLICY "anon_leads_insert" ON leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_leads_select" ON leads FOR SELECT TO anon USING (true);
CREATE POLICY "anon_projects_select" ON projects FOR SELECT TO anon USING (true);
CREATE POLICY "anon_properties_select" ON properties FOR SELECT TO anon USING (true);
CREATE POLICY "anon_settings_select" ON settings FOR SELECT TO anon USING (true);
CREATE POLICY "anon_activities_select" ON activities FOR SELECT TO anon USING (true);
CREATE POLICY "anon_bookings_select" ON bookings FOR SELECT TO anon USING (true);
