export const XP_PER_OBJECTIVE = 20;
export const BASE_LEVEL_XP = 100;
export const LEVEL_GROWTH = 1.1;
export const MAX_LEVEL = 50;

/** XP needed to go from `level` to `level + 1`. Grows 10% per level from a 100 base. */
export function thresholdFor(level: number): number {
  return Math.round(BASE_LEVEL_XP * Math.pow(LEVEL_GROWTH, Math.max(0, level - 1)));
}

/** Apply an XP delta. Levels up (carrying remainder), never de-levels, XP floors at 0. */
export function applyXp(state: { level: number; xp: number }, delta: number) {
  let { level, xp } = state;
  xp += delta;
  if (xp < 0) xp = 0;
  let leveledUp = false;
  while (level < MAX_LEVEL && xp >= thresholdFor(level)) {
    xp -= thresholdFor(level);
    level += 1;
    leveledUp = true;
  }
  return { level, xp, leveledUp, threshold: thresholdFor(level) };
}
