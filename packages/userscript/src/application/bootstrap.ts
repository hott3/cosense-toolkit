import { THEMES } from '../domain/theme';
import { AMBIENT_FLUID_CSS } from '../features/ambient-fluid/style';
import { AmbientFluidField } from '../features/ambient-fluid/ui';
import { SURFACE_TENSION_CSS } from '../features/surface-tension/style';
import { SurfaceTensionPhysics } from '../features/surface-tension/ui';
import { STYLE_ID } from '../features/theme-switcher/logic';
import { THEME_SWITCHER_CSS } from '../features/theme-switcher/style';
import { ThemeSwitcherController } from '../features/theme-switcher/ui';
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
  if (window.__hot3OpticLensInitialized) return;
  window.__hot3OpticLensInitialized = true;

  const flags = resolveFeatureFlags(flagOverrides);

  const combinedCss = [
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
