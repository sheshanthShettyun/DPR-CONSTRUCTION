import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const intake = await prisma.projectIntake.findUnique({
    where: { id },
    include: {
      risks: { orderBy: { position: "asc" } },
      milestones: { orderBy: { position: "asc" } },
    },
  });
  if (!intake) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(intake);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.projectIntake.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
