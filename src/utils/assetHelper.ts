/**
 * Asset URL helper for GitHub Pages and local development.
 * Handles prepending import.meta.env.BASE_URL when necessary.
 */
export function getAssetUrl(path: string): string {
  if (!path) return '';
  // If it's already an absolute external URL or data URI, return as is
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  
  const base = import.meta.env.BASE_URL || '/';
  // Strip leading slash if base ends with a slash
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  
  return `${cleanBase}${cleanPath}`;
}
