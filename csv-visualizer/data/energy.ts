// EU Energy Data — sourced from EU_Electricity_Heat_5Year_Curated_1999_2024.xlsx
// Missing values (?) replaced with 0. Units: GWh unless noted.

export const YEARS = [1999, 2004, 2009, 2014, 2019, 2024] as const;
export type Year = (typeof YEARS)[number];

// ── Fuel display names — Blue-gold EU palette ─────────────────────────────────
// Blue shades for fossil/nuclear; gold for solar; green for renewables; grey for minor
export const FUEL_COLORS: Record<string, string> = {
  "Nuclear":               "#1A52B8",  // strong EU blue
  "Natural Gas":           "#4B80D4",  // medium blue
  "Solid Fossil Fuels":    "#64748B",  // blue-grey slate
  "Lignite":               "#334155",  // dark slate
  "Oil & Petroleum":       "#8DB0F7",  // light blue
  "Renewables & Biofuels": "#22C55E",  // green (semantic: clean energy)
  "Hydro":                 "#60A5FA",  // sky blue
  "Wind":                  "#38BDF8",  // cyan-blue
  "Solar Thermal":         "#FFE066",  // light gold
  "Solar PV":              "#FFCC00",  // EU gold
  "Bioenergy":             "#4ADE80",  // light green
  "Waste":                 "#94A3B8",  // neutral grey
  "Batteries":             "#A5B4FC",  // lavender (minor)
  "TOTAL":                 "#003399",  // EU blue
  "Fossil Total":          "#334155",  // dark slate
};

export const EU_COUNTRIES = [
  "Austria","Belgium","Bulgaria","Cyprus","Czechia","Germany","Denmark",
  "Estonia","Greece","Spain","Finland","France","Croatia","Hungary",
  "Ireland","Italy","Lithuania","Luxembourg","Latvia","Malta",
  "Netherlands","Poland","Portugal","Romania","Sweden","Slovenia","Slovakia",
] as const;

// ── EU-27 Gross Electricity Production (GWh) ─────────────────────────────────
export interface YearPoint { year: number; [fuel: string]: number }

export const gepTimeSeries: YearPoint[] = [
  { year: 1999, "Nuclear": 848251, "Natural Gas": 305799, "Solid Fossil Fuels": 743721, "Lignite": 318413, "Oil & Petroleum": 185564, "Renewables & Biofuels": 377735.66, "Hydro": 333568.948, "Wind": 13232.739, "Solar Thermal": 0, "Solar PV": 85.961, "Bioenergy": 0, "Waste": 10332.861, "Batteries": 0 },
  { year: 2004, "Nuclear": 928438, "Natural Gas": 448198.257, "Solid Fossil Fuels": 820713, "Lignite": 349221, "Oil & Petroleum": 137954.672, "Renewables & Biofuels": 427881.439, "Hydro": 313339.79, "Wind": 56721.227, "Solar Thermal": 0, "Solar PV": 687.913, "Bioenergy": 0, "Waste": 10265.637, "Batteries": 0 },
  { year: 2009, "Nuclear": 824912, "Natural Gas": 551046.795, "Solid Fossil Fuels": 690678.826, "Lignite": 318172, "Oil & Petroleum": 89654.013, "Renewables & Biofuels": 552626.275, "Hydro": 320715.071, "Wind": 117028.012, "Solar Thermal": 103, "Solar PV": 13840.981, "Bioenergy": 0, "Waste": 15670.041, "Batteries": 0 },
  { year: 2014, "Nuclear": 812550.009, "Natural Gas": 350182.579, "Solid Fossil Fuels": 680816.867, "Lignite": 315467, "Oil & Petroleum": 59159.278, "Renewables & Biofuels": 806508.476, "Hydro": 354480.298, "Wind": 210683.731, "Solar Thermal": 5454.806, "Solar PV": 88089.918, "Bioenergy": 0, "Waste": 19079.184, "Batteries": 0 },
  { year: 2019, "Nuclear": 765337.856, "Natural Gas": 552035.55, "Solid Fossil Fuels": 445379.092, "Lignite": 241438.576, "Oil & Petroleum": 50708.872, "Renewables & Biofuels": 951345.115, "Hydro": 311440.777, "Wind": 354353.143, "Solar Thermal": 5683, "Solar PV": 116528.136, "Bioenergy": 0, "Waste": 21258.055, "Batteries": 0 },
  { year: 2024, "Nuclear": 649545.843, "Natural Gas": 437554.914, "Solid Fossil Fuels": 271891.735, "Lignite": 165024.045, "Oil & Petroleum": 44588.526, "Renewables & Biofuels": 1292159.024, "Hydro": 354766.694, "Wind": 475618.535, "Solar Thermal": 4540.03, "Solar PV": 296888.859, "Bioenergy": 0, "Waste": 19789.176, "Batteries": 1040.335 },
];

export const gepTotals = [2543035.099, 2862929.675, 2796287.94, 2808998.431, 2854627.207, 2777644.955];

// ── EU-27 Gross Heat Production (GWh) ────────────────────────────────────────
export const ghpTimeSeries: YearPoint[] = [
  { year: 1999, "Nuclear": 950.277, "Natural Gas": 190233.057, "Solid Fossil Fuels": 226114.722, "Lignite": 61798.333, "Oil & Petroleum": 74789.719, "Renewables & Biofuels": 49904.168, "Hydro": 0, "Wind": 0, "Solar Thermal": 6.389, "Solar PV": 0, "Bioenergy": 0, "Waste": 14448.056, "Batteries": 0 },
  { year: 2004, "Nuclear": 1816.388, "Natural Gas": 299872.744, "Solid Fossil Fuels": 212948.61, "Lignite": 40227.501, "Oil & Petroleum": 65160.551, "Renewables & Biofuels": 71545.684, "Hydro": 0, "Wind": 0, "Solar Thermal": 14.167, "Solar PV": 0, "Bioenergy": 0, "Waste": 17031.944, "Batteries": 0 },
  { year: 2009, "Nuclear": 1853.333, "Natural Gas": 265930.2, "Solid Fossil Fuels": 187893.251, "Lignite": 35973.057, "Oil & Petroleum": 48364.496, "Renewables & Biofuels": 98778.122, "Hydro": 0, "Wind": 0, "Solar Thermal": 45.612, "Solar PV": 0, "Bioenergy": 0, "Waste": 23309.495, "Batteries": 0 },
  { year: 2014, "Nuclear": 1124.444, "Natural Gas": 220726.464, "Solid Fossil Fuels": 163371.855, "Lignite": 34178.333, "Oil & Petroleum": 29259.725, "Renewables & Biofuels": 151239.665, "Hydro": 0, "Wind": 0, "Solar Thermal": 230.459, "Solar PV": 0, "Bioenergy": 0, "Waste": 29068.54, "Batteries": 0 },
  { year: 2019, "Nuclear": 1105.548, "Natural Gas": 218119.525, "Solid Fossil Fuels": 135354.763, "Lignite": 26312.761, "Oil & Petroleum": 21090.849, "Renewables & Biofuels": 187836.54, "Hydro": 0, "Wind": 0, "Solar Thermal": 683.821, "Solar PV": 0, "Bioenergy": 0, "Waste": 36281.812, "Batteries": 0 },
  { year: 2024, "Nuclear": 1152.759, "Natural Gas": 180821.409, "Solid Fossil Fuels": 83698.848, "Lignite": 18050.139, "Oil & Petroleum": 13524.413, "Renewables & Biofuels": 195897.126, "Hydro": 0, "Wind": 0, "Solar Thermal": 736.777, "Solar PV": 0, "Bioenergy": 0, "Waste": 39437.953, "Batteries": 0 },
];

