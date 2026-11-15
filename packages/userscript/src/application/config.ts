export interface ToolkitFeatureFlags {
  readonly themeSwitcher: boolean;
  readonly ambientFluid: boolean;
  readonly surfaceTension: boolean;
  readonly searchTools: boolean;
  readonly pageTemplates: boolean;
  readonly todayPageMarker: boolean;
}

export const DEFAULT_FEATURE_FLAGS: ToolkitFeatureFlags = {
  themeSwitcher: true,
  ambientFluid: true,
  surfaceTension: true,
  searchTools: true,
  pageTemplates: true,
  todayPageMarker: true,
};

/**
 * Merge optional feature flag overrides with default production settings.
 */
export function resolveFeatureFlags(
  overrides?: Partial<ToolkitFeatureFlags>
): ToolkitFeatureFlags {
  return {
    ...DEFAULT_FEATURE_FLAGS,
    ...overrides,
  };
}
