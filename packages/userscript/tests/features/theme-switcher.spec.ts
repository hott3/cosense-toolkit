import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_THEME_ID, USERCSS_TAG } from '../../src/domain/theme';
import {
  LEGACY_STORAGE_KEY,
  STORAGE_KEY,
  STYLE_ID,
  loadSavedTheme,
} from '../../src/features/theme-switcher/logic';
import { ThemeSwitcherController } from '../../src/features/theme-switcher/ui';
import { THEME_ATTRIBUTE, THEME_LINK_ID } from '../../src/infrastructure/api/theme-loader';

describe('features/theme-switcher (Given-When-Then)', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
    window.localStorage.clear();
  });

  it('uses cosense-toolkit identifiers and runtime style id', () => {
    expect(STORAGE_KEY).toBe('cosense-toolkit-theme');
    expect(STYLE_ID).toBe('cosense-optic-lens-runtime-style');
    expect(LEGACY_STORAGE_KEY).toBe(['hot', '3-cosense-theme'].join(''));
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

  it('Given only the legacy storage key is saved, When loadSavedTheme and ThemeSwitcherController initialize, Then the legacy theme is inherited', () => {
    // Given
    const legacyKey = ['hot', '3-cosense-theme'].join('');
    window.localStorage.setItem(legacyKey, 'frosted-daylight');

    // When
    const loaded = loadSavedTheme();
    const controller = new ThemeSwitcherController();

    // Then
    expect(loaded.id).toBe('frosted-daylight');
    expect(controller.getActiveTheme().id).toBe('frosted-daylight');
  });

  it('Given both new and legacy keys or neither key, When loadSavedTheme runs, Then STORAGE_KEY takes precedence and empty storage falls back to default', () => {
    // Given both keys
    window.localStorage.setItem(LEGACY_STORAGE_KEY, 'frosted-daylight');
    window.localStorage.setItem(STORAGE_KEY, 'modern-clean');

    // Then new key takes precedence
    expect(loadSavedTheme().id).toBe('modern-clean');

    // Given neither key
    window.localStorage.clear();
    expect(loadSavedTheme().id).toBe(DEFAULT_THEME_ID);
  });
});
