import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const storeSource = readFileSync(
  join(__dirname, "demo-store.tsx"),
  "utf-8"
);

describe("Realtime — subscription setup", () => {
  it("subscribes to all 8 data tables", () => {
    const tables = [
      "projects", "properties", "leads", "activities",
      "documents", "bookings", "payments", "payment_schedules",
    ];
    for (const table of tables) {
      expect(storeSource).toContain(`"${table}"`);
    }
    expect(storeSource).toContain("realtime-${table}");
  });

  it("listens to postgres_changes with wildcard event", () => {
    expect(storeSource).toContain('"postgres_changes"');
    expect(storeSource).toContain('event: "*"');
    expect(storeSource).toContain('schema: "public"');
  });

  it("exports initializeRealtime function", () => {
    expect(storeSource).toContain("export function initializeRealtime()");
  });

  it("calls initializeRealtime after Supabase data load", () => {
    const loadSection = storeSource.slice(
      storeSource.indexOf("initializeStore"),
      storeSource.indexOf("initializeRealtime()")
    );
    expect(loadSection).toContain("store._loaded = true");
    expect(storeSource).toContain("initializeRealtime()");
  });

  it("does not subscribe when using localStorage fallback", () => {
    expect(storeSource).toContain("useLocalFallback");
    expect(storeSource).toContain("!client || realtimeInitialized || useLocalFallback");
  });

  it("prevents double initialization", () => {
    expect(storeSource).toContain("realtimeInitialized");
    expect(storeSource).toContain("realtimeInitialized = true");
  });
});

describe("Realtime — event handling", () => {
  it("handles INSERT events by prepending to array", () => {
    expect(storeSource).toContain('payload.eventType === "INSERT"');
    expect(storeSource).toContain("setStoreArray(table, [newRow, ...arr])");
  });

  it("handles UPDATE events by replacing in array", () => {
    expect(storeSource).toContain('payload.eventType === "UPDATE"');
    expect(storeSource).toContain("updated[idx] = newRow");
  });

  it("handles DELETE events by filtering from array", () => {
    expect(storeSource).toContain('payload.eventType === "DELETE"');
    expect(storeSource).toContain("arr.filter((r) => r.id !== oldRow.id)");
  });

  it("deduplicates INSERT — skips if id already exists", () => {
    expect(storeSource).toContain("!arr.find((r) => r.id === newRow.id)");
  });

  it("handles settings table updates specially", () => {
    expect(storeSource).toContain('table === "settings"');
    expect(storeSource).toContain("store.settings = newRow as unknown as Settings");
  });

  it("calls emitChange after each event type", () => {
    const realtimeSection = storeSource.slice(
      storeSource.indexOf("initializeRealtime"),
      storeSource.indexOf("// ── Persist helper")
    );
    const emitCount = (realtimeSection.match(/emitChange\(\)/g) || []).length;
    expect(emitCount).toBeGreaterThanOrEqual(4);
  });
});

describe("Realtime — local event deduplication", () => {
  it("uses pendingLocalIds set to track own mutations", () => {
    expect(storeSource).toContain("pendingLocalIds = new Set<string>()");
  });

  it("skips events whose id is in pendingLocalIds", () => {
    expect(storeSource).toContain("pendingLocalIds.has(newRow.id)");
    expect(storeSource).toContain("pendingLocalIds.delete(newRow.id)");
    expect(storeSource).toContain("return;");
  });

  it("persist() marks match id before update", () => {
    expect(storeSource).toContain('if (match?.id) pendingLocalIds.add(match.id)');
  });

  it("persist() marks returned id after insert", () => {
    expect(storeSource).toContain("if (row?.id) pendingLocalIds.add(row.id)");
  });
});

describe("Realtime — store array helpers", () => {
  it("getStoreArray maps all table names to store arrays", () => {
    expect(storeSource).toContain("function getStoreArray(table: TableName)");
    expect(storeSource).toContain("projects: store.projects");
    expect(storeSource).toContain("properties: store.properties");
    expect(storeSource).toContain("leads: store.leads");
    expect(storeSource).toContain("bookings: store.bookings");
    expect(storeSource).toContain("payments: store.payments");
    expect(storeSource).toContain("payment_schedules: store.paymentSchedules");
  });

  it("setStoreArray maps all table names to store setters", () => {
    expect(storeSource).toContain("function setStoreArray(table: TableName, arr: unknown[])");
  });

  it("REALTIME_TABLES lists exactly 8 tables", () => {
    const match = storeSource.match(/REALTIME_TABLES:\s*TableName\[\]\s*=\s*\[([\s\S]*?)\]/);
    expect(match).not.toBeNull();
    const tableList = match![1];
    const count = (tableList.match(/"/g) || []).length / 2;
    expect(count).toBe(8);
  });
});
