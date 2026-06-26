"use client";

import dynamic from "next/dynamic";

const LocationPickerMap = dynamic(
  () => import("./location-picker-map").then((m) => m.LocationPickerMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full rounded-lg border bg-muted/20 animate-pulse"
        style={{ height: "300px" }}
      />
    ),
  }
);

interface LocationPickerMapDynamicProps {
  lat: number | null;
  lng: number | null;
  onPositionChange: (pos: { lat: number; lng: number }) => void;
}

export function LocationPickerMapDynamic(props: LocationPickerMapDynamicProps) {
  return <LocationPickerMap {...props} />;
}
