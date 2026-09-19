import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recomputeSummary } from "@/app/api/expenses/route";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const data: { name?: string; amount?: number; changeAmount?: number } = {};
  if (body.name !== undefined) data.name = String(body.name).slice(0, 60);
  if (body.amount !== undefined) data.amount = Math.max(0, Number(body.amount) || 0);
  if (body.changeAmount !== undefined) data.changeAmount = Number(body.changeAmount) || 0;
  const category = await prisma.expenseCategory.update({ where: { id: Number(id) }, data });
  await recomputeSummary();
  return NextResponse.json(category);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.expenseCategory.delete({ where: { id: Number(id) } });
  await recomputeSummary();
  return NextResponse.json({ ok: true });
}
