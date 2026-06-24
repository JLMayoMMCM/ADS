import { cn } from "@/lib/utils";
import type { ColumnType } from "@/types/dataset";

const COLOR: Record<ColumnType, string> = {
  number: "bg-blue-500/20 text-blue-300",
  string: "bg-violet-500/20 text-violet-300",
  date: "bg-emerald-500/20 text-emerald-300",
  boolean: "bg-amber-500/20 text-amber-300",
};

export function ColumnBadge({ type }: { type: ColumnType }) {
  return (
    <span className={cn("text-xs px-1.5 py-0.5 rounded font-mono uppercase tracking-wide", COLOR[type])}>
      {type}
    </span>
  );
}
