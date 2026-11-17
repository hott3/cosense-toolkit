import { getFormattedDates } from '../../domain/date';
import { readStorageItem, writeStorageItem } from '../../infrastructure/api/storage';

export const CUSTOM_TEMPLATES_STORAGE_KEY = 'cosense_toolkit_custom_templates_v1';

export interface PageTemplateDefinition {
  readonly id: string;
  readonly menuTitle: string;
  readonly lines: readonly string[];
}

export interface CustomPageTemplateRecord {
  readonly id: string;
  readonly name: string;
  readonly content: string;
}

/**
 * Expand supported date placeholders (`{{today}}`, `{{yesterday}}`, `{{tomorrow}}`) in template text.
 */
export function expandTemplatePlaceholders(text: string, now?: Date): string {
  const dates = getFormattedDates(now);
  return text
    .replaceAll('{{today}}', dates.today)
    .replaceAll('{{yesterday}}', dates.yesterday)
    .replaceAll('{{tomorrow}}', dates.tomorrow);
}

/**
 * Convert a saved custom template record into a Scrapbox PageTemplateDefinition.
 */
export function toPageTemplateDefinition(
  record: CustomPageTemplateRecord,
  now?: Date
): PageTemplateDefinition {
  const expanded = expandTemplatePlaceholders(record.content, now);
  return {
    id: record.id,
    menuTitle: `${record.name}のテンプレートを出力する`,
    lines: expanded.split(/\r?\n/),
  };
}

function isCustomTemplateRecord(value: unknown): value is CustomPageTemplateRecord {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.content === 'string'
  );
}

/**
 * Load user-saved custom templates from browser localStorage safely.
 */
export function loadCustomTemplates(): CustomPageTemplateRecord[] {
  const raw = readStorageItem(CUSTOM_TEMPLATES_STORAGE_KEY, '[]');
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCustomTemplateRecord);
  } catch {
    return [];
  }
}

/**
 * Persist custom templates to browser localStorage.
 */
export function saveCustomTemplates(templates: readonly CustomPageTemplateRecord[]): boolean {
  return writeStorageItem(CUSTOM_TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
}

function createTemplateId(): string {
  return `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Create and persist a new custom template in localStorage.
 */
export function addCustomTemplate(name: string, content: string): CustomPageTemplateRecord {
  const normalizedName = name.trim();
  if (!normalizedName) {
    throw new Error('Template name must not be empty');
  }

  const record: CustomPageTemplateRecord = {
    id: createTemplateId(),
    name: normalizedName,
    content,
  };
  const current = loadCustomTemplates();
  saveCustomTemplates([...current, record]);
  return record;
}

/**
 * Update an existing custom template by ID in localStorage.
 */
export function updateCustomTemplate(
  id: string,
  name: string,
  content: string
): CustomPageTemplateRecord | null {
  const normalizedName = name.trim();
  if (!normalizedName) {
    throw new Error('Template name must not be empty');
  }

  const current = loadCustomTemplates();
  const index = current.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const updated: CustomPageTemplateRecord = {
    id,
    name: normalizedName,
    content,
  };
  const next = [...current];
  next[index] = updated;
  saveCustomTemplates(next);
  return updated;
}

/**
 * Delete a custom template by ID from localStorage.
 */
export function deleteCustomTemplate(id: string): boolean {
  const current = loadCustomTemplates();
  const next = current.filter((item) => item.id !== id);
  if (next.length === current.length) return false;
  saveCustomTemplates(next);
  return true;
}

/**
 * Build the supported Scrapbox page template definitions for the given date.
 */
export function buildPageTemplates(now?: Date): readonly PageTemplateDefinition[] {
  const dates = getFormattedDates(now);

  return [
    {
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
        dates.today,
      ],
    },
    {
      id: 'daily-report',
      menuTitle: `日報 ${dates.today}のテンプレートを出力する`,
      lines: [
        `前の日：[${dates.yesterday}]  次の日：[${dates.tomorrow}]`,
        '',
        `[https://placehold.jp/28/152x152.png?text=日報%20${dates.today}]`,
        '',
        '[hott3.icon]',
        '<報告>',
        '<相談>',
        '<その他>',
      ],
    },
    {
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
    },
  ];
}
