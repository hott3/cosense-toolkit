import { USERCSS_TAG, USERSCRIPT_TAG, type ThemeDefinition } from '../../domain/theme';
import { OpticalToast } from './toast';

export const DOCK_ID = 'cosenseOpticDock';
export const THEME_MENU_ID = 'cosenseOpticThemeMenu';
export const TOKEN_DRAWER_ID = 'cosenseOpticTokenDrawer';

export const DOCK_SHELL_CSS = `
  /* Floating Optical Lens Dock */
  #cosenseOpticDock {
    position: fixed;
    bottom: 20px;
    right: 22px;
    z-index: 950;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 10px;
    border-radius: 9999px;
    background: rgba(8, 14, 26, 0.48);
    backdrop-filter: blur(18px) saturate(140%);
    -webkit-backdrop-filter: blur(18px) saturate(140%);
    border-top: 1px solid rgba(255, 255, 255, 0.42);
    border-left: 1px solid rgba(255, 255, 255, 0.20);
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(0, 0, 0, 0.50);
    box-shadow:
      inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.30),
      0 18px 44px -8px rgba(0, 0, 0, 0.78),
      0 0 24px -6px rgba(246, 240, 224, 0.16);
    contain: layout style;
  }

  html[data-cosense-theme="frosted-daylight"] #cosenseOpticDock,
  html[data-cosense-theme="modern-clean"] #cosenseOpticDock {
    background: rgba(255, 255, 255, 0.78);
    border: 1px solid rgba(15, 23, 42, 0.10);
    border-top-color: rgba(255, 255, 255, 0.95);
    box-shadow: 0 12px 32px -6px rgba(15, 23, 42, 0.16);
  }

  html[data-cosense-theme="modern-clean"] #cosenseOpticDock [data-optic-effect-only] {
    display: none !important;
  }

  #cosenseOpticDock .optic-bead-btn {
    width: 36px;
    height: 36px;
    border-radius: 9999px;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #C8B996;
    background: rgba(255, 255, 255, 0.03);
    border-top: 1px solid rgba(255, 255, 255, 0.35);
    border-left: 1px solid rgba(255, 255, 255, 0.18);
    border-right: 1px solid rgba(255, 255, 255, 0.06);
    border-bottom: 1px solid rgba(0, 0, 0, 0.40);
    box-shadow:
      inset 0 1px 1px 0 rgba(255, 255, 255, 0.20),
      0 4px 12px -4px rgba(0, 0, 0, 0.45);
    transition: transform 380ms cubic-bezier(0.34, 1.56, 0.64, 1),
                color 180ms ease,
                border-color 180ms ease;
  }

  html[data-cosense-theme="frosted-daylight"] #cosenseOpticDock .optic-bead-btn,
  html[data-cosense-theme="modern-clean"] #cosenseOpticDock .optic-bead-btn {
    color: #334155;
    background: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba(15, 23, 42, 0.10);
    box-shadow: 0 4px 10px -2px rgba(15, 23, 42, 0.10);
  }

  #cosenseOpticDock .optic-bead-btn:hover {
    color: #F6F0E0;
    border-top-color: rgba(255, 255, 255, 0.62);
    box-shadow: inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.45), 0 0 16px -2px rgba(246, 240, 224, 0.18);
  }

  html[data-cosense-theme="frosted-daylight"] #cosenseOpticDock .optic-bead-btn:hover,
  html[data-cosense-theme="modern-clean"] #cosenseOpticDock .optic-bead-btn:hover {
    color: #0369A1;
    border-color: rgba(3, 105, 161, 0.35);
    box-shadow: 0 6px 14px -2px rgba(14, 165, 233, 0.20);
  }

  #cosenseOpticDock .optic-bead-btn:active {
    transform: scale(0.955, 1.03);
    transition-duration: 90ms;
    transition-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1.0);
  }

  #cosenseOpticDock .optic-bead-btn.optic-bead-center {
    width: 40px;
    height: 40px;
    color: #F6F0E0;
    border-top-color: rgba(255, 255, 255, 0.65);
    box-shadow: inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.35), 0 0 20px -4px rgba(246, 240, 224, 0.22);
  }

  /* Real-Time Token & Theme Inspector Drawer */
  #cosenseOpticTokenDrawer {
    position: fixed;
    top: 0; right: 0; bottom: 0;
    width: 340px; max-width: 92vw;
    z-index: 1050;
    display: flex; flex-direction: column;
    background: rgba(4, 8, 15, 0.82);
    backdrop-filter: blur(22px) saturate(140%);
    -webkit-backdrop-filter: blur(22px) saturate(140%);
    border-left: 1px solid rgba(255, 255, 255, 0.14);
    box-shadow: 0 0 70px rgba(0, 0, 0, 0.88);
    color: #F6F0E0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    transform: translate3d(100%, 0, 0);
    pointer-events: none;
    visibility: hidden;
    transition: transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1.0), visibility 280ms ease;
    contain: layout style;
  }

  #cosenseOpticTokenDrawer.is-open {
    transform: translate3d(0, 0, 0);
    pointer-events: auto;
    visibility: visible;
  }

  html[data-cosense-theme="frosted-daylight"] #cosenseOpticTokenDrawer,
  html[data-cosense-theme="modern-clean"] #cosenseOpticTokenDrawer {
    background: rgba(255, 255, 255, 0.90);
    border-left: 1px solid rgba(15, 23, 42, 0.12);
    color: #1E293B;
    box-shadow: 0 0 50px rgba(15, 23, 42, 0.18);
  }

  #cosenseOpticTokenDrawer .optic-drawer-header {
    padding: 18px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    display: flex; align-items: center; justify-content: space-between;
  }

  html[data-cosense-theme="frosted-daylight"] #cosenseOpticTokenDrawer .optic-drawer-header,
  html[data-cosense-theme="modern-clean"] #cosenseOpticTokenDrawer .optic-drawer-header {
    border-bottom-color: rgba(15, 23, 42, 0.08);
  }

  #cosenseOpticTokenDrawer .optic-drawer-title {
    display: flex; align-items: center; gap: 9px;
    font-size: 13px; font-weight: 600; letter-spacing: 0.03em;
  }

  #cosenseOpticTokenDrawer .optic-drawer-dot {
    width: 9px; height: 9px; border-radius: 9999px;
    background: #34D399; box-shadow: 0 0 10px rgba(52, 211, 153, 0.75);
  }

  #cosenseOpticTokenDrawer .optic-drawer-body {
    flex: 1; overflow-y: auto; padding: 18px 20px;
    font-size: 12px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    display: flex; flex-direction: column; gap: 18px;
  }

  #cosenseOpticTokenDrawer .optic-section-label {
    font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em;
    color: #7F7663; margin-bottom: 8px;
  }

  #cosenseOpticTokenDrawer .optic-token-row {
    display: flex; align-items: center; justify-content: space-between; gap: 8px;
    padding: 9px 11px; border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.02); margin-bottom: 6px;
  }

  html[data-cosense-theme="frosted-daylight"] #cosenseOpticTokenDrawer .optic-token-row,
  html[data-cosense-theme="modern-clean"] #cosenseOpticTokenDrawer .optic-token-row {
    border-color: rgba(15, 23, 42, 0.08);
    background: rgba(15, 23, 42, 0.03);
  }

  #cosenseOpticTokenDrawer .optic-token-key { opacity: 0.78; }
  #cosenseOpticTokenDrawer .optic-token-active { color: #10B981; font-weight: 600; }

  #cosenseOpticTokenDrawer .optic-speed-group { display: flex; gap: 8px; }

  #cosenseOpticTokenDrawer .optic-pill-btn {
    flex: 1; padding: 7px 10px; border-radius: 10px; cursor: pointer; font-size: 11px;
    color: inherit; background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.14);
    transition: transform 340ms cubic-bezier(0.34, 1.56, 0.64, 1), border-color 180ms ease;
  }

  html[data-cosense-theme="frosted-daylight"] #cosenseOpticTokenDrawer .optic-pill-btn,
  html[data-cosense-theme="modern-clean"] #cosenseOpticTokenDrawer .optic-pill-btn {
    background: rgba(15, 23, 42, 0.04);
    border-color: rgba(15, 23, 42, 0.14);
  }

  #cosenseOpticTokenDrawer .optic-pill-btn.is-active,
  #cosenseOpticTokenDrawer .optic-pill-btn:hover {
    border-color: rgba(246, 240, 224, 0.55);
  }

  #cosenseOpticTokenDrawer .optic-close-btn {
    width: 30px; height: 30px; border-radius: 9999px; cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center;
    color: inherit; background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.16);
  }

  @media (max-width: 640px) {
    #cosenseOpticDock { bottom: 14px; right: 14px; padding: 5px 8px; gap: 6px; }
    #cosenseOpticDock .optic-bead-btn { width: 32px; height: 32px; }
    #cosenseOpticDock .optic-bead-btn.optic-bead-center { width: 36px; height: 36px; }
  }
`;

