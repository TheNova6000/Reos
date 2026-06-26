-- STEP 2: Run this after 005a in Supabase SQL Editor
-- Drops old "see everything" policies, creates tenant-scoped ones

-- Drop ALL old policies
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

-- Drop dev anon policies (from 003)
DROP POLICY IF EXISTS "Dev anon read leads" ON leads;
DROP POLICY IF EXISTS "Dev anon write leads" ON leads;
DROP POLICY IF EXISTS "Dev anon update leads" ON leads;
DROP POLICY IF EXISTS "Dev anon read activities" ON activities;
DROP POLICY IF EXISTS "Dev anon write activities" ON activities;
DROP POLICY IF EXISTS "Dev anon read bookings" ON bookings;
DROP POLICY IF EXISTS "Dev anon write bookings" ON bookings;
DROP POLICY IF EXISTS "Dev anon update bookings" ON bookings;
DROP POLICY IF EXISTS "Dev anon read payments" ON payments;
DROP POLICY IF EXISTS "Dev anon write payments" ON payments;
DROP POLICY IF EXISTS "Dev anon read documents" ON documents;
DROP POLICY IF EXISTS "Dev anon write documents" ON documents;
DROP POLICY IF EXISTS "Dev anon read settings" ON settings;
DROP POLICY IF EXISTS "Dev anon update settings" ON settings;
DROP POLICY IF EXISTS "Dev anon write properties" ON properties;
DROP POLICY IF EXISTS "Dev anon update properties" ON properties;
DROP POLICY IF EXISTS "Dev anon write projects" ON projects;
DROP POLICY IF EXISTS "Dev anon update projects" ON projects;

-- ============================================
-- NEW: Tenant-scoped policies
-- Each company can ONLY see their own data
-- ============================================

-- tenants: users see only their own tenant
CREATE POLICY "tenant_select" ON tenants FOR SELECT TO authenticated
  USING (id = public.get_tenant_id());

-- user_profiles: see own tenant's team
CREATE POLICY "tenant_profiles_select" ON user_profiles FOR SELECT TO authenticated
  USING (tenant_id = public.get_tenant_id());
CREATE POLICY "own_profile_insert" ON user_profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());
CREATE POLICY "own_profile_update" ON user_profiles FOR UPDATE TO authenticated
  USING (id = auth.uid());

-- settings: tenant-scoped
CREATE POLICY "tenant_settings_select" ON settings FOR SELECT TO authenticated
  USING (tenant_id = public.get_tenant_id());
CREATE POLICY "tenant_settings_insert" ON settings FOR INSERT TO authenticated
  WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY "tenant_settings_update" ON settings FOR UPDATE TO authenticated
  USING (tenant_id = public.get_tenant_id());

-- projects: tenant-scoped
CREATE POLICY "tenant_projects_select" ON projects FOR SELECT TO authenticated
  USING (tenant_id = public.get_tenant_id());
CREATE POLICY "tenant_projects_insert" ON projects FOR INSERT TO authenticated
  WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY "tenant_projects_update" ON projects FOR UPDATE TO authenticated
  USING (tenant_id = public.get_tenant_id());
CREATE POLICY "tenant_projects_delete" ON projects FOR DELETE TO authenticated
  USING (tenant_id = public.get_tenant_id());

-- properties: tenant-scoped
CREATE POLICY "tenant_properties_select" ON properties FOR SELECT TO authenticated
  USING (tenant_id = public.get_tenant_id());
CREATE POLICY "tenant_properties_insert" ON properties FOR INSERT TO authenticated
  WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY "tenant_properties_update" ON properties FOR UPDATE TO authenticated
  USING (tenant_id = public.get_tenant_id());
CREATE POLICY "tenant_properties_delete" ON properties FOR DELETE TO authenticated
  USING (tenant_id = public.get_tenant_id());

-- leads: tenant-scoped
CREATE POLICY "tenant_leads_select" ON leads FOR SELECT TO authenticated
  USING (tenant_id = public.get_tenant_id());
CREATE POLICY "tenant_leads_insert" ON leads FOR INSERT TO authenticated
  WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY "tenant_leads_update" ON leads FOR UPDATE TO authenticated
  USING (tenant_id = public.get_tenant_id());
CREATE POLICY "tenant_leads_delete" ON leads FOR DELETE TO authenticated
  USING (tenant_id = public.get_tenant_id());

-- activities: tenant-scoped
CREATE POLICY "tenant_activities_select" ON activities FOR SELECT TO authenticated
  USING (tenant_id = public.get_tenant_id());
CREATE POLICY "tenant_activities_insert" ON activities FOR INSERT TO authenticated
  WITH CHECK (tenant_id = public.get_tenant_id());

-- bookings: tenant-scoped
CREATE POLICY "tenant_bookings_select" ON bookings FOR SELECT TO authenticated
  USING (tenant_id = public.get_tenant_id());
CREATE POLICY "tenant_bookings_insert" ON bookings FOR INSERT TO authenticated
  WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY "tenant_bookings_update" ON bookings FOR UPDATE TO authenticated
  USING (tenant_id = public.get_tenant_id());

-- payments: tenant-scoped
CREATE POLICY "tenant_payments_select" ON payments FOR SELECT TO authenticated
  USING (tenant_id = public.get_tenant_id());
CREATE POLICY "tenant_payments_insert" ON payments FOR INSERT TO authenticated
  WITH CHECK (tenant_id = public.get_tenant_id());

-- documents: tenant-scoped
CREATE POLICY "tenant_documents_select" ON documents FOR SELECT TO authenticated
  USING (tenant_id = public.get_tenant_id());
CREATE POLICY "tenant_documents_insert" ON documents FOR INSERT TO authenticated
  WITH CHECK (tenant_id = public.get_tenant_id());

-- ============================================
-- Anon policies (for client websites)
-- ============================================
CREATE POLICY "anon_projects_select" ON projects FOR SELECT TO anon
  USING (status != 'upcoming');
CREATE POLICY "anon_properties_select" ON properties FOR SELECT TO anon
  USING (true);
CREATE POLICY "anon_settings_select" ON settings FOR SELECT TO anon
  USING (true);
CREATE POLICY "anon_leads_insert" ON leads FOR INSERT TO anon
  WITH CHECK (true);
