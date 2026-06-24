export type ChartType =
  | "bar"
  | "line"
  | "area"
  | "scatter"
  | "pie"
  | "kpi"
  | "heatmap"
  | "table";

export type Aggregation = "sum" | "avg" | "count" | "min" | "max" | "none";

export interface Encoding {
  x?: string;
  y?: string;
  series?: string;
  aggregate?: Aggregation;
}

export interface ChartConfig {
  id: string;
  type: ChartType;
  title: string;
  encoding: Encoding;
}
