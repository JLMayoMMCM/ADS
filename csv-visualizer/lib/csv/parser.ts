import Papa from "papaparse";
import type { Dataset } from "@/types/dataset";
import { profileDataset } from "@/lib/schema/profile";

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

export interface ParseResult {
  dataset: Dataset | null;
  error: string | null;
}

export async function parseCsv(file: File): Promise<ParseResult> {
  if (!file.name.match(/\.csv$/i) && file.type !== "text/csv") {
    return { dataset: null, error: "Only CSV files are supported." };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      dataset: null,
      error: `File exceeds 25 MB limit (${(file.size / 1024 / 1024).toFixed(1)} MB).`,
    };
  }

  return new Promise((resolve) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      worker: false, // worker mode requires bundler config; kept off for simplicity
      complete(results) {
        const rows = results.data as Record<string, unknown>[];
        const fields = results.meta.fields ?? [];
        const parseErrors = results.errors.map(
          (e) => `Row ${e.row ?? "?"}: ${e.message}`
        );

        if (rows.length === 0) {
          resolve({ dataset: null, error: "The file contains no data rows." });
          return;
        }

        const columns = profileDataset(rows, fields);

        resolve({
          dataset: {
            fileName: file.name,
            rows,
            columns,
            parseErrors,
          },
          error: null,
        });
      },
      error(err) {
        resolve({ dataset: null, error: err.message });
      },
    });
  });
}
