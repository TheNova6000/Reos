/**
 * REOS Database Seed Script
 * Populates Supabase with demo data matching demo-data.ts
 * Run: node supabase/seed.mjs
 */

const SUPABASE_URL = "https://aiaaigfnqxlrqkhqihwp.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error("Set SUPABASE_SERVICE_ROLE_KEY env var first");
  console.error("  $env:SUPABASE_SERVICE_ROLE_KEY='eyJ...'");
  console.error("  node supabase/seed.mjs");
  process.exit(1);
}

const headers = {
  apikey: SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

async function insert(table, rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers,
    body: JSON.stringify(rows),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`INSERT ${table} failed (${res.status}): ${err}`);
  }
  const data = await res.json();
  console.log(`  ${table}: ${data.length} rows inserted`);
  return data;
}

// ── Settings ────────────────────────────────────────────────
const settings = [{
  company_name: "Vision Infra Tech",
  company_phone: null,
  company_email: null,
  company_address: null,
  company_website: null,
  primary_color: "#1e40af",
  currency_symbol: "₹",
  tds_percentage: 1.00,
}];

// ── Projects ────────────────────────────────────────────────
const projects = [
  {
    name: "Green Valley Phase 2",
    slug: "green-valley-phase-2",
    location: "Shamshabad",
    city: "Hyderabad",
    state: "Telangana",
    latitude: 17.2403,
    longitude: 78.4294,
    description: "Premium plotted development near Rajiv Gandhi International Airport with DTCP approved layout. Gated community with 24/7 security, landscaped parks, and wide internal roads.",
    rera_number: "P02400005678",
    rera_state: "Telangana",
    status: "ongoing",
    total_units: 48,
    sold_units: 18,
    price_range_min: 2500000,
    price_range_max: 6500000,
    amenities: ["Gated Community", "24/7 Security", "Landscaped Parks", "Children's Play Area", "Jogging Track", "Underground Drainage", "Wide Roads", "Avenue Plantation"],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=500&fit=crop",
    ],
    thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
  },
  {
    name: "Sunrise Meadows",
    slug: "sunrise-meadows",
    location: "Adibatla",
    city: "Hyderabad",
    state: "Telangana",
    latitude: 17.1715,
    longitude: 78.5264,
    description: "Affordable plotted venture adjacent to Pharma City with excellent growth potential. All plots are east and north facing with clear titles.",
    rera_number: "P02400009012",
    rera_state: "Telangana",
    status: "ongoing",
    total_units: 36,
    sold_units: 8,
    price_range_min: 1800000,
    price_range_max: 4200000,
    amenities: ["Compound Wall", "Security Cabin", "Internal Roads", "Street Lights", "Water Pipeline", "Electricity"],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=500&fit=crop",
    ],
    thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
  },
  {
    name: "Royal Heights",
    slug: "royal-heights",
    location: "Mokila",
    city: "Hyderabad",
    state: "Telangana",
    latitude: 17.4486,
    longitude: 78.2522,
    description: "Premium villa plots near Financial District with panoramic views. HMDA approved layout with world-class amenities.",
    rera_number: null,
    rera_state: null,
    status: "upcoming",
    total_units: 24,
    sold_units: 0,
    price_range_min: 5000000,
    price_range_max: 12000000,
    amenities: ["Clubhouse", "Swimming Pool", "Gymnasium", "Tennis Court", "Meditation Garden", "EV Charging"],
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=500&fit=crop",
    ],
    thumbnail: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop",
  },
];

// ── Properties ──────────────────────────────────────────────
const heroImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=500&fit=crop",
];
const thumbImages = [
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1572127360741-02e6f3e1491b?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1600047508003-eaee5e65d71c?w=400&h=300&fit=crop",
];

