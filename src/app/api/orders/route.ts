import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const projectId = new URL(req.url).searchParams.get("projectId");
  const orders = await prisma.order.findMany({
    where: projectId ? { projectId } : {},
    include: { stages: { orderBy: { position: "asc" } } },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(orders, {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=2, stale-while-revalidate=15",
    },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { stages, projectId: rawPid, ...rest } = body;
  const projectId = typeof rawPid === "string" && rawPid ? rawPid : null;
  const order = await prisma.order.create({
    data: {
      ...rest,
      projectId,
      stages: stages
        ? { create: stages.map((s: { label: string; time: string; done?: boolean; active?: boolean }, i: number) => ({ ...s, position: i })) }
        : undefined,
    },
    include: { stages: { orderBy: { position: "asc" } } },
  });
  return NextResponse.json(order, { status: 201 });
}
