export const APP_NAME = "REOS";
export const APP_DESCRIPTION = "Real Estate Operating System";

export const PROPERTY_STATUS_LABELS: Record<string, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
  blocked: "Blocked",
  under_registration: "Under Registration",
};

export const PROPERTY_STATUS_COLORS: Record<string, string> = {
  available: "bg-emerald-500",
  reserved: "bg-amber-500",
  sold: "bg-red-500",
  blocked: "bg-gray-500",
  under_registration: "bg-blue-500",
};

interface StatusStyle {
  badge: string;
  outline: string;
  icon: string;
  dot: string;
  borderTop: string;
}

const SEMANTIC_COLORS: Record<string, StatusStyle> = {
  emerald: {
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400",
    outline: "border-emerald-500 text-emerald-600 dark:text-emerald-400",
    icon: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    dot: "bg-emerald-500",
    borderTop: "border-t-emerald-500",
  },
  amber: {
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400",
    outline: "border-amber-500 text-amber-600 dark:text-amber-400",
    icon: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    dot: "bg-amber-500",
    borderTop: "border-t-amber-500",
  },
  red: {
    badge: "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400",
    outline: "border-red-500 text-red-600 dark:text-red-400",
    icon: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
    dot: "bg-red-500",
    borderTop: "border-t-red-500",
  },
  blue: {
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400",
    outline: "border-blue-500 text-blue-600 dark:text-blue-400",
    icon: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    dot: "bg-blue-500",
    borderTop: "border-t-blue-500",
  },
  cyan: {
    badge: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-400",
    outline: "border-cyan-500 text-cyan-600 dark:text-cyan-400",
    icon: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400",
    dot: "bg-cyan-500",
    borderTop: "border-t-cyan-500",
  },
  violet: {
    badge: "bg-violet-100 text-violet-800 dark:bg-violet-950/40 dark:text-violet-400",
    outline: "border-violet-500 text-violet-600 dark:text-violet-400",
    icon: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
    dot: "bg-violet-500",
    borderTop: "border-t-violet-500",
  },
  rose: {
    badge: "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400",
    outline: "border-rose-500 text-rose-600 dark:text-rose-400",
    icon: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
    dot: "bg-rose-500",
    borderTop: "border-t-rose-500",
  },
  orange: {
    badge: "bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-400",
    outline: "border-orange-500 text-orange-600 dark:text-orange-400",
    icon: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
    dot: "bg-orange-500",
    borderTop: "border-t-orange-500",
  },
  gray: {
    badge: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    outline: "border-gray-400 text-gray-500 dark:text-gray-400",
    icon: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    dot: "bg-gray-400",
    borderTop: "border-t-gray-400",
  },
  indigo: {
    badge: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400",
    outline: "border-indigo-500 text-indigo-600 dark:text-indigo-400",
    icon: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400",
    dot: "bg-indigo-500",
    borderTop: "border-t-indigo-500",
  },
};

export const PROPERTY_STATUS_STYLES: Record<string, StatusStyle> = {
  available: SEMANTIC_COLORS.emerald,
  reserved: SEMANTIC_COLORS.amber,
  sold: SEMANTIC_COLORS.red,
  blocked: SEMANTIC_COLORS.gray,
  under_registration: SEMANTIC_COLORS.blue,
};

export const LEAD_STATUS_STYLES: Record<string, StatusStyle> = {
  new: SEMANTIC_COLORS.blue,
  contacted: SEMANTIC_COLORS.cyan,
  property_shared: SEMANTIC_COLORS.indigo,
  site_visit: SEMANTIC_COLORS.violet,
  negotiation: SEMANTIC_COLORS.amber,
  booked: SEMANTIC_COLORS.emerald,
  registration: SEMANTIC_COLORS.orange,
  possession: SEMANTIC_COLORS.emerald,
  lost: SEMANTIC_COLORS.gray,
};

export const BOOKING_STATUS_STYLES: Record<string, StatusStyle> = {
  pending: SEMANTIC_COLORS.amber,
  confirmed: SEMANTIC_COLORS.emerald,
  cancelled: SEMANTIC_COLORS.red,
  registered: SEMANTIC_COLORS.blue,
};

