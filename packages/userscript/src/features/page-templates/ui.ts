import { addPageMenuItem, insertLineAtEnd } from '../../infrastructure/api/cosense';
import {
  addCustomTemplate,
  buildPageTemplates,
  deleteCustomTemplate,
  loadCustomTemplates,
  toPageTemplateDefinition,
  updateCustomTemplate,
  type CustomPageTemplateRecord,
  type PageTemplateDefinition,
} from './logic';

export const TEMPLATE_BACKDROP_ID = 'cosenseOpticTemplateBackdrop';
export const TEMPLATE_MODAL_ID = 'cosenseOpticTemplateModal';

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function appendTemplateLines(lines: readonly string[]): boolean {
  let inserted = false;
  for (const line of lines) {
    if (insertLineAtEnd(line)) {
      inserted = true;
    }
  }
  return inserted;
}

function registerCustomTemplateMenuItem(record: CustomPageTemplateRecord, now?: Date): boolean {
  const definition = toPageTemplateDefinition(record, now);
  return addPageMenuItem({
    title: () => definition.menuTitle,
    onClick: () => {
      const latest = loadCustomTemplates().find((item) => item.id === record.id) ?? record;
      const resolved = toPageTemplateDefinition(latest, now ?? new Date());
      appendTemplateLines(resolved.lines);
    },
  });
}

/**
 * Register built-in and browser-saved Scrapbox page template generators in the PageMenu.
 */
export function initPageTemplates(now?: Date): number {
  const builtInTemplates = buildPageTemplates(now);
  let registeredCount = 0;

  for (const template of builtInTemplates) {
    const registered = addPageMenuItem({
      title: () => template.menuTitle,
      onClick: () => {
        appendTemplateLines(template.lines);
      },
    });

    if (registered) {
      registeredCount += 1;
    }
  }

  for (const record of loadCustomTemplates()) {
    if (registerCustomTemplateMenuItem(record, now)) {
      registeredCount += 1;
    }
  }

  return registeredCount;
}

/**
 * Modal UI for creating, editing, deleting, and inserting browser-saved page templates.
 */
export class TemplateManagerModal {
  private backdropEl: HTMLElement | null = null;
  private editingId: string | null = null;

  constructor(private readonly onNotify?: (message: string) => void) {}

