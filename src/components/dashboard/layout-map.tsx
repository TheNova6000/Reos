"use client";

import { useState, useMemo, useEffect } from "react";
import type { Property, Project } from "@/types/database";
import {
  PROPERTY_STATUS_LABELS,
  PROPERTY_FACING_LABELS,
  formatCurrency,
  formatArea,
} from "@/lib/constants";
import { X, Plus } from "lucide-react";

const STATUS_FILLS: Record<string, string> = {
  available: "#22c55e",
  reserved: "#f59e0b",
  sold: "#ef4444",
  blocked: "#6b7280",
  under_registration: "#3b82f6",
};

const STATUS_STROKES: Record<string, string> = {
  available: "#16a34a",
  reserved: "#d97706",
  sold: "#dc2626",
  blocked: "#4b5563",
  under_registration: "#2563eb",
};

interface LayoutMapProps {
  project: Project;
  properties: Property[];
  onSelectProperty?: (property: Property | null) => void;
  highlightPropertyId?: string;
  highlightCell?: { x: number; y: number } | null;
  editable?: boolean;
  gridRows?: number;
  gridCols?: number;
  onCellClick?: (x: number, y: number) => void;
  onPlotClick?: (property: Property) => void;
}

export function LayoutMap({
  project,
  properties,
  onSelectProperty,
  highlightPropertyId,
  highlightCell,
  editable = false,
  gridRows: forcedRows,
  gridCols: forcedCols,
  onCellClick,
  onPlotClick,
}: LayoutMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  useEffect(() => {
    if (highlightPropertyId) {
      const prop = properties.find((p) => p.id === highlightPropertyId);
      if (prop) {
        setSelectedProperty(prop);
        onSelectProperty?.(prop);
      }
    }
  }, [highlightPropertyId, properties, onSelectProperty]);

  const cellW = 64;
  const cellH = 52;

  const { gridCols, gridRows, svgW, svgH } = useMemo(() => {
    const dataCols = properties.length > 0
      ? Math.max(...properties.map((p) => (p.layout_x ?? -1))) + 1
      : 0;
    const dataRows = properties.length > 0
      ? Math.max(...properties.map((p) => (p.layout_y ?? -1))) + 1
      : 0;

    const cols = forcedCols ?? Math.max(dataCols, editable ? 8 : dataCols);
    const rows = forcedRows ?? Math.max(dataRows, editable ? 6 : dataRows);

    return {
      gridCols: Math.max(cols, 1),
      gridRows: Math.max(rows, 1),
      svgW: Math.max(cols, 1) * (cellW + 6) + 50,
      svgH: Math.max(rows, 1) * (cellH + 6) + 50,
    };
  }, [properties, forcedCols, forcedRows, editable]);

  const plotMap = useMemo(() => {
    const map = new Map<string, Property>();
    properties.forEach((p) => {
      if (p.layout_x !== null && p.layout_y !== null) {
        map.set(`${p.layout_x},${p.layout_y}`, p);
      }
    });
    return map;
  }, [properties]);

  function handlePlotClick(property: Property) {
    if (editable && onPlotClick) {
      onPlotClick(property);
      return;
    }
    setSelectedProperty(property);
    onSelectProperty?.(property);
  }

  function handleEmptyCellClick(x: number, y: number) {
    if (editable && onCellClick) {
      onCellClick(x, y);
    }
  }

  function handleCloseDetail() {
    setSelectedProperty(null);
    onSelectProperty?.(null);
  }

  const legend = [
    { label: "Available", color: STATUS_FILLS.available },
    { label: "Reserved", color: STATUS_FILLS.reserved },
    { label: "Sold", color: STATUS_FILLS.sold },
    { label: "Blocked", color: STATUS_FILLS.blocked },
    { label: "Under Reg.", color: STATUS_FILLS.under_registration },
  ];

  return (
    <div className="space-y-4">
      {/* Project Info Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{project.name}</h3>
          <p className="text-sm text-muted-foreground">
            {project.location}, {project.city} | {gridRows}×{gridCols} grid ·{" "}
            {properties.filter((p) => p.layout_x !== null).length} placed ·{" "}
            {properties.filter((p) => p.status === "available").length} available
          </p>
        </div>
        {project.rera_number && (
          <div className="text-xs text-muted-foreground text-right">
            <span className="font-medium">RERA:</span> {project.rera_number}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs flex-wrap">
        <span className="text-muted-foreground font-medium">Legend:</span>
        {legend.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-sm border border-white/20"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.label}</span>
          </div>
        ))}
        {editable && (
          <div className="flex items-center gap-1.5 text-primary">
            <div className="w-3 h-3 rounded-sm border-2 border-dashed border-primary/50" />
            <span>Click to add plot</span>
          </div>
        )}
      </div>

      {/* SVG Layout */}
      <div className="overflow-auto rounded-lg border bg-muted/20 p-4">
        <svg
          width={svgW}
          height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="min-w-max"
        >
          {/* Row labels */}
          {Array.from({ length: gridRows }, (_, r) => (
            <text
              key={`row-${r}`}
              x={12}
              y={r * (cellH + 6) + cellH / 2 + 48}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {r + 1}
            </text>
          ))}

          {/* Column labels */}
          {Array.from({ length: gridCols }, (_, c) => (
            <text
              key={`col-${c}`}
              x={c * (cellW + 6) + cellW / 2 + 40}
              y={18}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {c + 1}
            </text>
          ))}

          {/* Grid cells */}
          {Array.from({ length: gridRows }, (_, r) =>
            Array.from({ length: gridCols }, (_, c) => {
              const key = `${c},${r}`;
              const property = plotMap.get(key);
              const x = c * (cellW + 6) + 40;
              const y = r * (cellH + 6) + 32;

              if (property) {
                const isHovered = hoveredProperty === property.id;
                const isSelected = selectedProperty?.id === property.id;
                return (
                  <g
                    key={property.id}
                    onClick={() => handlePlotClick(property)}
                    onMouseEnter={() => setHoveredProperty(property.id)}
                    onMouseLeave={() => setHoveredProperty(null)}
                    className="cursor-pointer"
                  >
                    <rect
                      x={x} y={y} width={cellW} height={cellH} rx={2}
                      fill={STATUS_FILLS[property.status] || "#6b7280"}
                      stroke={isSelected ? "#ffffff" : isHovered ? "#fef08a" : STATUS_STROKES[property.status] || "#4b5563"}
                      strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1}
                    />
                    <text x={x + cellW / 2} y={y + cellH / 2 - 5} textAnchor="middle" dominantBaseline="middle" fill="white" className="text-[10px] font-semibold" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
                      {property.plot_number}
                    </text>
                    <text x={x + cellW / 2} y={y + cellH / 2 + 9} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.85)" className="text-[8px]" style={{ textShadow: "0 1px 1px rgba(0,0,0,0.4)" }}>
                      {PROPERTY_FACING_LABELS[property.facing]?.slice(0, 5)}
                    </text>
                    <text x={x + cellW / 2} y={y + cellH / 2 + 20} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.7)" className="text-[7px]" style={{ textShadow: "0 1px 1px rgba(0,0,0,0.3)" }}>
                      {formatArea(property.area, property.area_unit)}
                    </text>
                  </g>
                );
              }

              if (editable) {
                const isCellHovered = hoveredCell === key;
                const isCellHighlighted = highlightCell?.x === c && highlightCell?.y === r;
                return (
                  <g
                    key={`empty-${key}`}
                    onClick={() => handleEmptyCellClick(c, r)}
                    onMouseEnter={() => setHoveredCell(key)}
                    onMouseLeave={() => setHoveredCell(null)}
                    className="cursor-pointer"
                  >
                    <rect
                      x={x} y={y} width={cellW} height={cellH} rx={2}
                      fill={isCellHighlighted ? "rgba(59,130,246,0.25)" : isCellHovered ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.03)"}
                      stroke={isCellHighlighted ? "rgba(59,130,246,0.8)" : isCellHovered ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.08)"}
                      strokeWidth={isCellHighlighted ? 2.5 : 1}
                      strokeDasharray={isCellHighlighted || isCellHovered ? "0" : "4 2"}
                    />
                    {isCellHighlighted ? (
                      <text x={x + cellW / 2} y={y + cellH / 2} textAnchor="middle" dominantBaseline="middle" fill="rgba(59,130,246,0.9)" className="text-[10px] font-semibold">
                        ✓ Here
                      </text>
                    ) : isCellHovered ? (
                      <text x={x + cellW / 2} y={y + cellH / 2} textAnchor="middle" dominantBaseline="middle" fill="rgba(239,68,68,0.8)" className="text-[18px]">
                        +
                      </text>
                    ) : null}
                  </g>
                );
              }

              return null;
            })
          )}
        </svg>
      </div>

      {/* Selected Property Detail */}
      {selectedProperty && !editable && (
        <div className="relative rounded-lg border bg-card p-4 pr-8">
          <button onClick={handleCloseDetail} className="absolute top-2 right-2 text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Plot</p>
              <p className="font-semibold">{selectedProperty.plot_number}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <span className="inline-flex items-center gap-1 text-xs font-medium">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: STATUS_FILLS[selectedProperty.status] || "#6b7280" }} />
                {PROPERTY_STATUS_LABELS[selectedProperty.status]}
              </span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Area</p>
              <p className="font-semibold">{formatArea(selectedProperty.area, selectedProperty.area_unit)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Facing</p>
              <p className="font-semibold">{PROPERTY_FACING_LABELS[selectedProperty.facing]}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="font-semibold">{formatCurrency(selectedProperty.price)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Rate</p>
              <p className="font-semibold">₹{selectedProperty.price_per_unit?.toLocaleString("en-IN")}/sq.yd</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Dimensions</p>
              <p className="font-semibold">{selectedProperty.dimensions || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Features</p>
              <p className="text-sm">{selectedProperty.features?.join(", ") || "—"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
