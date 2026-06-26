export type PropertyStatus = "available" | "reserved" | "sold" | "blocked" | "under_registration";
export type PropertyFacing = "north" | "south" | "east" | "west" | "north_east" | "north_west" | "south_east" | "south_west" | "corner";
export type PropertyType = "plot" | "apartment" | "villa" | "commercial" | "farmland";
export type AreaUnit = "sq_ft" | "sq_yards" | "sq_meters" | "acres" | "cents" | "guntas";
export type ProjectStatus = "upcoming" | "ongoing" | "completed" | "sold_out";
export type LeadStatus = "new" | "contacted" | "property_shared" | "site_visit" | "negotiation" | "booked" | "registration" | "possession" | "lost";
export type LeadTemperature = "hot" | "warm" | "cold";
export type LeadSource = "website" | "walkin" | "referral" | "portal_99acres" | "portal_magicbricks" | "whatsapp" | "phone" | "other";
export type ActivityType = "call" | "site_visit" | "note" | "whatsapp" | "email" | "meeting" | "follow_up" | "property_shared";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "registered";
export type PaymentMode = "cash" | "cheque" | "bank_transfer" | "upi" | "demand_draft";
export type PaymentStatus = "pending" | "received" | "bounced" | "refunded";
export type DocumentType =
  // Project — Land & Title
  | "title_deed"
  | "encumbrance_certificate"
  | "revenue_record"
  | "land_conversion_order"
  // Project — Planning & Approvals
  | "layout_approval"
  | "building_plan_sanction"
  | "commencement_certificate"
  | "rera_certificate"
  | "environmental_clearance"
  | "fire_noc"
  | "noc_other"
  | "development_agreement"
  // Property-level
  | "plot_demarcation"
  | "floor_plan"
  | "allotment_letter"
  | "property_tax_receipt"
  // Buyer KYC
  | "kyc_aadhaar"
  | "kyc_pan"
  | "kyc_address_proof"
  | "kyc_photo"
  | "kyc_income_proof"
  | "power_of_attorney"
  // Transaction
  | "booking_form"
  | "cost_sheet"
  | "agreement_of_sale"
  | "sale_deed"
  | "stamp_duty_receipt"
  | "registration_receipt"
  | "tds_form_26qb"
  | "tds_certificate_16b"
  | "payment_receipt"
  | "demand_letter"
  | "possession_letter"
  // Compliance
  | "rera_quarterly_update"
  | "escrow_statement"
  | "completion_certificate"
  | "occupancy_certificate"
  // Marketing
  | "brochure"
  | "layout_plan"
  | "price_sheet"
  // Legacy / catch-all
  | "dtcp_approval"
  | "kyc"
  | "agreement"
  | "receipt"
  | "other";

export type DocumentVerificationStatus = "pending" | "verified" | "rejected" | "expired";
export type UserRole = "admin" | "agent" | "viewer" | "superadmin";
export type TenantStatus = "active" | "suspended" | "cancelled";
export type LayoutType = "plot" | "apartment";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: TenantStatus;
  created_at: string;
  updated_at: string;
}

export interface LayoutConfig {
  type: LayoutType;
  roads?: { x1: number; y1: number; x2: number; y2: number; width: number; label?: string }[];
  entrance?: { x: number; y: number; label?: string };
  compass?: "N" | "S" | "E" | "W";
  gridRows?: number;
  gridCols?: number;
}

export interface Project {
  id: string;
  tenant_id: string;
  name: string;
  slug: string;
  location: string;
  city: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  rera_number: string | null;
  rera_state: string | null;
  status: ProjectStatus;
  total_units: number;
  sold_units: number;
  price_range_min: number | null;
  price_range_max: number | null;
  amenities: string[];
  images: string[];
  thumbnail: string | null;
  layout_config: LayoutConfig | null;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  tenant_id: string;
  project_id: string;
  plot_number: string;
  area: number;
  area_unit: AreaUnit;
  facing: PropertyFacing;
  price: number;
  price_per_unit: number | null;
  status: PropertyStatus;
  property_type: PropertyType;
  dimensions: string | null;
  floor_number: number | null;
  layout_x: number | null;
  layout_y: number | null;
  description: string | null;
  features: string[];
  images: string[];
  created_at: string;
  updated_at: string;
  project?: Project;
}