export const ACTIVITY_TYPE_STYLES: Record<string, StatusStyle> = {
  call: SEMANTIC_COLORS.blue,
  whatsapp: SEMANTIC_COLORS.emerald,
  site_visit: SEMANTIC_COLORS.violet,
  note: SEMANTIC_COLORS.amber,
  email: SEMANTIC_COLORS.cyan,
  meeting: SEMANTIC_COLORS.rose,
  follow_up: SEMANTIC_COLORS.orange,
  property_shared: SEMANTIC_COLORS.blue,
};

export const PROPERTY_FACING_LABELS: Record<string, string> = {
  north: "North",
  south: "South",
  east: "East",
  west: "West",
  north_east: "North East",
  north_west: "North West",
  south_east: "South East",
  south_west: "South West",
  corner: "Corner",
};

export const LEAD_STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  property_shared: "Property Shared",
  site_visit: "Site Visit",
  negotiation: "Negotiation",
  booked: "Booked",
  registration: "Registration",
  possession: "Possession",
  lost: "Lost",
};

export const LEAD_STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500",
  contacted: "bg-cyan-500",
  property_shared: "bg-indigo-500",
  site_visit: "bg-violet-500",
  negotiation: "bg-amber-500",
  booked: "bg-emerald-500",
  registration: "bg-orange-500",
  possession: "bg-emerald-600",
  lost: "bg-gray-400",
};

export const LEAD_TEMPERATURE_STYLES: Record<string, { bg: string; text: string }> = {
  hot: { bg: "bg-red-500/15", text: "text-red-400" },
  warm: { bg: "bg-amber-500/15", text: "text-amber-400" },
  cold: { bg: "bg-blue-500/15", text: "text-blue-400" },
};

export type { StatusStyle };

export const LEAD_SOURCE_LABELS: Record<string, string> = {
  website: "Website",
  walkin: "Walk-in",
  referral: "Referral",
  portal_99acres: "99acres",
  portal_magicbricks: "MagicBricks",
  whatsapp: "WhatsApp",
  phone: "Phone Call",
  other: "Other",
};

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  // Project — Land & Title
  title_deed: "Title Deed / Mother Deed",
  encumbrance_certificate: "Encumbrance Certificate (EC)",
  revenue_record: "Revenue Record (Pahani / 7/12)",
  land_conversion_order: "Land Conversion (NA / 10A)",
  // Project — Planning & Approvals
  layout_approval: "Layout Approval (DTCP / BDA)",
  building_plan_sanction: "Building Plan Sanction",
  commencement_certificate: "Commencement Certificate",
  rera_certificate: "RERA Certificate",
  environmental_clearance: "Environmental Clearance",
  fire_noc: "Fire NOC",
  noc_other: "NOC (Water / Electricity / Other)",
  development_agreement: "Development Agreement (JDA / GPA)",
  // Property-level
  plot_demarcation: "Plot Demarcation Map",
  floor_plan: "Floor Plan (Approved)",
  allotment_letter: "Allotment Letter",
  property_tax_receipt: "Property Tax Receipt",
  // Buyer KYC
  kyc_aadhaar: "Aadhaar Card",
  kyc_pan: "PAN Card",
  kyc_address_proof: "Address Proof",
  kyc_photo: "Passport Photos",
  kyc_income_proof: "Income / Source of Funds Proof",
  power_of_attorney: "Power of Attorney (POA)",
  // Transaction
  booking_form: "Booking Application Form",
  cost_sheet: "Cost Sheet / Price Breakup",
  agreement_of_sale: "Agreement of Sale",
  sale_deed: "Sale Deed",
  stamp_duty_receipt: "Stamp Duty Receipt",
  registration_receipt: "Registration Receipt (Index-II)",
  tds_form_26qb: "TDS Form 26QB",
  tds_certificate_16b: "TDS Certificate (Form 16B)",
  payment_receipt: "Payment Receipt",
  demand_letter: "Demand Letter",
  possession_letter: "Possession Letter",
  // Compliance
  rera_quarterly_update: "RERA Quarterly Update",
  escrow_statement: "Escrow Account Statement",
  completion_certificate: "Completion Certificate",
  occupancy_certificate: "Occupancy Certificate (OC)",
  // Marketing
  brochure: "Brochure",
  layout_plan: "Layout Plan",
  price_sheet: "Price Sheet",
  // Legacy
  dtcp_approval: "DTCP Approval",
  kyc: "KYC Document",
  agreement: "Agreement",
  receipt: "Receipt",
  other: "Other",
};

