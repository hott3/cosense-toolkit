import {
  addPageMenuItem,
  getCurrentPageTitle,
  insertLineAtEnd,
} from '../../infrastructure/api/cosense';
import { SEARCH_TOOL_DEFINITIONS } from './logic';

/**
 * Register external search actions in the Scrapbox/Cosense PageMenu.
 */
export function initSearchTools(): number {
  let registeredCount = 0;

  for (const tool of SEARCH_TOOL_DEFINITIONS) {
    const registered = addPageMenuItem({
      title: tool.title,
      image: tool.image,
      onClick: () => {
        const pageTitle = getCurrentPageTitle();
        if (!pageTitle) {
          return;
        }

        if (tool.buildCitationLines) {
          for (const line of tool.buildCitationLines(pageTitle)) {
            insertLineAtEnd(line);
          }
        }

        if (typeof window !== 'undefined') {
          window.open(tool.buildUrl(pageTitle));
        }
      },
    });

    if (registered) {
      registeredCount += 1;
    }
  }

  return registeredCount;
}
