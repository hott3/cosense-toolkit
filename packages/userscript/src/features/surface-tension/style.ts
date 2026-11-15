export const SURFACE_TENSION_CSS = `
  /* Crisp Multi-Harmonic Surface Tension Ripple */
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
`;
