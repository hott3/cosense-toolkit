/**
 * Stylesheet highlighting today's daily journal page card with W3C DTCG Optical Glass tokens.
 */
export const TODAY_PAGE_MARKER_CSS: string = `@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200");

.grid li.page-list-item.today-page {
  position: relative;
}
.grid li.page-list-item.today-page a {
  border-top: 1.5px solid var(--accent-emerald-bead, #34D399) !important;
  box-shadow:
    inset 0 1.5px 2px 0 var(--specular-top-edge, rgba(255, 255, 255, 0.35)),
    0 0 22px -6px var(--glow-ambient-lens, rgba(52, 211, 153, 0.25)) !important;
}
.grid li.page-list-item.today-page::after {
  content: "edit";
  font-family: "Material Symbols Outlined";
  font-size: 15px;
  line-height: 1;
  position: absolute;
  top: 10px;
  right: 10px;
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-glass-pill, 9999px);
  background: var(--glass-interactive-fill, var(--card-bg, rgba(255, 255, 255, 0.08)));
  backdrop-filter: blur(var(--blur-lens-card, 14px));
  -webkit-backdrop-filter: blur(var(--blur-lens-card, 14px));
  border-top: 1px solid var(--specular-top-edge, rgba(255, 255, 255, 0.38));
  border-left: 1px solid var(--specular-left-edge, rgba(255, 255, 255, 0.16));
  border-right: 1px solid var(--specular-edge-rim, rgba(255, 255, 255, 0.07));
  border-bottom: 1px solid var(--specular-bottom-dark, rgba(0, 0, 0, 0.35));
  color: var(--accent-emerald-bead, #34D399);
  pointer-events: none;
  z-index: 2;
}
`;
