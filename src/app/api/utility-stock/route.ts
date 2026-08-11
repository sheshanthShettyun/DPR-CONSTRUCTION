import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const stock = await prisma.utilityStock.findFirst({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(stock);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const existing = await prisma.utilityStock.findFirst({ orderBy: { updatedAt: "desc" } });
  if (!existing) {
    const created = await prisma.utilityStock.create({ data: body });
    return NextResponse.json(created);
  }
  const updated = await prisma.utilityStock.update({
    where: { id: existing.id },
    data: body,
  });
  return NextResponse.json(updated);
}
