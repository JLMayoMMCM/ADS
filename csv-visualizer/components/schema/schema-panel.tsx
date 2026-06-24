"use client";

import { useDatasetStore } from "@/store/dataset-store";
import { ColumnBadge } from "./column-badge";
import { formatNumber } from "@/lib/utils";
import { Database } from "lucide-react";

export function SchemaPanel() {
  const dataset = useDatasetStore((s) => s.dataset);

  if (!dataset) return null;

  return (
    <aside className="flex flex-col gap-3 h-full overflow-y-auto">
      <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
        <Database className="h-3.5 w-3.5" />
        <span className="truncate font-medium">{dataset.fileName}</span>
        <span className="ml-auto shrink-0">{dataset.rows.length.toLocaleString()} rows</span>
      </div>

      <div className="flex flex-col gap-1">
        {dataset.columns.map((col) => (
          <div
            key={col.name}
            className="group rounded-lg px-3 py-2 bg-card hover:bg-card/80 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium truncate">{col.name}</span>
              <ColumnBadge type={col.type} />
            </div>
            <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
              <span>{col.cardinality} unique</span>
              {col.nullCount > 0 && <span>{col.nullCount} null</span>}
              {col.min !== undefined && col.max !== undefined && (
                <span>
                  {typeof col.min === "number" ? formatNumber(col.min) : col.min}
                  {" – "}
                  {typeof col.max === "number" ? formatNumber(col.max) : col.max}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {dataset.parseErrors.length > 0 && (
        <details className="text-xs text-amber-400 px-1">
          <summary className="cursor-pointer">
            {dataset.parseErrors.length} parse warning{dataset.parseErrors.length > 1 ? "s" : ""}
          </summary>
          <ul className="mt-1 space-y-0.5 list-disc list-inside text-muted-foreground">
            {dataset.parseErrors.slice(0, 10).map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </details>
      )}
    </aside>
  );
}
