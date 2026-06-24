"use client";

import type { AggRow } from "@/lib/charts/aggregate";
import type { ChartConfig } from "@/lib/charts/types";
import { formatNumber } from "@/lib/utils";

interface Props {
  data: AggRow[];
  config: ChartConfig;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function HeatmapRenderer({ data, config }: Props) {
  const { x, y, series } = config.encoding;
  if (!x || !y || !series) return null;

  const xVals = [...new Set(data.map((r) => String(r[x])))];
  const yVals = [...new Set(data.map((r) => String(r[y])))];

  const lookup = new Map<string, number>();
  for (const row of data) {
    lookup.set(`${row[x]}__${row[y]}`, Number(row[series] ?? 0));
  }

  const nums = [...lookup.values()].filter(isFinite);
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const range = max - min || 1;

  return (
    <div className="overflow-auto h-full p-2">
      <table className="border-collapse text-xs">
        <thead>
          <tr>
            <th className="p-1 text-muted-foreground" />
            {xVals.map((xv) => (
              <th key={xv} className="p-1 text-muted-foreground font-normal text-center max-w-16 truncate">
                {xv}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {yVals.map((yv) => (
            <tr key={yv}>
              <td className="p-1 text-muted-foreground pr-2 whitespace-nowrap">{yv}</td>
              {xVals.map((xv) => {
                const val = lookup.get(`${xv}__${yv}`);
                const t = val !== undefined ? (val - min) / range : 0;
                const r = Math.round(lerp(30, 220, t));
                const g = Math.round(lerp(30, 80, t));
                const b = Math.round(lerp(50, 40, t));
                return (
                  <td
                    key={xv}
                    title={val !== undefined ? formatNumber(val) : "—"}
                    className="p-1 text-center rounded"
                    style={{ background: `rgb(${r},${g},${b})`, minWidth: 40 }}
                  >
                    {val !== undefined ? formatNumber(val) : "—"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
