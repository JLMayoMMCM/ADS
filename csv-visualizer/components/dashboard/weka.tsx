"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line,
         XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { FilterBar } from "@/components/ui/filter-bar";
import {
  wekaElecCentroids, wekaElecClusters,
  wekaHeatCentroids, wekaHeatClusters,
  wekaClassModels, wekaClassPerClass, wekaConfusion,
  gepFuelClusters, ghpFuelClusters,
  fuelMixClusters, fuelMixTrajectoryClusters,
} from "@/data/energy";
import { formatNumber, formatPct } from "@/lib/utils";
import { cn } from "@/lib/utils";

const TTP = {
  contentStyle: { background: "var(--eu-card)", border: "1px solid var(--eu-border)", borderRadius: 8, fontSize: 12, color: "var(--foreground)", padding: "8px 12px" },
  labelStyle: { color: "var(--muted-foreground)", fontSize: 11, fontWeight: 600 },
  itemStyle: { fontSize: 12 },
};
const TICK = { fontSize: 11, fill: "var(--muted-foreground)" };
const LGND = { fontSize: 11 };

type WekaView = "country-elec" | "country-heat" | "classification" | "gep-fuel" | "ghp-fuel" | "fuelmix";
const VIEWS: { id: WekaView; label: string }[] = [
  { id: "country-elec",   label: "Country Elec Clusters" },
  { id: "country-heat",   label: "Country Heat Clusters" },
  { id: "classification", label: "Classification" },
  { id: "gep-fuel",       label: "GEP Fuel Clusters" },
  { id: "ghp-fuel",       label: "GHP Fuel Clusters" },
  { id: "fuelmix",        label: "Fuel Mix Trajectory" },
];

