import { initCosenseToolkit, initOpticLens } from './application/bootstrap';

export { initCosenseToolkit, initOpticLens };

// Auto-boot on load when running in a browser document
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initCosenseToolkit());
  } else {
    initCosenseToolkit();
  }
}
