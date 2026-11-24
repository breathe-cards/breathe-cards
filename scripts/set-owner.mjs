// Replaces the OWNER placeholder with your GitHub user or organisation and rebuilds.
// Usage: npm run set-owner -- your-github-name
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const owner = process.argv[2];
if (!owner || !/^[A-Za-z0-9-]+$/.test(owner)) {
  console.error('Usage: npm run set-owner -- <github-user-or-org>');
  process.exit(1);
}
const files = ['README.md', 'README.uk.md', 'build.mjs', 'src/core/meta.js'];
for (const f of files) {
  const s = readFileSync(f, 'utf8');
  writeFileSync(f, s.replaceAll('github.com/OWNER/', `github.com/${owner}/`).replaceAll('/github/v/release/OWNER/', `/github/v/release/${owner}/`).replaceAll('/github/license/OWNER/', `/github/license/${owner}/`));
}
execSync('npm run build', { stdio: 'inherit' });
console.log(`OWNER → ${owner}. Check: git grep OWNER`);
