# EU Energy Dashboard

A browser-based, PowerBI-style analytical dashboard visualizing EU-27 energy production data (1999–2024) alongside WEKA machine learning model results. Built as a static export for Netlify deployment — no server required.

---

## Purpose

This project transforms a curated EU Eurostat energy workbook and a set of WEKA model runs into an interactive visual analytics application. It allows users to:

- Explore gross electricity and heat production trends across the EU-27 from 1999 to 2024
- Break down production by fuel type with interactive filters (year range, fuel toggles, country search)
- Compare EU member states by output volume and renewable share
- Inspect WEKA machine learning outputs — kMeans clustering and J48/Random Forest classification — with plain-language interpretations

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, `output: 'export'` static mode) |
| Language | TypeScript (strict) |
| UI Components | shadcn/ui v4 (preset `b7BFgTjg8`) |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Data | Embedded TypeScript constants in `data/energy.ts` |
| Deployment | Netlify (static HTML/CSS/JS, no SSR) |
| Theme | EU identity — blue (`#003399`) + gold (`#FFCC00`), light/dark modes |

---

## Running Locally

```bash
cd csv-visualizer
npm install
npm run dev        # development server at http://localhost:3000
npm run build      # static export to /out
```

Deploy by uploading the `/out` folder to Netlify, or connect via `netlify.toml` (already configured).

---

## Project Structure

```
csv-visualizer/
├── app/
│   ├── page.tsx          # Root shell — nav + section routing
│   ├── layout.tsx        # HTML shell, flash-free theme init, fonts
│   └── globals.css       # EU theme variables (light + dark), Tailwind base
├── components/
│   ├── nav/
│   │   └── app-nav.tsx   # Top navigation bar with theme toggle
│   ├── dashboard/
│   │   ├── overview.tsx      # EU-27 summary view
│   │   ├── electricity.tsx   # Gross Electricity Production (GEP)
│   │   ├── heat.tsx          # Gross Heat Production (GHP)
│   │   ├── countries.tsx     # Country-level comparisons
│   │   ├── trends.tsx        # Long-run fuel trend analysis
│   │   └── weka.tsx          # WEKA ML results explorer
│   └── ui/
│       ├── filter-bar.tsx    # YearRangeSlider, FuelChips, CountryFilter, FilterBar
│       └── stat-card.tsx     # KPI metric card
├── data/
│   └── energy.ts         # All EU energy data as TypeScript constants
├── hooks/
│   └── use-theme.ts      # Light/dark mode toggle with localStorage
└── lib/
    └── utils.ts          # formatGWh, formatPct, formatNumber, cn()
```

---

## Data Sources

All data originates from a single curated workbook: **`EU_Electricity_Heat_5Year_Curated_1999_2024.xlsx`** (source: Eurostat), with six exported worksheets processed into ARFF and TSV formats in the `Datasets/` folder.

Missing values (`?` in ARFF / `-` in source) are treated as `0` throughout.

### Dataset Descriptions and Interpretations

---

#### `GEP_EU27_Electricity` — Gross Electricity Production by Fuel

**What it contains:** Total GWh of electricity generated across all 27 EU member states, broken down by 13 fuel categories, at five-year intervals from 1999 to 2024.

**Fuel categories:** Nuclear, Natural Gas, Solid Fossil Fuels, Lignite, Oil & Petroleum, Renewables & Biofuels (aggregate), Hydro, Wind, Solar PV, Solar Thermal, Bioenergy, Waste, Batteries.

**Interpretation:** This is the primary time-series for EU electricity generation. The most significant trend is the structural energy transition: total GEP declined slightly (−4.6% from 1999 to 2024) while the internal composition shifted dramatically. Solid Fossil Fuels + Lignite fell from ~42% of the mix in 1999 to ~16% in 2024. Wind grew from 0.5% to ~18%, and Solar PV from near-zero to ~10%. Renewables & Biofuels as a whole overtook nuclear around 2009 and by 2024 represent the single largest category at 46.5% of total GEP.

---

#### `GHP_EU27_Heat` — Gross Heat Production by Fuel

