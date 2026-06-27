"use client";

import { useState, useActionState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
  Check, Users, Building2, MessageSquare, MapPin, Database, ExternalLink,
  Home, IndianRupee, UserPlus, Mail,
} from "lucide-react";
import { useDemoStore, updateSettings } from "@/lib/demo-store";
import { demoUsers } from "@/lib/demo-data";
import { inviteTeamMember, type InviteState } from "@/app/actions/auth";

const ROLE_STYLES: Record<string, string> = {
  admin: "bg-primary/10 text-primary border-primary/30",
  agent: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
  manager: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
};

const INTEGRATION_ITEMS = [
  {
    name: "WhatsApp Business API",
    description: "Connect WhatsApp for customer communication",
    icon: MessageSquare,
    status: "available" as const,
  },
  {
    name: "Google Maps API",
    description: "Property location and map features",
    icon: MapPin,
    status: "available" as const,
  },
  {
    name: "Supabase",
    description: "Database, auth, and file storage",
    icon: Database,
    status: "connected" as const,
  },
  {
    name: "99acres / MagicBricks",
    description: "Import leads from listing portals",
    icon: ExternalLink,
    status: "coming_soon" as const,
  },
];

export default function SettingsPage() {
  const store = useDemoStore();
  const [saved, setSaved] = useState(false);

  const [companyName, setCompanyName] = useState(store.settings.company_name);
  const [companyPhone, setCompanyPhone] = useState(store.settings.company_phone || "");
  const [companyEmail, setCompanyEmail] = useState(store.settings.company_email || "");
  const [companyWebsite, setCompanyWebsite] = useState(store.settings.company_website || "");
  const [companyAddress, setCompanyAddress] = useState(store.settings.company_address || "");
  const [tdsPercentage, setTdsPercentage] = useState(store.settings.tds_percentage.toString());
  const [primaryColor, setPrimaryColor] = useState(store.settings.primary_color);
  const [autoAssign, setAutoAssign] = useState(store.settings.auto_assign_leads || false);

  function handleSave() {
    updateSettings({
      company_name: companyName,
      company_phone: companyPhone || null,
      company_email: companyEmail || null,
      company_website: companyWebsite || null,
      company_address: companyAddress || null,
      tds_percentage: parseFloat(tdsPercentage) || 1,
      primary_color: primaryColor,
      auto_assign_leads: autoAssign,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const systemStats = [
    { label: "Projects", value: store.projects.length, icon: Building2, accent: "text-primary" },
    { label: "Properties", value: store.properties.length, icon: Home, accent: "text-blue-600 dark:text-blue-400" },
    { label: "Leads", value: store.leads.length, icon: Users, accent: "text-rose-600 dark:text-rose-400" },
    { label: "TDS Rate", value: `${store.settings.tds_percentage}%`, icon: IndianRupee, accent: "text-amber-600 dark:text-amber-400" },
    { label: "Currency", value: `${store.settings.currency_symbol} (INR)`, icon: IndianRupee, accent: "text-emerald-600 dark:text-emerald-400" },
    { label: "Company", value: store.settings.company_name, icon: Building2, accent: "text-foreground" },
  ];

  return (
    <>
      <DashboardHeader title="Settings" description="System configuration" />
      <div className="p-4">
        <Tabs defaultValue="company">
          <TabsList variant="line">
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="users">
              <Users className="w-4 h-4" />
              Team ({demoUsers.length})
            </TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          {/* Company Tab */}
          <TabsContent value="company" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_phone">Phone</Label>
                    <Input
                      id="company_phone"
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      placeholder="+91 93912 38940"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_email">Email</Label>
                    <Input
                      id="company_email"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      placeholder="info@visioninfra.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_website">Website</Label>
                    <Input
                      id="company_website"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      placeholder="https://visioninfra.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_address">Address</Label>
                  <Input
                    id="company_address"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    placeholder="Full office address"
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tds_percentage">TDS Percentage (%)</Label>
                    <Input
                      id="tds_percentage"
                      type="number"
                      value={tdsPercentage}
                      onChange={(e) => setTdsPercentage(e.target.value)}
                      step="0.01"
                    />
                    <p className="text-xs text-muted-foreground">
                      Applied to transactions above ₹50 lakhs (Section 194-IA)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primary_color">Brand Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="primary_color"
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="h-9 w-16 p-1 cursor-pointer"
                      />
                      <span className="text-sm text-muted-foreground font-mono">{primaryColor}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="auto_assign">Auto-assign New Leads</Label>
                  <div className="flex items-center gap-3">
                    <button
                      id="auto_assign"
                      type="button"
                      role="switch"
                      aria-checked={autoAssign}
                      onClick={() => setAutoAssign(!autoAssign)}
                      className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                        autoAssign ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform mt-0.5 ${
                          autoAssign ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                    <span className="text-sm text-muted-foreground">
                      {autoAssign
                        ? "Auto-assigned to agent with fewest active leads"
                        : "Disabled — assign manually"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end items-center gap-3">
                  {saved && (
                    <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 font-medium animate-fade-up">
                      <Check className="w-4 h-4" /> Saved
                    </span>
                  )}
                  <Button onClick={handleSave}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>

            {/* System Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">System Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {systemStats.map((stat) => (
                    <div key={stat.label} className="border border-border/50 bg-muted/30 px-3 py-2.5">
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                        {stat.label}
                      </p>
                      <p className={`text-sm font-bold truncate ${stat.accent}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Team Members</CardTitle>
                <InviteDialog tenantId={store.tenantId} />
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Show current user first if logged in */}
                {store.currentUser && (
                  <div className="flex items-center justify-between p-3 border-2 border-primary/20 bg-primary/5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">
                          {store.currentUser.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{store.currentUser.full_name} <span className="text-xs text-muted-foreground font-normal">(you)</span></p>
                        <p className="text-xs text-muted-foreground">{store.currentUser.email}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-xs capitalize ${ROLE_STYLES[store.currentUser.role] || ""}`}>
                      {store.currentUser.role}
                    </Badge>
                  </div>
                )}
                {demoUsers
                  .filter((u) => !store.currentUser || u.id !== store.currentUser.id)
                  .map((user) => {
                    const initials = user.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();
                    return (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 border border-border/50 hover:border-border transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-primary">{initials}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{user.full_name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize ${ROLE_STYLES[user.role] || ""}`}
                        >
                          {user.role}
                        </Badge>
                      </div>
                    );
                  })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Integrations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {INTEGRATION_ITEMS.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    {item.status === "connected" ? (
                      <Badge variant="outline" className="text-emerald-600 border-emerald-500 dark:text-emerald-400 gap-1 text-xs">
                        <Check className="w-3 h-3" /> Connected
                      </Badge>
                    ) : item.status === "coming_soon" ? (
                      <Button variant="outline" size="sm" disabled className="text-xs">
                        Coming Soon
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="text-xs">
                        Configure
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function InviteDialog({ tenantId }: { tenantId: string | null }) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("agent");
  const initialState: InviteState = {};
  const [state, formAction, pending] = useActionState(inviteTeamMember, initialState);

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); }}>
      <DialogTrigger render={<Button size="sm" />}>
        <UserPlus className="w-4 h-4 mr-1" />
        Invite Member
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
        </DialogHeader>
        {state.success ? (
          <div className="text-center space-y-3 py-4">
            <div className="mx-auto w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center rounded-full">
              <Mail className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-sm font-medium">Invitation sent!</p>
            <p className="text-xs text-muted-foreground">A password reset email has been sent so they can set their own password.</p>
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Done</Button>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="tenant_id" value={tenantId || ""} />
            <input type="hidden" name="role" value={role} />
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input name="full_name" placeholder="Agent name" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input name="email" type="email" placeholder="agent@company.com" required />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input name="phone" type="tel" placeholder="+91 98765 43210" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => v && setRole(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin — Full access</SelectItem>
                  <SelectItem value="agent">Agent — Manage leads & properties</SelectItem>
                  <SelectItem value="viewer">Viewer — Read-only access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {state.error && (
              <p className="text-sm text-destructive font-medium">{state.error}</p>
            )}
            <Button type="submit" className="w-full" disabled={pending || !tenantId}>
              {pending ? "Sending invite..." : "Send Invite"}
            </Button>
            {!tenantId && (
              <p className="text-xs text-muted-foreground text-center">
                Sign in with Supabase to invite team members.
              </p>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
