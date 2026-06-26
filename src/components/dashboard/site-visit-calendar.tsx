"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  isToday,
  getDay,
  isPast as dateIsPast,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  User,
  Clock,
  Check,
  AlertCircle,
  CalendarDays,
  ExternalLink,
  Phone,
} from "lucide-react";
import type { Activity, Lead, Project } from "@/types/database";

interface SiteVisitCalendarProps {
  activities: Activity[];
  leads: Lead[];
  projects: Project[];
}

const DAY_NAMES_SHORT = ["M", "T", "W", "T", "F", "S", "S"];
const DAY_NAMES_FULL = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type VisitStatus = "upcoming" | "completed" | "missed";

function getVisitStatus(visit: Activity): VisitStatus {
  if (visit.is_completed) return "completed";
  if (visit.scheduled_for && new Date(visit.scheduled_for) < new Date()) return "missed";
  return "upcoming";
}

const STATUS_CONFIG: Record<VisitStatus, {
  label: string;
  dotCls: string;
  cardCls: string;
  badgeCls: string;
  icon: typeof Check;
}> = {
  upcoming: {
    label: "Upcoming",
    dotCls: "bg-violet-500",
    cardCls: "bg-violet-500/8 hover:bg-violet-500/15 border-violet-500/20 text-violet-700 dark:text-violet-300",
    badgeCls: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
    icon: Clock,
  },
  completed: {
    label: "Completed",
    dotCls: "bg-emerald-500",
    cardCls: "bg-emerald-500/8 hover:bg-emerald-500/15 border-emerald-500/20 text-emerald-700 dark:text-emerald-300",
    badgeCls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    icon: Check,
  },
  missed: {
    label: "Missed",
    dotCls: "bg-amber-500",
    cardCls: "bg-amber-500/8 hover:bg-amber-500/15 border-amber-500/20 text-amber-700 dark:text-amber-300",
    badgeCls: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    icon: AlertCircle,
  },
};

