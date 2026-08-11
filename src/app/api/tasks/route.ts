import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const columns = await prisma.taskColumn.findMany({
    include: { cards: { orderBy: { position: "asc" } } },
    orderBy: { position: "asc" },
  });
  return NextResponse.json(columns);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { columnId, ...rest } = body;
  const count = await prisma.taskCard.count({ where: { columnId } });
  const card = await prisma.taskCard.create({
    data: { ...rest, columnId, position: count },
  });
  return NextResponse.json(card, { status: 201 });
}
