import type { ColumnProfile } from "@/types/dataset";
import type { ChartConfig } from "./types";
import { nanoid } from "nanoid";

const PIE_MAX_CARDINALITY = 12;

export function recommendCharts(columns: ColumnProfile[]): ChartConfig[] {
  const configs: ChartConfig[] = [];

  const numerics = columns.filter((c) => c.type === "number");
  const categoricals = columns.filter(
    (c) => c.type === "string" || c.type === "boolean"
  );
  const dates = columns.filter((c) => c.type === "date");
  const lowCardCats = categoricals.filter((c) => c.cardinality <= PIE_MAX_CARDINALITY);

  // 1 categorical (low card) + 1 numeric → bar
  if (lowCardCats.length >= 1 && numerics.length >= 1) {
    configs.push({
      id: nanoid(),
      type: "bar",
      title: `${numerics[0].name} by ${lowCardCats[0].name}`,
      encoding: { x: lowCardCats[0].name, y: numerics[0].name, aggregate: "sum" },
    });
  }

  // date + numeric (+ optional series) → line
  if (dates.length >= 1 && numerics.length >= 1) {
    const series = lowCardCats.length >= 1 ? lowCardCats[0].name : undefined;
    configs.push({
      id: nanoid(),
      type: "line",
      title: `${numerics[0].name} over ${dates[0].name}`,
      encoding: { x: dates[0].name, y: numerics[0].name, series, aggregate: "none" },
    });
  }

  // ordinal categorical + numeric (when no date but categorical looks ordinal) → line
  if (dates.length === 0 && categoricals.length >= 1 && numerics.length >= 1) {
    const candidate = categoricals.find((c) => c.cardinality > PIE_MAX_CARDINALITY);
    if (candidate) {
      configs.push({
        id: nanoid(),
        type: "line",
        title: `${numerics[0].name} by ${candidate.name}`,
        encoding: { x: candidate.name, y: numerics[0].name, aggregate: "none" },
      });
    }
  }

  // 2 numerics → scatter
  if (numerics.length >= 2) {
    configs.push({
      id: nanoid(),
      type: "scatter",
      title: `${numerics[0].name} vs ${numerics[1].name}`,
      encoding: { x: numerics[0].name, y: numerics[1].name, aggregate: "none" },
    });
  }

  // 1 categorical low card → pie
  if (lowCardCats.length >= 1 && numerics.length >= 1) {
    configs.push({
      id: nanoid(),
      type: "pie",
      title: `${numerics[0].name} share by ${lowCardCats[0].name}`,
      encoding: { x: lowCardCats[0].name, y: numerics[0].name, aggregate: "sum" },
    });
  }

  // 2 categoricals + 1 numeric → heatmap
  if (categoricals.length >= 2 && numerics.length >= 1) {
    configs.push({
      id: nanoid(),
      type: "heatmap",
      title: `${numerics[0].name} by ${categoricals[0].name} × ${categoricals[1].name}`,
      encoding: { x: categoricals[0].name, y: categoricals[1].name, series: numerics[0].name, aggregate: "avg" },
    });
  }

  // 1 numeric only → KPI
  if (numerics.length >= 1 && categoricals.length === 0 && dates.length === 0) {
    configs.push({
      id: nanoid(),
      type: "kpi",
      title: numerics[0].name,
      encoding: { y: numerics[0].name, aggregate: "sum" },
    });
  }

  // always add table
  configs.push({
    id: nanoid(),
    type: "table",
    title: "Data Table",
    encoding: {},
  });

  return configs;
}
