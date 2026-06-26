"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AnimatedCounter } from "@/components/dashboard/animated-counter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  MapPin,
  Building2,
  FileText,
  CheckCircle2,
  Circle,
  Clock,
  XCircle,
  ChevronRight,
  Landmark,
  Users,
  ArrowRightLeft,
  ClipboardCheck,
} from "lucide-react";
import { useDemoStore } from "@/lib/demo-store";
import {
  formatCurrency,
  PROJECT_COMPLIANCE_CHECKLIST,
  BUYER_DOCUMENT_CHECKLIST,
  TRANSACTION_DOCUMENT_CHECKLIST,
} from "@/lib/constants";
import type { ComplianceChecklistItem } from "@/lib/constants";

const STAGE_LABELS: Record<string, { label: string; color: string }> = {
  setup:        { label: "Project Setup",  color: "text-blue-600 dark:text-blue-400" },
  marketing:    { label: "Marketing",      color: "text-primary" },
  booking:      { label: "Booking",        color: "text-amber-600 dark:text-amber-400" },
  registration: { label: "Registration",   color: "text-orange-600 dark:text-orange-400" },
  possession:   { label: "Possession",     color: "text-emerald-600 dark:text-emerald-400" },
  ongoing:      { label: "Ongoing",        color: "text-teal-600 dark:text-teal-400" },
};

const STAGE_ORDER = ["setup", "marketing", "booking", "registration", "possession", "ongoing"];

