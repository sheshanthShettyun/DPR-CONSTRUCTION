"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function UtilityStockCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="dashboard-card flex flex-col gap-5"
    >
      <div className="flex items-start justify-between">
        <h2 className="text-[15px] font-medium tracking-wide text-[#8c8c8c]">Utility in Stock</h2>
        <button className="text-[#8c8c8c] transition-colors hover:text-white">
          <ArrowUpRight size={16} strokeWidth={2.5} />
        </button>
      </div>

      <div>
        <div className="mb-2 text-[30px] font-bold leading-none tracking-tight text-white">248</div>
        <div className="text-[15px] font-medium text-[#8c8c8c]">Total items</div>
      </div>

      <div>
        <div className="mb-3 flex items-end justify-between">
          <div className="text-[15px] text-[#8c8c8c]">
            <span className="mr-1 font-semibold text-white">196</span> available
          </div>
          <div className="text-[15px] text-[#8c8c8c]">
            <span className="mr-1 font-semibold text-white">52</span> low stock
          </div>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#333]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "79%" }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-0 h-full rounded-full bg-[#e2f1a6]"
          />
        </div>
      </div>
    </motion.div>
  );
}
