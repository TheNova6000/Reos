"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Property, Project } from "@/types/database";

interface PropertiesMapProps {
  properties: Property[];
  projects: Project[];
  height?: string;
  zoom?: number;
  onProjectClick?: (projectId: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
  available: "#22c55e",
  reserved: "#f59e0b",
  sold: "#ef4444",
  blocked: "#6b7280",
  under_registration: "#3b82f6",
};

export function PropertiesMap({
  properties,
  projects,
  height = "500px",
  zoom = 11,
  onProjectClick,
}: PropertiesMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const projectLocations = projects
        .filter((p) => p.latitude && p.longitude)
        .map((p) => ({
          id: p.id,
          coords: [p.latitude!, p.longitude!] as [number, number],
        }));

      const center: [number, number] =
        projectLocations.length > 0
          ? projectLocations[0].coords
          : [17.385, 78.4867];

      const map = L.map(mapRef.current, {
        center,
        zoom,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      projects
        .filter((p) => p.latitude && p.longitude)
        .forEach((project) => {
          const projectProps = properties.filter(
            (pr) => pr.project_id === project.id
          );
          const avail = projectProps.filter(
            (pr) => pr.status === "available"
          ).length;
          const reserved = projectProps.filter(
            (pr) => pr.status === "reserved"
          ).length;
          const sold = projectProps.filter(
            (pr) => pr.status === "sold"
          ).length;
          const total = projectProps.length;

          const statusColor =
            avail > total / 2
              ? STATUS_COLORS.available
              : sold > total / 2
              ? STATUS_COLORS.sold
              : STATUS_COLORS.reserved;

          const icon = L.divIcon({
            className: "",
            html: `<div style="
              width: 44px; height: 44px;
              background: ${statusColor};
              border: 3px solid white;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 16px;
              font-weight: bold;
              cursor: pointer;
            ">${avail}</div>`,
            iconSize: [44, 44],
            iconAnchor: [22, 22],
          });

          const priceRange =
            project.price_range_min && project.price_range_max
              ? `₹${(project.price_range_min / 100000).toFixed(1)}L – ₹${(project.price_range_max / 100000).toFixed(1)}L`
              : "";

          const marker = L.marker(
            [project.latitude!, project.longitude!],
            { icon }
          )
            .addTo(map)
            .bindPopup(
              `<div style="font-family:system-ui,sans-serif;min-width:220px;line-height:1.5">
                <strong style="font-size:14px;display:block;margin-bottom:2px">${project.name}</strong>
                <span style="font-size:12px;color:#888">${project.location}, ${project.city}</span><br/>
                <div style="margin-top:6px;display:flex;gap:8px;font-size:12px;font-weight:600">
                  <span style="color:#22c55e">${avail} avail</span>
                  <span style="color:#f59e0b">${reserved} resv</span>
                  <span style="color:#ef4444">${sold} sold</span>
                </div>
                ${priceRange ? `<div style="font-size:11px;color:#888;margin-top:4px">${priceRange}</div>` : ""}
                ${project.rera_number ? `<div style="font-size:10px;color:#22c55e;margin-top:2px">RERA: ${project.rera_number}</div>` : ""}
              </div>`
            );

          if (onProjectClick) {
            marker.on("click", () => onProjectClick(project.id));
          }
        });

      const allCoords = projectLocations.map((p) => p.coords);
      if (allCoords.length > 1) {
        map.fitBounds(L.latLngBounds(allCoords), { padding: [50, 50] });
      }

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [properties, projects, zoom, onProjectClick]);

  if (projects.filter((p) => p.latitude && p.longitude).length === 0) {
    return (
      <div
        style={{ height }}
        className="w-full rounded-lg border bg-muted/20 flex items-center justify-center"
      >
        <p className="text-sm text-muted-foreground">
          No projects with coordinates. Add latitude/longitude to projects to see them on the map.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{ height }}
      className="w-full rounded-lg overflow-hidden border"
    />
  );
}