export type DocumentCategory =
  | "project_land"
  | "project_approvals"
  | "property"
  | "buyer_kyc"
  | "transaction"
  | "compliance"
  | "marketing";

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  project_land: "Land & Title",
  project_approvals: "Planning & Approvals",
  property: "Property Documents",
  buyer_kyc: "Buyer KYC",
  transaction: "Transaction Documents",
  compliance: "Compliance & Certificates",
  marketing: "Marketing Materials",
};

export const DOCUMENT_TYPE_CATEGORY: Record<string, DocumentCategory> = {
  title_deed: "project_land",
  encumbrance_certificate: "project_land",
  revenue_record: "project_land",
  land_conversion_order: "project_land",
  layout_approval: "project_approvals",
  building_plan_sanction: "project_approvals",
  commencement_certificate: "project_approvals",
  rera_certificate: "project_approvals",
  environmental_clearance: "project_approvals",
  fire_noc: "project_approvals",
  noc_other: "project_approvals",
  development_agreement: "project_approvals",
  dtcp_approval: "project_approvals",
  plot_demarcation: "property",
  floor_plan: "property",
  allotment_letter: "property",
  property_tax_receipt: "property",
  kyc_aadhaar: "buyer_kyc",
  kyc_pan: "buyer_kyc",
  kyc_address_proof: "buyer_kyc",
  kyc_photo: "buyer_kyc",
  kyc_income_proof: "buyer_kyc",
  kyc: "buyer_kyc",
  power_of_attorney: "buyer_kyc",
  booking_form: "transaction",
  cost_sheet: "transaction",
  agreement_of_sale: "transaction",
  agreement: "transaction",
  sale_deed: "transaction",
  stamp_duty_receipt: "transaction",
  registration_receipt: "transaction",
  tds_form_26qb: "transaction",
  tds_certificate_16b: "transaction",
  payment_receipt: "transaction",
  receipt: "transaction",
  demand_letter: "transaction",
  possession_letter: "transaction",
  rera_quarterly_update: "compliance",
  escrow_statement: "compliance",
  completion_certificate: "compliance",
  occupancy_certificate: "compliance",
  brochure: "marketing",
  layout_plan: "marketing",
  price_sheet: "marketing",
  other: "marketing",
};

export interface ComplianceChecklistItem {
  document_type: string;
  label: string;
  description: string;
  mandatory: boolean;
  entity: "project" | "property" | "buyer" | "transaction";
  stage: "setup" | "marketing" | "booking" | "registration" | "possession" | "ongoing";
}

