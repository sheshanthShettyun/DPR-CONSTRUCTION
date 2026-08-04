"use client";

export interface Stage {
  label: string;
  time: string;
  done: boolean;
  active?: boolean;
}

export interface OrderData {
  id: string;
  from: string;
  to: string;
  flag: string;
  sub: string;
  load: string;
  status: string;
  color: string;
  eta: string;
  distance: string;
  stages: Stage[];
}

export const orders: OrderData[] = [
  {
    id: "#US045861", from: "Dallas, TX", to: "Houston, TX", flag: "🇺🇸", sub: "TNA Groups", load: "650 kg", status: "In Transit", color: "amber",
    eta: "2h 14m", distance: "124 km",
    stages: [
      { label: "Loaded", time: "09:15", done: true },
      { label: "Dispatched", time: "10:40", done: true },
      { label: "In Transit", time: "11:30", done: true, active: true },
      { label: "Checkpoint", time: "13:25", done: false },
      { label: "Arriving", time: "14:50", done: false },
      { label: "Delivered", time: "16:30", done: false },
    ],
  },
  {
    id: "#EP0111454", from: "Berlin, DE", to: "Paris, FR", flag: "🇩🇪🇫🇷", sub: "Gravitas LLC", load: "1,240 kg", status: "Delivered", color: "emerald",
    eta: "—", distance: "1,054 km",
    stages: [
      { label: "Loaded", time: "08:00", done: true },
      { label: "Dispatched", time: "09:15", done: true },
      { label: "In Transit", time: "10:30", done: true },
      { label: "Checkpoint", time: "14:00", done: true },
      { label: "Arriving", time: "16:45", done: true },
      { label: "Delivered", time: "18:10", done: true, active: true },
    ],
  },
  {
    id: "#US045860", from: "Seattle, WA", to: "Denver, CO", flag: "🇺🇸", sub: "BVI GROUP", load: "125 kg", status: "Picked Up", color: "orange",
    eta: "18h 30m", distance: "2,148 km",
    stages: [
      { label: "Loaded", time: "07:30", done: true },
      { label: "Dispatched", time: "08:15", done: true },
      { label: "In Transit", time: "—", done: false, active: true },
      { label: "Checkpoint", time: "—", done: false },
      { label: "Arriving", time: "—", done: false },
      { label: "Delivered", time: "—", done: false },
    ],
  },
  {
    id: "#EP045840", from: "Warsaw, PL", to: "Prague, CZ", flag: "🇵🇱🇨🇿", sub: "MEGAONE", load: "2,584 kg", status: "In Transit", color: "amber",
    eta: "3h 45m", distance: "517 km",
    stages: [
      { label: "Loaded", time: "06:00", done: true },
      { label: "Dispatched", time: "07:20", done: true },
      { label: "In Transit", time: "08:45", done: true, active: true },
      { label: "Checkpoint", time: "10:30", done: false },
      { label: "Arriving", time: "12:15", done: false },
      { label: "Delivered", time: "13:00", done: false },
    ],
  },
  {
    id: "#US046584", from: "Miami, FL", to: "Atlanta, GA", flag: "🇺🇸", sub: "DPR Logistics", load: "890 kg", status: "Maintenance", color: "orange",
    eta: "—", distance: "1,064 km",
    stages: [
      { label: "Loaded", time: "10:00", done: true },
      { label: "Dispatched", time: "10:30", done: true, active: true },
      { label: "In Transit", time: "—", done: false },
      { label: "Checkpoint", time: "—", done: false },
      { label: "Arriving", time: "—", done: false },
      { label: "Delivered", time: "—", done: false },
    ],
  },
  {
    id: "#EP022309", from: "London, UK", to: "Amsterdam, NL", flag: "🇬🇧🇳🇱", sub: "Atlas Logistics", load: "1,870 kg", status: "Delivered", color: "emerald",
    eta: "—", distance: "576 km",
    stages: [
      { label: "Loaded", time: "07:00", done: true },
      { label: "Dispatched", time: "08:10", done: true },
      { label: "In Transit", time: "09:40", done: true },
      { label: "Checkpoint", time: "12:00", done: true },
      { label: "Arriving", time: "14:20", done: true },
      { label: "Delivered", time: "15:30", done: true, active: true },
    ],
  },
];
