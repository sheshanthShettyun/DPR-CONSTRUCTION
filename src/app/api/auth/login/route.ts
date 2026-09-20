import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession, isValidEmail } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const normalized = String(email ?? "").trim().toLowerCase();

  if (!isValidEmail(normalized)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user || !verifyPassword(String(password ?? ""), user.passwordHash)) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  if (!user.verified) {
    return NextResponse.json({ error: "Account not verified. Please sign up again to receive a code." }, { status: 403 });
  }
  await createSession(user.id);
  return NextResponse.json({ ok: true, firstName: user.firstName });
}
