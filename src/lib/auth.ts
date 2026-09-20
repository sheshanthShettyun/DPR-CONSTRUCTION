import { randomBytes, scryptSync, timingSafeEqual, createHash } from "crypto";
import nodemailer from "nodemailer";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "dpr_session";
const SESSION_DAYS = 30;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(derived, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export function makeOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function hashOtp(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

async function sendGmail(to: string, subject: string, text: string) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    console.log(`[auth] no Gmail creds — OTP for ${to}: ${text}`);
    return { delivered: false };
  }
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  await transport.sendMail({ from: `DPR Construction <${user}>`, to, subject, text });
  return { delivered: true };
}

export async function sendOtpEmail(to: string, firstName: string, code: string) {
  return sendGmail(
    to,
    "Your DPR Construction verification code",
    `Hi ${firstName},\n\nYour verification code is: ${code}\n\nIt expires in 10 minutes. If you didn't request this, you can ignore this email.\n\n— DPR Construction`
  );
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await prisma.session.create({ data: { id: token, userId, expiresAt } });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  return token;
}

export async function getSessionUser() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { id: token },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date()) {
    if (session) await prisma.session.delete({ where: { id: token } }).catch(() => {});
    return null;
  }
  return session.user;
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await prisma.session.delete({ where: { id: token } }).catch(() => {});
  store.delete(SESSION_COOKIE);
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
