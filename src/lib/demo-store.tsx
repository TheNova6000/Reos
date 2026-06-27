"use client";

import { useSyncExternalStore } from "react";
import type {
  Project,
  Property,
  Lead,
  Activity,
  Document,
  Settings,
  Booking,
  Payment,
  PaymentSchedule,
  UserProfile,
  DashboardNotification,
  SiteVisitFeedback,
  LeadStatus,
  LeadSource,
  ActivityType,
  PropertyStatus,
  PropertyFacing,
  PropertyType,
  AreaUnit,
  BookingStatus,
  PaymentMode,
  PaymentStatus,
} from "@/types/database";
import {
  demoLeads,
  demoActivities,
  demoUsers,
  demoProperties,
  demoProjects,
  demoBookings,
  demoPayments,
} from "./demo-data";
import { createClient } from "@/lib/supabase/client";
import { calculateTds } from "./calculations";

// ── Supabase helper ────────────────────────────────────────
const supabase = createClient();

function sb() {
  return supabase;
}

// ── Store shape ─────────────────────────────────────────────
interface Store {
  currentUser: UserProfile | null;
  tenantId: string | null;
  projects: Project[];
  properties: Property[];
  leads: Lead[];
  activities: Activity[];
  documents: Document[];
  bookings: Booking[];
  payments: Payment[];
  paymentSchedules: PaymentSchedule[];
  settings: Settings;
  _loaded: boolean;
}

