export const AMBIENT_FLUID_CSS = `
  /* Switch from CSS fallback pools to JS 3-layer fluid field when active */
  html:not([data-cosense-theme="modern-clean"]) body[data-optic-js="active"]::before,
  html:not([data-cosense-theme="modern-clean"]) body[data-optic-js="active"]::after {
    display: none !important;
    animation: none !important;
  }

  /* Lightweight Soft-Gradient Liquid Backdrop (Night & Day variants) */
  #cosenseOpticFluidField {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: -1;
    overflow: hidden;
    contain: layout style paint;
  }

  #cosenseOpticFluidField[data-fluid-mode="off"] {
    display: none !important;
  }

  #cosenseOpticFluidField .optic-fluid-pool {
    position: absolute;
    border-radius: 50%;
    will-change: transform;
    animation: opticDriftFloat 18s ease-in-out infinite alternate;
    transition: transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1.0);
  }

  #cosenseOpticFluidField.is-pulsing .optic-fluid-pool {
    transform: scale(1.26) !important;
  }

  /* Night Pools */
  #cosenseOpticFluidField[data-fluid-mode="night"] .optic-pool-1 {
    width: 680px; height: 680px; top: -150px; right: -160px;
    background: radial-gradient(circle at 45% 45%, rgba(200, 185, 150, 0.14) 0%, rgba(45, 80, 130, 0.18) 32%, rgba(30, 60, 110, 0.06) 56%, transparent 74%);
    animation-duration: 22s;
  }
  #cosenseOpticFluidField[data-fluid-mode="night"] .optic-pool-2 {
    width: 740px; height: 740px; bottom: -80px; left: -220px;
    background: radial-gradient(circle at 50% 50%, rgba(30, 60, 110, 0.26) 0%, rgba(70, 50, 95, 0.12) 36%, rgba(20, 40, 80, 0.04) 58%, transparent 75%);
    animation-duration: 26s; animation-delay: -7s;
  }
  #cosenseOpticFluidField[data-fluid-mode="night"] .optic-pool-3 {
    width: 480px; height: 480px; top: 40%; left: 16%;
    background: radial-gradient(circle, rgba(246, 240, 224, 0.07) 0%, rgba(20, 45, 80, 0.14) 38%, transparent 72%);
    animation-duration: 16s; animation-delay: -3s;
  }

  /* Day Pools */
  #cosenseOpticFluidField[data-fluid-mode="day"] .optic-pool-1 {
    width: 680px; height: 680px; top: -140px; right: -150px;
    background: radial-gradient(circle at 45% 45%, rgba(56, 189, 248, 0.20) 0%, rgba(125, 211, 252, 0.11) 38%, transparent 74%);
    animation-duration: 22s;
  }
  #cosenseOpticFluidField[data-fluid-mode="day"] .optic-pool-2 {
    width: 720px; height: 720px; bottom: -90px; left: -200px;
    background: radial-gradient(circle at 50% 50%, rgba(167, 139, 250, 0.16) 0%, rgba(52, 211, 153, 0.10) 40%, transparent 75%);
    animation-duration: 26s; animation-delay: -7s;
  }
  #cosenseOpticFluidField[data-fluid-mode="day"] .optic-pool-3 {
    width: 480px; height: 480px; top: 38%; left: 18%;
    background: radial-gradient(circle, rgba(251, 191, 36, 0.14) 0%, rgba(253, 230, 138, 0.06) 44%, transparent 74%);
    animation-duration: 16s; animation-delay: -3s;
  }

  @keyframes opticDriftFloat {
    0%   { transform: translate3d(0, 0, 0) scale(1); }
    50%  { transform: translate3d(30px, 38px, 0) scale(1.08); }
    100% { transform: translate3d(-24px, 18px, 0) scale(0.96); }
  }
`;
