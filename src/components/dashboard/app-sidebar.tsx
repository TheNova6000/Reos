"use client";

import { useState, useEffect } from "react";
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
import { useCurrentUser } from "@/lib/demo-store";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Inventory", href: "/inventory", icon: Building2 },
  { label: "Leads", href: "/leads", icon: Users },
  { label: "Bookings", href: "/bookings", icon: BookOpen },
  { label: "Site Visits", href: "/site-visits", icon: CalendarDays },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Compliance", href: "/compliance", icon: ShieldCheck },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Website Setup", href: "/onboarding", icon: Palette },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const currentUser = useCurrentUser();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  async function handleSignOut() {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    document.cookie = "reos-dev-auth=; path=/; max-age=0";
    router.push("/login");
    router.refresh();
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_16px_oklch(0.72_0.15_192_/_25%)]">
            <Building2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">REOS</h1>
            <p className="text-[11px] text-sidebar-foreground/50 leading-none">
              Real Estate OS
            </p>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton isActive={isActive} render={<Link href={item.href} />}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        {mounted && currentUser && (
          <div className="px-4 py-2">
            <p className="text-sm font-medium truncate">{currentUser.full_name}</p>
            <p className="text-xs text-sidebar-foreground/50 capitalize">{currentUser.role}</p>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/" />}>
              <ExternalLink className="w-4 h-4" />
              <span>REOS Website</span>
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
