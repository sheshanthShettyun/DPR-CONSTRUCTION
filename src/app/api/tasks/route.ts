import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const projectId = new URL(req.url).searchParams.get("projectId");
  const columns = await prisma.taskColumn.findMany({
    include: {
      cards: {
        where: projectId ? { projectId } : {},
        orderBy: { position: "asc" },
      },
    },
    orderBy: { position: "asc" },
  });
  return NextResponse.json(columns);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { columnId, projectId: rawPid, ...rest } = body;
  const projectId = typeof rawPid === "string" && rawPid ? rawPid : null;
  const count = await prisma.taskCard.count({ where: { columnId } });
  const card = await prisma.taskCard.create({
    data: { ...rest, columnId, projectId, position: count },
  });
  return NextResponse.json(card, { status: 201 });
}
