import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export interface StockItem {
  title: string;
  qty: number;
  level: string;
}

export async function getStockSummary(projectId?: string | null) {
  const where = projectId ? { projectId } : {};
  const [cards, stored] = await Promise.all([
    prisma.taskCard.findMany({ where, select: { title: true, qty: true, level: true } }),
    prisma.utilityStock.findFirst({ where, orderBy: { updatedAt: "desc" } }),
  ]);
  const q = (c: { qty: number }) => c.qty || 0;
  const isLow = (c: { level: string }) => c.level === "Low" || c.level === "Critical";
  const cardTotal = cards.reduce((s, c) => s + q(c), 0);
  const cardLow = cards.filter(isLow).reduce((s, c) => s + q(c), 0);
  const lowItems: StockItem[] = cards
    .filter(isLow)
    .sort((a, b) => q(a) - q(b))
    .slice(0, 3)
    .map((c) => ({ title: c.title, qty: q(c), level: c.level }));
  const topItems: StockItem[] = cards
    .filter((c) => !isLow(c) && q(c) > 0)
    .sort((a, b) => q(b) - q(a))
    .slice(0, 3)
    .map((c) => ({ title: c.title, qty: q(c), level: c.level }));
  return {
    totalItems: cardTotal + (stored?.totalItems ?? 0),
    available: cardTotal - cardLow + (stored?.available ?? 0),
    lowStock: cardLow + (stored?.lowStock ?? 0),
    unassigned: stored?.available ?? 0,
    lowItems,
    topItems,
  };
}

export async function GET(req: NextRequest) {
  const projectId = new URL(req.url).searchParams.get("projectId");
  return NextResponse.json(await getStockSummary(projectId), {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=2, stale-while-revalidate=15",
    },
  });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { projectId: rawPid, ...rest } = body;
  const projectId = typeof rawPid === "string" && rawPid ? rawPid : null;
  const where = projectId ? { projectId } : {};
  const existing = await prisma.utilityStock.findFirst({ where, orderBy: { updatedAt: "desc" } });
  if (!existing) {
    const created = await prisma.utilityStock.create({ data: { ...rest, projectId } });
    return NextResponse.json(created);
  }
  const updated = await prisma.utilityStock.update({
    where: { id: existing.id },
    data: rest,
  });
  return NextResponse.json(updated);
}
