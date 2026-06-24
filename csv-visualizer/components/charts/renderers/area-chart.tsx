"use client";

import {
  AreaChart,
  Area,
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

export function AreaChartRenderer({ data, config }: Props) {
  const { x, y } = config.encoding;
  if (!x) return null;

  const seriesKeys = y
    ? [y]
    : Object.keys(data[0] ?? {}).filter((k) => k !== x);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
        <defs>
          {seriesKeys.map((key, i) => (
            <linearGradient key={key} id={`area-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
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
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stroke={COLORS[i % COLORS.length]}
            fill={`url(#area-${i})`}
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