export const ghpTotals = [585209.722, 708635.421, 662952.722, 632090.859, 645600.383, 561184.202];

// ── Fuel Mix % of Gross Electricity Production ───────────────────────────────
export const fuelMixTimeSeries: YearPoint[] = [
  { year: 1999, "Nuclear": 33.36, "Natural Gas": 12.02, "Solid Fossil Fuels": 29.25, "Lignite": 12.52, "Oil & Petroleum": 7.30, "Renewables & Biofuels": 14.85, "Hydro": 13.12, "Wind": 0.52, "Solar Thermal": 0, "Solar PV": 0.003, "Bioenergy": 0, "Waste": 0.41, "Batteries": 0 },
  { year: 2004, "Nuclear": 32.43, "Natural Gas": 15.66, "Solid Fossil Fuels": 28.67, "Lignite": 12.20, "Oil & Petroleum": 4.82, "Renewables & Biofuels": 14.95, "Hydro": 10.94, "Wind": 1.98, "Solar Thermal": 0, "Solar PV": 0.024, "Bioenergy": 0, "Waste": 0.36, "Batteries": 0 },
  { year: 2009, "Nuclear": 29.50, "Natural Gas": 19.71, "Solid Fossil Fuels": 24.70, "Lignite": 11.38, "Oil & Petroleum": 3.21, "Renewables & Biofuels": 19.76, "Hydro": 11.47, "Wind": 4.19, "Solar Thermal": 0.004, "Solar PV": 0.495, "Bioenergy": 0, "Waste": 0.56, "Batteries": 0 },
  { year: 2014, "Nuclear": 28.93, "Natural Gas": 12.47, "Solid Fossil Fuels": 24.24, "Lignite": 11.23, "Oil & Petroleum": 2.11, "Renewables & Biofuels": 28.71, "Hydro": 12.62, "Wind": 7.50, "Solar Thermal": 0.194, "Solar PV": 3.14, "Bioenergy": 0, "Waste": 0.68, "Batteries": 0 },
  { year: 2019, "Nuclear": 26.81, "Natural Gas": 19.34, "Solid Fossil Fuels": 15.60, "Lignite": 8.46, "Oil & Petroleum": 1.78, "Renewables & Biofuels": 33.33, "Hydro": 10.91, "Wind": 12.41, "Solar Thermal": 0.199, "Solar PV": 4.08, "Bioenergy": 0, "Waste": 0.74, "Batteries": 0 },
  { year: 2024, "Nuclear": 23.38, "Natural Gas": 15.75, "Solid Fossil Fuels": 9.79, "Lignite": 5.94, "Oil & Petroleum": 1.61, "Renewables & Biofuels": 46.52, "Hydro": 12.77, "Wind": 17.12, "Solar Thermal": 0.163, "Solar PV": 10.69, "Bioenergy": 0, "Waste": 0.71, "Batteries": 0.037 },
];

// ── Country-level Electricity (GWh) ──────────────────────────────────────────
export interface CountryElecRow {
  country: string;
  total1999: number; total2004: number; total2009: number; total2014: number; total2019: number; total2024: number;
  nuclear2024: number; naturalGas2024: number; solidFossil2024: number; lignite2024: number;
  oil2024: number; renewables2024: number; hydro2024: number; wind2024: number;
  solarThermal2024: number; solarPV2024: number; bioenergy2024: number; waste2024: number; batteries2024: number;
}