const defaultSettings: Settings = {
  id: "settings-1",
  tenant_id: "",
  company_name: "Vision Infra Tech",
  company_logo: null,
  company_phone: null,
  company_email: null,
  company_address: null,
  company_website: null,
  primary_color: "#1e40af",
  currency_symbol: "₹",
  tds_percentage: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

let store: Store = {
  currentUser: null,
  tenantId: null,
  projects: [...demoProjects],
  properties: [...demoProperties],
  leads: [...demoLeads],
  activities: [...demoActivities],
  documents: [],
  bookings: [...demoBookings],
  payments: [...demoPayments],
  paymentSchedules: [],
  settings: { ...defaultSettings },
  _loaded: false,
};

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const LOCAL_STORAGE_KEY = "reos-demo-store";

function saveToLocalStorage() {
  try {
    const data = {
      projects: store.projects,
      properties: store.properties,
      leads: store.leads,
      activities: store.activities,
      documents: store.documents,
      bookings: store.bookings,
      payments: store.payments,
      paymentSchedules: store.paymentSchedules,
      settings: store.settings,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // quota exceeded or private browsing
  }
}

function loadFromLocalStorage(): boolean {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (data.projects) store.projects = data.projects;
    if (data.properties) store.properties = data.properties;
    if (data.leads) store.leads = data.leads;
    if (data.activities) store.activities = data.activities;
    if (data.documents) store.documents = data.documents;
    if (data.bookings) store.bookings = data.bookings;
    if (data.payments) store.payments = data.payments;
    if (data.paymentSchedules) store.paymentSchedules = data.paymentSchedules;
    if (data.settings) store.settings = data.settings;
    return true;
  } catch {
    return false;
  }
}

let useLocalFallback = false;

function emitChange() {
  store = { ...store };
  listeners.forEach((l) => l());
  if (useLocalFallback) {
    saveToLocalStorage();
  }
}

function getSnapshot() {
  return store;
}

// ── Initialize from Supabase ───────────────────────────────
let initPromise: Promise<void> | null = null;

export function initializeStore(): Promise<void> {
  if (store._loaded) return Promise.resolve();
  if (initPromise) return initPromise;

  const client = sb();
  if (!client) {
    loadFromLocalStorage();
    useLocalFallback = true;
    store._loaded = true;
    return Promise.resolve();
  }

  initPromise = (async () => {
    try {
      const { data: { session } } = await client.auth.getSession();

      if (!session?.user) {
        loadFromLocalStorage();
        useLocalFallback = true;
        store._loaded = true;
        emitChange();
        console.log("[REOS] No session — using localStorage + demo data");
        return;
      }

      const { data: profile } = await client
        .from("user_profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        store.currentUser = profile as UserProfile;
        store.tenantId = profile.tenant_id;
      }

      const [
        { data: projects },
        { data: properties },
        { data: leads },
        { data: activities },
        { data: documents },
        { data: bookings },
        { data: payments },
        { data: paymentSchedules },
        { data: settingsRows },
      ] = await Promise.all([
        client.from("projects").select("*").order("created_at"),
        client.from("properties").select("*").order("project_id,plot_number"),
        client.from("leads").select("*").order("created_at", { ascending: false }),
        client.from("activities").select("*").order("created_at", { ascending: false }),
        client.from("documents").select("*").order("created_at", { ascending: false }),
        client.from("bookings").select("*").order("created_at", { ascending: false }),
        client.from("payments").select("*").order("created_at", { ascending: false }),
        client.from("payment_schedules").select("*").order("due_date"),
        client.from("settings").select("*").limit(1),
      ]);

      store.projects = (projects as Project[]) || [];
      store.properties = (properties as Property[]) || [];
      store.leads = (leads as Lead[]) || [];
      store.activities = (activities as Activity[]) || [];
      store.documents = (documents as Document[]) || [];
      store.bookings = (bookings as Booking[]) || [];
      store.payments = (payments as Payment[]) || [];
      store.paymentSchedules = (paymentSchedules as PaymentSchedule[]) || [];
      if (settingsRows && settingsRows.length > 0) {
        store.settings = settingsRows[0] as Settings;
      }
      store._loaded = true;
      emitChange();
      initializeRealtime();
      console.log("[REOS] Store loaded from Supabase", store.tenantId ? `(tenant: ${store.tenantId})` : "");
    } catch (err) {
      console.warn("[REOS] Supabase load failed, falling back to localStorage + demo data:", err);
      loadFromLocalStorage();
      useLocalFallback = true;
      store._loaded = true;
    }
  })();

  return initPromise;
}

// Auto-init on module load
if (typeof window !== "undefined") {
  initializeStore();
}

// ── Realtime subscriptions ────────────────────────────────
type TableName = "projects" | "properties" | "leads" | "activities" | "documents" | "bookings" | "payments" | "settings" | "payment_schedules";

const REALTIME_TABLES: TableName[] = [
  "projects", "properties", "leads", "activities",
  "documents", "bookings", "payments", "payment_schedules",
];

let realtimeInitialized = false;
const pendingLocalIds = new Set<string>();

function getStoreArray(table: TableName): { id: string }[] {
  const map: Record<TableName, { id: string }[]> = {
    projects: store.projects,
    properties: store.properties,
    leads: store.leads,
    activities: store.activities,
    documents: store.documents,
    bookings: store.bookings,
    payments: store.payments,
    payment_schedules: store.paymentSchedules,
    settings: [],
  };
  return map[table] || [];
}

function setStoreArray(table: TableName, arr: unknown[]) {
  const setters: Record<TableName, () => void> = {
    projects: () => { store.projects = arr as Project[]; },
    properties: () => { store.properties = arr as Property[]; },
    leads: () => { store.leads = arr as Lead[]; },
    activities: () => { store.activities = arr as Activity[]; },
    documents: () => { store.documents = arr as Document[]; },
    bookings: () => { store.bookings = arr as Booking[]; },
    payments: () => { store.payments = arr as Payment[]; },
    payment_schedules: () => { store.paymentSchedules = arr as PaymentSchedule[]; },
    settings: () => {},
  };
  setters[table]?.();
}

export function initializeRealtime() {
  const client = sb();
  if (!client || realtimeInitialized || useLocalFallback) return;
  realtimeInitialized = true;

  for (const table of REALTIME_TABLES) {
    client
      .channel(`realtime-${table}`)
      .on(
        "postgres_changes" as "system",
        { event: "*", schema: "public", table } as Record<string, unknown>,
        (payload: { eventType: string; new: Record<string, unknown>; old: { id?: string } }) => {
          const newRow = payload.new as { id: string } & Record<string, unknown>;
          const oldRow = payload.old;

          if (newRow?.id && pendingLocalIds.has(newRow.id)) {
            pendingLocalIds.delete(newRow.id);
            return;
          }

          if (payload.eventType === "INSERT") {
            const arr = getStoreArray(table);
            if (!arr.find((r) => r.id === newRow.id)) {
              setStoreArray(table, [newRow, ...arr]);
              emitChange();
              console.log(`[REOS Realtime] ${table} INSERT`, newRow.id);
            }
          } else if (payload.eventType === "UPDATE") {
            const arr = getStoreArray(table);
            const idx = arr.findIndex((r) => r.id === newRow.id);
            if (idx >= 0) {
              const updated = [...arr];
              updated[idx] = newRow as typeof arr[0];
              setStoreArray(table, updated);
              emitChange();
              console.log(`[REOS Realtime] ${table} UPDATE`, newRow.id);
            }
          } else if (payload.eventType === "DELETE" && oldRow?.id) {
            const arr = getStoreArray(table);
            setStoreArray(table, arr.filter((r) => r.id !== oldRow.id));
            emitChange();
            console.log(`[REOS Realtime] ${table} DELETE`, oldRow.id);
          }

          if (table === "settings" && payload.eventType !== "DELETE" && newRow) {
            store.settings = newRow as unknown as Settings;
            emitChange();
          }
        }
      )
      .subscribe();
  }

  console.log("[REOS] Realtime subscriptions active on", REALTIME_TABLES.length, "tables");
}

// ── Persist helper ─────────────────────────────────────────
async function persist(
  table: string,
  op: "insert" | "update" | "upsert",
  data: Record<string, unknown>,
  match?: Record<string, string>
) {
  const client = sb();
  if (!client) return null;
  if (op === "insert" && store.tenantId && !data.tenant_id) {
    data = { ...data, tenant_id: store.tenantId };
  }

  // Mark IDs so Realtime skips events we caused
  if (match?.id) pendingLocalIds.add(match.id);

  try {
    if (op === "insert") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: rows, error } = await client.from(table).insert(data as any).select();
      if (error) throw error;
      const row = rows?.[0] ?? null;
      if (row?.id) pendingLocalIds.add(row.id);
      return row;
    }
    if (op === "update" && match) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let q: any = client.from(table).update(data as any);
      for (const [k, v] of Object.entries(match)) {
        q = q.eq(k, v);
      }
      const { error } = await q;
      if (error) throw error;
    }
    if (op === "upsert") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await client.from(table).upsert(data as any);
      if (error) throw error;
    }
  } catch (err) {
    console.warn(`[REOS] persist ${table} ${op} failed:`, err);
  }
  return null;
}

