"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationPickerMapProps {
  lat: number | null;
  lng: number | null;
  onPositionChange: (pos: { lat: number; lng: number }) => void;
}

const DEFAULT_CENTER: [number, number] = [17.385, 78.4867];
const DEFAULT_ZOOM = 13;

const pinIcon = L.divIcon({
  className: "",
  html: `<div style="
    width: 28px; height: 28px;
    background: #2563eb;
    border: 3px solid white;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 2px 8px rgba(0,0,0,0.35);
  "></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

export function LocationPickerMap({ lat, lng, onPositionChange }: LocationPickerMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const center: [number, number] = lat && lng ? [lat, lng] : DEFAULT_CENTER;

    const map = L.map(containerRef.current, {
      center,
      zoom: lat && lng ? 15 : DEFAULT_ZOOM,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker(center, { icon: pinIcon, draggable: true }).addTo(map);

    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      onPositionChange({ lat: pos.lat, lng: pos.lng });
    });

    map.on("click", (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      onPositionChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current || !lat || !lng) return;
    const pos: [number, number] = [lat, lng];
    markerRef.current.setLatLng(pos);
    mapRef.current.setView(pos, Math.max(mapRef.current.getZoom(), 14));
  }, [lat, lng]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-lg overflow-hidden border"
      style={{ height: "420px" }}
    />
  );
}
