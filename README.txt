================================================================================
  EU ENERGY ANALYTICS DASHBOARD
  Applied Data Science — Mapua Malayan Colleges Mindanao
================================================================================

PROJECT OVERVIEW
----------------
This project is a browser-based analytical dashboard that visualizes EU-27
energy production data from 1999 to 2024 alongside machine learning model
results produced in WEKA. It is built as a static web application and deployed
on Netlify — no server, no login, no backend required.

The dashboard functions similarly to PowerBI: it presents pre-processed data
through interactive charts, filters, and KPI cards organized by topic. It is
designed for academic presentation and analytical exploration.

Data source: Eurostat EU-27 Energy Statistics, curated into the workbook
  EU_Electricity_Heat_5Year_Curated_1999_2024.xlsx
All values are in GWh (gigawatt-hours) at 5-year intervals: 1999, 2004, 2009,
2014, 2019, 2024. Missing values (marked - in the source) are treated as 0.


--------------------------------------------------------------------------------
REPOSITORY CONTENTS
--------------------------------------------------------------------------------

  ADS/
  ├── README.txt                  This file
  ├── ARCHITECTURE.md             Original technical design document
  ├── Datasets/                   Source data and WEKA model outputs
  └── csv-visualizer/             The Next.js dashboard application


--------------------------------------------------------------------------------
DATASETS FOLDER
--------------------------------------------------------------------------------

The Datasets/ folder contains all source data and WEKA results.

  Datasets/
  ├── EU_Electricity_Heat_5Year_Curated_1999_2024.xlsx    Master workbook
  ├── GEP_EU27_Electricity.tsv / .arff                    EU-27 electricity by fuel
  ├── GHP_EU27_Heat.tsv / .arff                           EU-27 heat by fuel
  ├── Country_5yr_Elec.tsv / .arff                        Per-country electricity
  ├── Country_5yr_Heat.tsv / .arff                        Per-country heat
  ├── Fuel_Mix_pct_GEP.tsv / .arff                        Fuel % share of electricity
  ├── Trend_Analysis.tsv / .arff                          Absolute + % change metrics
  ├── manifest.tsv                                        Dataset inventory
  ├── model runs/                                         Raw WEKA output files
  │   ├── Country_5yr_Elec_kMeans.*                       Country elec clustering
  │   ├── Country_5yr_Heat_kMeans.*                       Country heat clustering
  │   ├── Country_5yr_Heat_classification.*               J48 + Random Forest results
  │   ├── GEP_Cluster.*                                   Electricity fuel clustering
  │   ├── GHP_Cluster.*                                   Heat fuel clustering
  │   └── EU_FuelMix_pct_Kmeans.*                         Fuel trajectory clustering
  └── processed/                                          Cleaned copies (? replaced with 0)


DATASET DESCRIPTIONS AND INTERPRETATIONS
-----------------------------------------

GEP_EU27_Electricity  (Gross Electricity Production)
  Contains total electricity generation (GWh) for all EU-27 countries combined,
  broken down by 13 fuel types across 6 five-year intervals.

  Fuel types: Nuclear, Natural Gas, Solid Fossil Fuels, Lignite, Oil & Petroleum,
  Renewables & Biofuels, Hydro, Wind, Solar PV, Solar Thermal, Bioenergy, Waste,
  Batteries.

  Interpretation:
  This is the primary electricity time-series. The defining trend is structural
  energy transition: total GEP fell slightly (-4.6%) from 1999 to 2024, but the
  internal composition shifted dramatically. Solid Fossil Fuels + Lignite dropped
  from ~42% to ~16% of total mix. Wind grew from 0.5% to ~18%. Solar PV grew
  from near-zero to ~10%. Renewables & Biofuels as a combined category overtook
  Nuclear around 2009, and by 2024 represent the single largest category at 46.5%
  of total GEP. Nuclear declined 23.4% in absolute GWh.

  Key figures:
    - Total GEP 2024: ~2.78 million GWh
    - Renewables & Biofuels 2024: 46.5% share (was ~17% in 1999)
    - Wind 2024: ~18% share (was 0.5% in 1999)
    - Solar PV growth 1999-2024: +345,276% (from 86 GWh to 297,000 GWh)


