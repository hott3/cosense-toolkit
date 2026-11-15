import { THEMES } from '../domain/theme';
import { AMBIENT_FLUID_CSS } from '../features/ambient-fluid/style';
import { AmbientFluidField } from '../features/ambient-fluid/ui';
import { initPageTemplates } from '../features/page-templates/ui';
import { initSearchTools } from '../features/search-tools/ui';
import { SURFACE_TENSION_CSS } from '../features/surface-tension/style';
import { SurfaceTensionPhysics } from '../features/surface-tension/ui';
import { STYLE_ID } from '../features/theme-switcher/logic';
import { THEME_SWITCHER_CSS } from '../features/theme-switcher/style';
import { ThemeSwitcherController } from '../features/theme-switcher/ui';
import { TODAY_PAGE_MARKER_CSS } from '../features/today-page-marker/style';
import { initTodayPageMarker } from '../features/today-page-marker/ui';
import '../infrastructure/api/cosense';
import { DOCK_SHELL_CSS, OpticalDock } from '../infrastructure/ui/dock-shell';
import { injectStyleOnce } from '../infrastructure/ui/style-injector';
import { TOAST_CSS } from '../infrastructure/ui/toast';
import { resolveFeatureFlags, type ToolkitFeatureFlags } from './config';

export const RUNTIME_STYLE_ID = STYLE_ID;

/**
 * Initialize cosense-toolkit runtime features once in the browser DOM.
 */
export function initCosenseToolkit(flagOverrides?: Partial<ToolkitFeatureFlags>): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.__cosenseToolkitInitialized) return;
  window.__cosenseToolkitInitialized = true;

  const flags = resolveFeatureFlags(flagOverrides);

  // Place TODAY_PAGE_MARKER_CSS first so its @import rule precedes any CSS rulesets.
  const combinedCss = [
    flags.todayPageMarker ? TODAY_PAGE_MARKER_CSS : '',
    flags.themeSwitcher ? DOCK_SHELL_CSS : '',
    flags.themeSwitcher ? THEME_SWITCHER_CSS : '',
    flags.themeSwitcher ? TOAST_CSS : '',
    flags.ambientFluid ? AMBIENT_FLUID_CSS : '',
    flags.surfaceTension ? SURFACE_TENSION_CSS : '',
  ]
    .filter(Boolean)
    .join('\n');

  if (combinedCss) {
    injectStyleOnce(RUNTIME_STYLE_ID, combinedCss);
  }

  if (flags.searchTools) {
    initSearchTools();
  }

  if (flags.pageTemplates) {
    initPageTemplates();
  }

  if (flags.todayPageMarker) {
    initTodayPageMarker();
  }

  const ambient = flags.ambientFluid ? new AmbientFluidField() : null;
  ambient?.init();

  const physics = flags.surfaceTension ? new SurfaceTensionPhysics() : null;
  physics?.attachGlobalListener();

  if (!flags.themeSwitcher) {
    return;
  }

  const themeSwitcher = new ThemeSwitcherController();
  let dock: OpticalDock;

  const applyTheme = (themeId: string, notify = false): void => {
    const theme = themeSwitcher.applyTheme(themeId);
    ambient?.setMode(theme.fluidMode);
    physics?.setEnabled(theme.surfaceTension);
    dock.renderMenuItems();
    dock.updateInspector(theme);

    if (notify) {
      dock.showToast(`Active Theme: ${theme.label}`);
    }
  };

  dock = new OpticalDock(
    THEMES,
    (themeId) => applyTheme(themeId, true),
    () => ambient?.pulse(),
    () => themeSwitcher.getActiveTheme(),
    (speed) => ambient?.setDriftSpeed(speed)
  );

  dock.init();
  applyTheme(themeSwitcher.getActiveTheme().id, false);
}

/**
 * Backward-compatible entry function alias.
 */
export const initOpticLens = initCosenseToolkit;
