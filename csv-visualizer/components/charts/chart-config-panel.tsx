"use client";

import { useState } from "react";
import { useDatasetStore } from "@/store/dataset-store";
import { recommendCharts } from "@/lib/charts/recommend";
import { nanoid } from "nanoid";
import type { ChartType, Aggregation, Encoding } from "@/lib/charts/types";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";

const CHART_TYPES: ChartType[] = [
  "bar", "line", "area", "scatter", "pie", "kpi", "heatmap", "table",
];

const AGG_OPTIONS: Aggregation[] = ["sum", "avg", "count", "min", "max", "none"];

export function ChartConfigPanel() {
  const dataset = useDatasetStore((s) => s.dataset);
  const addChart = useDatasetStore((s) => s.addChart);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ChartType>("bar");
  const [title, setTitle] = useState("");
  const [encoding, setEncoding] = useState<Encoding>({ aggregate: "sum" });

  if (!dataset) return null;

  const cols = dataset.columns.map((c) => c.name);

  function handleAdd() {
    const t = title.trim() || `${type} chart`;
    addChart({ id: nanoid(), type, title: t, encoding });
    setTitle("");
    setOpen(false);
  }

  function handleSuggest() {
    const suggestions = recommendCharts(dataset!.columns);
    suggestions.forEach((c) => addChart({ ...c, id: nanoid() }));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          onClick={handleSuggest}
          className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-accent/20 hover:bg-accent/30 text-accent transition-colors"
        >
          Re-suggest charts
        </button>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Custom
          {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-2 rounded-xl border border-border p-3 text-xs bg-card">
          <div className="flex flex-col gap-1">
            <label className="text-muted-foreground">Chart type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ChartType)}
              className="bg-background border border-border rounded px-2 py-1"
            >
              {CHART_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-muted-foreground">Title (optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`${type} chart`}
              className="bg-background border border-border rounded px-2 py-1 placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {(["x", "y", "series"] as const).slice(0, type === "kpi" ? 1 : 3).map((enc) => (
              <div key={enc} className="flex flex-col gap-1">
                <label className="text-muted-foreground capitalize">{enc} axis</label>
                <select
                  value={encoding[enc] ?? ""}
                  onChange={(e) =>
                    setEncoding((prev) => ({ ...prev, [enc]: e.target.value || undefined }))
                  }
                  className="bg-background border border-border rounded px-2 py-1"
                >
                  <option value="">— none —</option>
                  {cols.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            ))}

            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground">Aggregate</label>
              <select
                value={encoding.aggregate ?? "sum"}
                onChange={(e) =>
                  setEncoding((prev) => ({ ...prev, aggregate: e.target.value as Aggregation }))
                }
                className="bg-background border border-border rounded px-2 py-1"
              >
                {AGG_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="mt-1 px-3 py-1.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors font-medium"
          >
            Add chart
          </button>
        </div>
      )}
    </div>
  );
}
