export const RUNTIME_CSS = `
  /* Switch from CSS fallback pools to JS 3-layer fluid field when active */
  html:not([data-hot3-theme="modern-clean"]) body[data-optic-js="active"]::before,
  html:not([data-hot3-theme="modern-clean"]) body[data-optic-js="active"]::after {
    display: none !important;
    animation: none !important;
  }

  /* 1. Lightweight Soft-Gradient Liquid Backdrop (Night & Day variants) */
  #hot3OpticFluidField {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: -1;
    overflow: hidden;
    contain: layout style paint;
  }

  #hot3OpticFluidField[data-fluid-mode="off"] {
    display: none !important;
  }

  #hot3OpticFluidField .optic-fluid-pool {
    position: absolute;
    border-radius: 50%;
    will-change: transform;
    animation: opticDriftFloat 18s ease-in-out infinite alternate;
    transition: transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1.0);
  }

  #hot3OpticFluidField.is-pulsing .optic-fluid-pool {
    transform: scale(1.26) !important;
  }

  /* Night Pools */
  #hot3OpticFluidField[data-fluid-mode="night"] .optic-pool-1 {
    width: 680px; height: 680px; top: -150px; right: -160px;
    background: radial-gradient(circle at 45% 45%, rgba(200, 185, 150, 0.14) 0%, rgba(45, 80, 130, 0.18) 32%, rgba(30, 60, 110, 0.06) 56%, transparent 74%);
    animation-duration: 22s;
  }
  #hot3OpticFluidField[data-fluid-mode="night"] .optic-pool-2 {
    width: 740px; height: 740px; bottom: -80px; left: -220px;
    background: radial-gradient(circle at 50% 50%, rgba(30, 60, 110, 0.26) 0%, rgba(70, 50, 95, 0.12) 36%, rgba(20, 40, 80, 0.04) 58%, transparent 75%);
    animation-duration: 26s; animation-delay: -7s;
  }
  #hot3OpticFluidField[data-fluid-mode="night"] .optic-pool-3 {
    width: 480px; height: 480px; top: 40%; left: 16%;
    background: radial-gradient(circle, rgba(246, 240, 224, 0.07) 0%, rgba(20, 45, 80, 0.14) 38%, transparent 72%);
    animation-duration: 16s; animation-delay: -3s;
  }

  /* Day Pools */
  #hot3OpticFluidField[data-fluid-mode="day"] .optic-pool-1 {
    width: 680px; height: 680px; top: -140px; right: -150px;
    background: radial-gradient(circle at 45% 45%, rgba(56, 189, 248, 0.20) 0%, rgba(125, 211, 252, 0.11) 38%, transparent 74%);
    animation-duration: 22s;
  }
  #hot3OpticFluidField[data-fluid-mode="day"] .optic-pool-2 {
    width: 720px; height: 720px; bottom: -90px; left: -200px;
    background: radial-gradient(circle at 50% 50%, rgba(167, 139, 250, 0.16) 0%, rgba(52, 211, 153, 0.10) 40%, transparent 75%);
    animation-duration: 26s; animation-delay: -7s;
  }
  #hot3OpticFluidField[data-fluid-mode="day"] .optic-pool-3 {
    width: 480px; height: 480px; top: 38%; left: 18%;
    background: radial-gradient(circle, rgba(251, 191, 36, 0.14) 0%, rgba(253, 230, 138, 0.06) 44%, transparent 74%);
    animation-duration: 16s; animation-delay: -3s;
  }

  @keyframes opticDriftFloat {
    0%   { transform: translate3d(0, 0, 0) scale(1); }
    50%  { transform: translate3d(30px, 38px, 0) scale(1.08); }
    100% { transform: translate3d(-24px, 18px, 0) scale(0.96); }
  }

  /* 2. Crisp Multi-Harmonic Surface Tension Ripple */
  @keyframes surfaceTensionRipple {
    0%   { transform: scale(0.955, 1.03); }
    25%  { transform: scale(1.028, 0.974) rotate(0.45deg); }
    52%  { transform: scale(0.988, 1.014) rotate(-0.3deg); }
    76%  { transform: scale(1.008, 0.994) rotate(0.15deg); }
    100% { transform: scale(1, 1) rotate(0deg); }
  }

  .animate-surface-tension {
    animation: surfaceTensionRipple 400ms cubic-bezier(0.34, 1.56, 0.64, 1) !important;
  }

  /* 3. Floating Optical Lens Dock */
  #hot3OpticDock {
    position: fixed;
    bottom: 20px;
    right: 22px;
    z-index: 950;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 10px;
    border-radius: 9999px;
    background: rgba(8, 14, 26, 0.48);
    backdrop-filter: blur(18px) saturate(140%);
    -webkit-backdrop-filter: blur(18px) saturate(140%);
    border-top: 1px solid rgba(255, 255, 255, 0.42);
    border-left: 1px solid rgba(255, 255, 255, 0.20);
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(0, 0, 0, 0.50);
    box-shadow:
      inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.30),
      0 18px 44px -8px rgba(0, 0, 0, 0.78),
      0 0 24px -6px rgba(246, 240, 224, 0.16);
    contain: layout style;
  }

  html[data-hot3-theme="frosted-daylight"] #hot3OpticDock,
  html[data-hot3-theme="modern-clean"] #hot3OpticDock {
    background: rgba(255, 255, 255, 0.78);
    border: 1px solid rgba(15, 23, 42, 0.10);
    border-top-color: rgba(255, 255, 255, 0.95);
    box-shadow: 0 12px 32px -6px rgba(15, 23, 42, 0.16);
  }

  html[data-hot3-theme="modern-clean"] #hot3OpticDock [data-optic-effect-only] {
    display: none !important;
  }

  #hot3OpticDock .optic-bead-btn {
    width: 36px;
    height: 36px;
    border-radius: 9999px;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #C8B996;
    background: rgba(255, 255, 255, 0.03);
    border-top: 1px solid rgba(255, 255, 255, 0.35);
    border-left: 1px solid rgba(255, 255, 255, 0.18);
    border-right: 1px solid rgba(255, 255, 255, 0.06);
    border-bottom: 1px solid rgba(0, 0, 0, 0.40);
    box-shadow:
      inset 0 1px 1px 0 rgba(255, 255, 255, 0.20),
      0 4px 12px -4px rgba(0, 0, 0, 0.45);
    transition: transform 380ms cubic-bezier(0.34, 1.56, 0.64, 1),
                color 180ms ease,
                border-color 180ms ease;
  }

  html[data-hot3-theme="frosted-daylight"] #hot3OpticDock .optic-bead-btn,
  html[data-hot3-theme="modern-clean"] #hot3OpticDock .optic-bead-btn {
    color: #334155;
    background: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba(15, 23, 42, 0.10);
    box-shadow: 0 4px 10px -2px rgba(15, 23, 42, 0.10);
  }

  #hot3OpticDock .optic-bead-btn:hover {
    color: #F6F0E0;
    border-top-color: rgba(255, 255, 255, 0.62);
    box-shadow: inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.45), 0 0 16px -2px rgba(246, 240, 224, 0.18);
  }

  html[data-hot3-theme="frosted-daylight"] #hot3OpticDock .optic-bead-btn:hover,
  html[data-hot3-theme="modern-clean"] #hot3OpticDock .optic-bead-btn:hover {
    color: #0369A1;
    border-color: rgba(3, 105, 161, 0.35);
    box-shadow: 0 6px 14px -2px rgba(14, 165, 233, 0.20);
  }

  #hot3OpticDock .optic-bead-btn:active {
    transform: scale(0.955, 1.03);
    transition-duration: 90ms;
    transition-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1.0);
  }

  #hot3OpticDock .optic-bead-btn.optic-bead-center {
    width: 40px;
    height: 40px;
    color: #F6F0E0;
    border-top-color: rgba(255, 255, 255, 0.65);
    box-shadow: inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.35), 0 0 20px -4px rgba(246, 240, 224, 0.22);
  }

  /* 4. Theme Switcher Popover Menu */
  #hot3OpticThemeMenu {
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

  #hot3OpticThemeMenu.is-open {
    opacity: 1;
    pointer-events: auto;
    visibility: visible;
    transform: translate3d(0, 0, 0) scale(1);
  }

  html[data-hot3-theme="frosted-daylight"] #hot3OpticThemeMenu,
  html[data-hot3-theme="modern-clean"] #hot3OpticThemeMenu {
    background: rgba(255, 255, 255, 0.90);
    border: 1px solid rgba(15, 23, 42, 0.12);
    box-shadow: 0 20px 44px -10px rgba(15, 23, 42, 0.20);
  }

  #hot3OpticThemeMenu .optic-menu-title {
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

  html[data-hot3-theme="frosted-daylight"] .optic-theme-item,
  html[data-hot3-theme="modern-clean"] .optic-theme-item {
    color: #475569;
  }

  html[data-hot3-theme="frosted-daylight"] .optic-theme-item:hover,
  html[data-hot3-theme="modern-clean"] .optic-theme-item:hover {
    background: rgba(15, 23, 42, 0.05);
    color: #0F172A;
  }

  html[data-hot3-theme="frosted-daylight"] .optic-theme-item.is-active,
  html[data-hot3-theme="modern-clean"] .optic-theme-item.is-active {
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

  html[data-hot3-theme="frosted-daylight"] .optic-theme-badge,
  html[data-hot3-theme="modern-clean"] .optic-theme-badge {
    border-color: rgba(15, 23, 42, 0.14);
  }

  /* 5. Real-Time Token & Theme Inspector Drawer */
  #hot3OpticTokenDrawer {
    position: fixed;
    top: 0; right: 0; bottom: 0;
    width: 340px; max-width: 92vw;
    z-index: 1050;
    display: flex; flex-direction: column;
    background: rgba(4, 8, 15, 0.82);
    backdrop-filter: blur(22px) saturate(140%);
    -webkit-backdrop-filter: blur(22px) saturate(140%);
    border-left: 1px solid rgba(255, 255, 255, 0.14);
    box-shadow: 0 0 70px rgba(0, 0, 0, 0.88);
    color: #F6F0E0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    transform: translate3d(100%, 0, 0);
    pointer-events: none;
    visibility: hidden;
    transition: transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1.0), visibility 280ms ease;
    contain: layout style;
  }

  #hot3OpticTokenDrawer.is-open {
    transform: translate3d(0, 0, 0);
    pointer-events: auto;
    visibility: visible;
  }

  html[data-hot3-theme="frosted-daylight"] #hot3OpticTokenDrawer,
  html[data-hot3-theme="modern-clean"] #hot3OpticTokenDrawer {
    background: rgba(255, 255, 255, 0.90);
    border-left: 1px solid rgba(15, 23, 42, 0.12);
    color: #1E293B;
    box-shadow: 0 0 50px rgba(15, 23, 42, 0.18);
  }

  #hot3OpticTokenDrawer .optic-drawer-header {
    padding: 18px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    display: flex; align-items: center; justify-content: space-between;
  }

  html[data-hot3-theme="frosted-daylight"] #hot3OpticTokenDrawer .optic-drawer-header,
  html[data-hot3-theme="modern-clean"] #hot3OpticTokenDrawer .optic-drawer-header {
    border-bottom-color: rgba(15, 23, 42, 0.08);
  }

  #hot3OpticTokenDrawer .optic-drawer-title {
    display: flex; align-items: center; gap: 9px;
    font-size: 13px; font-weight: 600; letter-spacing: 0.03em;
  }

  #hot3OpticTokenDrawer .optic-drawer-dot {
    width: 9px; height: 9px; border-radius: 9999px;
    background: #34D399; box-shadow: 0 0 10px rgba(52, 211, 153, 0.75);
  }

  #hot3OpticTokenDrawer .optic-drawer-body {
    flex: 1; overflow-y: auto; padding: 18px 20px;
    font-size: 12px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    display: flex; flex-direction: column; gap: 18px;
  }

  #hot3OpticTokenDrawer .optic-section-label {
    font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em;
    color: #7F7663; margin-bottom: 8px;
  }

  #hot3OpticTokenDrawer .optic-token-row {
    display: flex; align-items: center; justify-content: space-between; gap: 8px;
    padding: 9px 11px; border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.02); margin-bottom: 6px;
  }

  html[data-hot3-theme="frosted-daylight"] #hot3OpticTokenDrawer .optic-token-row,
  html[data-hot3-theme="modern-clean"] #hot3OpticTokenDrawer .optic-token-row {
    border-color: rgba(15, 23, 42, 0.08);
    background: rgba(15, 23, 42, 0.03);
  }

  #hot3OpticTokenDrawer .optic-token-key { opacity: 0.78; }
  #hot3OpticTokenDrawer .optic-token-active { color: #10B981; font-weight: 600; }

  #hot3OpticTokenDrawer .optic-speed-group { display: flex; gap: 8px; }

  #hot3OpticTokenDrawer .optic-pill-btn {
    flex: 1; padding: 7px 10px; border-radius: 10px; cursor: pointer; font-size: 11px;
    color: inherit; background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.14);
    transition: transform 340ms cubic-bezier(0.34, 1.56, 0.64, 1), border-color 180ms ease;
  }

  html[data-hot3-theme="frosted-daylight"] #hot3OpticTokenDrawer .optic-pill-btn,
  html[data-hot3-theme="modern-clean"] #hot3OpticTokenDrawer .optic-pill-btn {
    background: rgba(15, 23, 42, 0.04);
    border-color: rgba(15, 23, 42, 0.14);
  }

  #hot3OpticTokenDrawer .optic-pill-btn.is-active,
  #hot3OpticTokenDrawer .optic-pill-btn:hover {
    border-color: rgba(246, 240, 224, 0.55);
  }

  #hot3OpticTokenDrawer .optic-close-btn {
    width: 30px; height: 30px; border-radius: 9999px; cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center;
    color: inherit; background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.16);
  }

  /* 6. Floating Optical Toast */
  #hot3OpticToastBox {
    position: fixed;
    top: 58px; left: 50%;
    transform: translate3d(-50%, -18px, 0);
    opacity: 0; pointer-events: none; z-index: 1060;
    display: flex; align-items: center; gap: 8px;
    padding: 8px 16px; border-radius: 9999px; font-size: 12px;
    color: #F6F0E0; background: rgba(8, 14, 26, 0.78);
    backdrop-filter: blur(16px) saturate(140%);
    -webkit-backdrop-filter: blur(16px) saturate(140%);
    border: 1px solid rgba(255, 255, 255, 0.25);
    box-shadow: 0 0 20px rgba(246, 240, 224, 0.18), 0 10px 24px rgba(0, 0, 0, 0.6);
    transition: transform 240ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms ease;
  }

  html[data-hot3-theme="frosted-daylight"] #hot3OpticToastBox,
  html[data-hot3-theme="modern-clean"] #hot3OpticToastBox {
    color: #0F172A;
    background: rgba(255, 255, 255, 0.90);
    border-color: rgba(15, 23, 42, 0.12);
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.14);
  }

  #hot3OpticToastBox.is-visible {
    transform: translate3d(-50%, 0, 0);
    opacity: 1;
  }

  @media (max-width: 640px) {
    #hot3OpticDock { bottom: 14px; right: 14px; padding: 5px 8px; gap: 6px; }
    #hot3OpticDock .optic-bead-btn { width: 32px; height: 32px; }
    #hot3OpticDock .optic-bead-btn.optic-bead-center { width: 36px; height: 36px; }
    #hot3OpticThemeMenu { bottom: 66px; right: 14px; }
  }
`;
