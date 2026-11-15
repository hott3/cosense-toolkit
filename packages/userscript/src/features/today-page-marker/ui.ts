import { onPageChanged } from '../../infrastructure/api/cosense';
import { TODAY_PAGE_CLASS, buildTodayPageSelector } from './logic';

/**
 * Find today's daily journal card within `root` and apply the marker class when present.
 */
export function markTodayPage(now?: Date, root: ParentNode = document): boolean {
  const targetCard = root.querySelector(buildTodayPageSelector(now));
  if (!targetCard) {
    return false;
  }

  targetCard.classList.add(TODAY_PAGE_CLASS);
  return true;
}

/**
 * Mark today's page card immediately and re-apply whenever Cosense emits `page:changed`.
 */
export function initTodayPageMarker(nowProvider: () => Date = () => new Date()): void {
  markTodayPage(nowProvider());
  onPageChanged(() => {
    markTodayPage(nowProvider());
  });
}
