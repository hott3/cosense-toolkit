import { describe, expect, it } from 'vitest';
import {
  buildThemeCssHref,
  DEFAULT_THEME_ID,
  THEMES,
  USERCSS_TAG,
  USERSCRIPT_TAG,
  USERSCRIPT_VERSION,
  resolveTheme,
} from '../../src/domain/theme';

describe('domain/theme', () => {
  describe('version constants', () => {
    it('exposes matching userscript 0.4.0 and usercss-v0.2.1 tags', () => {
      expect(USERSCRIPT_VERSION).toBe('0.4.0');
      expect(USERSCRIPT_TAG).toBe('userscript-v0.4.0');
      expect(USERCSS_TAG).toBe('usercss-v0.2.1');
    });
  });

  describe('resolveTheme', () => {
    it('returns the matching theme when a known theme id is provided', () => {
      // Arrange
      const targetId = 'frosted-daylight';

      // Act
      const resolved = resolveTheme(targetId);

      // Assert
      expect(resolved.id).toBe('frosted-daylight');
      expect(resolved.fluidMode).toBe('day');
      expect(resolved.preloadedInSettings).toBe(false);
    });

    it('falls back to the default optical-glass theme for unknown, null, or undefined ids', () => {
      // Arrange & Act
      const fromUnknown = resolveTheme('non-existent-theme');
      const fromNull = resolveTheme(null);
      const fromUndefined = resolveTheme(undefined);

      // Assert
      expect(fromUnknown.id).toBe(DEFAULT_THEME_ID);
      expect(fromNull.id).toBe(DEFAULT_THEME_ID);
      expect(fromUndefined.id).toBe(DEFAULT_THEME_ID);
    });
  });

  describe('buildThemeCssHref', () => {
    it('builds the versioned same-origin Scrapbox CSS URL using USERCSS_TAG', () => {
      // Arrange
      const daylight = resolveTheme('frosted-daylight');
      const classic = resolveTheme('modern-clean');

      // Act
      const daylightHref = buildThemeCssHref(daylight);
      const classicHref = buildThemeCssHref(classic);

      // Assert
      expect(daylightHref).toBe(`/api/code/cosense-toolkit/${USERCSS_TAG}/frosted-daylight.css`);
      expect(classicHref).toBe(`/api/code/cosense-toolkit/${USERCSS_TAG}/modern-clean.css`);
    });

    it('supports explicit host project and version tag overrides', () => {
      // Arrange
      const defaultTheme = THEMES[0];

      // Act
      const href = buildThemeCssHref(defaultTheme, 'custom-project', 'usercss-v0.2.0');

      // Assert
      expect(href).toBe('/api/code/custom-project/usercss-v0.2.0/pure-optical-glass.css');
    });
  });
});
