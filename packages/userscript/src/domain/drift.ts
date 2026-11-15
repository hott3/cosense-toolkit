export type DriftSpeed = 'slow' | 'normal' | 'fast';

export const BASE_POOL_DURATIONS_SEC = [22, 26, 16] as const;
export const DEFAULT_POOL_DURATION_SEC = 20;

const DRIFT_SPEED_FACTORS: Readonly<Record<DriftSpeed, number>> = {
  slow: 1.6,
  normal: 1.0,
  fast: 0.6,
};

/**
 * Return the duration multiplier for a given drift speed name.
 */
export function getDriftFactor(speed: string): number {
  return speed in DRIFT_SPEED_FACTORS
    ? DRIFT_SPEED_FACTORS[speed as DriftSpeed]
    : DRIFT_SPEED_FACTORS.normal;
}

/**
 * Compute the CSS animation duration string for a specific ambient fluid pool.
 */
export function calcDriftDurationSec(poolIndex: number, speed: string): string {
  const baseSec = BASE_POOL_DURATIONS_SEC[poolIndex] ?? DEFAULT_POOL_DURATION_SEC;
  const factor = getDriftFactor(speed);
  return `${(baseSec * factor).toFixed(1)}s`;
}
