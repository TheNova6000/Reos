"use client";

import { useState, useMemo, useCallback } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutMap } from "@/components/dashboard/layout-map";
import {
  Search,
  Grid3X3,
  List,
  MapIcon,
  MapPin,
  Maximize2,
  Crosshair,
  Building2,
  Pencil,
  Trash2,
  Download,
  IndianRupee,
  CheckCircle,
  Home,
} from "lucide-react";
import {
  PROPERTY_STATUS_LABELS,
  PROPERTY_STATUS_STYLES,
  PROPERTY_FACING_LABELS,
  formatCurrency,
  formatArea,
} from "@/lib/constants";
import {
  useDemoStore,
  updatePropertyStatus,
  updateProject,
  updateProperty,
  deleteProject,
  deleteProperty,
  deleteProperties,
  updatePropertiesStatus,
} from "@/lib/demo-store";
import { AnimatedCounter } from "@/components/dashboard/animated-counter";

function formatLakh(v: number): string {
  if (v >= 10000000) return `${(v / 10000000).toFixed(1)}Cr`;
  if (v >= 100000) return `${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return String(Math.round(v));
}
import { ImageUpload } from "@/components/dashboard/image-upload";
import { CSVImportDialog } from "@/components/dashboard/csv-import-dialog";
import { PropertiesMapDynamic } from "@/components/dashboard/properties-map-dynamic";
import { AddProjectDialog } from "@/components/dashboard/add-project-dialog";
import { AddPropertyDialog } from "@/components/dashboard/add-property-dialog";
import { uploadProjectImage, uploadPropertyImage } from "@/lib/supabase/storage";
import type { Property, Project, PropertyStatus, PropertyFacing, PropertyType, AreaUnit } from "@/types/database";

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${PROPERTY_STATUS_STYLES[status]?.badge || ""}`}>
      {PROPERTY_STATUS_LABELS[status] || status}
    </span>
  );
}

