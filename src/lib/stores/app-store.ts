/**
 * Global App State Store
 * Manages app-wide state like theme, notifications, user preferences
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type NotificationLevel = 'all' | 'important' | 'none';

interface AppState {
  // Theme management
  theme: Theme;
  systemTheme: 'light' | 'dark';

  // UI state
  sidebarCollapsed: boolean;
  notificationsEnabled: boolean;
  notificationLevel: NotificationLevel;

  // PWA state
  isOnline: boolean;
  isInstalled: boolean;
  installPromptDismissed: boolean;

  // Performance monitoring
  lastSyncTime: number | null;
  cacheStats: {
    hits: number;
    misses: number;
    size: number;
  };

  // User preferences
  autoRefresh: boolean;
  refreshInterval: number; // minutes
  compactMode: boolean;

  // Actions
  setTheme: (theme: Theme) => void;
  setSystemTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setNotificationLevel: (level: NotificationLevel) => void;
  setOnlineStatus: (online: boolean) => void;
  setInstalled: (installed: boolean) => void;
  dismissInstallPrompt: () => void;
  updateCacheStats: (stats: Partial<AppState['cacheStats']>) => void;
  setLastSyncTime: (time: number) => void;
  setAutoRefresh: (enabled: boolean) => void;
  setRefreshInterval: (minutes: number) => void;
  toggleCompactMode: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'system',
      systemTheme: 'light',
      sidebarCollapsed: false,
      notificationsEnabled: true,
      notificationLevel: 'important',
      isOnline: true,
      isInstalled: false,
      installPromptDismissed: false,
      lastSyncTime: null,
      cacheStats: {
        hits: 0,
        misses: 0,
        size: 0,
      },
      autoRefresh: true,
      refreshInterval: 5,
      compactMode: false,

      // Actions
      setTheme: (theme) => set({ theme }),
      setSystemTheme: (systemTheme) => set({ systemTheme }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setNotificationLevel: (level) => set({ notificationLevel: level }),
      setOnlineStatus: (online) => set({ isOnline: online }),
      setInstalled: (installed) => set({ isInstalled: installed }),
      dismissInstallPrompt: () => set({ installPromptDismissed: true }),
      updateCacheStats: (stats) =>
        set((state) => ({
          cacheStats: { ...state.cacheStats, ...stats },
        })),
      setLastSyncTime: (time) => set({ lastSyncTime: time }),
      setAutoRefresh: (enabled) => set({ autoRefresh: enabled }),
      setRefreshInterval: (minutes) => set({ refreshInterval: minutes }),
      toggleCompactMode: () => set((state) => ({ compactMode: !state.compactMode })),
    }),
    {
      name: 'hubdash-app-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        notificationsEnabled: state.notificationsEnabled,
        notificationLevel: state.notificationLevel,
        installPromptDismissed: state.installPromptDismissed,
        autoRefresh: state.autoRefresh,
        refreshInterval: state.refreshInterval,
        compactMode: state.compactMode,
      }),
    }
  )
);

// Selectors for computed values
export const useTheme = () => {
  const { theme, systemTheme } = useAppStore();
  return theme === 'system' ? systemTheme : theme;
};

export const useIsDark = () => {
  const theme = useTheme();
  return theme === 'dark';
};

export const useShouldShowInstallPrompt = () => {
  const { isInstalled, installPromptDismissed, isOnline } = useAppStore();
  return !isInstalled && !installPromptDismissed && isOnline;
};

