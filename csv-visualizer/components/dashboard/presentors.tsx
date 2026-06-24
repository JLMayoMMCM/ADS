"use client";
import Image from "next/image";

const TEAM = [
  { name: "Jonathan Lance Mayo",  role: "IS Student / Data Processor", position: "Left"   },
  { name: "Allyza Fe Villegas",   role: "IS Student / Data Processor", position: "Center" },
  { name: "Darven Ross Naraga",   role: "IS Student / Data Processor", position: "Right"  },
];

export function PresentorsDashboard() {
  return (
    <div className="flex flex-col overflow-visible md:h-full md:overflow-hidden">
      {/* compact header bar */}
      <div className="shrink-0 px-5 py-2 border-b border-eu-border bg-eu-card/60 backdrop-blur-sm flex items-center gap-3">
        <span className="text-[11px] font-bold text-[#003399] dark:text-eu-gold uppercase tracking-widest">
          Project Team
        </span>
        <span className="text-[10px] text-muted-foreground">
          Applied Data Science · Mapua Malayan Colleges Mindanao · A.Y. 2025–2026
        </span>
      </div>

      {/* main content — vertically and horizontally centered */}
      <div className="flex justify-center p-4 sm:p-6 md:flex-1 md:min-h-0 md:items-center md:overflow-y-auto">
        <div className="w-full max-w-3xl flex flex-col gap-6">

          {/* section title */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">Presentors</h2>
            <p className="text-sm text-muted-foreground mt-1">
              EU Energy Analytics Dashboard · EU-27 Energy Production (1999–2024)
            </p>
          </div>

          {/* photo */}
          <div className="relative w-full rounded-2xl overflow-hidden border border-eu-border shadow-lg" style={{ aspectRatio: "4/3", maxHeight: 420 }}>
            <Image
              src="/presentor.jpg"
              alt="Project team — Jonathan Lance Mayo, Allyza Fe Villegas, Darven Ross Naraga"
              fill
              className="object-cover object-top"
              priority
            />
          </div>

          {/* name cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="rounded-xl border border-eu-border bg-eu-card p-4 flex flex-col gap-1.5 text-center"
              >
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                  {member.position}
                </p>
                <p className="text-base font-bold text-foreground leading-snug">
                  {member.name}
                </p>
                <p className="text-[11px] text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>

          {/* institution */}
          <div className="rounded-xl border border-eu-border bg-eu-card/60 px-5 py-3 flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span><span className="font-semibold text-foreground">Course:</span> Applied Data Science</span>
            <span className="hidden w-px h-4 bg-eu-border sm:block" />
            <span><span className="font-semibold text-foreground">Institution:</span> Mapua Malayan Colleges Mindanao</span>
            <span className="hidden w-px h-4 bg-eu-border sm:block" />
            <span><span className="font-semibold text-foreground">Data Source:</span> Eurostat EU-27 (1999–2024)</span>
          </div>

        </div>
      </div>
    </div>
  );
}
