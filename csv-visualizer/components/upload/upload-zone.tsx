"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseCsv } from "@/lib/csv/parser";
import { useDatasetStore } from "@/store/dataset-store";
import { recommendCharts } from "@/lib/charts/recommend";

export function UploadZone() {
  const loadDataset = useDatasetStore((s) => s.loadDataset);
  const addChart = useDatasetStore((s) => s.addChart);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (accepted.length === 0) return;
      setError(null);
      setLoading(true);
      const file = accepted[0];
      const result = await parseCsv(file);
      setLoading(false);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (!result.dataset) return;
      loadDataset(result.dataset);
      const suggestions = recommendCharts(result.dataset.columns);
      suggestions.forEach((c) => addChart(c));
    },
    [loadDataset, addChart]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
    onDropRejected: () => setError("Please drop a single CSV file."),
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center justify-center gap-3 w-full max-w-lg h-52 rounded-2xl border-2 border-dashed cursor-pointer transition-colors",
          isDragActive
            ? "border-accent bg-accent/10"
            : "border-muted hover:border-accent/60 hover:bg-accent/5"
        )}
      >
        <input {...getInputProps()} />
        <Upload
          className={cn(
            "h-10 w-10 transition-colors",
            isDragActive ? "text-accent" : "text-muted-foreground"
          )}
        />
        {loading ? (
          <p className="text-sm text-muted-foreground">Parsing…</p>
        ) : isDragActive ? (
          <p className="text-sm text-accent">Drop it here</p>
        ) : (
          <div className="text-center">
            <p className="text-sm font-medium">Drag & drop a CSV file</p>
            <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center max-w-xs">
        Your file is processed in your browser and never uploaded.
      </p>
    </div>
  );
}
