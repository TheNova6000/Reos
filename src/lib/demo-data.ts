import type {
  Project,
  Property,
  Lead,
  Activity,
  Booking,
  Payment,
  UserProfile,
} from "@/types/database";

const T = "demo-tenant";

export const demoUsers: UserProfile[] = [
  {
    id: "u1",
    tenant_id: T,
    email: "admin@visioninfra.com",
    full_name: "Rajesh Kumar",
    role: "admin",
    phone: "+91 98765 43210",
    avatar_url: null,
    is_active: true,
    created_at: "2026-01-15T10:00:00Z",
  },
  {
    id: "u2",
    tenant_id: T,
    email: "priya@visioninfra.com",
    full_name: "Priya Sharma",
    role: "agent",
    phone: "+91 98765 43211",
    avatar_url: null,
    is_active: true,
    created_at: "2026-02-01T10:00:00Z",
  },
  {
    id: "u3",
    tenant_id: T,
    email: "arjun@visioninfra.com",
    full_name: "Arjun Reddy",
    role: "agent",
    phone: "+91 98765 43212",
    avatar_url: null,
    is_active: true,
    created_at: "2026-03-10T10:00:00Z",
  },
];

export const demoProjects: Project[] = [
  {
    id: "p1",
    tenant_id: T,
    name: "Green Valley Phase 2",
    slug: "green-valley-phase-2",
    location: "Shamshabad",
    city: "Hyderabad",
    state: "Telangana",
    latitude: 17.2403,
    longitude: 78.4294,
    description:
      "Premium plotted development near Rajiv Gandhi International Airport with DTCP approved layout. Gated community with 24/7 security, landscaped parks, and wide internal roads.",
    rera_number: "P02400005678",
    rera_state: "Telangana",
    status: "ongoing",
    total_units: 48,
    sold_units: 18,
    price_range_min: 2500000,
    price_range_max: 6500000,
    amenities: [
      "Gated Community",
      "24/7 Security",
      "Landscaped Parks",
      "Children's Play Area",
      "Jogging Track",
      "Underground Drainage",
      "Wide Roads",
      "Avenue Plantation",
    ],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=500&fit=crop",
    ],
    thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
    layout_config: null,
    created_at: "2026-01-20T10:00:00Z",
    updated_at: "2026-06-18T10:00:00Z",
  },
  {
    id: "p2",
    tenant_id: T,
    name: "Sunrise Meadows",
    slug: "sunrise-meadows",
    location: "Adibatla",
    city: "Hyderabad",
    state: "Telangana",
    latitude: 17.1715,
    longitude: 78.5264,
    description:
      "Affordable plotted venture adjacent to Pharma City with excellent growth potential. All plots are east and north facing with clear titles.",
    rera_number: "P02400009012",
    rera_state: "Telangana",
    status: "ongoing",
    total_units: 36,
    sold_units: 8,
    price_range_min: 1800000,
    price_range_max: 4200000,
    amenities: [
      "Compound Wall",
      "Security Cabin",
      "Internal Roads",
      "Street Lights",
      "Water Pipeline",
      "Electricity",
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=500&fit=crop",
    ],
    thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    layout_config: null,
    created_at: "2026-03-15T10:00:00Z",
    updated_at: "2026-06-18T10:00:00Z",
  },
  {
    id: "p3",
    tenant_id: T,
    name: "Royal Heights",
    slug: "royal-heights",
    location: "Mokila",
    city: "Hyderabad",
    state: "Telangana",
    latitude: 17.4486,
    longitude: 78.2522,
    description:
      "Premium villa plots near Financial District with panoramic views. HMDA approved layout with world-class amenities.",
    rera_number: null,
    rera_state: null,
    status: "upcoming",
    total_units: 24,
    sold_units: 0,
    price_range_min: 5000000,
    price_range_max: 12000000,
    amenities: [
      "Clubhouse",
      "Swimming Pool",
      "Gymnasium",
      "Tennis Court",
      "Meditation Garden",
      "EV Charging",
    ],
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=500&fit=crop",
    ],
    thumbnail: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop",
    layout_config: null,
    created_at: "2026-05-01T10:00:00Z",
    updated_at: "2026-06-18T10:00:00Z",
  },
];

const unsplashPropertyThumbnails = [
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1572127360741-02e6f3e1491b?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1600047508003-eaee5e65d71c?w=400&h=300&fit=crop",
];

const unsplashPropertyHero = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=500&fit=crop",
];

