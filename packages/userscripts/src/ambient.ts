import type { FluidMode } from './types';

const FIELD_ID = 'hot3OpticFluidField';

export class AmbientFluidField {
  private element: HTMLElement | null = null;

  init(): void {
    if (document.getElementById(FIELD_ID)) {
      this.element = document.getElementById(FIELD_ID);
      return;
    }

    const field = document.createElement('div');
    field.id = FIELD_ID;
    field.setAttribute('data-fluid-mode', 'night');
    field.innerHTML = `
      <div class="optic-fluid-pool optic-pool-1"></div>
      <div class="optic-fluid-pool optic-pool-2"></div>
      <div class="optic-fluid-pool optic-pool-3"></div>
    `;

    document.body.prepend(field);
    document.body.setAttribute('data-optic-js', 'active');
    this.element = field;
  }

  setMode(mode: FluidMode): void {
    if (!this.element) return;
    this.element.setAttribute('data-fluid-mode', mode);
  }

  pulse(): void {
    if (!this.element) return;
    this.element.classList.add('is-pulsing');
    window.setTimeout(() => {
      this.element?.classList.remove('is-pulsing');
    }, 600);
  }
}
