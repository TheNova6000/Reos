"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#d4520f", "#60a5fa", "#34d399", "#a78bfa", "#fbbf24"];

interface Entry {
  name: string;
  value: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border border-border/50 bg-card px-3 py-2 text-xs shadow-lg">
      <p className="font-bold">{payload[0].name}</p>
      <p className="text-muted-foreground">{payload[0].value} leads</p>
    </div>
  );
}

export function SourcesDonutChart({ data }: { data: Entry[] }) {
  return (
    <div className="flex items-center gap-4">
      <div className="shrink-0">
        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={72}
              paddingAngle={3}
              dataKey="value"
              animationBegin={0}
              animationDuration={1400}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2 flex-1">
        {data.map((entry, i) => (
          <div key={entry.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 shrink-0"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span className="text-muted-foreground">{entry.name}</span>
            </div>
            <span className="font-bold tabular-nums">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
