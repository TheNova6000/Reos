"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AnimatedCounter } from "@/components/dashboard/animated-counter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Phone, Mail, Calendar, User, MessageSquare, Flame, AlertCircle, Users } from "lucide-react";
import { LEAD_STATUS_LABELS, LEAD_STATUS_STYLES, LEAD_SOURCE_LABELS, LEAD_TEMPERATURE_STYLES, formatCurrency } from "@/lib/constants";
import { demoUsers } from "@/lib/demo-data";
import { useDemoStore, addLead, updateProperty } from "@/lib/demo-store";
import type { Lead, LeadSource } from "@/types/database";

function AddLeadDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", source: "walkin" as LeadSource,
    budget_min: "", budget_max: "", notes: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    addLead({
      name: form.name,
      phone: form.phone,
      email: form.email || undefined,
      source: form.source,
      budget_min: form.budget_min ? parseInt(form.budget_min) : undefined,
      budget_max: form.budget_max ? parseInt(form.budget_max) : undefined,
      notes: form.notes || undefined,
    });
    setForm({ name: "", phone: "", email: "", source: "walkin", budget_min: "", budget_max: "", notes: "" });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus className="w-4 h-4 mr-1" /> Add Lead
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>Add New Lead</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lead-name">Name *</Label>
              <Input id="lead-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Customer name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-phone">Phone *</Label>
              <Input id="lead-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 93912 38940" required />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lead-email">Email</Label>
              <Input id="lead-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
            </div>
            <div className="space-y-2">
              <Label id="lead-source-label">Source</Label>
              <Select value={form.source} onValueChange={(v) => v && setForm({ ...form, source: v as LeadSource })}>
                <SelectTrigger aria-labelledby="lead-source-label"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(LEAD_SOURCE_LABELS).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lead-budget-min">Budget Min (₹)</Label>
              <Input id="lead-budget-min" type="number" value={form.budget_min} onChange={(e) => setForm({ ...form, budget_min: e.target.value })} placeholder="1000000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-budget-max">Budget Max (₹)</Label>
              <Input id="lead-budget-max" type="number" value={form.budget_max} onChange={(e) => setForm({ ...form, budget_max: e.target.value })} placeholder="5000000" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-notes">Notes</Label>
            <Textarea id="lead-notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Initial notes about the lead..." rows={3} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Add Lead</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const leadStages = ["new", "contacted", "property_shared", "site_visit", "negotiation", "booked", "registration", "possession"] as const;

