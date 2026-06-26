"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getActivitiesForLead, addActivity, useDemoStore } from "@/lib/demo-store";
import { ACTIVITY_TYPE_STYLES } from "@/lib/constants";
import type { Activity, ActivityType } from "@/types/database";
import {
  Phone,
  MessageSquare,
  MapPin,
  FileText,
  Mail,
  Users,
  Bell,
  Clock,
  Share2,
} from "lucide-react";

const ACTIVITY_ICONS: Record<ActivityType, React.ElementType> = {
  call: Phone,
  whatsapp: MessageSquare,
  site_visit: MapPin,
  note: FileText,
  email: Mail,
  meeting: Users,
  follow_up: Bell,
  property_shared: Share2,
};

const ACTIVITY_LABELS: Record<ActivityType, string> = {
  call: "Phone Call",
  whatsapp: "WhatsApp",
  site_visit: "Site Visit",
  note: "Note",
  email: "Email",
  meeting: "Meeting",
  follow_up: "Follow-up",
  property_shared: "Property Shared",
};


interface LeadActivitiesProps {
  leadId: string;
}

export function LeadActivities({ leadId }: LeadActivitiesProps) {
  const store = useDemoStore();
  const activities = useMemo(() => getActivitiesForLead(leadId), [store.activities, leadId]);
  const lead = useMemo(() => store.leads.find((l) => l.id === leadId), [store.leads, leadId]);

  const [type, setType] = useState<ActivityType>("call");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleAddActivity(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;
    setSubmitting(true);
    addActivity({
      lead_id: leadId,
      activity_type: type,
      description: description.trim(),
      created_by: "u1",
    });
    setDescription("");
    setSubmitting(false);
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  }

  function getQuickAction(type: ActivityType) {
    if (type === "call" && lead) {
      return (
        <a
          href={`tel:${lead.phone}`}
          className="text-xs text-primary hover:underline ml-2"
        >
          Call {lead.phone}
        </a>
      );
    }
    if (type === "whatsapp" && lead) {
      return (
        <a
          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-emerald-500 hover:underline ml-2"
        >
          Open WhatsApp
        </a>
      );
    }
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Activity Log Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Log Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddActivity} className="space-y-3">
            <div className="flex gap-2">
              <Select value={type} onValueChange={(v) => v && setType(v as ActivityType)}>
                <SelectTrigger className="w-[160px]" aria-label="Activity type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ACTIVITY_LABELS).map(([val, label]) => (
                    <SelectItem key={val} value={val}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {getQuickAction(type)}
            <Textarea
              aria-label="Activity description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                type === "call"
                  ? "Describe the call outcome..."
                  : type === "whatsapp"
                    ? "What was discussed on WhatsApp..."
                    : type === "site_visit"
                      ? "Details about the site visit..."
                      : "Add notes..."
              }
              rows={2}
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm" disabled={submitting || !description.trim()}>
                Add {ACTIVITY_LABELS[type]}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Activity History ({activities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No activities logged yet.
            </p>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => {
                const Icon = ACTIVITY_ICONS[activity.activity_type] || FileText;
                return (
                  <div
                    key={activity.id}
                    className="flex gap-3 pb-4 border-b last:border-0 last:pb-0"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        ACTIVITY_TYPE_STYLES[activity.activity_type]?.icon || "bg-muted"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {ACTIVITY_LABELS[activity.activity_type]}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(activity.created_at)}
                        </span>
                        {activity.creator && (
                          <span className="text-xs text-muted-foreground">
                            by {activity.creator.full_name}
                          </span>
                        )}
                      </div>
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