function StatusChangeCell({ property }: { property: Property }) {
  return (
    <Select
      value={property.status}
      onValueChange={(v) => v && updatePropertyStatus(property.id, v as PropertyStatus)}
    >
      <SelectTrigger className="h-7 text-xs w-[130px] border-0 bg-transparent p-0 focus:ring-0" aria-label={`Change status for ${property.plot_number}`}>
        <StatusBadge status={property.status} />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(PROPERTY_STATUS_LABELS).map(([val, label]) => (
          <SelectItem key={val} value={val}>{label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function EditProjectDialog({
  project, open, onOpenChange,
}: {
  project: Project; open: boolean; onOpenChange: (open: boolean) => void;
}) {
  const [form, setForm] = useState({
    name: project.name, location: project.location, city: project.city,
    state: project.state, rera_number: project.rera_number || "",
    total_units: String(project.total_units), description: project.description || "",
    price_range_min: project.price_range_min ? String(project.price_range_min) : "",
    price_range_max: project.price_range_max ? String(project.price_range_max) : "",
  });
  const [images, setImages] = useState<string[]>(project.images || []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateProject(project.id, {
      name: form.name, location: form.location, city: form.city, state: form.state,
      rera_number: form.rera_number || null, total_units: parseInt(form.total_units),
      description: form.description || null,
      price_range_min: form.price_range_min ? parseInt(form.price_range_min) : null,
      price_range_max: form.price_range_max ? parseInt(form.price_range_max) : null,
      images, thumbnail: images[0] || null,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit {project.name}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="edit-proj-name">Name *</Label><Input id="edit-proj-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="space-y-2"><Label htmlFor="edit-proj-city">City *</Label><Input id="edit-proj-city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="edit-proj-loc">Location *</Label><Input id="edit-proj-loc" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required /></div>
            <div className="space-y-2"><Label htmlFor="edit-proj-state">State</Label><Input id="edit-proj-state" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="edit-proj-rera">RERA Number</Label><Input id="edit-proj-rera" value={form.rera_number} onChange={(e) => setForm({ ...form, rera_number: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="edit-proj-units">Total Units *</Label><Input id="edit-proj-units" type="number" value={form.total_units} onChange={(e) => setForm({ ...form, total_units: e.target.value })} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="edit-proj-pmin">Min Price (₹)</Label><Input id="edit-proj-pmin" type="number" value={form.price_range_min} onChange={(e) => setForm({ ...form, price_range_min: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="edit-proj-pmax">Max Price (₹)</Label><Input id="edit-proj-pmax" type="number" value={form.price_range_max} onChange={(e) => setForm({ ...form, price_range_max: e.target.value })} /></div>
          </div>
          <div className="space-y-2"><Label htmlFor="edit-proj-desc">Description</Label><Textarea id="edit-proj-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
          <div className="space-y-2"><Label>Images</Label><ImageUpload images={images} onImagesChange={setImages} uploadFn={(file) => uploadProjectImage(file, project.id)} /></div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditPropertyDialog({
  property, open, onOpenChange,
}: {
  property: Property; open: boolean; onOpenChange: (open: boolean) => void;
}) {
  const store = useDemoStore();
  const [form, setForm] = useState({
    plot_number: property.plot_number, area: String(property.area),
    area_unit: property.area_unit as AreaUnit, facing: property.facing as PropertyFacing,
    price: String(property.price), property_type: property.property_type as PropertyType,
    dimensions: property.dimensions || "", description: property.description || "",
  });
  const [images, setImages] = useState<string[]>(property.images || []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const area = parseFloat(form.area);
    const price = parseInt(form.price);
    updateProperty(property.id, {
      plot_number: form.plot_number, area, area_unit: form.area_unit, facing: form.facing,
      price, price_per_unit: area > 0 ? Math.round(price / area) : null,
      property_type: form.property_type, dimensions: form.dimensions || null,
      description: form.description || null, images,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit {store.projects.find((p) => p.id === property.project_id)?.name} — {property.plot_number}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="edit-prop-plot">Plot Number *</Label><Input id="edit-prop-plot" value={form.plot_number} onChange={(e) => setForm({ ...form, plot_number: e.target.value })} required /></div>
            <div className="space-y-2"><Label id="edit-prop-type-label">Type</Label>
              <Select value={form.property_type} onValueChange={(v) => v && setForm({ ...form, property_type: v as PropertyType })}><SelectTrigger aria-labelledby="edit-prop-type-label"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="plot">Plot</SelectItem><SelectItem value="apartment">Apartment</SelectItem><SelectItem value="villa">Villa</SelectItem><SelectItem value="commercial">Commercial</SelectItem><SelectItem value="farmland">Farmland</SelectItem></SelectContent></Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2"><Label htmlFor="edit-prop-area">Area *</Label><Input id="edit-prop-area" type="number" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} required /></div>
            <div className="space-y-2"><Label id="edit-prop-unit-label">Unit</Label>
              <Select value={form.area_unit} onValueChange={(v) => v && setForm({ ...form, area_unit: v as AreaUnit })}><SelectTrigger aria-labelledby="edit-prop-unit-label"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="sq_yards">Sq. Yards</SelectItem><SelectItem value="sq_ft">Sq. Feet</SelectItem><SelectItem value="sq_meters">Sq. Meters</SelectItem><SelectItem value="acres">Acres</SelectItem></SelectContent></Select>
            </div>
            <div className="space-y-2"><Label id="edit-prop-facing-label">Facing</Label>
              <Select value={form.facing} onValueChange={(v) => v && setForm({ ...form, facing: v as PropertyFacing })}><SelectTrigger aria-labelledby="edit-prop-facing-label"><SelectValue /></SelectTrigger><SelectContent>{Object.entries(PROPERTY_FACING_LABELS).map(([val, label]) => (<SelectItem key={val} value={val}>{label}</SelectItem>))}</SelectContent></Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="edit-prop-price">Price (₹) *</Label><Input id="edit-prop-price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
            <div className="space-y-2"><Label htmlFor="edit-prop-dims">Dimensions</Label><Input id="edit-prop-dims" value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })} placeholder="30x40" /></div>
          </div>
          <div className="space-y-2"><Label htmlFor="edit-prop-desc">Description</Label><Textarea id="edit-prop-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></div>
          <div className="space-y-2"><Label>Images</Label><ImageUpload images={images} onImagesChange={setImages} uploadFn={(file) => uploadPropertyImage(file, property.id)} /></div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function InventoryPage() {
  const store = useDemoStore();
  const [view, setView] = useState<"list" | "grid">("grid");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [facingFilter, setFacingFilter] = useState("all");
  const [selectedProjectId, setSelectedProjectId] = useState<string>(store.projects[0]?.id || "");
  const [activeTab, setActiveTab] = useState("properties");
  const [mapHighlightProperty, setMapHighlightProperty] = useState<Property | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [mapEditMode, setMapEditMode] = useState(false);
  const [mapGridRows, setMapGridRows] = useState(6);
  const [mapGridCols, setMapGridCols] = useState(8);
  const [mapCellTarget, setMapCellTarget] = useState<{ x: number; y: number } | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const projectMap = useMemo(() => {
    const map = new Map<string, string>();
    store.projects.forEach((p) => map.set(p.id, p.name));
    return map;
  }, [store.projects]);

  const filteredProperties = useMemo(() => {
    return store.properties.filter((p) => {
      const matchSearch = !search || p.plot_number.toLowerCase().includes(search.toLowerCase()) || (projectMap.get(p.project_id) || "").toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const matchFacing = facingFilter === "all" || p.facing === facingFilter;
      return matchSearch && matchStatus && matchFacing;
    });
  }, [search, statusFilter, facingFilter, projectMap, store.properties]);

  const selectedProject = useMemo(() => store.projects.find((p) => p.id === selectedProjectId), [selectedProjectId, store.projects]);

  const layoutProperties = useMemo(
    () => (selectedProjectId ? store.properties.filter((p) => p.project_id === selectedProjectId) : []),
    [selectedProjectId, store.properties]
  );

  const totalValue = useMemo(() => store.properties.reduce((s, p) => s + p.price, 0), [store.properties]);
  const availableCount = useMemo(() => store.properties.filter((p) => p.status === "available").length, [store.properties]);

  const handleLocateOnMap = useCallback((property: Property) => {
    setSelectedProjectId(property.project_id);
    setMapHighlightProperty(property);
    setActiveTab("layout");
  }, []);

  const handleExportCSV = useCallback(() => {
    const headers = ["Plot Number", "Project", "Area", "Unit", "Facing", "Price", "Status", "Type", "Dimensions"];
    const rows = filteredProperties.map((p) => [p.plot_number, projectMap.get(p.project_id) || "", p.area, p.area_unit, p.facing, p.price, p.status, p.property_type, p.dimensions || ""]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `properties-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredProperties, projectMap]);

  return (
    <>
      <DashboardHeader
        title="Inventory"
        description={`${store.projects.length} projects · ${store.properties.length} properties`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-1" /> Export
            </Button>
            <CSVImportDialog />
            <AddPropertyDialog />
            <AddProjectDialog />
          </div>
        }
      />
      <div className="p-4 space-y-4">
        {/* Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Projects", value: store.projects.length, icon: Building2, accent: "text-primary", border: "border-primary/20", bg: "bg-primary/5", formatter: undefined as undefined | ((v: number) => string) },
            { label: "Properties", value: store.properties.length, icon: Home, accent: "text-blue-600 dark:text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/5", formatter: undefined },
            { label: "Available", value: availableCount, icon: CheckCircle, accent: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5", formatter: undefined },
            { label: "Total Value", value: totalValue, icon: IndianRupee, accent: "text-amber-600 dark:text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/5", formatter: formatLakh },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`border ${stat.border} ${stat.bg} px-3 py-2.5 animate-fade-up`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                <stat.icon className={`w-3.5 h-3.5 ${stat.accent}`} />
              </div>
              <p className={`text-xl font-bold tabular-nums ${stat.accent}`}>
                {stat.label === "Total Value" && "₹"}
                <AnimatedCounter value={stat.value} formatter={stat.formatter} startDelay={i * 60} />
              </p>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 bg-card/50 rounded-lg p-3 border border-border/50">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input aria-label="Search properties" placeholder="Search properties..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex items-center gap-3">
            <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
              <SelectTrigger className="w-full sm:w-[150px]" aria-label="Filter by status"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(PROPERTY_STATUS_LABELS).map(([val, label]) => (<SelectItem key={val} value={val}>{label}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select value={facingFilter} onValueChange={(v) => v && setFacingFilter(v)}>
              <SelectTrigger className="w-[150px]" aria-label="Filter by facing"><SelectValue placeholder="All Facing" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Facing</SelectItem>
                {Object.entries(PROPERTY_FACING_LABELS).map(([val, label]) => (<SelectItem key={val} value={val}>{label}</SelectItem>))}
              </SelectContent>
            </Select>
            <div className="flex border rounded-md">
              <Button variant={view === "list" ? "secondary" : "ghost"} size="icon" className="h-8 w-8 rounded-r-none" onClick={() => setView("list")} aria-label="List view" aria-pressed={view === "list"}><List className="h-4 w-4" /></Button>
              <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon" className="h-8 w-8 rounded-l-none" onClick={() => setView("grid")} aria-label="Grid view" aria-pressed={view === "grid"}><Grid3X3 className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => v && setActiveTab(v)}>
          <TabsList>
            <TabsTrigger value="properties">Properties ({store.properties.length})</TabsTrigger>
            <TabsTrigger value="projects">Projects ({store.projects.length})</TabsTrigger>
            <TabsTrigger value="layout"><MapIcon className="w-4 h-4 mr-1" /> Layout Map</TabsTrigger>
            <TabsTrigger value="map"><MapPin className="w-4 h-4 mr-1" /> Map View</TabsTrigger>
          </TabsList>

          {/* ── Properties Tab ── */}
          <TabsContent value="properties">
            {selectedIds.size > 0 && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center justify-between mb-3">
                <span className="text-sm font-medium">{selectedIds.size} selected</span>
                <div className="flex items-center gap-2">
                  <Select onValueChange={(v) => { if (v) { updatePropertiesStatus([...selectedIds], v as PropertyStatus); setSelectedIds(new Set()); } }}>
                    <SelectTrigger className="w-[150px] h-8 text-xs"><SelectValue placeholder="Change status..." /></SelectTrigger>
                    <SelectContent>{Object.entries(PROPERTY_STATUS_LABELS).map(([val, label]) => (<SelectItem key={val} value={val}>{label}</SelectItem>))}</SelectContent>
                  </Select>
                  <Button variant="destructive" size="sm" onClick={() => { if (confirm(`Delete ${selectedIds.size} properties?`)) { deleteProperties([...selectedIds]); setSelectedIds(new Set()); } }}><Trash2 className="w-3.5 h-3.5 mr-1" /> Delete</Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>Clear</Button>
                </div>
              </div>
            )}

            {view === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProperties.slice(0, 50).map((property) => (
                  <Card key={property.id} className="overflow-hidden hover:shadow-md hover:ring-1 hover:ring-primary/20 transition-all cursor-pointer group" onClick={() => setEditingProperty(property)}>
                    <div className="aspect-video bg-muted relative">
                      {property.images.length > 0 ? (
                        <img src={property.images[0]} alt={property.plot_number} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Building2 className="w-8 h-8 text-muted-foreground/20" /></div>
                      )}
                      <div className="absolute top-2 right-2"><StatusBadge status={property.status} /></div>
                      <div className="absolute bottom-2 left-2">
                        <span className="text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">{PROPERTY_FACING_LABELS[property.facing]}</span>
                      </div>
                    </div>
                    <CardContent className="p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">{property.plot_number}</p>
                        <p className="text-sm font-bold text-primary">{formatCurrency(property.price)}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{projectMap.get(property.project_id)}</p>
                      <p className="text-xs text-muted-foreground">{formatArea(property.area, property.area_unit)} · {property.dimensions || "—"}</p>
                    </CardContent>
                  </Card>
                ))}
                {filteredProperties.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground">No properties match your filters.</div>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40px]">
                          <input type="checkbox" checked={selectedIds.size === filteredProperties.length && filteredProperties.length > 0} onChange={(e) => setSelectedIds(e.target.checked ? new Set(filteredProperties.map((p) => p.id)) : new Set())} className="rounded border-muted-foreground" />
                        </TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Plot #</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Area</TableHead>
                        <TableHead>Facing</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProperties.length === 0 ? (
                        <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No properties match your filters.</TableCell></TableRow>
                      ) : (
                        filteredProperties.slice(0, 50).map((property, i) => (
                          <TableRow key={property.id} className={i % 2 === 1 ? "bg-muted/20" : ""}>
                            <TableCell>
                              <input type="checkbox" checked={selectedIds.has(property.id)} onChange={(e) => { const next = new Set(selectedIds); if (e.target.checked) next.add(property.id); else next.delete(property.id); setSelectedIds(next); }} className="rounded border-muted-foreground" />
                            </TableCell>
                            <TableCell>
                              {property.images.length > 0 ? (<img src={property.images[0]} alt={property.plot_number} className="w-8 h-8 rounded object-cover" loading="lazy" />) : (<div className="w-8 h-8 rounded bg-muted flex items-center justify-center"><Building2 className="w-4 h-4 text-muted-foreground/50" /></div>)}
                            </TableCell>
                            <TableCell className="font-medium">{property.plot_number}</TableCell>
                            <TableCell>{projectMap.get(property.project_id) || "—"}</TableCell>
                            <TableCell>{formatArea(property.area, property.area_unit)}</TableCell>
                            <TableCell>{PROPERTY_FACING_LABELS[property.facing]}</TableCell>
                            <TableCell>{formatCurrency(property.price)}</TableCell>
                            <TableCell><StatusChangeCell property={property} /></TableCell>
                            <TableCell>
                              <div className="flex gap-0.5">
                                <Button variant="ghost" size="icon" className="h-7 w-7" title="Edit property" onClick={() => setEditingProperty(property)}><Pencil className="w-3.5 h-3.5" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" title="Locate on layout map" onClick={() => handleLocateOnMap(property)}><Crosshair className="w-3.5 h-3.5" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600" title="Delete property" onClick={() => { if (confirm(`Delete ${property.plot_number}?`)) deleteProperty(property.id); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  {filteredProperties.length > 50 && (<p className="text-xs text-muted-foreground text-center py-3">Showing 50 of {filteredProperties.length} properties.</p>)}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ── Projects Tab — Cards ── */}
          <TabsContent value="projects">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {store.projects.map((project) => {
                const props = store.properties.filter((p) => p.project_id === project.id);
                const avail = props.filter((p) => p.status === "available").length;
                const reserved = props.filter((p) => p.status === "reserved").length;
                const sold = props.filter((p) => p.status === "sold").length;
                const total = props.length;
                return (
                  <Card key={project.id} className="overflow-hidden hover:shadow-md transition-all group">
                    <div className="aspect-video bg-muted relative">
                      {project.thumbnail ? (
                        <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Building2 className="w-10 h-10 text-muted-foreground/20" /></div>
                      )}
                      <div className="absolute top-2 right-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          project.status === "ongoing" ? PROPERTY_STATUS_STYLES.available.badge
                            : project.status === "upcoming" ? PROPERTY_STATUS_STYLES.under_registration.badge
                            : PROPERTY_STATUS_STYLES.blocked.badge
                        }`}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                      </div>
                      {project.rera_number && (
                        <div className="absolute top-2 left-2">
                          <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-medium">RERA</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">{project.location}, {project.city}</p>
                      </div>
                      {total > 0 && (
                        <>
                          <div className="flex h-2 rounded-full overflow-hidden bg-muted">
                            {avail > 0 && <div className="bg-emerald-500" style={{ width: `${(avail / total) * 100}%` }} />}
                            {reserved > 0 && <div className="bg-amber-500" style={{ width: `${(reserved / total) * 100}%` }} />}
                            {sold > 0 && <div className="bg-red-500" style={{ width: `${(sold / total) * 100}%` }} />}
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span className="text-emerald-500 font-medium">{avail} available</span>
                            <span>{total} total</span>
                          </div>
                        </>
                      )}
                      {project.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.amenities.slice(0, 3).map((a) => (
                            <span key={a} className="text-[10px] bg-muted rounded-full px-2 py-0.5">{a}</span>
                          ))}
                          {project.amenities.length > 3 && (
                            <span className="text-[10px] text-muted-foreground">+{project.amenities.length - 3}</span>
                          )}
                        </div>
                      )}
                      <div className="flex gap-1 pt-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" title="Edit project" onClick={() => setEditingProject(project)}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600" title="Delete project" onClick={() => { if (confirm(`Delete "${project.name}" and all its properties?`)) deleteProject(project.id); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {store.projects.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <Building2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  No projects yet. Click "Add Project" to create your first one.
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── Layout Map Tab ── */}
          <TabsContent value="layout">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <Select value={selectedProjectId} onValueChange={(v) => { v && setSelectedProjectId(v); setMapHighlightProperty(null); }}>
                    <SelectTrigger className="w-[280px]"><SelectValue placeholder="Select project" /></SelectTrigger>
                    <SelectContent>
                      {store.projects.filter((p) => p.status !== "upcoming").map((project) => (
                        <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    {mapEditMode && (
                      <div className="flex items-center gap-1 text-xs">
                        <Label className="text-xs text-muted-foreground">Rows:</Label>
                        <Input type="number" min="1" max="20" value={mapGridRows} onChange={(e) => setMapGridRows(parseInt(e.target.value) || 6)} className="w-14 h-7 text-xs" />
                        <Label className="text-xs text-muted-foreground ml-1">Cols:</Label>
                        <Input type="number" min="1" max="20" value={mapGridCols} onChange={(e) => setMapGridCols(parseInt(e.target.value) || 8)} className="w-14 h-7 text-xs" />
                      </div>
                    )}
                    <Button variant={mapEditMode ? "default" : "outline"} size="sm" onClick={() => setMapEditMode(!mapEditMode)}>
                      {mapEditMode ? <><Pencil className="w-3.5 h-3.5 mr-1" /> Editing</> : <><Pencil className="w-3.5 h-3.5 mr-1" /> Edit Mode</>}
                    </Button>
                    <Dialog>
                      <DialogTrigger render={<Button variant="outline" size="sm" />}><Maximize2 className="w-4 h-4 mr-1" /> Fullscreen</DialogTrigger>
                      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-auto">
                        <DialogHeader><DialogTitle>{selectedProject?.name || "Layout Map"}</DialogTitle></DialogHeader>
                        {selectedProject && (
                          <LayoutMap project={selectedProject} properties={layoutProperties} editable={mapEditMode}
                            gridRows={mapEditMode ? mapGridRows : undefined} gridCols={mapEditMode ? mapGridCols : undefined}
                            onCellClick={(x, y) => setMapCellTarget({ x, y })} onPlotClick={(p) => setEditingProperty(p)} />
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                {mapEditMode && (
                  <p className="text-xs text-muted-foreground mb-4 bg-primary/5 border border-primary/20 rounded px-3 py-2">
                    Click any empty cell on the grid to place a new plot. Click an existing plot to edit it.
                  </p>
                )}
                {selectedProject ? (
                  <LayoutMap project={selectedProject} properties={layoutProperties}
                    highlightPropertyId={mapHighlightProperty?.project_id === selectedProject.id ? mapHighlightProperty?.id : undefined}
                    editable={mapEditMode} gridRows={mapEditMode ? mapGridRows : undefined} gridCols={mapEditMode ? mapGridCols : undefined}
                    onCellClick={(x, y) => setMapCellTarget({ x, y })} onPlotClick={(p) => setEditingProperty(p)} />
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">Select a project to view its layout map.</p>
                )}
              </CardContent>
            </Card>

            {mapCellTarget && selectedProject && (
              <AddPropertyDialog defaultLayoutX={mapCellTarget.x} defaultLayoutY={mapCellTarget.y}
                defaultProjectId={selectedProject.id} onClose={() => setMapCellTarget(null)} />
            )}
          </TabsContent>

          {/* ── Map View Tab ── */}
          <TabsContent value="map">
            <Card>
              <CardContent className="pt-6">
                <PropertiesMapDynamic properties={store.properties} projects={store.projects} height="600px"
                  onProjectClick={(projectId) => { setSelectedProjectId(projectId); setActiveTab("layout"); }} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {editingProject && (
        <EditProjectDialog project={editingProject} open={!!editingProject}
          onOpenChange={(open) => { if (!open) setEditingProject(null); }} />
      )}
      {editingProperty && (
        <EditPropertyDialog property={editingProperty} open={!!editingProperty}
          onOpenChange={(open) => { if (!open) setEditingProperty(null); }} />
      )}
    </>
  );
}
