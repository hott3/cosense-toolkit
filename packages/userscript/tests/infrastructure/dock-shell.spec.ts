import { beforeEach, describe, expect, it, vi } from 'vitest';
import { THEMES, USERCSS_TAG, USERSCRIPT_TAG } from '../../src/domain/theme';
import {
  DOCK_ID,
  OpticalDock,
  THEME_MENU_ID,
  TOKEN_DRAWER_ID,
} from '../../src/infrastructure/ui/dock-shell';
import { TOAST_BOX_ID } from '../../src/infrastructure/ui/toast';

describe('infrastructure/ui/dock-shell', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders dock, menu, drawer, and dispatches user actions', () => {
    const onThemeSelect = vi.fn();
    const onPulse = vi.fn();
    const onSpeedChange = vi.fn();
    let activeTheme = THEMES[0];

    const dock = new OpticalDock(
      THEMES,
      onThemeSelect,
      onPulse,
      () => activeTheme,
      onSpeedChange
    );
    dock.init();

    expect(DOCK_ID).toBe('cosenseOpticDock');
    expect(THEME_MENU_ID).toBe('cosenseOpticThemeMenu');
    expect(TOKEN_DRAWER_ID).toBe('cosenseOpticTokenDrawer');
    expect(TOAST_BOX_ID).toBe('cosenseOpticToastBox');

    expect(document.getElementById(DOCK_ID)).not.toBeNull();
    expect(document.getElementById(THEME_MENU_ID)).not.toBeNull();
    expect(document.getElementById(TOKEN_DRAWER_ID)).not.toBeNull();
    expect(document.getElementById(TOAST_BOX_ID)).not.toBeNull();

    // Open menu and choose Frosted Daylight
    document.getElementById('cosenseOpticThemeBtn')?.click();
    expect(document.getElementById(THEME_MENU_ID)?.classList.contains('is-open')).toBe(true);

    const daylightBtn = document.querySelector<HTMLButtonElement>(
      '.optic-theme-item[data-theme-id="frosted-daylight"]'
    );
    daylightBtn?.click();
    expect(onThemeSelect).toHaveBeenCalledWith('frosted-daylight');
    expect(document.getElementById(THEME_MENU_ID)?.classList.contains('is-open')).toBe(false);

    // Pulse action
    document.getElementById('cosenseOpticPulseBtn')?.click();
    expect(onPulse).toHaveBeenCalledTimes(1);
    expect(document.getElementById(TOAST_BOX_ID)?.textContent).toBe('Fluid Resonance Triggered');

    // Open inspector drawer and change speed
    activeTheme = THEMES[1];
    document.getElementById('cosenseOpticInspectorBtn')?.click();
    const drawer = document.getElementById(TOKEN_DRAWER_ID);
    expect(drawer?.classList.contains('is-open')).toBe(true);
    expect(document.getElementById('cosenseTokenLabel')?.textContent).toBe('Frosted Daylight');
    expect(document.getElementById('cosenseTokenVersion')?.textContent).toBe(
      `${USERSCRIPT_TAG} / ${USERCSS_TAG}`
    );

    const fastBtn = drawer?.querySelector<HTMLButtonElement>('.optic-pill-btn[data-speed="fast"]');
    fastBtn?.click();
    expect(onSpeedChange).toHaveBeenCalledWith('fast');
    expect(fastBtn?.classList.contains('is-active')).toBe(true);

    // Clicking outside closes open popovers
    document.body.click();
    expect(drawer?.classList.contains('is-open')).toBe(false);
  });
});
