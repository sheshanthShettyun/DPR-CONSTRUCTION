"use client";

import { motion } from "framer-motion";

export default function HourglassIcon() {
  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="flex cursor-pointer flex-col items-center gap-2"
    >
      <svg
        width="72" height="96" viewBox="0 0 100 120"
        fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ filter: "drop-shadow(0 0 2px rgba(255,255,255,0.08))" }}
      >
        <defs>
          <path
            d="M20,15 C20,2 80,2 80,15 C80,38 68,52 56,58 Q50,61 44,58 C32,52 20,38 20,15 Z M20,105 C20,118 80,118 80,105 C80,82 68,68 56,62 Q50,59 44,62 C32,68 20,82 20,105 Z"
            id="fullGlass"
          />

          <clipPath id="clip-top">
            <rect x="0" y="5" width="100" height="55">
              <animate attributeName="y" values="5;5;60;60;5" keyTimes="0;0.1;0.9;0.98;1" dur="20s" repeatCount="indefinite" />
              <animate attributeName="height" values="55;55;0;0;55" keyTimes="0;0.1;0.9;0.98;1" dur="20s" repeatCount="indefinite" />
            </rect>
          </clipPath>
          <clipPath id="clip-bottom">
            <rect x="0" y="115" width="100" height="0">
              <animate attributeName="y" values="115;115;60;60;115" keyTimes="0;0.1;0.9;0.98;1" dur="20s" repeatCount="indefinite" />
              <animate attributeName="height" values="0;0;55;55;0" keyTimes="0;0.1;0.9;0.98;1" dur="20s" repeatCount="indefinite" />
            </rect>
          </clipPath>
        </defs>

        <use href="#fullGlass" fill="rgba(255,255,255,0.04)" stroke="#dbdad5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />

        <g clipPath="url(#clip-top)">
          <use href="#fullGlass" fill="#ffffff" opacity="0.7" />
        </g>

        <g clipPath="url(#clip-bottom)">
          <use href="#fullGlass" fill="#ffffff" opacity="0.7" />
        </g>

        <rect x="49.25" y="58" width="1.5" fill="#ffffff" opacity="0.6">
          <animate attributeName="height" values="0;50" dur="0.8s" repeatCount="indefinite" />
        </rect>
      </svg>

      <div className="flex items-baseline gap-1">
        <span className="text-lg font-bold text-white">60%</span>
        <span className="text-[10px] text-[#8c8c8c]">complete</span>
      </div>
    </motion.div>
  );
}
