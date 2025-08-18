"use client";

import {
  BarChart as RBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type SeriesConfig = {
  key: string;
  color?: string;
  name?: string;
};

export function BarChart({
  data,
  series,
  height = 260,
}: {
  data: Array<Record<string, number | string>>;
  series: SeriesConfig[];
  height?: number;
}) {
  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <RBarChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="#6b7280" />
          <YAxis tickLine={false} axisLine={false} stroke="#6b7280" width={36} />
          <Tooltip 
            contentStyle={{ 
              borderRadius: 12, 
              border: "1px solid #e5e7eb",
              backgroundColor: "white",
              color: "#374151"
            }} 
          />
          {series.map((s) => (
            <Bar key={s.key} dataKey={s.key} name={s.name || s.key} fill={s.color || "#f97316"} radius={4} />
          ))}
        </RBarChart>
      </ResponsiveContainer>
    </div>
  );
}

