export const TOAST_BOX_ID = 'hot3OpticToastBox';
export const TOAST_DURATION_MS = 2400;

export const TOAST_CSS = `
  /* Floating Optical Toast */
  #hot3OpticToastBox {
    position: fixed;
    top: 58px; left: 50%;
    transform: translate3d(-50%, -18px, 0);
    opacity: 0; pointer-events: none; z-index: 1060;
    display: flex; align-items: center; gap: 8px;
    padding: 8px 16px; border-radius: 9999px; font-size: 12px;
    color: #F6F0E0; background: rgba(8, 14, 26, 0.78);
    backdrop-filter: blur(16px) saturate(140%);
    -webkit-backdrop-filter: blur(16px) saturate(140%);
    border: 1px solid rgba(255, 255, 255, 0.25);
    box-shadow: 0 0 20px rgba(246, 240, 224, 0.18), 0 10px 24px rgba(0, 0, 0, 0.6);
    transition: transform 240ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms ease;
  }

  html[data-hot3-theme="frosted-daylight"] #hot3OpticToastBox,
  html[data-hot3-theme="modern-clean"] #hot3OpticToastBox {
    color: #0F172A;
    background: rgba(255, 255, 255, 0.90);
    border-color: rgba(15, 23, 42, 0.12);
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.14);
  }

  #hot3OpticToastBox.is-visible {
    transform: translate3d(-50%, 0, 0);
    opacity: 1;
  }
`;

/**
 * Shared floating toast notification presenter.
 */
export class OpticalToast {
  private toastEl: HTMLElement | null = null;
  private toastTimer: number | null = null;

  init(): void {
    const existing = document.getElementById(TOAST_BOX_ID);
    if (existing) {
      this.toastEl = existing;
      return;
    }

    const toast = document.createElement('div');
    toast.id = TOAST_BOX_ID;
    document.body.appendChild(toast);
    this.toastEl = toast;
  }

  show(message: string): void {
    if (!this.toastEl) return;
    this.toastEl.textContent = message;
    this.toastEl.classList.add('is-visible');
    if (this.toastTimer !== null) {
      window.clearTimeout(this.toastTimer);
    }
    this.toastTimer = window.setTimeout(() => {
      this.toastEl?.classList.remove('is-visible');
      this.toastTimer = null;
    }, TOAST_DURATION_MS);
  }
}
