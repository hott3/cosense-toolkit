export const GOOGLE_FAVICON_URL =
  'https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw';
export const WEBLIO_FAVICON_URL = 'https://cdn.weblio.jp/e7/img/favicon/www.png';
export const GOOGLE_FONTS_FAVICON_URL =
  'https://www.gstatic.com/images/icons/material/apps/fonts/1x/catalog/v5/favicon.svg';
export const LYRICFIND_FAVICON_URL = 'https://lyrics.lyricfind.com/LF-favicon.svg';
export const LETS_EMOJI_FAVICON_URL = 'https://lets-emoji.com/img/favicon_96x96.png';

/**
 * Build the Google AI search URL for a given page title.
 */
export function buildGoogleAiSearchUrl(title: string): string {
  return `https://www.google.com/search?udm=50&q=${encodeURIComponent(title)}`;
}

/**
 * Build the Google Web search URL for a given page title.
 */
export function buildGoogleSearchUrl(title: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(title)}`;
}

/**
 * Build the Weblio dictionary URL for a given page title.
 */
export function buildWeblioUrl(title: string): string {
  return `https://www.weblio.jp/content/${encodeURIComponent(title)}`;
}

/**
 * Build the Google Fonts search URL for a given page title.
 */
export function buildGoogleFontsUrl(title: string): string {
  return `https://fonts.google.com/?query=${encodeURIComponent(title)}`;
}

/**
 * Build the Google site-restricted LyricFind search URL for a given page title.
 */
export function buildLyricFindSearchUrl(title: string): string {
  return `https://www.google.com/search?q=site:lyrics.lyricfind.com ${encodeURIComponent(title)}`;
}

/**
 * Build the Google site-restricted Let's EMOJI search URL for a given page title.
 */
export function buildLetsEmojiSearchUrl(title: string): string {
  return `https://www.google.com/search?q=site:lets-emoji.com ${encodeURIComponent(title)}`;
}

/**
 * Build Scrapbox citation lines appended before opening Weblio dictionary.
 */
export function buildWeblioCitationLines(title: string): readonly string[] {
  return [
    `${title}[とは]`,
    '> ',
    `> 引用）[https://www.weblio.jp/content/${title} ${title}とは - わかりやすく解説 Weblio辞書]`,
  ];
}

export interface SearchToolDefinition {
  readonly id: string;
  readonly title: string;
  readonly image: string;
  readonly buildUrl: (title: string) => string;
  readonly buildCitationLines?: (title: string) => readonly string[];
}

export const SEARCH_TOOL_DEFINITIONS: readonly SearchToolDefinition[] = [
  {
    id: 'google-ai',
    title: 'Google AIモードで検索する',
    image: GOOGLE_FAVICON_URL,
    buildUrl: buildGoogleAiSearchUrl,
  },
  {
    id: 'google-search',
    title: 'Google検索で検索する',
    image: GOOGLE_FAVICON_URL,
    buildUrl: buildGoogleSearchUrl,
  },
  {
    id: 'weblio',
    title: 'Weblio辞書で検索する',
    image: WEBLIO_FAVICON_URL,
    buildUrl: buildWeblioUrl,
    buildCitationLines: buildWeblioCitationLines,
  },
  {
    id: 'google-fonts',
    title: 'Google Fontsで検索する',
    image: GOOGLE_FONTS_FAVICON_URL,
    buildUrl: buildGoogleFontsUrl,
  },
  {
    id: 'lyricfind',
    title: 'LyricFindで検索する',
    image: LYRICFIND_FAVICON_URL,
    buildUrl: buildLyricFindSearchUrl,
  },
  {
    id: 'lets-emoji',
    title: "Let's EMOJIで検索する",
    image: LETS_EMOJI_FAVICON_URL,
    buildUrl: buildLetsEmojiSearchUrl,
  },
];
