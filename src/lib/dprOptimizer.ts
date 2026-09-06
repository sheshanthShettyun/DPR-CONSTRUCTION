// DPR Optimizer core: task→material recipes + trained cost estimator + gap analysis + XP.
// Estimator trained on Kaggle construction-estimation-data (1,000 rows, Linear R²=0.997):
//   Total = 1.1921*Material + 1.1902*Labor + 474.49*ProfitRate + 1.0*Discount - 9087.74
// Pure logic — safe to import from both server routes and client components.
import estimator from "./estimator.json";

export interface Inventory {
  cementBags: number;
  waterLitres: number;
  aggregateKg: number;
  dieselLitres: number;
  crew: number;
}

export interface TaskRecipe {
  id: string;
  title: string;
  equipment: string[];
  needs: Inventory;
  materialCost: number;
  laborCost: number;
  baseXp: number;
}

export interface TaskPlan {
  id: string;
  title: string;
  status: "clear" | "short";
  gaps: Partial<Inventory>;
  xp: number;
  estimate: number;
}

export interface DayPlan {
  tasks: TaskPlan[];
  sequence: string[];
  totals: { materialCost: number; laborCost: number; estimate: number; xp: number };
  shortages: { item: keyof Inventory; need: number; have: number }[];
}

// Unit costs (USD) used to convert recipe quantities → estimator inputs.
const UNIT = { cementBag: 6, waterLitre: 0.002, aggregateKg: 0.03, dieselLitre: 1.1, crewHour: 25 };

const R = (
  id: string,
  title: string,
  equipment: string[],
  needs: Inventory,
  crewHours: number,
  baseXp: number
): TaskRecipe => {
  const materialCost = Math.round(
    needs.cementBags * UNIT.cementBag +
      needs.waterLitres * UNIT.waterLitre +
      needs.aggregateKg * UNIT.aggregateKg +
      needs.dieselLitres * UNIT.dieselLitre
  );
  return { id, title, equipment, needs, materialCost, laborCost: Math.round(crewHours * UNIT.crewHour), baseXp };
};

// Recipes mapped to this site's real equipment (TaskBoard) + DPR work.
export const RECIPES: TaskRecipe[] = [
  R("slab-pour-100", "Pour 100m² slab", ["Concrete Mixer CM-450", "Compactor Plate"],
    { cementBags: 105, waterLitres: 2625, aggregateKg: 27000, dieselLitres: 0, crew: 8 }, 64, 120),
  R("dewater-pit3", "De-water Pit 3", ["De-watering System", "Water Pump WP-880"],
    { cementBags: 0, waterLitres: 0, aggregateKg: 0, dieselLitres: 60, crew: 2 }, 16, 60),
  R("compaction-bay2", "Compaction Bay 2", ["Compactor Plate"],
    { cementBags: 0, waterLitres: 200, aggregateKg: 4000, dieselLitres: 15, crew: 3 }, 24, 50),
  R("welding-bay4", "Structural welding Bay 4", ["Welding Rig Lincoln", "Diesel Generator CAT XQ200"],
    { cementBags: 0, waterLitres: 0, aggregateKg: 0, dieselLitres: 45, crew: 2 }, 16, 70),
  R("pump-service", "Service Water Pump WP-880", ["Water Pump WP-880"],
    { cementBags: 0, waterLitres: 50, aggregateKg: 0, dieselLitres: 5, crew: 1 }, 4, 40),
  R("safety-audit", "Site safety audit", ["Fire Extinguishers", "PPE Inventory"],
    { cementBags: 0, waterLitres: 0, aggregateKg: 0, dieselLitres: 0, crew: 2 }, 6, 40),
  R("generator-service", "Service Generator CAT XQ200", ["Diesel Generator CAT XQ200"],
    { cementBags: 0, waterLitres: 0, aggregateKg: 0, dieselLitres: 20, crew: 2 }, 8, 55),
  R("tank-refill", "Refill Portable Water Tank", ["Portable Water Tank"],
    { cementBags: 0, waterLitres: 10000, aggregateKg: 0, dieselLitres: 10, crew: 1 }, 4, 35),
];

const [cMat, cLab, cProfit, cDisc] = estimator.coef;
const INTERCEPT: number = estimator.intercept;

export function estimateTotal(materialCost: number, laborCost: number, profitRate = 20, discount = 0) {
  return Math.max(0, Math.round(cMat * materialCost + cLab * laborCost + cProfit * profitRate + cDisc * discount + INTERCEPT));
}

const ITEM_LABEL: Record<keyof Inventory, string> = {
  cementBags: "cement bags",
  waterLitres: "water (L)",
  aggregateKg: "aggregate (kg)",
  dieselLitres: "diesel (L)",
  crew: "crew",
};

export function optimizePlan(taskIds: string[], inv: Inventory): DayPlan {
  const picked = RECIPES.filter((r) => taskIds.includes(r.id));
  // running inventory simulation in priority order (clear tasks consume first)
  const remaining: Inventory = { ...inv };
  const tasks: TaskPlan[] = picked.map((r) => {
    const gaps: Partial<Inventory> = {};
    (Object.keys(r.needs) as (keyof Inventory)[]).forEach((k) => {
      if (r.needs[k] > remaining[k]) gaps[k] = r.needs[k] - remaining[k];
    });
    const status = Object.keys(gaps).length === 0 ? "clear" : "short";
    if (status === "clear") {
      (Object.keys(r.needs) as (keyof Inventory)[]).forEach((k) => {
        remaining[k] -= r.needs[k];
      });
    }
    return {
      id: r.id,
      title: r.title,
      status,
      gaps,
      xp: r.baseXp,
      estimate: estimateTotal(r.materialCost, r.laborCost),
    };
  });
  const clear = tasks.filter((t) => t.status === "clear");
  const short = tasks.filter((t) => t.status === "short");
  const totals = {
    materialCost: picked.reduce((s, r) => s + r.materialCost, 0),
    laborCost: picked.reduce((s, r) => s + r.laborCost, 0),
    estimate: 0,
    xp: picked.reduce((s, t, i) => s + (tasks[i].status === "clear" ? t.baseXp : 0), 0),
  };
  totals.estimate = estimateTotal(totals.materialCost, totals.laborCost);
  // aggregate shortages across blocked tasks
  const need: Record<string, number> = {};
  short.forEach((t) => {
    Object.entries(t.gaps).forEach(([k, v]) => {
      need[k] = (need[k] ?? 0) + (v as number);
    });
  });
  const shortages = Object.entries(need).map(([k, needV]) => ({
    item: k as keyof Inventory,
    need: needV,
    have: inv[k as keyof Inventory],
  }));
  void ITEM_LABEL;
  return { tasks, sequence: [...clear.map((t) => t.id), ...short.map((t) => t.id)], totals, shortages };
}

export const ITEMS: { key: keyof Inventory; label: string }[] = [
  { key: "cementBags", label: "Cement bags" },
  { key: "waterLitres", label: "Water (L)" },
  { key: "aggregateKg", label: "Aggregate (kg)" },
  { key: "dieselLitres", label: "Diesel (L)" },
  { key: "crew", label: "Crew on site" },
];
