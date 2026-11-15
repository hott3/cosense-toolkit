import esbuild from 'esbuild';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const entryPoint = path.resolve(__dirname, '../src/index.ts');
const outDir = path.resolve(__dirname, '../../../dist/userscript');

const isWatch = process.argv.includes('--watch');

const commonConfig = {
  entryPoints: [entryPoint],
  bundle: true,
  format: 'iife',
  target: ['es2020', 'chrome90', 'safari14'],
  banner: {
    js: '/* cosense-toolkit - optical lens runtime userscript */\n'
  }
};

async function build() {
  // 1. Regular readable build
  await esbuild.build({
    ...commonConfig,
    outfile: path.join(outDir, 'script.js'),
    minify: false,
    sourcemap: true
  });

  // 2. Production minified build
  await esbuild.build({
    ...commonConfig,
    outfile: path.join(outDir, 'script.min.js'),
    minify: true,
    sourcemap: false
  });

  console.log('[userscript] Bundled successfully to dist/userscript/script.js & script.min.js');
}

if (isWatch) {
  const ctx = await esbuild.context({
    ...commonConfig,
    outfile: path.join(outDir, 'script.js'),
    sourcemap: true
  });
  await ctx.watch();
  console.log('[userscript] Watching for changes...');
} else {
  await build();
}
