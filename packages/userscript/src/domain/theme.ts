declare const __COSENSE_USERCSS_VERSION__: string | undefined;
declare const __COSENSE_USERSCRIPT_VERSION__: string | undefined;

export const USERCSS_VERSION =
  typeof __COSENSE_USERCSS_VERSION__ !== 'undefined' ? __COSENSE_USERCSS_VERSION__ : '0.2.0';
export const USERSCRIPT_VERSION =
  typeof __COSENSE_USERSCRIPT_VERSION__ !== 'undefined' ? __COSENSE_USERSCRIPT_VERSION__ : '0.3.0';

export const USERCSS_TAG = `usercss-v${USERCSS_VERSION}`;
export const USERSCRIPT_TAG = `userscript-v${USERSCRIPT_VERSION}`;
export const COSENSE_HOST_PROJECT = 'cosense-toolkit';
export const DEFAULT_THEME_ID = 'optical-glass';

export type FluidMode = 'night' | 'day' | 'off';

export interface ThemeDefinition {
  readonly id: string;
  readonly label: string;
  readonly badge: string;
  readonly page: string;
  readonly cssFile: string;
  readonly baseBg: string;
  readonly swatch: string;
  readonly fluidMode: FluidMode;
  readonly surfaceTension: boolean;
  readonly preloadedInSettings: boolean;
}

export const THEMES: readonly ThemeDefinition[] = [
  {
    id: 'optical-glass',
    label: 'Pure Optical Glass',
    badge: 'Night',
    page: 'Theme-Pure-Optical-Glass',
    cssFile: 'pure-optical-glass.css',
    baseBg: '#04080F',
    swatch: 'linear-gradient(135deg, #04080F 0%, #1E4073 60%, #C8B996 100%)',
    fluidMode: 'night',
    surfaceTension: true,
    preloadedInSettings: true,
  },
  {
    id: 'frosted-daylight',
    label: 'Frosted Daylight',
    badge: 'Day',
    page: 'Theme-Frosted-Daylight',
    cssFile: 'frosted-daylight.css',
    baseBg: '#EFF4FA',
    swatch: 'linear-gradient(135deg, #EFF4FA 0%, #BAE6FD 55%, #FDE68A 100%)',
    fluidMode: 'day',
    surfaceTension: true,
    preloadedInSettings: false,
  },
  {
    id: 'modern-clean',
    label: 'Modern Clean',
    badge: 'Classic',
    page: 'Theme-Modern-Clean',
    cssFile: 'modern-clean.css',
    baseBg: '#F7F8FA',
    swatch: 'linear-gradient(135deg, #F7F8FA 0%, #FFFFFF 60%, #2EAADC 100%)',
    fluidMode: 'off',
    surfaceTension: false,
    preloadedInSettings: false,
  },
];

/**
 * Resolve a theme definition by id, falling back to the default theme.
 */
export function resolveTheme(themeId?: string | null): ThemeDefinition {
  return THEMES.find((theme) => theme.id === themeId) ?? THEMES[0];
}

/**
 * Build the same-origin Scrapbox CSS import URL for a versioned usercss release page.
 */
export function buildThemeCssHref(
  theme: ThemeDefinition,
  hostProject = COSENSE_HOST_PROJECT,
  usercssTag = USERCSS_TAG
): string {
  return `/api/code/${hostProject}/${encodeURIComponent(usercssTag)}/${encodeURIComponent(theme.cssFile)}`;
}
