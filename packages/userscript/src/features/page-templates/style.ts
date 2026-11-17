export const TEMPLATE_MODAL_CSS = `
  /* Page Template Manager Modal (Optical Glass) */
  #cosenseOpticTemplateBackdrop {
    position: fixed;
    inset: 0;
    z-index: 980;
    background: rgba(4, 8, 15, 0.62);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 220ms ease;
  }

  #cosenseOpticTemplateBackdrop.is-open {
    opacity: 1;
    pointer-events: auto;
  }

  #cosenseOpticTemplateModal {
    width: min(620px, 100%);
    max-height: min(84vh, 720px);
    display: flex;
    flex-direction: column;
    border-radius: 22px;
    background: rgba(8, 14, 26, 0.88);
    backdrop-filter: blur(22px) saturate(150%);
    -webkit-backdrop-filter: blur(22px) saturate(150%);
    border-top: 1px solid rgba(255, 255, 255, 0.36);
    border-left: 1px solid rgba(255, 255, 255, 0.16);
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(0, 0, 0, 0.55);
    box-shadow: 0 28px 64px -12px rgba(0, 0, 0, 0.85);
    color: #F6F0E0;
    overflow: hidden;
    transform: translateY(10px) scale(0.985);
    transition: transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1.0);
  }

  #cosenseOpticTemplateBackdrop.is-open #cosenseOpticTemplateModal {
    transform: translateY(0) scale(1);
  }

  html[data-cosense-theme="frosted-daylight"] #cosenseOpticTemplateModal,
  html[data-cosense-theme="modern-clean"] #cosenseOpticTemplateModal {
    background: rgba(255, 255, 255, 0.94);
    border: 1px solid rgba(15, 23, 42, 0.12);
    color: #0F172A;
    box-shadow: 0 24px 56px -12px rgba(15, 23, 42, 0.22);
  }

  #cosenseOpticTemplateModal .optic-tpl-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.10);
  }

  html[data-cosense-theme="frosted-daylight"] #cosenseOpticTemplateModal .optic-tpl-header,
  html[data-cosense-theme="modern-clean"] #cosenseOpticTemplateModal .optic-tpl-header {
    border-bottom-color: rgba(15, 23, 42, 0.08);
  }

  #cosenseOpticTemplateModal .optic-tpl-title {
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  #cosenseOpticTemplateModal .optic-tpl-dot {
    width: 9px;
    height: 9px;
    border-radius: 9999px;
    background: #38BDF8;
    box-shadow: 0 0 10px rgba(56, 189, 248, 0.75);
  }

  #cosenseOpticTemplateModal .optic-tpl-close {
    width: 30px;
    height: 30px;
    border-radius: 9999px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: inherit;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.16);
  }

  html[data-cosense-theme="frosted-daylight"] #cosenseOpticTemplateModal .optic-tpl-close,
  html[data-cosense-theme="modern-clean"] #cosenseOpticTemplateModal .optic-tpl-close {
    background: rgba(15, 23, 42, 0.04);
    border-color: rgba(15, 23, 42, 0.14);
  }

  #cosenseOpticTemplateModal .optic-tpl-body {
    flex: 1;
    overflow-y: auto;
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    font-size: 13px;
  }

  #cosenseOpticTemplateModal .optic-tpl-section-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #C8B996;
    margin-bottom: 8px;
  }

  html[data-cosense-theme="frosted-daylight"] #cosenseOpticTemplateModal .optic-tpl-section-label,
  html[data-cosense-theme="modern-clean"] #cosenseOpticTemplateModal .optic-tpl-section-label {
    color: #64748B;
  }

  #cosenseOpticTemplateModal .optic-tpl-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  #cosenseOpticTemplateModal .optic-tpl-empty {
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px dashed rgba(255, 255, 255, 0.14);
    color: #94A3B8;
    font-size: 12px;
  }

  html[data-cosense-theme="frosted-daylight"] #cosenseOpticTemplateModal .optic-tpl-empty,
  html[data-cosense-theme="modern-clean"] #cosenseOpticTemplateModal .optic-tpl-empty {
    border-color: rgba(15, 23, 42, 0.16);
    color: #64748B;
  }

  #cosenseOpticTemplateModal .optic-tpl-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.10);
    background: rgba(255, 255, 255, 0.03);
  }

  html[data-cosense-theme="frosted-daylight"] #cosenseOpticTemplateModal .optic-tpl-item,
  html[data-cosense-theme="modern-clean"] #cosenseOpticTemplateModal .optic-tpl-item {
    border-color: rgba(15, 23, 42, 0.10);
    background: rgba(15, 23, 42, 0.03);
  }

  #cosenseOpticTemplateModal .optic-tpl-item-info {
    min-width: 0;
    flex: 1;
  }

  #cosenseOpticTemplateModal .optic-tpl-item-name {
    font-weight: 600;
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  #cosenseOpticTemplateModal .optic-tpl-item-preview {
    font-size: 11px;
    opacity: 0.7;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 2px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  }

  #cosenseOpticTemplateModal .optic-tpl-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  #cosenseOpticTemplateModal .optic-tpl-btn {
    padding: 5px 10px;
    border-radius: 9px;
    border: 1px solid rgba(255, 255, 255, 0.16);
    background: rgba(255, 255, 255, 0.05);
    color: inherit;
    font-size: 11px;
    cursor: pointer;
    transition: border-color 160ms ease, background-color 160ms ease;
  }

  #cosenseOpticTemplateModal .optic-tpl-btn:hover {
    border-color: rgba(246, 240, 224, 0.55);
    background: rgba(255, 255, 255, 0.10);
  }

  #cosenseOpticTemplateModal .optic-tpl-btn.is-primary {
    background: rgba(56, 189, 248, 0.18);
    border-color: rgba(56, 189, 248, 0.48);
    color: #E0F2FE;
  }

  #cosenseOpticTemplateModal .optic-tpl-btn.is-danger:hover {
    border-color: rgba(248, 113, 113, 0.65);
    color: #FCA5A5;
  }

  html[data-cosense-theme="frosted-daylight"] #cosenseOpticTemplateModal .optic-tpl-btn,
  html[data-cosense-theme="modern-clean"] #cosenseOpticTemplateModal .optic-tpl-btn {
    border-color: rgba(15, 23, 42, 0.14);
    background: rgba(15, 23, 42, 0.04);
  }

  html[data-cosense-theme="frosted-daylight"] #cosenseOpticTemplateModal .optic-tpl-btn.is-primary,
  html[data-cosense-theme="modern-clean"] #cosenseOpticTemplateModal .optic-tpl-btn.is-primary {
    background: rgba(2, 132, 199, 0.12);
    border-color: rgba(2, 132, 199, 0.40);
    color: #0369A1;
  }

  #cosenseOpticTemplateModal .optic-tpl-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.10);
    background: rgba(255, 255, 255, 0.02);
  }

  html[data-cosense-theme="frosted-daylight"] #cosenseOpticTemplateModal .optic-tpl-form,
  html[data-cosense-theme="modern-clean"] #cosenseOpticTemplateModal .optic-tpl-form {
    border-color: rgba(15, 23, 42, 0.10);
    background: rgba(15, 23, 42, 0.02);
  }

  #cosenseOpticTemplateModal .optic-tpl-input,
  #cosenseOpticTemplateModal .optic-tpl-textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 8px 10px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.16);
    background: rgba(4, 8, 15, 0.45);
    color: inherit;
    font-size: 12px;
    font-family: inherit;
    outline: none;
  }

  #cosenseOpticTemplateModal .optic-tpl-textarea {
    min-height: 110px;
    resize: vertical;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    line-height: 1.5;
  }

  html[data-cosense-theme="frosted-daylight"] #cosenseOpticTemplateModal .optic-tpl-input,
  html[data-cosense-theme="frosted-daylight"] #cosenseOpticTemplateModal .optic-tpl-textarea,
  html[data-cosense-theme="modern-clean"] #cosenseOpticTemplateModal .optic-tpl-input,
  html[data-cosense-theme="modern-clean"] #cosenseOpticTemplateModal .optic-tpl-textarea {
    background: rgba(255, 255, 255, 0.85);
    border-color: rgba(15, 23, 42, 0.16);
  }

  #cosenseOpticTemplateModal .optic-tpl-hint {
    font-size: 11px;
    opacity: 0.72;
  }

  #cosenseOpticTemplateModal .optic-tpl-form-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  }
`;
