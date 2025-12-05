import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

const PWAInstallPrompt = () => {
  const { isInstallable, installApp, isInstalled } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Only show on HTTPS
    if (window.location.protocol !== 'https:') {
      return;
    }

    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem('pwa-prompt-dismissed');
    if (dismissed === 'true') {
      return;
    }

    // Show after 3 seconds if not installed
    const timer = setTimeout(() => {
      if (!isInstalled) {
        setIsVisible(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isInstalled]);

  // Don't show if installed or dismissed; only show when installable
  if (isInstalled || isDismissed || !isVisible || !isInstallable) {
    return null;
  }

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const handleInstall = async () => {
    setIsInstalling(true);
    await installApp();
    setIsInstalling(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm animate-slide-up">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-2xl p-4 text-white relative">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3 pr-6">
          <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
            {isMobile ? (
              <Smartphone className="w-6 h-6" />
            ) : (
              <Monitor className="w-6 h-6" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg mb-1">Install DevFest App</h3>
            <p className="text-sm text-white/90 mb-3">
              Quick access to agenda, networking, and event updates.
            </p>
            
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isInstalling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  Installing...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Install Now
                </>
              )}
            </button>

            <p className="text-xs text-white/70 mt-2 text-center">
              {isInstallable
                ? (isMobile ? 'Tap Install to add to home screen' : 'Or look for install icon in address bar')
                : 'This app cannot be installed on this browser. Try Chrome/Edge (desktop) or Chrome/Safari (mobile).'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
