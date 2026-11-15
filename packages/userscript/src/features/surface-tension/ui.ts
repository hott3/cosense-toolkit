import { ANIMATION_CLASS, findInteractiveTarget } from './logic';

/**
 * Elastic surface-tension ripple animation controller for interactive Scrapbox cards and menus.
 */
export class SurfaceTensionPhysics {
  private enabled = true;
  private listenerAttached = false;

  isEnabled(): boolean {
    return this.enabled;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  trigger(target: HTMLElement | null): void {
    if (!this.enabled || !target) return;
    target.classList.remove(ANIMATION_CLASS);
    // Force reflow so rapid consecutive clicks replay the CSS animation
    void target.offsetWidth;
    target.classList.add(ANIMATION_CLASS);
  }

  attachGlobalListener(): void {
    if (this.listenerAttached) return;
    this.listenerAttached = true;

    document.addEventListener(
      'click',
      (e) => {
        if (!this.enabled) return;
        const target = findInteractiveTarget(e.target);
        if (target) {
          this.trigger(target);
        }
      },
      { passive: true }
    );
  }
}
