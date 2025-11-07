/**
 * Keyboard Shortcuts Manager
 * Provides global keyboard shortcuts for power users and accessibility
 */

import { create } from 'zustand';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean; // Cmd on Mac, Windows key on Windows
  description: string;
  action: () => void;
  category: string;
  enabled?: boolean;
}

interface KeyboardShortcutsState {
  shortcuts: KeyboardShortcut[];
  isEnabled: boolean;

  // Actions
  registerShortcut: (shortcut: KeyboardShortcut) => void;
  unregisterShortcut: (key: string, modifiers?: Partial<Pick<KeyboardShortcut, 'ctrl' | 'alt' | 'shift' | 'meta'>>) => void;
  toggleShortcuts: () => void;
  getShortcutsByCategory: (category: string) => KeyboardShortcut[];
  executeShortcut: (shortcut: KeyboardShortcut) => void;
}

// Global shortcuts registry
export const useKeyboardShortcuts = create<KeyboardShortcutsState>((set, get) => ({
  shortcuts: [],
  isEnabled: true,

  registerShortcut: (shortcut) => {
    set((state) => ({
      shortcuts: [...state.shortcuts.filter(s => !(s.key === shortcut.key &&
        s.ctrl === shortcut.ctrl &&
        s.alt === shortcut.alt &&
        s.shift === shortcut.shift &&
        s.meta === shortcut.meta)), shortcut],
    }));
  },

  unregisterShortcut: (key, modifiers = {}) => {
    set((state) => ({
      shortcuts: state.shortcuts.filter(s =>
        !(s.key === key &&
          s.ctrl === (modifiers.ctrl ?? false) &&
          s.alt === (modifiers.alt ?? false) &&
          s.shift === (modifiers.shift ?? false) &&
          s.meta === (modifiers.meta ?? false))
      ),
    }));
  },

  toggleShortcuts: () => {
    set((state) => ({ isEnabled: !state.isEnabled }));
  },

  getShortcutsByCategory: (category) => {
    return get().shortcuts.filter(s => s.category === category && (s.enabled ?? true));
  },

  executeShortcut: (shortcut) => {
    if (shortcut.action) {
      shortcut.action();
    }
  },
}));

// Keyboard event handler
class KeyboardShortcutsHandler {
  private static instance: KeyboardShortcutsHandler;
  private boundHandler: (event: KeyboardEvent) => void;

  private constructor() {
    this.boundHandler = this.handleKeyDown.bind(this);
    this.attachListeners();
  }

  static getInstance(): KeyboardShortcutsHandler {
    if (!KeyboardShortcutsHandler.instance) {
      KeyboardShortcutsHandler.instance = new KeyboardShortcutsHandler();
    }
    return KeyboardShortcutsHandler.instance;
  }

  private attachListeners(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.boundHandler);
    }
  }

  private detachListeners(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.boundHandler);
    }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const { shortcuts, isEnabled, executeShortcut } = useKeyboardShortcuts.getState();

    if (!isEnabled) return;

    // Don't trigger shortcuts when user is typing in inputs
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.contentEditable === 'true') {
      return;
    }

    const matchingShortcut = shortcuts.find(shortcut =>
      shortcut.key.toLowerCase() === event.key.toLowerCase() &&
      !!shortcut.ctrl === event.ctrlKey &&
      !!shortcut.alt === event.altKey &&
      !!shortcut.shift === event.shiftKey &&
      !!shortcut.meta === event.metaKey &&
      (shortcut.enabled ?? true)
    );

    if (matchingShortcut) {
      event.preventDefault();
      event.stopPropagation();
      executeShortcut(matchingShortcut);
    }
  }

  destroy(): void {
    this.detachListeners();
  }
}

// Initialize the keyboard shortcuts handler
export const keyboardShortcutsHandler = KeyboardShortcutsHandler.getInstance();

// Predefined shortcuts
export const registerDefaultShortcuts = () => {
  const { registerShortcut } = useKeyboardShortcuts.getState();

  // Navigation shortcuts
  registerShortcut({
    key: '1',
    alt: true,
    description: 'Go to Board Dashboard',
    category: 'Navigation',
    action: () => {
      if (typeof window !== 'undefined') {
        window.location.href = '/board';
      }
    },
  });

  registerShortcut({
    key: '2',
    alt: true,
    description: 'Go to Operations Hub',
    category: 'Navigation',
    action: () => {
      if (typeof window !== 'undefined') {
        window.location.href = '/ops';
      }
    },
  });

  registerShortcut({
    key: '3',
    alt: true,
    description: 'Go to Reports',
    category: 'Navigation',
    action: () => {
      if (typeof window !== 'undefined') {
        window.location.href = '/reports';
      }
    },
  });

  registerShortcut({
    key: '4',
    alt: true,
    description: 'Go to Marketing Hub',
    category: 'Navigation',
    action: () => {
      if (typeof window !== 'undefined') {
        window.location.href = '/marketing';
      }
    },
  });

  registerShortcut({
    key: 'h',
    alt: true,
    description: 'Go to Home',
    category: 'Navigation',
    action: () => {
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    },
  });

  // Search shortcuts
  registerShortcut({
    key: 'k',
    ctrl: true,
    description: 'Focus global search',
    category: 'Search',
    action: () => {
      const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    },
  });

  // Accessibility shortcuts
  registerShortcut({
    key: 't',
    alt: true,
    description: 'Toggle theme',
    category: 'Accessibility',
    action: () => {
      // This will be implemented when theme toggle is available
      console.log('Theme toggle shortcut triggered');
    },
  });

  registerShortcut({
    key: 's',
    alt: true,
    description: 'Toggle shortcuts help',
    category: 'Accessibility',
    action: () => {
      // This will show/hide the shortcuts help modal
      console.log('Shortcuts help toggle triggered');
    },
  });

  // Application shortcuts
  registerShortcut({
    key: 'r',
    ctrl: true,
    description: 'Refresh data',
    category: 'Application',
    action: () => {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    },
  });
};
