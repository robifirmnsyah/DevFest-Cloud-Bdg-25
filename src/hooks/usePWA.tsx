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

    if (!installed) {
      // Listen for beforeinstallprompt
      const handleBeforeInstallPrompt = (e: Event) => {
        console.log('🎉 beforeinstallprompt fired!');
        e.preventDefault();
        const promptEvent = e as BeforeInstallPromptEvent;
        setDeferredPrompt(promptEvent);
        setIsInstallable(true);
        // Store globally too
        (window as any).deferredPrompt = promptEvent;
      };

      const handleAppInstalled = () => {
        console.log('✅ App installed!');
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      // Check if already stored
      if ((window as any).deferredPrompt) {
        setDeferredPrompt((window as any).deferredPrompt);
        setIsInstallable(true);
      }

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, []);

  const installApp = async () => {
    console.log('🚀 Install requested');
    
    if (deferredPrompt) {
      // We have the native prompt
      try {
        console.log('📲 Showing native prompt');
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        
        console.log('👤 User choice:', choiceResult.outcome);
        
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
          setIsInstallable(false);
          setDeferredPrompt(null);
          return true;
        }
        return false;
      } catch (error) {
        console.error('💥 Install error:', error);
      }
    }
    
    // No native prompt - show instructions
    console.log('📝 Showing manual instructions');
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|iphone|ipad|ipod/i.test(userAgent);
    
    let message = '📱 To install this app:\n\n';
    
    if (isMobile) {
      if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
        message += '1. Tap the menu (⋮) in top right\n2. Select "Add to Home screen"\n3. Tap "Add"';
      } else if (userAgent.includes('safari')) {
        message += '1. Tap the Share button (⬆️)\n2. Scroll and tap "Add to Home Screen"\n3. Tap "Add"';
      } else {
        message += 'Open this site in Chrome or Safari to install';
      }
    } else {
      if (userAgent.includes('chrome') || userAgent.includes('edg')) {
        message += '1. Look for install icon (⊕) in address bar\n2. Click it to install\n\nOr:\n1. Click menu (⋮)\n2. Select "Install DevFest 2025"';
      } else {
        message += 'Please use Chrome or Edge browser to install this app';
      }
    }
    
    alert(message);
    return false;
  };

  return {
    isInstallable,
    isInstalled,
    installApp
  };
};
