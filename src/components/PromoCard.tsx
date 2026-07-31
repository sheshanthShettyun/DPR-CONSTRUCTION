"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const bgImage = "https://lh3.googleusercontent.com/aida/AP1WRLuKWCHHmb3pFEtHOAJWT2CTQGqRXS1GXXUJ1PO_UWAdX466PoEOCD3GqPqmFE92Nf3bCYR9559guOevqQovCSBwOgO2H6IsfOoOoQ8Of8J5FMpxYdCZILsvc-Tt7_YplkIVbt9XTLqUwfq69ZkP5UibF0LCTa3fZ4LIZcb5AQfH7ofmI9Ryf5jRjbDFXR-IQdhKbPhlJLigxisGShuK_4EAymBiXcJ7INqmmWQF5sku46MGSoQugeVCDg";

export default function PromoCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.3)" }}
      className="relative flex flex-1 flex-col justify-center overflow-hidden rounded-3xl bg-gray-900 p-6 text-white shadow-sm"
    >
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${bgImage}')`, opacity: 0.8 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="relative z-10">
        <h3 className="mb-4 text-2xl font-bold leading-tight">
          Take You Automation<br />to the Next Level
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center space-x-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black"
        >
          <span>Upgrade</span>
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowRight size={14} strokeWidth={2} />
          </motion.span>
        </motion.button>
      </div>
    </motion.div>
  );
}