export const PROJECT_COMPLIANCE_CHECKLIST: ComplianceChecklistItem[] = [
  // Setup stage
  { document_type: "title_deed", label: "Title Deed / Mother Deed", description: "Chain of title going back 13–30 years proving developer owns the land", mandatory: true, entity: "project", stage: "setup" },
  { document_type: "encumbrance_certificate", label: "Encumbrance Certificate", description: "From Sub-Registrar proving land is free of mortgages, liens, or litigation", mandatory: true, entity: "project", stage: "setup" },
  { document_type: "revenue_record", label: "Revenue Records", description: "Pahani (TS/AP), 7/12 Extract (MH), RTC (KA), Patta (TN)", mandatory: true, entity: "project", stage: "setup" },
  { document_type: "land_conversion_order", label: "Land Conversion Order", description: "NA / 10A order if agricultural land converted to non-agricultural use", mandatory: false, entity: "project", stage: "setup" },
  { document_type: "layout_approval", label: "Layout / Building Plan Approval", description: "DTCP (TS/AP/TN), BDA/BMRDA (KA), or HMDA layout permit", mandatory: true, entity: "project", stage: "setup" },
  { document_type: "commencement_certificate", label: "Commencement Certificate", description: "Permission to begin construction from local authority", mandatory: true, entity: "project", stage: "setup" },
  { document_type: "rera_certificate", label: "RERA Registration", description: "Mandatory for projects >500 sq.m or >8 units before marketing", mandatory: true, entity: "project", stage: "setup" },
  { document_type: "environmental_clearance", label: "Environmental Clearance", description: "Required for projects >20,000 sq.m built-up area (SEIAA/MoEFCC)", mandatory: false, entity: "project", stage: "setup" },
  { document_type: "fire_noc", label: "Fire NOC", description: "From State Fire Services for buildings >15m height", mandatory: false, entity: "project", stage: "setup" },
  { document_type: "noc_other", label: "Other NOCs", description: "Water, electricity, airport height, pollution board clearances", mandatory: true, entity: "project", stage: "setup" },
  { document_type: "escrow_statement", label: "Escrow Account Setup", description: "70% of buyer collections must go to project escrow (RERA mandate)", mandatory: true, entity: "project", stage: "setup" },
  // Marketing
  { document_type: "brochure", label: "Project Brochure", description: "Marketing collateral with project details, amenities, pricing", mandatory: false, entity: "project", stage: "marketing" },
  { document_type: "layout_plan", label: "Layout Plan", description: "Approved layout plan showing plots/units, roads, amenities", mandatory: true, entity: "project", stage: "marketing" },
  { document_type: "price_sheet", label: "Price Sheet", description: "Detailed breakup of base price, charges, GST, stamp duty estimates", mandatory: true, entity: "project", stage: "marketing" },
  // Ongoing compliance
  { document_type: "rera_quarterly_update", label: "RERA Quarterly Updates", description: "Architect (Form 1), Engineer (Form 2), CA (Form 3) certificates + progress report", mandatory: true, entity: "project", stage: "ongoing" },
  { document_type: "escrow_statement", label: "Escrow Statements", description: "Quarterly bank statements showing 70% deposit compliance", mandatory: true, entity: "project", stage: "ongoing" },
  { document_type: "completion_certificate", label: "Completion Certificate", description: "From planning authority confirming construction matches approved plans", mandatory: true, entity: "project", stage: "possession" },
  { document_type: "occupancy_certificate", label: "Occupancy Certificate", description: "From municipal body confirming building is safe for habitation", mandatory: true, entity: "project", stage: "possession" },
];

export const BUYER_DOCUMENT_CHECKLIST: ComplianceChecklistItem[] = [
  { document_type: "kyc_aadhaar", label: "Aadhaar Card", description: "Primary identity proof for registration and TDS filing", mandatory: true, entity: "buyer", stage: "booking" },
  { document_type: "kyc_pan", label: "PAN Card", description: "Mandatory for transactions >₹10 lakh, TDS (Form 26QB), and registration", mandatory: true, entity: "buyer", stage: "booking" },
  { document_type: "kyc_address_proof", label: "Address Proof", description: "Utility bill / bank statement if Aadhaar address differs from current residence", mandatory: true, entity: "buyer", stage: "booking" },
  { document_type: "kyc_photo", label: "Passport Photos", description: "4–6 copies needed for registration at Sub-Registrar office", mandatory: true, entity: "buyer", stage: "booking" },
  { document_type: "kyc_income_proof", label: "Income / Source of Funds", description: "Required for transactions >₹50 lakh (anti-money laundering compliance)", mandatory: false, entity: "buyer", stage: "booking" },
  { document_type: "power_of_attorney", label: "Power of Attorney", description: "Required if buyer is represented by another person for registration", mandatory: false, entity: "buyer", stage: "registration" },
];

