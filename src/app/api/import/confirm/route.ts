import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recomputeSummary } from "@/app/api/expenses/route";
import { similarity } from "@/lib/itemMapper";

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

    const result = { categoriesAdded: 0, totalCost: 0, unitsAdded: 0, cardsAdded: 0 };

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
      // Card quantities ARE the stock now — the stored row is only for manual adjustments,
      // so imports write cards and leave stored counts untouched (no double counting).
      result.unitsAdded = units;

      // Showcase each item as a real utility card, filed into the best column
      const columns = await prisma.taskColumn.findMany({ orderBy: { position: "asc" } });
      if (columns.length > 0) {
        const today = new Date().toLocaleDateString();
        for (const r of clean) {
          let best = columns[columns.length - 1];
          let bestScore = -1;
          for (const c of columns) {
            const s = similarity(r.name, c.title);
            if (s > bestScore) {
              bestScore = s;
              best = c;
            }
          }
          const colCount = await prisma.taskCard.count({ where: { columnId: best.id } });
          await prisma.taskCard.create({
            data: {
              columnId: best.id,
              projectId,
              title: r.name,
              desc: r.qty > 0 ? `${r.qty} units @ $${r.amount.toLocaleString()} each` : `$${r.amount.toLocaleString()} each`,
              qty: r.qty,
              date: today,
              level: r.qty === 0 ? "Critical" : r.qty <= 10 ? "Low" : "Plenty",
              type: best.title.split(" ")[0] ?? "Utility",
              position: colCount,
            },
          });
          result.cardsAdded += 1;
        }
      }
    }

    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    console.error("import confirm error:", e);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
