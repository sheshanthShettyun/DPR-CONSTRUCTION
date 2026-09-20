import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const projectId = new URL(req.url).searchParams.get("projectId");
  const stock = await prisma.utilityStock.findFirst({
    where: projectId ? { projectId } : {},
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(stock);
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