function ChartCard({ title, sub, children, className }: { title: string; sub?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-eu-border bg-eu-card p-3 flex flex-col gap-2", className)}>
      <div className="shrink-0">
        <p className="text-sm font-semibold text-foreground leading-tight">{title}</p>
        {sub && <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

function MetricBadge({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 text-center ${highlight?"border-eu-gold/50 bg-eu-gold/8 dark:bg-eu-gold/5":"border-eu-border bg-eu-card"}`}>
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold tabular-nums ${highlight?"text-eu-gold":"text-foreground"}`}>{value}</p>
    </div>
  );
}

function ClusterLegend({ clusters }: { clusters: { cluster?: string; id?: number; label: string; n: number; pct: number; color: string }[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      {clusters.map((c, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
          <span className="text-foreground font-medium">{c.label}</span>
          <span className="ml-auto text-muted-foreground tabular-nums">n={c.n} ({c.pct}%)</span>
        </div>
      ))}
    </div>
  );
}

function InterpretBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-3 rounded-xl border border-eu-border bg-eu-card text-[12px] text-muted-foreground leading-relaxed">
      {children}
    </div>
  );
}

/* ── Sub-views ──────────────────────────────────────────────────────────────── */

function CountryElecView() {
  const pieData = wekaElecClusters.map(c => ({ name: c.label, value: c.n, color: c.color }));
  const centroidBar = wekaElecCentroids.slice(0, 6).map(r => ({
    attr: r.attribute.replace(" Total",""),
    "Full Data": r.fullData, "Cluster 0": r.cluster0, "Cluster 1": r.cluster1, "Cluster 2": r.cluster2 ?? 0,
  }));
  return (
    <div className="flex flex-col gap-3">
      <InterpretBox>
        <span className="font-semibold text-foreground">What the algorithm did: </span>
        WEKA kMeans (k=3) partitioned all 27 EU countries based on their total electricity output across five 5-year periods (1999–2024) plus their 2024 fuel breakdown. By minimizing Within-Cluster Sum of Squared Errors (WCSSE), it found three natural groupings.
        {" "}<span className="font-semibold text-foreground">Results: </span>
        <span style={{color:"#22C55E"}} className="font-medium">High Renewable</span> (n=18, 67%) — the majority of EU countries with a high proportion of renewables relative to their electricity mix, including most northern, southern, and small economies.{" "}
        <span style={{color:"#F97316"}} className="font-medium">Med Renewable</span> (n=4, 15%) — mid-tier producers with mixed fossil-renewable portfolios.{" "}
        <span style={{color:"#EF4444"}} className="font-medium">Low Renewable</span> (n=5, 19%) — countries still dominated by fossil or nuclear sources. The centroid data below shows that high-renewable countries average substantially less absolute output (GWh) but much cleaner fuel profiles — reflecting a pattern where smaller economies often achieve higher renewable proportions.
      </InterpretBox>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <ChartCard title="Cluster Distribution (n=27 countries)">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={72} innerRadius={32} label={false}>
                {pieData.map(e => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Tooltip {...TTP} />
            </PieChart>
          </ResponsiveContainer>
          <ClusterLegend clusters={wekaElecClusters} />
        </ChartCard>
        <div className="lg:col-span-2">
          <ChartCard title="Cluster Centroids — 5-Year Electricity Totals (GWh)" sub="Average country total per cluster per period.">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={centroidBar} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--eu-border)" />
                <XAxis dataKey="attr" tick={TICK} />
                <YAxis tickFormatter={v => `${(v/1e3).toFixed(0)}K`} tick={TICK} axisLine={false} tickLine={false} />
                <Tooltip {...TTP} formatter={(v: unknown) => typeof v === "number" ? formatNumber(v) : String(v)} />
                <Legend wrapperStyle={LGND} />
                <Bar dataKey="Full Data"   fill="#64748B" />
                <Bar dataKey="Cluster 0"   fill={wekaElecClusters[0].color} />
                <Bar dataKey="Cluster 1"   fill={wekaElecClusters[1].color} />
                <Bar dataKey="Cluster 2"   fill={wekaElecClusters[2].color} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
      <ChartCard title="Cluster Centroids — 2024 Fuel Breakdown (GWh)" sub="Average fuel profile per cluster in 2024.">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={wekaElecCentroids.slice(6).map(r => ({
            attr: r.attribute.replace(" 2024",""),
            "Full Data": r.fullData, "Cluster 0": r.cluster0, "Cluster 1": r.cluster1, "Cluster 2": r.cluster2 ?? 0,
          }))} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--eu-border)" />
            <XAxis dataKey="attr" tick={TICK} />
            <YAxis tickFormatter={v => `${(v/1e3).toFixed(0)}K`} tick={TICK} axisLine={false} tickLine={false} />
            <Tooltip {...TTP} formatter={(v: unknown) => typeof v === "number" ? formatNumber(v) : String(v)} />
            <Legend wrapperStyle={LGND} />
            <Bar dataKey="Full Data" fill="#64748B" />
            <Bar dataKey="Cluster 0" fill={wekaElecClusters[0].color} />
            <Bar dataKey="Cluster 1" fill={wekaElecClusters[1].color} />
            <Bar dataKey="Cluster 2" fill={wekaElecClusters[2].color} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function CountryHeatView() {
  const pieData = wekaHeatClusters.map(c => ({ name: c.label, value: c.n, color: c.color }));
  const centroidBar = wekaHeatCentroids.slice(0, 6).map(r => ({
    attr: r.attribute.replace(" Total",""),
    "Full Data": r.fullData, "Cluster 0": r.cluster0, "Cluster 1": r.cluster1, "Cluster 2": r.cluster2 ?? 0,
  }));
  return (
    <div className="flex flex-col gap-3">
      <InterpretBox>
        <span className="font-semibold text-foreground">What the algorithm did: </span>
        kMeans (k=3) applied to heat production data for all 27 EU countries — each described by their total heat output across six 5-year periods plus their 2024 fuel breakdown. Heat production varies dramatically by climate: northern countries (Germany, Poland, France) operate large district heating networks, while southern countries (Malta, Cyprus, Portugal) produce negligible heat.
        {" "}<span className="font-semibold text-foreground">Results: </span>
        <span style={{color:"#FFCC00"}} className="font-medium">High Heat</span> (n=3, 11%) — countries with very large heat sectors averaging 70K+ GWh/period, heavily reliant on Gas and Renewables.{" "}
        <span style={{color:"#F97316"}} className="font-medium">Med Heat</span> (n=5, 19%) — moderate producers averaging 44–55K GWh/period, with fossil-heavy mixes.{" "}
        <span style={{color:"#22C55E"}} className="font-medium">Low Heat</span> (n=19, 70%) — the large majority of EU countries averaging under 10K GWh/period. The centroid trajectories show that all three groups have experienced declining heat output since 2004, consistent with building efficiency improvements across the EU.
      </InterpretBox>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <ChartCard title="Cluster Distribution (n=27 countries)">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={72} innerRadius={32} label={false}>
                {pieData.map(e => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Tooltip {...TTP} />
            </PieChart>
          </ResponsiveContainer>
          <ClusterLegend clusters={wekaHeatClusters} />
        </ChartCard>
        <div className="lg:col-span-2">
          <ChartCard title="Cluster Centroids — 5-Year Heat Totals (GWh)" sub="Average heat output per cluster across all periods.">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={centroidBar} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--eu-border)" />
                <XAxis dataKey="attr" tick={TICK} />
                <YAxis tickFormatter={v => `${(v/1e3).toFixed(0)}K`} tick={TICK} axisLine={false} tickLine={false} />
                <Tooltip {...TTP} formatter={(v: unknown) => typeof v === "number" ? formatNumber(v) : String(v)} />
                <Legend wrapperStyle={LGND} />
                <Bar dataKey="Full Data" fill="#64748B" />
                <Bar dataKey="Cluster 0" fill={wekaHeatClusters[0].color} />
                <Bar dataKey="Cluster 1" fill={wekaHeatClusters[1].color} />
                <Bar dataKey="Cluster 2" fill={wekaHeatClusters[2].color} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

function ClassificationView() {
  const j48 = wekaClassModels.find(m => m.model === "J48")!;
  const rf  = wekaClassModels.find(m => m.model === "Random Forest")!;
  const j48rows = wekaConfusion.filter(r => r.model === "J48");
  const rfRows  = wekaConfusion.filter(r => r.model === "Random Forest");

  const perClassBars = wekaClassPerClass.map(r => ({
    label: `${r.model === "J48" ? "J48" : "RF"} — ${r.class}`,
    "F-Measure": r.fMeasure,
    "ROC Area":  r.rocArea,
    Precision:   r.precision,
    Recall:      r.recall,
  }));

  return (
    <div className="flex flex-col gap-3">
      <InterpretBox>
        <span className="font-semibold text-foreground">Task: </span>
        Predict each country&apos;s <em>RenewableShareClass</em> (Low / Med / High) in heat production using 5-year heat totals and fuel mix as features.
        {" "}<span className="font-semibold text-foreground">J48 (Decision Tree): </span>
        Achieved <span className="font-semibold text-foreground">{j48.correctPct}% accuracy</span> (Kappa {j48.kappa.toFixed(3)}) on the 27-country dataset. Kappa of {j48.kappa.toFixed(3)} indicates moderate agreement beyond chance — substantially better than random (33.3%) but not perfect. J48 performed best on the "High" class (F=0.778) and worst on "Med" (F=0.471), which is expected since borderline countries with balanced fossil/renewable mixes are hardest to separate.
        {" "}<span className="font-semibold text-foreground">Random Forest: </span>
        Slightly weaker at {rf.correctPct}% accuracy (Kappa {rf.kappa.toFixed(3)}). On a small dataset (n=27), Random Forest&apos;s ensemble advantage is nullified by overfitting risk with small training folds. The "High" class remained best predicted (F=0.737) while "Med" remains the hardest (F=0.400).
        {" "}<span className="font-semibold text-foreground">Policy implication: </span>
        Countries classified as "Low" renewable heat share represent the clearest targets for district heating decarbonization policy — they are easy to identify and consistently misclassified least.
      </InterpretBox>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricBadge label="J48 Accuracy"        value={`${j48.correctPct}%`} highlight />
        <MetricBadge label="J48 Kappa"           value={j48.kappa.toFixed(3)} />
        <MetricBadge label="Random Forest Acc."  value={`${rf.correctPct}%`} />
        <MetricBadge label="Random Forest Kappa" value={rf.kappa.toFixed(3)} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <ChartCard title="Per-Class Metrics — J48 vs Random Forest" sub="F-Measure, ROC Area, Precision, Recall (0–1 scale).">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={perClassBars} margin={{ top: 4, right: 12, bottom: 32, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--eu-border)" />
              <XAxis dataKey="label" tick={{ fontSize: 8, fill: "var(--muted-foreground)" }} angle={-30} textAnchor="end" height={44} />
              <YAxis domain={[0,1]} tick={TICK} axisLine={false} tickLine={false} />
              <Tooltip {...TTP} formatter={(v: unknown) => typeof v === "number" ? v.toFixed(3) : String(v)} />
              <Legend wrapperStyle={LGND} />
              <Bar dataKey="F-Measure" fill="#FFCC00" />
              <Bar dataKey="ROC Area"  fill="#22C55E" />
              <Bar dataKey="Precision" fill="#4B80D4" />
              <Bar dataKey="Recall"    fill="#94A3B8" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Confusion Matrices — Country Heat Classification" sub="Diagonal (green) = correct predictions. Off-diagonal = misclassified countries.">
          <div className="grid grid-cols-2 gap-3 mt-1">
            {[{ label:"J48", rows:j48rows },{ label:"Random Forest", rows:rfRows }].map(({ label, rows }) => (
              <div key={label}>
                <p className="text-[11px] font-semibold text-foreground mb-1.5">{label}</p>
                <table className="w-full text-[10px] border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-eu-border p-1 text-muted-foreground text-left">True↓ Pred→</th>
                      {["Low","Med","High"].map(c => <th key={c} className="border border-eu-border p-1 text-eu-gold font-bold">{c}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(r => (
                      <tr key={r.trueClass}>
                        <td className="border border-eu-border p-1 text-eu-gold font-bold">{r.trueClass}</td>
                        {[r.predLow, r.predMed, r.predHigh].map((v, i) => {
                          const correct = (i===0&&r.trueClass==="Low")||(i===1&&r.trueClass==="Med")||(i===2&&r.trueClass==="High");
                          return (
                            <td key={i} className={`border border-eu-border p-1 text-center font-mono text-xs ${correct?"text-eu-green font-bold bg-eu-green/8":"text-muted-foreground"}`}>
                              {v}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

function GepFuelView() {
  const { clusters, centroids, wcsse, iterations } = gepFuelClusters;
  const shareData = centroids.slice(0, 5).map(r => ({
    attr: r.attr, "Full Data": r.fullData, "Low-Renewable": r.cluster0, "High-Renewable": r.cluster1,
  }));
  return (
    <div className="flex flex-col gap-3">
      <InterpretBox>
        <span className="font-semibold text-foreground">What the algorithm did: </span>
        kMeans (k=2, WCSSE={wcsse.toFixed(3)}, converged in {iterations} iterations) clustered 13 EU electricity fuel types by their <em>renewable share ratio</em> across five periods (1999–2019) plus their 2024 absolute GWh output. Each fuel type was described as a 6-dimensional vector.
        {" "}<span className="font-semibold text-foreground">Results: </span>
        The algorithm found two polarized groups. <span style={{color:"#4B80D4"}} className="font-medium">Low-Renewable</span> (n=10, 77%): Nuclear, Natural Gas, Solid Fossil Fuels, Lignite, Oil, Bioenergy, Waste, Hydro (conventional), Solar Thermal, Batteries — all characterized by renewable share ratios consistently below 21%. <span style={{color:"#FFCC00"}} className="font-medium">High-Renewable</span> (n=3, 23%): Hydro (pumped), Wind, Solar PV — with renewable share ratios of 77–83% across all periods.
        {" "}<span className="font-semibold text-foreground">Energy transition insight: </span>
        Despite constituting only 23% of fuel types, the High-Renewable cluster accounts for an outsized share of growth — Wind and Solar PV together grew from near-zero to over 700K GWh by 2024, surpassing the average Low-Renewable fuel&apos;s total output (213K GWh). The tight WCSSE confirms that these two groupings are genuinely distinct, not arbitrary cuts.
      </InterpretBox>
      <div className="grid grid-cols-3 gap-3">
        <MetricBadge label="WCSSE" value={wcsse.toFixed(3)} />
        <MetricBadge label="Iterations" value={iterations} />
        <MetricBadge label="Fuel Types" value="13" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <ChartCard title="Renewable Share Ratio — Centroid Trajectory (1999–2019)" sub="Values are fractions (0–1) of renewable content per fuel cluster.">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={shareData} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--eu-border)" />
              <XAxis dataKey="attr" tick={TICK} />
              <YAxis domain={[0,1]} tickFormatter={v=>`${(v*100).toFixed(0)}%`} tick={TICK} axisLine={false} tickLine={false} />
              <Tooltip {...TTP} formatter={(v: unknown) => typeof v === "number" ? formatPct(v*100) : String(v)} />
              <Legend wrapperStyle={LGND} />
              <Line dataKey="Full Data"       stroke="#64748B" strokeWidth={2} dot={{ r: 4 }} strokeDasharray="5 2" />
              <Line dataKey="Low-Renewable"   stroke={clusters[0].color} strokeWidth={3} dot={{ r: 5 }} />
              <Line dataKey="High-Renewable"  stroke={clusters[1].color} strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="2024 Production Total (GWh) — Cluster Centroids" sub="Average 2024 GWh output of fuel types within each cluster.">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={[{ attr:"2024 GWh", "Full Data": centroids[5].fullData, "Low-Renewable": centroids[5].cluster0, "High-Renewable": centroids[5].cluster1 }]}
              margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--eu-border)" />
              <XAxis dataKey="attr" tick={TICK} />
              <YAxis tickFormatter={v=>`${(v/1e3).toFixed(0)}K`} tick={TICK} axisLine={false} tickLine={false} />
              <Tooltip {...TTP} formatter={(v: unknown) => typeof v === "number" ? formatNumber(v) : String(v)} />
              <Legend wrapperStyle={LGND} />
              <Bar dataKey="Full Data"      fill="#64748B" radius={[4,4,0,0]} />
              <Bar dataKey="Low-Renewable"  fill={clusters[0].color} radius={[4,4,0,0]} />
              <Bar dataKey="High-Renewable" fill={clusters[1].color} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function GhpFuelView() {
  const { clusters, centroids, wcsse, iterations } = ghpFuelClusters;
  const shareData = centroids.slice(0, 5).map(r => ({
    attr: r.attr, "Full Data": r.fullData, "High-Renewable": r.cluster0, "Low-Renewable": r.cluster1,
  }));
  return (
    <div className="flex flex-col gap-3">
      <InterpretBox>
        <span className="font-semibold text-foreground">What the algorithm did: </span>
        Same kMeans (k=2, WCSSE={wcsse.toFixed(3)}, converged in {iterations} iterations) applied to <em>heat production</em> fuel types. Each fuel described by its renewable share ratio across five periods and 2024 GWh.
        {" "}<span className="font-semibold text-foreground">Results: </span>
        <span style={{color:"#FFCC00"}} className="font-medium">High-Renewable Heat</span> (n=3, 23%): Solar Thermal, Geothermal, and Bioenergy — achieving ≥69% renewable share throughout the period. Their centroid rose from 0.687 (1999) to 0.827 (2019), reflecting the explosive growth of Bioenergy in EU district heating.{" "}
        <span style={{color:"#4B80D4"}} className="font-medium">Low-Renewable</span> (n=10, 77%): Natural Gas, Solid Fossil Fuels, Lignite, Oil, Waste, Nuclear, and others — below 24% renewable share. The 2024 GWh centroid for High-Renewable Heat (153K GWh average) is disproportionately large relative to its small cluster size, reflecting Bioenergy&apos;s dominance.
        {" "}<span className="font-semibold text-foreground">Policy implication: </span>
        The large gap between clusters (WCSSE only 2.298) confirms heat fuel decarbonization is a binary problem: a small set of fuels drive renewable heat, while the majority of heat fuel types remain deeply fossil-dependent. Transitioning district heat from Gas to Bioenergy/Solar Thermal is the primary lever available.
      </InterpretBox>
      <div className="grid grid-cols-3 gap-3">
        <MetricBadge label="WCSSE" value={wcsse.toFixed(3)} />
        <MetricBadge label="Iterations" value={iterations} />
        <MetricBadge label="Fuel Types" value="13" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <ChartCard title="Renewable Share Ratio — GHP Fuel Cluster Trajectory" sub="Centroid values over 1999–2019.">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={shareData} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--eu-border)" />
              <XAxis dataKey="attr" tick={TICK} />
              <YAxis domain={[0,1]} tickFormatter={v=>`${(v*100).toFixed(0)}%`} tick={TICK} axisLine={false} tickLine={false} />
              <Tooltip {...TTP} formatter={(v: unknown) => typeof v === "number" ? formatPct(v*100) : String(v)} />
              <Legend wrapperStyle={LGND} />
              <Line dataKey="Full Data"       stroke="#64748B" strokeWidth={2} dot={{ r: 4 }} strokeDasharray="5 2" />
              <Line dataKey="High-Renewable"  stroke={clusters[0].color} strokeWidth={3} dot={{ r: 5 }} />
              <Line dataKey="Low-Renewable"   stroke={clusters[1].color} strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="2024 GHP Total — Cluster Centroids (GWh)" sub="Average 2024 heat output per fuel type within each cluster.">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={[{ attr:"2024 GWh", "Full Data": centroids[5].fullData, "High-Renewable": centroids[5].cluster0, "Low-Renewable": centroids[5].cluster1 }]}
              margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--eu-border)" />
              <XAxis dataKey="attr" tick={TICK} />
              <YAxis tickFormatter={v=>`${(v/1e3).toFixed(0)}K`} tick={TICK} axisLine={false} tickLine={false} />
              <Tooltip {...TTP} formatter={(v: unknown) => typeof v === "number" ? formatNumber(v) : String(v)} />
              <Legend wrapperStyle={LGND} />
              <Bar dataKey="Full Data"     fill="#64748B" radius={[4,4,0,0]} />
              <Bar dataKey="High-Renewable" fill={clusters[0].color} radius={[4,4,0,0]} />
              <Bar dataKey="Low-Renewable"  fill={clusters[1].color} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function FuelMixView() {
  const { clusters, centroids, wcsse } = fuelMixTrajectoryClusters;
  const lineData = centroids.map(r => ({
    year: r.year,
    "Full Data": parseFloat((r.fullData * 100).toFixed(2)),
    "Surging":   parseFloat((r.cluster0  * 100).toFixed(2)),
    "Declining": parseFloat((r.cluster1  * 100).toFixed(2)),
    "Fading Out":parseFloat((r.cluster2  * 100).toFixed(2)),
  }));
  const legacyBar = fuelMixClusters.map(r => ({
    year: r.year,
    "Full Data":  r.fullData,
    "Surging":    r.cluster0_Surging,
    "Declining":  r.cluster1_Declining,
    "Fading Out": r.cluster2_NoClass,
  }));
  return (
    <div className="flex flex-col gap-3">
      <InterpretBox>
        <span className="font-semibold text-foreground">What the algorithm did: </span>
        kMeans (k=3, WCSSE={wcsse.toFixed(3)}) clustered 12 EU electricity fuel types by the <em>shape</em> of their share-of-GEP percentage trajectory from 1999–2024. Each fuel is a 6-dimensional vector of annual share values, so clusters capture trajectory patterns — not just averages.
        {" "}<span className="font-semibold text-foreground">Three trajectory archetypes: </span>
        <span style={{color:"#FFCC00"}} className="font-medium">Surging</span> (n=2, 17%): Solar PV and Wind — near-zero shares in 1999 (centroid 0.26%), rising steeply to 13.9% by 2024. This is the definitive energy transition signal.{" "}
        <span style={{color:"#4B80D4"}} className="font-medium">Declining</span> (n=7, 58%): Nuclear, Natural Gas, Solid Fossil Fuels, Lignite, Hydro, Renewables &amp; Biofuels aggregate, Oil — historically dominant fuels now losing or stagnating in share. The centroid (~18%) reflects a mixture of gradual declines.{" "}
        <span style={{color:"#94A3B8"}} className="font-medium">Fading Out</span> (n=3, 25%): Fuels with small shares across all periods, declining toward zero (Lignite separate, Oil &amp; Petroleum, Solar Thermal in GEP context). Centroid fell from 6.68% → 0.83%.
        {" "}<span className="font-semibold text-foreground">Insight: </span>
        This clustering elegantly maps the structural transformation of EU electricity: two fuels surging from nothing, seven incumbents in managed decline, and three marginal fuels fading out entirely. The energy transition, seen through trajectory shapes rather than snapshots, follows a clear three-act pattern.
      </InterpretBox>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricBadge label="WCSSE" value={wcsse.toFixed(3)} />
        <MetricBadge label="Fuel Types" value="12" />
        {clusters.map(c => (
          <div key={c.id} className="rounded-xl border p-3 text-center" style={{ borderColor: c.color + "60" }}>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{c.label}</p>
            <p className="text-2xl font-bold" style={{ color: c.color }}>n={c.n}</p>
            <p className="text-[11px] text-muted-foreground">{c.pct}% of fuels</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <ChartCard title="Centroid Share Trajectories (% of GEP)" sub="Each line = prototype trajectory for that cluster group.">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={lineData} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--eu-border)" />
              <XAxis dataKey="year" tick={TICK} />
              <YAxis tickFormatter={v=>`${v.toFixed(1)}%`} tick={TICK} axisLine={false} tickLine={false} />
              <Tooltip {...TTP} formatter={(v: unknown) => typeof v === "number" ? formatPct(v) : String(v)} />
              <Legend wrapperStyle={LGND} />
              <Line dataKey="Full Data"   stroke="#64748B" strokeWidth={2} strokeDasharray="5 2" dot={{ r: 3 }} />
              <Line dataKey="Surging"     stroke={clusters[0].color} strokeWidth={3} dot={{ r: 5 }} />
              <Line dataKey="Declining"   stroke={clusters[1].color} strokeWidth={3} dot={{ r: 5 }} />
              <Line dataKey="Fading Out"  stroke={clusters[2].color} strokeWidth={2} dot={{ r: 4 }} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="kMeans Centroid Values Over Time (% share)" sub="Bar chart of raw centroid % values per year per cluster.">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={legacyBar} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--eu-border)" />
              <XAxis dataKey="year" tick={TICK} />
              <YAxis tick={TICK} axisLine={false} tickLine={false} />
              <Tooltip {...TTP} formatter={(v: unknown) => typeof v === "number" ? `${v.toFixed(2)}%` : String(v)} />
              <Legend wrapperStyle={LGND} />
              <Bar dataKey="Surging"     fill={clusters[0].color} radius={[3,3,0,0]} />
              <Bar dataKey="Declining"   fill={clusters[1].color} radius={[3,3,0,0]} />
              <Bar dataKey="Fading Out"  fill={clusters[2].color} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

/* ── Main WEKA view ─────────────────────────────────────────────────────────── */
export function WekaDashboard() {
  const [view, setView] = useState<WekaView>("country-elec");
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <FilterBar>
        <div className="flex flex-wrap gap-1.5">
          {VIEWS.map(v => (
            <button key={v.id} onClick={() => setView(v.id)}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                view === v.id
                  ? "bg-[#003399] text-white border-[#003399] dark:bg-eu-gold dark:text-black dark:border-eu-gold"
                  : "border-eu-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
              }`}>
              {v.label}
            </button>
          ))}
        </div>
      </FilterBar>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h2 className="text-xl font-bold text-foreground">WEKA Machine Learning Results</h2>
            <p className="text-xs text-muted-foreground">kMeans clustering &amp; J48 / Random Forest classification on EU-27 energy data</p>
          </div>
          {view === "country-elec"   && <CountryElecView />}
          {view === "country-heat"   && <CountryHeatView />}
          {view === "classification" && <ClassificationView />}
          {view === "gep-fuel"       && <GepFuelView />}
          {view === "ghp-fuel"       && <GhpFuelView />}
          {view === "fuelmix"        && <FuelMixView />}
        </div>
      </div>
    </div>
  );
}
