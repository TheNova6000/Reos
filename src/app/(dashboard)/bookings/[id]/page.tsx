"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDemoStore,
  addPayment,
  updateBookingStatus,
  deleteBooking,
  createPaymentScheduleForBooking,
  getPaymentSchedulesForBooking,
  updatePaymentScheduleStatus,
} from "@/lib/demo-store";
import { RegistrationCalculatorDialog } from "@/components/dashboard/registration-calculator";
import { formatCurrency, BOOKING_STATUS_STYLES, PAYMENT_SCHEDULE_STATUS_STYLES } from "@/lib/constants";
import {
  ArrowLeft,
  IndianRupee,
  Plus,
  User,
  Building2,
  Calendar,
  BookOpen,
  Receipt,
  MapPin,
  Trash2,
} from "lucide-react";
import type { BookingStatus, PaymentMode } from "@/types/database";

const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  registered: "Registered",
};


const PAYMENT_MODE_LABELS: Record<PaymentMode, string> = {
  cash: "Cash",
  cheque: "Cheque",
  bank_transfer: "Bank Transfer",
  upi: "UPI",
  demand_draft: "Demand Draft",
};

function AddPaymentDialog({ bookingId }: { bookingId: string }) {
  const store = useDemoStore();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<PaymentMode>("bank_transfer");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    addPayment({
      booking_id: bookingId,
      amount: parseFloat(amount),
      payment_mode: mode,
      receipt_number: receiptNumber || undefined,
      notes: notes || undefined,
    });
    setAmount("");
    setMode("bank_transfer");
    setReceiptNumber("");
    setNotes("");
    setOpen(false);
  }

  const tdsRate = store.settings.tds_percentage;
  const parsedAmount = parseFloat(amount) || 0;
  const showTds = parsedAmount >= 5000000;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus className="w-4 h-4 mr-1" />
        Record Payment
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pay-amount">Amount (₹)</Label>
            <Input
              id="pay-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 500000"
              required
            />
            {showTds && (
              <p className="text-xs text-amber-600">
                TDS @ {tdsRate}% = ₹{Math.round(parsedAmount * tdsRate / 100).toLocaleString("en-IN")} (Section 194-IA applies for amounts ≥ ₹50L)
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label id="pay-mode-label">Payment Mode</Label>
            <Select value={mode} onValueChange={(v) => v && setMode(v as PaymentMode)}>
              <SelectTrigger aria-labelledby="pay-mode-label">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PAYMENT_MODE_LABELS).map(([val, label]) => (
                  <SelectItem key={val} value={val}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pay-receipt">Receipt Number (optional)</Label>
            <Input
              id="pay-receipt"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              placeholder="e.g., REC-001"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pay-notes">Notes (optional)</Label>
            <Input
              id="pay-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Payment notes..."
            />
          </div>
          <Button type="submit" className="w-full">
            <IndianRupee className="w-4 h-4 mr-1" />
            Record Payment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PaymentScheduleCard({ bookingId }: { bookingId: string }) {
  const store = useDemoStore();
  const [installments, setInstallments] = useState("6");
  const [showCreate, setShowCreate] = useState(false);

  const schedules = useMemo(
    () => getPaymentSchedulesForBooking(bookingId),
    [bookingId, store.paymentSchedules]
  );

  function handleCreate() {
    const n = parseInt(installments) || 6;
    createPaymentScheduleForBooking(bookingId, n);
    setShowCreate(false);
  }

  function handleMarkPaid(scheduleId: string) {
    updatePaymentScheduleStatus(scheduleId, "paid");
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Payment Schedule
        </CardTitle>
        {schedules.length === 0 && (
          <Button size="sm" variant="outline" onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-1" /> Create
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {showCreate && schedules.length === 0 && (
          <div className="flex items-end gap-2 mb-4 p-3 bg-muted/30 rounded-lg">
            <div className="space-y-1 flex-1">
              <Label htmlFor="sched-count" className="text-xs">Installments</Label>
              <Input
                id="sched-count"
                type="number"
                min="1"
                max="24"
                value={installments}
                onChange={(e) => setInstallments(e.target.value)}
                className="h-8"
              />
            </div>
            <Button size="sm" onClick={handleCreate}>Generate</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
          </div>
        )}
        {schedules.length === 0 && !showCreate ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No payment schedule created yet.
          </p>
        ) : schedules.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">#</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((s) => {
                const isOverdue = s.status === "pending" && new Date(s.due_date) < new Date();
                return (
                  <TableRow key={s.id}>
                    <TableCell className="text-xs font-medium">{s.installment_number}</TableCell>
                    <TableCell className="text-sm">
                      {new Date(s.due_date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "2-digit" })}
                    </TableCell>
                    <TableCell className="text-sm font-medium">{formatCurrency(s.amount)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${
                        isOverdue
                          ? PAYMENT_SCHEDULE_STATUS_STYLES.overdue.outline
                          : PAYMENT_SCHEDULE_STATUS_STYLES[s.status]?.outline || ""
                      }`}>
                        {isOverdue ? "Overdue" : s.status === "paid" ? "Paid" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {s.status !== "paid" && (
                        <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => handleMarkPaid(s.id)}>
                          Mark Paid
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default function BookingDetailPage() {
  const params = useParams();
  const store = useDemoStore();
  const router = useRouter();

  const booking = useMemo(
    () => store.bookings.find((b) => b.id === params.id),
    [store.bookings, params.id]
  );

  const property = useMemo(
    () => (booking ? store.properties.find((p) => p.id === booking.property_id) : null),
    [booking, store.properties]
  );

  const project = useMemo(
    () => (property ? store.projects.find((p) => p.id === property.project_id) : null),
    [property, store.projects]
  );

  const lead = useMemo(
    () => (booking ? store.leads.find((l) => l.id === booking.lead_id) : null),
    [booking, store.leads]
  );

  const payments = useMemo(
    () => (booking ? store.payments.filter((p) => p.booking_id === booking.id) : []),
    [booking, store.payments]
  );

  const totalPaid = payments.reduce((s, p) => s + p.amount, 0);
  const totalTds = payments.reduce((s, p) => s + p.tds_amount, 0);

  if (!booking) {
    return (
      <div className="p-4">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href="/dashboard" />}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Button>
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-lg font-semibold">Booking Not Found</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardHeader
        title={`Booking — ${property?.plot_number || booking.property_id}`}
        description={`${project?.name || ""} · ${lead?.name || ""}`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => { if (confirm("Delete this booking and all its payments? Property will be released back to available.")) { deleteBooking(booking.id); router.push(`/leads/${booking.lead_id}`); } }}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href={`/leads/${booking.lead_id}`} />}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Lead
            </Button>
          </div>
        }
      />
      <div className="p-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Price</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(booking.total_price)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
              <Receipt className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totalPaid)}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((totalPaid / booking.total_price) * 100)}% of total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
              <IndianRupee className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {formatCurrency(booking.total_price - totalPaid)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">TDS Deducted</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalTds)}</div>
              <p className="text-xs text-muted-foreground">
                @ {store.settings.tds_percentage}% (Section 194-IA)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Payment Progress</span>
              <span className="text-sm text-muted-foreground">
                {formatCurrency(totalPaid)} / {formatCurrency(booking.total_price)}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${Math.min((totalPaid / booking.total_price) * 100, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Booking Details + Payments */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Details */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Booking Details</CardTitle>
                <Badge variant="outline" className={BOOKING_STATUS_STYLES[booking.status]?.outline || ""}>
                  {BOOKING_STATUS_LABELS[booking.status]}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Booking Date</span>
                    <p className="font-medium">
                      {new Date(booking.booking_date).toLocaleDateString("en-IN", {
                        year: "numeric", month: "long", day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Token Amount</span>
                    <p className="font-medium">{formatCurrency(booking.token_amount)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Agreement Date</span>
                    <p className="font-medium">
                      {booking.agreement_date
                        ? new Date(booking.agreement_date).toLocaleDateString("en-IN")
                        : "Not yet"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Registration Date</span>
                    <p className="font-medium">
                      {booking.registration_date
                        ? new Date(booking.registration_date).toLocaleDateString("en-IN")
                        : "Not yet"}
                    </p>
                  </div>
                </div>
                {booking.notes && (
                  <div className="mt-4 pt-3 border-t">
                    <p className="text-xs text-muted-foreground">Notes</p>
                    <p className="text-sm">{booking.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payments Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">
                  Payments ({payments.length})
                </CardTitle>
                <AddPaymentDialog bookingId={booking.id} />
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>TDS</TableHead>
                      <TableHead>Receipt</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          <IndianRupee className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          No payments recorded yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="text-sm">
                            {new Date(payment.payment_date).toLocaleDateString("en-IN")}
                          </TableCell>
                          <TableCell className="text-sm font-medium">
                            {formatCurrency(payment.amount)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {PAYMENT_MODE_LABELS[payment.payment_mode]}
                          </TableCell>
                          <TableCell className="text-sm">
                            {payment.tds_amount > 0
                              ? formatCurrency(payment.tds_amount)
                              : "—"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {payment.receipt_number || "—"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                payment.status === "received"
                                  ? BOOKING_STATUS_STYLES.confirmed.outline
                                  : ""
                              }
                            >
                              {payment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            {/* Payment Schedule */}
            <PaymentScheduleCard bookingId={booking.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Status Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Update Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select
                  value={booking.status}
                  onValueChange={(v) => v && updateBookingStatus(booking.id, v as BookingStatus)}
                >
                  <SelectTrigger aria-label="Booking status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(BOOKING_STATUS_LABELS) as [BookingStatus, string][]).map(([val, label]) => (
                      <SelectItem key={val} value={val}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Setting to "Registered" marks the property as sold. "Cancelled" releases it back to available.
                </p>
              </CardContent>
            </Card>

            {/* Property Info */}
            {property && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Property
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plot</span>
                    <span className="font-medium">{property.plot_number}</span>
                  </div>
                  {project && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Project</span>
                      <span className="font-medium">{project.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="secondary" className="text-xs">
                      {property.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-medium">{formatCurrency(property.price)}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Customer Info */}
            {lead && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Customer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-muted-foreground">{lead.phone}</p>
                  {lead.email && (
                    <p className="text-muted-foreground">{lead.email}</p>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    nativeButton={false}
                    render={<Link href={`/leads/${lead.id}`} />}
                  >
                    View Lead Details
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <RegistrationCalculatorDialog
                  propertyValue={booking.total_price}
                  state={project?.state}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
