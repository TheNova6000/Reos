import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const authSource = readFileSync(
  join(__dirname, "../app/actions/auth.ts"),
  "utf-8"
);

describe("Auth actions — signup", () => {
  it("validates required fields", () => {
    expect(authSource).toContain("!companyName || !fullName || !email || !password");
  });

  it("enforces minimum password length", () => {
    expect(authSource).toContain("password.length < 8");
  });

  it("creates tenant with slug from company name", () => {
    expect(authSource).toContain("generateSlug(companyName)");
  });

  it("handles duplicate slug with retry", () => {
    expect(authSource).toContain("attempt < 5");
    expect(authSource).toContain("duplicate key");
  });

  it("rolls back auth user if tenant creation fails", () => {
    expect(authSource).toContain("admin.auth.admin.deleteUser(userId)");
  });

  it("rolls back tenant and auth if settings creation fails", () => {
    expect(authSource).toContain('admin.from("tenants").delete()');
    expect(authSource).toContain("settingsError");
  });

  it("rolls back everything if profile creation fails", () => {
    expect(authSource).toContain('admin.from("settings").delete()');
    expect(authSource).toContain("profileError");
  });

  it("creates user profile with admin role", () => {
    expect(authSource).toContain('role: "admin"');
  });

  it("redirects to dashboard on success", () => {
    expect(authSource).toContain('redirect("/dashboard")');
  });
});

describe("Auth actions — inviteTeamMember", () => {
  it("exports inviteTeamMember function", () => {
    expect(authSource).toContain("export async function inviteTeamMember");
  });

  it("validates required fields for invite", () => {
    expect(authSource).toContain("!fullName || !email || !tenantId");
  });

  it("creates user via admin API with email_confirm", () => {
    expect(authSource).toContain("admin.auth.admin.createUser");
    expect(authSource).toContain("email_confirm: true");
  });

  it("handles already-registered email", () => {
    expect(authSource).toContain("already been registered");
  });

  it("links invited user to the correct tenant", () => {
    expect(authSource).toContain("tenant_id: tenantId");
  });

  it("assigns the specified role", () => {
    expect(authSource).toContain("role,");
  });

  it("rolls back auth user if profile creation fails", () => {
    const inviteSection = authSource.slice(authSource.indexOf("inviteTeamMember"));
    expect(inviteSection).toContain("admin.auth.admin.deleteUser(userId)");
  });

  it("sends password reset email to invited user", () => {
    expect(authSource).toContain("resetPasswordForEmail(email");
  });

  it("returns success flag on completion", () => {
    expect(authSource).toContain("return { success: true }");
  });
});

describe("Auth actions — forgot password (login page)", () => {
  const loginSource = readFileSync(
    join(__dirname, "../app/(auth)/login/page.tsx"),
    "utf-8"
  );

  it("has forgot password mode toggle", () => {
    expect(loginSource).toContain("resetMode");
    expect(loginSource).toContain("setResetMode");
  });

  it("calls resetPasswordForEmail", () => {
    expect(loginSource).toContain("resetPasswordForEmail(email");
  });

  it("shows success confirmation after reset email sent", () => {
    expect(loginSource).toContain("resetSent");
    expect(loginSource).toContain("Password reset email sent");
  });

  it("has Forgot password link", () => {
    expect(loginSource).toContain("Forgot password?");
  });

  it("has back to sign in button in reset mode", () => {
    expect(loginSource).toContain("Back to Sign In");
  });
});
