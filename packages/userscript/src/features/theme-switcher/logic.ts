import { DEFAULT_THEME_ID, resolveTheme, type ThemeDefinition } from '../../domain/theme';
import { readStorageItem, writeStorageItem } from '../../infrastructure/api/storage';

export const STORAGE_KEY = 'hot3-cosense-theme';
export const STYLE_ID = 'hot3-optic-lens-runtime-style';

/**
 * Load the persisted theme selection from localStorage, falling back to default.
 */
export function loadSavedTheme(): ThemeDefinition {
  const savedId = readStorageItem(STORAGE_KEY, DEFAULT_THEME_ID);
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
