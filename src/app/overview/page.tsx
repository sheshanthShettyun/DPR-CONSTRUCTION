"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, X, Calendar, ArrowLeft, Plus } from "lucide-react";
import TopNav from "@/components/TopNav";
import FilterSidebar from "@/components/FilterSidebar";
import OrderCard from "@/components/OrderCard";
import QuickOrderPanel from "@/components/QuickOrderPanel";
import CalendarPicker from "@/components/CalendarPicker";
import TransitPanel from "@/components/TransitPanel";
import OffSiteView from "@/components/OffSiteView";
import ProjectsView, { type ProjectData } from "@/components/ProjectsView";
import ExpensesCard from "@/components/ExpensesCard";
import ObjectivesCard from "@/components/ObjectivesCard";
import UtilityStockCard from "@/components/UtilityStockCard";
import LevelStreakCard from "@/components/LevelStreakCard";
import HourglassIcon from "@/components/HourglassIcon";
import TaskBoard from "@/components/TaskBoard";
import ImportOverlay from "@/components/ImportOverlay";
import AddOrderModal from "@/components/AddOrderModal";
import type { OrderData } from "@/lib/orders";

export default function Home() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [transitOpen, setTransitOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Dashboard");
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [addOrderOpen, setAddOrderOpen] = useState(false);

  const refreshOrders = (pid: string | null) => {
    const qs = pid ? `?projectId=${encodeURIComponent(pid)}` : "";
    fetch(`/api/orders${qs}`).then((r) => r.json()).then(setOrders);
  };

  useEffect(() => {
    refreshOrders(selectedBuilding);
    fetch("/api/projects").then((r) => r.json()).then(setProjects);
    try {
      if (sessionStorage.getItem("dpr:projects") === "1") {
        sessionStorage.removeItem("dpr:projects");
        setSelectedBuilding(null);
        setActiveFilter("Dashboard");
      }
    } catch {}
    const h = () => refreshOrders(selectedBuilding);
    window.addEventListener("dpr:refresh", h);
    return () => window.removeEventListener("dpr:refresh", h);
  }, [selectedBuilding]);

  const handleBuildingSelect = (id: string) => {
    setSelectedBuilding(id);
    setActiveFilter("Dashboard");
  };

  const selectedProject = projects.find((p) => p.id === selectedBuilding);
  const buildingName = selectedProject?.name ?? "";

  const openTransit = (order: OrderData) => {
    setSelectedOrder(order);
    setTransitOpen(true);
  };

  return (
    <div className="px-8 pb-8 pt-7 lg:px-10">
      <TopNav />

      <main className="relative flex gap-6">
        {selectedBuilding && <FilterSidebar active={activeFilter} onChange={setActiveFilter} />}

        <section className="flex-1">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedBuilding ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedBuilding(null)}
                    className="rounded-lg border border-white/5 bg-[#1a1a1a] p-1.5 text-[#8c8c8c] hover:text-white"
                  >
                    <ArrowLeft size={16} />
                  </motion.button>
                  <h1 className="text-3xl font-semibold">{buildingName}</h1>
                  <span className="rounded bg-[#1a1a1a] px-2 py-0.5 text-sm text-[#8c8c8c]">{activeFilter}</span>
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-semibold">All Projects</h1>
                  <span className="rounded bg-[#1a1a1a] px-2 py-0.5 text-sm text-[#8c8c8c]">{projects.length} active</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCalOpen(!calOpen)}
                  className={`rounded-xl border border-white/5 p-2 transition-colors ${
                    calOpen || selectedDate ? "bg-[#1a1a1a] text-[#e2f1a6]" : "bg-[#1a1a1a] text-[#8c8c8c]"
                  }`}
                >
                  <Calendar size={20} />
                </motion.button>
                <AnimatePresence>
                  {calOpen && (
                    <CalendarPicker
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      onClose={() => setCalOpen(false)}
                    />
                  )}
                </AnimatePresence>
              </div>
              <button className="rounded-xl border border-white/5 bg-[#1a1a1a] p-2 text-[#8c8c8c]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPanelOpen(!panelOpen)}
                title="Quick emergency stock order"
                className={`flex items-center gap-1.5 rounded-xl border border-white/5 px-3 py-2 text-[12px] font-medium transition-colors ${
                  panelOpen ? "bg-[#e2f1a6] text-black" : "bg-[#1a1a1a] text-[#8c8c8c] hover:text-white"
                }`}
              >
                {panelOpen ? <X size={16} /> : <Zap size={16} />}
                {panelOpen ? "" : "Quick Order"}
              </motion.button>
            </div>
          </div>

          {!selectedBuilding ? (
            <ProjectsView
              projects={projects}
              onSelect={handleBuildingSelect}
              onChanged={() => fetch("/api/projects").then((r) => r.json()).then(setProjects)}
            />
          ) : activeFilter === "Utilities" ? (
            <TaskBoard />
          ) : activeFilter === "Off-Site" ? (
            <OffSiteView />
          ) : activeFilter === "Dashboard" ? (
            <div className="flex flex-col gap-5 [zoom:0.8]">
              {/* Row 1: Level/XP (full width) */}
              <LevelStreakCard />

              <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(340px,0.9fr)]">
                <ExpensesCard projectId={selectedBuilding} />

                <UtilityStockCard projectId={selectedBuilding} />

                  <div className="grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-2">
                    <ObjectivesCard projectId={selectedBuilding} />

                    <div className="dashboard-card flex min-h-[196px] w-full flex-col items-center justify-center gap-4 py-6">
                      <HourglassIcon size={128} />
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-4xl font-semibold tracking-tight text-white">
                          {selectedProject?.progress ?? 0}%
                        </span>
                        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#8c8c8c]">
                          {buildingName} · Progress
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="mb-3">
                      <span className="text-xs font-medium text-[#8c8c8c]">Completed Deliveries</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {orders
                        .filter((o) => o.status === "Delivered")
                        .slice(0, 2)
                        .map((order) => (
                        <OrderCard
                          key={order.id}
                          {...order}
                          onClick={() => openTransit(order)}
                          onStatusChange={() => refreshOrders(selectedBuilding)}
                        />
                        ))}
                    </div>
                    <div className="mt-3">
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setActiveFilter("Transit")}
                        className="flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1 text-[10px] font-medium text-[#8c8c8c] transition-colors hover:bg-white/10 hover:text-white"
                      >
                        See All →
                      </motion.button>
                    </div>
                  </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[13px] text-[#8c8c8c]">
                  {orders.filter((o) => activeFilter === "Transit" ? o.status !== "Maintenance" : o.status === activeFilter).length} order(s) · {activeFilter}
                </span>
                <button
                  onClick={() => setAddOrderOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-[#e2f1a6] px-3.5 py-2 text-[12px] font-semibold text-black transition-colors hover:bg-[#d4f05a]"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  Add Order
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
              {orders
                .filter((o) => activeFilter === "Transit" ? o.status !== "Maintenance" : o.status === activeFilter)
                .map((order) => (
                  <div key={order.id} className="group/transit relative">
                    <OrderCard
                      {...order}
                      onClick={() => openTransit(order)}
                      onStatusChange={() => refreshOrders(selectedBuilding)}
                    />
                    <button
                      onClick={async () => {
                        if (!window.confirm(`Delete order ${order.id}?`)) return;
                        await fetch(`/api/orders/${encodeURIComponent(order.id)}`, { method: "DELETE" });
                        refreshOrders(selectedBuilding);
                        if (selectedOrder?.id === order.id) {
                          setSelectedOrder(null);
                          setTransitOpen(false);
                        }
                      }}
                      title={`Delete order ${order.id}`}
                      className="absolute right-3 top-3 text-white/0 transition-colors hover:text-rose-300 group-hover/transit:text-white/25"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      <AddOrderModal
        open={addOrderOpen}
        onClose={() => setAddOrderOpen(false)}
        projectId={selectedBuilding}
        onAdded={() => refreshOrders(selectedBuilding)}
      />

        <AnimatePresence>
          {panelOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-black/40"
                onClick={() => setPanelOpen(false)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "top right" }}
                className="absolute right-0 top-12 z-50"
              >
                <QuickOrderPanel
                  onClose={() => setPanelOpen(false)}
                  onOrdered={() => setActiveFilter("Transit")}
                  projectId={selectedBuilding}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
      <ImportOverlay />

      <AnimatePresence>
        {transitOpen && selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60"
              onClick={() => setTransitOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-8"
              onClick={() => setTransitOpen(false)}
            >
              <div onClick={(e) => e.stopPropagation()} className="mx-auto w-full max-w-[960px]">
                <TransitPanel
                  order={selectedOrder}
                  onStatusChange={(updated) => {
                    setSelectedOrder(updated);
                    setOrders((prev) => prev.map((o) => (o.id === updated.id ? { ...o, ...updated } : o)));
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
