import { create } from "zustand";
import type { Dataset } from "@/types/dataset";
import type { ChartConfig } from "@/lib/charts/types";

interface DatasetStore {
  dataset: Dataset | null;
  charts: ChartConfig[];
  loadDataset: (d: Dataset) => void;
  clearDataset: () => void;
  addChart: (c: ChartConfig) => void;
  updateChart: (id: string, patch: Partial<ChartConfig>) => void;
  removeChart: (id: string) => void;
}

export const useDatasetStore = create<DatasetStore>((set) => ({
  dataset: null,
  charts: [],

  loadDataset: (d) => set({ dataset: d, charts: [] }),
  clearDataset: () => set({ dataset: null, charts: [] }),

  addChart: (c) => set((s) => ({ charts: [...s.charts, c] })),
  updateChart: (id, patch) =>
    set((s) => ({
      charts: s.charts.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    })),
  removeChart: (id) =>
    set((s) => ({ charts: s.charts.filter((c) => c.id !== id) })),
}));