GHP_EU27_Heat  (Gross Heat Production)
  Contains total district heat and combined heat & power (CHP) output for EU-27,
  broken down by 8 fuel types across 6 five-year intervals.

  Fuel types: Natural Gas, Solid Fossil Fuels, Lignite, Oil & Petroleum,
  Renewables & Biofuels, Waste, Nuclear, Solar Thermal.

  Interpretation:
  EU heat production is concentrated in northern and eastern member states with
  established district heating networks (Germany, Poland, France, Sweden, Finland).
  Total GHP peaked in 2004 (~708 TWh) and has since declined ~21% as building
  efficiency standards improved and gas-heated floorspace decreased.

  The most significant shift: Renewables & Biofuels grew from 8.5% (1999) to
  34.9% (2024) of the heat mix, driven almost entirely by biomass and bioenergy
  in district heating systems. Natural Gas remains the largest single source at
  32.2%, but Solid Fossil Fuels fell 63% over the period.

  Key figures:
    - Total GHP 2024: ~556,000 GWh
    - Renewables & Biofuels share: 34.9% (was 8.5% in 1999, +293% absolute growth)
    - Natural Gas share: 32.2% (still the largest single source)
    - Solid Fossil Fuels: declined 63% since 1999


Country_5yr_Elec  (Per-Country Electricity, 5-Year Totals)
  Each of the 27 EU member states as a row, with total electricity output per
  5-year interval and 2024 fuel breakdown per country.

  Interpretation:
  Electricity output is highly concentrated: Germany, France, and Spain together
  account for approximately 48% of total EU-27 GEP. Country-level renewable
  shares vary enormously — Austria, Denmark, and Latvia exceed 70% while Poland,
  Bulgaria, and Czechia remain below 30%. This dataset is used by the WEKA
  Country Electricity clustering and the Countries dashboard.

  WEKA kMeans result (k=3):
    - High Renewable (n=18, 67%): Majority of EU states with higher renewable
      proportions, typically smaller producers where wind or hydro dominates.
    - Med Renewable (n=4, 15%): Countries with mixed fossil-renewable portfolios
      and moderate output.
    - Low Renewable (n=5, 19%): Countries still dominated by fossil fuels or
      nuclear power, representing the primary targets for decarbonization policy.


Country_5yr_Heat  (Per-Country Heat, 5-Year Totals)
  Same structure as Country_5yr_Elec but for heat production across 27 EU
  member states.

  Interpretation:
  Heat production is far more geographically asymmetric than electricity. 19 of
  27 EU countries produce negligible district heat — climate is the dominant
  driver. This asymmetry means a few large district-heating economies (Germany,
  Poland, France) define the aggregate trend while the majority contribute almost
  nothing.

  All three WEKA clusters show declining totals from 2004 to 2024, consistent
  with pan-EU building efficiency improvements and gradual district heating
  network consolidation.

  WEKA kMeans result (k=3):
    - High Heat (n=3, 11%): Major district-heating economies, averaging 70K+
      GWh per period. Gas and Renewables dominant.
    - Med Heat (n=5, 19%): Moderate heat producers averaging 44-55K GWh per
      period, with fossil-heavy mixes.
    - Low Heat (n=19, 70%): The large majority of EU countries, averaging under
      10K GWh per period. Mostly warm-climate economies.

  WEKA Classification (J48 + Random Forest predicting Renewable Share Class):
    - Task: Classify countries as Low / Med / High renewable heat share
    - J48 Decision Tree: 64% accuracy, Kappa 0.459 (16/27 correct)
    - Random Forest:     56% accuracy, Kappa 0.337 (14/27 correct)
    - J48 outperforms RF because Random Forest requires larger training sets;
      n=27 is too small for ensemble averaging to help.
    - "High" class is easiest to predict (F=0.778); "Med" is hardest (F=0.471)
      because borderline countries are genuinely ambiguous.
    - Kappa 0.459 = moderate agreement beyond chance, well above random (33%).


Fuel_Mix_pct_GEP  (Fuel Mix as % of Gross Electricity)
  Each fuel type's share of total EU-27 GEP as a percentage per year. A
  normalized version of the GEP data that removes absolute volume effects.

  Interpretation:
  This dataset is the basis for the WEKA Fuel Mix Trajectory clustering. By
  working with percentage shares rather than absolute GWh, the analysis captures
  the structural composition of the electricity system rather than its size.

  WEKA kMeans result (k=3, Trajectory Clustering):
    - Surging (n=2, 17%): Solar PV and Wind. Centroid rose from 0.26% share
      in 1999 to 13.91% in 2024. These are the defining fuels of the transition.
    - Declining (n=7, 58%): Nuclear, Natural Gas, Solid Fossil Fuels, Lignite,
      Hydro, Biofuels aggregate, Oil. Historically dominant fuels losing share.
    - Fading Out (n=3, 25%): Marginal fuels with small, declining shares across
      all periods. Centroid fell from 6.68% to 0.83%.
    This three-way classification compresses 25 years of EU energy history into
    a single story: two fuels surging, seven declining, three disappearing.


