"use client";

import { useDatasetStore } from "@/store/dataset-store";
import { ChartCard } from "./chart-card";
import { BarChart2 } from "lucide-react";

export function ChartCanvas() {
  const charts = useDatasetStore((s) => s.charts);

  if (charts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
        <BarChart2 className="h-10 w-10" />
        <p className="text-sm">No charts yet — add one from the left panel.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-min content-start">
      {charts.map((c) => (
        <ChartCard key={c.id} config={c} />
      ))}
    </div>
  );
}
