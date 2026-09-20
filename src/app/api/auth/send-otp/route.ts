import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, makeOtp, hashOtp, sendOtpEmail, isValidEmail } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, password } = await req.json();

  if (!firstName?.trim() || !lastName?.trim()) {
    return NextResponse.json({ error: "First and last name are required" }, { status: 400 });
  }
  if (!isValidEmail(String(email ?? ""))) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }
  if (String(password ?? "").length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const normalized = String(email).trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (existing?.verified) {
    return NextResponse.json({ error: "Account already exists. Please log in." }, { status: 409 });
  }

  const user =
    existing ??
    (await prisma.user.create({
      data: {
        firstName: String(firstName).trim().slice(0, 60),
        lastName: String(lastName).trim().slice(0, 60),
        email: normalized,
        passwordHash: hashPassword(String(password)),
      },
    }));

  if (existing && !existing.verified) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        firstName: String(firstName).trim().slice(0, 60),
        lastName: String(lastName).trim().slice(0, 60),
        passwordHash: hashPassword(String(password)),
      },
    });
  }

  await prisma.otpCode.deleteMany({ where: { userId: user.id } });
  const code = makeOtp();
  await prisma.otpCode.create({
    data: { userId: user.id, codeHash: hashOtp(code), expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
  });

  const { delivered } = await sendOtpEmail(normalized, user.firstName, code);
  return NextResponse.json({ ok: true, emailed: delivered });
}
