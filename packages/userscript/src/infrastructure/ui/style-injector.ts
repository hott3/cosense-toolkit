/**
 * Inject a `<style>` tag once into `document.head` for the specified element ID.
 */
export function injectStyleOnce(id: string, cssText: string): HTMLStyleElement {
  const existing = document.getElementById(id);
  if (existing instanceof HTMLStyleElement) {
    return existing;
  }

  const styleEl = document.createElement('style');
  styleEl.id = id;
  styleEl.textContent = cssText;
  document.head.appendChild(styleEl);
  return styleEl;
}
