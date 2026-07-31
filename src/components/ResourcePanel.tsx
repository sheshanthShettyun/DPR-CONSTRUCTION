"use client";

import { Users, GraduationCap, CircleHelp, Handshake, FileText, TrendingUp, ArrowUpRight } from "lucide-react";

const links = [
  { icon: CircleHelp, title: "Help Center", desc: "Explore our detailed documentation..." },
  { icon: Handshake, title: "Partner Directory", desc: "Find the perfect partner to support..." },
  { icon: FileText, title: "Blog", desc: "Access popular guides & stories ab..." },
  { icon: TrendingUp, title: "Use Cases", desc: "Get inspired by all the ways you ca..." },
];

export default function ResourcePanel() {
  return (
    <aside className="flex w-72 flex-shrink-0 flex-col space-y-4 pr-4">
      <div className="flex space-x-4">
        <div className="right-sidebar-item-bg flex flex-1 cursor-pointer flex-col items-center justify-center rounded-3xl p-4 transition hover:bg-gray-200">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm">
            <Users size={18} strokeWidth={1.5} />
          </div>
          <span className="text-sm font-bold text-gray-900">Community</span>
        </div>
        <div className="right-sidebar-item-bg flex flex-1 cursor-pointer flex-col items-center justify-center rounded-3xl p-4 transition hover:bg-gray-200">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm">
            <GraduationCap size={18} strokeWidth={1.5} />
          </div>
          <span className="text-sm font-bold text-gray-900">Academy</span>
        </div>
      </div>
      {links.map((link) => (
        <div
          key={link.title}
          className="right-sidebar-item-bg group relative cursor-pointer rounded-3xl p-6 transition hover:bg-gray-200"
        >
          <ArrowUpRight className="absolute right-6 top-6 text-sm text-gray-400 transition-colors group-hover:text-gray-600" size={14} />
          <link.icon size={18} className="mb-3 block text-gray-600" />
          <h4 className="mb-1 font-bold text-gray-900">{link.title}</h4>
          <p className="text-sm leading-relaxed text-gray-500">{link.desc}</p>
        </div>
      ))}
    </aside>
  );
}
