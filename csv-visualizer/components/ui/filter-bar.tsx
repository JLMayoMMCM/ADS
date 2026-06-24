"use client";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { YEARS } from "@/data/energy";

/* ── Year Range Slider ─────────────────────────────────────────────────────── */
interface YearSliderProps {
  value: [number, number];
  onChange: (v: [number, number]) => void;
}

export function YearRangeSlider({ value, onChange }: YearSliderProps) {
  return (
    <div className="flex items-center gap-3 flex-1 min-w-[320px]">
      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap shrink-0">Year</span>
      <div className="flex-1">
        <Slider
          min={0} max={5} step={1}
          value={value}
          onValueChange={(v) => onChange(v as [number, number])}
          className="w-full"
        />
        <div className="flex justify-between mt-1">
          {YEARS.map((y, i) => (
            <span key={y} className={cn(
              "text-[9px] tabular-nums transition-colors",
              i >= value[0] && i <= value[1] ? "text-eu-gold font-bold" : "text-muted-foreground"
            )}>{y}</span>
          ))}
        </div>
      </div>
      <span className="text-[11px] font-bold text-eu-gold whitespace-nowrap tabular-nums shrink-0 w-[84px] text-right">
        {YEARS[value[0]]}–{YEARS[value[1]]}
      </span>
    </div>
  );
}

/* ── Fuel Chip Multi-Select ────────────────────────────────────────────────── */
interface FuelChipsProps {
  fuels: string[];
  selected: Set<string>;
  colors: Record<string, string>;
  onChange: (s: Set<string>) => void;
}

export function FuelChips({ fuels, selected, colors, onChange }: FuelChipsProps) {
  const toggle = (f: string) => {
    const next = new Set(selected);
    if (next.has(f)) {
      next.delete(f);
    } else {
      next.add(f);
    }
    if (next.size > 0) onChange(next);
  };
  const all = selected.size === fuels.length;
  const toggleAll = () => onChange(all ? new Set([fuels[0]]) : new Set(fuels));

  return (
    <div className="flex items-center flex-wrap gap-1.5">
      <button onClick={toggleAll} className={cn(
        "px-2.5 py-0.5 rounded-full text-[10px] font-semibold border transition-colors",
        all
          ? "bg-eu-blue text-white border-eu-blue"
          : "border-eu-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
      )}>
        All
      </button>
      {fuels.map(f => {
        const on = selected.has(f);
        const color = colors[f] ?? "#888";
        return (
          <button key={f} onClick={() => toggle(f)} className={cn(
            "px-2.5 py-0.5 rounded-full text-[10px] font-medium border transition-colors",
            on ? "text-white" : "border-eu-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
          )} style={on ? { background: color, borderColor: color } : {}}>
            {f.split(" ")[0]}
          </button>
        );
      })}
    </div>
  );
}

/* ── Country Search ─────────────────────────────────────────────────────────── */
interface CountryFilterProps {
  query: string;
  onQuery: (q: string) => void;
  topN: number;
  onTopN: (n: number) => void;
}

export function CountryFilter({ query, onQuery, topN, onTopN }: CountryFilterProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative">
        <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text" placeholder="Search country…" value={query}
          onChange={e => onQuery(e.target.value)}
          className="pl-7 pr-3 py-1 text-[11px] rounded-lg border border-eu-border bg-eu-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring w-36"
        />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-muted-foreground whitespace-nowrap">Top</span>
        {[5, 10, 15, 27].map(n => (
          <button key={n} onClick={() => onTopN(n)} className={cn(
            "w-7 h-6 rounded text-[10px] font-semibold border transition-colors",
            topN === n
              ? "bg-eu-blue dark:bg-eu-gold text-white dark:text-black border-eu-blue dark:border-eu-gold"
              : "border-eu-border text-muted-foreground hover:text-foreground"
          )}>
            {n === 27 ? "All" : n}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Generic Filter Bar wrapper ─────────────────────────────────────────────── */
export function FilterBar({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "flex items-center gap-4 flex-wrap px-5 py-2 border-b border-eu-border bg-eu-card/60 backdrop-blur-sm shrink-0 min-h-[44px]",
      className
    )}>
      {children}
    </div>
  );
}
