"use client";
import { useState } from "react";
import { LineChart, Line, BarChart, Bar,
         XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from "recharts";
import { FilterBar, YearRangeSlider, FuelChips } from "@/components/ui/filter-bar";
import { trendAbsolute, trendGrowth, FUEL_COLORS, YEARS } from "@/data/energy";
import { formatGWh } from "@/lib/utils";
import { cn } from "@/lib/utils";

const TTP = {
  contentStyle: { background: "var(--eu-card)", border: "1px solid var(--eu-border)", borderRadius: 8, fontSize: 12, color: "var(--foreground)", padding: "8px 12px" },
  labelStyle: { color: "var(--muted-foreground)", fontSize: 11, fontWeight: 600 },
  itemStyle: { fontSize: 12 },
};
const TICK = { fontSize: 11, fill: "var(--muted-foreground)" };
const LGND = { fontSize: 11 };

const TREND_FUELS = ["Renewables & Biofuels","Wind","Solar PV","Nuclear","Natural Gas","Solid Fossil Fuels"];

function ChartCard({ title, sub, insight, children, className }: { title: string; sub?: string; insight?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-eu-border bg-eu-card p-3 flex flex-col gap-2", className)}>
      <div className="shrink-0">
        <p className="text-sm font-bold text-foreground leading-tight">{title}</p>
        {sub && <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{sub}</p>}
      </div>
      <div className="flex-1 min-h-0">
        {children}
      </div>
      {insight && (
        <p className="text-[11px] text-muted-foreground border-t border-eu-border pt-1.5 leading-relaxed shrink-0">
          <span className="font-semibold text-foreground">Insight: </span>{insight}
        </p>
      )}
    </div>
  );
}

export function TrendsDashboard() {
  const [yr, setYr] = useState<[number, number]>([0, 5]);
  const [fuels, setFuels] = useState(new Set(TREND_FUELS));

  const yearsSlice = YEARS.slice(yr[0], yr[1] + 1);
  const absSlice   = trendAbsolute.filter(r => yearsSlice.includes(r.year as typeof YEARS[number]));
  const pctSlice   = trendGrowth.filter(r => yearsSlice.includes(r.year as typeof YEARS[number]));
  const active     = TREND_FUELS.filter(f => fuels.has(f));

  const bar2024 = TREND_FUELS
    .filter(f => fuels.has(f))
    .map(f => ({ fuel: f.split(" ")[0], full: f, pct: trendGrowth.at(-1)![f] ?? 0 }));

  return (
    <div className="flex flex-col overflow-visible md:h-full md:overflow-hidden">
      <FilterBar>
        <YearRangeSlider value={yr} onChange={setYr} />
        <div className="w-px h-5 bg-eu-border hidden sm:block shrink-0" />
        <FuelChips fuels={TREND_FUELS} selected={fuels} colors={FUEL_COLORS} onChange={setFuels} />
      </FilterBar>

      <div className="flex flex-col gap-3 p-4 overflow-visible md:flex-1 md:min-h-0 md:overflow-hidden">
        <div className="shrink-0 flex items-baseline gap-3 flex-wrap">
          <h2 className="text-xl font-bold text-foreground">Electricity Production Trends · 1999–2024</h2>
          <p className="text-xs text-muted-foreground">Absolute GWh &amp; % change vs 1999 baseline · Toggle fuels to compare</p>
        </div>

        <div className="flex flex-col gap-3 overflow-visible md:flex-1 md:min-h-0 md:overflow-hidden">
          <div className="md:flex-[3_3_0%] md:min-h-0">
            <ChartCard className="h-[360px] md:h-full"
              title="Absolute GWh Output by Fuel"
              sub="GWh per 5-year interval. Use year slider and fuel toggles to compare."
              insight="Renewables grew from 378K GWh (1999) to 1,292K GWh (2024) — +242%. Solid Fossil Fuels dropped from 744K to 272K GWh (−63%).">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={absSlice} margin={{ top: 4, right: 20, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--eu-border)" />
                  <XAxis dataKey="year" tick={TICK} />
                  <YAxis tickFormatter={v => `${(v/1e3).toFixed(0)}K`} tick={TICK} axisLine={false} tickLine={false} />
                  <Tooltip {...TTP} formatter={(v: unknown) => typeof v === "number" ? formatGWh(v) : String(v)} />
                  <Legend wrapperStyle={LGND} />
                  {active.map(f => (
                    <Line key={f} type="monotone" dataKey={f}
                      stroke={FUEL_COLORS[f] ?? "#888"} strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="grid grid-cols-1 gap-3 md:flex-[2_2_0%] md:min-h-0 md:grid-cols-2 md:auto-rows-fr">
            <ChartCard className="h-[320px] md:h-full"
              title="% Growth vs 1999 Baseline"
              sub="% change from 1999. Chart capped at ±300% — Wind/Solar PV have extreme outlier values (thousands of %)."
              insight="Solar PV grew 345,276% from 1999–2024 (86 GWh → 297K GWh). Nuclear declined 23.4%.">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pctSlice} margin={{ top: 4, right: 20, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--eu-border)" />
                  <XAxis dataKey="year" tick={TICK} />
                  <YAxis tickFormatter={v => `${v.toFixed(0)}%`} tick={TICK} axisLine={false} tickLine={false} domain={[-100, 300]} />
                  <Tooltip {...TTP} formatter={(v: unknown) => typeof v === "number" ? `${v.toFixed(1)}%` : String(v)} />
                  <ReferenceLine y={0} stroke="var(--eu-border)" strokeDasharray="4 2" strokeWidth={2} />
                  <Legend wrapperStyle={LGND} />
                  {active.map(f => (
                    <Line key={f} type="monotone" dataKey={f}
                      stroke={FUEL_COLORS[f] ?? "#888"} strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard className="h-[320px] md:h-full"
              title="2024 Change vs 1999 — Net Shift"
              sub="Bar shows % gain or loss from 1999 to 2024 for each selected fuel."
              insight="Green bars = net growth (renewables); blue bars = net decline (fossil fuels and nuclear). The contrast captures the energy transition.">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bar2024} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--eu-border)" />
                  <XAxis dataKey="fuel" tick={TICK} />
                  <YAxis tickFormatter={v => `${v.toFixed(0)}%`} tick={TICK} axisLine={false} tickLine={false} />
                  <Tooltip {...TTP} formatter={(v: unknown) => typeof v === "number" ? `${v.toFixed(1)}%` : String(v)} />
                  <ReferenceLine y={0} stroke="var(--eu-border)" strokeWidth={2} />
                  <Bar dataKey="pct" name="Change vs 1999" radius={[4, 4, 0, 0]}>
                    {bar2024.map((d, i) => <Cell key={i} fill={d.pct >= 0 ? "#22C55E" : "#4B80D4"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
}
