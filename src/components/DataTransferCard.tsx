"use client";

import { ArrowLeftRight, Ellipsis } from "lucide-react";

export default function DataTransferCard() {
  return (
    <div className="bg-yellow-accent flex flex-1 flex-col justify-between rounded-3xl p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 font-medium text-gray-800">
          <ArrowLeftRight size={14} strokeWidth={1.5} />
          <span>Data Transfer</span>
        </div>
        <Ellipsis size={16} className="text-gray-600" />
      </div>
      <div className="mb-6 flex items-baseline space-x-2">
        <span className="text-5xl font-bold">163</span>
        <span className="rounded-full bg-gray-900 px-2 py-1 text-xs font-bold text-white">68%</span>
        <span className="text-sm text-gray-700">/ 512.0 MB</span>
      </div>
      <div className="flex space-x-2">
        <div className="h-6 flex-1 rounded-lg bg-gray-900" />
        <div className="h-6 flex-1 rounded-lg bg-gray-900" />
        <div className="h-6 flex-1 rounded-lg bg-gray-900" />
        <div className="h-6 flex-1 rounded-lg bg-gray-900" />
        <div className="h-6 flex-1 rounded-lg border-2 border-dashed border-gray-900/20" />
        <div className="h-6 flex-1 rounded-lg border-2 border-dashed border-gray-900/20" />
      </div>
    </div>
  );
}
