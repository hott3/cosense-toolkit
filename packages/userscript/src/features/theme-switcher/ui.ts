import type { ThemeDefinition } from '../../domain/theme';
import {
  applyThemeAttribute,
  syncThemeStylesheetLink,
} from '../../infrastructure/api/theme-loader';
import { loadSavedTheme, persistThemeSelection } from './logic';

/**
 * Coordinates theme resolution, DOM attribute updates, dynamic stylesheet linking, and persistence.
 */
export class ThemeSwitcherController {
  private activeTheme: ThemeDefinition;

  constructor() {
    this.activeTheme = loadSavedTheme();
  }

  getActiveTheme(): ThemeDefinition {
    return this.activeTheme;
  }

  applyTheme(themeId: string): ThemeDefinition {
    const theme = persistThemeSelection(themeId);
    this.activeTheme = theme;
    applyThemeAttribute(theme.id);
    syncThemeStylesheetLink(theme);
    return theme;
  }
}