function ChecklistSection({
  items,
  uploadedTypes,
  title,
  icon,
}: {
  items: ComplianceChecklistItem[];
  uploadedTypes: Set<string>;
  title: string;
  icon: React.ReactNode;
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, ComplianceChecklistItem[]>();
    for (const item of items) {
      const existing = map.get(item.stage) || [];
      existing.push(item);
      map.set(item.stage, existing);
    }
    return STAGE_ORDER
      .filter((s) => map.has(s))
      .map((s) => ({ stage: s, items: map.get(s)! }));
  }, [items]);

  const total = items.filter((i) => i.mandatory).length;
  const done = items.filter((i) => i.mandatory && uploadedTypes.has(i.document_type)).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {icon}
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {done}/{total} mandatory
          </span>
          <div className="w-24 h-2 bg-muted overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs font-medium w-8 text-right">{pct}%</span>
        </div>
      </div>

      {grouped.map(({ stage, items: stageItems }) => {
        const stageInfo = STAGE_LABELS[stage];
        return (
          <div key={stage} className="space-y-1.5">
            <div className="flex items-center gap-2 py-1">
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              <span className={`text-xs font-semibold uppercase tracking-wider ${stageInfo.color}`}>
                {stageInfo.label}
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {stageItems.map((item) => {
                const uploaded = uploadedTypes.has(item.document_type);
                return (
                  <div
                    key={`${item.document_type}-${item.stage}`}
                    className={`flex items-start gap-3 p-3 border transition-colors ${
                      uploaded
                        ? "border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/10"
                        : item.mandatory
                          ? "border-amber-500/20 bg-amber-50/30 dark:bg-amber-950/5"
                          : "border-muted bg-muted/20"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {uploaded ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : item.mandatory ? (
                        <Circle className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground/40" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium leading-tight">{item.label}</p>
                        {item.mandatory && !uploaded && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-amber-600 border-amber-400 dark:text-amber-400">
                            Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function VerificationBadge({ status }: { status: string }) {
  switch (status) {
    case "verified":
      return (
        <Badge variant="outline" className="text-emerald-600 border-emerald-500 dark:text-emerald-400 gap-1">
          <CheckCircle2 className="w-3 h-3" /> Verified
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="outline" className="text-red-600 border-red-500 dark:text-red-400 gap-1">
          <XCircle className="w-3 h-3" /> Rejected
        </Badge>
      );
    case "expired":
      return (
        <Badge variant="outline" className="text-orange-600 border-orange-500 dark:text-orange-400 gap-1">
          <Clock className="w-3 h-3" /> Expired
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-amber-600 border-amber-500 dark:text-amber-400 gap-1">
          <Clock className="w-3 h-3" /> Pending
        </Badge>
      );
  }
}

export default function CompliancePage() {
  const store = useDemoStore();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");

  const reraProjects = useMemo(
    () => store.projects.filter((p) => p.rera_number),
    [store.projects]
  );

  const nonReraProjects = useMemo(
    () => store.projects.filter((p) => !p.rera_number),
    [store.projects]
  );

  const projectDocs = useMemo(() => {
    if (selectedProjectId === "all") return store.documents;
    return store.documents.filter((d) => d.project_id === selectedProjectId);
  }, [store.documents, selectedProjectId]);

  const uploadedDocTypes = useMemo(
    () => new Set<string>(projectDocs.map((d) => d.document_type)),
    [projectDocs]
  );

  const totalMandatory = PROJECT_COMPLIANCE_CHECKLIST.filter((i) => i.mandatory).length;
  const completedMandatory = PROJECT_COMPLIANCE_CHECKLIST.filter(
    (i) => i.mandatory && uploadedDocTypes.has(i.document_type)
  ).length;
  const overallPct = totalMandatory > 0 ? Math.round((completedMandatory / totalMandatory) * 100) : 0;

  const verifiedDocs = projectDocs.filter((d) => d.verification_status === "verified").length;
  const pendingDocs = projectDocs.filter((d) => d.verification_status === "pending").length;
  const expiredDocs = projectDocs.filter(
    (d) => d.expiry_date && new Date(d.expiry_date) < new Date()
  ).length;
  const alertCount = nonReraProjects.length + expiredDocs;

  const kpiCards = [
    {
      label: "RERA Registered",
      value: reraProjects.length,
      sub: `of ${store.projects.length} projects`,
      suffix: "",
      icon: ShieldCheck,
      accent: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/20",
      bg: "bg-emerald-500/5",
    },
    {
      label: "Compliance Score",
      value: overallPct,
      sub: `${completedMandatory}/${totalMandatory} mandatory docs`,
      suffix: "%",
      icon: FileCheck,
      accent: "text-primary",
      border: "border-primary/20",
      bg: "bg-primary/5",
    },
    {
      label: "Verified Documents",
      value: verifiedDocs,
      sub: `${pendingDocs} pending review`,
      suffix: "",
      icon: CheckCircle2,
      accent: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/20",
      bg: "bg-blue-500/5",
    },
    {
      label: "Alerts",
      value: alertCount,
      sub: alertCount === 0
        ? "All clear"
        : [
            nonReraProjects.length > 0 && `${nonReraProjects.length} unregistered`,
            expiredDocs > 0 && `${expiredDocs} expired`,
          ].filter(Boolean).join(", "),
      suffix: "",
      icon: AlertTriangle,
      accent: alertCount > 0 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground",
      border: alertCount > 0 ? "border-amber-500/20" : "border-border/50",
      bg: alertCount > 0 ? "bg-amber-500/5" : "",
    },
  ];

  return (
    <>
      <DashboardHeader
        title="Compliance"
        description="Document pipeline, RERA compliance, and regulatory tracking"
      />
      <div className="p-4 space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((card, i) => (
            <div
              key={card.label}
              className={`border ${card.border} ${card.bg} px-4 py-3.5 animate-fade-up`}
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {card.label}
                </p>
                <card.icon className={`w-4 h-4 ${card.accent}`} />
              </div>
              <p className={`text-2xl font-bold tabular-nums ${card.accent}`}>
                <AnimatedCounter value={card.value} suffix={card.suffix} startDelay={i * 70} />
              </p>
              <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-muted-foreground">Viewing compliance for:</label>
          <Select value={selectedProjectId} onValueChange={(v) => v && setSelectedProjectId(v)}>
            <SelectTrigger className="w-[280px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {store.projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name} — {p.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="pipeline">
          <TabsList variant="line">
            <TabsTrigger value="pipeline">
              <ClipboardCheck className="w-4 h-4" />
              Document Pipeline
            </TabsTrigger>
            <TabsTrigger value="registry">
              <ShieldCheck className="w-4 h-4" />
              RERA Registry
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="w-4 h-4" />
              Uploaded Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pipeline">
            <div className="space-y-6 pt-2">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Project Document Pipeline</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Track mandatory land, approval, and compliance documents for your projects
                  </p>
                </CardHeader>
                <CardContent>
                  <ChecklistSection
                    items={PROJECT_COMPLIANCE_CHECKLIST}
                    uploadedTypes={uploadedDocTypes}
                    title="Project Setup & Compliance"
                    icon={<Landmark className="w-4 h-4 text-blue-500" />}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Buyer KYC Checklist</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Documents required from every buyer per RERA and anti-money laundering norms
                  </p>
                </CardHeader>
                <CardContent>
                  <ChecklistSection
                    items={BUYER_DOCUMENT_CHECKLIST}
                    uploadedTypes={uploadedDocTypes}
                    title="Buyer Identity & Verification"
                    icon={<Users className="w-4 h-4 text-primary" />}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Transaction Document Pipeline</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Documents generated during sale — from booking through registration to possession
                  </p>
                </CardHeader>
                <CardContent>
                  <ChecklistSection
                    items={TRANSACTION_DOCUMENT_CHECKLIST}
                    uploadedTypes={uploadedDocTypes}
                    title="Sale Lifecycle Documents"
                    icon={<ArrowRightLeft className="w-4 h-4 text-orange-500" />}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="registry">
            <div className="space-y-6 pt-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">RERA Project Registry</CardTitle>
                </CardHeader>
                <CardContent>
                  {reraProjects.length === 0 ? (
                    <div className="text-center py-8">
                      <ShieldCheck className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-sm text-muted-foreground">
                        No projects with RERA numbers yet. Add RERA numbers in the Inventory module.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reraProjects.map((project) => {
                        const propCount = store.properties.filter(
                          (p) => p.project_id === project.id
                        ).length;
                        const soldCount = store.properties.filter(
                          (p) => p.project_id === project.id && p.status === "sold"
                        ).length;
                        const projDocs = store.documents.filter(
                          (d) => d.project_id === project.id
                        );
                        const projMandatory = PROJECT_COMPLIANCE_CHECKLIST.filter((i) => i.mandatory);
                        const projDocTypes = new Set<string>(projDocs.map((d) => d.document_type));
                        const projDone = projMandatory.filter((i) => projDocTypes.has(i.document_type)).length;
                        const projPct = projMandatory.length > 0
                          ? Math.round((projDone / projMandatory.length) * 100)
                          : 0;

                        return (
                          <div
                            key={project.id}
                            className="flex items-start justify-between p-4 border bg-card"
                          >
                            <div className="space-y-1.5 flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold">{project.name}</h3>
                                <Badge variant="outline" className="text-emerald-600 border-emerald-500 dark:text-emerald-400">
                                  RERA Registered
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {project.location}, {project.city}, {project.state}
                              </p>
                              <div className="flex gap-4 text-xs text-muted-foreground pt-0.5">
                                <span>
                                  <span className="font-medium text-foreground">RERA:</span>{" "}
                                  {project.rera_number}
                                </span>
                                {project.rera_state && (
                                  <span>
                                    <span className="font-medium text-foreground">State:</span>{" "}
                                    {project.rera_state}
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-4 text-xs text-muted-foreground">
                                <span>{propCount} units</span>
                                <span>{soldCount} sold</span>
                                <span>
                                  {project.price_range_min && project.price_range_max
                                    ? `${formatCurrency(project.price_range_min)} – ${formatCurrency(project.price_range_max)}`
                                    : "—"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 pt-1">
                                <div className="w-32 h-1.5 bg-muted overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-500 transition-all"
                                    style={{ width: `${projPct}%` }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {projDone}/{projMandatory.length} docs ({projPct}%)
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              nativeButton={false}
                              render={<Link href="/inventory" />}
                            >
                              <Building2 className="w-3 h-3 mr-1" />
                              Inventory
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {nonReraProjects.length > 0 && (
                <Card className="border-amber-500/30">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2 text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="w-4 h-4" />
                      Projects Without RERA Registration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {nonReraProjects.map((project) => (
                        <div
                          key={project.id}
                          className="flex items-center justify-between p-3 border border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/10"
                        >
                          <div>
                            <p className="font-medium text-sm">{project.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {project.location}, {project.city}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-amber-600 border-amber-500 dark:text-amber-400">
                            No RERA
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      As per RERA Act 2016, all projects with more than 8 units or over 500 sq.m. must be registered before marketing or selling.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <div className="space-y-4 pt-2">
              {projectDocs.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No documents uploaded yet. Go to the Documents module to upload project documents.
                    </p>
                    <Button variant="outline" size="sm" className="mt-4" nativeButton={false} render={<Link href="/documents" />}>
                      <FileText className="w-4 h-4 mr-1" />
                      Go to Documents
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Uploaded Documents ({projectDocs.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {projectDocs.map((doc) => {
                        const project = doc.project_id
                          ? store.projects.find((p) => p.id === doc.project_id)
                          : null;
                        return (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-3 border bg-card"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{doc.name}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  {project && <span>{project.name}</span>}
                                  <span>{new Date(doc.created_at).toLocaleDateString("en-IN")}</span>
                                  {doc.expiry_date && (
                                    <span className={new Date(doc.expiry_date) < new Date() ? "text-red-500" : ""}>
                                      Expires: {new Date(doc.expiry_date).toLocaleDateString("en-IN")}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <VerificationBadge status={doc.verification_status} />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
