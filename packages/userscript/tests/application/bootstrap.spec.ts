import { beforeEach, describe, expect, it } from 'vitest';
import { RUNTIME_STYLE_ID, initCosenseToolkit } from '../../src/application/bootstrap';
import { resolveFeatureFlags } from '../../src/application/config';
import { FLUID_FIELD_ID } from '../../src/features/ambient-fluid/logic';
import { THEME_ATTRIBUTE } from '../../src/infrastructure/api/theme-loader';
import { DOCK_ID, THEME_MENU_ID, TOKEN_DRAWER_ID } from '../../src/infrastructure/ui/dock-shell';

describe('application/bootstrap', () => {
  beforeEach(() => {
    delete window.__hot3OpticLensInitialized;
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    document.body.removeAttribute('data-optic-js');
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
    window.localStorage.clear();
  });

  it('bootstraps all runtime modules once and ignores duplicate initialization calls', () => {
    initCosenseToolkit();
    initCosenseToolkit();

    expect(window.__hot3OpticLensInitialized).toBe(true);
    expect(document.querySelectorAll(`#${RUNTIME_STYLE_ID}`)).toHaveLength(1);
    expect(document.querySelectorAll(`#${FLUID_FIELD_ID}`)).toHaveLength(1);
    expect(document.querySelectorAll(`#${DOCK_ID}`)).toHaveLength(1);
    expect(document.querySelectorAll(`#${THEME_MENU_ID}`)).toHaveLength(1);
    expect(document.querySelectorAll(`#${TOKEN_DRAWER_ID}`)).toHaveLength(1);
    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('optical-glass');
  });

  it('supports enabling and disabling features via ToolkitFeatureFlags', () => {
    expect(resolveFeatureFlags({ ambientFluid: false })).toEqual({
      themeSwitcher: true,
      ambientFluid: false,
      surfaceTension: true,
    });

    initCosenseToolkit({
      themeSwitcher: true,
      ambientFluid: false,
      surfaceTension: false,
    });

    expect(document.getElementById(DOCK_ID)).not.toBeNull();
    expect(document.getElementById(FLUID_FIELD_ID)).toBeNull();
    expect(document.getElementById(RUNTIME_STYLE_ID)?.textContent).not.toContain(
      'surfaceTensionRipple'
    );
  });
});
