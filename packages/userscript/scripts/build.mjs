import esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const entryPoint = path.resolve(__dirname, '../src/index.ts');
const outDir = path.resolve(__dirname, '../../../dist/userscript');
const userscriptPkgPath = path.resolve(__dirname, '../package.json');
const usercssPkgPath = path.resolve(__dirname, '../../usercss/package.json');

const userscriptPkg = JSON.parse(fs.readFileSync(userscriptPkgPath, 'utf8'));
const usercssPkg = JSON.parse(fs.readFileSync(usercssPkgPath, 'utf8'));

const isWatch = process.argv.includes('--watch');

const commonConfig = {
  entryPoints: [entryPoint],
  bundle: true,
  format: 'iife',
  target: ['es2020', 'chrome90', 'safari14'],
  define: {
    __COSENSE_USERSCRIPT_VERSION__: JSON.stringify(userscriptPkg.version),
    __COSENSE_USERCSS_VERSION__: JSON.stringify(usercssPkg.version),
  },
  banner: {
    js: `/* cosense-toolkit userscript-v${userscriptPkg.version} (usercss-v${usercssPkg.version}) - optical lens runtime */\n`,
  },
};

async function build() {
  // 1. Regular readable build
  await esbuild.build({
    ...commonConfig,
    outfile: path.join(outDir, 'script.js'),
    minify: false,
    sourcemap: true,
  });

  // 2. Production minified build
  await esbuild.build({
    ...commonConfig,
    outfile: path.join(outDir, 'script.min.js'),
    minify: true,
    sourcemap: false,
  });

  console.log('[userscript] Bundled successfully to dist/userscript/script.js & script.min.js');
}

if (isWatch) {
  const ctx = await esbuild.context({
    ...commonConfig,
    outfile: path.join(outDir, 'script.js'),
    sourcemap: true,
  });
  await ctx.watch();
  console.log('[userscript] Watching for changes...');
} else {
  await build();
}