// ── Projects ────────────────────────────────────────────────
export function addProject(data: {
  name: string;
  location: string;
  city: string;
  state: string;
  description?: string;
  rera_number?: string;
  rera_state?: string;
  total_units: number;
  latitude?: number;
  longitude?: number;
  price_range_min?: number;
  price_range_max?: number;
  amenities?: string[];
  thumbnail?: string;
}): Project {
  const now = new Date().toISOString();
  const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const project: Project = {
    id: crypto.randomUUID(),
    tenant_id: store.tenantId || "",
    name: data.name,
    slug,
    location: data.location,
    city: data.city,
    state: data.state,
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    description: data.description || null,
    rera_number: data.rera_number || null,
    rera_state: data.rera_state || data.state || null,
    status: "ongoing",
    total_units: data.total_units,
    sold_units: 0,
    price_range_min: data.price_range_min ?? null,
    price_range_max: data.price_range_max ?? null,
    amenities: data.amenities || [],
    images: [],
    thumbnail: data.thumbnail || null,
    layout_config: null,
    created_at: now,
    updated_at: now,
  };
  store.projects = [...store.projects, project];
  emitChange();

  persist("projects", "insert", {
    name: project.name, slug: project.slug, location: project.location,
    city: project.city, state: project.state, latitude: project.latitude,
    longitude: project.longitude, description: project.description,
    rera_number: project.rera_number, rera_state: project.rera_state,
    status: project.status, total_units: project.total_units, sold_units: 0,
    price_range_min: project.price_range_min, price_range_max: project.price_range_max,
    amenities: project.amenities, images: project.images, thumbnail: project.thumbnail,
  }).then((row) => {
    if (row?.id && row.id !== project.id) {
      store.projects = store.projects.map((p) =>
        p.id === project.id ? { ...p, id: row.id } : p
      );
      emitChange();
    }
  });

  return project;
}

export function updateProject(
  id: string,
  data: Partial<Omit<Project, "id" | "created_at">>
) {
  const updated_at = new Date().toISOString();
  store.projects = store.projects.map((p) =>
    p.id === id ? { ...p, ...data, updated_at } : p
  );
  emitChange();
  persist("projects", "update", { ...data, updated_at }, { id });
}

export function deleteProject(id: string) {
  store.properties = store.properties.filter((p) => p.project_id !== id);
  store.projects = store.projects.filter((p) => p.id !== id);
  emitChange();
  const client = sb();
  if (client) {
    client.from("properties").delete().eq("project_id", id).then(() =>
      client.from("projects").delete().eq("id", id)
    );
  }
}

// ── Properties ──────────────────────────────────────────────
export function addProperty(data: {
  project_id: string;
  plot_number: string;
  area: number;
  area_unit: AreaUnit;
  facing: PropertyFacing;
  price: number;
  property_type: PropertyType;
  dimensions?: string;
  description?: string;
  layout_x?: number;
  layout_y?: number;
  features?: string[];
  floor_number?: number;
}): Property {
  const now = new Date().toISOString();
  const property: Property = {
    id: crypto.randomUUID(),
    tenant_id: store.tenantId || "",
    project_id: data.project_id,
    plot_number: data.plot_number,
    area: data.area,
    area_unit: data.area_unit,
    facing: data.facing,
    price: data.price,
    price_per_unit: Math.round(data.price / data.area),
    status: "available",
    property_type: data.property_type,
    dimensions: data.dimensions || null,
    floor_number: data.floor_number ?? null,
    layout_x: data.layout_x ?? null,
    layout_y: data.layout_y ?? null,
    description: data.description || null,
    features: data.features || [],
    images: [],
    created_at: now,
    updated_at: now,
  };
  store.properties = [...store.properties, property];
  emitChange();

  persist("properties", "insert", {
    project_id: property.project_id, plot_number: property.plot_number,
    area: property.area, area_unit: property.area_unit, facing: property.facing,
    price: property.price, price_per_unit: property.price_per_unit,
    status: property.status, property_type: property.property_type,
    dimensions: property.dimensions, description: property.description,
    features: property.features, images: property.images,
    layout_x: property.layout_x, layout_y: property.layout_y,
    floor_number: property.floor_number,
  }).then((row) => {
    if (row?.id && row.id !== property.id) {
      store.properties = store.properties.map((p) =>
        p.id === property.id ? { ...p, id: row.id } : p
      );
      emitChange();
    }
  });

  return property;
}

