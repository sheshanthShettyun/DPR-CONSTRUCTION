"use client";

import { Settings, Plus } from "lucide-react";

export default function Header() {
  return (
    <header className="mb-8 flex items-start justify-between pr-6">
      <div className="max-w-xl">
        <h1 className="text-5xl font-bold leading-tight text-gray-900">
          Managing Your Team and Workflows
        </h1>
      </div>
      <div className="mt-2 flex items-center space-x-4">
        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition hover:bg-gray-50">
          <Settings size={18} strokeWidth={1.5} />
        </button>
        <button className="btn-dark flex items-center space-x-2 rounded-full px-6 py-3 font-semibold transition hover:bg-gray-800">
          <span className="text-lg">+</span>
          <span className="pr-2">Create a New Scenario</span>
        </button>
      </div>
    </header>
  );
}