GEP_Cluster  (Electricity Fuel Type Clustering)
  13 electricity fuel types clustered by renewable share ratio across 5 periods
  plus 2024 absolute GWh output. WEKA kMeans, k=2, WCSSE=2.785, 3 iterations.

  Interpretation:
  The binary split is sharp and policy-meaningful:
    - Low-Renewable Fuels (n=10, 77%): Nuclear, Gas, Coal, Lignite, Oil,
      Bioenergy, Waste and others. Renewable share ratios below 21% throughout.
      Average 2024 GWh centroid: 213K GWh per fuel type.
    - High-Renewable Fuels (n=3, 23%): Hydro, Wind, Solar PV. Renewable share
      ratios of 77-83%. Average 2024 GWh centroid: 738K GWh per fuel type.

  Despite being only 3 fuel types, the High-Renewable cluster accounts for
  more than 3x the average output of Low-Renewable fuels, driven by the growth
  of Wind and Solar PV. The tight WCSSE (2.785) confirms genuine separation.


GHP_Cluster  (Heat Fuel Type Clustering)
  Same analysis applied to heat fuel types. WEKA kMeans, k=2, WCSSE=2.298,
  2 iterations.

  Interpretation:
  The heat fuel binary split:
    - High-Renewable Heat (n=3, 23%): Solar Thermal, Geothermal, Bioenergy.
      Centroid renewable share rose from 0.687 to 0.827 over 1999-2019.
      Average 2024 GWh centroid: 153K GWh per fuel type.
    - Low-Renewable Heat (n=10, 77%): Gas, Coal, Lignite, Oil, Waste, Nuclear.
      Centroid below 24% renewable share throughout.
      Average 2024 GWh centroid: 41K GWh per fuel type.

  WCSSE is even lower (2.298) than the electricity clustering, indicating that
  heat fuel types are even more cleanly binary — fossil vs. renewable — with
  almost no ambiguous middle ground.


Trend_Analysis  (Long-Run Fuel Trend Metrics)
  Derived dataset containing two metrics per fuel per year: absolute GWh output
  and percentage change vs 1999 baseline. Covers 6 selected fuels:
    Renewables & Biofuels, Wind, Solar PV, Nuclear, Natural Gas, Solid Fossil Fuels.

  Interpretation:
  The baseline-relative growth figures for Wind (+2,000%+) and Solar PV
  (+345,276%) are extreme because both started from near-zero in 1999. These
  are not incremental improvements but technology substitution events — two
  entirely new industries displacing incumbents over 25 years. Fossil fuel
  declines of 40-65% represent a genuine structural exit from the EU generation
  mix, not cyclical variation.


--------------------------------------------------------------------------------
APPLICATION (csv-visualizer)
--------------------------------------------------------------------------------

The dashboard is built with:
  - Next.js 16 (static export, no server required)
  - TypeScript
  - shadcn/ui + Tailwind CSS (EU blue #003399 + gold #FFCC00 theme)
  - Recharts (all charts)
  - Light and dark mode (saved in browser storage)

To run locally:
  cd csv-visualizer
  npm install
  npm run dev         Opens at http://localhost:3000

To build for deployment:
  npm run build       Outputs static files to /out
  Upload /out to Netlify, or use the included netlify.toml for auto-deploy.

The application has 6 sections navigated from the top bar:
  Overview       EU-27 summary with electricity and heat production KPIs
  Electricity    Gross Electricity Production by fuel type
  Heat           Gross Heat Production by fuel type
  Countries      EU member state comparisons
  Trends         Long-run fuel trajectory analysis
  WEKA           Machine learning model results explorer

For detailed section content, refer to STRUCTURE.txt in this folder.


--------------------------------------------------------------------------------
NOTES
--------------------------------------------------------------------------------

- All data is embedded directly in the application as TypeScript constants.
  No CSV files are loaded at runtime; all parsing and embedding was done
  during development.
- Missing values (? or -) in source data are treated as 0 throughout.
- Course: Applied Data Science
  Institution: Mapua Malayan Colleges Mindanao
  Data source: Eurostat (publicly available EU energy statistics)
