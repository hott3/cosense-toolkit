import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_ROOT = path.resolve(__dirname, '../src');
const FEATURES_ROOT = path.join(SRC_ROOT, 'features');
const REPO_ROOT = path.resolve(__dirname, '../../..');
const USERCSS_SRC_ROOT = path.resolve(REPO_ROOT, 'packages/usercss/src');
const USERCSS_BUILD_SCRIPT = path.resolve(REPO_ROOT, 'packages/usercss/scripts/build.mjs');
const USERCSS_DIST_ROOT = path.resolve(REPO_ROOT, 'dist/usercss');
const LEGACY_PREFIX_PATTERN = new RegExp('hot' + '3', 'i');

function toPosix(filePath: string): string {
  return filePath.split(path.sep).join('/');
}

function collectAllFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectAllFiles(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function collectTypeScriptFiles(dir: string): string[] {
  return collectAllFiles(dir).filter((filePath) => /\.tsx?$/.test(filePath));
}

export function extractImportSpecifiers(sourceCode: string): string[] {
  const specifiers: string[] = [];
  const staticImportExportRegex = /(?:import|export)\s+(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]/g;
  const dynamicImportRegex = /import\(\s*['"]([^'"]+)['"]\s*\)/g;

  for (const regex of [staticImportExportRegex, dynamicImportRegex]) {
    let match: RegExpExecArray | null;
    while ((match = regex.exec(sourceCode)) !== null) {
      specifiers.push(match[1]);
    }
  }

  return specifiers;
}

function getTopLevelFeatureName(filePath: string, featuresRoot = FEATURES_ROOT): string | null {
  const relative = toPosix(path.relative(featuresRoot, filePath));
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return null;
  }
  const [featureName] = relative.split('/');
  return featureName || null;
}

/**
 * Check whether an import specifier inside `sourceFile` crosses into another top-level feature.
 * Same-feature (including nested sub-features), `domain/`, and `infrastructure/` imports are allowed.
 */
export function detectCrossFeatureImportViolation(
  sourceFile: string,
  specifier: string,
  featuresRoot = FEATURES_ROOT
): string | null {
  if (!specifier.startsWith('.')) {
    return null;
  }

  const sourceFeature = getTopLevelFeatureName(sourceFile, featuresRoot);
  if (!sourceFeature) {
    return null;
  }

  const resolvedTarget = path.resolve(path.dirname(sourceFile), specifier);
  const targetFeature = getTopLevelFeatureName(resolvedTarget, featuresRoot);

  if (targetFeature && targetFeature !== sourceFeature) {
    return `Cross-feature import forbidden: "${toPosix(path.relative(SRC_ROOT, sourceFile))}" imports "${specifier}" (from feature "${targetFeature}")`;
  }

  return null;
}

describe('architecture boundary: features isolation', () => {
  it('allows same-feature / sub-feature / shared-layer imports and rejects cross-feature imports', () => {
    const sampleFile = path.join(FEATURES_ROOT, 'theme-switcher', 'ui.ts');

    expect(detectCrossFeatureImportViolation(sampleFile, './logic')).toBeNull();
    expect(detectCrossFeatureImportViolation(sampleFile, './sub-feature/helper')).toBeNull();
    expect(detectCrossFeatureImportViolation(sampleFile, '../../domain/theme')).toBeNull();
    expect(detectCrossFeatureImportViolation(sampleFile, '../../infrastructure/api/storage')).toBeNull();

    expect(detectCrossFeatureImportViolation(sampleFile, '../ambient-fluid/ui')).toContain(
      'Cross-feature import forbidden'
    );
  });

  it('has zero cross-feature imports across all files under src/features/', () => {
    const featureFiles = collectTypeScriptFiles(FEATURES_ROOT);
    expect(featureFiles.length).toBeGreaterThan(0);

    const violations: string[] = [];

    for (const filePath of featureFiles) {
      const content = fs.readFileSync(filePath, 'utf8');
      const specifiers = extractImportSpecifiers(content);

      for (const specifier of specifiers) {
        const violation = detectCrossFeatureImportViolation(filePath, specifier);
        if (violation) {
          violations.push(violation);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});

describe('architecture guard: zero legacy prefix & usercss bundle integrity', () => {
  it('has zero legacy prefix matches across packages/userscript/src and packages/usercss/src', () => {
    const userscriptFiles = collectAllFiles(SRC_ROOT);
    const usercssFiles = collectAllFiles(USERCSS_SRC_ROOT);
    expect(userscriptFiles.length).toBeGreaterThan(0);
    expect(usercssFiles.length).toBeGreaterThan(0);

    const violations: string[] = [];

    for (const filePath of [...userscriptFiles, ...usercssFiles]) {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split(/\r?\n/);
      lines.forEach((line, index) => {
        if (LEGACY_PREFIX_PATTERN.test(line)) {
          violations.push(`${toPosix(path.relative(REPO_ROOT, filePath))}:${index + 1}`);
        }
      });
    }

    expect(violations).toEqual([]);
  });

  it('builds all 3 usercss themes with shared Material Symbols import first, zero legacy prefix, and all 4 shared utilities', () => {
    execFileSync(process.execPath, [USERCSS_BUILD_SCRIPT], {
      cwd: REPO_ROOT,
      stdio: 'pipe',
    });

    const themes = ['pure-optical-glass', 'frosted-daylight', 'modern-clean'] as const;
    const expectedImportPrefix =
      '@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined';
    const requiredSelectors = [
      '.line a.link[target="_blank"]::after',
      '.page-list-item.pin + .page-list-item:not(.pin)',
      '.line.line-title::before',
      '.page-sidebar',
    ] as const;

    for (const themeId of themes) {
      const cssPath = path.join(USERCSS_DIST_ROOT, themeId, 'style.css');
      expect(fs.existsSync(cssPath)).toBe(true);

      const css = fs.readFileSync(cssPath, 'utf8');
      const cssWithoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '').trimStart();

      expect(cssWithoutComments.startsWith(expectedImportPrefix)).toBe(true);
      expect(LEGACY_PREFIX_PATTERN.test(css)).toBe(false);

      for (const selector of requiredSelectors) {
        expect(css).toContain(selector);
      }
    }
  });
});
