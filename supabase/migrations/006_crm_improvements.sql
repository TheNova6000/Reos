-- ============================================
-- CRM Improvements Migration
-- New fields for lead temperature, follow-ups,
-- structured activities, post-booking lifecycle
-- ============================================

-- ============================================
-- 1. Lead improvements
-- ============================================
ALTER TABLE leads ADD COLUMN IF NOT EXISTS temperature TEXT DEFAULT 'warm';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS next_action TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS family_contacts JSONB DEFAULT '[]';

-- Update status check to include new pipeline stages
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE leads ADD CONSTRAINT leads_status_check
  CHECK (status IN ('new', 'contacted', 'property_shared', 'site_visit', 'negotiation', 'booked', 'registration', 'possession', 'lost'));

-- ============================================
-- 2. Activity improvements
-- ============================================
ALTER TABLE activities ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMPTZ;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT true;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS outcome TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS site_visit_feedback JSONB;

-- ============================================
-- 3. Booking lifecycle improvements
-- ============================================
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS agreement_document_url TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS lawyer_name TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS stamp_duty BIGINT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS handover_date DATE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS handover_checklist JSONB DEFAULT '[]';

-- ============================================
-- 4. Project layout config (for map system)
-- ============================================
ALTER TABLE projects ADD COLUMN IF NOT EXISTS layout_config JSONB DEFAULT '{}';

-- ============================================
-- 5. Payment schedules table
-- ============================================
CREATE TABLE IF NOT EXISTS payment_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  installment_number INTEGER NOT NULL,
  amount BIGINT NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  payment_id UUID REFERENCES payments(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE payment_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_schedules_select" ON payment_schedules FOR SELECT TO authenticated
  USING (tenant_id = public.get_tenant_id());
CREATE POLICY "tenant_schedules_insert" ON payment_schedules FOR INSERT TO authenticated
  WITH CHECK (tenant_id = public.get_tenant_id());
CREATE POLICY "tenant_schedules_update" ON payment_schedules FOR UPDATE TO authenticated
  USING (tenant_id = public.get_tenant_id());

CREATE INDEX IF NOT EXISTS idx_payment_schedules_booking ON payment_schedules(booking_id);
CREATE INDEX IF NOT EXISTS idx_payment_schedules_tenant ON payment_schedules(tenant_id);
