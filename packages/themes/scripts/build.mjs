import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, '../src');
const rootDistDir = path.resolve(__dirname, '../../../dist/themes');

fs.mkdirSync(rootDistDir, { recursive: true });

const themeEntries = fs.readdirSync(srcDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

const manifest = [];

for (const themeId of themeEntries) {
  const themeSrc = path.join(srcDir, themeId);
  const jsonPath = path.join(themeSrc, 'theme.json');
  const cssPath = path.join(themeSrc, 'style.css');

  if (!fs.existsSync(jsonPath) || !fs.existsSync(cssPath)) continue;

  const meta = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const css = fs.readFileSync(cssPath, 'utf8');

  const outThemeDir = path.join(rootDistDir, themeId);
  fs.mkdirSync(outThemeDir, { recursive: true });

  fs.writeFileSync(path.join(outThemeDir, 'style.css'), css, 'utf8');
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

  console.log(`[themes] Built: ${themeId}`);
}

fs.writeFileSync(path.join(rootDistDir, 'index.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(`[themes] Wrote manifest: ${manifest.length} themes.`);
