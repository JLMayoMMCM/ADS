"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { AggRow } from "@/lib/charts/aggregate";
import type { ChartConfig } from "@/lib/charts/types";
import { formatNumber } from "@/lib/utils";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

interface Props {
  data: AggRow[];
  config: ChartConfig;
}

export function BarChartRenderer({ data, config }: Props) {
  const { x, y, series } = config.encoding;
  if (!x || (!y && !series)) return null;

  const seriesKeys = y
    ? [y]
    : Object.keys(data[0] ?? {}).filter((k) => k !== x);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
        <XAxis
          dataKey={x}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatNumber}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            fontSize: 12,
          }}
          formatter={(v) => (typeof v === "number" ? formatNumber(v) : String(v))}
        />
        {seriesKeys.length > 1 && <Legend wrapperStyle={{ fontSize: 11 }} />}
        {seriesKeys.map((key, i) => (
          <Bar key={key} dataKey={key} fill={COLORS[i % COLORS.length]} radius={[3, 3, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
