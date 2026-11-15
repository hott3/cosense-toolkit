export interface FormattedDates {
  readonly today: string;
  readonly yesterday: string;
  readonly tomorrow: string;
}

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

/**
 * Format a Date instance into `YYYYMMDD` using local calendar fields.
 */
export function formatDateYyyymmdd(date: Date): string {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  return `${year}${month}${day}`;
}

/**
 * Compute `today`, `yesterday`, and `tomorrow` date strings in `YYYYMMDD` format.
 */
export function getFormattedDates(now: Date = new Date()): FormattedDates {
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const yesterday = new Date(base);
  yesterday.setDate(base.getDate() - 1);

  const tomorrow = new Date(base);
  tomorrow.setDate(base.getDate() + 1);

  return {
    today: formatDateYyyymmdd(base),
    yesterday: formatDateYyyymmdd(yesterday),
    tomorrow: formatDateYyyymmdd(tomorrow),
  };
}
