"use client";

import { useState } from "react";
import TopNav from "@/components/TopNav";
import FilterSidebar from "@/components/FilterSidebar";
import OrderCard from "@/components/OrderCard";
import TimerSection from "@/components/TimerSection";
import AssetPanel from "@/components/AssetPanel";
import OverviewSection from "@/components/OverviewSection";

const orders = [
  { id: "#US045861", site: "Dallas, TX → Houston, TX", flag: "🇺🇸", sub: "TNA Groups", load: "650 kg", status: "In Transit", color: "amber" },
  { id: "#EP0111454", site: "Berlin, DE → Paris, FR", flag: "🇩🇪🇫🇷", sub: "Gravitas LLC", load: "1,240 kg", status: "Delivered", color: "emerald" },
  { id: "#US045860", site: "Seattle, WA → Denver, CO", flag: "🇺🇸", sub: "BVI GROUP", load: "125 kg", status: "Picked Up", color: "orange" },
  { id: "#EP045840", site: "Warsaw, PL → Prague, CZ", flag: "🇵🇱🇨🇿", sub: "MEGAONE", load: "2,584 kg", status: "In Transit", color: "amber" },
];

export default function Home() {
  const [activeNav, setActiveNav] = useState("Site Ops");

  return (
    <div className="p-8">
      <TopNav activeNav={activeNav} onNavChange={setActiveNav} />

      {activeNav === "Overview" ? (
        <OverviewSection />
      ) : (
        <main className="flex gap-6">
          <FilterSidebar />

          <section className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-semibold">Equipment &amp; Assets</h1>
                <span className="rounded bg-[#1a1a1a] px-2 py-0.5 text-sm text-[#8c8c8c]">1,556</span>
              </div>
              <div className="flex gap-2">
                <button className="rounded-xl border border-white/5 bg-[#1a1a1a] p-2 text-[#8c8c8c]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                </button>
                <button className="rounded-xl border border-white/5 bg-[#1a1a1a] p-2 text-[#8c8c8c]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {orders.slice(0, 3).map((order) => (
                <OrderCard key={order.id} {...order} />
              ))}
              <TimerSection />
              <OrderCard {...orders[3]} />
            </div>
          </section>

          <AssetPanel />
        </main>
      )}
    </div>
  );
}
