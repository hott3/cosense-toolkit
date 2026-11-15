/**
 * Read a string value from `window.localStorage` safely.
 */
export function readStorageItem(key: string, fallback: string): string {
  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

/**
 * Persist a string value to `window.localStorage` safely.
 */
export function writeStorageItem(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
