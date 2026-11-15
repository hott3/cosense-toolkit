import type { ThemeDefinition } from './types';
import { RUNTIME_CSS } from './styles';
import { AmbientFluidField } from './ambient';
import { SurfaceTensionPhysics } from './ripple';
import { OpticalDock } from './dock';

const STORAGE_KEY = 'hot3-cosense-theme';
const STYLE_ID = 'hot3-optic-lens-runtime-style';
const THEME_LINK_ID = 'hot3-dynamic-theme-css';
const COSENSE_HOST_PROJECT = 'cosense-toolkit';

const THEMES: ThemeDefinition[] = [
  {
    id: 'optical-glass',
    label: 'Pure Optical Glass',
    badge: 'Night',
    page: 'Theme-Pure-Optical-Glass',
    baseBg: '#04080F',
    swatch: 'linear-gradient(135deg, #04080F 0%, #1E4073 60%, #C8B996 100%)',
    fluidMode: 'night',
    surfaceTension: true,
    preloadedInSettings: true
  },
  {
    id: 'frosted-daylight',
    label: 'Frosted Daylight',
    badge: 'Day',
    page: 'Theme-Frosted-Daylight',
    baseBg: '#EFF4FA',
    swatch: 'linear-gradient(135deg, #EFF4FA 0%, #BAE6FD 55%, #FDE68A 100%)',
    fluidMode: 'day',
    surfaceTension: true,
    preloadedInSettings: false
  },
  {
    id: 'modern-clean',
    label: 'Modern Clean',
    badge: 'Classic',
    page: 'Theme-Modern-Clean',
    baseBg: '#F7F8FA',
    swatch: 'linear-gradient(135deg, #F7F8FA 0%, #FFFFFF 60%, #2EAADC 100%)',
    fluidMode: 'off',
    surfaceTension: false,
    preloadedInSettings: false
  }
];

function getSavedThemeId(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) || 'optical-glass';
  } catch {
    return 'optical-glass';
  }
}

export function initOpticLens(): void {
  if (typeof window === 'undefined') return;
  if (window.__hot3OpticLensInitialized) return;
  window.__hot3OpticLensInitialized = true;

  // 1. Inject runtime CSS
  if (!document.getElementById(STYLE_ID)) {
    const styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    styleEl.textContent = RUNTIME_CSS;
    document.head.appendChild(styleEl);
  }

  const ambient = new AmbientFluidField();
  const physics = new SurfaceTensionPhysics();
  let activeTheme = THEMES.find((t) => t.id === getSavedThemeId()) || THEMES[0];
  let currentSpeed = 'normal';

  function ensureThemeLink(theme: ThemeDefinition): void {
    let linkEl = document.getElementById(THEME_LINK_ID) as HTMLLinkElement | null;
    if (theme.preloadedInSettings) {
      if (linkEl) linkEl.remove();
      return;
    }

    const href = `/api/code/${COSENSE_HOST_PROJECT}/${encodeURIComponent(theme.page)}/style.css`;

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

  function applyTheme(themeId: string, notify = false): void {
    const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];
    activeTheme = theme;

    document.documentElement.setAttribute('data-hot3-theme', theme.id);
    ensureThemeLink(theme);
    ambient.setMode(theme.fluidMode);
    physics.setEnabled(theme.surfaceTension);

    try {
      window.localStorage.setItem(STORAGE_KEY, theme.id);
    } catch {
      // Ignore storage errors in sandbox
    }

    dock.renderMenuItems();
    dock.updateInspector(theme);

    if (notify) {
      dock.showToast(`Active Theme: ${theme.label}`);
    }
  }

  function setDriftSpeed(speed: string): void {
    currentSpeed = speed;
    const factor = speed === 'slow' ? 1.6 : speed === 'fast' ? 0.6 : 1.0;
    const pools = document.querySelectorAll<HTMLElement>('#hot3OpticFluidField .optic-fluid-pool');
    pools.forEach((p, idx) => {
      const baseSec = [22, 26, 16][idx] || 20;
      p.style.animationDuration = `${(baseSec * factor).toFixed(1)}s`;
    });
  }

  const dock = new OpticalDock(
    THEMES,
    (themeId) => applyTheme(themeId, true),
    () => ambient.pulse(),
    () => activeTheme,
    () => currentSpeed,
    (speed) => setDriftSpeed(speed)
  );

  ambient.init();
  physics.attachGlobalListener();
  dock.init();

  applyTheme(activeTheme.id, false);
}

// Auto-boot on load
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initOpticLens());
  } else {
    initOpticLens();
  }
}
