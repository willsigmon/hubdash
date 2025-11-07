"use client";

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { pwaManager } from '@/lib/pwa';
import { Button } from './Button';

/**
 * PWA Install Prompt Component
 * Shows a banner prompting users to install the PWA
 */
export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkInstallStatus = () => {
      const installed = pwaManager.isPWAInstalled();
      setIsInstalled(installed);
      setShowPrompt(!installed);
    };

    checkInstallStatus();

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Show prompt after 3 seconds if not installed
    const timer = setTimeout(() => {
      if (!pwaManager.isPWAInstalled()) {
        setShowPrompt(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    const success = await pwaManager.showInstallPrompt();
    if (success) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember dismissal for 24 hours
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  // Don't show if installed or dismissed recently
  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[28rem] z-50">
      <div className="glass-card glass-card--subtle shadow-glass border border-hti-teal/35 relative overflow-hidden p-5 md:p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-hti-navy/65 via-hti-navy/45 to-hti-teal/40 opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,213,128,0.25),_transparent_55%)]" />

        <div className="relative flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-11 h-11 bg-gradient-to-br from-hti-teal to-hti-teal-light rounded-xl flex items-center justify-center shadow-lg shadow-hti-teal/30">
              <Download className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            <h3 className="text-base font-semibold text-white tracking-wide">
              Install HUBDash
            </h3>
            <p className="text-xs md:text-sm text-glass-muted leading-relaxed">
              Unlock the full HUB experience with offline access, push notifications, and lightning-fast loading when you need mission data on the go.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleInstall}
              className="text-xs px-4 py-2 shadow-lg shadow-hti-teal/30"
            >
              Install
            </Button>
            <button
              onClick={handleDismiss}
              className="p-1.5 text-glass-muted hover:text-white transition-colors"
              aria-label="Dismiss install prompt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

