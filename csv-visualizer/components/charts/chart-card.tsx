"use client";

import { useMemo, useState } from "react";
import { useDatasetStore } from "@/store/dataset-store";
import { aggregateForChart } from "@/lib/charts/aggregate";
import type { ChartConfig, ChartType, Aggregation, Encoding } from "@/lib/charts/types";
import { BarChartRenderer } from "./renderers/bar-chart";
import { LineChartRenderer } from "./renderers/line-chart";
import { AreaChartRenderer } from "./renderers/area-chart";
import { ScatterChartRenderer } from "./renderers/scatter-chart";
import { PieChartRenderer } from "./renderers/pie-chart";
import { KpiCard } from "./renderers/kpi-card";
import { HeatmapRenderer } from "./renderers/heatmap";
import { DataTable } from "@/components/data-table/data-table";
import { Pencil, Trash2, X, Check } from "lucide-react";

const CHART_TYPES: ChartType[] = [
  "bar", "line", "area", "scatter", "pie", "kpi", "heatmap", "table",
];
const AGG_OPTIONS: Aggregation[] = ["sum", "avg", "count", "min", "max", "none"];

function ChartRenderer({ config, data }: { config: ChartConfig; data: ReturnType<typeof aggregateForChart> }) {
  if (config.type === "table") return <DataTable />;

  const props = { data, config };
  switch (config.type) {
    case "bar":    return <BarChartRenderer {...props} />;
    case "line":   return <LineChartRenderer {...props} />;
    case "area":   return <AreaChartRenderer {...props} />;
    case "scatter": return <ScatterChartRenderer {...props} />;
    case "pie":    return <PieChartRenderer {...props} />;
    case "kpi":    return <KpiCard {...props} />;
    case "heatmap": return <HeatmapRenderer {...props} />;
    default:       return null;
  }
}

interface Props {
  config: ChartConfig;
}

export function ChartCard({ config }: Props) {
  const dataset = useDatasetStore((s) => s.dataset);
  const updateChart = useDatasetStore((s) => s.updateChart);
  const removeChart = useDatasetStore((s) => s.removeChart);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ChartConfig>(config);

  const cols = dataset?.columns.map((c) => c.name) ?? [];

  const data = useMemo(
    () => (dataset ? aggregateForChart(dataset.rows, config) : []),
    [dataset, config]
  );

  function saveEdit() {
    updateChart(config.id, draft);
    setEditing(false);
  }

  function cancelEdit() {
    setDraft(config);
    setEditing(false);
  }

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden h-80">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        {editing ? (
          <input
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            className="text-sm font-medium bg-transparent border-b border-accent outline-none flex-1 mr-2"
          />
        ) : (
          <span className="text-sm font-medium truncate">{config.title}</span>
        )}
        <div className="flex items-center gap-1 ml-2 shrink-0">
          {editing ? (
            <>
              <button onClick={saveEdit} className="p-1 hover:text-accent transition-colors"><Check className="h-3.5 w-3.5" /></button>
              <button onClick={cancelEdit} className="p-1 hover:text-destructive transition-colors"><X className="h-3.5 w-3.5" /></button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="p-1 hover:text-accent transition-colors text-muted-foreground"><Pencil className="h-3.5 w-3.5" /></button>
              <button onClick={() => removeChart(config.id)} className="p-1 hover:text-destructive transition-colors text-muted-foreground"><Trash2 className="h-3.5 w-3.5" /></button>
            </>
          )}
        </div>
      </div>

      {/* inline encoding editor */}
      {editing && config.type !== "table" && (
        <div className="flex flex-wrap gap-2 px-4 py-2 bg-muted/20 border-b border-border text-xs">
          {(["x", "y", "series"] as const).map((enc) => (
            <label key={enc} className="flex items-center gap-1 text-muted-foreground">
              <span className="capitalize">{enc}:</span>
              <select
                value={draft.encoding[enc] ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    encoding: { ...d.encoding, [enc]: e.target.value || undefined } as Encoding,
                  }))
                }
                className="bg-background border border-border rounded px-1 py-0.5"
              >
                <option value="">—</option>
                {cols.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
          ))}
          <label className="flex items-center gap-1 text-muted-foreground">
            <span>agg:</span>
            <select
              value={draft.encoding.aggregate ?? "sum"}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  encoding: { ...d.encoding, aggregate: e.target.value as Aggregation },
                }))
              }
              className="bg-background border border-border rounded px-1 py-0.5"
            >
              {AGG_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-1 text-muted-foreground">
            <span>type:</span>
            <select
              value={draft.type}
              onChange={(e) =>
                setDraft((d) => ({ ...d, type: e.target.value as ChartType }))
              }
              className="bg-background border border-border rounded px-1 py-0.5"
            >
              {CHART_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
        </div>
      )}

      {/* chart body */}
      <div className="flex-1 min-h-0 p-3">
        <ChartRenderer config={editing ? draft : config} data={data} />
      </div>
    </div>
  );
}
