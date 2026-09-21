import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(
    projects.map((p) => ({ ...p, modules: JSON.parse(p.modulesJson) }))
  );
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const body = await req.json();
  const { modules, ...rest } = body;
  const project = await prisma.project.create({
    data: { ...rest, userId: user.id, modulesJson: JSON.stringify(modules ?? []) },
  });
  return NextResponse.json({ ...project, modules: JSON.parse(project.modulesJson) }, { status: 201 });
}
