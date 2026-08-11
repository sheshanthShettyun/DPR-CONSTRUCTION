import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [categories, summary] = await Promise.all([
    prisma.expenseCategory.findMany({ orderBy: { position: "asc" } }),
    prisma.expenseSummary.findFirst({ orderBy: { updatedAt: "desc" } }),
  ]);

  const stats =
    categories.length > 0
      ? {
          largest: categories.reduce((a, b) => (b.amount > a.amount ? b : a)),
          smallest: categories.reduce((a, b) => (b.amount < a.amount ? b : a)),
          mostVolatile: categories.reduce((a, b) => (b.changeAmount > a.changeAmount ? b : a)),
          mostStable: categories.reduce((a, b) => (b.changeAmount < a.changeAmount ? b : a)),
        }
      : null;

  return NextResponse.json({ categories, summary, stats });
}
