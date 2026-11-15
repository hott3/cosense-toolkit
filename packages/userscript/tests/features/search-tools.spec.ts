import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  GOOGLE_FAVICON_URL,
  GOOGLE_FONTS_FAVICON_URL,
  LETS_EMOJI_FAVICON_URL,
  LYRICFIND_FAVICON_URL,
  SEARCH_TOOL_DEFINITIONS,
  WEBLIO_FAVICON_URL,
  buildGoogleAiSearchUrl,
  buildGoogleFontsUrl,
  buildGoogleSearchUrl,
  buildLetsEmojiSearchUrl,
  buildLyricFindSearchUrl,
  buildWeblioCitationLines,
  buildWeblioUrl,
} from '../../src/features/search-tools/logic';
import { initSearchTools } from '../../src/features/search-tools/ui';
import type { PageMenuItemOptions } from '../../src/infrastructure/api/cosense';

describe('features/search-tools (Given-When-Then)', () => {
  beforeEach(() => {
    delete window.scrapbox;
    delete window.cosense;
  });

  afterEach(() => {
    delete window.scrapbox;
    delete window.cosense;
    vi.restoreAllMocks();
  });

  it('Given a Japanese and special-character page title, When building URLs for all 6 search tools, Then all URLs properly encode the query', () => {
    // Given
    const title = '形態素解析 & AI';
    const encoded = encodeURIComponent(title);

    // When / Then
    expect(SEARCH_TOOL_DEFINITIONS.map((tool) => tool.id)).toEqual([
      'google-ai',
      'google-search',
      'weblio',
      'google-fonts',
      'lyricfind',
      'lets-emoji',
    ]);
    expect(buildGoogleAiSearchUrl(title)).toBe(`https://www.google.com/search?udm=50&q=${encoded}`);
    expect(buildGoogleSearchUrl(title)).toBe(`https://www.google.com/search?q=${encoded}`);
    expect(buildWeblioUrl(title)).toBe(`https://www.weblio.jp/content/${encoded}`);
    expect(buildGoogleFontsUrl(title)).toBe(`https://fonts.google.com/?query=${encoded}`);
    expect(buildLyricFindSearchUrl(title)).toBe(
      `https://www.google.com/search?q=site:lyrics.lyricfind.com ${encoded}`
    );
    expect(buildLetsEmojiSearchUrl(title)).toBe(
      `https://www.google.com/search?q=site:lets-emoji.com ${encoded}`
    );
    expect(buildWeblioCitationLines(title)).toEqual([
      `${title}[とは]`,
      '> ',
      `> 引用）[https://www.weblio.jp/content/${title} ${title}とは - わかりやすく解説 Weblio辞書]`,
    ]);
  });

  it('Given an active Scrapbox page and PageMenu, When initSearchTools registers all 6 items and each is clicked, Then standard tools open encoded URLs and Weblio inserts citation lines before opening', () => {
    // Given
    const registeredItems: PageMenuItemOptions[] = [];
    const lines = [{ id: '1', text: '知識グラフ入門' }];
    const insertLineSpy = vi.fn((text: string) => {
      lines.push({ id: String(lines.length + 1), text });
    });
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    window.scrapbox = {
      Page: {
        title: '知識グラフ入門',
        lines,
        insertLine: insertLineSpy,
      },
      PageMenu: {
        addItem: (item) => {
          registeredItems.push(item);
        },
      },
    };

    // When
    const count = initSearchTools();

    // Then
    expect(count).toBe(6);
    expect(registeredItems).toHaveLength(6);
    expect(registeredItems.map((item) => ({ title: item.title, image: item.image }))).toEqual([
      { title: 'Google AIモードで検索する', image: GOOGLE_FAVICON_URL },
      { title: 'Google検索で検索する', image: GOOGLE_FAVICON_URL },
      { title: 'Weblio辞書で検索する', image: WEBLIO_FAVICON_URL },
      { title: 'Google Fontsで検索する', image: GOOGLE_FONTS_FAVICON_URL },
      { title: 'LyricFindで検索する', image: LYRICFIND_FAVICON_URL },
      { title: "Let's EMOJIで検索する", image: LETS_EMOJI_FAVICON_URL },
    ]);

    const encodedTitle = encodeURIComponent('知識グラフ入門');

    // When: clicking Google AI, Google Search, Google Fonts, LyricFind, Let's EMOJI
    registeredItems[0].onClick?.();
    registeredItems[1].onClick?.();
    registeredItems[3].onClick?.();
    registeredItems[4].onClick?.();
    registeredItems[5].onClick?.();

    // Then: no lines inserted yet, URLs opened in order
    expect(insertLineSpy).not.toHaveBeenCalled();
    expect(openSpy).toHaveBeenNthCalledWith(1, `https://www.google.com/search?udm=50&q=${encodedTitle}`);
    expect(openSpy).toHaveBeenNthCalledWith(2, `https://www.google.com/search?q=${encodedTitle}`);
    expect(openSpy).toHaveBeenNthCalledWith(3, `https://fonts.google.com/?query=${encodedTitle}`);
    expect(openSpy).toHaveBeenNthCalledWith(
      4,
      `https://www.google.com/search?q=site:lyrics.lyricfind.com ${encodedTitle}`
    );
    expect(openSpy).toHaveBeenNthCalledWith(
      5,
      `https://www.google.com/search?q=site:lets-emoji.com ${encodedTitle}`
    );

    // When: clicking Weblio
    registeredItems[2].onClick?.();

    // Then: citation lines inserted at end in exact order, then Weblio URL opened
    expect(insertLineSpy).toHaveBeenCalledTimes(3);
    expect(insertLineSpy).toHaveBeenNthCalledWith(1, '知識グラフ入門[とは]', 1);
    expect(insertLineSpy).toHaveBeenNthCalledWith(2, '> ', 2);
    expect(insertLineSpy).toHaveBeenNthCalledWith(
      3,
      '> 引用）[https://www.weblio.jp/content/知識グラフ入門 知識グラフ入門とは - わかりやすく解説 Weblio辞書]',
      3
    );
    expect(openSpy).toHaveBeenNthCalledWith(6, `https://www.weblio.jp/content/${encodedTitle}`);
  });

  it('Given a missing or empty page title, When a search tool is clicked, Then it safely does nothing without inserting lines or opening a window', () => {
    // Given: PageMenu absent
    expect(initSearchTools()).toBe(0);

    // Given: PageMenu present but page title is empty / undefined
    const registeredItems: PageMenuItemOptions[] = [];
    const insertLineSpy = vi.fn();
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    window.scrapbox = {
      Page: {
        title: '',
        lines: [],
        insertLine: insertLineSpy,
      },
      PageMenu: {
        addItem: (item) => {
          registeredItems.push(item);
        },
      },
    };

    expect(initSearchTools()).toBe(6);

    // When: clicking every tool with empty string title
    for (const item of registeredItems) {
      item.onClick?.();
    }

    // When: Page is undefined
    delete window.scrapbox.Page;
    for (const item of registeredItems) {
      item.onClick?.();
    }

    // Then
    expect(insertLineSpy).not.toHaveBeenCalled();
    expect(openSpy).not.toHaveBeenCalled();
  });
});
