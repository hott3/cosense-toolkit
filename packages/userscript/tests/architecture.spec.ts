import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_ROOT = path.resolve(__dirname, '../src');
const FEATURES_ROOT = path.join(SRC_ROOT, 'features');

function toPosix(filePath: string): string {
  return filePath.split(path.sep).join('/');
}

function collectTypeScriptFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectTypeScriptFiles(fullPath));
    } else if (entry.isFile() && /\.tsx?$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
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
