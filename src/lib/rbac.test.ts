import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import {
  ROLES, PERMISSION_GROUPS, PERMISSION_LABELS,
  getRoleByName, hasPermission,
  type Permission, type RoleName,
} from "./constants";

// ── Role definitions ──────────────────────────────────────

describe("RBAC — Role definitions", () => {
  it("defines exactly 5 roles", () => {
    expect(ROLES).toHaveLength(5);
  });

  it("roles are ordered: owner, admin, manager, agent, viewer", () => {
    expect(ROLES.map((r) => r.name)).toEqual(["owner", "admin", "manager", "agent", "viewer"]);
  });

  it("every role has a name, label, description, and permissions array", () => {
    for (const role of ROLES) {
      expect(role.name).toBeTruthy();
      expect(role.label).toBeTruthy();
      expect(role.description).toBeTruthy();
      expect(Array.isArray(role.permissions)).toBe(true);
      expect(role.permissions.length).toBeGreaterThan(0);
    }
  });

  it("owner is the only protected role", () => {
    const protectedRoles = ROLES.filter((r) => r.isProtected);
    expect(protectedRoles).toHaveLength(1);
    expect(protectedRoles[0].name).toBe("owner");
  });

  it("agent is the default role", () => {
    const defaults = ROLES.filter((r) => r.isDefault);
    expect(defaults).toHaveLength(1);
    expect(defaults[0].name).toBe("agent");
  });
});

// ── Permission hierarchy ──────────────────────────────────

describe("RBAC — Permission hierarchy", () => {
  it("owner has ALL permissions", () => {
    const allPerms = Object.keys(PERMISSION_LABELS) as Permission[];
    const owner = getRoleByName("owner")!;
    for (const perm of allPerms) {
      expect(owner.permissions).toContain(perm);
    }
  });

  it("admin has all permissions except team.remove", () => {
    const admin = getRoleByName("admin")!;
    expect(admin.permissions).not.toContain("team.remove");
    expect(admin.permissions.length).toBe(Object.keys(PERMISSION_LABELS).length - 1);
  });

  it("owner can remove team members, admin cannot", () => {
    expect(hasPermission("owner", "team.remove")).toBe(true);
    expect(hasPermission("admin", "team.remove")).toBe(false);
  });

  it("manager can create projects and properties", () => {
    expect(hasPermission("manager", "projects.create")).toBe(true);
    expect(hasPermission("manager", "projects.edit")).toBe(true);
    expect(hasPermission("manager", "properties.create")).toBe(true);
  });

  it("manager cannot edit settings or manage compliance", () => {
    expect(hasPermission("manager", "settings.edit")).toBe(false);
    expect(hasPermission("manager", "compliance.edit")).toBe(false);
  });

  it("manager can invite but not remove members", () => {
    expect(hasPermission("manager", "team.invite")).toBe(true);
    expect(hasPermission("manager", "team.remove")).toBe(false);
    expect(hasPermission("manager", "team.change_role")).toBe(false);
  });

  it("agent can view and create leads but not delete them", () => {
    expect(hasPermission("agent", "leads.view")).toBe(true);
    expect(hasPermission("agent", "leads.create")).toBe(true);
    expect(hasPermission("agent", "leads.edit")).toBe(true);
    expect(hasPermission("agent", "leads.delete")).toBe(false);
  });

  it("agent can create bookings but not cancel them", () => {
    expect(hasPermission("agent", "bookings.create")).toBe(true);
    expect(hasPermission("agent", "bookings.cancel")).toBe(false);
  });

  it("agent cannot create or delete projects/properties", () => {
    expect(hasPermission("agent", "projects.create")).toBe(false);
    expect(hasPermission("agent", "projects.delete")).toBe(false);
    expect(hasPermission("agent", "properties.create")).toBe(false);
    expect(hasPermission("agent", "properties.delete")).toBe(false);
  });

  it("agent can change property status (for reservations)", () => {
    expect(hasPermission("agent", "properties.change_status")).toBe(true);
  });

  it("agent cannot manage team", () => {
    expect(hasPermission("agent", "team.invite")).toBe(false);
    expect(hasPermission("agent", "team.remove")).toBe(false);
    expect(hasPermission("agent", "team.change_role")).toBe(false);
  });

  it("viewer can only view — no create, edit, or delete", () => {
    const viewer = getRoleByName("viewer")!;
    const writePerms = viewer.permissions.filter(
      (p) => p.includes("create") || p.includes("edit") || p.includes("delete") ||
             p.includes("upload") || p.includes("add") || p.includes("cancel") ||
             p.includes("invite") || p.includes("remove") || p.includes("change") || p.includes("assign")
    );
    expect(writePerms).toHaveLength(0);
  });

  it("viewer can view analytics, compliance, settings, team, leads, payments", () => {
    expect(hasPermission("viewer", "analytics.view")).toBe(true);
    expect(hasPermission("viewer", "compliance.view")).toBe(true);
    expect(hasPermission("viewer", "settings.view")).toBe(true);
    expect(hasPermission("viewer", "team.view")).toBe(true);
    expect(hasPermission("viewer", "leads.view")).toBe(true);
    expect(hasPermission("viewer", "payments.view")).toBe(true);
  });

  it("viewer can download documents but not upload or delete", () => {
    expect(hasPermission("viewer", "documents.download")).toBe(true);
    expect(hasPermission("viewer", "documents.upload")).toBe(false);
    expect(hasPermission("viewer", "documents.delete")).toBe(false);
  });
});

