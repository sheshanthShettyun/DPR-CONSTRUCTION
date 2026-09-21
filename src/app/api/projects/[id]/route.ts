import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

async function owned(id: string) {
  const user = await getSessionUser();
  if (!user) return { error: NextResponse.json({ error: "Not signed in" }, { status: 401 }) };
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return { error: NextResponse.json({ error: "Not found" }, { status: 404 }) };
  if (project.userId && project.userId !== user.id) {
    return { error: NextResponse.json({ error: "Not your project" }, { status: 403 }) };
  }
  return { project, user };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await owned(id);
  if (res.error) return res.error;
  const project = res.project!;
  return NextResponse.json({ ...project, modules: JSON.parse(project.modulesJson) });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await owned(id);
  if (res.error) return res.error;
  const body = await req.json();
  const { modules, userId: _ignored, ...rest } = body;
  const project = await prisma.project.update({
    where: { id },
    data: { ...rest, ...(modules ? { modulesJson: JSON.stringify(modules) } : {}) },
  });
  return NextResponse.json({ ...project, modules: JSON.parse(project.modulesJson) });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await owned(id);
  if (res.error) return res.error;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
