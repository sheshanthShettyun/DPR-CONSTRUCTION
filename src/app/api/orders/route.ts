import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { stages: { orderBy: { position: "asc" } } },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { stages, ...rest } = body;
  const order = await prisma.order.create({
    data: {
      ...rest,
      stages: stages
        ? { create: stages.map((s: { label: string; time: string; done?: boolean; active?: boolean }, i: number) => ({ ...s, position: i })) }
        : undefined,
    },
    include: { stages: { orderBy: { position: "asc" } } },
  });
  return NextResponse.json(order, { status: 201 });
}
