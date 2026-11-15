import { describe, expect, it } from 'vitest';
import { formatDateYyyymmdd, getFormattedDates } from '../../src/domain/date';

describe('domain/date', () => {
  describe('formatDateYyyymmdd', () => {
    it('zero-pads single-digit months and days', () => {
      // Arrange
      const date = new Date(2026, 0, 5); // 2026-01-05

      // Act
      const formatted = formatDateYyyymmdd(date);

      // Assert
      expect(formatted).toBe('20260105');
    });
  });

  describe('getFormattedDates', () => {
    it('returns today, yesterday, and tomorrow for a regular date', () => {
      // Arrange
      const now = new Date(2026, 10, 15, 21, 0, 0); // 2026-11-15

      // Act
      const dates = getFormattedDates(now);

      // Assert
      expect(dates).toEqual({
        today: '20261115',
        yesterday: '20261114',
        tomorrow: '20261116',
      });
    });

    it('handles month, year, and leap-year boundaries correctly', () => {
      // Arrange
      const yearEnd = new Date(2026, 11, 31); // 2026-12-31
      const leapDay = new Date(2024, 1, 29); // 2024-02-29

      // Act
      const yearEndDates = getFormattedDates(yearEnd);
      const leapDayDates = getFormattedDates(leapDay);

      // Assert
      expect(yearEndDates).toEqual({
        today: '20261231',
        yesterday: '20261230',
        tomorrow: '20270101',
      });
      expect(leapDayDates).toEqual({
        today: '20240229',
        yesterday: '20240228',
        tomorrow: '20240301',
      });
    });
  });
});
