import { createClient } from "@/lib/supabase/server";
import {
  demoProjects,
  demoProperties,
  getDemoStats,
  getPropertiesForProject,
} from "../demo-data";
import type { Project, Property } from "@/types/database";

// Fall back to demo data when Supabase tables are empty (not yet seeded).
// Once the DB is seeded, real data takes precedence automatically.

export async function getProjects(): Promise<Project[]> {
  const fallback = demoProjects.filter((p) => p.status !== "upcoming");
  const supabase = await createClient();
  if (!supabase) return fallback;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .neq("status", "upcoming")
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) return fallback;
  return data as Project[];
}

export async function getAllProjects(): Promise<Project[]> {
  const supabase = await createClient();
  if (!supabase) return demoProjects;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) return demoProjects;
  return data as Project[];
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | null> {
  const supabase = await createClient();
  if (!supabase) return demoProjects.find((p) => p.slug === slug) ?? null;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data)
    return demoProjects.find((p) => p.slug === slug) ?? null;
  return data as Project;
}

export async function getProperties(filters?: {
  status?: string;
  projectId?: string;
  propertyType?: string;
  facing?: string;
  budgetMin?: number;
  budgetMax?: number;
}): Promise<Property[]> {
  const supabase = await createClient();
  if (!supabase) {
    let props = [...demoProperties];
    if (filters?.status) props = props.filter((p) => p.status === filters.status);
    if (filters?.projectId)
      props = props.filter((p) => p.project_id === filters.projectId);
    if (filters?.propertyType)
      props = props.filter((p) => p.property_type === filters.propertyType);
    if (filters?.facing) props = props.filter((p) => p.facing === filters.facing);
    if (filters?.budgetMin)
      props = props.filter((p) => p.price >= filters.budgetMin!);
    if (filters?.budgetMax)
      props = props.filter((p) => p.price <= filters.budgetMax!);
    return props;
  }

  let query = supabase.from("properties").select("*");

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.projectId) query = query.eq("project_id", filters.projectId);
  if (filters?.propertyType)
    query = query.eq("property_type", filters.propertyType);
  if (filters?.facing) query = query.eq("facing", filters.facing);
  if (filters?.budgetMin) query = query.gte("price", filters.budgetMin);
  if (filters?.budgetMax) query = query.lte("price", filters.budgetMax);

  const { data, error } = await query.order("plot_number");

  if (error || !data || data.length === 0) {
    let props = [...demoProperties];
    if (filters?.status) props = props.filter((p) => p.status === filters.status);
    if (filters?.projectId)
      props = props.filter((p) => p.project_id === filters.projectId);
    if (filters?.propertyType)
      props = props.filter((p) => p.property_type === filters.propertyType);
    if (filters?.facing) props = props.filter((p) => p.facing === filters.facing);
    if (filters?.budgetMin)
      props = props.filter((p) => p.price >= filters.budgetMin!);
    if (filters?.budgetMax)
      props = props.filter((p) => p.price <= filters.budgetMax!);
    return props;
  }
  return data as Property[];
}

export async function getPropertiesByProject(
  projectId: string
): Promise<Property[]> {
  const supabase = await createClient();
  if (!supabase) return getPropertiesForProject(projectId);

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("project_id", projectId)
    .order("plot_number");

  if (error || !data || data.length === 0) return getPropertiesForProject(projectId);
  return data as Property[];
}

export async function getPropertyById(
  id: string
): Promise<Property | null> {
  const supabase = await createClient();
  if (!supabase) return demoProperties.find((p) => p.id === id) ?? null;

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return demoProperties.find((p) => p.id === id) ?? null;
  return data as Property;
}

export async function getPublicStats() {
  const supabase = await createClient();
  if (!supabase) {
    const stats = getDemoStats();
    const projectCount = demoProjects.filter(
      (p) => p.status !== "upcoming"
    ).length;
    return {
      activeProjects: projectCount,
      availableProperties: stats.available,
      soldProperties: stats.sold,
      totalProperties: stats.totalProperties,
    };
  }

  const [projectsRes, propertiesRes] = await Promise.all([
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .neq("status", "upcoming"),
    supabase.from("properties").select("status"),
  ]);

  const properties = (propertiesRes.data ?? []) as { status: string }[];
  const count = projectsRes.count ?? 0;

  if (count === 0 && properties.length === 0) {
    const stats = getDemoStats();
    const projectCount = demoProjects.filter(
      (p) => p.status !== "upcoming"
    ).length;
    return {
      activeProjects: projectCount,
      availableProperties: stats.available,
      soldProperties: stats.sold,
      totalProperties: stats.totalProperties,
    };
  }

  return {
    activeProjects: count,
    availableProperties: properties.filter((p) => p.status === "available")
      .length,
    soldProperties: properties.filter((p) => p.status === "sold").length,
    totalProperties: properties.length,
  };
}
