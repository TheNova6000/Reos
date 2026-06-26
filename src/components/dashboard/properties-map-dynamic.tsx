"use client";

import dynamic from "next/dynamic";
import type { Property, Project } from "@/types/database";

const PropertiesMap = dynamic(
  () => import("./properties-map").then((m) => m.PropertiesMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full rounded-lg border bg-muted/20 animate-pulse" style={{ height: "400px" }} />
    ),
  }
);

interface PropertiesMapDynamicProps {
  properties: Property[];
  projects: Project[];
  height?: string;
  zoom?: number;
  onProjectClick?: (projectId: string) => void;
}

export function PropertiesMapDynamic(props: PropertiesMapDynamicProps) {
  return <PropertiesMap {...props} />;
}
