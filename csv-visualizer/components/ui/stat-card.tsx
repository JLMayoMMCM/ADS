import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  accent?: boolean;
  className?: string;
  icon?: ReactNode;
}

export function StatCard({ label, value, sub, trend, trendValue, accent, className, icon }: StatCardProps) {
  return (
    <div className={cn(
      "flex flex-col gap-1.5 rounded-xl border p-3 transition-colors",
      accent
        ? "border-eu-gold/50 bg-eu-gold/8 dark:bg-eu-gold/5"
        : "border-eu-border bg-eu-card",
      className
    )}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.10em] leading-tight">{label}</span>
        {icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
      </div>
      <p className={cn(
        "text-2xl font-bold tabular-nums leading-none tracking-tight",
        accent ? "text-eu-gold" : "text-foreground"
      )}>
        {value}
      </p>
      {(sub || trendValue) && (
        <div className="flex items-center gap-1 mt-0.5">
          {sub && <span className="text-[11px] text-muted-foreground">{sub}</span>}
          {trendValue && trend && (
            <span className={cn(
              "text-[11px] font-semibold",
              trend === "up"   ? "text-eu-green" :
              trend === "down" ? "text-eu-red"   : "text-muted-foreground"
            )}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
