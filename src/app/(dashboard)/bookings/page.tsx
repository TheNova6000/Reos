"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const activeBookings = enrichedBookings.filter(
    (b) => b.booking.status !== "cancelled"
  ).length;

  return (
    <>
      <DashboardHeader
        title="Bookings"
        description={`${store.bookings.length} total bookings`}
      />
      <div className="p-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeBookings}</div>
              <p className="text-xs text-muted-foreground">
                {enrichedBookings.filter((b) => b.booking.status === "confirmed").length} confirmed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collected</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {formatCurrency(totalCollected)}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalValue > 0 ? Math.round((totalCollected / totalValue) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <IndianRupee className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {formatCurrency(totalValue - totalCollected)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              aria-label="Search bookings"
              placeholder="Search by customer, property, or project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
            <SelectTrigger className="w-full sm:w-[150px]" aria-label="Filter by status">
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

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      {store.bookings.length === 0
                        ? "No bookings yet. Convert leads to bookings from the lead detail page."
                        : "No bookings match your filters."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map(({ booking, lead, property, project, totalPaid }) => {
                    const balance = booking.total_price - totalPaid;
                    const pct = booking.total_price > 0
                      ? Math.round((totalPaid / booking.total_price) * 100)
                      : 0;
                    return (
                      <TableRow key={booking.id}>
                        <TableCell className="text-sm">
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
                              className="text-sm font-medium hover:text-primary"
                            >
                              {lead.name}
                            </Link>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">
                            {property?.plot_number || "—"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {project?.name || ""}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {formatCurrency(booking.total_price)}
                        </TableCell>
                        <TableCell className="text-sm text-emerald-600 font-medium">
                          {formatCurrency(totalPaid)}
                        </TableCell>
                        <TableCell className="text-sm text-amber-600 font-medium">
                          {formatCurrency(balance)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-muted rounded-full h-1.5 overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${Math.min(pct, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">{pct}%</span>
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