export function updatePropertyStatus(propertyId: string, status: PropertyStatus) {
  const idx = store.properties.findIndex((p) => p.id === propertyId);
  if (idx === -1) return;
  const updated_at = new Date().toISOString();
  store.properties = store.properties.map((p, i) =>
    i === idx ? { ...p, status, updated_at } : p
  );
  emitChange();
  persist("properties", "update", { status, updated_at }, { id: propertyId });
}

export function updateProperty(
  id: string,
  data: Partial<Omit<Property, "id" | "created_at" | "project">>
) {
  const updated_at = new Date().toISOString();
  store.properties = store.properties.map((p) =>
    p.id === id ? { ...p, ...data, updated_at } : p
  );
  emitChange();
  const { project: _p, ...persistData } = data as Record<string, unknown>;
  persist("properties", "update", { ...persistData, updated_at }, { id });
}

export function deleteProperty(id: string) {
  store.properties = store.properties.filter((p) => p.id !== id);
  emitChange();
  const client = sb();
  if (client) {
    client.from("properties").delete().eq("id", id);
  }
}

// ── Leads ───────────────────────────────────────────────────
export function addLead(data: {
  name: string;
  phone: string;
  email?: string;
  source?: LeadSource;
  preferred_location?: string;
  preferred_facing?: string;
  preferred_type?: string;
  budget_min?: number;
  budget_max?: number;
  notes?: string;
  properties_interested?: string[];
  source_project_id?: string;
}): Lead {
  const now = new Date().toISOString();
  const newLead: Lead = {
    id: crypto.randomUUID(),
    tenant_id: store.tenantId || "",
    name: data.name,
    phone: data.phone,
    email: data.email || null,
    source: data.source || "website",
    status: "new",
    assigned_agent_id: null,
    budget_min: data.budget_min ?? null,
    budget_max: data.budget_max ?? null,
    preferred_location: data.preferred_location || null,
    preferred_facing: (data.preferred_facing as Lead["preferred_facing"]) || null,
    preferred_type: (data.preferred_type as Lead["preferred_type"]) || null,
    notes: data.notes || null,
    next_action: null,
    temperature: "warm",
    family_contacts: [],
    properties_interested: data.properties_interested || [],
    next_follow_up: null,
    last_contacted_at: null,
    created_at: now,
    updated_at: now,
    assigned_agent: undefined,
  };
  const propertyLabel = data.properties_interested?.length
    ? ` for property ${data.properties_interested.join(", ")}`
    : "";
  const projectLabel = data.source_project_id
    ? ` (${store.projects.find((p) => p.id === data.source_project_id)?.name || ""})`
    : "";
  const sourceLabel = data.source && data.source !== "website" ? ` [${data.source}]` : "";

  const activity: Activity = {
    id: crypto.randomUUID(),
    tenant_id: store.tenantId || "",
    lead_id: newLead.id,
    activity_type: "note",
    description: `Lead created${sourceLabel}${propertyLabel}${projectLabel}. ${data.notes ? `Notes: ${data.notes}` : ""}`.trim(),
    outcome: null,
    scheduled_for: null,
    is_completed: true,
    site_visit_feedback: null,
    created_by: "u1",
    created_at: now,
  };
  if (store.settings.auto_assign_leads && !newLead.assigned_agent_id) {
    const agentId = getAgentWithFewestLeads();
    if (agentId) {
      newLead.assigned_agent_id = agentId;
      newLead.assigned_agent = demoUsers.find((u) => u.id === agentId);
    }
  }

  store.leads = [newLead, ...store.leads];
  store.activities = [activity, ...store.activities];

  emitChange();

  persist("leads", "insert", {
    name: newLead.name, phone: newLead.phone, email: newLead.email,
    source: newLead.source, status: newLead.status,
    budget_min: newLead.budget_min, budget_max: newLead.budget_max,
    preferred_location: newLead.preferred_location,
    preferred_facing: newLead.preferred_facing,
    preferred_type: newLead.preferred_type,
    notes: newLead.notes, properties_interested: newLead.properties_interested,
  }).then((row) => {
    if (row?.id && row.id !== newLead.id) {
      const oldId = newLead.id;
      store.leads = store.leads.map((l) =>
        l.id === oldId ? { ...l, id: row.id } : l
      );
      store.activities = store.activities.map((a) =>
        a.lead_id === oldId ? { ...a, lead_id: row.id } : a
      );
      emitChange();
    }
  });

  return newLead;
}

