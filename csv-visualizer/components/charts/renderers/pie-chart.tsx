"use client";

import {
  PieChart,
  Pie,
  Cell,
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

export function PieChartRenderer({ data, config }: Props) {
  const { x, y } = config.encoding;
  if (!x || !y) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey={y}
          nameKey={x}
          cx="50%"
          cy="50%"
          innerRadius="35%"
          outerRadius="65%"
          paddingAngle={2}
          label={({ name, percent }) =>
            (percent ?? 0) > 0.05
              ? `${String(name).slice(0, 12)} ${((percent ?? 0) * 100).toFixed(0)}%`
              : ""
          }
          labelLine={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            fontSize: 12,
          }}
          formatter={(v) => (typeof v === "number" ? formatNumber(v) : String(v))}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
