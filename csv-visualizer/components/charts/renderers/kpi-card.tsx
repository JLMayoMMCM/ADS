"use client";

import type { AggRow } from "@/lib/charts/aggregate";
import type { ChartConfig } from "@/lib/charts/types";
import { formatNumber } from "@/lib/utils";

interface Props {
  data: AggRow[];
  config: ChartConfig;
}

export function KpiCard({ data, config }: Props) {
  const value = data[0]?.value;
  const { aggregate = "sum", y } = config.encoding;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-2">
      <p className="text-sm text-muted-foreground uppercase tracking-widest">
        {aggregate !== "none" ? aggregate : ""} {y ?? "value"}
      </p>
      <p className="text-5xl font-bold tabular-nums text-foreground">
        {value !== undefined && value !== null ? formatNumber(Number(value)) : "—"}
      </p>
    </div>
  );
}
