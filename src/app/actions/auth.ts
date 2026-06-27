"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export interface SignupState {
  error?: string;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

export async function signup(
  _prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const companyName = (formData.get("company_name") as string)?.trim();
  const fullName = (formData.get("full_name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const phone = (formData.get("phone") as string)?.trim();

  if (!companyName || !fullName || !email || !password) {
    return { error: "Company name, your name, email, and password are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { error: "Server configuration error. Supabase is not configured." };
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  const userId = authData.user?.id;
  if (!userId) {
    return { error: "Signup failed. Please try again." };
  }

  const admin = createAdminClient();
  if (!admin) {
    return { error: "Server configuration error. Admin access not available." };
  }

  const baseSlug = generateSlug(companyName) || "company";
  let tenantId: string | null = null;

  for (let attempt = 0; attempt < 5; attempt++) {
    const candidateSlug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`;
    const { data: tenant, error: tenantError } = await admin
      .from("tenants")
      .insert({ name: companyName, slug: candidateSlug, status: "active" })
      .select("id")
      .single();

    if (!tenantError && tenant) {
      tenantId = tenant.id;
      break;
    }

    if (tenantError && !tenantError.message.includes("duplicate key")) {
      await admin.auth.admin.deleteUser(userId);
      return { error: "Failed to create organization. Please try again." };
    }
  }

  if (!tenantId) {
    await admin.auth.admin.deleteUser(userId);
    return { error: "Could not generate a unique URL for your company. Try a different name." };
  }

  const { error: settingsError } = await admin.from("settings").insert({
    tenant_id: tenantId,
    company_name: companyName,
    company_phone: phone || null,
    company_email: email,
    primary_color: "#dc2626",
    currency_symbol: "₹",
    tds_percentage: 1.0,
  });

  if (settingsError) {
    await admin.from("tenants").delete().eq("id", tenantId);
    await admin.auth.admin.deleteUser(userId);
    return { error: "Failed to initialize settings. Please try again." };
  }

  const { error: profileError } = await admin.from("user_profiles").insert({
    id: userId,
    tenant_id: tenantId,
    email,
    full_name: fullName,
    phone: phone || null,
    role: "admin",
    is_active: true,
  });

  if (profileError) {
    await admin.from("settings").delete().eq("tenant_id", tenantId);
    await admin.from("tenants").delete().eq("id", tenantId);
    await admin.auth.admin.deleteUser(userId);
    return { error: "Failed to create profile. Please try again." };
  }

  redirect("/dashboard");
}

export interface InviteState {
  error?: string;
  success?: boolean;
}

export async function inviteTeamMember(
  _prevState: InviteState,
  formData: FormData
): Promise<InviteState> {
  const fullName = (formData.get("full_name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const role = (formData.get("role") as string)?.trim() || "agent";
  const tenantId = (formData.get("tenant_id") as string)?.trim();

  if (!fullName || !email || !tenantId) {
    return { error: "Name, email, and tenant are required." };
  }

  const admin = createAdminClient();
  if (!admin) {
    return { error: "Server configuration error." };
  }

  const tempPassword = `Welcome${Math.random().toString(36).slice(2, 8)}!`;

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (authError) {
    if (authError.message.includes("already been registered")) {
      return { error: "This email is already registered." };
    }
    return { error: authError.message };
  }

  const userId = authData.user?.id;
  if (!userId) {
    return { error: "Failed to create user account." };
  }

  const { error: profileError } = await admin.from("user_profiles").insert({
    id: userId,
    tenant_id: tenantId,
    email,
    full_name: fullName,
    phone: phone || null,
    role,
    is_active: true,
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(userId);
    return { error: "Failed to create user profile." };
  }

  // Send password reset so the invited user sets their own password
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/login`,
    });
  }

  return { success: true };
}
