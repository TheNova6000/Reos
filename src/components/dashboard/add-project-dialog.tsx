"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, ArrowRight, ArrowLeft, MapPin, Building2 } from "lucide-react";
import { LocationPicker } from "./location-picker";
import type { LocationPickerValue } from "./location-picker";
import { addProject } from "@/lib/demo-store";

export function AddProjectDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({
    name: "",
    location: "",
    city: "",
    state: "Telangana",
    rera_number: "",
    total_units: "",
    description: "",
    price_range_min: "",
    price_range_max: "",
    latitude: "",
    longitude: "",
    amenities: "",
    thumbnail: "",
  });

  const locationValue: LocationPickerValue = {
    lat: form.latitude ? parseFloat(form.latitude) : null,
    lng: form.longitude ? parseFloat(form.longitude) : null,
    location: form.location,
    city: form.city,
    state: form.state,
  };

  function handleLocationChange(v: LocationPickerValue) {
    setForm({
      ...form,
      location: v.location,
      city: v.city,
      state: v.state,
      latitude: v.lat ? String(v.lat) : "",
      longitude: v.lng ? String(v.lng) : "",
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.location || !form.city || !form.total_units) return;
    const amenitiesList = form.amenities
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);
    addProject({
      name: form.name,
      location: form.location,
      city: form.city,
      state: form.state,
      rera_number: form.rera_number || undefined,
      rera_state: form.state,
      total_units: parseInt(form.total_units),
      description: form.description || undefined,
      price_range_min: form.price_range_min ? parseInt(form.price_range_min) : undefined,
      price_range_max: form.price_range_max ? parseInt(form.price_range_max) : undefined,
      latitude: form.latitude ? parseFloat(form.latitude) : undefined,
      longitude: form.longitude ? parseFloat(form.longitude) : undefined,
      amenities: amenitiesList.length > 0 ? amenitiesList : undefined,
      thumbnail: form.thumbnail || undefined,
    });
    setForm({
      name: "", location: "", city: "", state: "Telangana", rera_number: "",
      total_units: "", description: "", price_range_min: "", price_range_max: "",
      latitude: "", longitude: "", amenities: "", thumbnail: "",
    });
    setStep(1);
    setOpen(false);
  }

  function handleOpenChange(v: boolean) {
    setOpen(v);
    if (!v) setStep(1);
  }

  const canProceed =
    (form.location.length > 0 && form.city.length > 0) ||
    (form.latitude.length > 0 && form.longitude.length > 0);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus className="w-4 h-4 mr-1" /> Add Project
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === 1 ? <MapPin className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
            Add New Project
          </DialogTitle>
          <div className="flex items-center gap-2 pt-1">
            <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
          </div>
          <p className="text-xs text-muted-foreground">
            Step {step} of 2 — {step === 1 ? "Choose Location" : "Project Details"}
          </p>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4 pt-2">
            <LocationPicker value={locationValue} onChange={handleLocationChange} />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
              <Button onClick={() => setStep(2)} disabled={!canProceed}>
                Next <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded px-3 py-2">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>
                {form.location}, {form.city}, {form.state}
                {form.latitude && form.longitude ? ` (${parseFloat(form.latitude).toFixed(4)}, ${parseFloat(form.longitude).toFixed(4)})` : ""}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proj-name">Project Name *</Label>
                <Input
                  id="proj-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Green Valley Phase 3"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proj-units">Total Units *</Label>
                <Input
                  id="proj-units"
                  type="number"
                  value={form.total_units}
                  onChange={(e) => setForm({ ...form, total_units: e.target.value })}
                  placeholder="100"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proj-rera">RERA Number</Label>
                <Input
                  id="proj-rera"
                  value={form.rera_number}
                  onChange={(e) => setForm({ ...form, rera_number: e.target.value })}
                  placeholder="P02400001234"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proj-thumb">Thumbnail Image URL</Label>
                <Input
                  id="proj-thumb"
                  value={form.thumbnail}
                  onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proj-price-min">Min Price (₹)</Label>
                <Input
                  id="proj-price-min"
                  type="number"
                  value={form.price_range_min}
                  onChange={(e) => setForm({ ...form, price_range_min: e.target.value })}
                  placeholder="2000000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proj-price-max">Max Price (₹)</Label>
                <Input
                  id="proj-price-max"
                  type="number"
                  value={form.price_range_max}
                  onChange={(e) => setForm({ ...form, price_range_max: e.target.value })}
                  placeholder="8000000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proj-amenities">Amenities (comma-separated)</Label>
              <Input
                id="proj-amenities"
                value={form.amenities}
                onChange={(e) => setForm({ ...form, amenities: e.target.value })}
                placeholder="Gated Community, Swimming Pool, 24/7 Security, Jogging Track"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proj-desc">Description</Label>
              <Textarea
                id="proj-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Project description..."
                rows={3}
              />
            </div>

            <div className="flex justify-between gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>Cancel</Button>
                <Button type="submit">Create Project</Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