export const countryElec: CountryElecRow[] = [
  { country: "Austria",     total1999: 60944.018,   total2004: 64154.047,   total2009: 69087.512,   total2014: 65438.872,   total2019: 74234.304,   total2024: 82406.732,   nuclear2024: 0,          naturalGas2024: 7536.924,  solidFossil2024: 23.648,    lignite2024: 0,        oil2024: 718.878,   renewables2024: 67778.709,  hydro2024: 45707.084, wind2024: 9257.422,  solarThermal2024: 0,      solarPV2024: 8143.267,  bioenergy2024: 4683.261, waste2024: 755.105,  batteries2024: 4.269 },
  { country: "Belgium",     total1999: 84514,       total2004: 84210.123,   total2009: 91184.317,   total2014: 72545.6,     total2019: 93644.295,   total2024: 77156.8,     nuclear2024: 31254.6,    naturalGas2024: 14159.5,   solidFossil2024: 12.7,      lignite2024: 0,        oil2024: 198.2,     renewables2024: 26537.9,    hydro2024: 545.7,     wind2024: 13824.5,   solarThermal2024: 0,      solarPV2024: 8562.1,    bioenergy2024: 3628.483, waste2024: 1213.7,   batteries2024: 155.5 },
  { country: "Bulgaria",    total1999: 38248,       total2004: 41620.811,   total2009: 42963.39,    total2014: 47489.649,   total2019: 44276.591,   total2024: 38535.175,   nuclear2024: 15777.075,  naturalGas2024: 2040.441,  solidFossil2024: 8758.02,   lignite2024: 8164.495, oil2024: 361.542,   renewables2024: 11369.751,  hydro2024: 2787.148,  wind2024: 1377.086,  solarThermal2024: 0,      solarPV2024: 5489.148,  bioenergy2024: 1716.369, waste2024: 22.596,   batteries2024: 28.338 },
  { country: "Cyprus",      total1999: 3139,        total2004: 4201.807,    total2009: 5214.708,    total2014: 4349.922,    total2019: 5141.491,    total2024: 5763.191,    nuclear2024: 0,          naturalGas2024: 0,         solidFossil2024: 0,         lignite2024: 0,        oil2024: 4396.769,  renewables2024: 1366.422,   hydro2024: 0,         wind2024: 202.649,   solarThermal2024: 0,      solarPV2024: 1108.457,  bioenergy2024: 55.316,   waste2024: 0,        batteries2024: 0 },
  { country: "Czechia",     total1999: 64694.232,   total2004: 84334.903,   total2009: 82185.712,   total2014: 86147.804,   total2019: 87035.182,   total2024: 73900.393,   nuclear2024: 29696.397,  naturalGas2024: 3772.025,  solidFossil2024: 26525.9,   lignite2024: 25161.546,oil2024: 73.451,    renewables2024: 12347.563,  hydro2024: 2662.82,   wind2024: 716.81,    solarThermal2024: 0,      solarPV2024: 3592.683,  bioenergy2024: 5378.914, waste2024: 152.98,   batteries2024: 9.155 },
  { country: "Germany",     total1999: 556300,      total2004: 618069,      total2009: 596470,      total2014: 627806,      total2019: 606917,      total2024: 514009,      nuclear2024: 0,          naturalGas2024: 90487,     solidFossil2024: 106333,    lignite2024: 78504,    oil2024: 4547,      renewables2024: 289417,     hydro2024: 23825,     wind2024: 138914,    solarThermal2024: 0,      solarPV2024: 75379,     bioenergy2024: 52448,    waste2024: 6160,     batteries2024: 220 },
  { country: "Denmark",     total1999: 38920,       total2004: 40430,       total2009: 36383,       total2014: 32183.62,    total2019: 29516.955,   total2024: 35317.578,   nuclear2024: 0,          naturalGas2024: 909.403,   solidFossil2024: 1750.661,  lignite2024: 0,        oil2024: 223.475,   renewables2024: 31408.963,  hydro2024: 22.562,    wind2024: 20552.836, solarThermal2024: 0,      solarPV2024: 3776.202,  bioenergy2024: 7335.198, waste2024: 1025.077, batteries2024: 0 },
  { country: "Estonia",     total1999: 8278,        total2004: 10304,       total2009: 8778.32,     total2014: 12445.714,   total2019: 7615.265,    total2024: 6367.833,    nuclear2024: 0,          naturalGas2024: 77.284,    solidFossil2024: 0.052,     lignite2024: 0,        oil2024: 26.103,    renewables2024: 3597.019,   hydro2024: 30.045,    wind2024: 1166.079,  solarThermal2024: 0,      solarPV2024: 1065.427,  bioenergy2024: 1337.312, waste2024: 95.288,   batteries2024: 0 },
  { country: "Greece",      total1999: 49632,       total2004: 59345.781,   total2009: 61340.348,   total2014: 50473.29,    total2019: 48625.991,   total2024: 57924.399,   nuclear2024: 0,          naturalGas2024: 21529.23,  solidFossil2024: 3269.523,  lignite2024: 3269.523, oil2024: 4894.99,   renewables2024: 27691.068,  hydro2024: 3581.68,   wind2024: 12136.202, solarThermal2024: 0,      solarPV2024: 11258.411, bioenergy2024: 714.775,  waste2024: 53.69,    batteries2024: 0 },
  { country: "Spain",       total1999: 208247,      total2004: 279974.38,   total2009: 294620,      total2014: 278749.282,  total2019: 273257,      total2024: 287914.758,  nuclear2024: 54532.38,   naturalGas2024: 52329.097, solidFossil2024: 2581.517,  lignite2024: 0,        oil2024: 9123.644,  renewables2024: 160970.969, hydro2024: 34414.726, wind2024: 62089.787, solarThermal2024: 4540.03,solarPV2024: 53752.44,  bioenergy2024: 6218.202, waste2024: 840.265,  batteries2024: 8.266 },
  { country: "Finland",     total1999: 69457.417,   total2004: 85845.372,   total2009: 72070.997,   total2014: 68093.524,   total2019: 68650.852,   total2024: 83152.987,   nuclear2024: 32599,      naturalGas2024: 782,       solidFossil2024: 830,       lignite2024: 0,        oil2024: 241,       renewables2024: 46673.256,  hydro2024: 14299.241, wind2024: 21046.257, solarThermal2024: 0,      solarPV2024: 939.941,   bioenergy2024: 10394.304,waste2024: 444.731,  batteries2024: 30 },
  { country: "France",      total1999: 525806.227,  total2004: 574054.409,  total2009: 535925.135,  total2014: 572983.975,  total2019: 571316.327,  total2024: 570904.315,  nuclear2024: 380451.093, naturalGas2024: 18104.938, solidFossil2024: 1020.566,  lignite2024: 0,        oil2024: 5580.252,  renewables2024: 155682.569, hydro2024: 71115.895, wind2024: 47499.378, solarThermal2024: 0,      solarPV2024: 25062.942, bioenergy2024: 12011.735,waste2024: 2334.228, batteries2024: 105.562 },
  { country: "Croatia",     total1999: 12979.4,     total2004: 13989.7,     total2009: 13454.061,   total2014: 13552.842,   total2019: 12760.3,     total2024: 15360.4,     nuclear2024: 0,          naturalGas2024: 3249.9,    solidFossil2024: 801.3,     lignite2024: 0,        oil2024: 29.9,      renewables2024: 11128,      hydro2024: 6727,      wind2024: 2576.6,    solarThermal2024: 0,      solarPV2024: 820,       bioenergy2024: 1004.4,   waste2024: 0,        batteries2024: 0 },
  { country: "Hungary",     total1999: 37831.621,   total2004: 33707.385,   total2009: 35908.015,   total2014: 29402.943,   total2019: 34291,       total2024: 37987.362,   nuclear2024: 16017,      naturalGas2024: 7126,      solidFossil2024: 2444,      lignite2024: 2391,     oil2024: 65.2,      renewables2024: 11936.6,    hydro2024: 231,       wind2024: 659,       solarThermal2024: 0,      solarPV2024: 9200,      bioenergy2024: 1847.053, waste2024: 262.5,    batteries2024: 10.069 },
  { country: "Ireland",     total1999: 22013.104,   total2004: 25579.873,   total2009: 28371.284,   total2014: 26170.667,   total2019: 31121.553,   total2024: 31492.654,   nuclear2024: 0,          naturalGas2024: 15095.854, solidFossil2024: 632.611,   lignite2024: 0,        oil2024: 601.711,   renewables2024: 14512.163,  hydro2024: 766.112,   wind2024: 11649.561, solarThermal2024: 0,      solarPV2024: 1093.092,  bioenergy2024: 1017.656, waste2024: 290.846,  batteries2024: 26.859 },
  { country: "Italy",       total1999: 265667,      total2004: 303347.441,  total2009: 292640.98,   total2014: 279826.504,  total2019: 293852.993,  total2024: 271007.173,  nuclear2024: 0,          naturalGas2024: 118553.746,solidFossil2024: 3948.434,  lignite2024: 0,        oil2024: 8575.928,  renewables2024: 134357.398, hydro2024: 53130.8,   wind2024: 22321.895, solarThermal2024: 0,      solarPV2024: 35993.103, bioenergy2024: 17880.555,waste2024: 2318.301, batteries2024: 180.133 },
  { country: "Lithuania",   total1999: 13536,       total2004: 19274,       total2009: 15358,       total2014: 4397,        total2019: 3971.6,      total2024: 8091.9,      nuclear2024: 0,          naturalGas2024: 843.5,     solidFossil2024: 0,         lignite2024: 0,        oil2024: 140.2,     renewables2024: 6261,       hydro2024: 436.5,     wind2024: 3448.2,    solarThermal2024: 0,      solarPV2024: 1397.2,    bioenergy2024: 985.103,  waste2024: 182.5,    batteries2024: 1.3 },
  { country: "Luxembourg",  total1999: 1022.008,    total2004: 4132.15,     total2009: 3878.379,    total2014: 2964.981,    total2019: 1908.422,    total2024: 2742.34,     nuclear2024: 0,          naturalGas2024: 65.288,    solidFossil2024: 0,         lignite2024: 0,        oil2024: 0.001,     renewables2024: 1373.037,   hydro2024: 105.181,   wind2024: 466.796,   solarThermal2024: 0,      solarPV2024: 359.596,   bioenergy2024: 441.877,  waste2024: 68.374,   batteries2024: 0 },
  { country: "Latvia",      total1999: 4110.32,     total2004: 4689.24,     total2009: 5568.067,    total2014: 5139.411,    total2019: 6438.385,    total2024: 6321.62,     nuclear2024: 0,          naturalGas2024: 1678.253,  solidFossil2024: 0,         lignite2024: 0,        oil2024: 0.916,     renewables2024: 4642.451,   hydro2024: 3208.793,  wind2024: 275.985,   solarThermal2024: 0,      solarPV2024: 536.379,   bioenergy2024: 634.027,  waste2024: 0,        batteries2024: 0 },
  { country: "Malta",       total1999: 1854,        total2004: 2216,        total2009: 2168,        total2014: 2244.89,     total2019: 2059.829,    total2024: 2185.877,    nuclear2024: 0,          naturalGas2024: 1841.979,  solidFossil2024: 0,         lignite2024: 0,        oil2024: 7.892,     renewables2024: 336.006,    hydro2024: 0,         wind2024: 0.033,     solarThermal2024: 0,      solarPV2024: 326.676,   bioenergy2024: 9.297,    waste2024: 0,        batteries2024: 0 },
  { country: "Netherlands", total1999: 86720.436,   total2004: 101213.681,  total2009: 113689.499,  total2014: 103357.364,  total2019: 121408.002,  total2024: 123843.947,  nuclear2024: 3573.592,   naturalGas2024: 44290.586, solidFossil2024: 7467.01,   lignite2024: 0,        oil2024: 1356.217,  renewables2024: 62099.275,  hydro2024: 85.391,    wind2024: 33509.406, solarThermal2024: 0,      solarPV2024: 21822.202, bioenergy2024: 7146.322, waste2024: 1711.475, batteries2024: 182.257 },
  { country: "Poland",      total1999: 142128,      total2004: 154159.137,  total2009: 151721.643,  total2014: 159058.788,  total2019: 163988.501,  total2024: 172452.808,  nuclear2024: 0,          naturalGas2024: 20456.963, solidFossil2024: 93496.08,  lignite2024: 36320.024,oil2024: 2155.02,   renewables2024: 52674.16,   hydro2024: 2114.529,  wind2024: 24945.223, solarThermal2024: 0,      solarPV2024: 17662.76,  bioenergy2024: 7951.648, waste2024: 594.522,  batteries2024: 69.107 },
  { country: "Portugal",    total1999: 43287,       total2004: 45105.484,   total2009: 50207.048,   total2014: 52803.507,   total2019: 53154.17,    total2024: 51089.446,   nuclear2024: 0,          naturalGas2024: 5634.081,  solidFossil2024: 0,         lignite2024: 0,        oil2024: 1145.714,  renewables2024: 40353.204,  hydro2024: 14892.597, wind2024: 14418.962, solarThermal2024: 0,      solarPV2024: 7088.01,   bioenergy2024: 3751.734, waste2024: 254.754,  batteries2024: 0.631 },
  { country: "Romania",     total1999: 50464,       total2004: 56499.053,   total2009: 58014.149,   total2014: 65674.622,   total2019: 59622.805,   total2024: 53376.025,   nuclear2024: 10911.981,  naturalGas2024: 9154.497,  solidFossil2024: 7959.655,  lignite2024: 7959.655, oil2024: 573.315,   renewables2024: 24442.059,  hydro2024: 14192.604, wind2024: 6350.28,   solarThermal2024: 0,      solarPV2024: 3422.688,  bioenergy2024: 476.487,  waste2024: 0.005,    batteries2024: 0 },
  { country: "Sweden",      total1999: 154860.316,  total2004: 151739.141,  total2009: 136734.684,  total2014: 153662.426,  total2019: 168439,      total2024: 172366.999,  nuclear2024: 50665,      naturalGas2024: 105.697,   solidFossil2024: 13,        lignite2024: 0,        oil2024: 331.371,   renewables2024: 119577.692, hydro2024: 64615,     wind2024: 40621,     solarThermal2024: 0,      solarPV2024: 4163,      bioenergy2024: 10182.912,waste2024: 1203,     batteries2024: 0 },
  { country: "Slovenia",    total1999: 13262,       total2004: 15271.241,   total2009: 16403.179,   total2014: 17437.741,   total2019: 16099.564,   total2024: 16992.689,   nuclear2024: 5835.725,   naturalGas2024: 481.809,   solidFossil2024: 3498.058,  lignite2024: 3181.802, oil2024: 8.551,     renewables2024: 6869.994,   hydro2024: 5335.883,  wind2024: 6.55,      solarThermal2024: 0,      solarPV2024: 1268.145,  bioenergy2024: 259.416,  waste2024: 10.993,   batteries2024: 4.52 },
  { country: "Slovakia",    total1999: 28407,       total2004: 30567,       total2009: 26154.561,   total2014: 27401,       total2019: 28434,       total2024: 30070,       nuclear2024: 18232,      naturalGas2024: 2883,      solidFossil2024: 526,       lignite2024: 72,       oil2024: 357,       renewables2024: 7108,       hydro2024: 4826,      wind2024: 5,         solarThermal2024: 0,      solarPV2024: 694,       bioenergy2024: 1583,     waste2024: 49,       batteries2024: 5 },
];

