import { buildThemeCssHref, type ThemeDefinition } from '../../domain/theme';

export const THEME_ATTRIBUTE = 'data-cosense-theme';
export const THEME_LINK_ID = 'cosense-dynamic-theme-css';

/**
 * Set the active theme attribute on `document.documentElement`.
 */
export function applyThemeAttribute(themeId: string): void {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, themeId);
}

/**
 * Synchronize the external stylesheet `<link>` element for themes not preloaded in settings.
 */
export function syncThemeStylesheetLink(theme: ThemeDefinition): void {
  let linkEl = document.getElementById(THEME_LINK_ID) as HTMLLinkElement | null;
  if (theme.preloadedInSettings) {
    linkEl?.remove();
    return;
  }

  const href = buildThemeCssHref(theme);
  if (!linkEl) {
    linkEl = document.createElement('link');
    linkEl.id = THEME_LINK_ID;
    linkEl.rel = 'stylesheet';
    document.head.appendChild(linkEl);
  }

  if (linkEl.getAttribute('href') !== href) {
    linkEl.setAttribute('href', href);
  }
}