// Green Valley Phase 2 — 48 plots in 6 rows x 8 columns
function generateGreenValleyPlots(): Property[] {
  const plots: Property[] = [];
  const rows = 6;
  const cols = 8;
  const facings = ["north", "south", "east", "west", "north_east", "corner"] as const;
  const statuses = [
    "sold", "sold", "sold", "sold", "sold",
    "sold", "sold", "sold", "sold", "sold",
    "sold", "sold", "sold", "sold", "sold",
    "sold", "sold", "sold",
    "reserved", "reserved", "reserved", "reserved", "reserved", "reserved",
    "under_registration", "under_registration",
    "blocked",
    "available", "available", "available", "available", "available",
    "available", "available", "available", "available", "available",
    "available", "available", "available", "available", "available",
    "available", "available", "available", "available", "available",
    "available", "available", "available",
  ] as const;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const plotNum = `A-${(idx + 1).toString().padStart(2, "0")}`;
      const isCorner = (r === 0 || r === rows - 1) && (c === 0 || c === cols - 1);
      const isEdge = r === 0 || r === rows - 1 || c === 0 || c === cols - 1;

      let facing: Property["facing"];
      if (isCorner) facing = "corner";
      else if (r === 0) facing = "north";
      else if (r === rows - 1) facing = "south";
      else if (c === 0) facing = "west";
      else if (c === cols - 1) facing = "east";
      else facing = facings[idx % 4] as Property["facing"];

      const baseArea = isCorner ? 267 : isEdge ? 240 : 200;
      const area = baseArea + Math.floor((idx * 17) % 60);
      const pricePerYard = isCorner ? 18000 : isEdge ? 15000 : 13000;
      const price = area * pricePerYard;

      plots.push({
        id: `gv-${idx + 1}`,
        tenant_id: T,
        project_id: "p1",
        plot_number: plotNum,
        area,
        area_unit: "sq_yards",
        facing,
        price,
        price_per_unit: pricePerYard,
        status: statuses[idx] || "available",
        property_type: "plot",
        dimensions: isCorner ? "40x30" : isEdge ? "30x40" : "25x40",
        floor_number: null,
        layout_x: c,
        layout_y: r,
        description: isCorner
          ? "Premium corner plot with excellent road access on two sides. Ideal for a dream home or investment."
          : isEdge
          ? "Prime road-facing plot with great ventilation and easy access to main road."
          : "Well-located internal plot in a peaceful residential layout.",
        features: isCorner
          ? ["Corner Plot", "Two-side Open", "Premium Location"]
          : isEdge
          ? ["Road Facing", "Good Ventilation"]
          : ["Internal Plot"],
        images: [unsplashPropertyHero[idx % unsplashPropertyHero.length]],
        created_at: "2026-01-25T10:00:00Z",
        updated_at: "2026-06-18T10:00:00Z",
      });
    }
  }
  return plots;
}

function generateSunriseMeadowsPlots(): Property[] {
  const plots: Property[] = [];
  const rows = 6;
  const cols = 6;
  const statuses = [
    "sold", "sold", "sold", "sold", "sold", "sold", "sold", "sold",
    "reserved", "reserved", "reserved",
    "available", "available", "available", "available", "available",
    "available", "available", "available", "available", "available",
    "available", "available", "available", "available", "available",
    "available", "available", "available", "available", "available",
    "available", "available", "available", "available", "available",
  ] as const;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const plotNum = `B-${(idx + 1).toString().padStart(2, "0")}`;
      const isCorner = (r === 0 || r === rows - 1) && (c === 0 || c === cols - 1);
      const isEdge = r === 0 || r === rows - 1 || c === 0 || c === cols - 1;

      let facing: Property["facing"];
      if (isCorner) facing = "corner";
      else if (r === 0) facing = "north";
      else if (r === rows - 1) facing = "south";
      else if (c === 0) facing = "east";
      else if (c === cols - 1) facing = "west";
      else facing = "east";

      const area = 150 + Math.floor((idx * 13) % 50);
      const pricePerYard = isCorner ? 14000 : isEdge ? 12000 : 10000;

      plots.push({
        id: `sm-${idx + 1}`,
        tenant_id: T,
        project_id: "p2",
        plot_number: plotNum,
        area,
        area_unit: "sq_yards",
        facing,
        price: area * pricePerYard,
        price_per_unit: pricePerYard,
        status: statuses[idx] || "available",
        property_type: "plot",
        dimensions: "25x30",
        floor_number: null,
        layout_x: c,
        layout_y: r,
        description: isCorner
          ? "Corner plot with excellent visibility. Great for commercial or premium residential."
          : "Affordable residential plot in a rapidly developing area near Pharma City.",
        features: isCorner ? ["Corner Plot"] : [],
        images: [unsplashPropertyThumbnails[idx % unsplashPropertyThumbnails.length]],
        created_at: "2026-03-20T10:00:00Z",
        updated_at: "2026-06-18T10:00:00Z",
      });
    }
  }
  return plots;
}

