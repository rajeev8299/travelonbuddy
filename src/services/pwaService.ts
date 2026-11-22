export type PwaInstallStatus =
  | 'NOT_INSTALLED'
  | 'INSTALL_PROMPT_AVAILABLE'
  | 'INSTALL_PENDING'
  | 'INSTALLED'
  | 'NOT_SUPPORTED'
  | 'DISMISSED';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const DISMISSED_TIMESTAMP_KEY = 'tob_pwa_install_dismissed_at';
const COOLDOWN_DAYS = 3; // Respect user dismissal for 3 days before offering again

/**
 * Robust check if the application is currently running in standalone / installed mode.
 * Evaluates:
 * 1. window.matchMedia('(display-mode: standalone)')
 * 2. window.matchMedia('(display-mode: fullscreen)')
 * 3. window.navigator.standalone (iOS Safari Home Screen App)
 * 4. document.referrer contains android-app://
 */
export function isRunningStandalone(): boolean {
  if (typeof window === 'undefined') return false;

  const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
  const isFullscreenMedia = window.matchMedia('(display-mode: fullscreen)').matches;
  const isMinimalUiMedia = window.matchMedia('(display-mode: minimal-ui)').matches;
  
  // iOS Safari check
  const isIosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;

  // Android TWA / app referrer
  const isAndroidAppReferrer = document.referrer.includes('android-app://');

  return isStandaloneMedia || isFullscreenMedia || isMinimalUiMedia || isIosStandalone || isAndroidAppReferrer;
}

/**
 * Detect if device is iOS / iPadOS
 */
export function isIosDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(ua);
  const isIpadOs = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return isIos || isIpadOs;
}

/**
 * Check if the user has recently dismissed the install prompt within the cooldown period
 */
export function isInstallDismissedRecently(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(DISMISSED_TIMESTAMP_KEY);
    if (!raw) return false;
    const dismissedAt = parseInt(raw, 10);
    if (isNaN(dismissedAt)) return false;

    const elapsedMs = Date.now() - dismissedAt;
    const cooldownMs = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
    return elapsedMs < cooldownMs;
  } catch {
    return false;
  }
}

/**
 * Save user dismissal timestamp to enforce cooldown
 */
export function markInstallDismissed(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DISMISSED_TIMESTAMP_KEY, Date.now().toString());
  } catch {
    // Ignore storage issues
  }
}

/**
 * Clear dismissal flag (e.g. if installed or reset)
 */
export function clearInstallDismissal(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(DISMISSED_TIMESTAMP_KEY);
  } catch {
    // Ignore storage issues
  }
}

/**
 * Register Service Worker using environment-aware base path
 */
export function registerServiceWorker(): void {
  if (
    typeof window === 'undefined' ||
    !('serviceWorker' in navigator)
  ) {
    return
  }

  const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '[::1]'

  if (
    window.location.protocol !== 'https:' &&
    !isLocalhost
  ) {
    return
  }

  const isGitHubPages =
    window.location.hostname === 'rajeev8299.github.io'

  const appBase = isGitHubPages
    ? '/travelonbuddy/'
    : '/'

  const serviceWorkerUrl = `${appBase}sw.js`

  const register = () => {
    navigator.serviceWorker
      .register(serviceWorkerUrl, {
        scope: appBase,
      })
      .then((registration) => {
        if (registration.installing) {
          console.debug(
            'TravelOnBuddy Service Worker installing:',
            registration.scope
          )
        }
      })
      .catch((error) => {
        console.warn(
          'TravelOnBuddy Service Worker registration failed:',
          error
        )
      })
  }

  if (document.readyState === 'complete') {
    register()
  } else {
    window.addEventListener(
      'load',
      register,
      { once: true }
    )
  }
}