export function addActivity(data: {
  lead_id: string;
  activity_type: ActivityType;
  description: string;
  created_by?: string;
  scheduled_for?: string;
  is_completed?: boolean;
  site_visit_feedback?: SiteVisitFeedback | null;
}): Activity {
  const now = new Date().toISOString();
  const newActivity: Activity = {
    id: crypto.randomUUID(),
    tenant_id: store.tenantId || "",
    lead_id: data.lead_id,
    activity_type: data.activity_type,
    description: data.description,
    outcome: null,
    scheduled_for: data.scheduled_for || null,
    is_completed: data.is_completed ?? true,
    site_visit_feedback: data.site_visit_feedback || null,
    created_by: data.created_by || "u1",
    created_at: now,
    creator: demoUsers.find((u) => u.id === data.created_by),
  };

  store.leads = store.leads.map((l) =>
    l.id === data.lead_id ? { ...l, last_contacted_at: now, updated_at: now } : l
  );
  store.activities = [newActivity, ...store.activities];
  emitChange();

  persist("activities", "insert", {
    lead_id: newActivity.lead_id,
    activity_type: newActivity.activity_type,
    description: newActivity.description,
    outcome: newActivity.outcome,
    scheduled_for: newActivity.scheduled_for,
    is_completed: newActivity.is_completed,
    site_visit_feedback: newActivity.site_visit_feedback,
    created_by: newActivity.created_by,
  }).then((row) => {
    if (row?.id && row.id !== newActivity.id) {
      store.activities = store.activities.map((a) =>
        a.id === newActivity.id ? { ...a, id: row.id } : a
      );
      emitChange();
    }
  });
  persist("leads", "update", { last_contacted_at: now, updated_at: now }, { id: data.lead_id });
  return newActivity;
}

export function updateLead(
  id: string,
  data: Partial<Omit<Lead, "id" | "created_at" | "assigned_agent" | "activities">>
) {
  const updated_at = new Date().toISOString();
  store.leads = store.leads.map((l) =>
    l.id === id ? { ...l, ...data, updated_at } : l
  );
  emitChange();
  const { assigned_agent: _a, activities: _b, ...persistData } = data as Record<string, unknown>;
  persist("leads", "update", { ...persistData, updated_at }, { id });
}

export function updateLeadStatus(leadId: string, status: LeadStatus) {
  const updated_at = new Date().toISOString();
  store.leads = store.leads.map((l) =>
    l.id === leadId ? { ...l, status, updated_at } : l
  );
  emitChange();
  persist("leads", "update", { status, updated_at }, { id: leadId });
}

export function assignLead(leadId: string, agentId: string) {
  const agent = demoUsers.find((u) => u.id === agentId);
  const updated_at = new Date().toISOString();
  store.leads = store.leads.map((l) =>
    l.id === leadId ? { ...l, assigned_agent_id: agentId, assigned_agent: agent, updated_at } : l
  );
  emitChange();
  persist("leads", "update", { assigned_agent_id: agentId, updated_at }, { id: leadId });
}

export function deleteLead(id: string) {
  store.activities = store.activities.filter((a) => a.lead_id !== id);
  store.bookings.filter((b) => b.lead_id === id).forEach((b) => {
    store.payments = store.payments.filter((p) => p.booking_id !== b.id);
  });
  store.bookings = store.bookings.filter((b) => b.lead_id !== id);
  store.leads = store.leads.filter((l) => l.id !== id);
  emitChange();
  const client = sb();
  if (client) {
    client.from("activities").delete().eq("lead_id", id).then(() =>
      client.from("leads").delete().eq("id", id)
    );
  }
}

// ── Documents ───────────────────────────────────────────────
export function addDocument(data: {
  name: string;
  document_type: Document["document_type"];
  file_url?: string;
  file_size?: number;
  mime_type?: string;
  project_id?: string;
  property_id?: string;
  lead_id?: string;
  booking_id?: string;
  expiry_date?: string;
  is_mandatory?: boolean;
  notes?: string;
}): Document {
  const now = new Date().toISOString();
  const doc: Document = {
    id: crypto.randomUUID(),
    tenant_id: store.tenantId || "",
    name: data.name,
    document_type: data.document_type,
    file_url: data.file_url || "#",
    file_size: data.file_size ?? Math.floor(Math.random() * 5000000) + 100000,
    mime_type: data.mime_type || "application/pdf",
    property_id: data.property_id || null,
    project_id: data.project_id || null,
    lead_id: data.lead_id || null,
    booking_id: data.booking_id || null,
    uploaded_by: "u1",
    verification_status: "pending",
    expiry_date: data.expiry_date || null,
    is_mandatory: data.is_mandatory ?? false,
    notes: data.notes || null,
    created_at: now,
  };
  store.documents = [doc, ...store.documents];
  emitChange();

  persist("documents", "insert", {
    name: doc.name, document_type: doc.document_type,
    file_url: doc.file_url, file_size: doc.file_size,
    mime_type: doc.mime_type, property_id: doc.property_id,
    project_id: doc.project_id, lead_id: doc.lead_id,
    booking_id: doc.booking_id, uploaded_by: doc.uploaded_by,
    verification_status: doc.verification_status,
    expiry_date: doc.expiry_date, is_mandatory: doc.is_mandatory,
    notes: doc.notes,
  });

  return doc;
}

export function updateDocumentStatus(
  id: string,
  verification_status: Document["verification_status"]
) {
  store.documents = store.documents.map((d) =>
    d.id === id ? { ...d, verification_status } : d
  );
  emitChange();
  persist("documents", "update", { verification_status }, { id });
}