// ── Helper functions ──────────────────────────────────────

describe("RBAC — Helper functions", () => {
  it("getRoleByName returns correct role", () => {
    expect(getRoleByName("owner")?.label).toBe("Owner");
    expect(getRoleByName("agent")?.label).toBe("Agent");
  });

  it("getRoleByName returns undefined for unknown role", () => {
    expect(getRoleByName("superadmin")).toBeUndefined();
    expect(getRoleByName("")).toBeUndefined();
  });

  it("hasPermission returns false for unknown role", () => {
    expect(hasPermission("unknown", "leads.view")).toBe(false);
  });
});

// ── Permission groups ─────────────────────────────────────

describe("RBAC — Permission groups", () => {
  it("has 6 permission groups", () => {
    expect(PERMISSION_GROUPS).toHaveLength(6);
  });

  it("every permission in groups exists in PERMISSION_LABELS", () => {
    for (const group of PERMISSION_GROUPS) {
      for (const perm of group.permissions) {
        expect(PERMISSION_LABELS).toHaveProperty(perm);
      }
    }
  });

  it("all defined permissions are in at least one group", () => {
    const allGroupPerms = PERMISSION_GROUPS.flatMap((g) => g.permissions);
    for (const perm of Object.keys(PERMISSION_LABELS)) {
      expect(allGroupPerms).toContain(perm);
    }
  });
});

// ── Server actions ────────────────────────────────────────

describe("RBAC — Server actions", () => {
  const authSource = readFileSync(
    join(__dirname, "../app/actions/auth.ts"),
    "utf-8"
  );

  it("exports updateMemberRole function", () => {
    expect(authSource).toContain("export async function updateMemberRole");
  });

  it("updateMemberRole scopes by tenant_id", () => {
    expect(authSource).toContain('.eq("tenant_id", tenantId)');
  });

  it("exports removeMember function", () => {
    expect(authSource).toContain("export async function removeMember");
  });

  it("removeMember prevents removing the owner", () => {
    expect(authSource).toContain('profile.role === "owner"');
    expect(authSource).toContain("Cannot remove the owner");
  });

  it("removeMember deletes both profile and auth user", () => {
    const removeSection = authSource.slice(authSource.indexOf("removeMember"));
    expect(removeSection).toContain(".delete()");
    expect(removeSection).toContain("admin.auth.admin.deleteUser(userId)");
  });

  it("removeMember checks member exists before deleting", () => {
    expect(authSource).toContain("Member not found");
  });
});
