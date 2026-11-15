import { beforeEach, describe, expect, it } from 'vitest';
import { ANIMATION_CLASS } from '../../src/features/surface-tension/logic';
import { SurfaceTensionPhysics } from '../../src/features/surface-tension/ui';

describe('features/surface-tension (Given-When-Then)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('Given interactive Scrapbox elements, When clicked while enabled vs disabled, Then ripple class is toggled only when enabled', () => {
    // Given
    document.body.innerHTML = `
      <ul class="grid">
        <li id="cardItem"><a id="cardInner" href="#">Card</a></li>
      </ul>
      <div id="plainBox">Plain text</div>
    `;

    const physics = new SurfaceTensionPhysics();
    physics.attachGlobalListener();

    const cardItem = document.getElementById('cardItem')!;
    const cardInner = document.getElementById('cardInner')!;
    const plainBox = document.getElementById('plainBox')!;

    // When: clicking inside an interactive grid card
    cardInner.click();

    // Then
    expect(cardItem.classList.contains(ANIMATION_CLASS)).toBe(true);

    // When: clicking a non-interactive element
    plainBox.click();
    expect(plainBox.classList.contains(ANIMATION_CLASS)).toBe(false);

    // When: disabling physics and re-triggering
    cardItem.classList.remove(ANIMATION_CLASS);
    physics.setEnabled(false);
    expect(physics.isEnabled()).toBe(false);
    cardInner.click();

    // Then
    expect(cardItem.classList.contains(ANIMATION_CLASS)).toBe(false);
  });
});
