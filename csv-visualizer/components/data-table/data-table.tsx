"use client";

import { useDatasetStore } from "@/store/dataset-store";
import { useMemo, useState } from "react";

const PAGE_SIZE = 100;

export function DataTable() {
  const dataset = useDatasetStore((s) => s.dataset);
  const [page, setPage] = useState(0);

  const columns = useMemo(
    () => dataset?.columns.map((c) => c.name) ?? [],
    [dataset]
  );

  const rows = useMemo(
    () => dataset?.rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE) ?? [],
    [dataset, page]
  );

  if (!dataset) return null;
  const totalPages = Math.ceil(dataset.rows.length / PAGE_SIZE);

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="overflow-auto flex-1 rounded-lg border border-border">
        <table className="w-full text-xs border-collapse">
          <thead className="sticky top-0 bg-card z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap border-b border-border"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0"
              >
                {columns.map((col) => (
                  <td
                    key={col}
                    className="px-3 py-1.5 text-muted-foreground whitespace-nowrap max-w-48 truncate"
                  >
                    {String(row[col] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>
            Rows {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, dataset.rows.length)} of{" "}
            {dataset.rows.length.toLocaleString()}
          </span>
          <div className="flex gap-1">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="px-2 py-0.5 rounded border border-border disabled:opacity-30 hover:bg-muted/50"
            >
              ‹
            </button>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="px-2 py-0.5 rounded border border-border disabled:opacity-30 hover:bg-muted/50"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
