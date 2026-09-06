import { NextRequest, NextResponse } from "next/server";
import { optimizePlan, RECIPES, type Inventory } from "@/lib/dprOptimizer";

export async function GET() {
  return NextResponse.json(
    RECIPES.map((r) => ({
      id: r.id,
      title: r.title,
      equipment: r.equipment,
      needs: r.needs,
      baseXp: r.baseXp,
    }))
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const taskIds: string[] = body.taskIds ?? [];
  const inventory: Inventory = body.inventory ?? {
    cementBags: 0,
    waterLitres: 0,
    aggregateKg: 0,
    dieselLitres: 0,
    crew: 0,
  };
  return NextResponse.json(optimizePlan(taskIds, inventory));
}