export const demoProperties: Property[] = [
  ...generateGreenValleyPlots(),
  ...generateSunriseMeadowsPlots(),
];

export const demoLeads: Lead[] = [
  {
    id: "l1",
    tenant_id: T,
    name: "Srinivas Rao",
    phone: "+91 99001 12345",
    email: "srinivas.rao@gmail.com",
    source: "website",
    status: "negotiation",
    assigned_agent_id: "u2",
    budget_min: 3000000,
    budget_max: 5000000,
    preferred_location: "Shamshabad",
    preferred_facing: "east",
    preferred_type: "plot",
    notes: "Looking for east-facing plot near airport. Budget flexible for corner plots.",
    properties_interested: ["gv-5", "gv-12"],
    temperature: "warm" as const,
    next_action: null,
    family_contacts: [],
    last_contacted_at: null,
    next_follow_up: "2026-06-20T10:00:00Z",
    created_at: "2026-05-10T14:30:00Z",
    updated_at: "2026-06-17T11:00:00Z",
    assigned_agent: demoUsers[1],
  },
  {
    id: "l2",
    tenant_id: T,
    name: "Lakshmi Devi",
    phone: "+91 98765 67890",
    email: "lakshmi.d@yahoo.com",
    source: "referral",
    status: "site_visit",
    assigned_agent_id: "u3",
    budget_min: 2000000,
    budget_max: 3500000,
    preferred_location: "Adibatla",
    preferred_facing: "north",
    preferred_type: "plot",
    notes: "Referred by Mr. Ravi Kumar (existing customer). Interested in Sunrise Meadows.",
    properties_interested: ["sm-3", "sm-8"],
    temperature: "warm" as const,
    next_action: null,
    family_contacts: [],
    last_contacted_at: null,
    next_follow_up: "2026-06-19T15:00:00Z",
    created_at: "2026-05-25T09:00:00Z",
    updated_at: "2026-06-16T14:00:00Z",
    assigned_agent: demoUsers[2],
  },
  {
    id: "l3",
    tenant_id: T,
    name: "Mohammed Irfan",
    phone: "+91 90001 23456",
    email: null,
    source: "portal_99acres",
    status: "contacted",
    assigned_agent_id: "u2",
    budget_min: 4000000,
    budget_max: 7000000,
    preferred_location: null,
    preferred_facing: "corner",
    preferred_type: "plot",
    notes: "Enquired via 99acres. Wants corner plot. NRI — currently in Dubai.",
    properties_interested: [],
    temperature: "warm" as const,
    next_action: null,
    family_contacts: [],
    last_contacted_at: null,
    next_follow_up: "2026-06-21T18:00:00Z",
    created_at: "2026-06-05T11:00:00Z",
    updated_at: "2026-06-15T16:00:00Z",
    assigned_agent: demoUsers[1],
  },
  {
    id: "l4",
    tenant_id: T,
    name: "Anitha Kumari",
    phone: "+91 87654 32100",
    email: "anitha.k@outlook.com",
    source: "walkin",
    status: "new",
    assigned_agent_id: null,
    budget_min: 1500000,
    budget_max: 2500000,
    preferred_location: "Adibatla",
    preferred_facing: null,
    preferred_type: "plot",
    notes: "Walk-in enquiry. First-time buyer. Needs detailed explanation of process.",
    properties_interested: [],
    temperature: "warm" as const,
    next_action: null,
    family_contacts: [],
    last_contacted_at: null,
    next_follow_up: null,
    created_at: "2026-06-18T10:00:00Z",
    updated_at: "2026-06-18T10:00:00Z",
  },
  {
    id: "l5",
    tenant_id: T,
    name: "Venkat Subramaniam",
    phone: "+91 91234 56789",
    email: "venkat.s@techcorp.com",
    source: "website",
    status: "booked",
    assigned_agent_id: "u3",
    budget_min: 4000000,
    budget_max: 6000000,
    preferred_location: "Shamshabad",
    preferred_facing: "east",
    preferred_type: "plot",
    notes: "Booked plot A-03 in Green Valley. Token paid. Agreement pending.",
    properties_interested: ["gv-3"],
    temperature: "warm" as const,
    next_action: null,
    family_contacts: [],
    last_contacted_at: null,
    next_follow_up: "2026-06-25T10:00:00Z",
    created_at: "2026-04-12T09:00:00Z",
    updated_at: "2026-06-10T14:00:00Z",
    assigned_agent: demoUsers[2],
  },
  {
    id: "l6",
    tenant_id: T,
    name: "Padma Reddy",
    phone: "+91 99876 54321",
    email: null,
    source: "whatsapp",
    status: "contacted",
    assigned_agent_id: "u2",
    budget_min: 2500000,
    budget_max: 4000000,
    preferred_location: "Shamshabad",
    preferred_facing: "north",
    preferred_type: "plot",
    notes: "Enquired via WhatsApp. Husband is decision maker. Need to arrange family visit.",
    properties_interested: ["gv-20", "gv-25"],
    temperature: "warm" as const,
    next_action: null,
    family_contacts: [],
    last_contacted_at: null,
    next_follow_up: "2026-06-22T11:00:00Z",
    created_at: "2026-06-12T16:00:00Z",
    updated_at: "2026-06-17T09:00:00Z",
    assigned_agent: demoUsers[1],
  },
  {
    id: "l7",
    tenant_id: T,
    name: "Ravi Teja",
    phone: "+91 88001 22334",
    email: "raviteja@gmail.com",
    source: "portal_magicbricks",
    status: "lost",
    assigned_agent_id: "u3",
    budget_min: 1000000,
    budget_max: 2000000,
    preferred_location: null,
    preferred_facing: null,
    preferred_type: "plot",
    notes: "Lost to competitor — bought a plot in Maheshwaram at lower price point.",
    properties_interested: [],
    temperature: "warm" as const,
    next_action: null,
    family_contacts: [],
    last_contacted_at: null,
    next_follow_up: null,
    created_at: "2026-04-20T10:00:00Z",
    updated_at: "2026-05-30T12:00:00Z",
    assigned_agent: demoUsers[2],
  },
  {
    id: "l8",
    tenant_id: T,
    name: "Kavitha Naidu",
    phone: "+91 77654 33210",
    email: "kavitha.n@gmail.com",
    source: "phone",
    status: "new",
    assigned_agent_id: null,
    budget_min: 3000000,
    budget_max: 5000000,
    preferred_location: "Shamshabad",
    preferred_facing: "east",
    preferred_type: "plot",
    notes: "Called office directly. Investment purpose. Wants east-facing.",
    properties_interested: [],
    temperature: "warm" as const,
    next_action: null,
    family_contacts: [],
    last_contacted_at: null,
    next_follow_up: null,
    created_at: "2026-06-18T14:00:00Z",
    updated_at: "2026-06-18T14:00:00Z",
  },
];