const STAGE_COLORS: Record<string, { top: string; header: string; count: string }> = {
  new:              { top: "border-blue-500",    header: "text-blue-500 dark:text-blue-400",    count: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
  contacted:        { top: "border-amber-500",   header: "text-amber-600 dark:text-amber-400",  count: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  property_shared:  { top: "border-orange-500",  header: "text-orange-600 dark:text-orange-400",count: "bg-orange-500/15 text-orange-700 dark:text-orange-300" },
  site_visit:       { top: "border-primary",     header: "text-primary",                         count: "bg-primary/15 text-primary" },
  negotiation:      { top: "border-rose-500",    header: "text-rose-600 dark:text-rose-400",    count: "bg-rose-500/15 text-rose-700 dark:text-rose-300" },
  booked:           { top: "border-emerald-500", header: "text-emerald-600 dark:text-emerald-400",count: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  registration:     { top: "border-teal-500",    header: "text-teal-600 dark:text-teal-400",    count: "bg-teal-500/15 text-teal-700 dark:text-teal-300" },
  possession:       { top: "border-green-500",   header: "text-green-600 dark:text-green-400",  count: "bg-green-500/15 text-green-700 dark:text-green-300" },
};

function daysSince(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "1d ago";
  return `${days}d ago`;
}

function daysSinceNum(dateStr: string | null) {
  if (!dateStr) return 999;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

function isOverdue(dateStr: string | null) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

const TEMP_ICONS: Record<string, string> = { hot: "🔥", warm: "🌤", cold: "❄" };

function LeadCard({ lead, projects, properties }: { lead: Lead; projects: { id: string; name: string }[]; properties: { id: string; project_id: string }[] }) {
  const agent = lead.assigned_agent_id ? demoUsers.find((u) => u.id === lead.assigned_agent_id) : null;
  const interestedProjects = lead.properties_interested.length > 0
    ? [...new Set(lead.properties_interested.map((pid) => {
        const prop = properties.find((p) => p.id === pid);
        if (!prop) return null;
        const proj = projects.find((p) => p.id === prop.project_id);
        return proj?.name;
      }).filter(Boolean))]
    : null;

  const contactDays = daysSinceNum(lead.last_contacted_at || lead.updated_at);
  const contactColor = contactDays <= 1 ? "text-emerald-400" : contactDays <= 3 ? "text-amber-400" : "text-red-400";
  const followUpOverdue = isOverdue(lead.next_follow_up);
  const tempStyle = LEAD_TEMPERATURE_STYLES[lead.temperature] || LEAD_TEMPERATURE_STYLES.warm;

  return (
    <div className={`bg-card border p-3 space-y-2 text-sm hover:border-primary/50 transition-colors ${followUpOverdue ? "border-red-500/40" : ""}`}>
      {/* Name + badges */}
      <div className="flex items-start justify-between gap-1.5">
        <Link href={`/leads/${lead.id}`} className="min-w-0 flex-1 hover:text-primary transition-colors">
          <p className="font-semibold truncate">{lead.name}</p>
        </Link>
        <div className="flex items-center gap-1 shrink-0">
          <span className={`text-[10px] px-1.5 py-0.5 font-medium ${tempStyle.bg} ${tempStyle.text}`}>
            {TEMP_ICONS[lead.temperature]} {lead.temperature}
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 font-medium ${
            lead.source === "website" ? "bg-blue-500/10 text-blue-400" :
            lead.source === "walkin" ? "bg-emerald-500/10 text-emerald-400" :
            lead.source === "referral" ? "bg-purple-500/10 text-purple-400" :
            lead.source === "whatsapp" ? "bg-green-500/10 text-green-400" :
            lead.source === "phone" ? "bg-amber-500/10 text-amber-400" :
            "bg-muted text-muted-foreground"
          }`}>
            {LEAD_SOURCE_LABELS[lead.source]}
          </span>
        </div>
      </div>

      {/* Phone + quick actions */}
      <div className="flex items-center justify-between">
        <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-xs font-medium hover:text-primary" onClick={(e) => e.stopPropagation()}>
          <Phone className="w-3 h-3 text-muted-foreground" />
          {lead.phone}
        </a>
        <div className="flex items-center gap-1">
          <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()} className="w-6 h-6 flex items-center justify-center bg-primary/10 hover:bg-primary/20 transition-colors" title="Call">
            <Phone className="w-3 h-3 text-primary" />
          </a>
          <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="w-6 h-6 flex items-center justify-center bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors" title="WhatsApp">
            <MessageSquare className="w-3 h-3 text-emerald-400" />
          </a>
        </div>
      </div>

      {/* Project + budget chips */}
      <div className="flex flex-wrap gap-1.5">
        {interestedProjects && interestedProjects.map((name) => (
          <span key={name} className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary font-medium truncate max-w-[140px]">
            {name}
          </span>
        ))}
        {lead.budget_min && (
          <span className="text-[10px] px-1.5 py-0.5 bg-muted text-muted-foreground">
            ₹{(lead.budget_min / 100000).toFixed(1)}L–{(lead.budget_max! / 100000).toFixed(1)}L
          </span>
        )}
        {lead.preferred_facing && (
          <span className="text-[10px] px-1.5 py-0.5 bg-muted text-muted-foreground capitalize">
            {lead.preferred_facing.replace("_", " ")}
          </span>
        )}
      </div>

      {/* Notes / next action */}
      {(lead.next_action || lead.notes) && (
        <p className="text-[11px] text-muted-foreground line-clamp-1">
          {lead.next_action ? `→ ${lead.next_action}` : lead.notes}
        </p>
      )}

      {/* Footer: agent + follow-up + staleness */}
      <div className="flex items-center justify-between pt-1.5 border-t border-border/50 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span className={agent ? "" : "text-amber-400"}>{agent?.full_name || "Unassigned"}</span>
        </div>
        <div className="flex items-center gap-2">
          {lead.next_follow_up && (
            <span className={`flex items-center gap-0.5 ${followUpOverdue ? "text-red-400 font-medium" : ""}`}>
              <Calendar className="w-3 h-3" />
              {followUpOverdue ? "OVERDUE" : new Date(lead.next_follow_up).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
            </span>
          )}
          <span className={contactColor}>{daysSince(lead.last_contacted_at || lead.updated_at || lead.created_at)}</span>
        </div>
      </div>
    </div>
  );
}

function PipelineColumn({ status, label, leads, projects, properties }: { status: string; label: string; leads: Lead[]; projects: { id: string; name: string }[]; properties: { id: string; project_id: string }[] }) {
  const color = STAGE_COLORS[status] || STAGE_COLORS.new;
  return (
    <div className={`flex-1 min-w-[78vw] sm:min-w-[260px] snap-start flex flex-col border-t-2 ${color.top} bg-muted/30`}>
      <div className="px-3 py-2.5 flex items-center justify-between border-b border-border/50 bg-muted/20">
        <span className={`text-[11px] font-bold uppercase tracking-wider ${color.header}`}>{label}</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 tabular-nums ${color.count}`}>{leads.length}</span>
      </div>
      <div className="p-2 space-y-2 flex-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
        {leads.length === 0 ? (
          <p className="text-xs text-muted-foreground/50 text-center py-8">Empty</p>
        ) : (
          leads.map((lead) => <LeadCard key={lead.id} lead={lead} projects={projects} properties={properties} />)
        )}
      </div>
    </div>
  );
}

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const store = useDemoStore();

  const filteredLeads = useMemo(() => {
    return store.leads.filter((l) => {
      const matchSearch = !search ||
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.phone.includes(search) ||
        (l.notes || "").toLowerCase().includes(search.toLowerCase());
      const matchSource = sourceFilter === "all" || l.source === sourceFilter;
      return matchSearch && matchSource;
    });
  }, [search, sourceFilter, store.leads]);

  const activeLeads = useMemo(
    () => store.leads.filter((l) => !["booked", "registration", "possession", "lost"].includes(l.status)),
    [store.leads]
  );

  const hotLeads = useMemo(
    () => store.leads.filter((l) => l.temperature === "hot").length,
    [store.leads]
  );

  const overdueLeads = useMemo(
    () => store.leads.filter((l) => isOverdue(l.next_follow_up)).length,
    [store.leads]
  );

  const leadsByStatus = useMemo(() => {
    const map: Record<string, Lead[]> = {};
    for (const s of leadStages) map[s] = store.leads.filter((l) => l.status === s);
    return map;
  }, [store.leads]);

  void updateProperty;

  const statCards = [
    { label: "Total Leads", value: store.leads.length, accent: "", border: "border-border/50", bg: "", icon: Users },
    { label: "Active", value: activeLeads.length, accent: "text-primary", border: "border-primary/20", bg: "bg-primary/5", icon: Users },
    { label: "Hot Leads", value: hotLeads, accent: "text-rose-600 dark:text-rose-400", border: "border-rose-500/20", bg: "bg-rose-500/5", icon: Flame },
    { label: "Overdue", value: overdueLeads, accent: "text-amber-600 dark:text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/5", icon: AlertCircle },
  ];

  return (
    <>
      <DashboardHeader
        title="Leads"
        description={`${store.leads.length} total · ${activeLeads.length} active in pipeline`}
        actions={<AddLeadDialog />}
      />
      <div className="p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {statCards.map((s, i) => (
            <div
              key={s.label}
              className={`border ${s.border} ${s.bg} px-3 py-2.5 animate-fade-up`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{s.label}</p>
              <p className={`text-2xl font-bold tabular-nums ${s.accent}`}>
                <AnimatedCounter value={s.value} startDelay={i * 60} />
              </p>
            </div>
          ))}
        </div>

        {/* Search & Source filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-card border border-border/50 px-3 py-2.5">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              aria-label="Search leads"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-0 bg-transparent focus-visible:ring-0 h-8"
            />
          </div>
          <Select value={sourceFilter} onValueChange={(v) => v && setSourceFilter(v)}>
            <SelectTrigger className="w-full sm:w-[150px] h-8 text-xs" aria-label="Filter by source">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {Object.entries(LEAD_SOURCE_LABELS).map(([val, label]) => (
                <SelectItem key={val} value={val}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="pipeline">
          <TabsList>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="list">List ({filteredLeads.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pipeline">
            <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory sm:snap-none">
              {leadStages.map((stage) => (
                <PipelineColumn
                  key={stage}
                  status={stage}
                  label={LEAD_STATUS_LABELS[stage]}
                  leads={leadsByStatus[stage]}
                  projects={store.projects}
                  properties={store.properties}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">Name</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">Contact</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">Source</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">Budget</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">Agent</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">Follow-up</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No leads match your filters.</TableCell>
                      </TableRow>
                    ) : (
                      filteredLeads.map((lead, idx) => {
                        const agent = lead.assigned_agent_id ? demoUsers.find((u) => u.id === lead.assigned_agent_id) : null;
                        return (
                          <TableRow
                            key={lead.id}
                            className={`cursor-pointer hover:bg-muted/50 ${idx % 2 === 1 ? "bg-muted/20" : ""}`}
                            tabIndex={0}
                            role="link"
                            onClick={() => window.location.href = `/leads/${lead.id}`}
                            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); window.location.href = `/leads/${lead.id}`; } }}
                          >
                            <TableCell className="font-semibold">{lead.name}</TableCell>
                            <TableCell className="text-xs">
                              <div className="flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone}</div>
                              {lead.email && <div className="flex items-center gap-1 text-muted-foreground"><Mail className="w-3 h-3" />{lead.email}</div>}
                            </TableCell>
                            <TableCell className="text-xs">{LEAD_SOURCE_LABELS[lead.source]}</TableCell>
                            <TableCell className="text-xs tabular-nums">
                              {lead.budget_min ? `${formatCurrency(lead.budget_min)} – ${formatCurrency(lead.budget_max!)}` : "—"}
                            </TableCell>
                            <TableCell className="text-xs">{agent?.full_name || "—"}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`text-xs ${LEAD_STATUS_STYLES[lead.status]?.outline || ""}`}>
                                {LEAD_STATUS_LABELS[lead.status]}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs">
                              {lead.next_follow_up ? (
                                <span className={isOverdue(lead.next_follow_up) ? "text-red-500 font-semibold" : ""}>
                                  {new Date(lead.next_follow_up).toLocaleDateString("en-IN")}
                                </span>
                              ) : "—"}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
