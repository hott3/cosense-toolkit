export class SurfaceTensionPhysics {
  private enabled: boolean = true;

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  trigger(target: HTMLElement | null): void {
    if (!this.enabled || !target) return;
    target.classList.remove('animate-surface-tension');
    // Force reflow
    void target.offsetWidth;
    target.classList.add('animate-surface-tension');
  }

  attachGlobalListener(): void {
    document.addEventListener('click', (e) => {
      if (!this.enabled) return;
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        '.grid li, .page-list .grid-item, .navbar-brand, .navbar a, .dropdown-menu a, .page-menu-item'
      );
      if (target) {
        this.trigger(target);
      }
    }, { passive: true });
  }
}