// ── Country-level Heat (GWh) ──────────────────────────────────────────────────
export interface CountryHeatRow {
  country: string;
  total1999: number; total2004: number; total2009: number; total2014: number; total2019: number; total2024: number;
  nuclear2024: number; naturalGas2024: number; solidFossil2024: number; lignite2024: number;
  oil2024: number; renewables2024: number; solarThermal2024: number; bioenergy2024: number; waste2024: number;
}

export const countryHeat: CountryHeatRow[] = [
  { country: "Austria",     total1999: 13366.944, total2004: 15660.833, total2009: 19492.049, total2014: 21888.129, total2019: 23316.429, total2024: 22638.568, nuclear2024: 0,       naturalGas2024: 6924.539,  solidFossil2024: 0,        lignite2024: 0,       oil2024: 756.239,  renewables2024: 12875.102, solarThermal2024: 38.446,  bioenergy2024: 12555.042, waste2024: 1753.756 },
  { country: "Belgium",     total1999: 5004.722,  total2004: 9150.806,  total2009: 10358.833, total2014: 10042.139, total2019: 8464.722,  total2024: 3972.972,  nuclear2024: 0,       naturalGas2024: 2363.278,  solidFossil2024: 0,        lignite2024: 0,       oil2024: 4.75,     renewables2024: 1133.417,  solarThermal2024: 0,       bioenergy2024: 1113.069,  waste2024: 471.528 },
  { country: "Bulgaria",    total1999: 15365.556, total2004: 14096.389, total2009: 16698.056, total2014: 15049.722, total2019: 10776.964, total2024: 10063.866, nuclear2024: 124.524, naturalGas2024: 5779.704,  solidFossil2024: 1497.585, lignite2024: 498.648, oil2024: 27.218,   renewables2024: 1750.636,  solarThermal2024: 0,       bioenergy2024: 1750.636,  waste2024: 77.861 },
  { country: "Cyprus",      total1999: 0,         total2004: 0,         total2009: 1.111,     total2014: 12.5,      total2019: 14.298,    total2024: 9.465,     nuclear2024: 0,       naturalGas2024: 0,         solidFossil2024: 0,        lignite2024: 0,       oil2024: 0,        renewables2024: 9.465,     solarThermal2024: 0,       bioenergy2024: 9.465,     waste2024: 0 },
  { country: "Czechia",     total1999: 40916.944, total2004: 40111.667, total2009: 33761.111, total2014: 33263.056, total2019: 32330.651, total2024: 26845.479, nuclear2024: 440.457, naturalGas2024: 8302.921,  solidFossil2024: 12078.903,lignite2024: 9994.207,oil2024: 256.327,  renewables2024: 3855.757,  solarThermal2024: 0,       bioenergy2024: 3832.324,  waste2024: 523.456 },
  { country: "Germany",     total1999: 105430.833,total2004: 136548.889,total2009: 130411.944,total2014: 121752.222,total2019: 127202.222,total2024: 114945.556,nuclear2024: 0,       naturalGas2024: 58921.667, solidFossil2024: 16710.556,lignite2024: 4193.333,oil2024: 1899.167, renewables2024: 23475,     solarThermal2024: 38.611,  bioenergy2024: 23338.457, waste2024: 12278.056 },
  { country: "Denmark",     total1999: 34272.778, total2004: 36205.556, total2009: 36522.778, total2014: 34147.894, total2019: 36656.575, total2024: 37648.443, nuclear2024: 0,       naturalGas2024: 2995.724,  solidFossil2024: 1284.901, lignite2024: 0,       oil2024: 312.615,  renewables2024: 25236.692, solarThermal2024: 645.367, bioenergy2024: 24070.923, waste2024: 4733.296 },
  { country: "Estonia",     total1999: 8101.111,  total2004: 7490.833,  total2009: 6868.333,  total2014: 6058.889,  total2019: 6099.495,  total2024: 7035.798,  nuclear2024: 0,       naturalGas2024: 1153.14,   solidFossil2024: 0.003,    lignite2024: 0,       oil2024: 179.911,  renewables2024: 4172.773,  solarThermal2024: 0,       bioenergy2024: 4200.292,  waste2024: 246.96 },
  { country: "Greece",      total1999: 306.389,   total2004: 504.722,   total2009: 569.444,   total2014: 575.833,   total2019: 611.911,   total2024: 369.331,   nuclear2024: 0,       naturalGas2024: 89.167,    solidFossil2024: 280.164,  lignite2024: 280.164, oil2024: 0,        renewables2024: 0,         solarThermal2024: 0,       bioenergy2024: 0,         waste2024: 0 },
  { country: "Spain",       total1999: 0,         total2004: 0,         total2009: 0,         total2014: 0,         total2019: 0,         total2024: 666.667,   nuclear2024: 0,       naturalGas2024: 138.889,   solidFossil2024: 0,        lignite2024: 0,       oil2024: 3.611,    renewables2024: 503.056,   solarThermal2024: 0,       bioenergy2024: 503.197,   waste2024: 0 },
  { country: "Finland",     total1999: 34529.722, total2004: 51555,     total2009: 52361.389, total2014: 51281.111, total2019: 51465.278, total2024: 49767.874, nuclear2024: 0,       naturalGas2024: 3840.556,  solidFossil2024: 1845.278, lignite2024: 0,       oil2024: 2446.944, renewables2024: 27171.082, solarThermal2024: 0,       bioenergy2024: 27202.941, waste2024: 2135.959 },
  { country: "France",      total1999: 6604.167,  total2004: 46722.222, total2009: 41997.005, total2014: 38300.568, total2019: 49033.787, total2024: 48374.409, nuclear2024: 0,       naturalGas2024: 16403.305, solidFossil2024: 336.609,  lignite2024: 0,       oil2024: 2129.52,  renewables2024: 21952.298, solarThermal2024: 0,       bioenergy2024: 19786.465, waste2024: 5464.067 },
  { country: "Croatia",     total1999: 3621.944,  total2004: 3567.222,  total2009: 3221.667,  total2014: 2813.056,  total2019: 3661.556,  total2024: 3672.45,   nuclear2024: 0,       naturalGas2024: 2614.128,  solidFossil2024: 0,        lignite2024: 0,       oil2024: 25.544,   renewables2024: 1032.778,  solarThermal2024: 0,       bioenergy2024: 1032.778,  waste2024: 0 },
  { country: "Hungary",     total1999: 20174.444, total2004: 17367.222, total2009: 14752.5,   total2014: 13324.444, total2019: 13444.444, total2024: 12002.556, nuclear2024: 103.056, naturalGas2024: 8171.944,  solidFossil2024: 277.222,  lignite2024: 277.222, oil2024: 2.222,    renewables2024: 2269.139,  solarThermal2024: 0,       bioenergy2024: 1390.642,  waste2024: 317.778 },
  { country: "Ireland",     total1999: 0,         total2004: 0,         total2009: 0,         total2014: 0,         total2019: 0,         total2024: 0,         nuclear2024: 0,       naturalGas2024: 0,         solidFossil2024: 0,        lignite2024: 0,       oil2024: 0,        renewables2024: 0,         solarThermal2024: 0,       bioenergy2024: 0,         waste2024: 0 },
  { country: "Italy",       total1999: 0,         total2004: 52660,     total2009: 50227.778, total2014: 57209.444, total2019: 64278.104, total2024: 24523.853, nuclear2024: 0,       naturalGas2024: 17368.095, solidFossil2024: 0,        lignite2024: 0,       oil2024: 299.307,  renewables2024: 4779.494,  solarThermal2024: 3.442,   bioenergy2024: 4552.986,  waste2024: 1326.656 },
  { country: "Lithuania",   total1999: 14845.556, total2004: 13764.444, total2009: 13147.778, total2014: 12027.778, total2019: 11882.778, total2024: 10276.389, nuclear2024: 0,       naturalGas2024: 1205.556,  solidFossil2024: 3.056,    lignite2024: 0,       oil2024: 60.556,   renewables2024: 6991.111,  solarThermal2024: 0,       bioenergy2024: 6999.691,  waste2024: 337.778 },
  { country: "Luxembourg",  total1999: 0.556,     total2004: 871.005,   total2009: 709.834,   total2014: 701.296,   total2019: 1120.374,  total2024: 1607.309,  nuclear2024: 0,       naturalGas2024: 182.599,   solidFossil2024: 0,        lignite2024: 0,       oil2024: 0.501,    renewables2024: 1332.062,  solarThermal2024: 0.014,   bioenergy2024: 1333.203,  waste2024: 17.761 },
  { country: "Latvia",      total1999: 10053.056, total2004: 8636.944,  total2009: 7307.778,  total2014: 7151.944,  total2019: 7947.826,  total2024: 7216.103,  nuclear2024: 0,       naturalGas2024: 2310.779,  solidFossil2024: 1.711,    lignite2024: 0,       oil2024: 106.221,  renewables2024: 4796.571,  solarThermal2024: 10.341,  bioenergy2024: 4803.614,  waste2024: 0 },
  { country: "Malta",       total1999: 0,         total2004: 0,         total2009: 0,         total2014: 0.278,     total2019: 0.245,     total2024: 0,         nuclear2024: 0,       naturalGas2024: 0,         solidFossil2024: 0,        lignite2024: 0,       oil2024: 0,        renewables2024: 0,         solarThermal2024: 0,       bioenergy2024: 0,         waste2024: 0 },
  { country: "Netherlands", total1999: 49012.778, total2004: 52056.389, total2009: 42263.889, total2014: 40876.944, total2019: 31595.558, total2024: 26529.886, nuclear2024: 0,       naturalGas2024: 13082.027, solidFossil2024: 164.806,  lignite2024: 0,       oil2024: 1771.124, renewables2024: 5738.841,  solarThermal2024: 0,       bioenergy2024: 5875.906,  waste2024: 1992.868 },
  { country: "Poland",      total1999: 103198.611,total2004: 94355.556, total2009: 85425,     total2014: 76913.056, total2019: 79736.421, total2024: 72113.438, nuclear2024: 0,       naturalGas2024: 12925.208, solidFossil2024: 46733.781,lignite2024: 844.673, oil2024: 1367.371, renewables2024: 6869.175,  solarThermal2024: 0,       bioenergy2024: 6867.146,  waste2024: 1138.675 },
  { country: "Portugal",    total1999: 1002.778,  total2004: 2996.944,  total2009: 4459.722,  total2014: 5950.556,  total2019: 5812.938,  total2024: 2531.323,  nuclear2024: 0,       naturalGas2024: 2462.53,   solidFossil2024: 0,        lignite2024: 0,       oil2024: 68.793,   renewables2024: 0,         solarThermal2024: 0,       bioenergy2024: 0,         waste2024: 0 },
  { country: "Romania",     total1999: 59631.389, total2004: 37622.778, total2009: 26850.556, total2014: 21659.167, total2019: 17068.349, total2024: 13350.036, nuclear2024: 0,       naturalGas2024: 10403.782, solidFossil2024: 1373.924, lignite2024: 1373.924,oil2024: 795.607,  renewables2024: 754.909,   solarThermal2024: 0,       bioenergy2024: 689.153,   waste2024: 0.653 },
  { country: "Sweden",      total1999: 47757.5,   total2004: 52025.833, total2009: 55753.056, total2014: 55101.111, total2019: 57663.056, total2024: 58620,     nuclear2024: 0,       naturalGas2024: 647.089,   solidFossil2024: 49.444,   lignite2024: 0,       oil2024: 910.882,  renewables2024: 37139.968, solarThermal2024: 0,       bioenergy2024: 32180.802, waste2024: 6499.385 },
  { country: "Slovenia",    total1999: 2462.5,    total2004: 2700,      total2009: 2525.833,  total2014: 2273.056,  total2019: 2539.896,  total2024: 2228.198,  nuclear2024: 0,       naturalGas2024: 1027.868,  solidFossil2024: 622.572,  lignite2024: 237.69,  oil2024: 19.054,   renewables2024: 519.189,   solarThermal2024: 0,       bioenergy2024: 508.686,   waste2024: 39.516 },
  { country: "Slovakia",    total1999: 10552.222, total2004: 14961.111, total2009: 11725,     total2014: 9667.222,  total2019: 8689.444,  total2024: 6705.556,  nuclear2024: 484.722, naturalGas2024: 3969.444,  solidFossil2024: 438.333,  lignite2024: 350.278, oil2024: 149.722,  renewables2024: 1538.611,  solarThermal2024: 0.556,   bioenergy2024: 1467.778,  waste2024: 81.944 },
];

