"use client";

import { Plus, Layers, Share2, Repeat, Link2, Globe, Ellipsis, BookOpen, Rocket, CircleHelp } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="sidebar-bg flex w-16 flex-shrink-0 flex-col items-center space-y-6 rounded-3xl py-4 text-gray-400">
      <button className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold text-black">
        <Plus size={20} strokeWidth={2.5} />
      </button>

      <button className="transition-colors hover:text-white">
        <Layers size={18} strokeWidth={1.5} />
      </button>
      <button className="transition-colors hover:text-white">
        <Share2 size={18} strokeWidth={1.5} />
      </button>
      <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-white">
        <Repeat size={18} strokeWidth={1.5} />
      </button>
      <button className="transition-colors hover:text-white">
        <Link2 size={18} strokeWidth={1.5} />
      </button>
      <button className="transition-colors hover:text-white">
        <Globe size={18} strokeWidth={1.5} />
      </button>
      <button className="transition-colors hover:text-white">
        <Ellipsis size={18} strokeWidth={1.5} />
      </button>

      <div className="flex-grow" />

      <button className="transition-colors hover:text-white">
        <BookOpen size={18} strokeWidth={1.5} />
      </button>
      <button className="transition-colors hover:text-white">
        <Rocket size={18} strokeWidth={1.5} />
      </button>
      <button className="transition-colors hover:text-white">
        <CircleHelp size={18} strokeWidth={1.5} />
      </button>

      <div className="mt-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-500 text-xs font-semibold text-white">
        SS
      </div>
    </aside>
  );
}
