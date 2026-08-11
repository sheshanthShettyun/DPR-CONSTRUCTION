import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { s3, S3_BUCKET } from "@/lib/s3";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const entityType = formData.get("entityType") as string;
  const entityId = formData.get("entityId") as string;

  if (!file || !entityType || !entityId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const s3Key = `${entityType}/${entityId}/${Date.now()}-${file.name}`;

  await s3.send(new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: s3Key,
    Body: buffer,
    ContentType: file.type,
  }));

  const doc = await prisma.document.create({
    data: {
      filename: file.name,
      s3Key,
      contentType: file.type,
      size: file.size,
      entityType,
      entityId,
    },
  });

  return NextResponse.json(doc, { status: 201 });
}
