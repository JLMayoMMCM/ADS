"use client";
import { useState } from "react";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { StatCard } from "@/components/ui/stat-card";
import { FilterBar, YearRangeSlider } from "@/components/ui/filter-bar";
import { gepTotals, ghpTotals, fuelMixTimeSeries, YEARS } from "@/data/energy";
import { formatGWh, formatPct } from "@/lib/utils";
import { cn } from "@/lib/utils";

const TTP = {
  contentStyle: { background: "var(--eu-card)", border: "1px solid var(--eu-border)", borderRadius: 8, fontSize: 12, color: "var(--foreground)", padding: "8px 12px" },
  labelStyle: { color: "var(--muted-foreground)", fontSize: 11, fontWeight: 600 },
  itemStyle: { fontSize: 12 },
};
const TICK = { fontSize: 11, fill: "var(--muted-foreground)" };
const LGND = { fontSize: 11 };


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

export function OverviewDashboard() {
  const [yr, setYr] = useState<[number, number]>([0, 5]);
  const yearsSlice = YEARS.slice(yr[0], yr[1] + 1);

  const combined = yearsSlice.map(y => {
    const i = YEARS.indexOf(y as typeof YEARS[number]);
    return { year: y, Electricity: gepTotals[i], Heat: ghpTotals[i] };
  });

  const renew = yearsSlice.map(y => {
    const i = YEARS.indexOf(y as typeof YEARS[number]);
    const r = fuelMixTimeSeries[i];
    return {
      year: y,
      Renewable: r["Renewables & Biofuels"],
      Nuclear:   r["Nuclear"],
      Fossil:    r["Natural Gas"] + r["Solid Fossil Fuels"] + r["Oil & Petroleum"] + r["Lignite"],
    };
  });

  const renew2024 = fuelMixTimeSeries.at(-1)!["Renewables & Biofuels"];
  const elec2024  = gepTotals.at(-1)!;
  const heat2024  = ghpTotals.at(-1)!;
  const elecPct   = ((elec2024 - gepTotals[0]) / gepTotals[0] * 100).toFixed(1);
  const heatPct   = ((heat2024 - ghpTotals[0]) / ghpTotals[0] * 100).toFixed(1);
  const renewPp   = (renew2024 - fuelMixTimeSeries[0]["Renewables & Biofuels"]).toFixed(1);

  return (
    <div className="flex flex-col overflow-visible md:h-full md:overflow-hidden">
      <FilterBar>
        <YearRangeSlider value={yr} onChange={setYr} />
      </FilterBar>

      <div className="flex flex-col gap-3 p-4 overflow-visible md:flex-1 md:min-h-0 md:overflow-hidden">
        <div className="shrink-0 flex items-baseline gap-3 flex-wrap">
          <h2 className="text-xl font-bold text-foreground">EU-27 Energy Overview</h2>
          <p className="text-xs text-muted-foreground">Gross electricity &amp; heat production, 1999–2024 · Source: Eurostat</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
          <StatCard label="Total Electricity 2024" value={formatGWh(elec2024)}  trend={Number(elecPct)>=0?"up":"down"} trendValue={`${elecPct}% vs 1999`} />
          <StatCard label="Total Heat 2024"         value={formatGWh(heat2024)}  trend={Number(heatPct)>=0?"up":"down"} trendValue={`${heatPct}% vs 1999`} />
          <StatCard label="Renewable Share 2024"    value={formatPct(renew2024)} accent trend="up" trendValue={`+${renewPp} pp since 1999`} />
          <StatCard label="Nuclear Share 2024"      value={formatPct(fuelMixTimeSeries.at(-1)!["Nuclear"])} trend="down"
            trendValue={`Was ${formatPct(fuelMixTimeSeries[0]["Nuclear"])} in 1999`} />
        </div>

        <div className="grid grid-cols-1 gap-3 md:flex-1 md:min-h-0 md:grid-cols-2 md:auto-rows-fr">
          <ChartCard
            className="h-[320px] md:h-full"
            title="Electricity vs Heat Production"
            sub="GWh per 5-year interval — use year slider above to zoom."
            insight="Electricity has remained broadly stable (~2.5–2.9 TWh) while heat declined ~4% since 2004 as building efficiency improved.">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={combined} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--eu-border)" />
                <XAxis dataKey="year" tick={TICK} />
                <YAxis tickFormatter={v => `${(v/1e6).toFixed(1)}M`} tick={TICK} axisLine={false} tickLine={false} />
                <Tooltip {...TTP} formatter={(v: unknown) => typeof v === "number" ? formatGWh(v) : String(v)} />
                <Legend wrapperStyle={LGND} />
                <Line type="monotone" dataKey="Electricity" stroke="#003399" strokeWidth={3} dot={{ r: 5, fill: "#003399" }} activeDot={{ r: 7 }} />
                <Line type="monotone" dataKey="Heat"        stroke="#FFCC00" strokeWidth={3} dot={{ r: 5, fill: "#FFCC00" }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            className="h-[320px] md:h-full"
            title="Electricity Source Mix"
            sub="Proportional share: Renewable vs Nuclear vs Fossil in EU-27 gross electricity."
            insight="Renewables surpassed nuclear in 2009 and have grown continuously; fossil dropped from ~56% (1999) to ~33% (2024).">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={renew} margin={{ top: 4, right: 12, bottom: 0, left: 0 }} stackOffset="expand">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--eu-border)" />
                <XAxis dataKey="year" tick={TICK} />
                <YAxis tickFormatter={v => `${(v*100).toFixed(0)}%`} tick={TICK} axisLine={false} tickLine={false} />
                <Tooltip {...TTP} formatter={(v: unknown) => typeof v === "number" ? formatPct(v) : String(v)} />
                <Legend wrapperStyle={LGND} />
                <Area type="monotone" dataKey="Renewable" stackId="1" stroke="#22C55E" fill="#22C55E" fillOpacity={0.85} />
                <Area type="monotone" dataKey="Nuclear"   stackId="1" stroke="#1A52B8" fill="#1A52B8" fillOpacity={0.85} />
                <Area type="monotone" dataKey="Fossil"    stackId="1" stroke="#64748B" fill="#64748B" fillOpacity={0.85} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
