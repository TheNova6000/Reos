import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./server", () => ({
  createClient: vi.fn().mockResolvedValue(null),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({
    getAll: () => [],
    set: () => {},
  }),
}));

import {
  getProjects,
  getAllProjects,
  getProjectBySlug,
  getProperties,
  getPropertiesByProject,
  getPropertyById,
  getPublicStats,
} from "./queries";
import { demoProjects, demoProperties } from "../demo-data";

describe("Server-side queries — demo data fallback", () => {
  it("getProjects returns only non-upcoming demo projects", async () => {
    const projects = await getProjects();
    expect(projects.length).toBeGreaterThan(0);
    expect(projects.every((p) => p.status !== "upcoming")).toBe(true);
  });

  it("getAllProjects returns all demo projects including upcoming", async () => {
    const projects = await getAllProjects();
    expect(projects).toEqual(demoProjects);
    const hasUpcoming = projects.some((p) => p.status === "upcoming");
    expect(hasUpcoming).toBe(true);
  });

  it("getProjectBySlug finds a project by slug", async () => {
    const project = await getProjectBySlug("green-valley-phase-2");
    expect(project).not.toBeNull();
    expect(project!.name).toBe("Green Valley Phase 2");
  });

  it("getProjectBySlug returns null for unknown slug", async () => {
    const project = await getProjectBySlug("nonexistent-project");
    expect(project).toBeNull();
  });

  it("getProperties returns all demo properties without filters", async () => {
    const properties = await getProperties();
    expect(properties.length).toBe(demoProperties.length);
  });

  it("getProperties filters by status", async () => {
    const available = await getProperties({ status: "available" });
    expect(available.length).toBeGreaterThan(0);
    expect(available.every((p) => p.status === "available")).toBe(true);
  });

  it("getProperties filters by projectId", async () => {
    const p1Props = await getProperties({ projectId: "p1" });
    expect(p1Props.length).toBeGreaterThan(0);
    expect(p1Props.every((p) => p.project_id === "p1")).toBe(true);
  });

  it("getProperties filters by facing", async () => {
    const eastFacing = await getProperties({ facing: "east" });
    expect(eastFacing.every((p) => p.facing === "east")).toBe(true);
  });

  it("getProperties filters by budget range", async () => {
    const cheap = await getProperties({ budgetMax: 2000000 });
    expect(cheap.every((p) => p.price <= 2000000)).toBe(true);
  });

  it("getProperties combines multiple filters", async () => {
    const result = await getProperties({
      status: "available",
      projectId: "p1",
      facing: "corner",
    });
    for (const p of result) {
      expect(p.status).toBe("available");
      expect(p.project_id).toBe("p1");
      expect(p.facing).toBe("corner");
    }
  });

  it("getPropertiesByProject returns correct project's properties", async () => {
    const props = await getPropertiesByProject("p1");
    expect(props.length).toBe(48); // Green Valley has 6x8 = 48 plots
    expect(props.every((p) => p.project_id === "p1")).toBe(true);
  });

  it("getPropertiesByProject returns empty for unknown project", async () => {
    const props = await getPropertiesByProject("nonexistent");
    expect(props).toEqual([]);
  });

  it("getPropertyById finds a property", async () => {
    const prop = await getPropertyById("gv-1");
    expect(prop).not.toBeNull();
    expect(prop!.project_id).toBe("p1");
  });

  it("getPropertyById returns null for unknown id", async () => {
    const prop = await getPropertyById("nonexistent-id");
    expect(prop).toBeNull();
  });

  it("getPublicStats returns correct counts", async () => {
    const stats = await getPublicStats();
    expect(stats.activeProjects).toBeGreaterThan(0);
    expect(stats.availableProperties).toBeGreaterThan(0);
    expect(stats.soldProperties).toBeGreaterThan(0);
    expect(stats.totalProperties).toBe(demoProperties.length);
    expect(stats.availableProperties + stats.soldProperties).toBeLessThanOrEqual(
      stats.totalProperties
    );
  });
});

describe("Demo data integrity", () => {
  it("all projects have required fields", () => {
    for (const project of demoProjects) {
      expect(project.id).toBeTruthy();
      expect(project.name).toBeTruthy();
      expect(project.slug).toBeTruthy();
      expect(project.location).toBeTruthy();
      expect(project.city).toBeTruthy();
      expect(project.state).toBeTruthy();
      expect(["upcoming", "ongoing", "completed", "sold_out"]).toContain(
        project.status
      );
    }
  });

  it("all properties have required fields and valid references", () => {
    const projectIds = new Set(demoProjects.map((p) => p.id));
    for (const prop of demoProperties) {
      expect(prop.id).toBeTruthy();
      expect(prop.plot_number).toBeTruthy();
      expect(projectIds.has(prop.project_id)).toBe(true);
      expect(prop.area).toBeGreaterThan(0);
      expect(prop.price).toBeGreaterThan(0);
      expect([
        "available",
        "reserved",
        "sold",
        "blocked",
        "under_registration",
      ]).toContain(prop.status);
    }
  });

  it("project slugs are unique", () => {
    const slugs = demoProjects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("property ids are unique", () => {
    const ids = demoProperties.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("Green Valley has 48 plots (6x8 grid)", () => {
    const gvProps = demoProperties.filter((p) => p.project_id === "p1");
    expect(gvProps.length).toBe(48);
  });

  it("Sunrise Meadows has 36 plots (6x6 grid)", () => {
    const smProps = demoProperties.filter((p) => p.project_id === "p2");
    expect(smProps.length).toBe(36);
  });
});
