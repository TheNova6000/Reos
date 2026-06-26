"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AnimatedCounter } from "@/components/dashboard/animated-counter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  BookOpen,
  IndianRupee,
  TrendingUp,
  ArrowRight,
  Clock,
} from "lucide-react";
import { useDemoStore } from "@/lib/demo-store";
import { formatCurrency, BOOKING_STATUS_STYLES } from "@/lib/constants";
import type { BookingStatus } from "@/types/database";

const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  registered: "Registered",
};

function formatLakh(v: number): string {
  if (v >= 10000000) return `${(v / 10000000).toFixed(1)}Cr`;
  if (v >= 100000) return `${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return String(Math.round(v));
}

export default function BookingsPage() {
  const store = useDemoStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const enrichedBookings = useMemo(() => {
    return store.bookings.map((booking) => {
      const lead = store.leads.find((l) => l.id === booking.lead_id);
      const property = store.properties.find((p) => p.id === booking.property_id);
      const project = property
        ? store.projects.find((p) => p.id === property.project_id)
        : null;
      const payments = store.payments.filter((p) => p.booking_id === booking.id);
      const totalPaid = payments.reduce((s, p) => s + p.amount, 0);
      return { booking, lead, property, project, totalPaid };
    });
  }, [store.bookings, store.leads, store.properties, store.projects, store.payments]);

  const filtered = useMemo(() => {
    return enrichedBookings.filter((b) => {
      const matchSearch =
        !search ||
        (b.lead?.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (b.property?.plot_number || "").toLowerCase().includes(search.toLowerCase()) ||
        (b.project?.name || "").toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "all" || b.booking.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [enrichedBookings, search, statusFilter]);

  const totalValue = enrichedBookings.reduce((s, b) => s + b.booking.total_price, 0);
  const totalCollected = enrichedBookings.reduce((s, b) => s + b.totalPaid, 0);
  const pending = totalValue - totalCollected;
  const activeBookings = enrichedBookings.filter(
    (b) => b.booking.status !== "cancelled"
  ).length;
  const confirmedCount = enrichedBookings.filter(
    (b) => b.booking.status === "confirmed"
  ).length;
  const collectedPct = totalValue > 0 ? Math.round((totalCollected / totalValue) * 100) : 0;

  const kpiCards = [
    {
      label: "Active Bookings",
      value: activeBookings,
      sub: `${confirmedCount} confirmed`,
      prefix: "",
      formatter: undefined as undefined | ((v: number) => string),
      icon: BookOpen,
      accent: "text-primary",
      border: "border-primary/20",
      bg: "bg-primary/5",
    },
    {
      label: "Total Value",
      value: totalValue,
      sub: `across ${activeBookings} deals`,
      prefix: "₹",
      formatter: formatLakh,
      icon: IndianRupee,
      accent: "text-amber-600 dark:text-amber-400",
      border: "border-amber-500/20",
      bg: "bg-amber-500/5",
    },
    {
      label: "Collected",
      value: totalCollected,
      sub: `${collectedPct}% of total`,
      prefix: "₹",
      formatter: formatLakh,
      icon: TrendingUp,
      accent: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/20",
      bg: "bg-emerald-500/5",
    },
    {
      label: "Pending",
      value: pending,
      sub: `${100 - collectedPct}% outstanding`,
      prefix: "₹",
      formatter: formatLakh,
      icon: Clock,
      accent: "text-rose-600 dark:text-rose-400",
      border: "border-rose-500/20",
      bg: "bg-rose-500/5",
    },
  ];

  return (
    <>
      <DashboardHeader
        title="Bookings"
        description={`${store.bookings.length} total · ${activeBookings} active`}
      />
      <div className="p-4 space-y-4">
        {/* KPI Cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((card, i) => (
            <div
              key={card.label}
              className={`border ${card.border} ${card.bg} px-4 py-3.5 animate-fade-up`}
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {card.label}
                </p>
                <card.icon className={`w-4 h-4 ${card.accent}`} />
              </div>
              <p className={`text-2xl font-bold tabular-nums ${card.accent}`}>
                {card.prefix}
                <AnimatedCounter
                  value={card.value}
                  formatter={card.formatter}
                  startDelay={i * 70}
                />
              </p>
              <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-card border border-border/50 px-3 py-2.5">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              aria-label="Search bookings"
              placeholder="Search by customer, property, or project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-0 bg-transparent focus-visible:ring-0 h-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
            <SelectTrigger className="w-full sm:w-[150px] h-8 text-xs" aria-label="Filter by status">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {(Object.entries(BOOKING_STATUS_LABELS) as [BookingStatus, string][]).map(
                ([val, label]) => (
                  <SelectItem key={val} value={val}>{label}</SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Date</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Customer</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Property</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Total</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Paid</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Balance</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Progress</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                      <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-20" />
                      <p className="text-sm font-medium">
                        {store.bookings.length === 0
                          ? "No bookings yet"
                          : "No bookings match your filters"}
                      </p>
                      {store.bookings.length === 0 && (
                        <p className="text-xs mt-1">Convert leads to bookings from the lead detail page</p>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map(({ booking, lead, property, project, totalPaid }, idx) => {
                    const balance = booking.total_price - totalPaid;
                    const pct = booking.total_price > 0
                      ? Math.round((totalPaid / booking.total_price) * 100)
                      : 0;
                    return (
                      <TableRow
                        key={booking.id}
                        className={idx % 2 === 1 ? "bg-muted/20" : ""}
                      >
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(booking.booking_date).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "2-digit",
                          })}
                        </TableCell>
                        <TableCell>
                          {lead ? (
                            <Link
                              href={`/leads/${lead.id}`}
                              className="text-sm font-semibold hover:text-primary transition-colors"
                            >
                              {lead.name}
                            </Link>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{property?.plot_number || "—"}</div>
                          <div className="text-xs text-muted-foreground">{project?.name || ""}</div>
                        </TableCell>
                        <TableCell className="text-sm font-semibold tabular-nums">
                          {formatCurrency(booking.total_price)}
                        </TableCell>
                        <TableCell className="text-sm font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(totalPaid)}
                        </TableCell>
                        <TableCell className="text-sm font-semibold tabular-nums text-amber-600 dark:text-amber-400">
                          {formatCurrency(balance)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-muted h-1.5 overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 transition-all duration-700"
                                style={{ width: `${Math.min(pct, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs tabular-nums text-muted-foreground">{pct}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs ${BOOKING_STATUS_STYLES[booking.status]?.outline || ""}`}
                          >
                            {BOOKING_STATUS_LABELS[booking.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            nativeButton={false}
                            render={<Link href={`/bookings/${booking.id}`} />}
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
