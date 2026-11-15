import { getFormattedDates } from '../../domain/date';

export const TODAY_PAGE_CLASS = 'today-page';

/**
 * Build the Cosense daily journal page title (`日報 YYYYMMDD`) for the given date.
 */
export function buildTodayPageTitle(now?: Date): string {
  return `日報 ${getFormattedDates(now).today}`;
}

/**
 * Build the DOM selector targeting the daily journal page card for the given date.
 */
export function buildTodayPageSelector(now?: Date): string {
  return `[data-page-title="${buildTodayPageTitle(now)}"]`;
}
