import { addPageMenuItem, insertLineAtEnd } from '../../infrastructure/api/cosense';
import { buildPageTemplates } from './logic';

/**
 * Register Scrapbox page template generators in the PageMenu.
 */
export function initPageTemplates(now?: Date): number {
  const templates = buildPageTemplates(now);
  let registeredCount = 0;

  for (const template of templates) {
    const registered = addPageMenuItem({
      title: () => template.menuTitle,
      onClick: () => {
        for (const line of template.lines) {
          insertLineAtEnd(line);
        }
      },
    });

    if (registered) {
      registeredCount += 1;
    }
  }

  return registeredCount;
}
