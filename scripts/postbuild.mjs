import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');
const notFoundPath = path.join(distDir, '404.html');
const nojekyllPath = path.join(distDir, '.nojekyll');

if (!fs.existsSync(indexPath)) {
  console.error('Error: dist/index.html was not found! Build first.');
  process.exit(1);
}

// 1. Create dist/404.html for GitHub Pages SPA routing
fs.copyFileSync(indexPath, notFoundPath);
console.log('✓ Created dist/404.html (SPA fallback for GitHub Pages)');

// 2. Create dist/.nojekyll to bypass Jekyll processing on GitHub Pages
fs.writeFileSync(nojekyllPath, '');
console.log('✓ Created dist/.nojekyll (bypasses Jekyll processing)');
