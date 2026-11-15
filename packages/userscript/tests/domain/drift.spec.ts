import { describe, expect, it } from 'vitest';
import {
  BASE_POOL_DURATIONS_SEC,
  DEFAULT_POOL_DURATION_SEC,
  calcDriftDurationSec,
  getDriftFactor,
} from '../../src/domain/drift';

describe('domain/drift', () => {
  describe('getDriftFactor', () => {
    it('maps known drift speeds to their multipliers and falls back to 1.0', () => {
      // Arrange & Act
      const slow = getDriftFactor('slow');
      const normal = getDriftFactor('normal');
      const fast = getDriftFactor('fast');
      const unknown = getDriftFactor('unknown-speed');

      // Assert
      expect(slow).toBe(1.6);
      expect(normal).toBe(1.0);
      expect(fast).toBe(0.6);
      expect(unknown).toBe(1.0);
    });
  });

  describe('calcDriftDurationSec', () => {
    it('calculates duration strings for each pool index and drift speed', () => {
      // Arrange
      const speed = 'fast';

      // Act
      const pool0 = calcDriftDurationSec(0, speed);
      const pool1 = calcDriftDurationSec(1, speed);
      const pool2 = calcDriftDurationSec(2, speed);

      // Assert
      expect(pool0).toBe(`${(BASE_POOL_DURATIONS_SEC[0] * 0.6).toFixed(1)}s`);
      expect(pool1).toBe(`${(BASE_POOL_DURATIONS_SEC[1] * 0.6).toFixed(1)}s`);
      expect(pool2).toBe(`${(BASE_POOL_DURATIONS_SEC[2] * 0.6).toFixed(1)}s`);
    });

    it('uses DEFAULT_POOL_DURATION_SEC when pool index is out of range', () => {
      // Arrange
      const outOfRangeIndex = 99;

      // Act
      const duration = calcDriftDurationSec(outOfRangeIndex, 'slow');

      // Assert
      expect(duration).toBe(`${(DEFAULT_POOL_DURATION_SEC * 1.6).toFixed(1)}s`);
    });
  });
});
