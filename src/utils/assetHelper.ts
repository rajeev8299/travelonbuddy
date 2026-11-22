/**
 * TravelOnBuddy public asset helper.
 *
 * Vite production bundles use relative asset URLs.
 * Public application images must use the correct application root
 * so they continue working on deeply nested routes.
 */

const GITHUB_OWNER_HOST = 'rajeev8299.github.io'
const GITHUB_PROJECT_BASE = '/travelonbuddy/'

function getPublicAssetBase(): string {
  if (
    typeof window !== 'undefined' &&
    window.location.hostname === GITHUB_OWNER_HOST
  ) {
    return GITHUB_PROJECT_BASE
  }

  return '/'
}

export function getAssetUrl(path: string): string {
  if (!path) return ''

  // Keep external and generated URLs unchanged.
  if (
    /^(https?:)?\/\//i.test(path) ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path
  }

  // Do not prepend the repository path twice.
  if (path.startsWith(GITHUB_PROJECT_BASE)) {
    return path
  }

  const cleanPath = path.replace(/^(\.\/|\/)+/, '')
  const base = getPublicAssetBase()

  return `${base}${cleanPath}`
}
