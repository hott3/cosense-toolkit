import { beforeEach, describe, expect, it } from 'vitest';
import { readStorageItem, writeStorageItem } from '../../src/infrastructure/api/storage';

describe('infrastructure/api/storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('reads fallback when key is unset and reads stored value once written', () => {
    expect(readStorageItem('missing-key', 'optical-glass')).toBe('optical-glass');

    const wrote = writeStorageItem('hot3-cosense-theme', 'frosted-daylight');
    expect(wrote).toBe(true);
    expect(readStorageItem('hot3-cosense-theme', 'optical-glass')).toBe('frosted-daylight');
  });

  it('handles storage access exceptions gracefully', () => {
    window.localStorage.setItem('any-key', 'stored-value');

    const ownDesc = Object.getOwnPropertyDescriptor(window, 'localStorage');
    const protoDesc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(window), 'localStorage');
    const restore = () => {
      if (ownDesc) {
        Object.defineProperty(window, 'localStorage', ownDesc);
      } else {
        delete (window as { localStorage?: Storage }).localStorage;
        if (protoDesc) {
          Object.defineProperty(Object.getPrototypeOf(window), 'localStorage', protoDesc);
        }
      }
    };

    try {
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        get() {
          return {
            getItem() {
              throw new Error('SecurityError');
            },
            setItem() {
              throw new Error('QuotaExceededError');
            },
          } as unknown as Storage;
        },
      });

      expect(readStorageItem('any-key', 'fallback-theme')).toBe('fallback-theme');
      expect(writeStorageItem('any-key', 'value')).toBe(false);
    } finally {
      restore();
    }
  });
});
