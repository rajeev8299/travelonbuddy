import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const distDir = path.resolve(__dirname, '../dist')

const indexPath = path.join(distDir, 'index.html')
const notFoundPath = path.join(distDir, '404.html')
const nojekyllPath = path.join(distDir, '.nojekyll')

const APP_BASE_PATH = '/travelonbuddy/'

if (!fs.existsSync(indexPath)) {
  console.error('ERROR: dist/index.html not found.')
  process.exit(1)
}

// --------------------------------------------------
// 1. GitHub Pages SPA 404 fallback
// --------------------------------------------------

const fallbackHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TravelOnBuddy</title>
</head>
<body>
<p>Loading TravelOnBuddy...</p>

<script>
(function () {
  var appBase = '${APP_BASE_PATH}';
  var pathname = window.location.pathname;

  if (!pathname.startsWith(appBase)) {
    return;
  }

  var route = pathname.slice(appBase.length);

  // Do not redirect missing static files.
  if (/\\.[a-zA-Z0-9]{1,12}$/.test(route)) {
    return;
  }

  var params = new URLSearchParams();

  params.set('__tob_route', route);
  params.set('__tob_search', window.location.search);
  params.set('__tob_hash', window.location.hash);

  window.location.replace(
    appBase + '?' + params.toString()
  );
})();
</script>

</body>
</html>`

fs.writeFileSync(
  notFoundPath,
  fallbackHtml,
  'utf8'
)

console.log('SUCCESS: GitHub Pages SPA fallback created.')

// --------------------------------------------------
// 2. Disable Jekyll processing
// --------------------------------------------------

fs.writeFileSync(nojekyllPath, '')

console.log('SUCCESS: dist/.nojekyll created.')

// --------------------------------------------------
// 3. Verify production HTML
// --------------------------------------------------

const html = fs.readFileSync(indexPath, 'utf8')

if (html.includes('/src/main.tsx')) {
  console.error(
    'ERROR: Raw TypeScript entry detected in production HTML.'
  )
  process.exit(1)
}

// --------------------------------------------------
// 4. Verify CSS and JavaScript references
// --------------------------------------------------

const references = [
  ...html.matchAll(
    /(?:href|src)=["']([^"']+\.(?:css|js)(?:\?[^"']*)?)["']/gi
  ),
]

if (references.length === 0) {
  console.error(
    'ERROR: No compiled CSS or JavaScript references found.'
  )
  process.exit(1)
}

for (const match of references) {
  const reference = match[1]

  if (/^https?:\/\//i.test(reference)) {
    continue
  }

  const assetUrl = new URL(
    reference,
    'https://travelonbuddy-build.invalid/'
  )

  let relativePath = decodeURIComponent(
    assetUrl.pathname
  )

  relativePath = relativePath.replace(
    /^\/travelonbuddy\//,
    ''
  )

  relativePath = relativePath.replace(/^\/+/, '')

  const diskPath = path.resolve(
    distDir,
    relativePath
  )

  if (
    diskPath !== distDir &&
    !diskPath.startsWith(distDir + path.sep)
  ) {
    console.error('Unsafe asset path:', reference)
    process.exit(1)
  }

  if (!fs.existsSync(diskPath)) {
    console.error(
      'Missing production asset:',
      reference
    )
    process.exit(1)
  }

  console.log(
    'Verified production asset:',
    relativePath
  )
}

// --------------------------------------------------
// 5. Verify required deployment files
// --------------------------------------------------

const required = [
  indexPath,
  notFoundPath,
  nojekyllPath,
  path.join(distDir, 'assets'),
]

for (const item of required) {
  if (!fs.existsSync(item)) {
    console.error(
      'Required deployment file missing:',
      item
    )
    process.exit(1)
  }
}

console.log('SUCCESS: TravelOnBuddy production files verified.')
