export interface ScrapboxLine {
  id: string;
  text: string;
}

export interface ScrapboxPage {
  title: string;
  lines: ScrapboxLine[];
  insertLine?: (text: string, lineIndex: number) => void;
}

export interface PageMenuItemOptions {
  title: string | (() => string);
  image?: string;
  onClick?: () => void;
}

export interface PageMenuApi {
  addMenu?: (options: PageMenuItemOptions) => void;
  addItem?: (options: PageMenuItemOptions) => void;
}

export interface PopupMenuButtonOptions {
  title: string;
  onClick?: (text: string) => string | void;
}

export interface ScrapboxGlobal {
  Project?: { name?: string };
  Page?: ScrapboxPage;
  PageMenu?: PageMenuApi | ((menuName?: string) => PageMenuApi);
  PopupMenu?: {
    addButton?: (options: PopupMenuButtonOptions) => void;
  };
  on?: (event: string, callback: (...args: unknown[]) => void) => void;
}

declare global {
  interface Window {
    __cosenseToolkitInitialized?: boolean;
    scrapbox?: ScrapboxGlobal;
    cosense?: ScrapboxGlobal;
  }
}

function getPrimaryHost(): ScrapboxGlobal | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.cosense ?? window.scrapbox;
}

function resolvePageMenu(): PageMenuApi | undefined {
  if (typeof window === 'undefined') return undefined;
  const candidate = window.scrapbox?.PageMenu ?? window.cosense?.PageMenu;
  if (!candidate) return undefined;
  return typeof candidate === 'function' ? candidate() : candidate;
}

/**
 * Return the active Scrapbox/Cosense project name when available.
 */
export function getProjectName(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.scrapbox?.Project?.name ?? window.cosense?.Project?.name;
}

/**
 * Return the active page title when available.
 */
export function getCurrentPageTitle(): string | undefined {
  return getPrimaryHost()?.Page?.title ?? window.scrapbox?.Page?.title;
}

/**
 * Return the active page lines, or an empty array when unavailable.
 */
export function getPageLines(): readonly ScrapboxLine[] {
  const page = getPrimaryHost()?.Page ?? window.scrapbox?.Page;
  return page?.lines ?? [];
}

/**
 * Insert a text line at the end of the current page.
 */
export function insertLineAtEnd(text: string): boolean {
  const page = getPrimaryHost()?.Page ?? window.scrapbox?.Page;
  if (!page?.insertLine) return false;
  page.insertLine(text, page.lines.length);
  return true;
}

/**
 * Register a menu item on the Scrapbox/Cosense PageMenu.
 */
export function addPageMenuItem(item: PageMenuItemOptions): boolean {
  const menu = resolvePageMenu();
  if (!menu?.addItem) return false;
  menu.addItem(item);
  return true;
}

/**
 * Subscribe to Scrapbox `page:changed` lifecycle events.
 */
export function onPageChanged(callback: () => void): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.scrapbox?.on ? window.scrapbox : window.cosense;
  if (!host?.on) return false;
  host.on('page:changed', callback);
  return true;
}
