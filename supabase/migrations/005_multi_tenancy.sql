-- ============================================
-- REOS Multi-Tenancy Migration
-- Creates tenants table, adds tenant_id to all data tables,
-- replaces all RLS policies with tenant-scoped versions
-- ============================================

-- ============================================
-- 1. Create tenants table
-- ============================================
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tenants_slug ON tenants(slug);
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. Create default tenant for existing data
-- ============================================
INSERT INTO tenants (id, name, slug, status)
VALUES ('00000000-0000-0000-0000-000000000001', 'Vision Infra Tech', 'vision-infra-tech', 'active')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 3. Add tenant_id to all data tables
-- ============================================
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE settings ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE activities ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);

-- ============================================
-- 4. Backfill existing data to default tenant
-- ============================================
UPDATE user_profiles SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE settings SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE projects SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE properties SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE leads SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE activities SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE bookings SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE payments SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE documents SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;

-- ============================================
-- 5. Make tenant_id NOT NULL after backfill
-- ============================================
ALTER TABLE user_profiles ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE settings ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE projects ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE properties ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE leads ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE activities ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE bookings ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE payments ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE documents ALTER COLUMN tenant_id SET NOT NULL;

-- ============================================
-- 6. Add tenant_id indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_user_profiles_tenant ON user_profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_settings_tenant ON settings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_projects_tenant ON projects(tenant_id);
CREATE INDEX IF NOT EXISTS idx_properties_tenant ON properties(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leads_tenant ON leads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_activities_tenant ON activities(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tenant ON bookings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payments_tenant ON payments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_documents_tenant ON documents(tenant_id);

-- ============================================
-- 7. Update unique constraints for multi-tenancy
-- ============================================
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_slug_key;
ALTER TABLE projects ADD CONSTRAINT projects_tenant_slug_unique UNIQUE (tenant_id, slug);

-- Update user_profiles role check to include superadmin
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_role_check
  CHECK (role IN ('admin', 'agent', 'viewer', 'superadmin'));

-- ============================================
-- 8. Create tenant lookup function for RLS
-- ============================================
CREATE OR REPLACE FUNCTION public.get_tenant_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id FROM user_profiles WHERE id = auth.uid()
$$;

-- ============================================
-- 9. Drop ALL old policies (from 001, 002, 003)
-- ============================================

-- user_profiles
DROP POLICY IF EXISTS "Authenticated users can view all data" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated users can insert own profile" ON user_profiles;

-- projects
DROP POLICY IF EXISTS "Authenticated read projects" ON projects;
DROP POLICY IF EXISTS "Admin/agent manage projects" ON projects;
DROP POLICY IF EXISTS "Public read projects" ON projects;
DROP POLICY IF EXISTS "Dev anon write projects" ON projects;
DROP POLICY IF EXISTS "Dev anon update projects" ON projects;

-- properties
DROP POLICY IF EXISTS "Authenticated read properties" ON properties;
DROP POLICY IF EXISTS "Admin/agent manage properties" ON properties;
DROP POLICY IF EXISTS "Public read properties" ON properties;
DROP POLICY IF EXISTS "Dev anon write properties" ON properties;
DROP POLICY IF EXISTS "Dev anon update properties" ON properties;

-- leads
DROP POLICY IF EXISTS "Authenticated read leads" ON leads;
DROP POLICY IF EXISTS "Admin/agent manage leads" ON leads;
DROP POLICY IF EXISTS "Dev anon read leads" ON leads;
DROP POLICY IF EXISTS "Dev anon write leads" ON leads;
DROP POLICY IF EXISTS "Dev anon update leads" ON leads;

-- activities
DROP POLICY IF EXISTS "Authenticated read activities" ON activities;
DROP POLICY IF EXISTS "Admin/agent manage activities" ON activities;
DROP POLICY IF EXISTS "Dev anon read activities" ON activities;
DROP POLICY IF EXISTS "Dev anon write activities" ON activities;

-- bookings
DROP POLICY IF EXISTS "Authenticated read bookings" ON bookings;
DROP POLICY IF EXISTS "Admin/agent manage bookings" ON bookings;
DROP POLICY IF EXISTS "Dev anon read bookings" ON bookings;
DROP POLICY IF EXISTS "Dev anon write bookings" ON bookings;
DROP POLICY IF EXISTS "Dev anon update bookings" ON bookings;

-- payments
DROP POLICY IF EXISTS "Authenticated read payments" ON payments;
DROP POLICY IF EXISTS "Admin/agent manage payments" ON payments;
DROP POLICY IF EXISTS "Dev anon read payments" ON payments;
DROP POLICY IF EXISTS "Dev anon write payments" ON payments;

-- documents
DROP POLICY IF EXISTS "Authenticated read documents" ON documents;
DROP POLICY IF EXISTS "Admin/agent manage documents" ON documents;
DROP POLICY IF EXISTS "Dev anon read documents" ON documents;
DROP POLICY IF EXISTS "Dev anon write documents" ON documents;

-- settings
DROP POLICY IF EXISTS "Authenticated read settings" ON settings;
DROP POLICY IF EXISTS "Admin manage settings" ON settings;
DROP POLICY IF EXISTS "Dev anon read settings" ON settings;
DROP POLICY IF EXISTS "Dev anon update settings" ON settings;

-- ============================================
-- 10. Create new tenant-scoped RLS policies
-- ============================================

-- tenants: users can only see their own tenant
CREATE POLICY "tenant_select" ON tenants FOR SELECT TO authenticated
  USING (id = public.get_tenant_id());

-- user_profiles: see own tenant's team, manage own profile
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

-- projects: tenant-scoped read/write
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
-- 11. Anon policies (for client websites)
-- Client website filters by TENANT_ID env var at query level
-- These are broad safety-net policies
-- ============================================
CREATE POLICY "anon_projects_select" ON projects FOR SELECT TO anon
  USING (status != 'upcoming');
CREATE POLICY "anon_properties_select" ON properties FOR SELECT TO anon
  USING (true);
CREATE POLICY "anon_settings_select" ON settings FOR SELECT TO anon
  USING (true);
CREATE POLICY "anon_leads_insert" ON leads FOR INSERT TO anon
  WITH CHECK (true);
