"use client";

import { ArrowRight } from "lucide-react";

const bgImage = "https://lh3.googleusercontent.com/aida/AP1WRLuKWCHHmb3pFEtHOAJWT2CTQGqRXS1GXXUJ1PO_UWAdX466PoEOCD3GqPqmFE92Nf3bCYR9559guOevqQovCSBwOgO2H6IsfOoOoQ8Of8J5FMpxYdCZILsvc-Tt7_YplkIVbt9XTLqUwfq69ZkP5UibF0LCTa3fZ4LIZcb5AQfH7ofmI9Ryf5jRjbDFXR-IQdhKbPhlJLigxisGShuK_4EAymBiXcJ7INqmmWQF5sku46MGSoQugeVCDg";

export default function PromoCard() {
  return (
    <div className="relative flex flex-1 flex-col justify-center overflow-hidden rounded-3xl bg-gray-900 p-6 text-white shadow-sm">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${bgImage}')`, opacity: 0.8 }}
      />
      <div className="relative z-10">
        <h3 className="mb-4 text-2xl font-bold leading-tight">
          Take You Automation<br />to the Next Level
        </h3>
        <button className="inline-flex items-center space-x-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black">
          <span>Upgrade</span>
          <ArrowRight size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
