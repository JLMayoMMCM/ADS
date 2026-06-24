import type { ColumnProfile } from "@/types/dataset";
import { inferType } from "./inferType";

export function profileColumn(
  name: string,
  rawValues: (string | null | undefined)[]
): ColumnProfile {
  const type = inferType(rawValues);

  let nullCount = 0;
  const seen = new Set<string>();
  const nonNull: string[] = [];

  for (const v of rawValues) {
    const s = v === null || v === undefined || String(v).trim() === "" ? null : String(v).trim();
    if (s === null) {
      nullCount++;
    } else {
      seen.add(s);
      nonNull.push(s);
    }
  }

  const cardinality = seen.size;
  const sampleValues = [...seen].slice(0, 5);

  let min: number | string | undefined;
  let max: number | string | undefined;

  if (type === "number") {
    const nums = nonNull.map((v) => Number(v.replace(/,/g, ""))).filter(isFinite);
    if (nums.length > 0) {
      min = Math.min(...nums);
      max = Math.max(...nums);
    }
  } else if (type === "date") {
    const times = nonNull.map((v) => Date.parse(v)).filter((t) => !isNaN(t));
    if (times.length > 0) {
      min = new Date(Math.min(...times)).toISOString().slice(0, 10);
      max = new Date(Math.max(...times)).toISOString().slice(0, 10);
    }
  }

  return { name, type, cardinality, nullCount, min, max, sampleValues };
}

export function profileDataset(
  rows: Record<string, unknown>[],
  fields: string[]
): ColumnProfile[] {
  return fields.map((field) => {
    const values = rows.map((r) => (r[field] as string | null | undefined) ?? null);
    return profileColumn(field, values);
  });
}