**What it contains:** Total GWh of district heat and combined heat & power (CHP) output across all EU-27, broken down by 8 fuel categories, at five-year intervals 1999–2024.

**Fuel categories:** Natural Gas, Solid Fossil Fuels, Lignite, Oil & Petroleum, Renewables & Biofuels, Waste, Nuclear, Solar Thermal.

**Interpretation:** EU heat production is dominated by district heating networks concentrated in Germany, France, Poland, and Scandinavia. Total GHP peaked in 2004 (~708 TWh) and has since declined ~21% as building efficiency improved and gas-to-heat demand fell. The most important structural shift: Renewables & Biofuels grew from 8.5% (1999) to 34.9% (2024) — driven almost entirely by biomass/bioenergy — overtaking Natural Gas as the growth fuel even though Gas remains the largest single source at 32.2%. Solid Fossil Fuels fell 63% over the same period.

---

#### `Country_5yr_Elec` — Country-Level Electricity (5-Year Totals)

**What it contains:** Each of the 27 EU member states as a row, with columns for total electricity production (GWh) per 5-year interval and the 2024 fuel breakdown per country.

**Interpretation:** Electricity output is highly concentrated — Germany, France, and Spain together account for ~48% of EU-27 total GEP. Country-level renewable shares vary enormously: Iceland-equivalent small economies (Norway not EU, but Austria, Denmark, Latvia) exceed 70% renewables while Poland, Bulgaria, and Czechia remain below 30%. This dataset underpins the WEKA Country Elec clustering and the Countries dashboard's comparative charts.

---

#### `Country_5yr_Heat` — Country-Level Heat (5-Year Totals)

**What it contains:** Same structure as Country Elec but for heat production. Each of the 27 EU member states with total heat GWh per period and 2024 fuel breakdown.

**Interpretation:** Heat production is far more geographically concentrated than electricity — 19 of 27 EU countries produce negligible district heat (classified as "Low Heat" by WEKA). Climate is the dominant driver: northern and eastern countries with harsh winters operate large district heating networks (Germany, Poland, France, Sweden, Finland, Denmark). Southern countries (Malta, Cyprus, Portugal, Greece) produce near-zero heat. This asymmetry makes country-level heat clustering very tight, with the "High Heat" cluster (n=3) representing the massive district-heat economies.

---

#### `Fuel_Mix_pct_GEP` — Fuel Mix as % of Gross Electricity

**What it contains:** Each fuel type's share of total EU-27 gross electricity production as a percentage, at five-year intervals 1999–2024. This is a derived/normalized version of the GEP data.

**Interpretation:** This dataset removes the absolute-volume dimension and focuses purely on structural composition. It reveals the energy transition as a redistribution of shares rather than total volume growth. Nuclear's share fell from 31.8% (1999) to 23.4% (2024). Gas peaked around 2009 and has since declined. The Surging / Declining / Fading Out kMeans clustering (WEKA Fuel Mix Trajectory view) uses this dataset to identify trajectory archetypes — the most analytically useful framing of the transition.

---

#### `Trend_Analysis` — Long-Run Fuel Trend Metrics

**What it contains:** Two derived measures per fuel per year: absolute GWh output and percentage change vs 1999 baseline. Covers the six selected trend fuels (Renewables & Biofuels, Wind, Solar PV, Nuclear, Natural Gas, Solid Fossil Fuels).

**Interpretation:** The baseline-relative growth figures are extreme for Wind and Solar PV (+2,000%+ and +345,276% respectively from 1999 to 2024) because these technologies started from essentially zero. The chart caps at ±300% for readability, but the raw magnitude underscores that these are not incremental improvements but technology substitution events. Fossil fuel declines of 40–65% over 25 years represent a genuine structural exit.

---

### WEKA Model Files

All WEKA outputs are in `Datasets/model runs/` as `.txt` (full WEKA output) and `.tsv` (structured extracts).

#### `Country_5yr_Elec_kMeans` — Electricity Country Clustering

**Algorithm:** kMeans, k=3, 27 EU countries as instances, 5-year electricity totals + 2024 fuel breakdown as attributes.

