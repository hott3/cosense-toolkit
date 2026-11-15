export const INTERACTIVE_SELECTOR =
  '.grid li, .page-list .grid-item, .navbar-brand, .navbar a, .dropdown-menu a, .page-menu-item';
export const ANIMATION_CLASS = 'animate-surface-tension';

/**
 * Find the closest interactive element eligible for surface-tension animation.
 */
export function findInteractiveTarget(target: EventTarget | null): HTMLElement | null {
  if (!target || typeof (target as Element).closest !== 'function') {
    return null;
  }
  return (target as Element).closest<HTMLElement>(INTERACTIVE_SELECTOR);
}