export function SiteVisitCalendar({
  activities,
  leads,
  projects,
}: SiteVisitCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const siteVisits = useMemo(
    () =>
      activities
        .filter((a) => a.activity_type === "site_visit" && a.scheduled_for)
        .sort((a, b) => new Date(a.scheduled_for!).getTime() - new Date(b.scheduled_for!).getTime()),
    [activities]
  );

  const leadMap = useMemo(() => {
    const map = new Map<string, Lead>();
    leads.forEach((l) => map.set(l.id, l));
    return map;
  }, [leads]);

  const projectMap = useMemo(() => {
    const map = new Map<string, Project>();
    projects.forEach((p) => map.set(p.id, p));
    return map;
  }, [projects]);

  const monthVisits = useMemo(
    () =>
      siteVisits.filter((v) => {
        const d = new Date(v.scheduled_for!);
        return d >= calStart && d <= calEnd;
      }),
    [siteVisits, calStart, calEnd]
  );

  const selectedDayVisits = useMemo(
    () =>
      siteVisits.filter(
        (v) => v.scheduled_for && isSameDay(new Date(v.scheduled_for), selectedDay)
      ),
    [siteVisits, selectedDay]
  );

  const visitCountByDay = useMemo(() => {
    const map = new Map<string, number>();
    monthVisits.forEach((v) => {
      const key = format(new Date(v.scheduled_for!), "yyyy-MM-dd");
      map.set(key, (map.get(key) || 0) + 1);
    });
    return map;
  }, [monthVisits]);

  const upcomingCount = monthVisits.filter((v) => getVisitStatus(v) === "upcoming").length;
  const completedCount = monthVisits.filter((v) => getVisitStatus(v) === "completed").length;
  const missedCount = monthVisits.filter((v) => getVisitStatus(v) === "missed").length;

  const handleDayClick = useCallback((day: Date) => {
    setSelectedDay(day);
    if (!isSameMonth(day, currentDate)) {
      setCurrentDate(day);
    }
  }, [currentDate]);

  const goToToday = useCallback(() => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDay(today);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-5">
      {/* Calendar panel */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h3 className="text-base sm:text-lg font-semibold tracking-tight whitespace-nowrap">
                {format(currentDate, "MMM yyyy")}
              </h3>
              {/* Month stats pills — hidden on small mobile */}
              <div className="hidden sm:flex items-center gap-1.5">
                {upcomingCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium rounded-full px-2 py-0.5 bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    {upcomingCount}
                  </span>
                )}
                {completedCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium rounded-full px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {completedCount}
                  </span>
                )}
                {missedCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium rounded-full px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    {missedCount}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 sm:h-8 px-2 sm:px-3 text-[11px] sm:text-xs font-medium rounded-full"
              onClick={goToToday}
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7">
          {DAY_NAMES_FULL.map((day, i) => (
            <div
              key={day}
              className={`py-1.5 sm:py-2.5 text-center text-[11px] font-semibold uppercase tracking-widest ${
                i >= 5 ? "text-rose-400/60 dark:text-rose-400/40" : "text-muted-foreground/70"
              }`}
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{DAY_NAMES_SHORT[i]}</span>
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 rounded-lg sm:rounded-xl overflow-hidden border border-border/60">
          {days.map((day, idx) => {
            const dayKey = format(day, "yyyy-MM-dd");
            const count = visitCountByDay.get(dayKey) || 0;
            const today = isToday(day);
            const inMonth = isSameMonth(day, currentDate);
            const isWeekend = getDay(day) === 0 || getDay(day) === 6;
            const isSelected = isSameDay(day, selectedDay);
            const past = dateIsPast(day) && !today;

            const dayVisits = count > 0
              ? siteVisits.filter((v) => v.scheduled_for && isSameDay(new Date(v.scheduled_for), day))
              : [];
            const hasUpcoming = dayVisits.some((v) => getVisitStatus(v) === "upcoming");
            const hasCompleted = dayVisits.some((v) => getVisitStatus(v) === "completed");
            const hasMissed = dayVisits.some((v) => getVisitStatus(v) === "missed");

            const showTopBorder = idx >= 7;
            const showLeftBorder = idx % 7 !== 0;

            return (
              <button
                key={dayKey}
                type="button"
                onClick={() => handleDayClick(day)}
                className={[
                  "relative min-h-[52px] sm:min-h-[82px] p-1 sm:p-1.5 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:z-10",
                  showTopBorder ? "border-t border-border/40" : "",
                  showLeftBorder ? "border-l border-border/40" : "",
                  inMonth
                    ? isWeekend
                      ? "bg-muted/20"
                      : "bg-card"
                    : "bg-muted/40",
                  isSelected
                    ? "bg-primary/5 ring-2 ring-inset ring-primary/40 z-10"
                    : "hover:bg-accent/30",
                  past && !isSelected && inMonth ? "opacity-80" : "",
                ].join(" ")}
              >
                {/* Day number */}
                <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                  <span
                    className={[
                      "text-[11px] sm:text-xs font-medium leading-none transition-all",
                      today
                        ? "bg-primary text-primary-foreground w-5 h-5 sm:w-6 sm:h-6 rounded-full inline-flex items-center justify-center font-bold shadow-md shadow-primary/25"
                        : isSelected && inMonth
                          ? "text-primary font-bold"
                          : inMonth
                            ? "text-foreground/80"
                            : "text-muted-foreground/30",
                    ].join(" ")}
                  >
                    {format(day, "d")}
                  </span>
                </div>

                {/* Dot indicators */}
                {count > 0 && (
                  <div className="flex items-center gap-0.5 sm:gap-1 mt-auto">
                    <div className="flex gap-px sm:gap-0.5">
                      {hasUpcoming && <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-violet-500 shadow-sm shadow-violet-500/40" />}
                      {hasCompleted && <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/40" />}
                      {hasMissed && <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500/40" />}
                    </div>
                    {count > 1 && (
                      <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground/60">{count}</span>
                    )}
                  </div>
                )}

                {/* Single visit preview — desktop only */}
                {count === 1 && dayVisits[0] && (
                  <div className="hidden md:block mt-0.5">
                    <span className="text-[10px] leading-none text-muted-foreground/70 truncate block">
                      {leadMap.get(dayVisits[0].lead_id)?.name || "Visit"}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 sm:gap-5 justify-center pt-1">
          {(["upcoming", "completed", "missed"] as VisitStatus[]).map((s) => (
            <div key={s} className="flex items-center gap-1 sm:gap-1.5">
              <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${STATUS_CONFIG[s].dotCls}`} />
              <span className="text-[10px] sm:text-[11px] text-muted-foreground">{STATUS_CONFIG[s].label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <div className="w-full lg:w-80 xl:w-96 shrink-0">
        <div className="lg:sticky lg:top-4 space-y-3">
          {/* Selected day header */}
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">
                    {format(selectedDay, "EEEE")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(selectedDay, "MMMM d, yyyy")}
                  </p>
                </div>
                <div className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary/10 text-primary">
                  <span className="text-base sm:text-lg font-bold leading-none">{format(selectedDay, "d")}</span>
                </div>
              </div>
            </div>

            {/* Visit list for selected day */}
            <div className="p-2.5 sm:p-3">
              {selectedDayVisits.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <CalendarDays className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-muted-foreground/20 mb-2 sm:mb-3" />
                  <p className="text-sm text-muted-foreground/60">
                    No visits on this day
                  </p>
                  <p className="text-xs text-muted-foreground/40 mt-1 hidden sm:block">
                    Click a day with visits to see details
                  </p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-2.5">
                  {selectedDayVisits.map((visit) => {
                    const lead = leadMap.get(visit.lead_id);
                    const project = visit.site_visit_feedback?.project_id
                      ? projectMap.get(visit.site_visit_feedback.project_id)
                      : null;
                    const time = visit.scheduled_for
                      ? format(new Date(visit.scheduled_for), "h:mm a")
                      : "";
                    const status = getVisitStatus(visit);
                    const config = STATUS_CONFIG[status];
                    const StatusIcon = config.icon;

                    return (
                      <div
                        key={visit.id}
                        className={`rounded-lg border p-2.5 sm:p-3 transition-all ${config.cardCls}`}
                      >
                        {/* Status + time row */}
                        <div className="flex items-center justify-between mb-2">
                          <Badge
                            variant="secondary"
                            className={`text-[10px] px-2 py-0.5 gap-1 font-semibold ${config.badgeCls}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {config.label}
                          </Badge>
                          {time && (
                            <span className="text-xs font-medium opacity-70 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {time}
                            </span>
                          )}
                        </div>

                        {/* Lead info */}
                        {lead && (
                          <Link
                            href={`/leads/${lead.id}`}
                            className="group flex items-center gap-2 sm:gap-2.5 mb-2"
                          >
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-background/80 border flex items-center justify-center shrink-0">
                              <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-50" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold truncate group-hover:underline underline-offset-2">
                                {lead.name}
                              </p>
                              <p className="text-[11px] opacity-60 flex items-center gap-1">
                                <Phone className="w-2.5 h-2.5" />
                                {lead.phone}
                              </p>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-opacity shrink-0 hidden sm:block" />
                          </Link>
                        )}

                        {/* Project */}
                        {project && (
                          <div className="flex items-center gap-1.5 text-xs opacity-60 pl-9 sm:pl-[42px]">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">
                              {project.name}{project.location ? `, ${project.location}` : ""}
                            </span>
                          </div>
                        )}

                        {/* Notes */}
                        {visit.description && (
                          <p className="text-[11px] opacity-50 mt-2 pl-9 sm:pl-[42px] line-clamp-2 leading-relaxed">
                            {visit.description}
                          </p>
                        )}

                        {/* Feedback */}
                        {visit.is_completed && visit.site_visit_feedback && visit.site_visit_feedback.rating > 0 && (
                          <div className="flex items-center gap-1 mt-2 pl-9 sm:pl-[42px]">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${
                                  i < visit.site_visit_feedback!.rating
                                    ? "opacity-100"
                                    : "opacity-20"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Quick stats card — inline on mobile, card on desktop */}
          <div className="rounded-xl border bg-card p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 sm:mb-3">
              This Month
            </p>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { count: upcomingCount, label: "Upcoming", color: "text-violet-600 dark:text-violet-400" },
                { count: completedCount, label: "Done", color: "text-emerald-600 dark:text-emerald-400" },
                { count: missedCount, label: "Missed", color: "text-amber-600 dark:text-amber-400" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className={`text-lg sm:text-xl font-bold ${stat.color}`}>{stat.count}</p>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {siteVisits.length === 0 && (
        <div className="col-span-full text-center py-8">
          <CalendarDays className="w-12 h-12 mx-auto text-muted-foreground/20 mb-3" />
          <p className="text-sm text-muted-foreground">
            No site visits scheduled. Schedule visits from lead detail pages or the button above.
          </p>
        </div>
      )}
    </div>
  );
}
