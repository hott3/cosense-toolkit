import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  TODAY_PAGE_CLASS,
  buildTodayPageSelector,
  buildTodayPageTitle,
} from '../../src/features/today-page-marker/logic';
import { TODAY_PAGE_MARKER_CSS } from '../../src/features/today-page-marker/style';
import { initTodayPageMarker, markTodayPage } from '../../src/features/today-page-marker/ui';

describe('features/today-page-marker (Given-When-Then)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    delete window.scrapbox;
    delete window.cosense;
  });

  afterEach(() => {
    vi.useRealTimers();
    delete window.scrapbox;
    delete window.cosense;
  });

  it('Given a date or system clock, When buildTodayPageTitle and buildTodayPageSelector are called, Then they format as 日報 YYYYMMDD', () => {
    // Given
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 15, 12, 0, 0));
    const regularDate = new Date(2026, 10, 15, 21, 0, 0);
    const singleDigitDate = new Date(2026, 0, 5, 9, 30, 0);

    // When
    const defaultTitle = buildTodayPageTitle();
    const defaultSelector = buildTodayPageSelector();
    const regularTitle = buildTodayPageTitle(regularDate);
    const regularSelector = buildTodayPageSelector(regularDate);
    const singleDigitTitle = buildTodayPageTitle(singleDigitDate);
    const singleDigitSelector = buildTodayPageSelector(singleDigitDate);

    // Then
    expect(defaultTitle).toBe('日報 20261115');
    expect(defaultSelector).toBe('[data-page-title="日報 20261115"]');
    expect(regularTitle).toBe('日報 20261115');
    expect(regularSelector).toBe('[data-page-title="日報 20261115"]');
    expect(singleDigitTitle).toBe('日報 20260105');
    expect(singleDigitSelector).toBe('[data-page-title="日報 20260105"]');
  });

  it('Given a page grid containing today and other cards, When markTodayPage runs, Then only the matching card receives the today-page class and it returns true', () => {
    // Given
    const now = new Date(2026, 10, 15);
    document.body.innerHTML = `
      <ul class="grid">
        <li class="page-list-item" data-page-title="日報 20261114"><a href="#">Yesterday</a></li>
        <li class="page-list-item" data-page-title="日報 20261115"><a href="#">Today</a></li>
        <li class="page-list-item" data-page-title="メモ"><a href="#">Memo</a></li>
      </ul>
    `;

    const scopedRoot = document.createElement('div');
    scopedRoot.innerHTML = `
      <ul class="grid">
        <li class="page-list-item" data-page-title="日報 20261115"><a href="#">Scoped Today</a></li>
      </ul>
    `;

    // When
    const marked = markTodayPage(now);
    const scopedMarked = markTodayPage(now, scopedRoot);

    // Then
    expect(marked).toBe(true);
    expect(scopedMarked).toBe(true);
    const yesterdayCard = document.querySelector('[data-page-title="日報 20261114"]')!;
    const todayCard = document.querySelector('[data-page-title="日報 20261115"]')!;
    const memoCard = document.querySelector('[data-page-title="メモ"]')!;
    const scopedCard = scopedRoot.querySelector('[data-page-title="日報 20261115"]')!;

    expect(todayCard.classList.contains(TODAY_PAGE_CLASS)).toBe(true);
    expect(scopedCard.classList.contains(TODAY_PAGE_CLASS)).toBe(true);
    expect(yesterdayCard.classList.contains(TODAY_PAGE_CLASS)).toBe(false);
    expect(memoCard.classList.contains(TODAY_PAGE_CLASS)).toBe(false);
  });

  it('Given no matching today card in DOM, When markTodayPage runs, Then it safely returns false without altering other cards', () => {
    // Given
    const now = new Date(2026, 10, 15);
    document.body.innerHTML = `
      <ul class="grid">
        <li class="page-list-item" data-page-title="日報 20261114"><a href="#">Yesterday</a></li>
      </ul>
    `;

    // When
    const marked = markTodayPage(now);

    // Then
    expect(marked).toBe(false);
    const yesterdayCard = document.querySelector('[data-page-title="日報 20261114"]')!;
    expect(yesterdayCard.classList.contains(TODAY_PAGE_CLASS)).toBe(false);
  });

  it('Given Scrapbox page:changed lifecycle hook, When initTodayPageMarker runs and page:changed fires, Then today card is marked on init and re-marked on navigation', () => {
    // Given
    let currentDate = new Date(2026, 10, 15);
    let pageChangedHandler: (() => void) | undefined;

    window.scrapbox = {
      on: (event, callback) => {
        if (event === 'page:changed') {
          pageChangedHandler = callback;
        }
      },
    };

    document.body.innerHTML = `
      <ul class="grid">
        <li class="page-list-item" data-page-title="日報 20261115"><a href="#">Today</a></li>
      </ul>
    `;

    // When: initializing marker
    initTodayPageMarker(() => currentDate);

    // Then: initial today card is marked and listener is registered
    expect(
      document
        .querySelector('[data-page-title="日報 20261115"]')!
        .classList.contains(TODAY_PAGE_CLASS)
    ).toBe(true);
    expect(pageChangedHandler).toBeDefined();

    // When: page re-renders after navigation on the next day and page:changed fires
    currentDate = new Date(2026, 10, 16);
    document.body.innerHTML = `
      <ul class="grid">
        <li class="page-list-item" data-page-title="日報 20261115"><a href="#">Previous</a></li>
        <li class="page-list-item" data-page-title="日報 20261116"><a href="#">Next Today</a></li>
      </ul>
    `;
    pageChangedHandler?.();

    // Then: newly rendered today card is marked
    expect(
      document
        .querySelector('[data-page-title="日報 20261116"]')!
        .classList.contains(TODAY_PAGE_CLASS)
    ).toBe(true);
    expect(
      document
        .querySelector('[data-page-title="日報 20261115"]')!
        .classList.contains(TODAY_PAGE_CLASS)
    ).toBe(false);
  });

  it('Given default system clock and Scrapbox page:changed hook, When initTodayPageMarker is called with no arguments, Then it uses current Date on init and page:changed', () => {
    // Given
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 15, 10, 0, 0));
    let pageChangedHandler: (() => void) | undefined;

    window.scrapbox = {
      on: (event, callback) => {
        if (event === 'page:changed') {
          pageChangedHandler = callback;
        }
      },
    };

    document.body.innerHTML = `
      <ul class="grid">
        <li class="page-list-item" data-page-title="日報 20261115"><a href="#">Today</a></li>
      </ul>
    `;

    // When
    initTodayPageMarker();

    // Then
    expect(
      document
        .querySelector('[data-page-title="日報 20261115"]')!
        .classList.contains(TODAY_PAGE_CLASS)
    ).toBe(true);

    // When: DOM re-renders on the same day and page:changed triggers
    document.body.innerHTML = `
      <ul class="grid">
        <li class="page-list-item" data-page-title="日報 20261115"><a href="#">Reloaded Today</a></li>
      </ul>
    `;
    pageChangedHandler?.();

    // Then
    expect(
      document
        .querySelector('[data-page-title="日報 20261115"]')!
        .classList.contains(TODAY_PAGE_CLASS)
    ).toBe(true);
  });

  it('Given TODAY_PAGE_MARKER_CSS, When inspecting design tokens, Then it references the W3C DTCG design system tokens without legacy prefixes', () => {
    // Given / When / Then
    expect(TODAY_PAGE_MARKER_CSS).toContain('--accent-emerald-bead');
    expect(TODAY_PAGE_MARKER_CSS).toContain('--specular-top-edge');
    expect(TODAY_PAGE_MARKER_CSS).toContain('--radius-glass-pill');
    expect(TODAY_PAGE_MARKER_CSS).toContain('--blur-lens-card');
    expect(TODAY_PAGE_MARKER_CSS).toContain('.grid li.page-list-item.today-page');
    expect(TODAY_PAGE_MARKER_CSS).not.toContain('hot3');
  });
});
