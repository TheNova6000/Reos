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
  ArrowRight,
  Rocket,
  UserPlus,
  Palette,
  Globe,
} from "lucide-react";
import { LEAD_STATUS_LABELS, LEAD_STATUS_STYLES, LEAD_SOURCE_LABELS } from "@/lib/constants";
import { useDemoStore, getStoreStats } from "@/lib/demo-store";
import { AnimatedCounter } from "@/components/dashboard/animated-counter";
import { LeadsTrendChart } from "@/components/dashboard/leads-trend-chart";

function formatLakh(n: number): string {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  if (n >= 1_000) return `₹${(n / 1_000).toFixed(0)}K`;
  return `₹${n}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 2) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function DashboardPage() {
  const store = useDemoStore();
  const stats = useMemo(() => getStoreStats(), [store.properties, store.leads]);

  const recentLeads = useMemo(
    () =>
      [...store.leads]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 6),
    [store.leads]
  );

  const trendData = useMemo(() => {
    const days: Array<{ day: string; leads: number }> = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      const count = store.leads.filter((l) => l.created_at.startsWith(dateKey)).length;
      days.push({ day: label, leads: count });
    }
    return days;
  }, [store.leads]);

  const pipelineStages = useMemo(() => {
    const total = store.leads.length;
    const stages = [
      { key: "new", label: "New Leads", color: "text-blue-400", bg: "bg-blue-500" },
      { key: "contacted", label: "Contacted", color: "text-cyan-400", bg: "bg-cyan-500" },
      { key: "site_visit", label: "Site Visit", color: "text-violet-400", bg: "bg-violet-500" },
      { key: "negotiation", label: "Negotiation", color: "text-amber-400", bg: "bg-amber-500" },
    ];
    return stages.map((s) => {
      const count = store.leads.filter((l) => l.status === s.key).length;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      return { ...s, count, pct };
    });
  }, [store.leads]);

  return (
    <>
      <DashboardHeader
        title="Dashboard"
        description={`${store.projects.length} projects · ${store.properties.length} properties · ${store.leads.length} leads`}
      />

      <div className="p-4 space-y-5">

        {/* Setup strip */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 border border-primary/20 bg-primary/5 text-xs">
          <span className="flex items-center gap-1.5 font-bold text-primary shrink-0">
            <Rocket className="w-3.5 h-3.5" /> Setup
          </span>
          <span className="text-muted-foreground">Complete to go live:</span>
          <Link href="/settings" className="font-bold hover:underline text-foreground/70 hover:text-primary transition-colors flex items-center gap-1">
            <UserPlus className="w-3 h-3" /> Add Team
          </Link>
          <span className="text-muted-foreground/30">·</span>
          <Link href="/onboarding" className="font-bold hover:underline text-foreground/70 hover:text-primary transition-colors flex items-center gap-1">
            <Palette className="w-3 h-3" /> Design Website
          </Link>
          <span className="text-muted-foreground/30">·</span>
          <span className="text-muted-foreground/50 flex items-center gap-1">
            <Globe className="w-3 h-3" /> Goes Live in 3-4 days
          </span>
        </div>

        {/* Metric cards */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {/* Properties */}
          <div className="relative overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/8 to-transparent p-5 animate-fade-up hover:-translate-y-0.5 transition-transform duration-200" style={{ animationDelay: "0ms" }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 border border-primary/30 bg-primary/10 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-primary" />
              </div>
              <span className="w-2 h-2 rounded-full bg-primary/80 animate-pulse" />
            </div>
            <div className="text-4xl font-black tracking-tight text-primary mb-1">
              <AnimatedCounter value={stats.totalProperties} startDelay={0} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/40 mb-0.5">Total Properties</p>
            <p className="text-xs text-muted-foreground">{stats.available} available · {stats.sold} sold</p>
          </div>

          {/* Leads */}
          <div className="relative overflow-hidden border-2 border-rose-500/25 bg-gradient-to-br from-rose-500/8 to-transparent p-5 animate-fade-up hover:-translate-y-0.5 transition-transform duration-200" style={{ animationDelay: "80ms" }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 border border-rose-500/30 bg-rose-500/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-rose-400" />
              </div>
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            </div>
            <div className="text-4xl font-black tracking-tight text-rose-400 mb-1">
              <AnimatedCounter value={stats.totalLeads} startDelay={80} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/40 mb-0.5">Total Leads</p>
            <p className="text-xs text-muted-foreground">
              {store.leads.filter(l => l.status === "new").length} new · {store.leads.filter(l => l.status === "site_visit").length} site visit
            </p>
          </div>

          {/* Revenue */}
          <div className="relative overflow-hidden border-2 border-amber-500/25 bg-gradient-to-br from-amber-500/8 to-transparent p-5 animate-fade-up hover:-translate-y-0.5 transition-transform duration-200" style={{ animationDelay: "160ms" }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 border border-amber-500/30 bg-amber-500/10 flex items-center justify-center">
                <IndianRupee className="w-4 h-4 text-amber-400" />
              </div>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <div className="text-4xl font-black tracking-tight text-amber-400 mb-1">
              <AnimatedCounter
                value={stats.totalRevenue}
                startDelay={160}
                formatter={formatLakh}
              />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/40 mb-0.5">Revenue</p>
            <p className="text-xs text-muted-foreground">From {stats.sold} sold properties</p>
          </div>

          {/* Conversion */}
          <div className="relative overflow-hidden border-2 border-emerald-500/25 bg-gradient-to-br from-emerald-500/8 to-transparent p-5 animate-fade-up hover:-translate-y-0.5 transition-transform duration-200" style={{ animationDelay: "240ms" }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-4xl font-black tracking-tight text-emerald-400 mb-1">
              <AnimatedCounter value={stats.conversionRate} startDelay={240} decimals={1} suffix="%" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/40 mb-0.5">Conversion Rate</p>
            <p className="text-xs text-muted-foreground">{stats.bookedLeads} booked of {stats.totalLeads} leads</p>
          </div>
        </div>

        {/* Main area: chart + activity feed */}
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-4">

            {/* Trend chart */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Lead Intake — Last 14 Days</CardTitle>
                  <span className="text-xs text-muted-foreground tabular-nums">{store.leads.length} total</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {store.leads.length === 0 ? (
                  <div className="h-[150px] flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">No leads yet — chart will populate automatically.</p>
                  </div>
                ) : (
                  <LeadsTrendChart data={trendData} />
                )}
              </CardContent>
            </Card>

            {/* Pipeline flow */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/50 mb-2 px-1">Pipeline Flow</p>
              <div className="grid grid-cols-4 gap-1.5">
                {pipelineStages.map((stage, i) => (
                  <div key={stage.key} className="border border-border/50 bg-card p-4 relative">
                    <p className="text-[9px] font-black uppercase tracking-[0.12em] text-muted-foreground/50 mb-2 leading-tight">
                      {stage.label}
                    </p>
                    <div className={`text-3xl font-black mb-3 ${stage.color}`}>
                      <AnimatedCounter value={stage.count} startDelay={400 + i * 80} />
                    </div>
                    <div className="h-0.5 bg-foreground/[0.06] overflow-hidden">
                      <div
                        className={`h-full ${stage.bg} transition-all duration-1000 ease-out`}
                        style={{ width: `${stage.pct}%`, transitionDelay: `${600 + i * 80}ms` }}
                      />
                    </div>
                    <p className="text-[9px] text-muted-foreground/40 mt-1 tabular-nums">{stage.pct}%</p>
                    {i < pipelineStages.length - 1 && (
                      <span className="absolute -right-2 top-1/2 -translate-y-1/2 text-muted-foreground/20 text-xs z-10 pointer-events-none select-none">›</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live activity feed */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                    Live Activity
                  </CardTitle>
                  <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/leads" />}>
                    All <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-0 px-3">
                {recentLeads.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    No leads yet. Applications from your website appear here instantly.
                  </p>
                ) : (
                  recentLeads.map((lead) => {
                    const statusStyle = LEAD_STATUS_STYLES[lead.status];
                    return (
                      <Link
                        key={lead.id}
                        href={`/leads/${lead.id}`}
                        className="flex items-start gap-3 py-3 border-b border-border/30 last:border-0 hover:bg-foreground/[0.025] -mx-1 px-1 rounded transition-colors group"
                      >
                        <div className={`w-0.5 self-stretch shrink-0 mt-0.5 ${statusStyle?.dot?.split(" ")[0] ?? "bg-primary"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate leading-tight">{lead.name}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {LEAD_SOURCE_LABELS[lead.source]} · {timeAgo(lead.created_at)}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-[10px] shrink-0 self-start mt-0.5 ${statusStyle?.outline ?? ""}`}
                        >
                          {LEAD_STATUS_LABELS[lead.status]}
                        </Badge>
                      </Link>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Project cards */}
        {store.projects.length > 0 && (
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/50 mb-2 px-1">Projects</p>
            <div className="grid gap-3 md:grid-cols-3">
              {store.projects.map((project, i) => {
                const projectProps = store.properties.filter((p) => p.project_id === project.id);
                const avail = projectProps.filter((p) => p.status === "available").length;
                const reserved = projectProps.filter((p) => p.status === "reserved").length;
                const sold = projectProps.filter((p) => p.status === "sold").length;
                const total = projectProps.length;
                return (
                  <div key={project.id} className="border border-border/50 bg-card p-5 hover:-translate-y-0.5 transition-transform duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-black text-sm uppercase tracking-wide leading-tight">{project.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{project.location} · {project.city}</p>
                      </div>
                      <Link href="/inventory" className="text-muted-foreground/30 hover:text-primary transition-colors">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div>
                        <p className="text-2xl font-black text-emerald-400">
                          <AnimatedCounter value={avail} startDelay={600 + i * 100} />
                        </p>
                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground/40 leading-tight">Avail</p>
                      </div>
                      <div>
                        <p className="text-2xl font-black text-amber-400">
                          <AnimatedCounter value={reserved} startDelay={650 + i * 100} />
                        </p>
                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground/40 leading-tight">Rsvd</p>
                      </div>
                      <div>
                        <p className="text-2xl font-black text-red-400">
                          <AnimatedCounter value={sold} startDelay={700 + i * 100} />
                        </p>
                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground/40 leading-tight">Sold</p>
                      </div>
                    </div>
                    <div className="h-1.5 bg-foreground/[0.06] overflow-hidden flex">
                      {total > 0 && (
                        <>
                          <div className="h-full bg-emerald-500 transition-all duration-1000 ease-out" style={{ width: `${(avail / total) * 100}%`, transitionDelay: `${900 + i * 100}ms` }} />
                          <div className="h-full bg-amber-500 transition-all duration-1000 ease-out" style={{ width: `${(reserved / total) * 100}%`, transitionDelay: `${900 + i * 100}ms` }} />
                          <div className="h-full bg-red-500 transition-all duration-1000 ease-out" style={{ width: `${(sold / total) * 100}%`, transitionDelay: `${900 + i * 100}ms` }} />
                        </>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground/40 mt-1.5 tabular-nums">
                      {total} plots · {total > 0 ? Math.round((avail / total) * 100) : 0}% available
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
