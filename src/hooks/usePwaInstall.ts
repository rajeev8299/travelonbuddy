import { useState, useEffect, useRef } from 'react';
import {
  PwaInstallStatus,
  BeforeInstallPromptEvent,
  isRunningStandalone,
  isIosDevice,
  isInstallDismissedRecently,
  markInstallDismissed,
  clearInstallDismissal,
} from '../services/pwaService';

// Module-level flags to ensure timer survives client-side page navigation
let globalPwaTimerStarted = false;
let globalPendingEligibility = false;
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;

export function usePwaInstall() {
  const [installStatus, setInstallStatus] = useState<PwaInstallStatus>('NOT_INSTALLED');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(globalDeferredPrompt);
  const [isIos, setIsIos] = useState<boolean>(false);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);

  // Timer reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 1. Immediately check if application is already installed/running in standalone mode
    if (isRunningStandalone()) {
      setInstallStatus('INSTALLED');
      setShowPrompt(false);
      globalPendingEligibility = false;
      return;
    }

    const ios = isIosDevice();
    setIsIos(ios);

    // Helper to start the 12-second delay only once across the entire session/navigation
    const triggerDelayedPresentation = () => {
      if (globalPwaTimerStarted) return;
      globalPwaTimerStarted = true;

      // 12-second delay after page load as requested
      timerRef.current = setTimeout(() => {
        // Re-verify conditions before revealing the modal
        if (
          !isRunningStandalone() &&
          !isInstallDismissedRecently() &&
          globalPendingEligibility
        ) {
          setShowPrompt(true);
        }
      }, 12000);
    };

    // 2. Listen for Chrome / Android beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent browser's automatic mini-infobar
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      globalDeferredPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
      setInstallStatus('INSTALL_PROMPT_AVAILABLE');

      if (!isInstallDismissedRecently() && !isRunningStandalone()) {
        globalPendingEligibility = true;
        triggerDelayedPresentation();
      }
    };

    // 3. Listen for successful installation
    const handleAppInstalled = () => {
      setInstallStatus('INSTALLED');
      setShowPrompt(false);
      globalPendingEligibility = false;
      globalDeferredPrompt = null;
      setDeferredPrompt(null);
      clearInstallDismissal();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // 4. For iOS devices, since beforeinstallprompt is not fired by WebKit Safari:
    if (ios && !isRunningStandalone() && !isInstallDismissedRecently()) {
      const isSafari =
        /safari/.test(navigator.userAgent.toLowerCase()) &&
        !/crios|fxios|edgios/.test(navigator.userAgent.toLowerCase());

      if (isSafari) {
        setInstallStatus('INSTALL_PROMPT_AVAILABLE');
        globalPendingEligibility = true;
        triggerDelayedPresentation();
      }
    }

    // If deferredPrompt was already captured in a prior page turn
    if (globalDeferredPrompt && !isInstallDismissedRecently() && !isRunningStandalone()) {
      globalPendingEligibility = true;
      triggerDelayedPresentation();
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Trigger the native install prompt
  const installApp = async (): Promise<boolean> => {
    const promptToUse = deferredPrompt || globalDeferredPrompt;
    if (!promptToUse) {
      return false;
    }

    try {
      setInstallStatus('INSTALL_PENDING');
      await promptToUse.prompt();
      const choice = await promptToUse.userChoice;

      if (choice.outcome === 'accepted') {
        setInstallStatus('INSTALLED');
        setShowPrompt(false);
        globalPendingEligibility = false;
        globalDeferredPrompt = null;
        setDeferredPrompt(null);
        clearInstallDismissal();
        return true;
      } else {
        setInstallStatus('DISMISSED');
        setShowPrompt(false);
        globalPendingEligibility = false;
        markInstallDismissed();
        return false;
      }
    } catch (err) {
      console.warn('PWA install prompt exception:', err);
      return false;
    }
  };

  // User selects "Maybe Later"
  const dismissPrompt = () => {
    setShowPrompt(false);
    globalPendingEligibility = false;
    setInstallStatus('DISMISSED');
    markInstallDismissed();
  };

  return {
    installStatus,
    showPrompt,
    isIos,
    isInstallSupported: !!deferredPrompt || !!globalDeferredPrompt || isIos,
    installApp,
    dismissPrompt,
  };
}
