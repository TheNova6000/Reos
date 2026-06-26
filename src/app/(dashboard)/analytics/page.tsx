"use client";

import { useMemo } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  IndianRupee,
  Users,
  Building2,
  Zap,
} from "lucide-react";
import { useDemoStore, getStoreStats } from "@/lib/demo-store";
import {
  formatCurrency,
  LEAD_STATUS_LABELS,
  LEAD_SOURCE_LABELS,
  PROPERTY_FACING_LABELS,
} from "@/lib/constants";
import { AnimatedCounter } from "@/components/dashboard/animated-counter";
import { PipelineBarChart } from "@/components/dashboard/pipeline-bar-chart";
import { SourcesDonutChart } from "@/components/dashboard/sources-donut-chart";

const STAGE_ORDER = ["new", "contacted", "site_visit", "negotiation", "booked", "lost"];
const STAGE_SHORT: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  site_visit: "Site Visit",
  negotiation: "Negotiation",
  booked: "Booked",
  lost: "Lost",
};

function formatLakh(n: number): string {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  if (n >= 1_000) return `₹${(n / 1_000).toFixed(0)}K`;
  return `₹${n}`;
}

export default function AnalyticsPage() {
  const store = useDemoStore();
  const stats = useMemo(() => getStoreStats(), [store]);

  const leadsByStatus = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const l of store.leads) {
      counts[l.status] = (counts[l.status] || 0) + 1;
    }
    return counts;
  }, [store.leads]);

  const pipelineChartData = useMemo(() =>
    STAGE_ORDER.map((stage) => ({
      stage,
      label: STAGE_SHORT[stage] ?? stage,
      count: leadsByStatus[stage] ?? 0,
    })),
    [leadsByStatus]
  );

  const sourceChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const l of store.leads) {
      counts[l.source] = (counts[l.source] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([source, value]) => ({
        name: LEAD_SOURCE_LABELS[source] ?? source,
        value,
      }));
  }, [store.leads]);

  const topSource = sourceChartData[0] ?? null;

  const avgDealSize = useMemo(() => {
    const sold = store.properties.filter((p) => p.status === "sold");
    if (!sold.length) return 0;
    return Math.round(sold.reduce((s, p) => s + p.price, 0) / sold.length);
  }, [store.properties]);

  const followUpRate = useMemo(() => {
    const with_ = store.leads.filter((l) => l.next_follow_up).length;
    return store.leads.length > 0 ? Math.round((with_ / store.leads.length) * 100) : 0;
  }, [store.leads]);

  const inventoryByProject = useMemo(() =>
    store.projects.map((project) => {
      const props = store.properties.filter((p) => p.project_id === project.id);
      const available = props.filter((p) => p.status === "available").length;
      const sold = props.filter((p) => p.status === "sold").length;
      const reserved = props.filter((p) => p.status === "reserved").length;
      const revenue = props.filter((p) => p.status === "sold").reduce((s, p) => s + p.price, 0);
      return { project, total: props.length, available, sold, reserved, revenue };
    }),
    [store.projects, store.properties]
  );

  const facingDemand = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const l of store.leads) {
      if (l.preferred_facing) counts[l.preferred_facing] = (counts[l.preferred_facing] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [store.leads]);

  const budgetRanges = useMemo(() => {
    const ranges = [
      { label: "Under ₹25L", min: 0, max: 2_500_000, count: 0 },
      { label: "₹25L–50L", min: 2_500_000, max: 5_000_000, count: 0 },
      { label: "₹50L–1Cr", min: 5_000_000, max: 10_000_000, count: 0 },
      { label: "Above ₹1Cr", min: 10_000_000, max: Infinity, count: 0 },
    ];
    for (const l of store.leads) {
      const budget = l.budget_max || l.budget_min || 0;
      if (budget > 0) {
        const r = ranges.find((r) => budget >= r.min && budget < r.max);
        if (r) r.count++;
      }
    }
    return ranges;
  }, [store.leads]);

  const maxBudgetCount = Math.max(...budgetRanges.map((r) => r.count), 1);
  const maxRevenueAmount = Math.max(...inventoryByProject.map((p) => p.revenue), 1);

  return (
    <>
      <DashboardHeader
        title="Analytics"
        description={`${store.leads.length} leads · ${store.properties.length} properties · ${store.projects.length} projects`}
      />
      <div className="p-4 space-y-5">

        {/* KPI strip */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <div className="border-2 border-primary/30 bg-gradient-to-br from-primary/8 to-transparent p-4 animate-fade-up" style={{ animationDelay: "0ms" }}>
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-pulse" />
            </div>
            <div className="text-3xl font-black text-primary">
              <AnimatedCounter value={stats.conversionRate} decimals={1} suffix="%" startDelay={0} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/40 mt-1">Conversion Rate</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stats.bookedLeads} booked of {stats.totalLeads}</p>
          </div>

          <div className="border-2 border-amber-500/25 bg-gradient-to-br from-amber-500/8 to-transparent p-4 animate-fade-up" style={{ animationDelay: "80ms" }}>
            <div className="flex items-center justify-between mb-3">
              <IndianRupee className="w-4 h-4 text-amber-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <div className="text-3xl font-black text-amber-400">
              <AnimatedCounter value={avgDealSize} formatter={formatLakh} startDelay={80} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/40 mt-1">Avg Deal Size</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stats.sold} sold properties</p>
          </div>

          <div className="border-2 border-rose-500/25 bg-gradient-to-br from-rose-500/8 to-transparent p-4 animate-fade-up" style={{ animationDelay: "160ms" }}>
            <div className="flex items-center justify-between mb-3">
              <Users className="w-4 h-4 text-rose-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            </div>
            <div className="text-3xl font-black text-rose-400 truncate">
              {topSource ? topSource.name : "—"}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/40 mt-1">Top Source</p>
            <p className="text-xs text-muted-foreground mt-0.5">{topSource ? `${topSource.value} leads` : "No data yet"}</p>
          </div>

          <div className="border-2 border-emerald-500/25 bg-gradient-to-br from-emerald-500/8 to-transparent p-4 animate-fade-up" style={{ animationDelay: "240ms" }}>
            <div className="flex items-center justify-between mb-3">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-3xl font-black text-emerald-400">
              <AnimatedCounter value={followUpRate} suffix="%" startDelay={240} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/40 mt-1">Follow-up Rate</p>
            <p className="text-xs text-muted-foreground mt-0.5">Leads with scheduled follow-ups</p>
          </div>
        </div>

        {/* Pipeline chart + Sources donut */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                Sales Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {store.leads.length === 0 ? (
                <div className="h-[200px] flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">No leads yet — add leads to see the funnel.</p>
                </div>
              ) : (
                <>
                  <PipelineBarChart data={pipelineChartData} />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2 pt-2 border-t border-border/30">
                    <span>Total: {store.leads.length} leads</span>
                    <span>Active: {store.leads.filter(l => l.status !== "lost" && l.status !== "booked").length}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                Lead Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sourceChartData.length === 0 ? (
                <div className="h-[200px] flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">No leads yet — sources appear here automatically.</p>
                </div>
              ) : (
                <SourcesDonutChart data={sourceChartData} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Inventory by project */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              Inventory by Project
            </CardTitle>
          </CardHeader>
          <CardContent>
            {inventoryByProject.length === 0 ? (
              <p className="text-sm text-muted-foreground">No projects yet.</p>
            ) : (
              <div className="space-y-5">
                {inventoryByProject.map(({ project, total, available, sold, reserved }, i) => (
                  <div key={project.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold uppercase tracking-wide">{project.name}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">{total} plots</span>
                    </div>
                    <div className="flex gap-4 text-xs mb-2">
                      <span className="text-emerald-400 font-bold tabular-nums">{available} available</span>
                      <span className="text-amber-400 font-bold tabular-nums">{reserved} reserved</span>
                      <span className="text-red-400 font-bold tabular-nums">{sold} sold</span>
                    </div>
                    <div className="h-2 bg-foreground/[0.06] overflow-hidden flex">
                      {total > 0 && (
                        <>
                          <div
                            className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                            style={{ width: `${(available / total) * 100}%`, transitionDelay: `${400 + i * 120}ms` }}
                          />
                          <div
                            className="h-full bg-amber-500 transition-all duration-1000 ease-out"
                            style={{ width: `${(reserved / total) * 100}%`, transitionDelay: `${400 + i * 120}ms` }}
                          />
                          <div
                            className="h-full bg-red-500 transition-all duration-1000 ease-out"
                            style={{ width: `${(sold / total) * 100}%`, transitionDelay: `${400 + i * 120}ms` }}
                          />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue by project + Demand insights */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-muted-foreground" />
                Revenue by Project
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {inventoryByProject.length === 0 ? (
                <p className="text-sm text-muted-foreground">No projects yet.</p>
              ) : (
                <>
                  {inventoryByProject.map(({ project, revenue, sold }) => (
                    <div key={project.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div>
                          <p className="text-sm font-bold">{project.name}</p>
                          <p className="text-[11px] text-muted-foreground">{sold} sold</p>
                        </div>
                        <p className="text-sm font-black text-emerald-400 tabular-nums">
                          {formatCurrency(revenue)}
                        </p>
                      </div>
                      <div className="h-1 bg-foreground/[0.06] overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                          style={{
                            width: `${(revenue / maxRevenueAmount) * 100}%`,
                            transitionDelay: "600ms",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-border/30 flex justify-between font-bold text-sm">
                    <span>Total Revenue</span>
                    <span className="text-emerald-400">{formatCurrency(stats.totalRevenue)}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            {/* Budget distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Budget Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {budgetRanges.every((r) => r.count === 0) ? (
                  <p className="text-sm text-muted-foreground">No budget data yet.</p>
                ) : (
                  budgetRanges.map((r, i) => (
                    <div key={r.label}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{r.label}</span>
                        <span className="font-bold tabular-nums">{r.count}</span>
                      </div>
                      <div className="h-1 bg-foreground/[0.06] overflow-hidden">
                        <div
                          className="h-full bg-amber-500 transition-all duration-1000 ease-out"
                          style={{
                            width: `${(r.count / maxBudgetCount) * 100}%`,
                            transitionDelay: `${800 + i * 80}ms`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Facing demand */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Facing Demand</CardTitle>
              </CardHeader>
              <CardContent>
                {facingDemand.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No facing preferences yet.</p>
                ) : (
                  <div className="space-y-2">
                    {facingDemand.map(([facing, count]) => {
                      const maxCount = facingDemand[0][1];
                      return (
                        <div key={facing}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">
                              {PROPERTY_FACING_LABELS[facing] ?? facing}
                            </span>
                            <span className="font-bold tabular-nums">{count} leads</span>
                          </div>
                          <div className="h-1 bg-foreground/[0.06] overflow-hidden">
                            <div
                              className="h-full bg-primary/70 transition-all duration-1000 ease-out"
                              style={{ width: `${(count / maxCount) * 100}%`, transitionDelay: "900ms" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
