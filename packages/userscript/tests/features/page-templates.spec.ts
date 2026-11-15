import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { buildPageTemplates } from '../../src/features/page-templates/logic';
import { initPageTemplates } from '../../src/features/page-templates/ui';
import type { PageMenuItemOptions } from '../../src/infrastructure/api/cosense';

describe('features/page-templates (Given-When-Then)', () => {
  beforeEach(() => {
    delete window.scrapbox;
    delete window.cosense;
  });

  afterEach(() => {
    delete window.scrapbox;
    delete window.cosense;
    vi.restoreAllMocks();
  });

  it('Given a target Date, When buildPageTemplates runs, Then it returns exactly 3 formatted templates excluding legacy Zenn and Pomodoro templates', () => {
    // Given
    const targetDate = new Date(2026, 10, 15, 21, 0, 0); // 2026-11-15

    // When
    const templates = buildPageTemplates(targetDate);

    // Then
    expect(templates).toHaveLength(3);
    expect(templates.map((tpl) => tpl.id)).toEqual([
      'ticketlog',
      'daily-report',
      'seminar-report',
    ]);

    const serialized = JSON.stringify(templates);
    expect(serialized).not.toContain('writing:article-zenn');
    expect(serialized).not.toContain('pomodoroInit');

    expect(templates[0]).toEqual({
      id: 'ticketlog',
      menuTitle: ':ticketlogのテンプレートを出力する',
      lines: [
        '#:ticketlog',
        '[hr | ---.icon]',
        'ボール',
        '\t[hott3.icon]',
        'チケット',
        '\t? {チケットのURL}',
        'やること',
        '\t',
        'ゴール',
        '\t',
        '参考',
        '\t',
        '[hr | ---.icon]',
        '20261115',
      ],
    });

    expect(templates[1]).toEqual({
      id: 'daily-report',
      menuTitle: '日報 20261115のテンプレートを出力する',
      lines: [
        '前の日：[20261114]  次の日：[20261116]',
        '',
        '[https://placehold.jp/28/152x152.png?text=日報%2020261115]',
        '',
        '[hott3.icon]',
        '<報告>',
        '<相談>',
        '<その他>',
      ],
    });

    expect(templates[2]).toEqual({
      id: 'seminar-report',
      menuTitle: 'セミナーレポートのテンプレートを出力する',
      lines: [
        '#セミナーレポート',
        '[hr | ---.icon]',
        'セミナー名',
        '\t',
        'セミナー詳細ページ',
        '\t',
        '主催団体',
        '\t',
        '開催日時',
        '\t',
        '登壇者',
        '\t',
        '資料',
        '\t',
        '関連',
        '\t',
        '[hr | ---.icon]',
      ],
    });

    // When: year boundary date
    const yearEndTemplates = buildPageTemplates(new Date(2026, 11, 31));
    expect(yearEndTemplates[0].lines.at(-1)).toBe('20261231');
    expect(yearEndTemplates[1].menuTitle).toBe('日報 20261231のテンプレートを出力する');
    expect(yearEndTemplates[1].lines[0]).toBe('前の日：[20261230]  次の日：[20270101]');
  });

  it('Given a Scrapbox Page and PageMenu, When initPageTemplates registers the 3 templates and each is clicked, Then insertLineAtEnd appends all template lines in order', () => {
    // Given
    expect(initPageTemplates()).toBe(0);

    const targetDate = new Date(2026, 10, 15, 9, 30, 0);
    const expectedTemplates = buildPageTemplates(targetDate);
    const registeredItems: PageMenuItemOptions[] = [];
    const lines = [{ id: '0', text: 'テストページ' }];
    const insertLineSpy = vi.fn((text: string) => {
      lines.push({ id: String(lines.length), text });
    });

    window.scrapbox = {
      Page: {
        title: 'テストページ',
        lines,
        insertLine: insertLineSpy,
      },
      PageMenu: () => ({
        addItem: (item) => {
          registeredItems.push(item);
        },
      }),
    };

    // When
    const count = initPageTemplates(targetDate);

    // Then
    expect(count).toBe(3);
    expect(registeredItems).toHaveLength(3);
    expect(
      registeredItems.map((item) =>
        typeof item.title === 'function' ? item.title() : item.title
      )
    ).toEqual([
      ':ticketlogのテンプレートを出力する',
      '日報 20261115のテンプレートを出力する',
      'セミナーレポートのテンプレートを出力する',
    ]);

    // When: clicking daily-report template
    registeredItems[1].onClick?.();

    // Then: daily-report lines appended sequentially
    expect(insertLineSpy).toHaveBeenCalledTimes(expectedTemplates[1].lines.length);
    expectedTemplates[1].lines.forEach((line, index) => {
      expect(insertLineSpy).toHaveBeenNthCalledWith(index + 1, line, index + 1);
    });

    // When: clicking ticketlog and seminar-report templates
    insertLineSpy.mockClear();
    registeredItems[0].onClick?.();
    registeredItems[2].onClick?.();

    const combinedLines = [...expectedTemplates[0].lines, ...expectedTemplates[2].lines];
    expect(insertLineSpy).toHaveBeenCalledTimes(combinedLines.length);
    expect(lines.slice(1).map((line) => line.text)).toEqual([
      ...expectedTemplates[1].lines,
      ...expectedTemplates[0].lines,
      ...expectedTemplates[2].lines,
    ]);
  });
});