export function deleteDocument(id: string) {
  store.documents = store.documents.filter((d) => d.id !== id);
  emitChange();
  const client = sb();
  if (client) client.from("documents").delete().eq("id", id);
}

// ── Bookings ───────────────────────────────────────────────
export function createBooking(data: {
  lead_id: string;
  property_id: string;
  token_amount: number;
  total_price: number;
  notes?: string;
}): Booking {
  const now = new Date().toISOString();
  const booking: Booking = {
    id: crypto.randomUUID(),
    tenant_id: store.tenantId || "",
    lead_id: data.lead_id,
    property_id: data.property_id,
    booking_date: now,
    token_amount: data.token_amount,
    total_price: data.total_price,
    agreement_date: null,
    agreement_document_url: null,
    lawyer_name: null,
    stamp_duty: null,
    registration_date: null,
    possession_date: null,
    handover_date: null,
    handover_checklist: [],
    status: "pending",
    notes: data.notes || null,
    created_at: now,
    updated_at: now,
  };
  const plotNumber = store.properties.find((p) => p.id === data.property_id)?.plot_number || data.property_id;
  const activity: Activity = {
    id: crypto.randomUUID(),
    tenant_id: store.tenantId || "",
    lead_id: data.lead_id,
    activity_type: "note",
    description: `Booking created for ${plotNumber}. Token: ₹${data.token_amount.toLocaleString("en-IN")}. Total: ₹${data.total_price.toLocaleString("en-IN")}.`,
    outcome: null,
    scheduled_for: null,
    is_completed: true,
    site_visit_feedback: null,
    created_by: "u1",
    created_at: now,
  };

  store.bookings = [booking, ...store.bookings];
  store.leads = store.leads.map((l) =>
    l.id === data.lead_id ? { ...l, status: "booked" as LeadStatus, updated_at: now } : l
  );
  store.properties = store.properties.map((p) =>
    p.id === data.property_id && p.status === "available"
      ? { ...p, status: "reserved" as PropertyStatus, updated_at: now }
      : p
  );
  store.activities = [activity, ...store.activities];

  emitChange();

  persist("bookings", "insert", {
    lead_id: booking.lead_id, property_id: booking.property_id,
    token_amount: booking.token_amount, total_price: booking.total_price,
    status: booking.status, notes: booking.notes,
  }).then((row) => {
    if (row?.id && row.id !== booking.id) {
      store.bookings = store.bookings.map((b) =>
        b.id === booking.id ? { ...b, id: row.id } : b
      );
      emitChange();
    }
  });
  persist("leads", "update", { status: "booked", updated_at: now }, { id: data.lead_id });
  persist("properties", "update", { status: "reserved", updated_at: now }, { id: data.property_id });

  return booking;
}

export function updateBookingStatus(bookingId: string, status: BookingStatus) {
  const booking = store.bookings.find((b) => b.id === bookingId);
  if (!booking) return;
  const updated_at = new Date().toISOString();
  const registration_date = status === "registered" ? updated_at : booking.registration_date;

  store.bookings = store.bookings.map((b) =>
    b.id === bookingId ? { ...b, status, updated_at, registration_date } : b
  );

  if (status === "registered") {
    store.properties = store.properties.map((p) =>
      p.id === booking.property_id ? { ...p, status: "sold" as PropertyStatus, updated_at } : p
    );
    persist("properties", "update", { status: "sold", updated_at }, { id: booking.property_id });
  }
  if (status === "cancelled") {
    store.properties = store.properties.map((p) =>
      p.id === booking.property_id && p.status === "reserved"
        ? { ...p, status: "available" as PropertyStatus, updated_at }
        : p
    );
    persist("properties", "update", { status: "available", updated_at }, { id: booking.property_id });
  }

  emitChange();
  persist("bookings", "update", { status, updated_at, registration_date }, { id: bookingId });
}

export function deleteBooking(id: string) {
  const booking = store.bookings.find((b) => b.id === id);
  if (booking) {
    store.properties = store.properties.map((p) =>
      p.id === booking.property_id ? { ...p, status: "available" as const, updated_at: new Date().toISOString() } : p
    );
    store.leads = store.leads.map((l) =>
      l.id === booking.lead_id ? { ...l, status: "negotiation" as const, updated_at: new Date().toISOString() } : l
    );
  }
  store.payments = store.payments.filter((p) => p.booking_id !== id);
  store.bookings = store.bookings.filter((b) => b.id !== id);
  emitChange();
  const client = sb();
  if (client) {
    client.from("payments").delete().eq("booking_id", id).then(() =>
      client.from("bookings").delete().eq("id", id)
    );
    if (booking) {
      client.from("properties").update({ status: "available" }).eq("id", booking.property_id);
    }
  }
}