// ── Trend Analysis ────────────────────────────────────────────────────────────
export const trendAbsolute: YearPoint[] = [
  { year: 1999, "TOTAL": 2543035.099, "Nuclear": 848251, "Natural Gas": 305799, "Solid Fossil Fuels": 743721, "Renewables & Biofuels": 377735.66, "Wind": 13232.739, "Solar PV": 85.961, "Bioenergy": 0 },
  { year: 2004, "TOTAL": 2862929.675, "Nuclear": 928438, "Natural Gas": 448198.257, "Solid Fossil Fuels": 820713, "Renewables & Biofuels": 427881.439, "Wind": 56721.227, "Solar PV": 687.913, "Bioenergy": 0 },
  { year: 2009, "TOTAL": 2796287.94,  "Nuclear": 824912, "Natural Gas": 551046.795, "Solid Fossil Fuels": 690678.826, "Renewables & Biofuels": 552626.275, "Wind": 117028.012, "Solar PV": 13840.981, "Bioenergy": 0 },
  { year: 2014, "TOTAL": 2808998.431, "Nuclear": 812550.009, "Natural Gas": 350182.579, "Solid Fossil Fuels": 680816.867, "Renewables & Biofuels": 806508.476, "Wind": 210683.731, "Solar PV": 88089.918, "Bioenergy": 0 },
  { year: 2019, "TOTAL": 2854627.207, "Nuclear": 765337.856, "Natural Gas": 552035.55, "Solid Fossil Fuels": 445379.092, "Renewables & Biofuels": 951345.115, "Wind": 354353.143, "Solar PV": 116528.136, "Bioenergy": 0 },
  { year: 2024, "TOTAL": 2777644.955, "Nuclear": 649545.843, "Natural Gas": 437554.914, "Solid Fossil Fuels": 271891.735, "Renewables & Biofuels": 1292159.024, "Wind": 475618.535, "Solar PV": 296888.859, "Bioenergy": 0 },
];

