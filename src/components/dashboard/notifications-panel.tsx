"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Bell, AlertTriangle, Clock, UserX, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getNotifications } from "@/lib/demo-store";
import { useDemoStore } from "@/lib/demo-store";
import { NOTIFICATION_TYPE_LABELS } from "@/lib/constants";
import type { DashboardNotification } from "@/types/database";

const TYPE_ICONS: Record<string, typeof Bell> = {
  overdue_followup: Clock,
  stale_lead: AlertTriangle,
  unassigned_lead: UserX,
  overdue_payment: IndianRupee,
};

const PRIORITY_STYLES: Record<string, string> = {
  high: "border-l-red-500 bg-red-500/5",
  medium: "border-l-amber-500 bg-amber-500/5",
  low: "border-l-blue-500 bg-blue-500/5",
};

function NotificationItem({ notification }: { notification: DashboardNotification }) {
  const Icon = TYPE_ICONS[notification.type] || Bell;

  return (
    <Link
      href={notification.href}
      className={`block p-3 border-l-4 rounded-r-lg hover:bg-foreground/[0.03] transition-colors ${PRIORITY_STYLES[notification.priority]}`}
    >
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 shrink-0">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-snug">{notification.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{notification.description}</p>
          <Badge variant="outline" className="mt-1.5 text-[10px] px-1.5 py-0">
            {NOTIFICATION_TYPE_LABELS[notification.type]}
          </Badge>
        </div>
      </div>
    </Link>
  );
}

export function NotificationsPanel() {
  const store = useDemoStore();

  const notifications = useMemo(
    () => getNotifications(),
    [store.leads, store.paymentSchedules]
  );

  const count = notifications.length;
  const highCount = notifications.filter((n) => n.priority === "high").length;

  return (
    <Sheet>
      <SheetTrigger render={
        <Button variant="ghost" size="icon" className="relative h-8 w-8" />
      }>
        <Bell className="w-4 h-4" />
        {count > 0 && (
          <span className={`absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1 text-white ${highCount > 0 ? "bg-red-500" : "bg-amber-500"}`}>
            {count}
          </span>
        )}
      </SheetTrigger>
      <SheetContent className="w-[380px] sm:w-[420px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Notifications
            {count > 0 && (
              <Badge variant="secondary" className="text-xs">{count}</Badge>
            )}
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-80px)] mt-4">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-10 h-10 mx-auto text-muted-foreground/20 mb-3" />
              <p className="text-sm text-muted-foreground">All clear — no pending items</p>
            </div>
          ) : (
            <div className="space-y-2 pr-2">
              {notifications.map((n) => (
                <NotificationItem key={n.id} notification={n} />
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
