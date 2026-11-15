import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  addPageMenuItem,
  getCurrentPageTitle,
  getPageLines,
  getProjectName,
  insertLineAtEnd,
  onPageChanged,
} from '../../src/infrastructure/api/cosense';

describe('infrastructure/api/cosense', () => {
  beforeEach(() => {
    delete window.scrapbox;
    delete window.cosense;
  });

  afterEach(() => {
    delete window.scrapbox;
    delete window.cosense;
  });

  it('returns safe defaults when Scrapbox globals are absent', () => {
    expect(getProjectName()).toBeUndefined();
    expect(getCurrentPageTitle()).toBeUndefined();
    expect(getPageLines()).toEqual([]);
    expect(insertLineAtEnd('line')).toBe(false);
    expect(addPageMenuItem({ title: 'Test' })).toBe(false);
    expect(onPageChanged(() => {})).toBe(false);
  });

  it('reads project/page data and delegates insertLine, PageMenu, and page:changed events', () => {
    const addItemSpy = vi.fn();
    const insertLineSpy = vi.fn();
    const onSpy = vi.fn();

    window.scrapbox = {
      Project: { name: 'hott3' },
      PageMenu: () => ({ addItem: addItemSpy }),
      on: onSpy,
    };

    window.cosense = {
      Page: {
        title: '日報 20261115',
        lines: [
          { id: '1', text: '日報 20261115' },
          { id: '2', text: '本文' },
        ],
        insertLine: insertLineSpy,
      },
    };

    expect(getProjectName()).toBe('hott3');
    expect(getCurrentPageTitle()).toBe('日報 20261115');
    expect(getPageLines()).toHaveLength(2);
    expect(insertLineAtEnd('新しい行')).toBe(true);
    expect(insertLineSpy).toHaveBeenCalledWith('新しい行', 2);

    const onClick = vi.fn();
    expect(addPageMenuItem({ title: 'テンプレート出力', onClick })).toBe(true);
    expect(addItemSpy).toHaveBeenCalledWith({ title: 'テンプレート出力', onClick });

    const pageChangeHandler = vi.fn();
    expect(onPageChanged(pageChangeHandler)).toBe(true);
    expect(onSpy).toHaveBeenCalledWith('page:changed', pageChangeHandler);
  });

  it('also supports object-style PageMenu.addItem', () => {
    const addItemSpy = vi.fn();
    window.scrapbox = {
      PageMenu: { addItem: addItemSpy },
    };

    expect(addPageMenuItem({ title: '検索' })).toBe(true);
    expect(addItemSpy).toHaveBeenCalledTimes(1);
  });
});
