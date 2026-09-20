import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const projectId = new URL(req.url).searchParams.get("projectId");
  const items = await prisma.downloadHistory.findMany({
    where: projectId ? { projectId } : {},
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const filename = String(body.filename ?? "").slice(0, 200);
  if (!filename) return NextResponse.json({ error: "filename required" }, { status: 400 });
  const projectId = typeof body.projectId === "string" && body.projectId ? body.projectId : null;
  const item = await prisma.downloadHistory.create({
    data: { filename, projectId, kind: String(body.kind ?? "utility-stock").slice(0, 40) },
  });
  return NextResponse.json(item, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const projectId = new URL(req.url).searchParams.get("projectId");
  await prisma.downloadHistory.deleteMany({ where: projectId ? { projectId } : {} });
  return NextResponse.json({ ok: true });
}
