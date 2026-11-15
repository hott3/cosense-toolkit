import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, '../src');
const rootDistDir = path.resolve(__dirname, '../../../dist/usercss');

fs.mkdirSync(rootDistDir, { recursive: true });

const sharedImports = fs.readFileSync(path.join(srcDir, '_shared/imports.css'), 'utf8');
const sharedUtilities = fs.readFileSync(path.join(srcDir, '_shared/utilities.css'), 'utf8');

const themeEntries = fs.readdirSync(srcDir, { withFileTypes: true })
  .filter(d => d.isDirectory() && !d.name.startsWith('_'))
  .map(d => d.name);

const manifest = [];

for (const themeId of themeEntries) {
  const themeSrc = path.join(srcDir, themeId);
  const jsonPath = path.join(themeSrc, 'theme.json');
  const cssPath = path.join(themeSrc, 'style.css');

  if (!fs.existsSync(jsonPath) || !fs.existsSync(cssPath)) continue;

  const meta = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const css = fs.readFileSync(cssPath, 'utf8');
  const bundledCss = `${sharedImports.trim()}\n\n${css.trim()}\n\n${sharedUtilities.trim()}\n`;

  const outThemeDir = path.join(rootDistDir, themeId);
  fs.mkdirSync(outThemeDir, { recursive: true });

  fs.writeFileSync(path.join(outThemeDir, 'style.css'), bundledCss, 'utf8');
  fs.writeFileSync(path.join(outThemeDir, 'theme.json'), JSON.stringify(meta, null, 2) + '\n', 'utf8');

  manifest.push({
    id: meta.id || themeId,
    slug: themeId,
    label: meta.label,
    badge: meta.badge,
    description: meta.description,
    baseBg: meta.baseBg,
    effects: meta.effects || {}
  });

  console.log(`[usercss] Built: ${themeId}`);
}

fs.writeFileSync(path.join(rootDistDir, 'index.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(`[usercss] Wrote manifest: ${manifest.length} themes.`);