export const demoActivities: Activity[] = [
  { id: "a1", tenant_id: T, lead_id: "l1", activity_type: "call", description: "Initial call. Discussed requirements — east-facing plot, near airport.", outcome: null, scheduled_for: null, is_completed: true, site_visit_feedback: null, created_by: "u2", created_at: "2026-05-10T14:30:00Z" },
  { id: "a2", tenant_id: T, lead_id: "l1", activity_type: "site_visit", description: "Site visit completed. Showed plots A-05 and A-12. Client liked A-05.", outcome: null, scheduled_for: null, is_completed: true, site_visit_feedback: { project_id: "p1", plots_shown: ["gv-5", "gv-12"], rating: 4, feedback: "Liked A-05 but wants discount", attendees: ["Srinivas Rao"] }, created_by: "u2", created_at: "2026-05-18T11:00:00Z" },
  { id: "a3", tenant_id: T, lead_id: "l1", activity_type: "note", description: "Price negotiation ongoing. Client asking for ₹500/sq.yd discount.", outcome: null, scheduled_for: null, is_completed: true, site_visit_feedback: null, created_by: "u2", created_at: "2026-06-15T16:00:00Z" },
  { id: "a4", tenant_id: T, lead_id: "l2", activity_type: "call", description: "First contact. Referred by Mr. Ravi Kumar. Interested in Adibatla.", outcome: null, scheduled_for: null, is_completed: true, site_visit_feedback: null, created_by: "u3", created_at: "2026-05-25T09:00:00Z" },
  { id: "a5", tenant_id: T, lead_id: "l2", activity_type: "whatsapp", description: "Shared Sunrise Meadows brochure and layout via WhatsApp.", outcome: null, scheduled_for: null, is_completed: true, site_visit_feedback: null, created_by: "u3", created_at: "2026-05-28T10:00:00Z" },
  { id: "a6", tenant_id: T, lead_id: "l5", activity_type: "site_visit", description: "Site visit. Finalized plot A-03.", outcome: null, scheduled_for: null, is_completed: true, site_visit_feedback: { project_id: "p1", plots_shown: ["gv-3"], rating: 5, feedback: "Loved it, ready to book", attendees: ["Venkat Subramaniam", "Wife"] }, created_by: "u3", created_at: "2026-05-20T11:00:00Z" },
  { id: "a7", tenant_id: T, lead_id: "l5", activity_type: "note", description: "Token of ₹1,00,000 received. Booking confirmed.", outcome: null, scheduled_for: null, is_completed: true, site_visit_feedback: null, created_by: "u3", created_at: "2026-06-01T14:00:00Z" },
  { id: "a8", tenant_id: T, lead_id: "l2", activity_type: "site_visit", description: "Scheduled site visit to Sunrise Meadows — showing B-03, B-08.", outcome: null, scheduled_for: "2026-06-28T10:00:00Z", is_completed: false, site_visit_feedback: null, created_by: "u3", created_at: "2026-06-20T09:00:00Z" },
  { id: "a9", tenant_id: T, lead_id: "l1", activity_type: "site_visit", description: "Follow-up site visit for Srinivas to see A-05 again with family.", outcome: null, scheduled_for: "2026-06-30T11:00:00Z", is_completed: false, site_visit_feedback: null, created_by: "u2", created_at: "2026-06-22T14:00:00Z" },
];

