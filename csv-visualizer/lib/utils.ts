import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatGWh(n: number): string {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(2) + " TWh";
  if (Math.abs(n) >= 1_000)     return (n / 1_000).toFixed(1) + " GWh";
  return n.toLocaleString(undefined, { maximumFractionDigits: 1 }) + " GWh";
}

export function formatNumber(n: number): string {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (Math.abs(n) >= 1_000)     return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function formatPct(n: number, decimals = 1): string {
  return n.toFixed(decimals) + "%";
}