**Results:**
- **Cluster 0 — Med Renewable** (n=4, 15%): Countries with moderate total output and mixed fossil/renewable portfolios.
- **Cluster 1 — Low Renewable** (n=5, 19%): Countries still dominated by fossil fuels or nuclear, lower renewable share.
- **Cluster 2 — High Renewable** (n=18, 67%): The majority of EU states with higher renewable proportions; typically smaller producers where renewables dominate.

**Interpretation:** The large High Renewable cluster reflects a general EU-wide shift, though many countries in it are small-volume producers where "high renewable share" comes from Hydro or Wind rather than absolute green output. The Low Renewable group are the clearest policy intervention targets.

---

#### `Country_5yr_Heat_kMeans` — Heat Country Clustering

**Algorithm:** kMeans, k=3, 27 EU countries as instances, 5-year heat totals + 2024 fuel breakdown as attributes.

**Results:**
- **Cluster 0 — Med Heat** (n=5, 19%): Mid-tier district heating countries averaging 44–55K GWh/period.
- **Cluster 1 — High Heat** (n=3, 11%): Major district-heating economies averaging 70K+ GWh/period; Gas and Renewables dominant.
- **Cluster 2 — Low Heat** (n=19, 70%): The large majority of EU countries with minimal district heat (<10K GWh/period).

**Interpretation:** The 3:11 size split between High Heat and Low Heat captures the fundamental climate-driven asymmetry of EU heat infrastructure. All three clusters show declining totals from 2004–2024, consistent with pan-EU building efficiency improvements.

---

#### `Country_5yr_Heat_classification` — Renewable Share Class Prediction

**Algorithm:** J48 Decision Tree and Random Forest, predicting `RenewableShareClass` (Low / Med / High) from country heat production features.

**Results:**
- J48: **64% accuracy**, Kappa 0.459 (16/27 correct)
- Random Forest: **56% accuracy**, Kappa 0.337 (14/27 correct)

**Per-class performance (J48):**
- High renewable class: F-Measure 0.778, ROC Area 0.812 — best predicted
- Low renewable class: F-Measure 0.667, ROC Area 0.757 — well predicted
- Med renewable class: F-Measure 0.471, ROC Area 0.688 — hardest (borderline countries)

**Interpretation:** J48 outperforms Random Forest on this small dataset (n=27) because Random Forest's ensemble advantage requires larger training sets — with only ~18 training instances per fold, individual trees see too few examples. Kappa of 0.459 indicates "moderate agreement" beyond chance. The fact that High-renewable countries are easiest to classify confirms they form a genuinely tight cluster: countries with large biomass or geothermal heat sectors stand out clearly in the feature space. The Med class confusion reflects true ambiguity in countries transitioning between fossil and renewable heat.

---

#### `GEP_Cluster` — Electricity Fuel Type Clustering

**Algorithm:** kMeans, k=2, 13 EU electricity fuel types as instances, renewable share ratio across 5 periods + 2024 GWh as attributes. WCSSE=2.785, 3 iterations.

**Results:**
- **Cluster 0 — Low-Renewable Fuels** (n=10, 77%): Nuclear, Gas, Coal, Lignite, Oil, Bioenergy, Waste, and others — renewable share ratios below 21%.
- **Cluster 1 — High-Renewable Fuels** (n=3, 23%): Hydro, Wind, Solar PV — renewable share ratios 77–83%.

**Interpretation:** The binary split is sharp and stable: despite belonging to "Renewables & Biofuels" as a category, Bioenergy's renewable share ratio places it in the Low-Renewable cluster because it co-exists with fossil combustion in CHP plants. Hydro, Wind, and Solar PV are definitively pure-renewable and form a tight cluster. The low WCSSE (2.785) confirms genuine separation. The 2024 GWh centroid shows High-Renewable fuels averaging 738K GWh — more than 3× the Low-Renewable average (213K GWh) — despite being only 3 fuel types.

---

#### `GHP_Cluster` — Heat Fuel Type Clustering

