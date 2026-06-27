"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AnimatedCounter } from "@/components/dashboard/animated-counter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteVisitCalendar } from "@/components/dashboard/site-visit-calendar";
import { useDemoStore, addActivity, completeSiteVisit } from "@/lib/demo-store";
import {
  Plus,
  CalendarDays,
  MapPin,
  User,
  Clock,
  Check,
  AlertCircle,
  Phone,
  List,
  ArrowUpRight,
} from "lucide-react";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";

type VisitStatus = "upcoming" | "completed" | "missed";

function getVisitStatus(visit: { is_completed: boolean; scheduled_for: string | null }): VisitStatus {
  if (visit.is_completed) return "completed";
  if (visit.scheduled_for && new Date(visit.scheduled_for) < new Date()) return "missed";
  return "upcoming";
}

function formatRelativeDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "EEE, MMM d");
}

function ScheduleSiteVisitDialog() {
  const store = useDemoStore();
  const [open, setOpen] = useState(false);
  const [leadId, setLeadId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [notes, setNotes] = useState("");

  const activeLeads = useMemo(
    () =>
      store.leads.filter(
        (l) => !["booked", "lost", "possession"].includes(l.status)
      ),
    [store.leads]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!leadId || !dateTime) return;
    const parsed = new Date(dateTime);
    if (isNaN(parsed.getTime())) return;
    const project = store.projects.find((p) => p.id === projectId);
    const desc = `Site visit scheduled${project ? ` at ${project.name}` : ""}. ${notes}`.trim();
    addActivity({
      lead_id: leadId,
      activity_type: "site_visit",
      description: desc,
      scheduled_for: parsed.toISOString(),
      is_completed: false,
      site_visit_feedback: projectId
        ? { project_id: projectId, plots_shown: [], rating: 0, feedback: "", attendees: [] }
        : null,
    });
    setLeadId("");
    setProjectId("");
    setDateTime("");
    setNotes("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus className="w-4 h-4 mr-1" /> Schedule Visit
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Schedule Site Visit
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label id="sv-lead-label">Lead *</Label>
            <Select value={leadId} onValueChange={(v) => v && setLeadId(v)}>
              <SelectTrigger aria-labelledby="sv-lead-label">
                <SelectValue placeholder="Select lead..." />
              </SelectTrigger>
              <SelectContent>
                {activeLeads.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.name} — {l.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label id="sv-project-label">Project</Label>
            <Select value={projectId} onValueChange={(v) => setProjectId(!v || v === "none" ? "" : v)}>
              <SelectTrigger aria-labelledby="sv-project-label">
                <SelectValue placeholder="Select project..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No specific project</SelectItem>
                {store.projects
                  .filter((p) => p.status !== "upcoming")
                  .map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} — {p.location}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sv-datetime">Date & Time *</Label>
            <Input
              id="sv-datetime"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sv-notes">Notes</Label>
            <Textarea
              id="sv-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Which plots to show, any special instructions..."
              rows={2}
            />
          </div>
          <Button type="submit" className="w-full" disabled={!leadId || !dateTime}>
            <CalendarDays className="w-4 h-4 mr-1" /> Schedule Visit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CompleteVisitDialog({ activityId, projectId, properties }: {
  activityId: string;
  projectId: string;
  properties: { id: string; plot_number: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [plotsShown, setPlotsShown] = useState<string[]>([]);
  const [rating, setRating] = useState("3");
  const [feedback, setFeedback] = useState("");
  const [attendees, setAttendees] = useState("");
  const [nextAction, setNextAction] = useState("");

  const projectProperties = properties.filter((p) => !projectId || true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    completeSiteVisit(activityId, {
      plots_shown: plotsShown,
      rating: parseInt(rating) || 3,
      feedback: feedback.trim(),
      attendees: attendees.split(",").map((a) => a.trim()).filter(Boolean),
      next_action: nextAction.trim() || undefined,
    });
    setOpen(false);
  }

  function togglePlot(id: string) {
    setPlotsShown((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  }

  const ratingLabels: Record<string, { label: string; color: string }> = {
    "1": { label: "Not Interested", color: "text-rose-500" },
    "2": { label: "Lukewarm", color: "text-amber-500" },
    "3": { label: "Interested", color: "text-blue-500" },
    "4": { label: "Very Interested", color: "text-emerald-500" },
    "5": { label: "Ready to Book", color: "text-emerald-600 font-bold" },
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button size="sm" variant="outline" className="text-xs gap-1">
          <Check className="w-3 h-3" /> Complete
        </Button>
      } />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-500" />
            Complete Site Visit
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Reaction */}
          <div className="space-y-2">
            <Label>Customer Reaction *</Label>
            <Select value={rating} onValueChange={(v) => v && setRating(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ratingLabels).map(([val, { label, color }]) => (
                  <SelectItem key={val} value={val}>
                    <span className={color}>{val}/5 — {label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Rating 3+ auto-advances the lead to Negotiation stage
            </p>
          </div>

          {/* Plots Shown */}
          {projectProperties.length > 0 && (
            <div className="space-y-2">
              <Label>Plots/Properties Shown</Label>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {projectProperties.slice(0, 20).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePlot(p.id)}
                    className={`px-2 py-1 text-xs border transition-colors ${
                      plotsShown.includes(p.id)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/50 text-muted-foreground border-border hover:border-foreground/30"
                    }`}
                  >
                    {p.plot_number}
                  </button>
                ))}
              </div>
              {plotsShown.length > 0 && (
                <p className="text-xs text-muted-foreground">{plotsShown.length} selected</p>
              )}
            </div>
          )}

          {/* Feedback Notes */}
          <div className="space-y-2">
            <Label htmlFor="cv-feedback">Visit Notes *</Label>
            <Textarea
              id="cv-feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What did the customer like? Any concerns? Budget discussion? Family members present?"
              rows={3}
              required
            />
          </div>

          {/* Attendees */}
          <div className="space-y-2">
            <Label htmlFor="cv-attendees">Who Attended</Label>
            <Input
              id="cv-attendees"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              placeholder="Customer, wife, father (comma separated)"
            />
          </div>

          {/* Next Action */}
          <div className="space-y-2">
            <Label htmlFor="cv-next">Next Action</Label>
            <Input
              id="cv-next"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              placeholder="e.g., Send cost sheet, Schedule 2nd visit, Share layout"
            />
          </div>

          <Button type="submit" className="w-full" disabled={!feedback.trim()}>
            <Check className="w-4 h-4 mr-1" /> Mark as Completed
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const STATUS_STYLES: Record<VisitStatus, {
  label: string;
  icon: typeof Check;
  dot: string;
  card: string;
  badge: string;
}> = {
  upcoming: {
    label: "Upcoming",
    icon: Clock,
    dot: "bg-amber-500",
    card: "border-t-amber-500 bg-amber-500/5 hover:bg-amber-500/8",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  },
  completed: {
    label: "Completed",
    icon: Check,
    dot: "bg-emerald-500",
    card: "border-t-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/8",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  },
  missed: {
    label: "Missed",
    icon: AlertCircle,
    dot: "bg-rose-500",
    card: "border-t-rose-500 bg-rose-500/5 hover:bg-rose-500/8",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
  },
};

export default function SiteVisitsPage() {
  const store = useDemoStore();
  const [listFilter, setListFilter] = useState<"all" | VisitStatus>("all");

  const siteVisits = useMemo(
    () =>
      store.activities
        .filter((a) => a.activity_type === "site_visit")
        .sort((a, b) => {
          const aDate = a.scheduled_for || a.created_at;
          const bDate = b.scheduled_for || b.created_at;
          return new Date(bDate).getTime() - new Date(aDate).getTime();
        }),
    [store.activities]
  );

  const upcoming = siteVisits.filter((v) => getVisitStatus(v) === "upcoming");
  const completed = siteVisits.filter((v) => getVisitStatus(v) === "completed");
  const missed = siteVisits.filter((v) => getVisitStatus(v) === "missed");

  const filteredVisits = useMemo(() => {
    if (listFilter === "all") return siteVisits;
    return siteVisits.filter((v) => getVisitStatus(v) === listFilter);
  }, [siteVisits, listFilter]);

  const leadMap = useMemo(() => {
    const map = new Map<string, (typeof store.leads)[0]>();
    store.leads.forEach((l) => map.set(l.id, l));
    return map;
  }, [store.leads]);

  const projectMap = useMemo(() => {
    const map = new Map<string, (typeof store.projects)[0]>();
    store.projects.forEach((p) => map.set(p.id, p));
    return map;
  }, [store.projects]);

  const statCards = [
    {
      count: upcoming.length,
      label: "Upcoming",
      sub: upcoming.length > 0
        ? `Next: ${formatRelativeDate(
            [...upcoming].sort((a, b) =>
              new Date(a.scheduled_for!).getTime() - new Date(b.scheduled_for!).getTime()
            )[0]?.scheduled_for || ""
          )}`
        : "None scheduled",
      accent: "text-amber-600 dark:text-amber-400",
      border: "border-amber-500/20",
      bg: "bg-amber-500/5",
      icon: Clock,
    },
    {
      count: completed.length,
      label: "Completed",
      sub: "Site visits done",
      accent: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/20",
      bg: "bg-emerald-500/5",
      icon: Check,
    },
    {
      count: missed.length,
      label: "Missed",
      sub: missed.length > 0 ? "Need rescheduling" : "All on track",
      accent: "text-rose-600 dark:text-rose-400",
      border: "border-rose-500/20",
      bg: "bg-rose-500/5",
      icon: AlertCircle,
    },
  ];

  return (
    <>
      <DashboardHeader
        title="Site Visits"
        description={`${upcoming.length} upcoming · ${completed.length} completed`}
        actions={<ScheduleSiteVisitDialog />}
      />
      <div className="p-4 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {statCards.map((stat, i) => (
            <div
              key={stat.label}
              className={`border ${stat.border} ${stat.bg} px-3 py-3 sm:px-4 animate-fade-up`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <stat.icon className={`w-4 h-4 ${stat.accent}`} />
                <p className={`text-xl sm:text-2xl font-bold tabular-nums ${stat.accent}`}>
                  <AnimatedCounter value={stat.count} startDelay={i * 80} />
                </p>
              </div>
              <p className="text-xs sm:text-sm font-semibold">{stat.label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 hidden sm:block">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="calendar">
          <TabsList variant="line">
            <TabsTrigger value="calendar">
              <CalendarDays className="w-4 h-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="w-4 h-4" />
              All Visits ({siteVisits.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="mt-4">
            <SiteVisitCalendar
              activities={store.activities}
              leads={store.leads}
              projects={store.projects}
            />
          </TabsContent>

          <TabsContent value="list" className="mt-4">
            <div className="space-y-4">
              {/* Filter chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1 scrollbar-none">
                {(["all", "upcoming", "completed", "missed"] as const).map((f) => {
                  const count =
                    f === "all" ? siteVisits.length
                    : f === "upcoming" ? upcoming.length
                    : f === "completed" ? completed.length
                    : missed.length;
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setListFilter(f)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all ${
                        listFilter === f
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/60 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {f !== "all" && (
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_STYLES[f].dot}`} />
                      )}
                      {f === "all" ? "All" : STATUS_STYLES[f].label}
                      <span className={listFilter === f ? "text-primary-foreground/70" : "text-muted-foreground/50"}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Visit cards */}
              {filteredVisits.length === 0 ? (
                <div className="text-center py-16">
                  <CalendarDays className="w-12 h-12 mx-auto text-muted-foreground/20 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {listFilter === "all"
                      ? "No site visits yet. Schedule one using the button above."
                      : `No ${STATUS_STYLES[listFilter as VisitStatus].label.toLowerCase()} visits.`}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredVisits.map((visit) => {
                    const lead = leadMap.get(visit.lead_id);
                    const project = visit.site_visit_feedback?.project_id
                      ? projectMap.get(visit.site_visit_feedback.project_id)
                      : null;
                    const visitDate = visit.scheduled_for || visit.created_at;
                    const status = getVisitStatus(visit);
                    const style = STATUS_STYLES[status];
                    const StatusIcon = style.icon;

                    return (
                      <div
                        key={visit.id}
                        className={`group border border-t-2 p-3 sm:p-4 transition-all ${style.card}`}
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          {/* Date block */}
                          <div className="shrink-0 text-center w-10 sm:w-14">
                            <p className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase">
                              {format(new Date(visitDate), "MMM")}
                            </p>
                            <p className="text-lg sm:text-2xl font-bold leading-tight">
                              {format(new Date(visitDate), "d")}
                            </p>
                            <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                              {format(new Date(visitDate), "EEE")}
                            </p>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <Badge variant="secondary" className={`text-[10px] px-2 py-0 gap-1 font-semibold ${style.badge}`}>
                                <StatusIcon className="w-3 h-3" />
                                <span className="hidden xs:inline">{style.label}</span>
                                <span className="xs:hidden">{style.label[0]}</span>
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {format(new Date(visitDate), "h:mm a")}
                              </span>
                            </div>

                            {/* Lead */}
                            {lead ? (
                              <Link
                                href={`/leads/${lead.id}`}
                                className="group/lead flex items-center gap-2 mb-1"
                              >
                                <div className="w-7 h-7 bg-background border flex items-center justify-center shrink-0 hidden sm:flex">
                                  <User className="w-3 h-3 text-muted-foreground" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold truncate group-hover/lead:text-primary transition-colors">
                                    {lead.name}
                                  </p>
                                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                    <Phone className="w-2.5 h-2.5" />
                                    {lead.phone}
                                  </p>
                                </div>
                                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/0 group-hover/lead:text-muted-foreground/60 transition-all shrink-0 ml-auto hidden sm:block" />
                              </Link>
                            ) : (
                              <p className="text-sm text-muted-foreground">Unknown lead</p>
                            )}

                            {/* Project + notes */}
                            <div className="flex items-center gap-3 mt-1 sm:pl-9">
                              {project && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <MapPin className="w-3 h-3 shrink-0" />
                                  <span className="truncate">{project.name}</span>
                                </span>
                              )}
                              {visit.description && !project && (
                                <span className="text-xs text-muted-foreground truncate">
                                  {visit.description}
                                </span>
                              )}
                            </div>

                            {/* Complete button for upcoming/missed */}
                            {status !== "completed" && (
                              <div className="mt-2 sm:pl-9">
                                <CompleteVisitDialog
                                  activityId={visit.id}
                                  projectId={visit.site_visit_feedback?.project_id || ""}
                                  properties={store.properties.filter((p) =>
                                    !visit.site_visit_feedback?.project_id || p.project_id === visit.site_visit_feedback.project_id
                                  )}
                                />
                              </div>
                            )}

                            {/* Show feedback for completed visits */}
                            {status === "completed" && visit.site_visit_feedback?.feedback && (
                              <div className="mt-2 sm:pl-9 p-2 bg-emerald-500/5 border border-emerald-500/10 text-xs">
                                <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-0.5">
                                  Rating: {visit.site_visit_feedback.rating}/5
                                  {visit.site_visit_feedback.plots_shown.length > 0 && ` · ${visit.site_visit_feedback.plots_shown.length} plots shown`}
                                  {visit.site_visit_feedback.attendees.length > 0 && ` · ${visit.site_visit_feedback.attendees.length} attendees`}
                                </p>
                                <p className="text-muted-foreground">{visit.site_visit_feedback.feedback}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
