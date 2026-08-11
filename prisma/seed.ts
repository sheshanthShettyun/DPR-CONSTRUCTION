import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.stage.deleteMany();
  await prisma.order.deleteMany();
  await prisma.taskCard.deleteMany();
  await prisma.taskColumn.deleteMany();
  await prisma.expenseCategory.deleteMany();
  await prisma.expenseSummary.deleteMany();
  await prisma.objective.deleteMany();
  await prisma.utilityStock.deleteMany();
  await prisma.project.deleteMany();

  await prisma.project.createMany({
    data: [
      { id: "building-a", name: "Meridian Heights — Tower B", location: "Dallas, TX", targetDate: "Dec 2026", progress: 62, equipment: 412, crew: 128, status: "In Progress", svgType: "tower", modulesJson: JSON.stringify([1, 1, 1, 0, 0, 0]) },
      { id: "building-b", name: "Harbour Vista — Phase 2", location: "Berlin, DE", targetDate: "Mar 2027", progress: 45, equipment: 287, crew: 94, status: "In Progress", svgType: "factory", modulesJson: JSON.stringify([1, 1, 0, 0, 0, 0]) },
      { id: "building-c", name: "Riverside Industrial Park", location: "Warsaw, PL", targetDate: "Oct 2026", progress: 91, equipment: 156, crew: 52, status: "Near Completion", svgType: "residential", modulesJson: JSON.stringify([1, 1, 1, 1, 1, 0]) },
    ],
  });

  const orders = [
    {
      id: "#US045861", from: "Dallas, TX", to: "Houston, TX", flag: "🇺🇸", sub: "TNA Groups", load: "650 kg", status: "In Transit", color: "amber",
      eta: "2h 14m", distance: "124 km",
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
      id: "#EP0111454", from: "Berlin, DE", to: "Paris, FR", flag: "🇩🇪🇫🇷", sub: "Gravitas LLC", load: "1,240 kg", status: "Delivered", color: "emerald",
      eta: "—", distance: "1,054 km",
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
      id: "#US045860", from: "Seattle, WA", to: "Denver, CO", flag: "🇺🇸", sub: "BVI GROUP", load: "125 kg", status: "Picked Up", color: "orange",
      eta: "18h 30m", distance: "2,148 km",
      stages: [
        { label: "Loaded", time: "07:30", done: true, active: false },
        { label: "Dispatched", time: "08:15", done: true, active: false },
        { label: "In Transit", time: "—", done: false, active: true },
        { label: "Checkpoint", time: "—", done: false, active: false },
        { label: "Arriving", time: "—", done: false, active: false },
        { label: "Delivered", time: "—", done: false, active: false },
      ],
    },
    {
      id: "#EP045840", from: "Warsaw, PL", to: "Prague, CZ", flag: "🇵🇱🇨🇿", sub: "MEGAONE", load: "2,584 kg", status: "In Transit", color: "amber",
      eta: "3h 45m", distance: "517 km",
      stages: [
        { label: "Loaded", time: "06:00", done: true, active: false },
        { label: "Dispatched", time: "07:20", done: true, active: false },
        { label: "In Transit", time: "08:45", done: true, active: true },
        { label: "Checkpoint", time: "10:30", done: false, active: false },
        { label: "Arriving", time: "12:15", done: false, active: false },
        { label: "Delivered", time: "13:00", done: false, active: false },
      ],
    },
    {
      id: "#US046584", from: "Miami, FL", to: "Atlanta, GA", flag: "🇺🇸", sub: "DPR Logistics", load: "890 kg", status: "Maintenance", color: "orange",
      eta: "—", distance: "1,064 km",
      stages: [
        { label: "Loaded", time: "10:00", done: true, active: false },
        { label: "Dispatched", time: "10:30", done: true, active: true },
        { label: "In Transit", time: "—", done: false, active: false },
        { label: "Checkpoint", time: "—", done: false, active: false },
        { label: "Arriving", time: "—", done: false, active: false },
        { label: "Delivered", time: "—", done: false, active: false },
      ],
    },
    {
      id: "#EP022309", from: "London, UK", to: "Amsterdam, NL", flag: "🇬🇧🇳🇱", sub: "Atlas Logistics", load: "1,870 kg", status: "Delivered", color: "emerald",
      eta: "—", distance: "576 km",
      stages: [
        { label: "Loaded", time: "07:00", done: true, active: false },
        { label: "Dispatched", time: "08:10", done: true, active: false },
        { label: "In Transit", time: "09:40", done: true, active: false },
        { label: "Checkpoint", time: "12:00", done: true, active: false },
        { label: "Arriving", time: "14:20", done: true, active: false },
        { label: "Delivered", time: "15:30", done: true, active: true },
      ],
    },
  ];

  for (const o of orders) {
    const { stages, ...rest } = o;
    await prisma.order.create({
      data: {
        ...rest,
        stages: {
          create: stages.map((s, i) => ({ ...s, position: i })),
        },
      },
    });
  }

  const columns = [
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

  for (let i = 0; i < columns.length; i++) {
    const col = columns[i];
    await prisma.taskColumn.create({
      data: {
        title: col.title,
        position: i,
        cards: { create: col.cards.map((c, j) => ({ ...c, position: j })) },
      },
    });
  }

  const categories = [
    { name: "Equipment", amount: 2400, pct: 38.5, color: "bg-rose-500", icon: "Wrench", changeAmount: 0 },
    { name: "Fuel & Energy", amount: 920, pct: 14.7, color: "bg-amber-500", icon: "Fuel", changeAmount: 0 },
    { name: "Materials", amount: 680, pct: 10.9, color: "bg-indigo-400", icon: "Package", changeAmount: 450 },
    { name: "Labor", amount: 580, pct: 9.3, color: "bg-yellow-600", icon: "Users", changeAmount: 0 },
    { name: "Utilities", amount: 420, pct: 6.7, color: "bg-[#e2f1a6]", icon: "Zap", changeAmount: 0 },
    { name: "Safety & Compliance", amount: 340, pct: 5.4, color: "bg-purple-500", icon: "Shield", changeAmount: 0 },
    { name: "Fleet", amount: 510, pct: 8.2, color: "bg-emerald-400", icon: "Truck", changeAmount: 0 },
    { name: "PPE & Gear", amount: 280, pct: 4.5, color: "bg-blue-400", icon: "HardHat", changeAmount: 0 },
    { name: "Other", amount: 110, pct: 1.8, color: "bg-zinc-400", icon: "Wrench", changeAmount: 0 },
  ];
  await prisma.expenseCategory.createMany({
    data: categories.map((c, i) => ({ ...c, position: i })),
  });

  await prisma.expenseSummary.create({
    data: {
      month: "Feb 2026",
      totalSpent: 6240,
      budget: 7800,
      potentialSavings: 680,
      savingsRatePct: 8.2,
      savingsTargetPct: 20,
      sparklineFilled: 13,
      sparklineTotal: 16,
    },
  });

  await prisma.objective.createMany({
    data: [
      { title: "Daily Design Challenge", time: "09:00 - 09:30", done: true, dueDate: "Aug 23", position: 0 },
      { title: "Weekly Team Meet", time: "16:45 - 17:45", done: false, dueDate: "Aug 23", position: 1 },
      { title: "Teezaro Project Presentation", time: "19:15 - 20:00", done: false, dueDate: "Aug 23", position: 2 },
    ],
  });

  await prisma.utilityStock.create({
    data: { totalItems: 248, available: 196, lowStock: 52 },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