**Algorithm:** kMeans, k=2, heat fuel types as instances. WCSSE=2.298, 2 iterations.

**Results:**
- **Cluster 0 — High-Renewable Heat Fuels** (n=3, 23%): Solar Thermal, Geothermal, Bioenergy — renewable share ≥69%.
- **Cluster 1 — Low-Renewable Heat Fuels** (n=10, 77%): Gas, Coal, Lignite, Oil, Waste, Nuclear — below 24%.

**Interpretation:** The heat fuel clustering mirrors the electricity result. The High-Renewable Heat cluster's centroid rose from 0.687 (1999) to 0.827 (2019), driven by rapid Bioenergy growth. The 2024 centroid GWh for High-Renewable (153K) is disproportionate to its size (3 fuel types), confirming Bioenergy's dominance of renewable heat growth. The even lower WCSSE (2.298) than GEP suggests heat fuel types are even more cleanly binary — fossil vs. renewable — with less ambiguity.

---

#### `EU_FuelMix_pct_Kmeans` — Fuel Mix Trajectory Clustering

**Algorithm:** kMeans, k=3, 12 electricity fuel types as instances, each described by its % share of GEP across 6 time periods. WCSSE=3.036, 2 iterations.

**Results:**
- **Cluster 0 — Surging** (n=2, 17%): Solar PV, Wind — centroid rose from 0.26% → 13.91% share of GEP.
- **Cluster 1 — Declining** (n=7, 58%): Nuclear, Natural Gas, Solid Fossil, Lignite, Hydro, Renewables aggregate, Oil — historically large fuels losing share.
- **Cluster 2 — Fading Out** (n=3, 25%): Marginal fuels with small, declining shares across all periods — centroid fell from 6.68% → 0.83%.

**Interpretation:** This is arguably the most analytically rich of all WEKA models because it classifies fuels by the *shape* of their trajectory rather than their absolute values. Surging captures the two technologies that define the modern energy transition: Wind and Solar PV. Declining correctly groups mature fuels — even Hydro and aggregate Renewables show stable or slightly declining percentage shares because they are growing more slowly than the Surging pair. Fading Out identifies the fuels approaching technological retirement. The three-archetype model elegantly compresses 25 years of EU energy history into a single structural story.

---

## Dashboard Pages

### Overview

**Purpose:** Landing page summarising the entire EU-27 energy system at a glance.

**KPI Cards:**
- Total Electricity 2024 (GWh, % change vs 1999)
- Total Heat 2024 (GWh, % change vs 1999)
- Renewable Share 2024 (percentage points gained since 1999)
- Nuclear Share 2024 (with 1999 baseline comparison)

**Charts:**
- **Electricity vs Heat Production (line):** Dual-line chart tracking GEP and GHP (GWh) across all six 5-year periods. Highlights that electricity has been broadly stable while heat has declined.
- **Electricity Source Mix (stacked area, 100%):** Shows the proportional shift from Fossil → Nuclear → Renewable over 1999–2024. The crossover point where Renewables exceeded Nuclear (~2009) is visually prominent.

**Filters:** Year range slider (1999–2024, 5-year steps).

---

### Electricity

**Purpose:** Deep-dive into Gross Electricity Production — all fuel types, full time series.

**KPI Cards:**
- Total GEP 2024 with change vs 1999
- Renewable Share 2024 with 1999 baseline
- Wind Share 2024 with 1999 baseline
- Solar PV Share 2024 (was ≈0% in 1999)

**Charts:**
- **GEP by Fuel — Stacked Area:** Each fuel type as a stacked band showing absolute GWh contribution per period. Toggle fuels to isolate comparisons.
- **2024 Fuel Mix — Donut Pie:** Percentage share of each fuel in the most recent year. Legend below each segment shows exact % value.
- **Nuclear vs Renewables — Line:** Head-to-head GWh comparison of nuclear and renewables (plus Wind and Solar PV as dashed sub-lines), showing the crossover in 2014.
- **Fuel Mix % — 100% Stacked Bar:** Same data as the area chart but normalized to 100% per year, showing structural shift in proportions rather than volume.

