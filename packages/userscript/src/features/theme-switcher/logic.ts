import { DEFAULT_THEME_ID, resolveTheme, type ThemeDefinition } from '../../domain/theme';
import { readStorageItem, writeStorageItem } from '../../infrastructure/api/storage';

export const STORAGE_KEY = 'cosense-toolkit-theme';
export const LEGACY_STORAGE_KEY = ['hot', '3-cosense-theme'].join('');
export const STYLE_ID = 'cosense-optic-lens-runtime-style';

/**
 * Load the persisted theme selection from localStorage, falling back to legacy storage key and default.
 */
export function loadSavedTheme(): ThemeDefinition {
  const savedId =
    readStorageItem(STORAGE_KEY, '') || readStorageItem(LEGACY_STORAGE_KEY, DEFAULT_THEME_ID);
  return resolveTheme(savedId);
}

/**
 * Resolve and persist a theme selection to localStorage.
 */
export function persistThemeSelection(themeId: string): ThemeDefinition {
  const theme = resolveTheme(themeId);
  writeStorageItem(STORAGE_KEY, theme.id);
  return theme;
}
