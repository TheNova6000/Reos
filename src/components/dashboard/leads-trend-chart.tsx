"use client";

import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Props {
  data: Array<{ day: string; leads: number }>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border border-border/50 bg-card px-3 py-2 text-xs shadow-lg">
      <p className="text-muted-foreground mb-0.5">{label}</p>
      <p className="font-bold text-primary">{payload[0].value} leads</p>
    </div>
  );
}

export function LeadsTrendChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={150}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="leadFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4520f" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#d4520f" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.04)"
          vertical={false}
        />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 9, fill: "rgba(150,150,150,0.8)" }}
          axisLine={false}
          tickLine={false}
          interval={1}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="leads"
          stroke="#d4520f"
          fill="url(#leadFill)"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 3, fill: "#d4520f", strokeWidth: 0 }}
          animationDuration={1800}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
