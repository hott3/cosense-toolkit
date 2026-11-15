export const THEME_SWITCHER_CSS = `
  /* Theme Switcher Popover Menu */
  #cosenseOpticThemeMenu {
    position: fixed;
    bottom: 78px;
    right: 22px;
    width: 260px;
    z-index: 960;
    padding: 10px;
    border-radius: 20px;
    background: rgba(8, 14, 26, 0.82);
    backdrop-filter: blur(22px) saturate(145%);
    -webkit-backdrop-filter: blur(22px) saturate(145%);
    border-top: 1px solid rgba(255, 255, 255, 0.42);
    border-left: 1px solid rgba(255, 255, 255, 0.20);
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(0, 0, 0, 0.55);
    box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.82), 0 0 28px -8px rgba(246, 240, 224, 0.18);
    opacity: 0;
    pointer-events: none;
    visibility: hidden;
    transform: translate3d(0, 10px, 0) scale(0.96);
    transition: opacity 180ms ease, transform 240ms cubic-bezier(0.34, 1.56, 0.64, 1), visibility 180ms ease;
  }

  #cosenseOpticThemeMenu.is-open {
    opacity: 1;
    pointer-events: auto;
    visibility: visible;
    transform: translate3d(0, 0, 0) scale(1);
  }

  html[data-cosense-theme="frosted-daylight"] #cosenseOpticThemeMenu,
  html[data-cosense-theme="modern-clean"] #cosenseOpticThemeMenu {
    background: rgba(255, 255, 255, 0.90);
    border: 1px solid rgba(15, 23, 42, 0.12);
    box-shadow: 0 20px 44px -10px rgba(15, 23, 42, 0.20);
  }

  #cosenseOpticThemeMenu .optic-menu-title {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #7F7663;
    padding: 4px 8px 8px;
  }

  .optic-theme-item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 9px 10px;
    margin-bottom: 4px;
    border-radius: 12px;
    border: 1px solid transparent;
    background: transparent;
    cursor: pointer;
    text-align: left;
    color: #C8B996;
    font-size: 12.5px;
    transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease, transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .optic-theme-item:last-child { margin-bottom: 0; }

  .optic-theme-item:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #F6F0E0;
  }

  .optic-theme-item.is-active {
    background: rgba(255, 255, 255, 0.09);
    border-color: rgba(255, 255, 255, 0.26);
    color: #F6F0E0;
  }

  html[data-cosense-theme="frosted-daylight"] .optic-theme-item,
  html[data-cosense-theme="modern-clean"] .optic-theme-item {
    color: #475569;
  }

  html[data-cosense-theme="frosted-daylight"] .optic-theme-item:hover,
  html[data-cosense-theme="modern-clean"] .optic-theme-item:hover {
    background: rgba(15, 23, 42, 0.05);
    color: #0F172A;
  }

  html[data-cosense-theme="frosted-daylight"] .optic-theme-item.is-active,
  html[data-cosense-theme="modern-clean"] .optic-theme-item.is-active {
    background: rgba(14, 165, 233, 0.10);
    border-color: rgba(14, 165, 233, 0.35);
    color: #0F172A;
  }

  .optic-theme-item-left {
    display: flex;
    align-items: center;
    gap: 9px;
    min-width: 0;
  }

  .optic-theme-swatch {
    width: 16px;
    height: 16px;
    border-radius: 9999px;
    flex-shrink: 0;
    border: 1px solid rgba(255, 255, 255, 0.45);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  }

  .optic-theme-badge {
    font-size: 10px;
    padding: 2px 7px;
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.16);
    opacity: 0.85;
  }

  html[data-cosense-theme="frosted-daylight"] .optic-theme-badge,
  html[data-cosense-theme="modern-clean"] .optic-theme-badge {
    border-color: rgba(15, 23, 42, 0.14);
  }

  @media (max-width: 640px) {
    #cosenseOpticThemeMenu { bottom: 66px; right: 14px; }
  }
`;
