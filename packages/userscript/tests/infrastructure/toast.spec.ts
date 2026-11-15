import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  OpticalToast,
  TOAST_BOX_ID,
  TOAST_DURATION_MS,
} from '../../src/infrastructure/ui/toast';

describe('infrastructure/ui/toast', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('creates the toast element once and automatically hides it after TOAST_DURATION_MS', () => {
    const toast = new OpticalToast();
    toast.init();
    toast.init();

    const toastElements = document.querySelectorAll(`#${TOAST_BOX_ID}`);
    expect(toastElements).toHaveLength(1);

    toast.show('Active Theme: Pure Optical Glass');
    expect(toastElements[0].textContent).toBe('Active Theme: Pure Optical Glass');
    expect(toastElements[0].classList.contains('is-visible')).toBe(true);

    vi.advanceTimersByTime(TOAST_DURATION_MS - 10);
    expect(toastElements[0].classList.contains('is-visible')).toBe(true);

    vi.advanceTimersByTime(10);
    expect(toastElements[0].classList.contains('is-visible')).toBe(false);
  });
});