export const trendGrowth: YearPoint[] = [
  { year: 1999, "TOTAL": 0,    "Nuclear": 0,    "Natural Gas": 0,    "Solid Fossil Fuels": 0,    "Renewables & Biofuels": 0,    "Wind": 0,    "Solar PV": 0 },
  { year: 2004, "TOTAL": 12.6, "Nuclear": 9.5,  "Natural Gas": 46.6, "Solid Fossil Fuels": 10.4, "Renewables & Biofuels": 13.3, "Wind": 328.6,"Solar PV": 700.3 },
  { year: 2009, "TOTAL": 10.0, "Nuclear": -2.8, "Natural Gas": 80.2, "Solid Fossil Fuels": -7.1, "Renewables & Biofuels": 46.3, "Wind": 784.4,"Solar PV": 16001.5 },
  { year: 2014, "TOTAL": 10.5, "Nuclear": -4.2, "Natural Gas": 14.5, "Solid Fossil Fuels": -8.5, "Renewables & Biofuels": 113.5,"Wind": 1492.1,"Solar PV": 102376.6 },
  { year: 2019, "TOTAL": 12.3, "Nuclear": -9.8, "Natural Gas": 80.5, "Solid Fossil Fuels": -40.1,"Renewables & Biofuels": 151.9,"Wind": 2578.0,"Solar PV": 135459.3 },
  { year: 2024, "TOTAL": 9.2,  "Nuclear": -23.4,"Natural Gas": 43.1, "Solid Fossil Fuels": -63.4,"Renewables & Biofuels": 242.1,"Wind": 3494.3,"Solar PV": 345276.2 },
];

