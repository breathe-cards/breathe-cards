// Builds src/ into a single file Home Assistant can load: dist/breathe-cards.js
import { build, context } from 'esbuild';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)));
const banner = `/*! Breathe Cards v${pkg.version} | MIT License | https://github.com/breathe-cards/breathe-cards */`;

const options = {
  entryPoints: ['src/index.js'],
  outfile: 'dist/breathe-cards.js',
  bundle: true,
  format: 'iife',
  target: ['es2020', 'chrome111', 'safari16.2', 'firefox113'],
  minify: true,
  legalComments: 'none',
  banner: { js: banner },
  define: { __VERSION__: JSON.stringify(pkg.version) },
  logLevel: 'info',
};

if (process.argv.includes('--watch')) {
  const ctx = await context(options);
  await ctx.watch();
} else {
  await build(options);
}
