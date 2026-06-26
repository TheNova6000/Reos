"use client";

import Link from "next/link";
import { useMemo } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  IndianRupee,
  TrendingUp,
  Calendar,
  ArrowRight,
  ExternalLink,
  Globe,
  UserPlus,
  Palette,
  Rocket,
} from "lucide-react";
import { formatCurrency, LEAD_STATUS_LABELS, LEAD_STATUS_STYLES, LEAD_SOURCE_LABELS } from "@/lib/constants";
import { useDemoStore, getStoreStats } from "@/lib/demo-store";
import { PropertiesMapDynamic } from "@/components/dashboard/properties-map-dynamic";

export default function DashboardPage() {
  const store = useDemoStore();

  const stats = useMemo(() => getStoreStats(), [store.properties, store.leads]);

  const recentLeads = useMemo(
    () =>
      [...store.leads]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5),
    [store.leads]
  );

  const upcomingFollowUps = useMemo(
    () =>
      store.leads
        .filter((l) => l.next_follow_up)
        .sort((a, b) => new Date(a.next_follow_up!).getTime() - new Date(b.next_follow_up!).getTime())
        .slice(0, 5),
    [store.leads]
  );

  const leadsByStatus = useMemo(() => {
    const counts = { new: 0, contacted: 0, site_visit: 0, negotiation: 0 };
    for (const l of store.leads) {
      if (l.status in counts) counts[l.status as keyof typeof counts]++;
    }
    return counts;
  }, [store.leads]);

  const totalPipeline = Object.values(leadsByStatus).reduce((a, b) => a + b, 0);

  const statCards = [
    {
      title: "Total Properties",
      value: stats.totalProperties,
      detail: `${stats.available} available · ${stats.sold} sold · ${stats.reserved} reserved`,
      icon: Building2,
      accent: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Pipeline Leads",
      value: totalPipeline,
      detail: `${leadsByStatus.new} new · ${leadsByStatus.contacted} contacted · ${leadsByStatus.site_visit} site visit · ${leadsByStatus.negotiation} negotiation`,
      icon: Users,
      accent: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      title: "Revenue (Sold)",
      value: formatCurrency(stats.totalRevenue),
      detail: `From ${stats.sold} sold properties`,
      icon: IndianRupee,
      accent: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      detail: `${stats.bookedLeads} booked from ${stats.totalLeads} leads`,
      icon: TrendingUp,
      accent: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <>
      <DashboardHeader
        title="Dashboard"
        description={`${store.projects.length} projects · ${store.properties.length} properties · ${store.leads.length} leads`}
        actions={
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/" target="_blank" />}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            REOS Website
          </Button>
        }
      />
      <div className="p-4 space-y-6">
        {/* Onboarding Checklist */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-primary" />
                  Get Started — Set Up Your Account
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Complete these steps to get your website live</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <Link href="/settings" className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:border-primary/50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <UserPlus className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Add Your Team</p>
                  <p className="text-xs text-muted-foreground">Add agents in Settings → Users</p>
                </div>
              </Link>
              <Link href="/onboarding" className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:border-primary/50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Palette className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Design Your Website</p>
                  <p className="text-xs text-muted-foreground">Tell us colors, pages, content</p>
                </div>
              </Link>
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-card opacity-50">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Website Goes Live</p>
                  <p className="text-xs text-muted-foreground">3-4 days after preferences sent</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <Card key={card.title} className="transition-colors hover:ring-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <card.icon className={`h-4 w-4 ${card.accent}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{card.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Leads</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href="/leads" />}
              >
                View all <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-1">
              {recentLeads.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">
                  No leads yet. Leads from customer applications on the public site will appear here.
                </p>
              ) : (
                recentLeads.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/leads/${lead.id}`}
                    className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0 hover:bg-foreground/[0.03] -mx-2 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {LEAD_SOURCE_LABELS[lead.source]} ·{" "}
                        {new Date(lead.created_at).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs shrink-0 ml-3 ${LEAD_STATUS_STYLES[lead.status]?.outline || ""}`}
                    >
                      {LEAD_STATUS_LABELS[lead.status]}
                    </Badge>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upcoming Follow-ups</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {upcomingFollowUps.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">
                  No follow-ups scheduled. Set them on lead detail pages.
                </p>
              ) : (
                upcomingFollowUps.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/leads/${lead.id}`}
                    className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0 hover:bg-foreground/[0.03] -mx-2 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {lead.notes?.slice(0, 60) || "No notes"}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground text-right shrink-0 ml-4">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {lead.next_follow_up
                        ? new Date(lead.next_follow_up).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {store.projects.some((p) => p.latitude && p.longitude) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <PropertiesMapDynamic
                properties={store.properties}
                projects={store.projects}
                height="300px"
                zoom={10}
              />
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          {store.projects.map((project) => {
            const projectProps = store.properties.filter((p) => p.project_id === project.id);
            const avail = projectProps.filter((p) => p.status === "available").length;
            const reserved = projectProps.filter((p) => p.status === "reserved").length;
            const sold = projectProps.filter((p) => p.status === "sold").length;
            const total = projectProps.length;
            return (
              <Card key={project.id} className="hover:ring-primary/20 transition-colors">
                <CardHeader>
                  <CardTitle className="text-base">{project.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    {project.location} · {project.city}
                  </p>
                  <div className="flex gap-3 text-xs">
                    <span className="text-emerald-400 font-medium">{avail} Available</span>
                    <span className="text-amber-400 font-medium">{reserved} Reserved</span>
                    <span className="text-red-400 font-medium">{sold} Sold</span>
                  </div>
                  <div className="w-full bg-foreground/[0.06] rounded-full h-1.5 overflow-hidden flex">
                    {total > 0 && (
                      <>
                        <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: `${(avail / total) * 100}%` }} />
                        <div className="h-full bg-amber-500" style={{ width: `${(reserved / total) * 100}%` }} />
                        <div className="h-full bg-red-500 rounded-r-full" style={{ width: `${(sold / total) * 100}%` }} />
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
