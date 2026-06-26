"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Grid3X3, MapPin } from "lucide-react";
import { LayoutMap } from "./layout-map";
import {
  PROPERTY_FACING_LABELS,
} from "@/lib/constants";
import {
  useDemoStore,
  addProperty,
} from "@/lib/demo-store";
import type { PropertyFacing, PropertyType, AreaUnit } from "@/types/database";

interface AddPropertyDialogProps {
  defaultLayoutX?: number;
  defaultLayoutY?: number;
  defaultProjectId?: string;
  onClose?: () => void;
}

export function AddPropertyDialog({
  defaultLayoutX,
  defaultLayoutY,
  defaultProjectId,
  onClose,
}: AddPropertyDialogProps) {
  const store = useDemoStore();
  const [open, setOpen] = useState(
    !!defaultLayoutX || !!defaultLayoutY || !!defaultProjectId
  );
  const [form, setForm] = useState({
    project_id: defaultProjectId || "",
    plot_number: "",
    area: "",
    area_unit: "sq_yards" as AreaUnit,
    facing: "east" as PropertyFacing,
    price: "",
    property_type: "plot" as PropertyType,
    dimensions: "",
    layout_x: defaultLayoutX !== undefined ? String(defaultLayoutX) : "",
    layout_y: defaultLayoutY !== undefined ? String(defaultLayoutY) : "",
    features: "",
    floor_number: "",
  });

  const selectedProject = useMemo(
    () => store.projects.find((p) => p.id === form.project_id),
    [form.project_id, store.projects]
  );

  const projectProperties = useMemo(
    () =>
      form.project_id
        ? store.properties.filter((p) => p.project_id === form.project_id)
        : [],
    [form.project_id, store.properties]
  );

  const highlightCell = useMemo(() => {
    if (form.layout_x && form.layout_y) {
      return { x: parseInt(form.layout_x), y: parseInt(form.layout_y) };
    }
    return null;
  }, [form.layout_x, form.layout_y]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.project_id || !form.plot_number || !form.area || !form.price)
      return;
    const featuresList = form.features
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
    addProperty({
      project_id: form.project_id,
      plot_number: form.plot_number,
      area: parseFloat(form.area),
      area_unit: form.area_unit,
      facing: form.facing,
      price: parseInt(form.price),
      property_type: form.property_type,
      dimensions: form.dimensions || undefined,
      layout_x: form.layout_x ? parseInt(form.layout_x) : undefined,
      layout_y: form.layout_y ? parseInt(form.layout_y) : undefined,
      features: featuresList.length > 0 ? featuresList : undefined,
      floor_number: form.floor_number ? parseInt(form.floor_number) : undefined,
    });
    setForm({
      project_id: "",
      plot_number: "",
      area: "",
      area_unit: "sq_yards",
      facing: "east",
      price: "",
      property_type: "plot",
      dimensions: "",
      layout_x: "",
      layout_y: "",
      features: "",
      floor_number: "",
    });
    setOpen(false);
    onClose?.();
  }

  function handleOpenChange(v: boolean) {
    setOpen(v);
    if (!v) onClose?.();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!defaultLayoutX && !defaultLayoutY && (
        <DialogTrigger render={<Button size="sm" variant="outline" />}>
          <Plus className="w-4 h-4 mr-1" /> Add Property
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5" />
            Add New Property
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1: Project Selection */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Project
            </p>
            <Select
              value={form.project_id}
              onValueChange={(v) =>
                v &&
                setForm({
                  ...form,
                  project_id: v,
                  layout_x: "",
                  layout_y: "",
                })
              }
            >
              <SelectTrigger aria-label="Select project">
                <SelectValue placeholder="Select project..." />
              </SelectTrigger>
              <SelectContent>
                {store.projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} — {p.location}, {p.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Section 2: Grid Position */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Grid Position
            </p>
            {selectedProject ? (
              <div className="space-y-2">
                <div className="border rounded-lg p-3 bg-muted/10 overflow-auto max-h-[300px]">
                  <LayoutMap
                    project={selectedProject}
                    properties={projectProperties}
                    editable={true}
                    gridRows={6}
                    gridCols={8}
                    highlightCell={highlightCell}
                    onCellClick={(x, y) =>
                      setForm({
                        ...form,
                        layout_x: String(x),
                        layout_y: String(y),
                      })
                    }
                  />
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  {highlightCell ? (
                    <span className="text-primary font-medium">
                      Selected: Column {highlightCell.x + 1}, Row{" "}
                      {highlightCell.y + 1}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      Click an empty cell on the grid to choose where this
                      property goes
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-8 text-center text-muted-foreground text-sm bg-muted/10">
                <Grid3X3 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                Select a project above to see its layout grid
              </div>
            )}
          </div>

          {/* Section 3: Property Details */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Property Details
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prop-plot">Plot Number *</Label>
                  <Input
                    id="prop-plot"
                    value={form.plot_number}
                    onChange={(e) =>
                      setForm({ ...form, plot_number: e.target.value })
                    }
                    placeholder="C-01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label id="prop-type-label">Type</Label>
                  <Select
                    value={form.property_type}
                    onValueChange={(v) =>
                      v &&
                      setForm({ ...form, property_type: v as PropertyType })
                    }
                  >
                    <SelectTrigger aria-labelledby="prop-type-label">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plot">Plot</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="farmland">Farmland</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label id="prop-facing-label">Facing</Label>
                  <Select
                    value={form.facing}
                    onValueChange={(v) =>
                      v &&
                      setForm({ ...form, facing: v as PropertyFacing })
                    }
                  >
                    <SelectTrigger aria-labelledby="prop-facing-label">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PROPERTY_FACING_LABELS).map(
                        ([val, label]) => (
                          <SelectItem key={val} value={val}>
                            {label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prop-area">Area *</Label>
                  <Input
                    id="prop-area"
                    type="number"
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    placeholder="200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label id="prop-unit-label">Unit</Label>
                  <Select
                    value={form.area_unit}
                    onValueChange={(v) =>
                      v && setForm({ ...form, area_unit: v as AreaUnit })
                    }
                  >
                    <SelectTrigger aria-labelledby="prop-unit-label">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sq_yards">Sq. Yards</SelectItem>
                      <SelectItem value="sq_ft">Sq. Feet</SelectItem>
                      <SelectItem value="sq_meters">Sq. Meters</SelectItem>
                      <SelectItem value="acres">Acres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prop-price">Price (₹) *</Label>
                  <Input
                    id="prop-price"
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="2500000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prop-dims">Dimensions</Label>
                  <Input
                    id="prop-dims"
                    value={form.dimensions}
                    onChange={(e) =>
                      setForm({ ...form, dimensions: e.target.value })
                    }
                    placeholder="30x40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prop-features">
                    Features (comma-separated)
                  </Label>
                  <Input
                    id="prop-features"
                    value={form.features}
                    onChange={(e) =>
                      setForm({ ...form, features: e.target.value })
                    }
                    placeholder="Park-facing, Corner plot, Near entrance"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prop-floor">Floor Number</Label>
                  <Input
                    id="prop-floor"
                    type="number"
                    value={form.floor_number}
                    onChange={(e) =>
                      setForm({ ...form, floor_number: e.target.value })
                    }
                    placeholder="For apartments"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!form.project_id}>
              Add Property
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
