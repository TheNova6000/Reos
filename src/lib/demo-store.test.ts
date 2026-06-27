import { describe, it, expect, beforeEach } from "vitest";

if (typeof globalThis.crypto === "undefined") {
  Object.defineProperty(globalThis, "crypto", {
    value: { randomUUID: () => `test-${Math.random().toString(36).slice(2, 10)}` },
  });
}

if (typeof globalThis.window === "undefined") {
  (globalThis as any).window = undefined;
}

import {
  addProject,
  addProperty,
  addLead,
  addActivity,
  updateLead,
  updateLeadStatus,
  updatePropertyStatus,
  updateBookingStatus,
  createBooking,
  addPayment,
  deleteProject,
  deleteProperty,
  deleteLead,
  deleteBooking,
  deleteDocument,
  addDocument,
  getStoreSnapshot,
  getStoreStats,
} from "./demo-store";

// ── Projects ────────────────────────────────────────────────

describe("Store — Projects", () => {
  it("addProject creates a project with correct fields", () => {
    const project = addProject({
      name: "Test Heights",
      location: "Kondapur",
      city: "Hyderabad",
      state: "Telangana",
      total_units: 24,
      description: "Test project",
      rera_number: "TS-RERA-001",
      latitude: 17.46,
      longitude: 78.37,
      amenities: ["Pool", "Gym"],
      thumbnail: "https://example.com/img.jpg",
    });

    expect(project.name).toBe("Test Heights");
    expect(project.slug).toBe("test-heights");
    expect(project.city).toBe("Hyderabad");
    expect(project.total_units).toBe(24);
    expect(project.rera_number).toBe("TS-RERA-001");
    expect(project.latitude).toBe(17.46);
    expect(project.amenities).toEqual(["Pool", "Gym"]);
    expect(project.thumbnail).toBe("https://example.com/img.jpg");
    expect(project.layout_config).toBeNull();
    expect(project.status).toBe("ongoing");
    expect(project.sold_units).toBe(0);
    expect(project.id).toBeTruthy();
    expect(project.tenant_id).toBeDefined();

    const inStore = getStoreSnapshot().projects.find((p) => p.id === project.id);
    expect(inStore).toBeDefined();
    expect(inStore!.slug).toBe("test-heights");
  });

  it("deleteProject removes project and its properties from the store", () => {
    const project = addProject({
      name: "Delete Me",
      location: "Test",
      city: "Test",
      state: "TS",
      total_units: 2,
    });
    addProperty({
      project_id: project.id,
      plot_number: "X-01",
      area: 200,
      area_unit: "sq_yards",
      facing: "east",
      price: 3000000,
      property_type: "plot",
    });

    const beforeCount = getStoreSnapshot().properties.filter(
      (p) => p.project_id === project.id
    ).length;
    expect(beforeCount).toBe(1);

    deleteProject(project.id);

    const afterProject = getStoreSnapshot().projects.find((p) => p.id === project.id);
    expect(afterProject).toBeUndefined();

    const afterProps = getStoreSnapshot().properties.filter(
      (p) => p.project_id === project.id
    );
    expect(afterProps).toHaveLength(0);
  });
});

// ── Properties ──────────────────────────────────────────────

describe("Store — Properties", () => {
  it("addProperty creates property with layout coordinates", () => {
    const project = addProject({
      name: "Prop Test Project",
      location: "L",
      city: "C",
      state: "S",
      total_units: 10,
    });

    const property = addProperty({
      project_id: project.id,
      plot_number: "T-01",
      area: 250,
      area_unit: "sq_yards",
      facing: "north",
      price: 4000000,
      property_type: "plot",
      layout_x: 3,
      layout_y: 2,
      features: ["Corner", "Park-facing"],
    });

    expect(property.plot_number).toBe("T-01");
    expect(property.layout_x).toBe(3);
    expect(property.layout_y).toBe(2);
    expect(property.features).toEqual(["Corner", "Park-facing"]);
    expect(property.price_per_unit).toBe(Math.round(4000000 / 250));
    expect(property.status).toBe("available");
    expect(property.tenant_id).toBeDefined();

    const inStore = getStoreSnapshot().properties.find((p) => p.id === property.id);
    expect(inStore).toBeDefined();
    expect(inStore!.layout_x).toBe(3);
  });

  it("updatePropertyStatus changes status in store", () => {
    const project = addProject({ name: "Status Test", location: "L", city: "C", state: "S", total_units: 1 });
    const prop = addProperty({
      project_id: project.id,
      plot_number: "S-01",
      area: 100,
      area_unit: "sq_ft",
      facing: "south",
      price: 1000000,
      property_type: "plot",
    });

    expect(prop.status).toBe("available");
    updatePropertyStatus(prop.id, "reserved");

    const updated = getStoreSnapshot().properties.find((p) => p.id === prop.id)!;
    expect(updated.status).toBe("reserved");
  });

  it("deleteProperty removes it from the store", () => {
    const project = addProject({ name: "Del Prop", location: "L", city: "C", state: "S", total_units: 1 });
    const prop = addProperty({
      project_id: project.id,
      plot_number: "DP-01",
      area: 100,
      area_unit: "sq_ft",
      facing: "east",
      price: 1000000,
      property_type: "plot",
    });

    deleteProperty(prop.id);
    const inStore = getStoreSnapshot().properties.find((p) => p.id === prop.id);
    expect(inStore).toBeUndefined();
  });
});

