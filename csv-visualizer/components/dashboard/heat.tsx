"use client";
import { useState } from "react";
import { AreaChart, Area, PieChart, Pie, Cell, LineChart, Line,
         XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { StatCard } from "@/components/ui/stat-card";
import { FilterBar, YearRangeSlider, FuelChips } from "@/components/ui/filter-bar";
import { ghpTimeSeries, ghpTotals, FUEL_COLORS, YEARS } from "@/data/energy";
import { formatGWh, formatPct } from "@/lib/utils";
import { cn } from "@/lib/utils";

const TTP = {
  contentStyle: { background: "var(--eu-card)", border: "1px solid var(--eu-border)", borderRadius: 8, fontSize: 12, color: "var(--foreground)", padding: "8px 12px" },
  labelStyle: { color: "var(--muted-foreground)", fontSize: 11, fontWeight: 600 },
  itemStyle: { fontSize: 12 },
};
const TICK = { fontSize: 11, fill: "var(--muted-foreground)" };
const LGND = { fontSize: 11 };

const ALL_HEAT_FUELS = ["Natural Gas","Solid Fossil Fuels","Lignite","Oil & Petroleum","Renewables & Biofuels","Waste","Nuclear","Solar Thermal"];

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

export function HeatDashboard() {
  const [yr, setYr] = useState<[number, number]>([0, 5]);
  const [fuels, setFuels] = useState(new Set(ALL_HEAT_FUELS));

  const yearsSlice  = YEARS.slice(yr[0], yr[1] + 1);
  const ghpSlice    = ghpTimeSeries.filter(r => yearsSlice.includes(r.year as typeof YEARS[number]));
  const activeFuels = ALL_HEAT_FUELS.filter(f => fuels.has(f));

  const ghp2024  = ghpTimeSeries.at(-1)!;
  const total24  = ghpTotals.at(-1)!;
  const total99  = ghpTotals[0];
  const renew24  = ghp2024["Renewables & Biofuels"] / total24 * 100;
  const renew99  = ghpTimeSeries[0]["Renewables & Biofuels"] / total99 * 100;
  const gas24    = ghp2024["Natural Gas"] / total24 * 100;
  const fossil24 = (ghp2024["Natural Gas"] + ghp2024["Solid Fossil Fuels"] + ghp2024["Lignite"] + ghp2024["Oil & Petroleum"]) / total24 * 100;

  const pieData = ALL_HEAT_FUELS
    .filter(f => fuels.has(f))
    .map(f => ({ name: f, value: ghp2024[f] > 0 ? parseFloat((ghp2024[f] / total24 * 100).toFixed(2)) : 0 }))
    .filter(d => d.value > 0.05)
    .sort((a, b) => b.value - a.value);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <FilterBar>
        <YearRangeSlider value={yr} onChange={setYr} />
        <div className="w-px h-5 bg-eu-border hidden sm:block shrink-0" />
        <FuelChips fuels={ALL_HEAT_FUELS} selected={fuels} colors={FUEL_COLORS} onChange={setFuels} />
      </FilterBar>

      <div className="flex-1 min-h-0 flex flex-col gap-3 p-4 overflow-hidden">
        <div className="shrink-0 flex items-baseline gap-3 flex-wrap">
          <h2 className="text-xl font-bold text-foreground">Gross Heat Production · EU-27</h2>
          <p className="text-xs text-muted-foreground">District heat &amp; CHP output by fuel, 1999–2024 · GWh</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
          <StatCard label="Total GHP 2024"      value={formatGWh(total24)}  trend={total24>=total99?"up":"down"} trendValue={`${((total24-total99)/total99*100).toFixed(1)}% vs 1999`} />
          <StatCard label="Renewable Heat 2024"  value={formatPct(renew24)}  accent trend="up" trendValue={`Was ${formatPct(renew99)} in 1999`} />
          <StatCard label="Gas Share 2024"       value={formatPct(gas24)}    trend="down" trendValue="Largest single source" />
          <StatCard label="Fossil Share 2024"    value={formatPct(fossil24)} trend="down" trendValue="Gas + Coal + Oil + Lignite" />
        </div>

        <div className="flex-1 min-h-0 flex flex-col gap-3 overflow-hidden">
          <div className="flex-[3_3_0%] min-h-0 grid grid-cols-2 auto-rows-fr gap-3">
            <ChartCard className="h-full"
              title="GHP by Fuel — Stacked Area"
              sub="GWh per period. Toggle fuels above to isolate sources."
              insight="Total heat peaked in 2004 (708 TWh) and has since declined ~21% as building efficiency improved.">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ghpSlice} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--eu-border)" />
                  <XAxis dataKey="year" tick={TICK} />
                  <YAxis tickFormatter={v => `${(v/1e3).toFixed(0)}K`} tick={TICK} axisLine={false} tickLine={false} />
                  <Tooltip {...TTP} formatter={(v: unknown) => typeof v === "number" ? formatGWh(v) : String(v)} />
                  <Legend wrapperStyle={LGND} />
                  {activeFuels.map(f => (
                    <Area key={f} type="monotone" dataKey={f} stackId="1"
                      stroke={FUEL_COLORS[f] ?? "#888"} fill={FUEL_COLORS[f] ?? "#888"} fillOpacity={0.88} />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard className="h-full"
              title="2024 Heat Mix by Fuel"
              sub="Each segment = that fuel's % of total gross heat production."
              insight="Natural Gas 32.2%, but Renewables & Biofuels grew from 8.5% (1999) to 34.9% (2024) — now the second largest source.">
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
          </div>

          <div className="flex-[2_2_0%] min-h-0">
            <ChartCard className="h-full"
              title="Key Fuel Trends in Heat Production"
              sub="GWh trends 1999–2024 for the four largest heat fuel categories."
              insight="Natural Gas fell ~5% from 1999–2024 while Renewables & Biofuels nearly quadrupled (+293%). Solid Fossil Fuels fell 63%.">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ghpSlice} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--eu-border)" />
                  <XAxis dataKey="year" tick={TICK} />
                  <YAxis tickFormatter={v => `${(v/1e3).toFixed(0)}K`} tick={TICK} axisLine={false} tickLine={false} />
                  <Tooltip {...TTP} formatter={(v: unknown) => typeof v === "number" ? formatGWh(v) : String(v)} />
                  <Legend wrapperStyle={LGND} />
                  <Line type="monotone" dataKey="Natural Gas"           stroke="#4B80D4" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Solid Fossil Fuels"    stroke="#64748B" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Renewables & Biofuels" stroke="#22C55E" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Waste"                 stroke="#94A3B8" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 2" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
}
