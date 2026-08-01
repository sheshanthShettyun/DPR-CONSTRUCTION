"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PanelLeftOpen, X, Calendar } from "lucide-react";
import TopNav from "@/components/TopNav";
import FilterSidebar from "@/components/FilterSidebar";
import OrderCard from "@/components/OrderCard";
import TimerSection from "@/components/TimerSection";
import AssetPanel from "@/components/AssetPanel";
import CalendarPicker from "@/components/CalendarPicker";
import TransitPanel from "@/components/TransitPanel";
import { orders, type OrderData } from "@/lib/orders";

export default function Home() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderData>(orders[0]);
  const [transitOpen, setTransitOpen] = useState(false);

  const openTransit = (order: OrderData) => {
    setSelectedOrder(order);
    setTransitOpen(true);
  };

  return (
    <div className="p-8">
      <TopNav />

      <main className="relative flex gap-6">
        <FilterSidebar />

        <section className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold">Equipment &amp; Assets</h1>
              <span className="rounded bg-[#1a1a1a] px-2 py-0.5 text-sm text-[#8c8c8c]">1,556</span>
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
                className={`rounded-xl border border-white/5 p-2 transition-colors ${
                  panelOpen ? "bg-[#e2f1a6] text-black" : "bg-[#1a1a1a] text-[#8c8c8c]"
                }`}
              >
                {panelOpen ? <X size={20} /> : <PanelLeftOpen size={20} />}
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {orders.slice(0, 3).map((order) => (
              <OrderCard
                key={order.id}
                {...order}
                onClick={() => openTransit(order)}
              />
            ))}
            <OrderCard
              {...orders[3]}
              onClick={() => openTransit(orders[3])}
            />
            <OrderCard
              {...orders[4]}
              onClick={() => openTransit(orders[4])}
            />
            <TimerSection />
          </div>
        </section>

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
                <AssetPanel onClose={() => setPanelOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {transitOpen && (
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
              <div onClick={(e) => e.stopPropagation()} className="mx-auto w-full max-w-[1180px]">
                <TransitPanel order={selectedOrder} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
