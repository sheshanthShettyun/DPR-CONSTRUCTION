import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recomputeSummary } from "@/app/api/expenses/route";

interface ImportRow {
  name: string;
  amount: number;
  qty: number;
  categoryId?: number | null;
}

export async function POST(req: NextRequest) {
  try {
    const { rows, targets, projectId: rawPid } = (await req.json()) as {
      rows: ImportRow[];
      targets: { expenses: boolean; stock: boolean };
      projectId?: string | null;
    };
    const projectId = typeof rawPid === "string" && rawPid ? rawPid : null;

    const clean = (Array.isArray(rows) ? rows : [])
      .map((r) => ({
        name: String(r.name ?? "").trim().slice(0, 60),
        amount: Math.max(0, Number(r.amount) || 0),
        qty: Math.max(0, Math.floor(Number(r.qty) || 0)),
        categoryId: Number(r.categoryId) || null,
      }))
      .filter((r) => r.name && (r.amount > 0 || r.qty > 0));

    if (clean.length === 0) {
      return NextResponse.json({ error: "No valid rows to import" }, { status: 400 });
    }
    if (!targets?.expenses && !targets?.stock) {
      return NextResponse.json({ error: "Choose at least one destination" }, { status: 400 });
    }

    const result = { categoriesAdded: 0, totalCost: 0, unitsAdded: 0 };

    if (targets.expenses) {
      const count = await prisma.expenseCategory.count({ where: projectId ? { projectId } : {} });
      let pos = count;
      for (const r of clean) {
        const lineTotal = r.qty > 0 ? r.amount * r.qty : r.amount;
        if (r.categoryId) {
          const existing = await prisma.expenseCategory.findUnique({ where: { id: r.categoryId } });
          if (existing) {
            await prisma.expenseCategory.update({
              where: { id: existing.id },
              data: { amount: existing.amount + lineTotal, changeAmount: existing.changeAmount + lineTotal },
            });
            result.totalCost += lineTotal;
            continue;
          }
        }
        await prisma.expenseCategory.create({
          data: {
            projectId,
            name: r.name,
            amount: lineTotal,
            pct: 0,
            color: "bg-[#8c8c8c]",
            icon: "Package",
            changeAmount: 0,
            position: pos++,
          },
        });
        result.categoriesAdded += 1;
        result.totalCost += lineTotal;
      }
      await recomputeSummary(projectId);
    }

    if (targets.stock) {
      const units = clean.reduce((s, r) => s + r.qty, 0);
      const where = projectId ? { projectId } : {};
      const existing = await prisma.utilityStock.findFirst({ where, orderBy: { updatedAt: "desc" } });
      if (existing) {
        await prisma.utilityStock.update({
          where: { id: existing.id },
          data: { totalItems: existing.totalItems + units, available: existing.available + units },
        });
      } else {
        await prisma.utilityStock.create({ data: { projectId, totalItems: units, available: units, lowStock: 0 } });
      }
      result.unitsAdded = units;
    }

    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    console.error("import confirm error:", e);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
