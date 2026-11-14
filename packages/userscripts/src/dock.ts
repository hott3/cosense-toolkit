import type { ThemeDefinition } from './types';

export class OpticalDock {
  private dockEl: HTMLElement | null = null;
  private menuEl: HTMLElement | null = null;
  private drawerEl: HTMLElement | null = null;
  private toastEl: HTMLElement | null = null;
  private toastTimer: number | null = null;

  constructor(
    private themes: ThemeDefinition[],
    private onThemeSelect: (themeId: string) => void,
    private onPulse: () => void,
    private getActiveTheme: () => ThemeDefinition,
    private getSpeed: () => string,
    private onSpeedChange: (speed: string) => void
  ) {}

  init(): void {
    this.createDock();
    this.createMenu();
    this.createDrawer();
    this.createToast();
    this.attachOutsideClickListener();
  }

  private createDock(): void {
    if (document.getElementById('hot3OpticDock')) return;

    const dock = document.createElement('aside');
    dock.id = 'hot3OpticDock';
    dock.setAttribute('aria-label', 'Optical Lens Controls');
    dock.innerHTML = `
      <button class="optic-bead-btn" id="hot3OpticThemeBtn" title="Theme Selector" type="button" aria-haspopup="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a7 7 0 0 0 7 7c0 2-1 3-3 4-1.5.8-2 1.5-2 3"></path>
          <circle cx="8" cy="10" r="1.2" fill="currentColor"></circle>
          <circle cx="12" cy="7" r="1.2" fill="currentColor"></circle>
          <circle cx="16" cy="10" r="1.2" fill="currentColor"></circle>
        </svg>
      </button>
      <button class="optic-bead-btn optic-bead-center" id="hot3OpticPulseBtn" title="Trigger Fluid Resonance" type="button" data-optic-effect-only>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3v3m0 12v3M3 12h3m12 0h3"></path>
          <circle cx="12" cy="12" r="4"></circle>
          <path d="m18.36 5.64-2.12 2.12m-8.48 8.48-2.12 2.12m0-12.72 2.12 2.12m8.48 8.48 2.12 2.12"></path>
        </svg>
      </button>
      <button class="optic-bead-btn" id="hot3OpticInspectorBtn" title="Token & Theme Inspector" type="button">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="4"></rect>
          <path d="M3 9h18M9 21V9"></path>
        </svg>
      </button>
    `;

    document.body.appendChild(dock);
    this.dockEl = dock;

    document.getElementById('hot3OpticThemeBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });

    document.getElementById('hot3OpticPulseBtn')?.addEventListener('click', () => {
      this.onPulse();
      this.showToast('Fluid Resonance Triggered');
    });

    document.getElementById('hot3OpticInspectorBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDrawer();
    });
  }

  private createMenu(): void {
    if (document.getElementById('hot3OpticThemeMenu')) return;

    const menu = document.createElement('div');
    menu.id = 'hot3OpticThemeMenu';
    this.renderMenuItems(menu);

    document.body.appendChild(menu);
    this.menuEl = menu;
  }

  renderMenuItems(menu: HTMLElement = this.menuEl!): void {
    if (!menu) return;
    const active = this.getActiveTheme();
    const itemsHtml = this.themes.map((t) => `
      <button class="optic-theme-item ${t.id === active.id ? 'is-active' : ''}" data-theme-id="${t.id}" type="button">
        <div class="optic-theme-item-left">
          <span class="optic-theme-swatch" style="background:${t.swatch}"></span>
          <span>${t.label}</span>
        </div>
        <span class="optic-theme-badge">${t.badge}</span>
      </button>
    `).join('');

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
    if (document.getElementById('hot3OpticTokenDrawer')) return;

    const drawer = document.createElement('aside');
    drawer.id = 'hot3OpticTokenDrawer';
    drawer.innerHTML = `
      <div class="optic-drawer-header">
        <div class="optic-drawer-title">
          <span class="optic-drawer-dot"></span>
          <span>Theme & Physics Inspector</span>
        </div>
        <button class="optic-close-btn" id="hot3OpticDrawerClose" type="button" aria-label="Close">✕</button>
      </div>
      <div class="optic-drawer-body">
        <div>
          <div class="optic-section-label">Active Theme Identity</div>
          <div class="optic-token-row"><span class="optic-token-key">Label</span><span class="optic-token-active" id="hot3TokenLabel">-</span></div>
          <div class="optic-token-row"><span class="optic-token-key">Badge</span><span id="hot3TokenBadge">-</span></div>
          <div class="optic-token-row"><span class="optic-token-key">Base Bg</span><span id="hot3TokenBg">-</span></div>
          <div class="optic-token-row"><span class="optic-token-key">Fluid Mode</span><span id="hot3TokenFluid">-</span></div>
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

    document.getElementById('hot3OpticDrawerClose')?.addEventListener('click', () => {
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
    const labelEl = document.getElementById('hot3TokenLabel');
    const badgeEl = document.getElementById('hot3TokenBadge');
    const bgEl = document.getElementById('hot3TokenBg');
    const fluidEl = document.getElementById('hot3TokenFluid');

    if (labelEl) labelEl.textContent = theme.label;
    if (badgeEl) badgeEl.textContent = theme.badge;
    if (bgEl) bgEl.textContent = theme.baseBg;
    if (fluidEl) fluidEl.textContent = theme.fluidMode;
  }

  private createToast(): void {
    if (document.getElementById('hot3OpticToastBox')) return;
    const toast = document.createElement('div');
    toast.id = 'hot3OpticToastBox';
    document.body.appendChild(toast);
    this.toastEl = toast;
  }

  showToast(message: string): void {
    if (!this.toastEl) return;
    this.toastEl.textContent = message;
    this.toastEl.classList.add('is-visible');
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => {
      this.toastEl?.classList.remove('is-visible');
    }, 2400);
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
      if (this.menuEl?.classList.contains('is-open') && !this.menuEl.contains(target) && !document.getElementById('hot3OpticThemeBtn')?.contains(target)) {
        this.closeMenu();
      }
      if (this.drawerEl?.classList.contains('is-open') && !this.drawerEl.contains(target) && !document.getElementById('hot3OpticInspectorBtn')?.contains(target)) {
        this.closeDrawer();
      }
    });
  }
}