// ── WEKA: Clustering results ──────────────────────────────────────────────────
export interface CentroidRow { attribute: string; fullData: number; cluster0: number; cluster1: number; cluster2?: number }

export const wekaElecCentroids: CentroidRow[] = [
  { attribute: "1999 Total", fullData: 95789.7, cluster0: 389005.1, cluster1: 105833.4, cluster2: 27840.8 },
  { attribute: "2004 Total", fullData: 107705.0, cluster0: 443861.3, cluster1: 111095.2, cluster2: 32061.9 },
  { attribute: "2009 Total", fullData: 105425.7, cluster0: 429914.0, cluster1: 112483.5, cluster2: 31356.7 },
  { attribute: "2014 Total", fullData: 105992.7, cluster0: 439841.4, cluster1: 110812.6, cluster2: 30465.2 },
  { attribute: "2019 Total", fullData: 107695.6, cluster0: 436335.8, cluster1: 124342.8, cluster2: 30040.2 },
  { attribute: "2024 Total", fullData: 104767.9, cluster0: 410958.8, cluster1: 125645.5, cluster2: 30926.2 },
  { attribute: "Nuclear 2024", fullData: 24057.3, cluster0: 108745.9, cluster1: 17098.6, cluster2: 7170.5 },
  { attribute: "Natural Gas 2024", fullData: 16414.4, cluster0: 69868.7, cluster1: 17309.9, cluster2: 4287.0 },
  { attribute: "Solid Fossil 2024", fullData: 10070.1, cluster0: 28470.9, cluster1: 20202.5, cluster2: 3166.4 },
  { attribute: "Wind 2024", fullData: 18149.5, cluster0: 67706.3, cluster1: 24431.5, cluster2: 5391.9 },
  { attribute: "Solar PV 2024", fullData: 11258.4, cluster0: 47546.9, cluster1: 12070.7, cluster2: 2968.7 },
  { attribute: "Renewables 2024", fullData: 49352.3, cluster0: 185107.0, cluster1: 65733.5, cluster2: 14634.3 },
];

export const wekaElecClusters = [
  { cluster: "Cluster 0", n: 4, pct: 15, label: "Med Renewable", color: "#F97316" },
  { cluster: "Cluster 1", n: 5, pct: 19, label: "Low Renewable", color: "#EF4444" },
  { cluster: "Cluster 2", n: 18, pct: 67, label: "High Renewable", color: "#22C55E" },
];

export const wekaHeatCentroids: CentroidRow[] = [
  { attribute: "1999 Total", fullData: 21711.6, cluster0: 38669.1, cluster1: 62487.0, cluster2: 10810.8 },
  { attribute: "2004 Total", fullData: 26356.8, cluster0: 59469.8, cluster1: 74926.8, cluster2: 9973.8 },
  { attribute: "2009 Total", fullData: 24719.0, cluster0: 54455.0, cluster1: 74229.3, cluster2: 9076.3 },
  { attribute: "2014 Total", fullData: 23631.2, cluster0: 52916.2, cluster1: 70333.7, cluster2: 8550.5 },
  { attribute: "2019 Total", fullData: 24126.4, cluster0: 55221.8, cluster1: 73840.6, cluster2: 8093.8 },
  { attribute: "2024 Total", fullData: 20878.4, cluster0: 44261.9, cluster1: 70404.7, cluster2: 6904.8 },
  { attribute: "Natural Gas 2024", fullData: 6788.3, cluster0: 12723.8, cluster1: 20854.8, cluster2: 3005.3 },
  { attribute: "Solid Fossil 2024", fullData: 3100.0, cluster0: 9816.1, cluster1: 6015.0, cluster2: 872.3 },
  { attribute: "Renewables 2024", fullData: 7255.4, cluster0: 13302.2, cluster1: 28617.2, cluster2: 2291.3 },
  { attribute: "Bioenergy 2024", fullData: 6891.3, cluster0: 12857.1, cluster1: 26530.1, cluster2: 2220.5 },
  { attribute: "Waste 2024", fullData: 1460.7, cluster0: 2411.6, cluster1: 7836.9, cluster2: 203.6 },
];

export const wekaHeatClusters = [
  { cluster: "Cluster 0", n: 5, pct: 19, label: "Med Heat", color: "#F97316" },
  { cluster: "Cluster 1", n: 3, pct: 11, label: "High Heat", color: "#FFCC00" },
  { cluster: "Cluster 2", n: 19, pct: 70, label: "Low Heat", color: "#22C55E" },
];

// ── WEKA: Classification (Country Heat) ──────────────────────────────────────
export const wekaClassModels = [
  { model: "J48", correct: 16, correctPct: 64, incorrect: 9, kappa: 0.4591, mae: 0.2587, rmse: 0.4404, raePct: 57.80, rrsePct: 92.64 },
  { model: "Random Forest", correct: 14, correctPct: 56, incorrect: 11, kappa: 0.3373, mae: 0.3893, rmse: 0.4524, raePct: 86.99, rrsePct: 95.17 },
];