/**
 * Floating UI dock, theme selector popover, token inspector drawer, and shared toast integration.
 */
export class OpticalDock {
  private menuEl: HTMLElement | null = null;
  private drawerEl: HTMLElement | null = null;
  private readonly toast = new OpticalToast();

  constructor(
    private readonly themes: readonly ThemeDefinition[],
    private readonly onThemeSelect: (themeId: string) => void,
    private readonly onPulse: () => void,
    private readonly getActiveTheme: () => ThemeDefinition,
    private readonly onSpeedChange: (speed: string) => void,
    private readonly onTemplatesOpen?: () => void
  ) {}

  init(): void {
    this.createDock();
    this.createMenu();
    this.createDrawer();
    this.toast.init();
    this.attachOutsideClickListener();
  }

  private createDock(): void {
    if (document.getElementById(DOCK_ID)) return;

    const dock = document.createElement('aside');
    dock.id = DOCK_ID;
    dock.setAttribute('aria-label', 'Optical Lens Controls');
    dock.innerHTML = `
      <button class="optic-bead-btn" id="cosenseOpticThemeBtn" title="Theme Selector" type="button" aria-haspopup="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a7 7 0 0 0 7 7c0 2-1 3-3 4-1.5.8-2 1.5-2 3"></path>
          <circle cx="8" cy="10" r="1.2" fill="currentColor"></circle>
          <circle cx="12" cy="7" r="1.2" fill="currentColor"></circle>
          <circle cx="16" cy="10" r="1.2" fill="currentColor"></circle>
        </svg>
      </button>
      <button class="optic-bead-btn optic-bead-center" id="cosenseOpticPulseBtn" title="Trigger Fluid Resonance" type="button" data-optic-effect-only>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3v3m0 12v3M3 12h3m12 0h3"></path>
          <circle cx="12" cy="12" r="4"></circle>
          <path d="m18.36 5.64-2.12 2.12m-8.48 8.48-2.12 2.12m0-12.72 2.12 2.12m8.48 8.48 2.12 2.12"></path>
        </svg>
      </button>
      <button class="optic-bead-btn" id="cosenseOpticInspectorBtn" title="Token & Theme Inspector" type="button">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="4"></rect>
          <path d="M3 9h18M9 21V9"></path>
        </svg>
      </button>${
        this.onTemplatesOpen
          ? `
      <button class="optic-bead-btn" id="cosenseOpticTemplatesBtn" title="Page Templates" type="button">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="8" y1="13" x2="16" y2="13"></line>
          <line x1="8" y1="17" x2="13" y2="17"></line>
        </svg>
      </button>`
          : ''
      }
    `;

    document.body.appendChild(dock);

    document.getElementById('cosenseOpticThemeBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });

    document.getElementById('cosenseOpticPulseBtn')?.addEventListener('click', () => {
      this.onPulse();
      this.showToast('Fluid Resonance Triggered');
    });

    document.getElementById('cosenseOpticInspectorBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDrawer();
    });

    document.getElementById('cosenseOpticTemplatesBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeMenu();
      this.closeDrawer();
      this.onTemplatesOpen?.();
    });
  }

  private createMenu(): void {
    const existing = document.getElementById(THEME_MENU_ID);
    if (existing) {
      this.menuEl = existing;
      return;
    }

    const menu = document.createElement('div');
    menu.id = THEME_MENU_ID;
    this.renderMenuItems(menu);

    document.body.appendChild(menu);
    this.menuEl = menu;
  }

  renderMenuItems(menu: HTMLElement | null = this.menuEl): void {
    if (!menu) return;
    const active = this.getActiveTheme();
    const itemsHtml = this.themes
      .map(
        (theme) => `
      <button class="optic-theme-item ${theme.id === active.id ? 'is-active' : ''}" data-theme-id="${theme.id}" type="button">
        <div class="optic-theme-item-left">
          <span class="optic-theme-swatch" style="background:${theme.swatch}"></span>
          <span>${theme.label}</span>
        </div>
        <span class="optic-theme-badge">${theme.badge}</span>
      </button>
    `
      )
      .join('');

    menu.innerHTML = `
      <div class="optic-menu-title">Switch System Theme</div>
      ${itemsHtml}
    `;

    menu.querySelectorAll<HTMLButtonElement>('.optic-theme-item').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const themeId = btn.getAttribute('data-theme-id');
        if (themeId) {
          this.onThemeSelect(themeId);
          this.closeMenu();
        }
      });
    });
  }

  private createDrawer(): void {
    const existing = document.getElementById(TOKEN_DRAWER_ID);
    if (existing) {
      this.drawerEl = existing;
      return;
    }

    const drawer = document.createElement('aside');
    drawer.id = TOKEN_DRAWER_ID;
    drawer.innerHTML = `
      <div class="optic-drawer-header">
        <div class="optic-drawer-title">
          <span class="optic-drawer-dot"></span>
          <span>Theme & Physics Inspector</span>
        </div>
        <button class="optic-close-btn" id="cosenseOpticDrawerClose" type="button" aria-label="Close">✕</button>
      </div>
      <div class="optic-drawer-body">
        <div>
          <div class="optic-section-label">Active Theme Identity</div>
          <div class="optic-token-row"><span class="optic-token-key">Label</span><span class="optic-token-active" id="cosenseTokenLabel">-</span></div>
          <div class="optic-token-row"><span class="optic-token-key">Badge</span><span id="cosenseTokenBadge">-</span></div>
          <div class="optic-token-row"><span class="optic-token-key">Base Bg</span><span id="cosenseTokenBg">-</span></div>
          <div class="optic-token-row"><span class="optic-token-key">Fluid Mode</span><span id="cosenseTokenFluid">-</span></div>
          <div class="optic-token-row"><span class="optic-token-key">Version</span><span id="cosenseTokenVersion">${USERSCRIPT_TAG} / ${USERCSS_TAG}</span></div>
        </div>
        <div>
          <div class="optic-section-label">Optical Drift Velocity</div>
          <div class="optic-speed-group">
            <button class="optic-pill-btn" data-speed="slow" type="button">Subtle</button>
            <button class="optic-pill-btn is-active" data-speed="normal" type="button">Natural</button>
            <button class="optic-pill-btn" data-speed="fast" type="button">Vivid</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(drawer);
    this.drawerEl = drawer;

    document.getElementById('cosenseOpticDrawerClose')?.addEventListener('click', () => {
      this.closeDrawer();
    });

    drawer.querySelectorAll<HTMLButtonElement>('.optic-pill-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const speed = btn.getAttribute('data-speed') || 'normal';
        this.onSpeedChange(speed);
        drawer.querySelectorAll('.optic-pill-btn').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        this.showToast(`Drift velocity set to ${speed}`);
      });
    });
  }

  updateInspector(theme: ThemeDefinition): void {
    const labelEl = document.getElementById('cosenseTokenLabel');
    const badgeEl = document.getElementById('cosenseTokenBadge');
    const bgEl = document.getElementById('cosenseTokenBg');
    const fluidEl = document.getElementById('cosenseTokenFluid');
    const versionEl = document.getElementById('cosenseTokenVersion');

    if (labelEl) labelEl.textContent = theme.label;
    if (badgeEl) badgeEl.textContent = theme.badge;
    if (bgEl) bgEl.textContent = theme.baseBg;
    if (fluidEl) fluidEl.textContent = theme.fluidMode;
    if (versionEl) versionEl.textContent = `${USERSCRIPT_TAG} / ${USERCSS_TAG}`;
  }

  showToast(message: string): void {
    this.toast.show(message);
  }

  toggleMenu(): void {
    this.menuEl?.classList.toggle('is-open');
  }

  closeMenu(): void {
    this.menuEl?.classList.remove('is-open');
  }

  toggleDrawer(): void {
    this.updateInspector(this.getActiveTheme());
    this.drawerEl?.classList.toggle('is-open');
  }

  closeDrawer(): void {
    this.drawerEl?.classList.remove('is-open');
  }

  private attachOutsideClickListener(): void {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement | null;
      if (
        this.menuEl?.classList.contains('is-open') &&
        !this.menuEl.contains(target) &&
        !document.getElementById('cosenseOpticThemeBtn')?.contains(target)
      ) {
        this.closeMenu();
      }
      if (
        this.drawerEl?.classList.contains('is-open') &&
        !this.drawerEl.contains(target) &&
        !document.getElementById('cosenseOpticInspectorBtn')?.contains(target)
      ) {
        this.closeDrawer();
      }
    });
  }
}
