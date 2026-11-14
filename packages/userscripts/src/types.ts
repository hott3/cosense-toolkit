export type FluidMode = 'night' | 'day' | 'off';

export interface ThemeDefinition {
  id: string;
  label: string;
  badge: string;
  slug: string;
  baseBg: string;
  swatch: string;
  fluidMode: FluidMode;
  surfaceTension: boolean;
  preloadedInSettings: boolean;
}

export interface ScrapboxLine {
  id: string;
  text: string;
}

export interface ScrapboxPage {
  title: string;
  lines: ScrapboxLine[];
}

declare global {
  interface Window {
    __hot3OpticLensInitialized?: boolean;
    scrapbox?: {
      Project?: { name?: string };
      Page?: ScrapboxPage;
      PageMenu?: {
        addMenu?: (options: { title: string; image?: string; onClick?: () => void }) => void;
        addItem?: (options: { title: string; image?: string; onClick?: () => void }) => void;
      };
      PopupMenu?: {
        addButton?: (options: { title: string; onClick?: (text: string) => string | void }) => void;
      };
      on?: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}
