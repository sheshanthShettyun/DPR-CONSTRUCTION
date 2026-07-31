"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const tabs = [
  "Organization", "Teams", "Users", "Subscription",
  "Payment", "Installed Apps", "Variables", "Scenario Pro...",
];

export default function Tabs() {
  const [active, setActive] = useState("Organization");

  return (
    <nav className="mb-8 mr-64 flex space-x-6 border-b border-gray-200 pb-2 text-sm font-medium text-gray-600">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`relative shrink-0 rounded-full px-5 py-2 font-semibold transition-colors ${
            active === tab ? "text-white" : "hover:text-gray-900"
          }`}
        >
          {active === tab && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 rounded-full bg-gray-900"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{tab}</span>
        </button>
      ))}
    </nav>
  );
}
