import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const ROOT = join(__dirname, "../..");

describe("next.config.ts — image remote patterns", () => {
  const configSource = readFileSync(
    join(ROOT, "next.config.ts"),
    "utf-8"
  );

  it("allows images.unsplash.com", () => {
    expect(configSource).toContain("images.unsplash.com");
  });

  it("allows Supabase storage domain", () => {
    expect(configSource).toContain("aiaaigfnqxlrqkhqihwp.supabase.co");
    expect(configSource).toContain("/storage/v1/object/public/**");
  });
});

describe("PWA manifest — public/manifest.json", () => {
  const raw = readFileSync(join(ROOT, "public/manifest.json"), "utf-8");
  const manifest = JSON.parse(raw);

  it("has correct app name", () => {
    expect(manifest.name).toBe("REOS - Real Estate Operating System");
    expect(manifest.short_name).toBe("REOS");
  });

  it("is standalone display", () => {
    expect(manifest.display).toBe("standalone");
  });

  it("has theme color matching brand", () => {
    expect(manifest.theme_color).toBe("#1e40af");
  });

  it("starts at root URL", () => {
    expect(manifest.start_url).toBe("/");
  });

  it("has at least one icon", () => {
    expect(manifest.icons.length).toBeGreaterThanOrEqual(1);
  });
});

describe("Root layout metadata", () => {
  const layoutSource = readFileSync(
    join(ROOT, "src/app/layout.tsx"),
    "utf-8"
  );

  it("exports viewport with themeColor", () => {
    expect(layoutSource).toContain("export const viewport: Viewport");
    expect(layoutSource).toContain('themeColor: "#1e40af"');
  });

  it("exports metadata with manifest link", () => {
    expect(layoutSource).toContain('manifest: "/manifest.json"');
  });

  it("has REOS in the default title", () => {
    expect(layoutSource).toContain("REOS");
    expect(layoutSource).toContain("Real Estate Operating System");
  });

  it("uses template for page titles", () => {
    expect(layoutSource).toContain("%s | REOS");
  });
});
