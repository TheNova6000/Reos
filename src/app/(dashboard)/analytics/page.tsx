"use client";

import { useMemo } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  IndianRupee,
  Users,
  Building2,
  ArrowDown,
} from "lucide-react";
import { useDemoStore, getStoreStats } from "@/lib/demo-store";
import {
  formatCurrency,
  LEAD_STATUS_LABELS,
  LEAD_SOURCE_LABELS,
  PROPERTY_STATUS_LABELS,
  PROPERTY_FACING_LABELS,
} from "@/lib/constants";

const STAGE_COLORS: Record<string, string> = {
  new: "bg-blue-500",
  contacted: "bg-cyan-500",
  site_visit: "bg-violet-500",
  negotiation: "bg-amber-500",
  booked: "bg-emerald-500",
  lost: "bg-gray-400",
};

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

  const leadsBySource = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const l of store.leads) {
      counts[l.source] = (counts[l.source] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1]);
  }, [store.leads]);

  const topSource = leadsBySource.length > 0 ? leadsBySource[0] : null;

  const avgDealSize = useMemo(() => {
    const soldProps = store.properties.filter((p) => p.status === "sold");
    if (soldProps.length === 0) return 0;
    return Math.round(soldProps.reduce((s, p) => s + p.price, 0) / soldProps.length);
  }, [store.properties]);

  const followUpRate = useMemo(() => {
    const withFollowUp = store.leads.filter((l) => l.next_follow_up).length;
    return store.leads.length > 0
      ? Math.round((withFollowUp / store.leads.length) * 100)
      : 0;
  }, [store.leads]);

  const inventoryByProject = useMemo(() => {
    return store.projects.map((project) => {
      const props = store.properties.filter((p) => p.project_id === project.id);
      const available = props.filter((p) => p.status === "available").length;
      const sold = props.filter((p) => p.status === "sold").length;
      const reserved = props.filter((p) => p.status === "reserved").length;
      const blocked = props.filter((p) => p.status === "blocked").length;
      const revenue = props
        .filter((p) => p.status === "sold")
        .reduce((s, p) => s + p.price, 0);
      return { project, total: props.length, available, sold, reserved, blocked, revenue };
    });
  }, [store.projects, store.properties]);

  const facingDemand = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const l of store.leads) {
      if (l.preferred_facing) {
        counts[l.preferred_facing] = (counts[l.preferred_facing] || 0) + 1;
      }
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [store.leads]);

  const budgetRanges = useMemo(() => {
    const ranges = [
      { label: "Under ₹25L", min: 0, max: 2500000, count: 0 },
      { label: "₹25L–50L", min: 2500000, max: 5000000, count: 0 },
      { label: "₹50L–1Cr", min: 5000000, max: 10000000, count: 0 },
      { label: "Above ₹1Cr", min: 10000000, max: Infinity, count: 0 },
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

  const pipeline = ["new", "contacted", "site_visit", "negotiation", "booked", "lost"];

  return (
    <>
      <DashboardHeader
        title="Analytics"
        description={`${store.leads.length} leads · ${store.properties.length} properties · ${store.projects.length} projects`}
      />
      <div className="p-4 space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lead Conversion</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.bookedLeads} booked from {stats.totalLeads} leads
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Deal Size</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {avgDealSize > 0 ? formatCurrency(avgDealSize) : "—"}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.sold} sold properties
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Source</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {topSource ? LEAD_SOURCE_LABELS[topSource[0]] || topSource[0] : "—"}
              </div>
              <p className="text-xs text-muted-foreground">
                {topSource ? `${topSource[1]} leads` : "No leads yet"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Follow-up Rate</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{followUpRate}%</div>
              <p className="text-xs text-muted-foreground">
                Leads with scheduled follow-ups
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sales Pipeline Funnel + Lead Sources */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sales Pipeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {store.leads.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No leads yet. Add leads to see the pipeline funnel.
                </p>
              ) : (
                <>
                  {pipeline.map((stage) => {
                    const count = leadsByStatus[stage] || 0;
                    const pct = store.leads.length > 0
                      ? Math.round((count / store.leads.length) * 100)
                      : 0;
                    return (
                      <div key={stage} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">
                            {LEAD_STATUS_LABELS[stage] || stage}
                          </span>
                          <span className="text-muted-foreground">
                            {count} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${STAGE_COLORS[stage] || "bg-gray-400"}`}
                            style={{ width: `${Math.max(pct, 2)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="pt-2 border-t text-xs text-muted-foreground flex justify-between">
                    <span>Total: {store.leads.length} leads</span>
                    <span>Active: {store.leads.filter((l) => l.status !== "lost" && l.status !== "booked").length}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Lead Sources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leadsBySource.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No leads yet. Track which channels perform best.
                </p>
              ) : (
                <>
                  {leadsBySource.map(([source, count]) => {
                    const pct = Math.round((count / store.leads.length) * 100);
                    return (
                      <div key={source} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-primary/60" />
                          <span className="text-sm font-medium">
                            {LEAD_SOURCE_LABELS[source] || source}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {count} <span className="text-xs">({pct}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Inventory by Project + Revenue */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Inventory by Project
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {inventoryByProject.length === 0 ? (
                <p className="text-sm text-muted-foreground">No projects yet.</p>
              ) : (
                inventoryByProject.map(({ project, total, available, sold, reserved }) => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{project.name}</span>
                      <span className="text-xs text-muted-foreground">{total} plots</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden flex">
                      {total > 0 && (
                        <>
                          <div
                            className="h-full bg-emerald-500"
                            style={{ width: `${(available / total) * 100}%` }}
                          />
                          <div
                            className="h-full bg-amber-500"
                            style={{ width: `${(reserved / total) * 100}%` }}
                          />
                          <div
                            className="h-full bg-red-500"
                            style={{ width: `${(sold / total) * 100}%` }}
                          />
                        </>
                      )}
                    </div>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span className="text-emerald-500">{available} avail</span>
                      <span className="text-amber-500">{reserved} reserved</span>
                      <span className="text-red-500">{sold} sold</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <IndianRupee className="w-4 h-4" />
                Revenue by Project
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {inventoryByProject.length === 0 ? (
                <p className="text-sm text-muted-foreground">No projects yet.</p>
              ) : (
                <>
                  {inventoryByProject.map(({ project, revenue, sold }) => (
                    <div key={project.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="text-sm font-medium">{project.name}</p>
                        <p className="text-xs text-muted-foreground">{sold} sold</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t flex justify-between font-medium text-sm">
                    <span>Total Revenue</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(stats.totalRevenue)}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Demand Insights */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Facing Demand</CardTitle>
            </CardHeader>
            <CardContent>
              {facingDemand.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No facing preferences recorded yet. Data populates from lead preferences.
                </p>
              ) : (
                <div className="space-y-2">
                  {facingDemand.map(([facing, count]) => (
                    <div key={facing} className="flex items-center justify-between py-1">
                      <span className="text-sm">
                        {PROPERTY_FACING_LABELS[facing] || facing}
                      </span>
                      <Badge variant="secondary">{count} leads</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Budget Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {budgetRanges.every((r) => r.count === 0) ? (
                <p className="text-sm text-muted-foreground">
                  No budget data recorded yet. Data populates from lead budgets.
                </p>
              ) : (
                <div className="space-y-2">
                  {budgetRanges.map((r) => (
                    <div key={r.label} className="flex items-center justify-between py-1">
                      <span className="text-sm">{r.label}</span>
                      <Badge variant="secondary">{r.count} leads</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
