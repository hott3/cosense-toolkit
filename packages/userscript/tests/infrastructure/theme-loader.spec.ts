import { beforeEach, describe, expect, it } from 'vitest';
import { resolveTheme, USERCSS_TAG } from '../../src/domain/theme';
import {
  THEME_ATTRIBUTE,
  THEME_LINK_ID,
  applyThemeAttribute,
  syncThemeStylesheetLink,
} from '../../src/infrastructure/api/theme-loader';

describe('infrastructure/api/theme-loader', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
  });

  it('sets data-hot3-theme attribute on documentElement', () => {
    applyThemeAttribute('frosted-daylight');
    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('frosted-daylight');
  });

  it('creates/updates stylesheet link for dynamic themes and removes it for preloaded themes', () => {
    const daylight = resolveTheme('frosted-daylight');
    const clean = resolveTheme('modern-clean');
    const glass = resolveTheme('optical-glass');

    syncThemeStylesheetLink(daylight);
    const linkAfterDaylight = document.getElementById(THEME_LINK_ID) as HTMLLinkElement | null;
    expect(linkAfterDaylight).not.toBeNull();
    expect(linkAfterDaylight?.rel).toBe('stylesheet');
    expect(linkAfterDaylight?.getAttribute('href')).toBe(
      `/api/code/cosense-toolkit/${USERCSS_TAG}/frosted-daylight.css`
    );

    syncThemeStylesheetLink(clean);
    expect(document.querySelectorAll(`#${THEME_LINK_ID}`)).toHaveLength(1);
    expect(document.getElementById(THEME_LINK_ID)?.getAttribute('href')).toBe(
      `/api/code/cosense-toolkit/${USERCSS_TAG}/modern-clean.css`
    );

    syncThemeStylesheetLink(glass);
    expect(document.getElementById(THEME_LINK_ID)).toBeNull();
  });
});