function generateGreenValleyPlots(projectId) {
  const plots = [];
  const rows = 6, cols = 8;
  const statuses = [
    "sold","sold","sold","sold","sold","sold","sold","sold","sold","sold",
    "sold","sold","sold","sold","sold","sold","sold","sold",
    "reserved","reserved","reserved","reserved","reserved","reserved",
    "under_registration","under_registration","blocked",
    "available","available","available","available","available",
    "available","available","available","available","available",
    "available","available","available","available","available",
    "available","available","available","available","available",
    "available","available","available",
  ];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const plotNum = `A-${String(idx + 1).padStart(2, "0")}`;
      const isCorner = (r === 0 || r === rows - 1) && (c === 0 || c === cols - 1);
      const isEdge = r === 0 || r === rows - 1 || c === 0 || c === cols - 1;
      let facing;
      if (isCorner) facing = "corner";
      else if (r === 0) facing = "north";
      else if (r === rows - 1) facing = "south";
      else if (c === 0) facing = "west";
      else if (c === cols - 1) facing = "east";
      else facing = ["north","south","east","west"][idx % 4];

      const baseArea = isCorner ? 267 : isEdge ? 240 : 200;
      const area = baseArea + Math.floor((idx * 17) % 60);
      const pricePerYard = isCorner ? 18000 : isEdge ? 15000 : 13000;
      plots.push({
        project_id: projectId,
        plot_number: plotNum,
        area,
        area_unit: "sq_yards",
        facing,
        price: area * pricePerYard,
        price_per_unit: pricePerYard,
        status: statuses[idx] || "available",
        property_type: "plot",
        dimensions: isCorner ? "40x30" : isEdge ? "30x40" : "25x40",
        layout_x: c,
        layout_y: r,
        description: isCorner
          ? "Premium corner plot with excellent road access on two sides."
          : isEdge
          ? "Prime road-facing plot with great ventilation and easy access."
          : "Well-located internal plot in a peaceful residential layout.",
        features: isCorner ? ["Corner Plot","Two-side Open","Premium Location"] : isEdge ? ["Road Facing","Good Ventilation"] : ["Internal Plot"],
        images: [heroImages[idx % heroImages.length]],
      });
    }
  }
  return plots;
}

function generateSunriseMeadowsPlots(projectId) {
  const plots = [];
  const rows = 6, cols = 6;
  const statuses = [
    "sold","sold","sold","sold","sold","sold","sold","sold",
    "reserved","reserved","reserved",
    "available","available","available","available","available",
    "available","available","available","available","available",
    "available","available","available","available","available",
    "available","available","available","available","available",
    "available","available","available","available","available",
  ];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const plotNum = `B-${String(idx + 1).padStart(2, "0")}`;
      const isCorner = (r === 0 || r === rows - 1) && (c === 0 || c === cols - 1);
      const isEdge = r === 0 || r === rows - 1 || c === 0 || c === cols - 1;
      let facing;
      if (isCorner) facing = "corner";
      else if (r === 0) facing = "north";
      else if (r === rows - 1) facing = "south";
      else if (c === 0) facing = "east";
      else if (c === cols - 1) facing = "west";
      else facing = "east";

      const area = 150 + Math.floor((idx * 13) % 50);
      const pricePerYard = isCorner ? 14000 : isEdge ? 12000 : 10000;
      plots.push({
        project_id: projectId,
        plot_number: plotNum,
        area,
        area_unit: "sq_yards",
        facing,
        price: area * pricePerYard,
        price_per_unit: pricePerYard,
        status: statuses[idx] || "available",
        property_type: "plot",
        dimensions: "25x30",
        layout_x: c,
        layout_y: r,
        description: isCorner
          ? "Corner plot with excellent visibility."
          : "Affordable residential plot near Pharma City.",
        features: isCorner ? ["Corner Plot"] : [],
        images: [thumbImages[idx % thumbImages.length]],
      });
    }
  }
  return plots;
}