**Filters:** Year range slider; fuel chip multi-select (10 fuels).

---

### Heat

**Purpose:** Gross Heat Production — district heat and CHP across EU-27 by fuel.

**KPI Cards:**
- Total GHP 2024 with change vs 1999
- Renewable Heat Share 2024 (was X% in 1999)
- Gas Share 2024 (largest single source)
- Fossil Share 2024 (Gas + Coal + Oil + Lignite combined)

**Charts:**
- **GHP by Fuel — Stacked Area:** Heat output by fuel type across all periods, stacked and color-coded. Toggle fuels to isolate.
- **2024 Heat Mix — Donut Pie:** Percentage breakdown of heat fuel mix in 2024 with legend values.
- **Key Fuel Trends — Line:** Four-line chart (Natural Gas, Solid Fossil Fuels, Renewables & Biofuels, Waste) showing the competing trajectories — fossil decline vs. renewable ascent in district heat.

**Filters:** Year range slider; fuel chip multi-select (8 fuels).

---

### Countries

**Purpose:** EU member state comparison — rank, sort, and explore country-level production and renewable share.

**Charts:**
- **Top N Countries — Horizontal Bar:** Ranked bar chart of countries by total electricity or heat production (2024 GWh). Gold = 1st, lighter blue = top 3, dark blue = rest. Toggle Electricity / Heat view.
- **Renewable Share vs Total — Scatter Plot:** Each dot represents one EU country, plotted on X = total GWh and Y = renewable %. Hover for country name, total, and renewable share. Reveals the inverse relationship for most countries — small countries with hydro or wind are top-right (green and large), while major fossil-heavy economies cluster bottom-right.
- **Renewable Share Ranking — All 27 (Bar):** Every EU country sorted by renewable share. Color-coded: Gold ≥70%, Green ≥40%, Blue ≥20%, Slate <20%. Shows the full distribution of the energy transition across EU member states.

**Filters:** Electricity / Heat toggle; country search; Top N selector (5 / 10 / 15 / All); Sort by Total, Renewable %, or A–Z.

---

### Trends

**Purpose:** Long-run trajectory analysis — how much have fuel volumes and shares changed since 1999?

**Charts:**
- **Absolute GWh Output by Fuel — Line:** Six fuel lines showing raw GWh output per period. Clear divergence: Renewables & Biofuels rising, Solid Fossil Fuels falling sharply.
- **% Growth vs 1999 Baseline — Line:** Percentage change relative to 1999 for each fuel. Chart is capped at ±300% because Wind and Solar PV values are in the thousands of %. Useful for comparing all fuels on a normalized scale.
- **2024 Change vs 1999 — Bar:** Single-period bar showing the net percentage gain or loss for each selected fuel. Green bars = growth (renewables), blue bars = decline (fossil and nuclear). A snapshot summary of the entire transition.

**Filters:** Year range slider; fuel chip multi-select (6 trend fuels).

---

### WEKA

**Purpose:** Interactive explorer for WEKA machine learning model outputs — kMeans clustering and decision tree / random forest classification.

Sub-views are selected via tab buttons in the filter bar.

---

#### Country Elec Clusters

**What it shows:** Results of kMeans (k=3) clustering of 27 EU countries by electricity production profile.

**Content:**
- Interpretation panel: explains what the algorithm did, what each cluster represents, and policy implications.
- **Cluster Distribution Pie:** Shows n and % for each cluster.
- **Cluster Centroids — 5-Year Totals (grouped bar):** Average electricity output per cluster per period. Reveals the size gradient between large and small clusters.
- **Cluster Centroids — 2024 Fuel Breakdown (grouped bar):** Average fuel mix profile per cluster in 2024.

---

#### Country Heat Clusters

**What it shows:** Results of kMeans (k=3) clustering of 27 EU countries by heat production profile.

**Content:**
- Interpretation panel: explains the climate-driven asymmetry (19 countries = Low Heat), cluster identities, and declining-heat trend across all clusters.
- **Cluster Distribution Pie:** Cluster membership counts.
- **Cluster Centroids — 5-Year Totals (grouped bar):** Average heat output per cluster per period.

