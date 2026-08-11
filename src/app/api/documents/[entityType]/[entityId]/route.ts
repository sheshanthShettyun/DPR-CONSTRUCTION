import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ entityType: string; entityId: string }> }
) {
  const { entityType, entityId } = await params;

  const docs = await prisma.document.findMany({
    where: { entityType, entityId },
    orderBy: { uploadedAt: "desc" },
  });

  return NextResponse.json(docs);
}
