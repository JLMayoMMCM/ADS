"use client";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

export type NavSection = "overview" | "electricity" | "heat" | "countries" | "trends" | "weka" | "presentors";

const SECTIONS: { id: NavSection; label: string }[] = [
  { id: "overview",    label: "Overview" },
  { id: "electricity", label: "Electricity" },
  { id: "heat",        label: "Heat" },
  { id: "countries",   label: "Countries" },
  { id: "trends",      label: "Trends" },
  { id: "weka",        label: "WEKA Results" },
  { id: "presentors",  label: "Presentors" },
];

interface Props {
  active: NavSection;
  onChange: (s: NavSection) => void;
}

export function AppNav({ active, onChange }: Props) {
  const { dark, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-0 border-b border-eu-border bg-[#003399] px-5 shadow-lg md:relative">
      {/* EU Branding */}
      <div className="flex items-center gap-3 mr-8 shrink-0">
        <EUFlag />
        <div className="hidden sm:flex flex-col leading-tight">
          <span className="text-[11px] font-bold tracking-[0.2em] text-[#FFCC00] uppercase">EU Energy</span>
          <span className="text-[9px] tracking-[0.15em] text-white/70 uppercase">Dashboard</span>
        </div>
      </div>

      {/* Nav tabs */}
      <nav className="flex items-center gap-0.5 overflow-x-auto flex-1">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            className={cn(
              "px-4 py-1.5 text-[13px] font-medium rounded transition-all whitespace-nowrap border-b-2",
              active === s.id
                ? "text-[#FFCC00] border-[#FFCC00] bg-white/10"
                : "text-white/70 border-transparent hover:text-white hover:bg-white/8"
            )}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {/* Theme toggle */}
      <button
        onClick={toggle}
        title={dark ? "Switch to light mode" : "Switch to dark mode"}
        className="ml-4 w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white shrink-0"
        aria-label="Toggle theme"
      >
        {dark ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>
    </header>
  );
}

function EUFlag() {
  return (
    <svg width="32" height="22" viewBox="0 0 32 22" role="img" aria-label="EU flag">
      <rect width="32" height="22" fill="#003399" rx="2" stroke="#FFCC00" strokeWidth="0.5" />
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const cx = 16 + 7.5 * Math.cos(angle);
        const cy = 11 + 7.5 * Math.sin(angle);
        return <text key={i} x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize="4" fill="#FFCC00">★</text>;
      })}
    </svg>
  );
}