export const wekaClassPerClass = [
  { model: "J48",           class: "Low",  tpRate: 0.625, fpRate: 0.118, precision: 0.714, recall: 0.625, fMeasure: 0.667, mcc: 0.527, rocArea: 0.757, prcArea: 0.650 },
  { model: "J48",           class: "Med",  tpRate: 0.500, fpRate: 0.294, precision: 0.444, recall: 0.500, fMeasure: 0.471, mcc: 0.200, rocArea: 0.688, prcArea: 0.443 },
  { model: "J48",           class: "High", tpRate: 0.778, fpRate: 0.125, precision: 0.778, recall: 0.778, fMeasure: 0.778, mcc: 0.653, rocArea: 0.812, prcArea: 0.614 },
  { model: "Random Forest", class: "Low",  tpRate: 0.500, fpRate: 0.235, precision: 0.500, recall: 0.500, fMeasure: 0.500, mcc: 0.265, rocArea: 0.563, prcArea: 0.546 },
  { model: "Random Forest", class: "Med",  tpRate: 0.375, fpRate: 0.235, precision: 0.429, recall: 0.375, fMeasure: 0.400, mcc: 0.145, rocArea: 0.609, prcArea: 0.410 },
  { model: "Random Forest", class: "High", tpRate: 0.778, fpRate: 0.188, precision: 0.700, recall: 0.778, fMeasure: 0.737, mcc: 0.578, rocArea: 0.787, prcArea: 0.543 },
];

export const wekaConfusion = [
  { model: "J48",           trueClass: "Low",  predLow: 5, predMed: 3, predHigh: 0 },
  { model: "J48",           trueClass: "Med",  predLow: 2, predMed: 4, predHigh: 2 },
  { model: "J48",           trueClass: "High", predLow: 0, predMed: 2, predHigh: 7 },
  { model: "Random Forest", trueClass: "Low",  predLow: 4, predMed: 2, predHigh: 2 },
  { model: "Random Forest", trueClass: "Med",  predLow: 4, predMed: 3, predHigh: 1 },
  { model: "Random Forest", trueClass: "High", predLow: 0, predMed: 2, predHigh: 7 },
];

// ── GEP Fuel Mix Cluster (trajectory of % share over time) ───────────────────
// Clusters 12 fuel types by their share-of-GEP trajectory 1999-2024
export const fuelMixClusters = [
  { year: "1999", fullData: 12.33, cluster0_Surging: 0.26, cluster1_Declining: 18.21, cluster2_NoClass: 6.68 },
  { year: "2004", fullData: 12.20, cluster0_Surging: 1.00, cluster1_Declining: 18.15, cluster2_NoClass: 5.79 },
  { year: "2009", fullData: 11.36, cluster0_Surging: 2.34, cluster1_Declining: 18.27, cluster2_NoClass: 1.26 },
  { year: "2014", fullData: 11.98, cluster0_Surging: 5.32, cluster1_Declining: 18.60, cluster2_NoClass: 0.99 },
  { year: "2019", fullData: 12.15, cluster0_Surging: 8.25, cluster1_Declining: 18.09, cluster2_NoClass: 0.91 },
  { year: "2024", fullData: 12.04, cluster0_Surging: 13.91,cluster1_Declining: 16.31, cluster2_NoClass: 0.83 },
];

// ── GEP Fuel-Type Clusters (13 fuel types → 2 clusters by renewable-share trajectory)
// Attr 1999-2019 = renewable-share ratio; 2024_GWh_total = absolute output
export const gepFuelClusters = {
  wcsse: 2.785, iterations: 3,
  clusters: [
    { id: 0, n: 10, pct: 77, label: "Low-Renewable Fuels",  color: "#4B80D4" },
    { id: 1, n: 3,  pct: 23, label: "High-Renewable Fuels", color: "#FFCC00" },
  ],
  centroids: [
    { attr: "1999 Share", fullData: 0.3082, cluster0: 0.1684, cluster1: 0.774  },
    { attr: "2004 Share", fullData: 0.3136, cluster0: 0.1731, cluster1: 0.7816 },
    { attr: "2009 Share", fullData: 0.353,  cluster0: 0.2082, cluster1: 0.8357 },
    { attr: "2014 Share", fullData: 0.3797, cluster0: 0.2106, cluster1: 0.9435 },
    { attr: "2019 Share", fullData: 0.3342, cluster0: 0.2072, cluster1: 0.7575 },
    { attr: "2024 GWh",   fullData: 334450.6, cluster0: 213426.2, cluster1: 737865.5 },
  ],
};

// ── GHP Fuel-Type Clusters (13 fuel types → 2 clusters by renewable-share trajectory)
export const ghpFuelClusters = {
  wcsse: 2.298, iterations: 2,
  clusters: [
    { id: 0, n: 3,  pct: 23, label: "High-Renewable Heat Fuels", color: "#FFCC00" },
    { id: 1, n: 10, pct: 77, label: "Low-Renewable Heat Fuels",  color: "#4B80D4" },
  ],
  centroids: [
    { attr: "1999 Share", fullData: 0.3418, cluster0: 0.6873, cluster1: 0.2381 },
    { attr: "2004 Share", fullData: 0.2953, cluster0: 0.6496, cluster1: 0.1891 },
    { attr: "2009 Share", fullData: 0.3111, cluster0: 0.6926, cluster1: 0.1967 },
    { attr: "2014 Share", fullData: 0.3557, cluster0: 0.8082, cluster1: 0.2199 },
    { attr: "2019 Share", fullData: 0.3572, cluster0: 0.8267, cluster1: 0.2163 },
    { attr: "2024 GWh",   fullData: 66664.9, cluster0: 153472.5, cluster1: 40622.7 },
  ],
};

// ── EU Fuel-Mix % Trajectory Clusters (12 fuel-share time-series → 3 clusters)
export const fuelMixTrajectoryClusters = {
  wcsse: 3.036, iterations: 2,
  clusters: [
    { id: 0, n: 2, pct: 17, label: "Surging",    color: "#FFCC00" },
    { id: 1, n: 7, pct: 58, label: "Declining",   color: "#4B80D4" },
    { id: 2, n: 3, pct: 25, label: "Fading Out",  color: "#94A3B8" },
  ],
  centroids: [
    { year: "1999", fullData: 0.1233, cluster0: 0.0026, cluster1: 0.1821, cluster2: 0.0668 },
    { year: "2004", fullData: 0.122,  cluster0: 0.01,   cluster1: 0.1815, cluster2: 0.0579 },
    { year: "2009", fullData: 0.1136, cluster0: 0.0234, cluster1: 0.1827, cluster2: 0.0126 },
    { year: "2014", fullData: 0.1198, cluster0: 0.0532, cluster1: 0.186,  cluster2: 0.0099 },
    { year: "2019", fullData: 0.1215, cluster0: 0.0825, cluster1: 0.1809, cluster2: 0.0091 },
    { year: "2024", fullData: 0.1204, cluster0: 0.1391, cluster1: 0.1631, cluster2: 0.0083 },
  ],
};