export const TRANSACTION_DOCUMENT_CHECKLIST: ComplianceChecklistItem[] = [
  { document_type: "booking_form", label: "Booking Application", description: "Buyer details, property choice, booking amount, payment plan", mandatory: true, entity: "transaction", stage: "booking" },
  { document_type: "cost_sheet", label: "Cost Sheet", description: "Base price, development charges, GST, stamp duty estimate, maintenance", mandatory: true, entity: "transaction", stage: "booking" },
  { document_type: "allotment_letter", label: "Allotment Letter", description: "Official letter from developer confirming unit/plot allotment", mandatory: true, entity: "transaction", stage: "booking" },
  { document_type: "agreement_of_sale", label: "Agreement of Sale", description: "Binding contract between buyer and developer with payment schedule", mandatory: true, entity: "transaction", stage: "booking" },
  { document_type: "demand_letter", label: "Demand Letters", description: "At each payment milestone requesting next installment", mandatory: true, entity: "transaction", stage: "registration" },
  { document_type: "tds_form_26qb", label: "TDS Form 26QB", description: "1% TDS deducted by buyer for consideration >₹50 lakh (Section 194IA)", mandatory: true, entity: "transaction", stage: "registration" },
  { document_type: "sale_deed", label: "Sale Deed", description: "Final ownership transfer document executed on stamp paper and registered", mandatory: true, entity: "transaction", stage: "registration" },
  { document_type: "stamp_duty_receipt", label: "Stamp Duty Receipt", description: "Proof of stamp duty paid — rates vary by state (4%–7%)", mandatory: true, entity: "transaction", stage: "registration" },
  { document_type: "registration_receipt", label: "Registration Receipt", description: "Index-II from Sub-Registrar with document number and registration date", mandatory: true, entity: "transaction", stage: "registration" },
  { document_type: "possession_letter", label: "Possession Letter", description: "Formal handover document triggering maintenance obligations", mandatory: true, entity: "transaction", stage: "possession" },
];

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Inventory", href: "/inventory", icon: "Building2" },
  { label: "Leads", href: "/leads", icon: "Users" },
  { label: "Documents", href: "/documents", icon: "FileText" },
  { label: "Analytics", href: "/analytics", icon: "BarChart3" },
  { label: "Compliance", href: "/compliance", icon: "ShieldCheck" },
  { label: "Settings", href: "/settings", icon: "Settings" },
] as const;

export const CURRENCY = {
  symbol: "₹",
  code: "INR",
  locale: "en-IN",
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: "currency",
    currency: CURRENCY.code,
    maximumFractionDigits: 0,
  }).format(amount);
}

export const PAYMENT_SCHEDULE_STATUS_STYLES: Record<string, StatusStyle> = {
  pending: SEMANTIC_COLORS.amber,
  paid: SEMANTIC_COLORS.emerald,
  overdue: SEMANTIC_COLORS.red,
};

export const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  overdue_followup: "Overdue Follow-up",
  stale_lead: "Stale Lead",
  unassigned_lead: "Unassigned Lead",
  overdue_payment: "Overdue Payment",
};

export const STAMP_DUTY_RATES: Record<string, number> = {
  Telangana: 6,
  "Andhra Pradesh": 5,
  Karnataka: 5.6,
  "Tamil Nadu": 7,
  Maharashtra: 5,
  Kerala: 8,
  Gujarat: 4.9,
  Rajasthan: 5,
  "Uttar Pradesh": 7,
  "Madhya Pradesh": 7.5,
  "West Bengal": 6,
  Delhi: 6,
  Haryana: 7,
  Punjab: 6,
  Bihar: 6.5,
  Odisha: 5,
  Chhattisgarh: 5,
  Jharkhand: 4,
  Goa: 3.5,
  Assam: 8.25,
};

export const REGISTRATION_FEE_RATES: Record<string, number> = {
  Telangana: 0.5,
  "Andhra Pradesh": 0.5,
  Karnataka: 1,
  "Tamil Nadu": 1,
  Maharashtra: 1,
  Kerala: 2,
  Gujarat: 1,
  Delhi: 1,
};

export function formatArea(area: number, unit: string): string {
  const unitLabels: Record<string, string> = {
    sq_ft: "sq.ft",
    sq_yards: "sq.yd",
    sq_meters: "sq.m",
    acres: "acres",
    cents: "cents",
    guntas: "guntas",
  };
  return `${area.toLocaleString("en-IN")} ${unitLabels[unit] || unit}`;
}
