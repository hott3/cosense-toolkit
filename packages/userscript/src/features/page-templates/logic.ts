import { getFormattedDates } from '../../domain/date';

export interface PageTemplateDefinition {
  readonly id: string;
  readonly menuTitle: string;
  readonly lines: readonly string[];
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
