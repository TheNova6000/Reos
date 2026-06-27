import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const middlewareSource = readFileSync(
  join(__dirname, "supabase/middleware.ts"),
  "utf-8"
);

describe("Auth middleware — route protection", () => {
  const protectedRoutes = [
    "/dashboard",
    "/inventory",
    "/leads",
    "/bookings",
    "/documents",
    "/analytics",
    "/compliance",
    "/settings",
  ];

  for (const route of protectedRoutes) {
    it(`protects ${route}`, () => {
      expect(middlewareSource).toContain(`"${route}"`);
    });
  }

  it("auth guard is active — not commented out", () => {
    expect(middlewareSource).toContain("if (!user && isDashboardRoute)");
    expect(middlewareSource).not.toMatch(/\/\/\s*if \(!user && isDashboardRoute\)/);
  });

  it("redirects to /login with redirect param", () => {
    expect(middlewareSource).toContain('url.pathname = "/login"');
    expect(middlewareSource).toContain('url.searchParams.set("redirect"');
  });

  it("redirects authenticated users away from /login", () => {
    expect(middlewareSource).toContain('request.nextUrl.pathname === "/login"');
    expect(middlewareSource).toContain('url.pathname = "/dashboard"');
  });

  it("skips auth when Supabase is not configured", () => {
    expect(middlewareSource).toContain("your-supabase-url-here");
    expect(middlewareSource).toContain("return supabaseResponse");
  });
});
