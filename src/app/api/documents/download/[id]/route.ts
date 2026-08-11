import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { s3, S3_BUCKET } from "@/lib/s3";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const url = await getSignedUrl(s3, new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: doc.s3Key,
  }), { expiresIn: 3600 });

  return NextResponse.json({ url, filename: doc.filename, contentType: doc.contentType });
}