// ── Leads ───────────────────────────────────────────────────

describe("Store — Leads", () => {
  it("addLead creates lead with correct defaults", () => {
    const lead = addLead({
      name: "Rajesh Kumar",
      phone: "+919876543210",
      email: "rajesh@test.com",
      source: "website",
      budget_min: 3000000,
      budget_max: 5000000,
      notes: "Looking for east-facing plot",
    });

    expect(lead.name).toBe("Rajesh Kumar");
    expect(lead.phone).toBe("+919876543210");
    expect(lead.status).toBe("new");
    expect(lead.temperature).toBe("warm");
    expect(lead.last_contacted_at).toBeNull();
    expect(lead.next_action).toBeNull();
    expect(lead.family_contacts).toEqual([]);
    expect(lead.budget_min).toBe(3000000);
    expect(lead.tenant_id).toBeDefined();

    const inStore = getStoreSnapshot().leads.find((l) => l.id === lead.id);
    expect(inStore).toBeDefined();
  });

  it("updateLead changes fields in the store", () => {
    const lead = addLead({ name: "Update Test", phone: "0000" });
    updateLead(lead.id, {
      temperature: "hot",
      next_action: "Call tomorrow",
      budget_min: 5000000,
      preferred_facing: "east",
    });

    const updated = getStoreSnapshot().leads.find((l) => l.id === lead.id)!;
    expect(updated.temperature).toBe("hot");
    expect(updated.next_action).toBe("Call tomorrow");
    expect(updated.budget_min).toBe(5000000);
    expect(updated.preferred_facing).toBe("east");
  });

  it("updateLeadStatus changes status in the store", () => {
    const lead = addLead({ name: "Status Lead", phone: "1111" });
    expect(lead.status).toBe("new");

    updateLeadStatus(lead.id, "contacted");

    const updated = getStoreSnapshot().leads.find((l) => l.id === lead.id)!;
    expect(updated.status).toBe("contacted");
  });

  it("addActivity updates last_contacted_at on the lead", () => {
    const lead = addLead({ name: "Activity Test", phone: "2222" });
    expect(lead.last_contacted_at).toBeNull();

    addActivity({
      lead_id: lead.id,
      activity_type: "call",
      description: "Test call",
    });

    const updated = getStoreSnapshot().leads.find((l) => l.id === lead.id)!;
    expect(updated.last_contacted_at).not.toBeNull();
  });

  it("deleteLead cascades to activities and bookings", () => {
    const project = addProject({ name: "Del Lead Proj", location: "L", city: "C", state: "S", total_units: 1 });
    const prop = addProperty({
      project_id: project.id,
      plot_number: "DL-01",
      area: 100,
      area_unit: "sq_yards",
      facing: "north",
      price: 1500000,
      property_type: "plot",
    });
    const lead = addLead({ name: "Delete Lead", phone: "3333" });
    addActivity({ lead_id: lead.id, activity_type: "note", description: "test" });
    createBooking({ lead_id: lead.id, property_id: prop.id, token_amount: 50000, total_price: 1500000 });

    deleteLead(lead.id);

    const snap = getStoreSnapshot();
    expect(snap.leads.find((l) => l.id === lead.id)).toBeUndefined();
    expect(snap.activities.filter((a) => a.lead_id === lead.id)).toHaveLength(0);
    expect(snap.bookings.filter((b) => b.lead_id === lead.id)).toHaveLength(0);
  });
});

