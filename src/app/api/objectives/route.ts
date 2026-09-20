import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const projectId = new URL(req.url).searchParams.get("projectId");
  const objectives = await prisma.objective.findMany({
    where: projectId ? { projectId } : {},
    orderBy: { position: "asc" },
  });
  return NextResponse.json(objectives);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const projectId = typeof body.projectId === "string" && body.projectId ? body.projectId : null;
  const count = await prisma.objective.count({ where: projectId ? { projectId } : {} });
  const objective = await prisma.objective.create({
    data: { ...body, projectId, position: count },
  });
  return NextResponse.json(objective, { status: 201 });
}
