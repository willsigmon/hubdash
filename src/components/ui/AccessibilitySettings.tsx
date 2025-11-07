"use client";

import { useState, useEffect } from 'react';
import { Eye, Keyboard, Monitor, Volume2, VolumeX, Settings } from 'lucide-react';
import { useAppStore } from '@/lib/stores/app-store';
import { useKeyboardShortcuts, registerDefaultShortcuts } from '@/lib/accessibility/keyboard-shortcuts';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Accessibility Settings Component
 * Provides comprehensive accessibility controls for users
 */
export default function AccessibilitySettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [announceChanges, setAnnounceChanges] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [screenReaderMode, setScreenReaderMode] = useState(false);

  const { toggleShortcuts, isEnabled: shortcutsEnabled } = useKeyboardShortcuts();

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;

    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (reducedMotion) {
      root.style.setProperty('--animation-duration', '0s');
    } else {
      root.style.removeProperty('--animation-duration');
    }

    if (largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    if (screenReaderMode) {
      root.classList.add('screen-reader');
    } else {
      root.classList.remove('screen-reader');
    }
  }, [highContrast, reducedMotion, largeText, screenReaderMode]);

  // Announce changes to screen readers
  const announceChange = (message: string) => {
    if (announceChanges) {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.style.position = 'absolute';
      announcement.style.left = '-10000px';
      announcement.style.width = '1px';
      announcement.style.height = '1px';
      announcement.style.overflow = 'hidden';
      announcement.textContent = message;
      document.body.appendChild(announcement);

      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    announceChange(`High contrast mode ${!highContrast ? 'enabled' : 'disabled'}`);
  };

  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
    announceChange(`Reduced motion ${!reducedMotion ? 'enabled' : 'disabled'}`);
  };

  const toggleLargeText = () => {
    setLargeText(!largeText);
    announceChange(`Large text mode ${!largeText ? 'enabled' : 'disabled'}`);
  };

  const toggleScreenReaderMode = () => {
    setScreenReaderMode(!screenReaderMode);
    announceChange(`Screen reader optimizations ${!screenReaderMode ? 'enabled' : 'disabled'}`);
  };

  const toggleKeyboardShortcuts = () => {
    toggleShortcuts();
    announceChange(`Keyboard shortcuts ${!shortcutsEnabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-30 w-12 h-12 bg-hti-teal rounded-full shadow-lg border border-hti-teal/20 flex items-center justify-center text-white hover:bg-hti-teal-light transition-colors"
        aria-label="Open accessibility settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Settings Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-hti-teal/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-hti-teal/10 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-hti-teal" />
                  </div>
                  <h2 className="text-xl font-semibold text-hti-navy">Accessibility Settings</h2>
                </div>
                <p className="text-hti-stone text-sm">
                  Customize your experience to meet your accessibility needs
                </p>
              </div>

              {/* Settings */}
              <div className="p-6 space-y-6">
                {/* Visual Settings */}
                <div>
                  <h3 className="font-medium text-hti-navy mb-4 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Visual
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 rounded-lg hover:bg-hti-sand/30 transition-colors">
                      <div>
                        <div className="font-medium text-hti-navy">High Contrast</div>
                        <div className="text-sm text-hti-stone">Increase contrast for better visibility</div>
                      </div>
                      <button
                        onClick={toggleHighContrast}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          highContrast ? 'bg-hti-teal' : 'bg-gray-300'
                        }`}
                        aria-pressed={highContrast}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          highContrast ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-lg hover:bg-hti-sand/30 transition-colors">
                      <div>
                        <div className="font-medium text-hti-navy">Large Text</div>
                        <div className="text-sm text-hti-stone">Increase text size across the application</div>
                      </div>
                      <button
                        onClick={toggleLargeText}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          largeText ? 'bg-hti-teal' : 'bg-gray-300'
                        }`}
                        aria-pressed={largeText}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          largeText ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-lg hover:bg-hti-sand/30 transition-colors">
                      <div>
                        <div className="font-medium text-hti-navy">Reduced Motion</div>
                        <div className="text-sm text-hti-stone">Minimize animations and transitions</div>
                      </div>
                      <button
                        onClick={toggleReducedMotion}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          reducedMotion ? 'bg-hti-teal' : 'bg-gray-300'
                        }`}
                        aria-pressed={reducedMotion}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          reducedMotion ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </label>
                  </div>
                </div>

                {/* Interaction Settings */}
                <div>
                  <h3 className="font-medium text-hti-navy mb-4 flex items-center gap-2">
                    <Keyboard className="w-4 h-4" />
                    Interaction
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 rounded-lg hover:bg-hti-sand/30 transition-colors">
                      <div>
                        <div className="font-medium text-hti-navy">Keyboard Shortcuts</div>
                        <div className="text-sm text-hti-stone">Enable keyboard navigation shortcuts</div>
                      </div>
                      <button
                        onClick={toggleKeyboardShortcuts}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          shortcutsEnabled ? 'bg-hti-teal' : 'bg-gray-300'
                        }`}
                        aria-pressed={shortcutsEnabled}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          shortcutsEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-lg hover:bg-hti-sand/30 transition-colors">
                      <div>
                        <div className="font-medium text-hti-navy">Screen Reader Mode</div>
                        <div className="text-sm text-hti-stone">Optimize for screen reader compatibility</div>
                      </div>
                      <button
                        onClick={toggleScreenReaderMode}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          screenReaderMode ? 'bg-hti-teal' : 'bg-gray-300'
                        }`}
                        aria-pressed={screenReaderMode}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          screenReaderMode ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </label>
                  </div>
                </div>

                {/* Audio Settings */}
                <div>
                  <h3 className="font-medium text-hti-navy mb-4 flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    Audio
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 rounded-lg hover:bg-hti-sand/30 transition-colors">
                      <div>
                        <div className="font-medium text-hti-navy">Announce Changes</div>
                        <div className="text-sm text-hti-stone">Screen reader announcements for setting changes</div>
                      </div>
                      <button
                        onClick={() => setAnnounceChanges(!announceChanges)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          announceChanges ? 'bg-hti-teal' : 'bg-gray-300'
                        }`}
                        aria-pressed={announceChanges}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          announceChanges ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </label>
                  </div>
                </div>

                {/* Keyboard Shortcuts Help */}
                <div>
                  <h3 className="font-medium text-hti-navy mb-4 flex items-center gap-2">
                    <Keyboard className="w-4 h-4" />
                    Keyboard Shortcuts
                  </h3>
                  <div className="bg-hti-sand/20 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Dashboard Navigation:</span>
                      <span className="font-mono">Alt + 1-4</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Global Search:</span>
                      <span className="font-mono">Ctrl + K</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Refresh Data:</span>
                      <span className="font-mono">Ctrl + R</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Accessibility Menu:</span>
                      <span className="font-mono">Alt + S</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-hti-teal/10 flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setIsOpen(false)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
