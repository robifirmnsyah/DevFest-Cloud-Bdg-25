import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor, Info } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

const PWAInstallPrompt = () => {
  const { isInstallable, installApp, isInstalled } = usePWA();
  const [isVisible, setIsVisible] = useState(true);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showManualInstructions, setShowManualInstructions] = useState(false);
  const [isDismissedPermanently, setIsDismissedPermanently] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed === 'true') {
      setIsDismissedPermanently(true);
      setIsVisible(false);
    }
  }, []);

  // Only show on HTTPS (production)
  if (window.location.protocol !== 'https:') {
    return null;
  }

  // Don't show if not installable, already installed, or dismissed
  if (!isInstallable || isInstalled || !isVisible || isDismissedPermanently) {
    return null;
  }

  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const handleInstall = async () => {
    setIsInstalling(true);
    const success = await installApp();
    if (!success) {
      setShowManualInstructions(true);
    }
    setIsInstalling(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Don't permanently dismiss - allow it to show again on next visit
  };

  const handlePermanentDismiss = () => {
    setIsVisible(false);
    setIsDismissedPermanently(true);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 animate-slide-up">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3">
          <div className="bg-[#4285F4]/10 p-2 rounded-lg flex-shrink-0">
            {isMobile ? (
              <Smartphone className="w-6 h-6 text-[#4285F4]" />
            ) : (
              <Monitor className="w-6 h-6 text-[#4285F4]" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 mb-1">Install DevFest App</h3>
            <p className="text-sm text-gray-600 mb-3">
              Get quick access to event info, agenda, and updates directly from your {isMobile ? 'home screen' : 'desktop'}.
            </p>
            
            {showManualInstructions ? (
              <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-800">
                    <p className="font-semibold mb-1">Manual Installation:</p>
                    {isMobile ? (
                      <>
                        <p><strong>Chrome Android:</strong> Menu (⋮) → "Add to Home screen"</p>
                        <p><strong>Safari iOS:</strong> Share button → "Add to Home Screen"</p>
                        <p><strong>Edge Mobile:</strong> Menu (⋯) → "Add to phone"</p>
                      </>
                    ) : (
                      <>
                        <p><strong>Chrome:</strong> Address bar install icon or Menu → "Install DevFest 2025"</p>
                        <p><strong>Edge:</strong> Address bar install icon or Menu → "Apps" → "Install this site as an app"</p>
                        <p><strong>Firefox:</strong> Address bar → Install icon</p>
                        <p className="mt-2 text-amber-700"><strong>Note:</strong> Look for install icon ⬇️ in address bar</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
            
            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                disabled={isInstalling}
                className="flex-1 bg-[#4285F4] hover:bg-[#1a73e8] text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isInstalling ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Installing...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Install
                  </>
                )}
              </button>
              <button
                onClick={handlePermanentDismiss}
                className="text-xs text-gray-500 hover:text-gray-700 px-2"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
