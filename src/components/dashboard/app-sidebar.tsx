"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  BarChart3,
  ShieldCheck,
  Settings,
  LogOut,
  ExternalLink,
  Palette,
  BookOpen,
  CalendarDays,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/client";
import { useDemoStore, useCurrentUser } from "@/lib/demo-store";

type BadgeKey = "leads" | "bookings" | "visits";

const NAV_GROUPS: {
  label: string;
  items: { label: string; href: string; icon: React.ComponentType<{ className?: string }>; badgeKey?: BadgeKey }[];
}[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "CRM",
    items: [
      { label: "Leads", href: "/leads", icon: Users, badgeKey: "leads" },
      { label: "Bookings", href: "/bookings", icon: BookOpen, badgeKey: "bookings" },
      { label: "Site Visits", href: "/site-visits", icon: CalendarDays, badgeKey: "visits" },
    ],
  },
  {
    label: "Assets",
    items: [
      { label: "Inventory", href: "/inventory", icon: Building2 },
      { label: "Documents", href: "/documents", icon: FileText },
      { label: "Compliance", href: "/compliance", icon: ShieldCheck },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", href: "/settings", icon: Settings },
      { label: "Website Setup", href: "/onboarding", icon: Palette },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const currentUser = useCurrentUser();
  const store = useDemoStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const counts = useMemo<Record<BadgeKey, number>>(
    () => ({
      leads: store.leads.filter(
        (l) => !["booked", "lost", "possession", "registration"].includes(l.status)
      ).length,
      bookings: store.bookings.filter((b) => b.status !== "cancelled").length,
      visits: store.activities.filter(
        (a) =>
          a.activity_type === "site_visit" &&
          !a.is_completed &&
          a.scheduled_for &&
          new Date(a.scheduled_for) > new Date()
      ).length,
    }),
    [store.leads, store.bookings, store.activities]
  );

  async function handleSignOut() {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    document.cookie = "reos-dev-auth=; path=/; max-age=0";
    router.push("/login");
    router.refresh();
  }

  const initials = currentUser?.full_name
    ? currentUser.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary flex items-center justify-center shadow-[0_0_16px_oklch(0.60_0.24_27_/_40%)]">
            <Building2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-sidebar-foreground">
              REOS
            </h1>
            <p className="text-[10px] text-sidebar-foreground/40 leading-none uppercase tracking-[0.15em]">
              Real Estate OS
            </p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {NAV_GROUPS.map((group, gi) => (
          <SidebarGroup key={group.label} className={gi === 0 ? "pt-3 pb-1" : "pt-2 pb-1"}>
            <SidebarGroupLabel className="text-[9px] font-bold uppercase tracking-[0.18em] text-sidebar-foreground/25 px-4 mb-0.5">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  const badge = item.badgeKey ? counts[item.badgeKey] : 0;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton isActive={isActive} render={<Link href={item.href} />}>
                        <item.icon className="w-4 h-4 shrink-0" />
                        <span className="flex-1 truncate">{item.label}</span>
                        {badge > 0 && (
                          <span
                            className={`shrink-0 text-[10px] font-bold px-1.5 py-0 min-w-[18px] text-center tabular-nums ${
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "bg-sidebar-foreground/10 text-sidebar-foreground/50"
                            }`}
                          >
                            {badge}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border pt-2">
        {mounted && currentUser && (
          <div className="px-4 py-2 flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-[11px] font-bold text-primary">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate text-sidebar-foreground">
                {currentUser.full_name}
              </p>
              <p className="text-[10px] text-sidebar-foreground/40 capitalize">
                {currentUser.role}
              </p>
            </div>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={
                <a
                  href="https://vision-infra-tech-thlq.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Website</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