// ── Payments ───────────────────────────────────────────────
export function addPayment(data: {
  booking_id: string;
  amount: number;
  payment_mode: PaymentMode;
  receipt_number?: string;
  notes?: string;
}): Payment {
  const now = new Date().toISOString();
  const booking = store.bookings.find((b) => b.id === data.booking_id);
  const tdsAmount = calculateTds(data.amount, store.settings.tds_percentage);

  const payment: Payment = {
    id: crypto.randomUUID(),
    tenant_id: store.tenantId || "",
    booking_id: data.booking_id,
    amount: data.amount,
    payment_date: now,
    payment_mode: data.payment_mode,
    tds_amount: tdsAmount,
    receipt_number: data.receipt_number || null,
    status: "received",
    notes: data.notes || null,
    created_at: now,
  };
  store.payments = [payment, ...store.payments];

  if (booking) {
    const activity: Activity = {
      id: crypto.randomUUID(),
      tenant_id: store.tenantId || "",
      lead_id: booking.lead_id,
      activity_type: "note",
      description: `Payment received: ₹${data.amount.toLocaleString("en-IN")} via ${data.payment_mode}${tdsAmount > 0 ? ` (TDS: ₹${tdsAmount.toLocaleString("en-IN")})` : ""}.`,
      outcome: null,
      scheduled_for: null,
      is_completed: true,
      site_visit_feedback: null,
      created_by: "u1",
      created_at: now,
    };
    store.activities = [activity, ...store.activities];
  }

  emitChange();

  persist("payments", "insert", {
    booking_id: payment.booking_id, amount: payment.amount,
    payment_mode: payment.payment_mode, tds_amount: payment.tds_amount,
    receipt_number: payment.receipt_number, status: payment.status,
    notes: payment.notes,
  });

  return payment;
}

// ── Settings ───────────────────────────────────────────────
export function updateSettings(data: Partial<Omit<Settings, "id" | "created_at" | "updated_at">>) {
  const updated = { ...data, updated_at: new Date().toISOString() };
  store.settings = { ...store.settings, ...updated };
  emitChange();

  const settingsId = store.settings.id;
  if (settingsId && settingsId !== "settings-1") {
    persist("settings", "update", updated, { id: settingsId });
  }
}

// ── Queries ─────────────────────────────────────────────────
export function getActivitiesForLead(leadId: string): Activity[] {
  return store.activities
    .filter((a) => a.lead_id === leadId)
    .map((a) => ({
      ...a,
      creator: a.creator || demoUsers.find((u) => u.id === a.created_by),
    }));
}

export function getStoreStats() {
  const props = store.properties;
  const leads = store.leads;
  const totalProperties = props.length;
  const available = props.filter((p) => p.status === "available").length;
  const sold = props.filter((p) => p.status === "sold").length;
  const reserved = props.filter((p) => p.status === "reserved").length;
  const totalRevenue = props
    .filter((p) => p.status === "sold")
    .reduce((sum, p) => sum + p.price, 0);
  const bookedLeads = leads.filter((l) => l.status === "booked").length;
  const totalLeads = leads.length;
  const conversionRate = totalLeads > 0 ? Math.round((bookedLeads / totalLeads) * 100) : 0;
  return { totalProperties, available, sold, reserved, totalRevenue, conversionRate, bookedLeads, totalLeads };
}

// ── Bulk Property Operations ──────────────────────────────
export function deleteProperties(ids: string[]) {
  const idSet = new Set(ids);
  store.properties = store.properties.filter((p) => !idSet.has(p.id));
  emitChange();
  const client = sb();
  if (client) {
    client.from("properties").delete().in("id", ids);
  }
}

export function updatePropertiesStatus(ids: string[], status: PropertyStatus) {
  const idSet = new Set(ids);
  const updated_at = new Date().toISOString();
  store.properties = store.properties.map((p) =>
    idSet.has(p.id) ? { ...p, status, updated_at } : p
  );
  emitChange();
  const client = sb();
  if (client) {
    client.from("properties").update({ status, updated_at }).in("id", ids);
  }
}

// ── Payment Schedules ────────────────────────────────────
export function addPaymentSchedule(data: {
  booking_id: string;
  installment_number: number;
  amount: number;
  due_date: string;
}): PaymentSchedule {
  const schedule: PaymentSchedule = {
    id: crypto.randomUUID(),
    tenant_id: store.tenantId || "",
    booking_id: data.booking_id,
    installment_number: data.installment_number,
    amount: data.amount,
    due_date: data.due_date,
    status: "pending",
    payment_id: null,
    created_at: new Date().toISOString(),
  };
  store.paymentSchedules = [...store.paymentSchedules, schedule];
  emitChange();
  persist("payment_schedules", "insert", {
    booking_id: schedule.booking_id,
    installment_number: schedule.installment_number,
    amount: schedule.amount,
    due_date: schedule.due_date,
    status: schedule.status,
  });
  return schedule;
}

export function updatePaymentScheduleStatus(
  id: string,
  status: "pending" | "paid" | "overdue",
  paymentId?: string
) {
  store.paymentSchedules = store.paymentSchedules.map((s) =>
    s.id === id ? { ...s, status, payment_id: paymentId || s.payment_id } : s
  );
  emitChange();
  persist("payment_schedules", "update", { status, payment_id: paymentId || null }, { id });
}