// ── Main ────────────────────────────────────────────────────
async function main() {
  console.log("Seeding REOS database...\n");

  // 1. Settings
  console.log("1. Settings");
  await insert("settings", settings);

  // 2. Projects
  console.log("2. Projects");
  const insertedProjects = await insert("projects", projects);
  const projectMap = {};
  for (const p of insertedProjects) {
    projectMap[p.slug] = p.id;
  }
  console.log("   IDs:", projectMap);

  // 3. Properties
  console.log("3. Properties (Green Valley)");
  const gvPlots = generateGreenValleyPlots(projectMap["green-valley-phase-2"]);
  // Insert in batches of 24
  const gvInserted = [];
  for (let i = 0; i < gvPlots.length; i += 24) {
    const batch = gvPlots.slice(i, i + 24);
    const result = await insert("properties", batch);
    gvInserted.push(...result);
  }

  console.log("4. Properties (Sunrise Meadows)");
  const smPlots = generateSunriseMeadowsPlots(projectMap["sunrise-meadows"]);
  const smInserted = [];
  for (let i = 0; i < smPlots.length; i += 24) {
    const batch = smPlots.slice(i, i + 24);
    const result = await insert("properties", batch);
    smInserted.push(...result);
  }

  // Build property lookup by plot_number
  const allProperties = [...gvInserted, ...smInserted];
  const propByPlot = {};
  for (const p of allProperties) {
    propByPlot[p.plot_number] = p.id;
  }

  // Map old property IDs to new UUIDs
  const oldToNew = {};
  gvInserted.forEach((p, i) => { oldToNew[`gv-${i + 1}`] = p.id; });
  smInserted.forEach((p, i) => { oldToNew[`sm-${i + 1}`] = p.id; });

  // 4. Leads (without assigned_agent_id — no auth users yet)
  console.log("5. Leads");
  function lead(name, phone, email, source, status, budget_min, budget_max, preferred_location, preferred_facing, preferred_type, notes, properties_interested, next_follow_up) {
    return { name, phone, email: email || null, source, status, budget_min, budget_max, preferred_location: preferred_location || null, preferred_facing: preferred_facing || null, preferred_type: preferred_type || null, notes, properties_interested: properties_interested || [], next_follow_up: next_follow_up || null };
  }
  const leads = [
    lead("Srinivas Rao", "+91 99001 12345", "srinivas.rao@gmail.com", "website", "negotiation", 3000000, 5000000, "Shamshabad", "east", "plot", "Looking for east-facing plot near airport. Budget flexible for corner plots.", [oldToNew["gv-5"], oldToNew["gv-12"]].filter(Boolean), "2026-06-20T10:00:00Z"),
    lead("Lakshmi Devi", "+91 98765 67890", "lakshmi.d@yahoo.com", "referral", "site_visit", 2000000, 3500000, "Adibatla", "north", "plot", "Referred by Mr. Ravi Kumar. Interested in Sunrise Meadows.", [oldToNew["sm-3"], oldToNew["sm-8"]].filter(Boolean), "2026-06-19T15:00:00Z"),
    lead("Mohammed Irfan", "+91 90001 23456", null, "portal_99acres", "contacted", 4000000, 7000000, null, "corner", "plot", "Enquired via 99acres. Wants corner plot. NRI — currently in Dubai.", [], "2026-06-21T18:00:00Z"),
    lead("Anitha Kumari", "+91 87654 32100", "anitha.k@outlook.com", "walkin", "new", 1500000, 2500000, "Adibatla", null, "plot", "Walk-in enquiry. First-time buyer.", [], null),
    lead("Venkat Subramaniam", "+91 91234 56789", "venkat.s@techcorp.com", "website", "booked", 4000000, 6000000, "Shamshabad", "east", "plot", "Booked plot A-03. Token paid. Agreement pending.", [oldToNew["gv-3"]].filter(Boolean), "2026-06-25T10:00:00Z"),
    lead("Padma Reddy", "+91 99876 54321", null, "whatsapp", "contacted", 2500000, 4000000, "Shamshabad", "north", "plot", "Enquired via WhatsApp. Need to arrange family visit.", [oldToNew["gv-20"], oldToNew["gv-25"]].filter(Boolean), "2026-06-22T11:00:00Z"),
    lead("Ravi Teja", "+91 88001 22334", "raviteja@gmail.com", "portal_magicbricks", "lost", 1000000, 2000000, null, null, "plot", "Lost to competitor — bought in Maheshwaram at lower price.", [], null),
    lead("Kavitha Naidu", "+91 77654 33210", "kavitha.n@gmail.com", "phone", "new", 3000000, 5000000, "Shamshabad", "east", "plot", "Called office directly. Investment purpose.", [], null),
  ];
  await insert("leads", leads);

  console.log("\nDone! Database seeded with:");
  console.log(`  - 1 settings row`);
  console.log(`  - ${insertedProjects.length} projects`);
  console.log(`  - ${allProperties.length} properties`);
  console.log(`  - ${leads.length} leads`);
  console.log(`\nNote: Activities and user_profiles skipped (need auth.users first).`);
  console.log(`Create a user account in the app to populate user_profiles.`);
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
