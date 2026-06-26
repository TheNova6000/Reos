"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Check, Users } from "lucide-react";
import { useDemoStore, updateSettings } from "@/lib/demo-store";
import { demoUsers } from "@/lib/demo-data";

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

  return (
    <>
      <DashboardHeader title="Settings" description="System configuration" />
      <div className="p-4">
        <Tabs defaultValue="company">
          <TabsList>
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

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
                      Applied to property transactions above ₹50 lakhs (Section 194-IA)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primary_color">Brand Color</Label>
                    <Input
                      id="primary_color"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-9"
                    />
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
                      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${
                        autoAssign ? "translate-x-5" : "translate-x-0.5"
                      } mt-0.5`} />
                    </button>
                    <span className="text-sm text-muted-foreground">
                      {autoAssign ? "New leads auto-assigned to agent with fewest active leads" : "Disabled — leads must be assigned manually"}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  {saved && (
                    <span className="flex items-center gap-1 text-sm text-emerald-600">
                      <Check className="w-4 h-4" /> Saved
                    </span>
                  )}
                  <Button onClick={handleSave}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Current Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Company</p>
                    <p className="font-medium">{store.settings.company_name}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">TDS Rate</p>
                    <p className="font-medium">{store.settings.tds_percentage}%</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Currency</p>
                    <p className="font-medium">{store.settings.currency_symbol} (INR)</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Projects</p>
                    <p className="font-medium">{store.projects.length}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Properties</p>
                    <p className="font-medium">{store.properties.length}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Leads</p>
                    <p className="font-medium">{store.leads.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Team Members</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {demoUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.full_name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                      {user.role}
                    </Badge>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground pt-2">
                  User management will be available once Supabase Auth is connected.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Integrations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">WhatsApp Business API</p>
                    <p className="text-xs text-muted-foreground">Connect WhatsApp for customer communication</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Google Maps API</p>
                    <p className="text-xs text-muted-foreground">Property location and map features</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Supabase</p>
                    <p className="text-xs text-muted-foreground">Database, auth, and file storage</p>
                  </div>
                  <Badge variant="outline">Placeholder</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">99acres / MagicBricks</p>
                    <p className="text-xs text-muted-foreground">Import leads from listing portals</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>Coming Soon</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
