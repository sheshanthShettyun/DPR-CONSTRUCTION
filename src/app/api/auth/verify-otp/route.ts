import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";
import { hashOtp, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();
  const normalized = String(email ?? "").trim().toLowerCase();
  const digits = String(code ?? "").replace(/\D/g, "");

  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user) return NextResponse.json({ error: "No account found for this email" }, { status: 404 });

  const otp = await prisma.otpCode.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  if (!otp) return NextResponse.json({ error: "No code requested. Please sign up again." }, { status: 400 });
  if (otp.expiresAt < new Date()) {
    await prisma.otpCode.delete({ where: { id: otp.id } });
    return NextResponse.json({ error: "Code expired. Please request a new one." }, { status: 400 });
  }
  if (otp.attempts >= 5) {
    await prisma.otpCode.delete({ where: { id: otp.id } });
    return NextResponse.json({ error: "Too many attempts. Please request a new code." }, { status: 429 });
  }

  const a = Buffer.from(otp.codeHash, "hex");
  const b = Buffer.from(hashOtp(digits), "hex");
  const match = a.length === b.length && timingSafeEqual(a, b);
  if (!match) {
    await prisma.otpCode.update({ where: { id: otp.id }, data: { attempts: otp.attempts + 1 } });
    return NextResponse.json({ error: "Incorrect code. Try again." }, { status: 400 });
  }

  await prisma.otpCode.deleteMany({ where: { userId: user.id } });
  await prisma.user.update({ where: { id: user.id }, data: { verified: true } });
  await createSession(user.id);
  return NextResponse.json({ ok: true, firstName: user.firstName });
}
