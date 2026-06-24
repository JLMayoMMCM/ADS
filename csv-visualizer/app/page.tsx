"use client";
import { useState } from "react";
import { AppNav, type NavSection } from "@/components/nav/app-nav";
import { OverviewDashboard }    from "@/components/dashboard/overview";
import { ElectricityDashboard } from "@/components/dashboard/electricity";
import { HeatDashboard }        from "@/components/dashboard/heat";
import { CountriesDashboard }   from "@/components/dashboard/countries";
import { TrendsDashboard }      from "@/components/dashboard/trends";
import { WekaDashboard }        from "@/components/dashboard/weka";

export default function Page() {
  const [section, setSection] = useState<NavSection>("overview");

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppNav active={section} onChange={setSection} />
      <main className="flex-1 min-h-0 overflow-hidden">
        {section === "overview"    && <OverviewDashboard />}
        {section === "electricity" && <ElectricityDashboard />}
        {section === "heat"        && <HeatDashboard />}
        {section === "countries"   && <CountriesDashboard />}
        {section === "trends"      && <TrendsDashboard />}
        {section === "weka"        && <WekaDashboard />}
      </main>
    </div>
  );
}