export function createPaymentScheduleForBooking(bookingId: string, installments: number) {
  const booking = store.bookings.find((b) => b.id === bookingId);
  if (!booking) return;
  const remaining = booking.total_price - booking.token_amount;
  const perInstallment = Math.round(remaining / installments);
  const bookingDate = new Date(booking.booking_date);

  for (let i = 0; i < installments; i++) {
    const dueDate = new Date(bookingDate);
    dueDate.setMonth(dueDate.getMonth() + i + 1);
    const amount = i === installments - 1
      ? remaining - perInstallment * (installments - 1)
      : perInstallment;
    addPaymentSchedule({
      booking_id: bookingId,
      installment_number: i + 1,
      amount,
      due_date: dueDate.toISOString(),
    });
  }
}

export function getPaymentSchedulesForBooking(bookingId: string): PaymentSchedule[] {
  return store.paymentSchedules
    .filter((s) => s.booking_id === bookingId)
    .sort((a, b) => a.installment_number - b.installment_number);
}

// ── Auto Lead Assignment ─────────────────────────────────
export function getAgentWithFewestLeads(): string | null {
  const agents = demoUsers.filter((u) => u.role === "agent" || u.role === "admin");
  if (agents.length === 0) return null;
  const activeStatuses = new Set(["new", "contacted", "property_shared", "site_visit", "negotiation"]);
  const counts = new Map<string, number>();
  for (const agent of agents) counts.set(agent.id, 0);
  for (const lead of store.leads) {
    if (lead.assigned_agent_id && activeStatuses.has(lead.status)) {
      counts.set(lead.assigned_agent_id, (counts.get(lead.assigned_agent_id) || 0) + 1);
    }
  }
  let minId = agents[0].id;
  let minCount = counts.get(minId) ?? 0;
  for (const [id, count] of counts) {
    if (count < minCount) {
      minId = id;
      minCount = count;
    }
  }
  return minId;
}

// ── Notifications (computed) ─────────────────────────────
export function getNotifications(): DashboardNotification[] {
  const now = new Date();
  const notifications: DashboardNotification[] = [];
  const activeStatuses = new Set(["new", "contacted", "property_shared", "site_visit", "negotiation"]);

  for (const lead of store.leads) {
    if (!activeStatuses.has(lead.status)) continue;

    if (lead.next_follow_up && new Date(lead.next_follow_up) < now) {
      notifications.push({
        id: `notif-followup-${lead.id}`,
        type: "overdue_followup",
        title: `Overdue follow-up: ${lead.name}`,
        description: `Follow-up was due ${new Date(lead.next_follow_up).toLocaleDateString("en-IN")}`,
        href: `/leads/${lead.id}`,
        priority: "high",
        created_at: lead.next_follow_up,
      });
    }

    const lastContact = lead.last_contacted_at || lead.updated_at;
    const daysSince = Math.floor((now.getTime() - new Date(lastContact).getTime()) / 86400000);
    if (daysSince >= 7) {
      notifications.push({
        id: `notif-stale-${lead.id}`,
        type: "stale_lead",
        title: `Stale lead: ${lead.name}`,
        description: `No contact in ${daysSince} days`,
        href: `/leads/${lead.id}`,
        priority: daysSince >= 14 ? "high" : "medium",
        created_at: lastContact,
      });
    }

    if (!lead.assigned_agent_id) {
      notifications.push({
        id: `notif-unassigned-${lead.id}`,
        type: "unassigned_lead",
        title: `Unassigned: ${lead.name}`,
        description: `New lead from ${lead.source} has no agent`,
        href: `/leads/${lead.id}`,
        priority: "medium",
        created_at: lead.created_at,
      });
    }
  }

  for (const schedule of store.paymentSchedules) {
    if (schedule.status === "pending" && new Date(schedule.due_date) < now) {
      const booking = store.bookings.find((b) => b.id === schedule.booking_id);
      const lead = booking ? store.leads.find((l) => l.id === booking.lead_id) : null;
      notifications.push({
        id: `notif-payment-${schedule.id}`,
        type: "overdue_payment",
        title: `Overdue payment: Installment #${schedule.installment_number}`,
        description: `${lead?.name || "Unknown"} — due ${new Date(schedule.due_date).toLocaleDateString("en-IN")}`,
        href: booking ? `/bookings/${booking.id}` : "/bookings",
        priority: "high",
        created_at: schedule.due_date,
      });
    }
  }

  notifications.sort((a, b) => {
    const pOrder = { high: 0, medium: 1, low: 2 };
    return pOrder[a.priority] - pOrder[b.priority];
  });

  return notifications;
}

// ── Reload ─────────────────────────────────────────────────
export async function reloadStore() {
  store._loaded = false;
  initPromise = null;
  await initializeStore();
}

// ── Snapshot (for testing) ──────────────────────────────────
export function getStoreSnapshot(): Readonly<Store> {
  return store;
}

// ── React hook ──────────────────────────────────────────────
export function useDemoStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useCurrentUser() {
  const s = useDemoStore();
  return s.currentUser;
}
