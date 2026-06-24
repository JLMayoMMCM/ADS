"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { AggRow } from "@/lib/charts/aggregate";
import type { ChartConfig } from "@/lib/charts/types";
import { formatNumber } from "@/lib/utils";

interface Props {
  data: AggRow[];
  config: ChartConfig;
}

export function ScatterChartRenderer({ data, config }: Props) {
  const { x, y } = config.encoding;
  if (!x || !y) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
        <XAxis
          dataKey={x}
          type="number"
          name={x}
          tickFormatter={formatNumber}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
        />
        <YAxis
          dataKey={y}
          type="number"
          name={y}
          tickFormatter={formatNumber}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            fontSize: 12,
          }}
          formatter={(v) => (typeof v === "number" ? formatNumber(v) : String(v))}
        />
        <Scatter
          data={data as Record<string, number>[]}
          fill="var(--chart-1)"
          fillOpacity={0.7}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
