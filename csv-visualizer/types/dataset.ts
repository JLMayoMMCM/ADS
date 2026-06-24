export type ColumnType = "number" | "string" | "date" | "boolean";

export interface ColumnProfile {
  name: string;
  type: ColumnType;
  cardinality: number;
  nullCount: number;
  min?: number | string;
  max?: number | string;
  sampleValues: string[];
}

export interface Dataset {
  fileName: string;
  rows: Record<string, unknown>[];
  columns: ColumnProfile[];
  parseErrors: string[];
}
