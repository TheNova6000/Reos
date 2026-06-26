import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative" data-lenis-prevent>
        <div
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 40% 40% at 70% 15%, oklch(0.72 0.15 192 / 3%) 0%, transparent 100%),
              radial-gradient(ellipse 40% 40% at 30% 85%, oklch(0.55 0.12 280 / 2%) 0%, transparent 100%)
            `,
          }}
        />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
