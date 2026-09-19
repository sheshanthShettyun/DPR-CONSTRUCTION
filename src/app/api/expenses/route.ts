import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function buildStats(categories: { id: number; amount: number; changeAmount: number }[]) {
  if (categories.length === 0) return null;
  const largest = categories.reduce((a, b) => (b.amount > a.amount ? b : a));
  // Exclude the largest pick so stat boxes never duplicate a category
  const pool = categories.length > 1 ? categories.filter((c) => c.id !== largest.id) : categories;
  return {
    largest,
    smallest: pool.reduce((a, b) => (b.amount < a.amount ? b : a)),
    mostVolatile: pool.reduce((a, b) => (b.changeAmount > a.changeAmount ? b : a)),
    mostStable: pool.reduce((a, b) => (b.changeAmount < a.changeAmount ? b : a)),
  };
}

export async function recomputeSummary() {
  const categories = await prisma.expenseCategory.findMany();
  const total = categories.reduce((s, c) => s + c.amount, 0);
  await Promise.all(
    categories.map((c) =>
      prisma.expenseCategory.update({
        where: { id: c.id },
        data: { pct: total > 0 ? Math.round((c.amount / total) * 1000) / 10 : 0 },
      })
    )
  );
  const summary = await prisma.expenseSummary.findFirst({ orderBy: { updatedAt: "desc" } });
  if (summary) {
    await prisma.expenseSummary.update({ where: { id: summary.id }, data: { totalSpent: total } });
  }
}

export async function GET() {
  const [categories, summary] = await Promise.all([
    prisma.expenseCategory.findMany({ orderBy: { position: "asc" } }),
    prisma.expenseSummary.findFirst({ orderBy: { updatedAt: "desc" } }),
  ]);

  const stats = buildStats(categories);
  const byId = new Map(categories.map((c) => [c.id, c]));
  const resolve = (s: { id: number } | null) => (s ? byId.get(s.id) ?? null : null);

  return NextResponse.json({
    categories,
    summary,
    stats: stats
      ? {
          largest: resolve(stats.largest),
          smallest: resolve(stats.smallest),
          mostVolatile: resolve(stats.mostVolatile),
          mostStable: resolve(stats.mostStable),
        }
      : null,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const count = await prisma.expenseCategory.count();
  const category = await prisma.expenseCategory.create({
    data: {
      name: String(body.name ?? "New category").slice(0, 60),
      amount: Math.max(0, Number(body.amount) || 0),
      pct: 0,
      color: "bg-[#8c8c8c]",
      icon: "Package",
      changeAmount: 0,
      position: count,
    },
  });
  await recomputeSummary();
  return NextResponse.json(category, { status: 201 });
}
