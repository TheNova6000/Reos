"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { LeadActivities } from "@/components/dashboard/lead-activities";
import {
  useDemoStore,
  updateLeadStatus,
  updateLead,
  assignLead,
  createBooking,
  deleteLead,
} from "@/lib/demo-store";
import { demoUsers } from "@/lib/demo-data";
import {
  LEAD_STATUS_LABELS,
  LEAD_SOURCE_LABELS,
  LEAD_TEMPERATURE_STYLES,
  BOOKING_STATUS_STYLES,
  PROPERTY_FACING_LABELS,
  formatCurrency,
} from "@/lib/constants";
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  User,
  Eye,
  BookOpen,
  IndianRupee,
  Trash2,
} from "lucide-react";
import type { LeadStatus, Lead } from "@/types/database";

const STATUS_ORDER: LeadStatus[] = ["new", "contacted", "site_visit", "negotiation", "booked", "lost"];

function ConvertToBookingDialog({ leadId, onCreated }: { leadId: string; onCreated: (bookingId: string) => void }) {
  const store = useDemoStore();
  const [open, setOpen] = useState(false);
  const [propertyId, setPropertyId] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [notes, setNotes] = useState("");

  const lead = store.leads.find((l) => l.id === leadId);
  const selectedProperty = store.properties.find((p) => p.id === propertyId);
  const availableProperties = store.properties.filter((p) => p.status === "available");

  const interestedAvailable = useMemo(() => {
    if (!lead) return [];
    return lead.properties_interested
      .map((id) => store.properties.find((p) => p.id === id))
      .filter((p) => p && p.status === "available") as typeof store.properties;
  }, [lead, store.properties]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!propertyId || !selectedProperty) return;
    const booking = createBooking({
      lead_id: leadId,
      property_id: propertyId,
      token_amount: parseFloat(tokenAmount) || 0,
      total_price: selectedProperty.price,
      notes: notes || undefined,
    });
    setPropertyId("");
    setTokenAmount("");
    setNotes("");
    setOpen(false);
    onCreated(booking.id);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button size="sm" className="w-full" disabled={lead?.status === "booked" || lead?.status === "lost"} />
      }>
        <BookOpen className="w-4 h-4 mr-1" />
        Convert to Booking
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Booking for {lead?.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label id="booking-property-label">Select Property</Label>
            {interestedAvailable.length > 0 && (
              <div className="space-y-1 mb-2">
                <p className="text-xs text-muted-foreground">Interested properties:</p>
                {interestedAvailable.map((p) => {
                  const proj = store.projects.find((pr) => pr.id === p.project_id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPropertyId(p.id)}
                      aria-pressed={propertyId === p.id}
                      className={`w-full text-left p-2 rounded border text-sm ${
                        propertyId === p.id ? "border-primary bg-primary/5" : "hover:bg-muted/30"
                      }`}
                    >
                      <span className="font-medium">{p.plot_number}</span>
                      <span className="text-muted-foreground"> · {proj?.name} · {formatCurrency(p.price)}</span>
                    </button>
                  );
                })}
              </div>
            )}
            <Select value={propertyId} onValueChange={(v) => v && setPropertyId(v)}>
              <SelectTrigger aria-labelledby="booking-property-label">
                <SelectValue placeholder="Or choose any available property..." />
              </SelectTrigger>
              <SelectContent>
                {availableProperties.map((p) => {
                  const proj = store.projects.find((pr) => pr.id === p.project_id);
                  return (
                    <SelectItem key={p.id} value={p.id}>
                      {p.plot_number} — {proj?.name} ({formatCurrency(p.price)})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          {selectedProperty && (
            <div className="p-3 bg-muted/50 rounded-lg text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Property</span>
                <span className="font-medium">{selectedProperty.plot_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Price</span>
                <span className="font-semibold text-emerald-600">{formatCurrency(selectedProperty.price)}</span>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="booking-token">Token Amount (₹)</Label>
            <Input
              id="booking-token"
              type="number"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              placeholder="e.g., 100000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="booking-notes">Notes (optional)</Label>
            <Input
              id="booking-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Booking notes..."
            />
          </div>
          <Button type="submit" className="w-full" disabled={!propertyId}>
            <BookOpen className="w-4 h-4 mr-1" />
            Create Booking
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function LeadDetailPage() {
  const params = useParams();
  const store = useDemoStore();
  const router = useRouter();

  const lead = useMemo(
    () => store.leads.find((l) => l.id === params.id),
    [store.leads, params.id]
  );

  const leadBookings = useMemo(
    () => (lead ? store.bookings.filter((b) => b.lead_id === lead.id) : []),
    [store.bookings, lead]
  );

  if (!lead) {
    return (
      <div className="p-4">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href="/leads" />}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Leads
        </Button>
        <div className="text-center py-16">
          <User className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-lg font-semibold">Lead Not Found</h2>
        </div>
      </div>
    );
  }

  const currentStageIndex = STATUS_ORDER.indexOf(lead.status);
  const agent = lead.assigned_agent_id
    ? demoUsers.find((u) => u.id === lead.assigned_agent_id)
    : null;

  return (
    <>
      <DashboardHeader
        title={lead.name}
        description={`Lead #${lead.id} · ${LEAD_SOURCE_LABELS[lead.source]}`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => { if (confirm("Delete this lead and all its activities?")) { deleteLead(lead.id); router.push("/leads"); } }}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href="/leads" />}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          </div>
        }
      />
      <div className="p-4">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main — Activities */}
          <div className="lg:col-span-2">
            <LeadActivities leadId={lead.id} />
          </div>

          {/* Sidebar — Lead Info */}
          <div className="space-y-6">
            {/* Status & Pipeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pipeline Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Current:</span>
                    <Badge>{LEAD_STATUS_LABELS[lead.status]}</Badge>
                  </div>
                  <Select
                    value={lead.status}
                    onValueChange={(v) => v && updateLeadStatus(lead.id, v as LeadStatus)}
                  >
                    <SelectTrigger aria-label="Pipeline status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_ORDER.map((s) => (
                        <SelectItem key={s} value={s}>
                          {LEAD_STATUS_LABELS[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Pipeline Progress */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Progress</p>
                  <div className="flex gap-1">
                    {STATUS_ORDER.map((s, i) => (
                      <div
                        key={s}
                        className={`h-2 flex-1 rounded-full ${
                          i <= currentStageIndex
                            ? lead.status === "lost"
                              ? "bg-gray-400"
                              : "bg-primary"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>New</span>
                    <span>Booked</span>
                  </div>
                </div>

                {/* Convert to Booking */}
                <ConvertToBookingDialog
                  leadId={lead.id}
                  onCreated={() => {}}
                />
              </CardContent>
            </Card>

            {/* Bookings */}
            {leadBookings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {leadBookings.map((booking) => {
                    const prop = store.properties.find((p) => p.id === booking.property_id);
                    const proj = prop ? store.projects.find((p) => p.id === prop.project_id) : null;
                    const payments = store.payments.filter((p) => p.booking_id === booking.id);
                    const totalPaid = payments.reduce((s, p) => s + p.amount, 0);
                    return (
                      <div key={booking.id} className="p-3 rounded-lg border space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {prop?.plot_number} — {proj?.name}
                          </span>
                          <Badge
                            variant="outline"
                            className={BOOKING_STATUS_STYLES[booking.status]?.outline || ""}
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div>
                            <span className="font-medium text-foreground">Total:</span>{" "}
                            {formatCurrency(booking.total_price)}
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Token:</span>{" "}
                            {formatCurrency(booking.token_amount)}
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Paid:</span>{" "}
                            {formatCurrency(totalPaid)}
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Balance:</span>{" "}
                            {formatCurrency(booking.total_price - totalPaid)}
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{
                              width: `${Math.min((totalPaid / booking.total_price) * 100, 100)}%`,
                            }}
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                          nativeButton={false}
                          render={<Link href={`/bookings/${booking.id}`} />}
                        >
                          <IndianRupee className="w-3 h-3 mr-1" />
                          Manage Booking & Payments
                        </Button>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Assign Agent */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Assigned To</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{agent?.full_name || "Unassigned"}</span>
                </div>
                <Select
                  value={lead.assigned_agent_id || ""}
                  onValueChange={(v) => v && assignLead(lead.id, v)}
                >
                  <SelectTrigger aria-label="Assign agent">
                    <SelectValue placeholder="Assign agent..." />
                  </SelectTrigger>
                  <SelectContent>
                    {demoUsers
                      .filter((u) => u.role === "agent" || u.role === "admin")
                      .map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.full_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a
                  href={`tel:${lead.phone}`}
                  className="flex items-center gap-2 text-sm hover:text-primary"
                >
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  {lead.phone}
                </a>
                {lead.email && (
                  <a
                    href={`mailto:${lead.email}`}
                    className="flex items-center gap-2 text-sm hover:text-primary"
                  >
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    {lead.email}
                  </a>
                )}
                <a
                  href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-emerald-500 hover:text-emerald-400"
                >
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp
                </a>
              </CardContent>
            </Card>

            {/* Temperature & Follow-up */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Priority & Follow-up</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">Temperature</p>
                  <div className="flex gap-1.5">
                    {(["hot", "warm", "cold"] as const).map((t) => {
                      const style = LEAD_TEMPERATURE_STYLES[t];
                      const active = lead.temperature === t;
                      return (
                        <button
                          key={t}
                          onClick={() => updateLead(lead.id, { temperature: t })}
                          className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${active ? `${style.bg} ${style.text} ring-1 ring-current` : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                        >
                          {t === "hot" ? "🔥" : t === "warm" ? "🌤" : "❄"} {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">Next Follow-up</p>
                  <Input
                    type="datetime-local"
                    value={lead.next_follow_up ? new Date(lead.next_follow_up).toISOString().slice(0, 16) : ""}
                    onChange={(e) => updateLead(lead.id, { next_follow_up: e.target.value ? new Date(e.target.value).toISOString() : null })}
                    className="text-xs h-8"
                  />
                  {lead.next_follow_up && new Date(lead.next_follow_up) < new Date() && (
                    <p className="text-xs text-red-400 font-medium">OVERDUE</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">Next Action</p>
                  <Input
                    value={lead.next_action || ""}
                    onChange={(e) => updateLead(lead.id, { next_action: e.target.value || null })}
                    placeholder="e.g., Send brochure, Schedule site visit"
                    className="text-xs h-8"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Requirements — Editable */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Budget Min (₹)</p>
                    <Input
                      type="number"
                      value={lead.budget_min || ""}
                      onChange={(e) => updateLead(lead.id, { budget_min: e.target.value ? parseInt(e.target.value) : null })}
                      placeholder="1000000"
                      className="text-xs h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Budget Max (₹)</p>
                    <Input
                      type="number"
                      value={lead.budget_max || ""}
                      onChange={(e) => updateLead(lead.id, { budget_max: e.target.value ? parseInt(e.target.value) : null })}
                      placeholder="5000000"
                      className="text-xs h-8"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Preferred Location</p>
                  <Input
                    value={lead.preferred_location || ""}
                    onChange={(e) => updateLead(lead.id, { preferred_location: e.target.value || null })}
                    placeholder="Shamshabad, near airport"
                    className="text-xs h-8"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Facing</p>
                    <Select
                      value={lead.preferred_facing || ""}
                      onValueChange={(v) => v && updateLead(lead.id, { preferred_facing: v as Lead["preferred_facing"] })}
                    >
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Any" /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(PROPERTY_FACING_LABELS).map(([val, label]) => (
                          <SelectItem key={val} value={val}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Property Type</p>
                    <Select
                      value={lead.preferred_type || ""}
                      onValueChange={(v) => v && updateLead(lead.id, { preferred_type: v as Lead["preferred_type"] })}
                    >
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Any" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plot">Plot</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="farmland">Farmland</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Notes</p>
                  <Textarea
                    value={lead.notes || ""}
                    onChange={(e) => updateLead(lead.id, { notes: e.target.value || null })}
                    placeholder="Additional notes about this lead..."
                    rows={3}
                    className="text-xs"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Interested Properties */}
            {lead.properties_interested.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Interested Properties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {lead.properties_interested.map((propId) => {
                    const prop = store.properties.find((p) => p.id === propId);
                    if (!prop) return null;
                    const proj = store.projects.find((p) => p.id === prop.project_id);
                    return (
                      <div
                        key={propId}
                        className="flex items-center justify-between p-2 rounded-lg border bg-muted/30"
                      >
                        <div>
                          <p className="text-sm font-medium">{prop.plot_number}</p>
                          <p className="text-xs text-muted-foreground">
                            {proj?.name} · {formatCurrency(prop.price)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          nativeButton={false}
                          render={<Link href={`/properties/${prop.id}`} target="_blank" />}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a
                  href={`tel:${lead.phone}`}
                  className="flex items-center justify-center gap-2 w-full h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
                >
                  <Phone className="w-4 h-4" />
                  Call {lead.phone}
                </a>
                <a
                  href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-9 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500"
                >
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
