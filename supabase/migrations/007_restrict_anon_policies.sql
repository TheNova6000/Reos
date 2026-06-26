-- Restrict anon policies: drop all broad SELECT access for unauthenticated requests.
-- vision-infra-tech server components now use the service_role client (admin.ts) which
-- bypasses RLS and applies application-level tenant filtering via TENANT_ID env var.
-- Only INSERT on leads remains for anon — needed so contact form server actions can
-- insert leads without requiring an auth session (they use the anon key via server.ts).

DROP POLICY IF EXISTS "anon_leads_select" ON leads;
DROP POLICY IF EXISTS "anon_projects_select" ON projects;
DROP POLICY IF EXISTS "anon_properties_select" ON properties;
DROP POLICY IF EXISTS "anon_settings_select" ON settings;
DROP POLICY IF EXISTS "anon_activities_select" ON activities;
DROP POLICY IF EXISTS "anon_bookings_select" ON bookings;

-- Keep only INSERT so the submitContactForm / submitPlotApplication server actions work.
-- (Those actions call supabase.from("leads").insert(...) using the server.ts anon client.)
-- The tenant_id is injected by the server action from process.env.TENANT_ID — not by anon RLS.
DROP POLICY IF EXISTS "anon_leads_insert" ON leads;
CREATE POLICY "anon_leads_insert" ON leads FOR INSERT TO anon WITH CHECK (true);