// ── Bookings & Payments ─────────────────────────────────────

describe("Store — Bookings & Payments", () => {
  it("createBooking sets property to reserved and lead to booked", () => {
    const project = addProject({ name: "Booking Test", location: "L", city: "C", state: "S", total_units: 1 });
    const prop = addProperty({
      project_id: project.id,
      plot_number: "B-01",
      area: 200,
      area_unit: "sq_yards",
      facing: "east",
      price: 3500000,
      property_type: "plot",
    });
    const lead = addLead({ name: "Buyer", phone: "4444" });

    const booking = createBooking({
      lead_id: lead.id,
      property_id: prop.id,
      token_amount: 100000,
      total_price: 3500000,
    });

    expect(booking.status).toBe("pending");
    expect(booking.token_amount).toBe(100000);
    expect(booking.handover_checklist).toEqual([]);
    expect(booking.tenant_id).toBeDefined();

    const snap = getStoreSnapshot();
    expect(snap.properties.find((p) => p.id === prop.id)!.status).toBe("reserved");
    expect(snap.leads.find((l) => l.id === lead.id)!.status).toBe("booked");
  });

  it("createBooking does not double-reserve an already reserved property", () => {
    const project = addProject({ name: "Double Book", location: "L", city: "C", state: "S", total_units: 1 });
    const prop = addProperty({
      project_id: project.id,
      plot_number: "DB-01",
      area: 150,
      area_unit: "sq_yards",
      facing: "east",
      price: 2000000,
      property_type: "plot",
    });
    const lead1 = addLead({ name: "First", phone: "4441" });
    const lead2 = addLead({ name: "Second", phone: "4442" });

    createBooking({ lead_id: lead1.id, property_id: prop.id, token_amount: 50000, total_price: 2000000 });
    // Second booking attempted on same (now reserved) property
    createBooking({ lead_id: lead2.id, property_id: prop.id, token_amount: 50000, total_price: 2000000 });

    const snap = getStoreSnapshot();
    // Property must stay "reserved" (not flip back to available or double-flag)
    expect(snap.properties.find((p) => p.id === prop.id)!.status).toBe("reserved");
  });

  it("addPayment calculates TDS for amounts >= ₹50L", () => {
    const project = addProject({ name: "TDS Test", location: "L", city: "C", state: "S", total_units: 1 });
    const prop = addProperty({
      project_id: project.id,
      plot_number: "TDS-01",
      area: 200,
      area_unit: "sq_yards",
      facing: "west",
      price: 6000000,
      property_type: "plot",
    });
    const lead = addLead({ name: "TDS Buyer", phone: "5555" });
    const booking = createBooking({
      lead_id: lead.id,
      property_id: prop.id,
      token_amount: 200000,
      total_price: 6000000,
    });

    const payment = addPayment({
      booking_id: booking.id,
      amount: 5500000,
      payment_mode: "bank_transfer",
    });

    // 1% of ₹55L = ₹55,000
    expect(payment.tds_amount).toBe(55000);
    expect(payment.status).toBe("received");
    expect(payment.tenant_id).toBeDefined();
  });

  it("addPayment zero TDS for amounts < ₹50L", () => {
    const project = addProject({ name: "No TDS", location: "L", city: "C", state: "S", total_units: 1 });
    const prop = addProperty({
      project_id: project.id,
      plot_number: "NT-01",
      area: 100,
      area_unit: "sq_yards",
      facing: "north",
      price: 2000000,
      property_type: "plot",
    });
    const lead = addLead({ name: "Small Buyer", phone: "6666" });
    const booking = createBooking({
      lead_id: lead.id,
      property_id: prop.id,
      token_amount: 50000,
      total_price: 2000000,
    });

    const payment = addPayment({
      booking_id: booking.id,
      amount: 4_999_999,
      payment_mode: "upi",
    });

    expect(payment.tds_amount).toBe(0);
  });

  it("addPayment applies TDS at exactly the ₹50L boundary", () => {
    const project = addProject({ name: "Boundary TDS", location: "L", city: "C", state: "S", total_units: 1 });
    const prop = addProperty({
      project_id: project.id,
      plot_number: "BT-01",
      area: 200,
      area_unit: "sq_yards",
      facing: "east",
      price: 5000000,
      property_type: "plot",
    });
    const lead = addLead({ name: "Boundary Buyer", phone: "5001" });
    const booking = createBooking({
      lead_id: lead.id,
      property_id: prop.id,
      token_amount: 100000,
      total_price: 5000000,
    });

    const payment = addPayment({
      booking_id: booking.id,
      amount: 5_000_000,
      payment_mode: "bank_transfer",
    });

    // Exactly at threshold — TDS applies: 1% of ₹50L = ₹50,000
    expect(payment.tds_amount).toBe(50_000);
  });
});

