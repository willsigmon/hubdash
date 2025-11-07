/**
 * PWA Service Worker Registration and Management
 */

export interface PWAInstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: PWAInstallPrompt;
  }
}

export class PWAManager {
  private static instance: PWAManager;
  private deferredPrompt: PWAInstallPrompt | null = null;
  private isInstalled = false;

  private constructor() {}

  static getInstance(): PWAManager {
    if (!PWAManager.instance) {
      PWAManager.instance = new PWAManager();
    }
    return PWAManager.instance;
  }

  /**
   * Register the service worker
   */
  async register(): Promise<void> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.log('⚠️ Service Worker not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('✅ Service Worker registered:', registration.scope);

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, notify user
              this.showUpdateNotification();
            }
          });
        }
      });

      // Listen for install prompt
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.deferredPrompt = e;
        console.log('📱 PWA install prompt captured');
      });

      // Check if already installed
      window.addEventListener('appinstalled', () => {
        this.isInstalled = true;
        console.log('📱 PWA installed successfully');
      });

      // Check current install status
      if (window.matchMedia('(display-mode: standalone)').matches) {
        this.isInstalled = true;
      }

    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  }

  /**
   * Show install prompt to user
   */
  async showInstallPrompt(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('✅ User accepted PWA install');
        this.isInstalled = true;
        return true;
      } else {
        console.log('❌ User dismissed PWA install');
        return false;
      }
    } catch (error) {
      console.error('❌ PWA install prompt failed:', error);
      return false;
    } finally {
      this.deferredPrompt = null;
    }
  }

  /**
   * Check if PWA is installed
   */
  isPWAInstalled(): boolean {
    return this.isInstalled || window.matchMedia('(display-mode: standalone)').matches;
  }

  /**
   * Show update notification
   */
  private showUpdateNotification(): void {
    // This would typically show a toast notification
    // For now, just log and could trigger a custom event
    console.log('🔄 New app version available!');

    // Dispatch custom event for UI to handle
    window.dispatchEvent(new CustomEvent('pwa-update-available'));
  }

  /**
   * Force service worker update
   */
  async updateServiceWorker(): Promise<void> {
    if (!('serviceWorker' in navigator)) return;

    const registration = await navigator.serviceWorker.ready;
    await registration.update();
  }

  /**
   * Unregister service worker (for development)
   */
  async unregister(): Promise<void> {
    if (!('serviceWorker' in navigator)) return;

    const registration = await navigator.serviceWorker.ready;
    await registration.unregister();
    console.log('🗑️ Service Worker unregistered');
  }
}

// Export singleton instance
export const pwaManager = PWAManager.getInstance();

