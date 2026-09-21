import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { makeOtp, hashOtp, sendOtpEmail, isValidEmail } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const normalized = String(email ?? "").trim().toLowerCase();
  if (!isValidEmail(normalized)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user) return NextResponse.json({ error: "No account found for this email" }, { status: 404 });
  if (user.verified) {
    return NextResponse.json({ error: "Account already verified. Please log in." }, { status: 409 });
  }
  await prisma.otpCode.deleteMany({ where: { userId: user.id } });
  const code = makeOtp();
  await prisma.otpCode.create({
    data: { userId: user.id, codeHash: hashOtp(code), expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
  });
  const { delivered } = await sendOtpEmail(normalized, user.firstName, code);
  return NextResponse.json({ ok: true, emailed: delivered });
}
