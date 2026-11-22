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

// 3. Strict verification of CSS stylesheet link and physical existence
const htmlContent = fs.readFileSync(indexPath, 'utf8');
const cssLinks = [...htmlContent.matchAll(/href=["']([^"']+\.css)["']/g)].map(m => m[1]);

if (cssLinks.length === 0) {
  console.error('❌ CRITICAL ERROR: dist/index.html does not contain any referenced CSS stylesheet!');
  process.exit(1);
}

for (const cssUrl of cssLinks) {
  // Convert URL path (e.g. /travelonbuddy/assets/index-*.css) to local disk path
  const filename = path.basename(cssUrl);
  const localCssPath = path.join(distDir, 'assets', filename);
  if (!fs.existsSync(localCssPath)) {
    console.error(`❌ CRITICAL ERROR: Referenced CSS file ${filename} not found at ${localCssPath}!`);
    process.exit(1);
  }
  const stats = fs.statSync(localCssPath);
  console.log(`✓ Verified compiled CSS: ${filename} (${(stats.size / 1024).toFixed(2)} KB)`);
}
