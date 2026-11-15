import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FLUID_FIELD_ID, PULSE_DURATION_MS } from '../../src/features/ambient-fluid/logic';
import { AmbientFluidField } from '../../src/features/ambient-fluid/ui';

describe('features/ambient-fluid (Given-When-Then)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.removeAttribute('data-optic-js');
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Given a clean document, When AmbientFluidField initializes and updates mode/speed, Then 3 fluid pools reflect mode, pulse, and drift speed', () => {
    // Given
    const fieldController = new AmbientFluidField();

    // When: initialized twice (idempotency)
    fieldController.init();
    fieldController.init();

    // Then
    const fields = document.querySelectorAll(`#${FLUID_FIELD_ID}`);
    expect(fields).toHaveLength(1);
    expect(document.body.getAttribute('data-optic-js')).toBe('active');
    expect(fields[0].querySelectorAll('.optic-fluid-pool')).toHaveLength(3);
    expect(fields[0].getAttribute('data-fluid-mode')).toBe('night');

    // When: fluid mode changes to day
    fieldController.setMode('day');
    expect(fields[0].getAttribute('data-fluid-mode')).toBe('day');

    // When: drift speed changes to fast
    fieldController.setDriftSpeed('fast');
    const pools = fields[0].querySelectorAll<HTMLElement>('.optic-fluid-pool');
    expect(fieldController.getSpeed()).toBe('fast');
    expect(pools[0].style.animationDuration).toBe('13.2s');
    expect(pools[1].style.animationDuration).toBe('15.6s');
    expect(pools[2].style.animationDuration).toBe('9.6s');

    // When: pulse is triggered
    fieldController.pulse();
    expect(fields[0].classList.contains('is-pulsing')).toBe(true);

    // Then: pulsing ends after PULSE_DURATION_MS
    vi.advanceTimersByTime(PULSE_DURATION_MS);
    expect(fields[0].classList.contains('is-pulsing')).toBe(false);
  });
});
