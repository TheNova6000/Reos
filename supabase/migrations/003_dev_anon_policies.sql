-- DEV ONLY: Allow anon access to all tables until auth is implemented
-- REMOVE these policies before going to production

-- Leads
CREATE POLICY "Dev anon read leads" ON leads FOR SELECT TO anon USING (true);
CREATE POLICY "Dev anon write leads" ON leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Dev anon update leads" ON leads FOR UPDATE TO anon USING (true);

-- Activities
CREATE POLICY "Dev anon read activities" ON activities FOR SELECT TO anon USING (true);
CREATE POLICY "Dev anon write activities" ON activities FOR INSERT TO anon WITH CHECK (true);

-- Bookings
CREATE POLICY "Dev anon read bookings" ON bookings FOR SELECT TO anon USING (true);
CREATE POLICY "Dev anon write bookings" ON bookings FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Dev anon update bookings" ON bookings FOR UPDATE TO anon USING (true);

-- Payments
CREATE POLICY "Dev anon read payments" ON payments FOR SELECT TO anon USING (true);
CREATE POLICY "Dev anon write payments" ON payments FOR INSERT TO anon WITH CHECK (true);

-- Documents
CREATE POLICY "Dev anon read documents" ON documents FOR SELECT TO anon USING (true);
CREATE POLICY "Dev anon write documents" ON documents FOR INSERT TO anon WITH CHECK (true);

-- Settings
CREATE POLICY "Dev anon read settings" ON settings FOR SELECT TO anon USING (true);
CREATE POLICY "Dev anon update settings" ON settings FOR UPDATE TO anon USING (true);

-- Properties write (anon can already read)
CREATE POLICY "Dev anon write properties" ON properties FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Dev anon update properties" ON properties FOR UPDATE TO anon USING (true);

-- Projects write (anon can already read non-upcoming)
CREATE POLICY "Dev anon write projects" ON projects FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Dev anon update projects" ON projects FOR UPDATE TO anon USING (true);
