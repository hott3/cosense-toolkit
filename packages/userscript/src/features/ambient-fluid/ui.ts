import { calcDriftDurationSec } from '../../domain/drift';
import type { FluidMode } from '../../domain/theme';
import { FLUID_FIELD_ID, PULSE_DURATION_MS } from './logic';

/**
 * 3-layer ambient gradient fluid backdrop field controller.
 */
export class AmbientFluidField {
  private element: HTMLElement | null = null;
  private currentSpeed = 'normal';

  init(): void {
    const existing = document.getElementById(FLUID_FIELD_ID);
    if (existing) {
      this.element = existing;
      return;
    }

    const field = document.createElement('div');
    field.id = FLUID_FIELD_ID;
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
    }, PULSE_DURATION_MS);
  }

  getSpeed(): string {
    return this.currentSpeed;
  }

  setDriftSpeed(speed: string): void {
    this.currentSpeed = speed;
    const pools = document.querySelectorAll<HTMLElement>(`#${FLUID_FIELD_ID} .optic-fluid-pool`);
    pools.forEach((pool, idx) => {
      pool.style.animationDuration = calcDriftDurationSec(idx, speed);
    });
  }
}
