export interface ProjectData {
  id: string;
  name: string;
  location: string;
  targetDate: string;
  progress: number;
  equipment: number;
  crew: number;
  status: string;
  modules: number[];
}

export const projects: ProjectData[] = [
  {
    id: "building-a",
    name: "Meridian Heights — Tower B",
    location: "Dallas, TX",
    targetDate: "Dec 2026",
    progress: 62,
    equipment: 412,
    crew: 128,
    status: "In Progress",
    modules: [1, 1, 1, 0, 0, 0],
  },
  {
    id: "building-b",
    name: "Harbour Vista — Phase 2",
    location: "Berlin, DE",
    targetDate: "Mar 2027",
    progress: 45,
    equipment: 287,
    crew: 94,
    status: "In Progress",
    modules: [1, 1, 0, 0, 0, 0],
  },
  {
    id: "building-c",
    name: "Riverside Industrial Park",
    location: "Warsaw, PL",
    targetDate: "Oct 2026",
    progress: 91,
    equipment: 156,
    crew: 52,
    status: "Near Completion",
    modules: [1, 1, 1, 1, 1, 0],
  },
];

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
  color: "amber" | "emerald" | "orange";
  eta: string;
  distance: string;
  stages: Stage[];
}

export const orders: OrderData[] = [
  {
    id: "#US045861",
    from: "Dallas, TX",
    to: "Houston, TX",
    flag: "🇺🇸",
    sub: "TNA Groups",
    load: "650 kg",
    status: "In Transit",
    color: "amber",
    eta: "2h 14m",
    distance: "124 km",
    stages: [
      { label: "Loaded", time: "09:15", done: true, active: false },
      { label: "Dispatched", time: "10:40", done: true, active: false },
      { label: "In Transit", time: "11:30", done: true, active: true },
      { label: "Checkpoint", time: "13:25", done: false, active: false },
      { label: "Arriving", time: "14:50", done: false, active: false },
      { label: "Delivered", time: "16:30", done: false, active: false },
    ],
  },
  {
    id: "#EP0111454",
    from: "Berlin, DE",
    to: "Paris, FR",
    flag: "🇩🇪🇫🇷",
    sub: "Gravitas LLC",
    load: "1,240 kg",
    status: "Delivered",
    color: "emerald",
    eta: "—",
    distance: "1,054 km",
    stages: [
      { label: "Loaded", time: "08:00", done: true, active: false },
      { label: "Dispatched", time: "09:15", done: true, active: false },
      { label: "In Transit", time: "10:30", done: true, active: false },
      { label: "Checkpoint", time: "14:00", done: true, active: false },
      { label: "Arriving", time: "16:45", done: true, active: false },
      { label: "Delivered", time: "18:10", done: true, active: true },
    ],
  },
  {
    id: "#US045860",
    from: "Seattle, WA",
    to: "Denver, CO",
    flag: "🇺🇸",
    sub: "BVI GROUP",
    load: "125 kg",
    status: "Picked Up",
    color: "orange",
    eta: "18h 30m",
    distance: "2,148 km",
    stages: [
      { label: "Loaded", time: "07:30", done: true, active: false },
      { label: "Dispatched", time: "08:15", done: true, active: false },
      { label: "In Transit", time: "—", done: false, active: true },
      { label: "Checkpoint", time: "—", done: false, active: false },
      { label: "Arriving", time: "—", done: false, active: false },
      { label: "Delivered", time: "—", done: false, active: false },
    ],
  },
];

export const utilityStock = { totalItems: 248, available: 196, lowStock: 52 };

export const objectives = [
  { title: "Daily Design Challenge", time: "09:00 - 09:30", done: true, dueDate: "Aug 23" },
  { title: "Weekly Team Meet", time: "16:45 - 17:45", done: false, dueDate: "Aug 23" },
  { title: "Teezaro Project Presentation", time: "19:15 - 20:00", done: false, dueDate: "Aug 23" },
];

export const levelStreak = {
  level: 24,
  levelTotal: 50,
  streak: 12,
  xp: 1240,
  xpTotal: 2500,
  toNext: 1260,
};

export const expenseSummary = {
  month: "Feb 2026",
  totalSpent: 6240,
  budget: 7800,
  potentialSavings: 680,
  savingsRatePct: 8.2,
  savingsTargetPct: 20,
  sparklineFilled: 13,
  sparklineTotal: 16,
};

export interface ExpenseCategory {
  name: string;
  amount: number;
  pct: number;
  color: string;
  changeAmount: number;
}

