import { beforeEach, describe, expect, it } from 'vitest';
import { USERCSS_TAG } from '../../src/domain/theme';
import { STORAGE_KEY } from '../../src/features/theme-switcher/logic';
import { ThemeSwitcherController } from '../../src/features/theme-switcher/ui';
import { THEME_ATTRIBUTE, THEME_LINK_ID } from '../../src/infrastructure/api/theme-loader';

describe('features/theme-switcher (Given-When-Then)', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
    window.localStorage.clear();
  });

  it('Given a saved theme in storage, When ThemeSwitcherController initializes and switches themes, Then DOM attribute, dynamic CSS link, and localStorage stay synchronized', () => {
    // Given
    window.localStorage.setItem(STORAGE_KEY, 'modern-clean');
    const controller = new ThemeSwitcherController();
    expect(controller.getActiveTheme().id).toBe('modern-clean');

    // When: applying Frosted Daylight
    const daylight = controller.applyTheme('frosted-daylight');

    // Then
    expect(daylight.id).toBe('frosted-daylight');
    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('frosted-daylight');
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('frosted-daylight');
    expect(document.getElementById(THEME_LINK_ID)?.getAttribute('href')).toBe(
      `/api/code/cosense-toolkit/${USERCSS_TAG}/frosted-daylight.css`
    );

    // When: switching back to preloaded Pure Optical Glass
    const glass = controller.applyTheme('optical-glass');

    // Then
    expect(glass.id).toBe('optical-glass');
    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('optical-glass');
    expect(document.getElementById(THEME_LINK_ID)).toBeNull();
  });
});
