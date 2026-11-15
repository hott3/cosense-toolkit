import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RUNTIME_STYLE_ID, initCosenseToolkit } from '../../src/application/bootstrap';
import { resolveFeatureFlags } from '../../src/application/config';
import { FLUID_FIELD_ID } from '../../src/features/ambient-fluid/logic';
import { TODAY_PAGE_CLASS, buildTodayPageTitle } from '../../src/features/today-page-marker/logic';
import type { PageMenuItemOptions } from '../../src/infrastructure/api/cosense';
import { THEME_ATTRIBUTE } from '../../src/infrastructure/api/theme-loader';
import { DOCK_ID, THEME_MENU_ID, TOKEN_DRAWER_ID } from '../../src/infrastructure/ui/dock-shell';

describe('application/bootstrap', () => {
  beforeEach(() => {
    delete window.__cosenseToolkitInitialized;
    delete window.scrapbox;
    delete window.cosense;
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    document.body.removeAttribute('data-optic-js');
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    delete window.scrapbox;
    delete window.cosense;
  });

  it('bootstraps all runtime modules once and ignores duplicate initialization calls', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 15, 12, 0, 0));

    const registeredItems: PageMenuItemOptions[] = [];
    window.scrapbox = {
      PageMenu: {
        addItem: (item) => {
          registeredItems.push(item);
        },
      },
      on: vi.fn(),
    };

    const todayTitle = buildTodayPageTitle();
    document.body.innerHTML = `
      <ul class="grid">
        <li class="page-list-item" data-page-title="${todayTitle}"><a href="#">Today</a></li>
      </ul>
    `;

    initCosenseToolkit();
    initCosenseToolkit();

    expect(window.__cosenseToolkitInitialized).toBe(true);
    expect(document.querySelectorAll(`#${RUNTIME_STYLE_ID}`)).toHaveLength(1);
    const injectedCss = document.getElementById(RUNTIME_STYLE_ID)?.textContent ?? '';
    expect(injectedCss.trimStart().startsWith('@import')).toBe(true);
    expect(injectedCss).toContain('.today-page');

    expect(document.querySelectorAll(`#${FLUID_FIELD_ID}`)).toHaveLength(1);
    expect(document.querySelectorAll(`#${DOCK_ID}`)).toHaveLength(1);
    expect(document.querySelectorAll(`#${THEME_MENU_ID}`)).toHaveLength(1);
    expect(document.querySelectorAll(`#${TOKEN_DRAWER_ID}`)).toHaveLength(1);
    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('optical-glass');

    // 6 search-tools items + 3 page-templates items
    expect(registeredItems).toHaveLength(9);
    expect(
      document.querySelector(`[data-page-title="${todayTitle}"]`)?.classList.contains(TODAY_PAGE_CLASS)
    ).toBe(true);
  });

  it('supports enabling and disabling features via ToolkitFeatureFlags', () => {
    expect(resolveFeatureFlags({ ambientFluid: false })).toEqual({
      themeSwitcher: true,
      ambientFluid: false,
      surfaceTension: true,
      searchTools: true,
      pageTemplates: true,
      todayPageMarker: true,
    });

    const registeredItems: PageMenuItemOptions[] = [];
    window.scrapbox = {
      PageMenu: {
        addItem: (item) => {
          registeredItems.push(item);
        },
      },
    };

    const todayTitle = buildTodayPageTitle();
    document.body.innerHTML = `
      <ul class="grid">
        <li class="page-list-item" data-page-title="${todayTitle}"><a href="#">Today</a></li>
      </ul>
    `;

    initCosenseToolkit({
      themeSwitcher: false,
      ambientFluid: false,
      surfaceTension: false,
      searchTools: true,
      pageTemplates: false,
      todayPageMarker: false,
    });

    expect(document.getElementById(DOCK_ID)).toBeNull();
    expect(document.getElementById(FLUID_FIELD_ID)).toBeNull();
    expect(document.getElementById(RUNTIME_STYLE_ID)).toBeNull();
    expect(registeredItems).toHaveLength(6);
    expect(
      document.querySelector(`[data-page-title="${todayTitle}"]`)?.classList.contains(TODAY_PAGE_CLASS)
    ).toBe(false);
  });
});