  init(): void {
    const existing = document.getElementById(TEMPLATE_BACKDROP_ID);
    if (existing) {
      this.backdropEl = existing;
      return;
    }

    const backdrop = document.createElement('div');
    backdrop.id = TEMPLATE_BACKDROP_ID;
    backdrop.innerHTML = `
      <div id="${TEMPLATE_MODAL_ID}" role="dialog" aria-modal="true" aria-labelledby="cosenseOpticTemplateTitle">
        <div class="optic-tpl-header">
          <div class="optic-tpl-title" id="cosenseOpticTemplateTitle">
            <span class="optic-tpl-dot"></span>
            <span>Page Templates</span>
          </div>
          <button class="optic-tpl-close" id="cosenseOpticTemplateClose" type="button" aria-label="Close">✕</button>
        </div>
        <div class="optic-tpl-body">
          <div>
            <div class="optic-tpl-section-label">Saved Templates (Browser)</div>
            <div class="optic-tpl-list" id="cosenseOpticCustomTemplateList"></div>
          </div>
          <form class="optic-tpl-form" id="cosenseOpticTemplateForm">
            <div class="optic-tpl-section-label" id="cosenseOpticTemplateFormLabel">New Template</div>
            <input class="optic-tpl-input" id="cosenseOpticTemplateName" type="text" placeholder="テンプレート名（例: 読書メモ）" required />
            <textarea class="optic-tpl-textarea" id="cosenseOpticTemplateContent" placeholder="1行目&#10;&#9;インデント行&#10;{{today}}"></textarea>
            <div class="optic-tpl-hint">利用可能な変数: {{today}} / {{yesterday}} / {{tomorrow}}</div>
            <div class="optic-tpl-form-footer">
              <button class="optic-tpl-btn" id="cosenseOpticTemplateCancel" type="button" hidden>キャンセル</button>
              <button class="optic-tpl-btn is-primary" id="cosenseOpticTemplateSubmit" type="submit">保存する</button>
            </div>
          </form>
          <div>
            <div class="optic-tpl-section-label">Built-in Templates</div>
            <div class="optic-tpl-list" id="cosenseOpticBuiltinTemplateList"></div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    this.backdropEl = backdrop;

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        this.close();
      }
    });

    document.getElementById('cosenseOpticTemplateClose')?.addEventListener('click', () => {
      this.close();
    });

    document.getElementById('cosenseOpticTemplateCancel')?.addEventListener('click', () => {
      this.resetForm();
    });

    document.getElementById('cosenseOpticTemplateForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    this.renderLists();
  }

  open(): void {
    this.init();
    this.renderLists();
    this.backdropEl?.classList.add('is-open');
  }

  close(): void {
    this.backdropEl?.classList.remove('is-open');
  }

  toggle(): void {
    if (this.backdropEl?.classList.contains('is-open')) {
      this.close();
    } else {
      this.open();
    }
  }

  private notify(message: string): void {
    this.onNotify?.(message);
  }

  private handleSubmit(): void {
    const nameInput = document.getElementById('cosenseOpticTemplateName') as HTMLInputElement | null;
    const contentInput = document.getElementById(
      'cosenseOpticTemplateContent'
    ) as HTMLTextAreaElement | null;
    if (!nameInput || !contentInput) return;

    const name = nameInput.value.trim();
    const content = contentInput.value;
    if (!name) {
      this.notify('テンプレート名を入力してください');
      return;
    }

    if (this.editingId) {
      const updated = updateCustomTemplate(this.editingId, name, content);
      if (updated) {
        this.notify(`Template updated: ${updated.name}`);
      }
    } else {
      const created = addCustomTemplate(name, content);
      registerCustomTemplateMenuItem(created);
      this.notify(`Template saved: ${created.name}`);
    }

    this.resetForm();
    this.renderLists();
  }

  private startEdit(record: CustomPageTemplateRecord): void {
    this.editingId = record.id;
    const labelEl = document.getElementById('cosenseOpticTemplateFormLabel');
    const nameInput = document.getElementById('cosenseOpticTemplateName') as HTMLInputElement | null;
    const contentInput = document.getElementById(
      'cosenseOpticTemplateContent'
    ) as HTMLTextAreaElement | null;
    const cancelBtn = document.getElementById('cosenseOpticTemplateCancel');
    const submitBtn = document.getElementById('cosenseOpticTemplateSubmit');

    if (labelEl) labelEl.textContent = 'Edit Template';
    if (nameInput) nameInput.value = record.name;
    if (contentInput) contentInput.value = record.content;
    if (cancelBtn) cancelBtn.removeAttribute('hidden');
    if (submitBtn) submitBtn.textContent = '更新する';
  }

  private resetForm(): void {
    this.editingId = null;
    const labelEl = document.getElementById('cosenseOpticTemplateFormLabel');
    const nameInput = document.getElementById('cosenseOpticTemplateName') as HTMLInputElement | null;
    const contentInput = document.getElementById(
      'cosenseOpticTemplateContent'
    ) as HTMLTextAreaElement | null;
    const cancelBtn = document.getElementById('cosenseOpticTemplateCancel');
    const submitBtn = document.getElementById('cosenseOpticTemplateSubmit');

    if (labelEl) labelEl.textContent = 'New Template';
    if (nameInput) nameInput.value = '';
    if (contentInput) contentInput.value = '';
    if (cancelBtn) cancelBtn.setAttribute('hidden', 'true');
    if (submitBtn) submitBtn.textContent = '保存する';
  }

  private insertLinesWithFeedback(lines: readonly string[], label: string): void {
    const ok = appendTemplateLines(lines);
    if (ok) {
      this.notify(`Inserted: ${label}`);
      this.close();
    } else {
      this.notify('ページ編集画面で実行してください');
    }
  }

  private renderLists(): void {
    this.renderCustomList();
    this.renderBuiltinList();
  }

  private renderCustomList(): void {
    const listEl = document.getElementById('cosenseOpticCustomTemplateList');
    if (!listEl) return;

    const records = loadCustomTemplates();
    if (records.length === 0) {
      listEl.innerHTML =
        '<div class="optic-tpl-empty">保存されたテンプレートはまだありません。下のフォームから作成できます。</div>';
      return;
    }

    listEl.innerHTML = records
      .map((record) => {
        const preview = record.content.split(/\r?\n/)[0] || '(empty)';
        return `
          <div class="optic-tpl-item" data-template-id="${escapeHtml(record.id)}">
            <div class="optic-tpl-item-info">
              <div class="optic-tpl-item-name">${escapeHtml(record.name)}</div>
              <div class="optic-tpl-item-preview">${escapeHtml(preview)}</div>
            </div>
            <div class="optic-tpl-actions">
              <button class="optic-tpl-btn is-primary" data-action="insert" type="button">挿入</button>
              <button class="optic-tpl-btn" data-action="edit" type="button">編集</button>
              <button class="optic-tpl-btn is-danger" data-action="delete" type="button">削除</button>
            </div>
          </div>
        `;
      })
      .join('');

    listEl.querySelectorAll<HTMLElement>('.optic-tpl-item').forEach((row) => {
      const id = row.getAttribute('data-template-id');
      const record = records.find((item) => item.id === id);
      if (!record) return;

      row.querySelector('[data-action="insert"]')?.addEventListener('click', () => {
        const resolved = toPageTemplateDefinition(record, new Date());
        this.insertLinesWithFeedback(resolved.lines, record.name);
      });

      row.querySelector('[data-action="edit"]')?.addEventListener('click', () => {
        this.startEdit(record);
      });

      row.querySelector('[data-action="delete"]')?.addEventListener('click', () => {
        if (deleteCustomTemplate(record.id)) {
          if (this.editingId === record.id) {
            this.resetForm();
          }
          this.notify(`Template deleted: ${record.name}`);
          this.renderLists();
        }
      });
    });
  }

  private renderBuiltinList(): void {
    const listEl = document.getElementById('cosenseOpticBuiltinTemplateList');
    if (!listEl) return;

    const builtIns: readonly PageTemplateDefinition[] = buildPageTemplates();
    listEl.innerHTML = builtIns
      .map((tpl) => {
        const preview = tpl.lines[0] || '';
        return `
          <div class="optic-tpl-item" data-builtin-id="${escapeHtml(tpl.id)}">
            <div class="optic-tpl-item-info">
              <div class="optic-tpl-item-name">${escapeHtml(tpl.menuTitle)}</div>
              <div class="optic-tpl-item-preview">${escapeHtml(preview)}</div>
            </div>
            <div class="optic-tpl-actions">
              <button class="optic-tpl-btn is-primary" data-action="insert-builtin" type="button">挿入</button>
              <button class="optic-tpl-btn" data-action="duplicate-builtin" type="button">複製</button>
            </div>
          </div>
        `;
      })
      .join('');

    listEl.querySelectorAll<HTMLElement>('.optic-tpl-item').forEach((row) => {
      const id = row.getAttribute('data-builtin-id');
      const tpl = builtIns.find((item) => item.id === id);
      if (!tpl) return;

      row.querySelector('[data-action="insert-builtin"]')?.addEventListener('click', () => {
        this.insertLinesWithFeedback(tpl.lines, tpl.menuTitle);
      });

      row.querySelector('[data-action="duplicate-builtin"]')?.addEventListener('click', () => {
        this.resetForm();
        const nameInput = document.getElementById(
          'cosenseOpticTemplateName'
        ) as HTMLInputElement | null;
        const contentInput = document.getElementById(
          'cosenseOpticTemplateContent'
        ) as HTMLTextAreaElement | null;
        if (nameInput) nameInput.value = `${tpl.id}-copy`;
        if (contentInput) contentInput.value = tpl.lines.join('\n');
        this.notify('フォームに複製しました');
      });
    });
  }
}
