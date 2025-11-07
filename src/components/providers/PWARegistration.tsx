"use client";

import { useEffect } from 'react';
import { pwaManager } from '@/lib/pwa';

/**
 * PWA Service Worker Registration Component
 * Registers the service worker and handles PWA lifecycle events
 */
export default function PWARegistration() {
  useEffect(() => {
    // Register service worker on mount
    pwaManager.register();

    // Listen for PWA update events
    const handleUpdateAvailable = () => {
      // Could show a toast notification here
      console.log('🔄 PWA update available');
    };

    window.addEventListener('pwa-update-available', handleUpdateAvailable);

    return () => {
      window.removeEventListener('pwa-update-available', handleUpdateAvailable);
    };
  }, []);

  return null; // This component doesn't render anything
}