export interface FamilyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface Lead {
  id: string;
  tenant_id: string;
  name: string;
  phone: string;
  email: string | null;
  source: LeadSource;
  status: LeadStatus;
  temperature: LeadTemperature;
  assigned_agent_id: string | null;
  budget_min: number | null;
  budget_max: number | null;
  preferred_location: string | null;
  preferred_facing: PropertyFacing | null;
  preferred_type: PropertyType | null;
  notes: string | null;
  next_action: string | null;
  properties_interested: string[];
  family_contacts: FamilyContact[];
  next_follow_up: string | null;
  last_contacted_at: string | null;
  created_at: string;
  updated_at: string;
  assigned_agent?: UserProfile;
  activities?: Activity[];
}

export interface SiteVisitFeedback {
  project_id: string;
  plots_shown: string[];
  rating: number;
  feedback: string;
  attendees: string[];
}

export interface Activity {
  id: string;
  tenant_id: string;
  lead_id: string;
  activity_type: ActivityType;
  description: string;
  outcome: string | null;
  scheduled_for: string | null;
  is_completed: boolean;
  site_visit_feedback: SiteVisitFeedback | null;
  created_by: string;
  created_at: string;
  creator?: UserProfile;
}

export interface Booking {
  id: string;
  tenant_id: string;
  lead_id: string;
  property_id: string;
  booking_date: string;
  token_amount: number;
  total_price: number;
  agreement_date: string | null;
  agreement_document_url: string | null;
  lawyer_name: string | null;
  stamp_duty: number | null;
  registration_date: string | null;
  possession_date: string | null;
  handover_date: string | null;
  handover_checklist: { item: string; done: boolean }[];
  status: BookingStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  lead?: Lead;
  property?: Property;
  payments?: Payment[];
}

export interface Payment {
  id: string;
  tenant_id: string;
  booking_id: string;
  amount: number;
  payment_date: string;
  payment_mode: PaymentMode;
  tds_amount: number;
  receipt_number: string | null;
  status: PaymentStatus;
  notes: string | null;
  created_at: string;
  booking?: Booking;
}

export interface PaymentSchedule {
  id: string;
  tenant_id: string;
  booking_id: string;
  installment_number: number;
  amount: number;
  due_date: string;
  status: "pending" | "paid" | "overdue";
  payment_id: string | null;
  created_at: string;
}

export interface Document {
  id: string;
  tenant_id: string;
  name: string;
  document_type: DocumentType;
  file_url: string;
  file_size: number | null;
  mime_type: string | null;
  property_id: string | null;
  project_id: string | null;
  lead_id: string | null;
  booking_id: string | null;
  uploaded_by: string;
  verification_status: DocumentVerificationStatus;
  expiry_date: string | null;
  is_mandatory: boolean;
  notes: string | null;
  created_at: string;
}

export interface UserProfile {
  id: string;
  tenant_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Settings {
  id: string;
  tenant_id: string;
  company_name: string;
  company_logo: string | null;
  company_phone: string | null;
  company_email: string | null;
  company_address: string | null;
  company_website: string | null;
  primary_color: string;
  currency_symbol: string;
  tds_percentage: number;
  auto_assign_leads?: boolean;
  created_at: string;
  updated_at: string;
}

export type NotificationType = "overdue_followup" | "stale_lead" | "unassigned_lead" | "overdue_payment";

export interface DashboardNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  href: string;
  priority: "high" | "medium" | "low";
  created_at: string;
}