// ── Booking Status Transitions ──────────────────────────────

describe("Store — Booking status transitions", () => {
  it("registered → property becomes sold and registration_date is set", () => {
    const project = addProject({ name: "Reg Trans", location: "L", city: "C", state: "S", total_units: 1 });
    const prop = addProperty({
      project_id: project.id,
      plot_number: "RT-01",
      area: 200,
      area_unit: "sq_yards",
      facing: "east",
      price: 3500000,
      property_type: "plot",
    });
    const lead = addLead({ name: "Reg Buyer", phone: "8881" });
    const booking = createBooking({
      lead_id: lead.id,
      property_id: prop.id,
      token_amount: 100000,
      total_price: 3500000,
    });

    expect(getStoreSnapshot().properties.find((p) => p.id === prop.id)!.status).toBe("reserved");

    updateBookingStatus(booking.id, "registered");

    const snap = getStoreSnapshot();
    expect(snap.properties.find((p) => p.id === prop.id)!.status).toBe("sold");
    const updatedBooking = snap.bookings.find((b) => b.id === booking.id)!;
    expect(updatedBooking.status).toBe("registered");
    expect(updatedBooking.registration_date).toBeTruthy();
  });

  it("cancelled → property returns to available", () => {
    const project = addProject({ name: "Cancel Trans", location: "L", city: "C", state: "S", total_units: 1 });
    const prop = addProperty({
      project_id: project.id,
      plot_number: "CT-01",
      area: 200,
      area_unit: "sq_yards",
      facing: "west",
      price: 2500000,
      property_type: "plot",
    });
    const lead = addLead({ name: "Cancel Buyer", phone: "8882" });
    const booking = createBooking({
      lead_id: lead.id,
      property_id: prop.id,
      token_amount: 50000,
      total_price: 2500000,
    });

    updateBookingStatus(booking.id, "cancelled");

    const snap = getStoreSnapshot();
    expect(snap.properties.find((p) => p.id === prop.id)!.status).toBe("available");
    expect(snap.bookings.find((b) => b.id === booking.id)!.status).toBe("cancelled");
  });

  it("cancellation does not reset a sold property to available", () => {
    const project = addProject({ name: "Sold Guard", location: "L", city: "C", state: "S", total_units: 1 });
    const prop = addProperty({
      project_id: project.id,
      plot_number: "SG-01",
      area: 150,
      area_unit: "sq_yards",
      facing: "north",
      price: 2000000,
      property_type: "plot",
    });
    const lead1 = addLead({ name: "First Buyer", phone: "8883" });
    const lead2 = addLead({ name: "Second Buyer", phone: "8884" });

    const booking1 = createBooking({ lead_id: lead1.id, property_id: prop.id, token_amount: 50000, total_price: 2000000 });
    updateBookingStatus(booking1.id, "registered"); // property → sold

    // Force a second booking on the same property (edge case — not possible in UI but must be safe)
    const booking2 = createBooking({ lead_id: lead2.id, property_id: prop.id, token_amount: 50000, total_price: 2000000 });
    updateBookingStatus(booking2.id, "cancelled"); // cancel guard: only resets if status === "reserved"

    // Property was "sold" — cancellation must not revert it to "available"
    expect(getStoreSnapshot().properties.find((p) => p.id === prop.id)!.status).toBe("sold");
  });

  it("deleteBooking always releases property back to available", () => {
    const project = addProject({ name: "Del Book", location: "L", city: "C", state: "S", total_units: 1 });
    const prop = addProperty({
      project_id: project.id,
      plot_number: "DB-02",
      area: 150,
      area_unit: "sq_yards",
      facing: "east",
      price: 2500000,
      property_type: "plot",
    });
    const lead = addLead({ name: "Del Buyer", phone: "7777" });
    const booking = createBooking({
      lead_id: lead.id,
      property_id: prop.id,
      token_amount: 50000,
      total_price: 2500000,
    });

    expect(getStoreSnapshot().properties.find((p) => p.id === prop.id)!.status).toBe("reserved");
    deleteBooking(booking.id);
    expect(getStoreSnapshot().properties.find((p) => p.id === prop.id)!.status).toBe("available");
    expect(getStoreSnapshot().bookings.find((b) => b.id === booking.id)).toBeUndefined();
  });
});

