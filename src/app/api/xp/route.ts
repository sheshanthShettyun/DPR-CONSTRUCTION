import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applyXp, thresholdFor } from "@/lib/xp";

async function getState() {
  let state = await prisma.playerState.findFirst({ orderBy: { id: "asc" } });
  if (!state) {
    state = await prisma.playerState.create({ data: { level: 1, xp: 0, streakDays: 0 } });
  }
  return state;
}

export async function GET() {
  const state = await getState();
  const threshold = thresholdFor(state.level);
  return NextResponse.json({
    level: state.level,
    xp: state.xp,
    streakDays: state.streakDays,
    threshold,
    progress: threshold > 0 ? Math.min(100, Math.round((state.xp / threshold) * 100)) : 0,
  }, {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=2, stale-while-revalidate=15",
    },
  });
}

export async function POST(req: NextRequest) {
  const { delta } = await req.json();
  const amount = Number(delta);
  if (!Number.isFinite(amount) || amount === 0) {
    return NextResponse.json({ error: "Provide a non-zero XP delta" }, { status: 400 });
  }
  const state = await getState();
  const next = applyXp({ level: state.level, xp: state.xp }, Math.trunc(amount));
  const updated = await prisma.playerState.update({
    where: { id: state.id },
    data: { level: next.level, xp: next.xp },
  });
  return NextResponse.json({
    level: updated.level,
    xp: updated.xp,
    streakDays: updated.streakDays,
    threshold: next.threshold,
    leveledUp: next.leveledUp,
  });
}
