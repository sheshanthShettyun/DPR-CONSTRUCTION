"use client";

import { Settings, Ellipsis } from "lucide-react";

export default function OperationsCard() {
  return (
    <div className="card-bg flex flex-1 flex-col justify-between rounded-3xl border border-gray-100 p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 font-medium text-gray-700">
          <Settings size={14} strokeWidth={1.5} />
          <span>Operations</span>
        </div>
        <Ellipsis size={16} className="text-gray-400" />
      </div>
      <div className="mb-6 flex items-baseline space-x-2">
        <span className="text-5xl font-bold">780</span>
        <span className="bg-yellow-accent rounded-full px-2 py-1 text-xs font-bold text-black">82%</span>
        <span className="text-sm text-gray-400">/ 1 000</span>
      </div>
      <div className="flex space-x-2">
        <div className="h-6 flex-1 rounded-lg bg-gray-900" />
        <div className="h-6 flex-1 rounded-lg bg-gray-900" />
        <div className="h-6 flex-1 rounded-lg bg-gray-900" />
        <div className="h-6 flex-1 rounded-lg bg-gray-900" />
        <div className="h-6 flex-1 rounded-lg border-2 border-dashed border-gray-200" />
        <div className="h-6 flex-1 rounded-lg border-2 border-dashed border-gray-200" />
      </div>
    </div>
  );
}