---

#### Classification

**What it shows:** J48 Decision Tree and Random Forest results predicting each country's renewable heat share class (Low / Med / High).

**Content:**
- Interpretation panel: explains the task, why J48 outperforms RF on small n, what Kappa means, and which classes are easiest/hardest to predict.
- **KPI Badges:** J48 accuracy (64%), J48 Kappa (0.459), RF accuracy (56%), RF Kappa (0.337).
- **Per-Class Metrics Bar Chart:** F-Measure, ROC Area, Precision, and Recall for each model × class combination.
- **Dual Confusion Matrices:** Side-by-side tables for J48 and Random Forest. Diagonal cells (green) = correct predictions; off-diagonal = misclassifications. Hover to identify specific countries.

---

#### GEP Fuel Clusters

**What it shows:** kMeans (k=2) clustering of 13 electricity fuel types by renewable share ratio trajectory and 2024 output.

**Content:**
- Interpretation panel: explains the two-cluster binary result, what goes in each cluster, the GWh disparity, and what the tight WCSSE (2.785) indicates.
- **Model metrics:** WCSSE, iterations, fuel type count.
- **Renewable Share Ratio — Line (centroid trajectories):** Shows how the Low-Renewable and High-Renewable cluster centroids moved across 1999–2019.
- **2024 GWh — Grouped Bar:** Compares average 2024 production of fuel types in each cluster.

---

#### GHP Fuel Clusters

**What it shows:** kMeans (k=2) clustering of heat fuel types by renewable share ratio and 2024 output. Mirrors the GEP analysis.

**Content:**
- Interpretation panel: explains High-Renewable Heat (Solar Thermal, Geothermal, Bioenergy) vs. Low-Renewable, Bioenergy's outsized centroid GWh, and the even tighter WCSSE (2.298) vs. GEP.
- **Model metrics:** WCSSE, iterations, fuel type count.
- **Renewable Share Ratio — Line:** Centroid trajectories for High- and Low-Renewable Heat clusters.
- **2024 GWh — Grouped Bar:** Centroid production comparison.

---

#### Fuel Mix Trajectory

**What it shows:** kMeans (k=3) clustering of 12 fuel types by the *shape* of their percentage-share-of-GEP trajectory from 1999–2024.

**Content:**
- Interpretation panel: explains what trajectory clustering means (vs. value clustering), the three archetypes (Surging / Declining / Fading Out), which fuels belong to each, and the energy transition story in three acts.
- **Cluster size badges:** n and % for Surging (n=2), Declining (n=7), Fading Out (n=3).
- **Centroid Trajectories — Line:** Each cluster's prototype trajectory plotted as % of GEP over time. The Surging line rising steeply from near-zero is the most visually striking feature.
- **Centroid Values Over Time — Grouped Bar:** Raw centroid % values per year per cluster, reinforcing the trajectory shapes.

---

## Color Palette

| Color | Usage |
|---|---|
| `#003399` EU Blue | Navigation header, primary buttons, fossil/base fuel lines |
| `#FFCC00` EU Gold | Accent values, 1st-place highlights, Surging cluster, solar PV |
| `#22C55E` Green | Renewables, positive trends, correct predictions |
| `#4B80D4` Mid Blue | Natural Gas, Low-Renewable cluster, negative trend bars |
| `#64748B` Slate | Solid Fossil Fuels, Full Data reference lines |
| `#334155` Dark Slate | Lignite, Fading Out cluster |
| `#38BDF8` Sky Blue | Wind |
| `#94A3B8` Light Slate | Waste, muted elements |
| `#DC2626` Red | Downward trends, Low Renewable cluster |
| `#F97316` Orange | Med cluster labels |

Both light and dark modes are fully supported. Theme preference is persisted in `localStorage` under key `eu-theme` and applied before React hydration to prevent flash.

---

## Authorship

Built for Applied Data Science coursework — Mapúa Malayan Colleges Mindanao.
Data source: Eurostat EU-27 Energy Statistics (curated workbook, 1999–2024).
