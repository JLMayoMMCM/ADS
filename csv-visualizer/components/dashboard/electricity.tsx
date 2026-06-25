"use client";
import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
         XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { StatCard } from "@/components/ui/stat-card";
import { FilterBar, YearRangeSlider, FuelChips } from "@/components/ui/filter-bar";
import { gepTimeSeries, fuelMixTimeSeries, gepTotals, FUEL_COLORS, YEARS } from "@/data/energy";
import { formatGWh, formatPct } from "@/lib/utils";
import { cn } from "@/lib/utils";

const TTP = {
  contentStyle: { background: "var(--eu-card)", border: "1px solid var(--eu-border)", borderRadius: 8, fontSize: 12, color: "var(--foreground)", padding: "8px 12px" },
  labelStyle: { color: "var(--muted-foreground)", fontSize: 11, fontWeight: 600 },
  itemStyle: { fontSize: 12 },
};
const TICK = { fontSize: 11, fill: "var(--muted-foreground)" };
const LGND = { fontSize: 11 };

const ALL_FUELS = ["Nuclear","Natural Gas","Solid Fossil Fuels","Lignite","Oil & Petroleum","Hydro","Wind","Solar PV","Bioenergy","Waste"];

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

export function ElectricityDashboard() {
  const [yr, setYr] = useState<[number, number]>([0, 5]);
  const [fuels, setFuels] = useState(new Set(ALL_FUELS));

  const yearsSlice  = YEARS.slice(yr[0], yr[1] + 1);
  const gepSlice    = gepTimeSeries.filter(r => yearsSlice.includes(r.year as typeof YEARS[number]));
  const mixSlice    = fuelMixTimeSeries.filter(r => yearsSlice.includes(r.year as typeof YEARS[number]));
  const activeFuels = ALL_FUELS.filter(f => fuels.has(f));

  const mix2024 = fuelMixTimeSeries.at(-1)!;
  const pieData = ALL_FUELS
    .filter(f => fuels.has(f))
    .map(f => ({ name: f, value: parseFloat((mix2024[f] as number ?? 0).toFixed(2)) }))
    .filter(d => d.value > 0.05)
    .sort((a, b) => b.value - a.value);

  const gep2024 = gepTotals.at(-1)!;
  const mix24   = mix2024["Renewables & Biofuels"];
  const wind24  = mix2024["Wind"];
  const solar24 = mix2024["Solar PV"];

  return (
    <div className="flex flex-col overflow-visible md:h-full md:overflow-hidden">
      <FilterBar>
        <YearRangeSlider value={yr} onChange={setYr} />
        <div className="w-px h-5 bg-eu-border hidden sm:block shrink-0" />
        <FuelChips fuels={ALL_FUELS} selected={fuels} colors={FUEL_COLORS} onChange={setFuels} />
      </FilterBar>

      <div className="flex flex-col gap-3 p-4 overflow-visible md:flex-1 md:min-h-0 md:overflow-hidden">
        <div className="shrink-0 flex items-baseline gap-3 flex-wrap">
          <h2 className="text-xl font-bold text-foreground">Gross Electricity Production · EU-27</h2>
          <p className="text-xs text-muted-foreground">Fuel-mix breakdown, 1999–2024 · GWh · Toggle fuels above to compare</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
          <StatCard label="Total GEP 2024"     value={formatGWh(gep2024)} trend="down" trendValue={`${((gep2024-gepTotals[0])/gepTotals[0]*100).toFixed(1)}% vs 1999`} />
          <StatCard label="Renewable Share"     value={formatPct(mix24)}   accent trend="up" trendValue={`Was ${formatPct(fuelMixTimeSeries[0]["Renewables & Biofuels"])} in 1999`} />
          <StatCard label="Wind Share 2024"     value={formatPct(wind24)}  trend="up" trendValue={`Was ${formatPct(fuelMixTimeSeries[0]["Wind"])} in 1999`} />
          <StatCard label="Solar PV Share 2024" value={formatPct(solar24)} trend="up" trendValue="≈0% in 1999" />
        </div>

        <div className="grid grid-cols-1 gap-3 md:flex-1 md:min-h-0 md:grid-cols-2 md:auto-rows-fr">
          <ChartCard className="h-[320px] md:h-full"
            title="GEP by Fuel — Stacked Area"
            sub="GWh per period. Each band = one fuel's contribution."
            insight="Renewables & Biofuels overtook Solid Fossil Fuels ~2009; now 46.5% of total GEP.">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gepSlice} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--eu-border)" />
                <XAxis dataKey="year" tick={TICK} />
                <YAxis tickFormatter={v => `${(v/1e6).toFixed(1)}M`} tick={TICK} axisLine={false} tickLine={false} />
                <Tooltip {...TTP} formatter={(v: unknown) => typeof v === "number" ? formatGWh(v) : String(v)} />
                <Legend wrapperStyle={LGND} />
                {activeFuels.map(f => (
                  <Area key={f} type="monotone" dataKey={f} stackId="1"
                    stroke={FUEL_COLORS[f] ?? "#888"} fill={FUEL_COLORS[f] ?? "#888"} fillOpacity={0.88} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard className="h-[320px] md:h-full"
            title="2024 Fuel Mix — Share of Gross Electricity"
            sub="Percentage breakdown. Legend shows each fuel's share.">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="42%" innerRadius="18%" label={false}>
                  {pieData.map(e => <Cell key={e.name} fill={FUEL_COLORS[e.name] ?? "#888"} />)}
                </Pie>
                <Tooltip {...TTP} formatter={(v: unknown) => typeof v === "number" ? formatPct(v) : String(v)} />
                <Legend wrapperStyle={LGND} formatter={(v, entry) => {
                  const val = (entry.payload as { value?: number } | undefined)?.value;
                  return `${v}: ${typeof val === "number" ? formatPct(val) : ""}`;
                }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard className="h-[320px] md:h-full"
            title="Nuclear vs Renewables — GWh"
            sub="Energy transition crossover: renewables exceeded nuclear in 2014."
            insight="By 2024 renewables produce nearly 2× nuclear — 1,292 TWh vs 650 TWh.">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gepSlice} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--eu-border)" />
                <XAxis dataKey="year" tick={TICK} />
                <YAxis tickFormatter={v => `${(v/1e3).toFixed(0)}K`} tick={TICK} axisLine={false} tickLine={false} />
                <Tooltip {...TTP} formatter={(v: unknown) => typeof v === "number" ? formatGWh(v) : String(v)} />
                <Legend wrapperStyle={LGND} />
                <Line type="monotone" dataKey="Nuclear"               stroke="#1A52B8" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Renewables & Biofuels" stroke="#22C55E" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Wind"                  stroke="#38BDF8" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="6 2" />
                <Line type="monotone" dataKey="Solar PV"              stroke="#FFCC00" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="6 2" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard className="h-[320px] md:h-full"
            title="Fuel Mix % — Stacked Bar"
            sub="Each bar sums to 100% of gross electricity by year."
            insight="Solid Fossil+Lignite fell from 41.8% (1999) to 15.7% (2024); Wind+Solar PV rose from 0.5% to 27.8%.">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mixSlice} margin={{ top: 4, right: 12, bottom: 0, left: 0 }} stackOffset="expand">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--eu-border)" />
                <XAxis dataKey="year" tick={TICK} />
                <YAxis tickFormatter={v => `${(v*100).toFixed(0)}%`} tick={TICK} axisLine={false} tickLine={false} />
                <Tooltip {...TTP} formatter={(v: unknown) => typeof v === "number" ? formatPct(v) : String(v)} />
                <Legend wrapperStyle={LGND} />
                {activeFuels.map(f => <Bar key={f} dataKey={f} stackId="a" fill={FUEL_COLORS[f] ?? "#888"} />)}
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