// ── Tenant isolation ────────────────────────────────────────

describe("Store — Tenant isolation", () => {
  it("all created entities carry the store's tenant_id", () => {
    const tenantId = getStoreSnapshot().tenantId ?? "";

    const project = addProject({ name: "Tenant Check", location: "L", city: "C", state: "S", total_units: 1 });
    expect(project.tenant_id).toBe(tenantId);

    const prop = addProperty({
      project_id: project.id,
      plot_number: "TC-01",
      area: 100,
      area_unit: "sq_yards",
      facing: "east",
      price: 1000000,
      property_type: "plot",
    });
    expect(prop.tenant_id).toBe(tenantId);

    const lead = addLead({ name: "Tenant Lead", phone: "9999" });
    expect(lead.tenant_id).toBe(tenantId);

    const booking = createBooking({
      lead_id: lead.id,
      property_id: prop.id,
      token_amount: 50000,
      total_price: 1000000,
    });
    expect(booking.tenant_id).toBe(tenantId);

    const payment = addPayment({
      booking_id: booking.id,
      amount: 100000,
      payment_mode: "upi",
    });
    expect(payment.tenant_id).toBe(tenantId);

    const doc = addDocument({ name: "TC Doc", document_type: "rera_certificate" });
    expect(doc.tenant_id).toBe(tenantId);
  });
});

// ── Documents ───────────────────────────────────────────────

describe("Store — Documents", () => {
  it("addDocument creates document with correct type", () => {
    const doc = addDocument({
      name: "Test RERA Cert",
      document_type: "rera_certificate",
    });

    expect(doc.name).toBe("Test RERA Cert");
    expect(doc.document_type).toBe("rera_certificate");
    expect(doc.tenant_id).toBeDefined();

    const inStore = getStoreSnapshot().documents.find((d) => d.id === doc.id);
    expect(inStore).toBeDefined();
  });

  it("deleteDocument removes it from the store", () => {
    const doc = addDocument({ name: "Delete Me", document_type: "brochure" });
    deleteDocument(doc.id);
    expect(getStoreSnapshot().documents.find((d) => d.id === doc.id)).toBeUndefined();
  });
});

// ── Stats ───────────────────────────────────────────────────

describe("Store — Stats", () => {
  it("getStoreStats returns correct shape with number values", () => {
    const stats = getStoreStats();
    expect(stats).toHaveProperty("totalProperties");
    expect(stats).toHaveProperty("available");
    expect(stats).toHaveProperty("sold");
    expect(stats).toHaveProperty("reserved");
    expect(stats).toHaveProperty("totalRevenue");
    expect(stats).toHaveProperty("conversionRate");
    expect(stats).toHaveProperty("totalLeads");
    expect(stats).toHaveProperty("bookedLeads");
    expect(typeof stats.totalProperties).toBe("number");
    expect(typeof stats.conversionRate).toBe("number");
    expect(stats.conversionRate).toBeGreaterThanOrEqual(0);
    expect(stats.conversionRate).toBeLessThanOrEqual(100);
  });

  it("sold count increases after registering a booking", () => {
    const before = getStoreStats();
    const project = addProject({ name: "Stats Sold", location: "L", city: "C", state: "S", total_units: 1 });
    const prop = addProperty({
      project_id: project.id,
      plot_number: "SS-01",
      area: 100,
      area_unit: "sq_yards",
      facing: "east",
      price: 1500000,
      property_type: "plot",
    });
    const lead = addLead({ name: "Stats Buyer", phone: "6001" });
    const booking = createBooking({ lead_id: lead.id, property_id: prop.id, token_amount: 50000, total_price: 1500000 });
    updateBookingStatus(booking.id, "registered");

    const after = getStoreStats();
    expect(after.sold).toBe(before.sold + 1);
    expect(after.totalRevenue).toBeGreaterThan(before.totalRevenue);
  });
});
