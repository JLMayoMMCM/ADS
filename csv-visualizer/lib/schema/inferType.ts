import type { ColumnType } from "@/types/dataset";

export const SAMPLE_SIZE = 500;

const BOOLEAN_VALUES = new Set([
  "true", "false", "yes", "no", "1", "0",
]);

function isBoolean(values: string[]): boolean {
  return values.every((v) => BOOLEAN_VALUES.has(v.toLowerCase()));
}

function isNumber(values: string[]): boolean {
  return values.every((v) => {
    const n = Number(v.replace(/,/g, ""));
    return !isNaN(n) && isFinite(n);
  });
}

const DATE_RE =
  /^\d{4}-\d{2}-\d{2}(T[\d:.Z+-]*)?$|^\d{1,2}[/\-]\d{1,2}[/\-]\d{2,4}$/;

function isDate(values: string[]): boolean {
  return values.every((v) => {
    if (/^\d+$/.test(v)) return false;
    if (!DATE_RE.test(v)) return false;
    return !isNaN(Date.parse(v));
  });
}

export function inferType(rawValues: (string | null | undefined)[]): ColumnType {
  const sample = rawValues
    .filter((v): v is string => v !== null && v !== undefined && v.trim() !== "")
    .slice(0, SAMPLE_SIZE);

  if (sample.length === 0) return "string";
  if (isBoolean(sample)) return "boolean";
  if (isNumber(sample)) return "number";
  if (isDate(sample)) return "date";
  return "string";
}
