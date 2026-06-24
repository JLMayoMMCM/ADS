"use client";
import { useState, useMemo } from "react";
import { BarChart, Bar, ScatterChart, Scatter,
         XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { FilterBar, CountryFilter } from "@/components/ui/filter-bar";
import { countryElec, countryHeat } from "@/data/energy";
import { formatGWh, formatPct } from "@/lib/utils";
import { cn } from "@/lib/utils";

const TTP = {
  contentStyle: { background: "var(--eu-card)", border: "1px solid var(--eu-border)", borderRadius: 8, fontSize: 12, color: "var(--foreground)", padding: "8px 12px" },
  labelStyle: { color: "var(--muted-foreground)", fontSize: 11, fontWeight: 600 },
  itemStyle: { fontSize: 12 },
};
const TICK = { fontSize: 11, fill: "var(--muted-foreground)" };


type SortKey = "total2024" | "renewShare" | "country";

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

export function CountriesDashboard() {
  const [view,  setView]  = useState<"elec"|"heat">("elec");
  const [query, setQuery] = useState("");
  const [topN,  setTopN]  = useState(10);
  const [sort,  setSort]  = useState<SortKey>("total2024");

  const baseElec = useMemo(() => countryElec.map(r => ({
    ...r, renewShare: r.total2024 > 0 ? r.renewables2024 / r.total2024 * 100 : 0,
  })), []);
  const baseHeat = useMemo(() => countryHeat.map(r => ({
    ...r, renewShare: r.total2024 > 0 ? r.renewables2024 / r.total2024 * 100 : 0,
  })), []);

  const base = view === "elec" ? baseElec : baseHeat;

  const filtered = useMemo(() => {
    let rows = base.filter(r => r.country.toLowerCase().includes(query.toLowerCase()));
    if (sort === "total2024")  rows = [...rows].sort((a,b) => b.total2024 - a.total2024);
    if (sort === "renewShare") rows = [...rows].sort((a,b) => b.renewShare - a.renewShare);
    if (sort === "country")    rows = [...rows].sort((a,b) => a.country.localeCompare(b.country));
    return rows.slice(0, topN);
  }, [base, query, topN, sort]);

  const scatterData = baseElec.map(r => ({ country: r.country, total: r.total2024, renewShare: r.renewShare }));

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <FilterBar>
        <div className="flex rounded-lg overflow-hidden border border-eu-border text-[11px] font-semibold shrink-0">
          {(["elec","heat"] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1 transition-colors ${v===view?"bg-[#003399] text-white":"text-muted-foreground hover:text-foreground"}`}>
              {v==="elec"?"Electricity":"Heat"}
            </button>
          ))}
        </div>
        <div className="w-px h-5 bg-eu-border hidden sm:block shrink-0" />
        <CountryFilter query={query} onQuery={setQuery} topN={topN} onTopN={setTopN} />
        <div className="w-px h-5 bg-eu-border hidden sm:block shrink-0" />
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Sort</span>
          {([["total2024","Total"],["renewShare","Renew %"],["country","A–Z"]] as [SortKey,string][]).map(([k,lbl]) => (
            <button key={k} onClick={() => setSort(k)}
              className={`px-2.5 py-0.5 rounded text-[10px] font-semibold border transition-colors ${sort===k?"bg-[#003399] text-white border-[#003399] dark:bg-eu-gold dark:text-black dark:border-eu-gold":"border-eu-border text-muted-foreground hover:text-foreground"}`}>
              {lbl}
            </button>
          ))}
        </div>
      </FilterBar>

      <div className="flex-1 min-h-0 flex flex-col gap-3 p-4 overflow-hidden">
        <div className="shrink-0 flex items-baseline gap-3 flex-wrap">
          <h2 className="text-xl font-bold text-foreground">Country-Level Energy Production · 2024</h2>
          <p className="text-xs text-muted-foreground">EU-27 member state breakdown — filter, sort, and compare electricity or heat production</p>
        </div>

        <div className="flex-1 min-h-0 flex flex-col gap-3 overflow-hidden">
          <div className="flex-[3_3_0%] min-h-0 grid grid-cols-2 auto-rows-fr gap-3">
            <ChartCard className="h-full"
              title={`Top ${topN} Countries — ${view==="elec"?"Electricity (GEP)":"Heat (GHP)"} 2024`}
              sub="GWh. Gold = 1st, lighter blue = top 3, dark blue = rest."
              insight={view==="elec"
                ? "Germany, France, and Spain account for ~48% of EU-27 total electricity production in 2024."
                : "Germany, France, and Poland produce the most district heat in the EU."}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filtered} layout="vertical" margin={{ top: 4, right: 36, bottom: 0, left: 68 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--eu-border)" horizontal={false} />
                  <XAxis type="number" tickFormatter={v=>`${(v/1e3).toFixed(0)}K`} tick={TICK} axisLine={false} />
                  <YAxis type="category" dataKey="country" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} width={66} />
                  <Tooltip {...TTP} formatter={(v: unknown) => typeof v === "number" ? formatGWh(v) : String(v)} />
                  <Bar dataKey="total2024" name="Total 2024" radius={[0, 3, 3, 0]}>
                    {filtered.map((_, i) => (
                      <Cell key={i} fill={i===0?"#FFCC00":i<3?"#4B80D4":"#1A52B8"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard className="h-full"
              title="Renewable Share vs Total Production (Electricity 2024)"
              sub="Each dot = 1 EU country. X = total GWh, Y = % from renewables."
              insight="Top-left = small but very green (Austria, Denmark, Latvia). Large producers like Germany and Spain show mid-range renewable shares (~50–56%).">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 12, bottom: 24, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--eu-border)" />
                  <XAxis dataKey="total" name="Total GWh" tickFormatter={v=>`${(v/1e3).toFixed(0)}K`} tick={TICK}
                    label={{ value: "Total GEP (GWh)", position:"insideBottom", offset:-16, fontSize:11, fill:"var(--muted-foreground)" }} />
                  <YAxis dataKey="renewShare" name="Renewable %" tickFormatter={v=>`${v.toFixed(0)}%`} tick={TICK}
                    label={{ value:"Renewable %", angle:-90, position:"insideLeft", offset:12, fontSize:11, fill:"var(--muted-foreground)" }} />
                  <Tooltip {...TTP} content={({ payload }) => {
                    const d = payload?.[0]?.payload as { country:string; total:number; renewShare:number } | undefined;
                    if (!d) return null;
                    return (
                      <div className="rounded-xl border border-eu-border bg-eu-card p-2.5 text-xs">
                        <p className="font-bold text-eu-gold mb-1">{d.country}</p>
                        <p className="text-muted-foreground">Total: <span className="text-foreground font-semibold">{formatGWh(d.total)}</span></p>
                        <p className="text-muted-foreground">Renewable: <span className="text-eu-green font-semibold">{formatPct(d.renewShare)}</span></p>
                      </div>
                    );
                  }} />
                  <Scatter data={scatterData} fill="#22C55E" opacity={0.85} />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="flex-[2_2_0%] min-h-0">
            <ChartCard className="h-full"
              title="Renewable Share Ranking — All 27 EU Countries (Electricity 2024)"
              sub="Sorted by renewable share. Gold ≥70%, Green ≥40%, Blue ≥20%, Slate <20%."
              insight="10 EU countries exceed 70% renewable electricity share. Only 6 fall below 20%. The EU average is 46.5%.">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[...baseElec].sort((a,b)=>b.renewShare-a.renewShare)} margin={{ top: 4, right: 12, bottom: 44, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--eu-border)" />
                  <XAxis dataKey="country" tick={{ fontSize: 8, fill: "var(--muted-foreground)" }} angle={-45} textAnchor="end" height={48} />
                  <YAxis tickFormatter={v=>`${v.toFixed(0)}%`} tick={TICK} axisLine={false} tickLine={false} />
                  <Tooltip {...TTP} formatter={(v: unknown) => typeof v === "number" ? formatPct(v) : String(v)} />
                  <Bar dataKey="renewShare" name="Renewable %" radius={[3,3,0,0]}>
                    {[...baseElec].sort((a,b)=>b.renewShare-a.renewShare).map((d,i) => (
                      <Cell key={i} fill={d.renewShare>=70?"#FFCC00":d.renewShare>=40?"#22C55E":d.renewShare>=20?"#4B80D4":"#334155"} />
                    ))}
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
