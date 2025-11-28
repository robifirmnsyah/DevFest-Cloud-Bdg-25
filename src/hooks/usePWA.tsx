import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      const isPWA = isStandalone || isIOSStandalone;
      
      console.log('📱 PWA Status:', { isStandalone, isIOSStandalone, isPWA });
      setIsInstalled(isPWA);
      return isPWA;
    };

    const installed = checkIfInstalled();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('🎉 beforeinstallprompt event caught in React');
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('✅ App installed event fired');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Only add listeners if not installed
    if (!installed) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
      
      // Check if prompt already fired (stored in window)
      if ((window as any).deferredPrompt) {
        console.log('📌 Using stored deferred prompt');
        setDeferredPrompt((window as any).deferredPrompt);
        setIsInstallable(true);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    console.log('🚀 Install app called', { deferredPrompt });
    
    if (!deferredPrompt) {
      console.warn('⚠️ No deferred prompt available');
      
      // Show manual instructions
      const userAgent = navigator.userAgent.toLowerCase();
      const isChrome = userAgent.includes('chrome') && !userAgent.includes('edg');
      const isEdge = userAgent.includes('edg');
      const isSafari = userAgent.includes('safari') && !userAgent.includes('chrome');
      const isMobile = /android|iphone|ipad|ipod/i.test(userAgent);
      
      let instructions = 'To install this app:\n\n';
      
      if (isMobile) {
        if (isChrome) {
          instructions += '📱 Chrome: Tap menu (⋮) → "Add to Home screen"';
        } else if (isSafari) {
          instructions += '📱 Safari: Tap Share → "Add to Home Screen"';
        } else {
          instructions += '📱 Open in Chrome or Safari to install';
        }
      } else {
        if (isChrome || isEdge) {
          instructions += '💻 Look for install icon (⊕) in address bar\n   Or: Menu → "Install DevFest 2025"';
        } else {
          instructions += '💻 Use Chrome or Edge for best install experience';
        }
      }
      
      alert(instructions);
      return false;
    }

    try {
      console.log('📲 Showing install prompt...');
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      console.log('👤 User choice:', choiceResult.outcome);
      
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ User accepted install');
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      } else {
        console.log('❌ User dismissed install');
      }
      return false;
    } catch (error) {
      console.error('💥 Error installing app:', error);
      return false;
    }
  };

  return {
    isInstallable,
    isInstalled,
    installApp
  };
};
