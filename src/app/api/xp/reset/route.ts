import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  let state = await prisma.playerState.findFirst({ orderBy: { id: "asc" } });
  if (state) {
    state = await prisma.playerState.update({
      where: { id: state.id },
      data: { level: 1, xp: 0, streakDays: 0 },
    });
  } else {
    state = await prisma.playerState.create({ data: { level: 1, xp: 0, streakDays: 0 } });
  }
  return NextResponse.json({ level: state.level, xp: state.xp, streakDays: state.streakDays });
}
