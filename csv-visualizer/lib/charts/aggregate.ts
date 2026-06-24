import type { ChartConfig, Aggregation } from "./types";

type Row = Record<string, unknown>;

function toNumber(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return isFinite(n) ? n : null;
}

function applyAgg(nums: number[], agg: Aggregation): number {
  if (nums.length === 0) return 0;
  switch (agg) {
    case "sum":
      return nums.reduce((a, b) => a + b, 0);
    case "avg":
      return nums.reduce((a, b) => a + b, 0) / nums.length;
    case "count":
      return nums.length;
    case "min":
      return Math.min(...nums);
    case "max":
      return Math.max(...nums);
    case "none":
      return nums[0];
  }
}

export interface AggRow {
  [key: string]: string | number | null;
}

export function aggregateForChart(rows: Row[], config: ChartConfig): AggRow[] {
  const { encoding } = config;
  const { x, y, series, aggregate = "sum" } = encoding;

  if (config.type === "table") {
    return rows.map((r) =>
      Object.fromEntries(
        Object.entries(r).map(([k, v]) => [k, v as string | number | null])
      )
    );
  }

  if (config.type === "kpi") {
    if (!y) return [];
    const nums = rows.map((r) => toNumber(r[y])).filter((n): n is number => n !== null);
    return [{ value: applyAgg(nums, aggregate) }];
  }

  if (config.type === "scatter") {
    if (!x || !y) return [];
    return rows
      .map((r) => ({ [x]: toNumber(r[x]), [y]: toNumber(r[y]) }))
      .filter((r) => r[x] !== null && r[y] !== null);
  }

  if (!x) return [];

  // Group by x (and optionally series)
  const groupKey = (r: Row) => {
    const xVal = String(r[x] ?? "");
    return series ? `${xVal}|||${String(r[series] ?? "")}` : xVal;
  };

  const groups = new Map<string, number[]>();
  const keyMeta = new Map<string, { xVal: string; seriesVal?: string }>();

  for (const row of rows) {
    const k = groupKey(row);
    if (!groups.has(k)) {
      groups.set(k, []);
      keyMeta.set(k, {
        xVal: String(row[x] ?? ""),
        seriesVal: series ? String(row[series] ?? "") : undefined,
      });
    }
    if (y) {
      const n = toNumber(row[y]);
      if (n !== null) groups.get(k)!.push(n);
    } else {
      groups.get(k)!.push(1); // count mode
    }
  }

  if (series) {
    // Pivot: result rows keyed by xVal, series values become extra columns
    const xMap = new Map<string, AggRow>();
    for (const [k, nums] of groups) {
      const meta = keyMeta.get(k)!;
      if (!xMap.has(meta.xVal)) xMap.set(meta.xVal, { [x]: meta.xVal });
      const col = meta.seriesVal ?? "value";
      xMap.get(meta.xVal)![col] =
        aggregate === "none" ? (nums[0] ?? null) : applyAgg(nums, aggregate);
    }
    return [...xMap.values()];
  }

  const result: AggRow[] = [];
  for (const [k, nums] of groups) {
    const meta = keyMeta.get(k)!;
    result.push({
      [x]: meta.xVal,
      ...(y
        ? { [y]: aggregate === "none" ? (nums[0] ?? null) : applyAgg(nums, aggregate) }
        : { count: nums.length }),
    });
  }
  return result;
}
