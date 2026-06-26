"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const STAGE_HEX: Record<string, string> = {
  new: "#60a5fa",
  contacted: "#22d3ee",
  site_visit: "#a78bfa",
  negotiation: "#fbbf24",
  booked: "#34d399",
  lost: "#6b7280",
};

interface PipelineEntry {
  stage: string;
  label: string;
  count: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border border-border/50 bg-card px-3 py-2 text-xs shadow-lg">
      <p className="font-bold">{payload[0].payload.label}</p>
      <p className="text-muted-foreground">{payload[0].value} leads</p>
    </div>
  );
}

export function PipelineBarChart({ data }: { data: PipelineEntry[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }} barCategoryGap="30%">
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: "rgba(150,150,150,0.8)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "rgba(150,150,150,0.5)" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
        <Bar dataKey="count" radius={[0, 0, 0, 0]} animationDuration={1500} animationEasing="ease-out">
          {data.map((entry) => (
            <Cell key={entry.stage} fill={STAGE_HEX[entry.stage] ?? "#6b7280"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
