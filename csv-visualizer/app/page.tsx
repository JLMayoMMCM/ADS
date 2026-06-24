"use client";
import { useState } from "react";
import { AppNav, type NavSection } from "@/components/nav/app-nav";
import { OverviewDashboard }    from "@/components/dashboard/overview";
import { ElectricityDashboard } from "@/components/dashboard/electricity";
import { HeatDashboard }        from "@/components/dashboard/heat";
import { CountriesDashboard }   from "@/components/dashboard/countries";
import { TrendsDashboard }      from "@/components/dashboard/trends";
import { WekaDashboard }        from "@/components/dashboard/weka";
import { PresentorsDashboard }  from "@/components/dashboard/presentors";

export default function Page() {
  const [section, setSection] = useState<NavSection>("overview");

  return (
    <div className="flex min-h-dvh flex-col overflow-y-auto md:h-dvh md:overflow-hidden">
      <AppNav active={section} onChange={setSection} />
      <main className="flex-1 overflow-visible md:min-h-0 md:overflow-hidden">
        {section === "overview"    && <OverviewDashboard />}
        {section === "electricity" && <ElectricityDashboard />}
        {section === "heat"        && <HeatDashboard />}
        {section === "countries"   && <CountriesDashboard />}
        {section === "trends"      && <TrendsDashboard />}
        {section === "weka"        && <WekaDashboard />}
        {section === "presentors"  && <PresentorsDashboard />}
      </main>
    </div>
  );
}
