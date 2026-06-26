"use client";

import { useState, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2, MapPin } from "lucide-react";
import { LocationPickerMapDynamic } from "./location-picker-map-dynamic";

export interface LocationPickerValue {
  lat: number | null;
  lng: number | null;
  location: string;
  city: string;
  state: string;
}

interface LocationPickerProps {
  value: LocationPickerValue;
  onChange: (value: LocationPickerValue) => void;
}

interface NominatimAddress {
  suburb?: string;
  neighbourhood?: string;
  village?: string;
  city?: string;
  town?: string;
  county?: string;
  state?: string;
  state_district?: string;
  city_district?: string;
  municipality?: string;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  address: NominatimAddress;
}

function extractFromAddress(addr: NominatimAddress, displayName: string) {
  const location =
    addr.suburb || addr.neighbourhood || addr.village || addr.city_district || displayName.split(",")[0];
  const city =
    addr.city || addr.town || addr.municipality || addr.county || addr.state_district || addr.suburb || displayName.split(",")[0];
  const state = addr.state || "";
  return { location, city, state };
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reverseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 3) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setIsLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=6&countrycodes=in&email=reos-app@example.com`;
      const res = await fetch(url);
      const data: NominatimResult[] = await res.json();
      setResults(data);
      setShowDropdown(data.length > 0);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&email=reos-app@example.com`;
      const res = await fetch(url);
      const data: NominatimResult = await res.json();
      if (data?.address) {
        const { location, city, state } = extractFromAddress(data.address, data.display_name);
        onChange({ lat, lng, location, city, state });
        setQuery(data.display_name);
      }
    } catch {
      // keep lat/lng even if reverse geocode fails
    }
  }, [onChange]);

  function handleInputChange(q: string) {
    setQuery(q);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(q), 350);
  }

  function handleSelectResult(result: NominatimResult) {
    const { location, city, state } = extractFromAddress(result.address, result.display_name);

    onChange({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      location,
      city,
      state,
    });
    setQuery(result.display_name);
    setShowDropdown(false);
  }

  function handleMapPositionChange(pos: { lat: number; lng: number }) {
    onChange({ ...value, lat: pos.lat, lng: pos.lng });
    if (reverseRef.current) clearTimeout(reverseRef.current);
    reverseRef.current = setTimeout(() => reverseGeocode(pos.lat, pos.lng), 500);
  }

  return (
    <div className="space-y-4" ref={containerRef}>
      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block">Search Location</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => results.length > 0 && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 400)}
            placeholder="Type a location — e.g. Shamshabad, Hyderabad"
            className="pl-9 pr-9 h-11 text-sm"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        {showDropdown && results.length > 0 && (
          <div className="mt-1.5 w-full bg-popover border rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {results.map((r, i) => (
              <button
                key={`${r.lat}-${r.lon}-${i}`}
                type="button"
                className="w-full text-left px-3.5 py-3 hover:bg-muted/60 text-sm transition-colors border-b border-border/30 last:border-0"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelectResult(r)}
              >
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                  <span className="line-clamp-2 leading-snug">{r.display_name}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <LocationPickerMapDynamic
        lat={value.lat}
        lng={value.lng}
        onPositionChange={handleMapPositionChange}
      />

      {value.location && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded px-3 py-2.5">
          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>
            {value.location}
            {value.city ? `, ${value.city}` : ""}
            {value.state ? `, ${value.state}` : ""}
            {value.lat && value.lng ? ` (${value.lat.toFixed(4)}, ${value.lng.toFixed(4)})` : ""}
          </span>
        </div>
      )}
    </div>
  );
}
