import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(
    projects.map((p) => ({ ...p, modules: JSON.parse(p.modulesJson) }))
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { modules, ...rest } = body;
  const project = await prisma.project.create({
    data: { ...rest, modulesJson: JSON.stringify(modules ?? []) },
  });
  return NextResponse.json({ ...project, modules: JSON.parse(project.modulesJson) }, { status: 201 });
}