export const expenseCategories: ExpenseCategory[] = [
  { name: "Equipment", amount: 2400, pct: 38.5, color: "#f43f5e", changeAmount: 0 },
  { name: "Fuel & Energy", amount: 920, pct: 14.7, color: "#f59e0b", changeAmount: 0 },
  { name: "Materials", amount: 680, pct: 10.9, color: "#818cf8", changeAmount: 450 },
  { name: "Labor", amount: 580, pct: 9.3, color: "#eab308", changeAmount: 0 },
  { name: "Utilities", amount: 420, pct: 6.7, color: "#e2f1a6", changeAmount: 0 },
  { name: "Safety & Compliance", amount: 340, pct: 5.4, color: "#a855f7", changeAmount: 0 },
  { name: "Fleet", amount: 510, pct: 8.2, color: "#34d399", changeAmount: 0 },
  { name: "PPE & Gear", amount: 280, pct: 4.5, color: "#60a5fa", changeAmount: 0 },
  { name: "Other", amount: 110, pct: 1.8, color: "#a1a1aa", changeAmount: 0 },
];

export interface TaskCardData {
  title: string;
  desc: string;
  date: string;
  comments: number;
  files: number;
  level: "Plenty" | "Low" | "Critical";
  type: string;
}

export interface TaskColumnData {
  title: string;
  cards: TaskCardData[];
}

export const taskColumns: TaskColumnData[] = [
  {
    title: "Power & Utilities",
    cards: [
      { title: "Diesel Generator CAT XQ200", desc: "200 kW · 1,203 hrs runtime", date: "Jul 2", comments: 12, files: 2, level: "Plenty", type: "Generator" },
      { title: "Portable Generator Honda", desc: "5.5 kW · 340 hrs runtime", date: "Jul 5", comments: 8, files: 1, level: "Low", type: "Generator" },
      { title: "Transformer Unit TX-400", desc: "400 kVA · Site B · Standby", date: "Jul 7", comments: 3, files: 0, level: "Critical", type: "Transformer" },
    ],
  },
  {
    title: "Water & Plumbing",
    cards: [
      { title: "Water Pump WP-880", desc: "880 L/min · Diesel powered", date: "Jul 14", comments: 6, files: 1, level: "Plenty", type: "Pump" },
      { title: "De-watering System", desc: "4 pumps · Pit 3 · Active", date: "Jul 9", comments: 9, files: 3, level: "Low", type: "Pump" },
      { title: "Portable Water Tank", desc: "10,000L · Refilled 07/28", date: "Jul 11", comments: 2, files: 0, level: "Plenty", type: "Tank" },
    ],
  },
  {
    title: "Safety Equipment",
    cards: [
      { title: "First Aid Station", desc: "Bay 2 · Fully stocked", date: "Jul 2", comments: 5, files: 2, level: "Plenty", type: "Medical" },
      { title: "Fire Extinguishers", desc: "12 units · All zones", date: "Jul 6", comments: 14, files: 1, level: "Critical", type: "Fire" },
      { title: "PPE Inventory", desc: "48 sets · Helmets/Vests", date: "Jul 8", comments: 7, files: 4, level: "Low", type: "PPE" },
    ],
  },
  {
    title: "Tools & Equipment",
    cards: [
      { title: "Concrete Mixer CM-450", desc: "450L · Electric · In use", date: "Jul 3", comments: 11, files: 2, level: "Plenty", type: "Mixer" },
      { title: "Compactor Plate", desc: "Honda GX160 · 90kg", date: "Jul 5", comments: 4, files: 1, level: "Low", type: "Compactor" },
      { title: "Welding Rig Lincoln", desc: "400A · Diesel · Active", date: "Jul 10", comments: 8, files: 2, level: "Critical", type: "Welder" },
    ],
  },
];

export const assetHeavyMachinery = {
  id: "#US046584",
  category: "Heavy Machinery",
  fields: [
    ["Type", "Excavator"],
    ["Model", "CAT 320"],
    ["HP", "148 HP"],
    ["Fuel", "Diesel"],
    ["Hours", "2,846 hrs"],
    ["Operator", "TNA Groups"],
  ] as [string, string][],
  tools: [
    { id: "BCK-340", weight: "1,200kg" },
    { id: "HMR-112", weight: "680kg" },
  ],
  type: "Heavy",
  weight: "22,450kg",
  cost: "$180.5k",
};

export const leasedOut = [
  { name: "Excavator CAT 320", spec: "Leased to TNA Groups · Until Aug 15", status: "Active Lease", tone: "emerald" as const },
  { name: "Dump Truck CAT 745", spec: "Leased to MEGAONE · Until Sep 02", status: "Active Lease", tone: "emerald" as const },
  { name: "Bulldozer D6T", spec: "Leased to BVI GROUP · Until Aug 28", status: "Pending Return", tone: "amber" as const },
];

export const heroFeatures = [
  { label: "Real-time tracking" },
  { label: "Asset management" },
  { label: "Fleet operations" },
  { label: "Site insights" },
];