export const demoBookings: Booking[] = [
  {
    id: "bk1",
    tenant_id: T,
    lead_id: "l5",
    property_id: "gv-3",
    booking_date: "2026-06-01T14:00:00Z",
    token_amount: 100000,
    total_price: 3510000,
    agreement_date: null,
    agreement_document_url: null,
    lawyer_name: null,
    stamp_duty: null,
    registration_date: null,
    possession_date: null,
    handover_date: null,
    handover_checklist: [],
    status: "confirmed",
    notes: "Token paid via UPI. Agreement date to be fixed.",
    created_at: "2026-06-01T14:00:00Z",
    updated_at: "2026-06-10T14:00:00Z",
  },
];

export const demoPayments: Payment[] = [
  {
    id: "pay1",
    tenant_id: T,
    booking_id: "bk1",
    amount: 100000,
    payment_date: "2026-06-01T14:00:00Z",
    payment_mode: "upi",
    tds_amount: 0,
    receipt_number: "REC-001",
    status: "received",
    notes: "Token amount",
    created_at: "2026-06-01T14:00:00Z",
  },
  {
    id: "pay2",
    tenant_id: T,
    booking_id: "bk1",
    amount: 500000,
    payment_date: "2026-06-15T10:00:00Z",
    payment_mode: "bank_transfer",
    tds_amount: 0,
    receipt_number: "REC-002",
    status: "received",
    notes: "First installment",
    created_at: "2026-06-15T10:00:00Z",
  },
];

export function getDemoStats() {
  const totalProperties = demoProperties.length;
  const available = demoProperties.filter((p) => p.status === "available").length;
  const sold = demoProperties.filter((p) => p.status === "sold").length;
  const reserved = demoProperties.filter((p) => p.status === "reserved").length;
  const activeLeads = demoLeads.filter((l) => !["booked", "lost"].includes(l.status)).length;
  const totalRevenue = demoProperties
    .filter((p) => p.status === "sold")
    .reduce((sum, p) => sum + p.price, 0);
  const bookedLeads = demoLeads.filter((l) => l.status === "booked").length;
  const totalLeads = demoLeads.length;
  const conversionRate = totalLeads > 0 ? Math.round((bookedLeads / totalLeads) * 100) : 0;

  return { totalProperties, available, sold, reserved, activeLeads, totalRevenue, conversionRate, bookedLeads };
}

export function getPropertiesForProject(projectId: string) {
  return demoProperties.filter((p) => p.project_id === projectId);
}

export function getLeadsByStatus(status: string) {
  return demoLeads.filter((l) => l.status === status);
}
