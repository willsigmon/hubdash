"use client";

import { useEffect } from 'react';
import { registerDefaultShortcuts } from '@/lib/accessibility/keyboard-shortcuts';

/**
 * Accessibility Provider Component
 * Initializes accessibility features like keyboard shortcuts
 */
export default function AccessibilityProvider() {
  useEffect(() => {
    // Register default keyboard shortcuts
    registerDefaultShortcuts();

    // Add high contrast CSS if needed
    const style = document.createElement('style');
    style.textContent = `
      .high-contrast {
        --hti-navy: #000000;
        --hti-teal: #0000FF;
        --hti-yellow: #FFFF00;
        --hti-red: #FF0000;
        --hti-sand: #FFFFFF;
        --hti-stone: #000000;
      }

      .high-contrast * {
        border-color: #000000 !important;
      }

      .large-text {
        font-size: 1.2em !important;
      }

      .large-text h1 { font-size: 2.4em !important; }
      .large-text h2 { font-size: 2.1em !important; }
      .large-text h3 { font-size: 1.8em !important; }

      .screen-reader button,
      .screen-reader a,
      .screen-reader input,
      .screen-reader select {
        min-height: 44px;
        min-width: 44px;
      }

      /* Focus indicators for keyboard navigation */
      .focus-visible:focus {
        outline: 3px solid #008080;
        outline-offset: 2px;
      }

      /* Skip links */
      .skip-to-content {
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 100;
        border-radius: 4px;
      }

      .skip-to-content:focus {
        top: 6px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null; // This component doesn't render anything
}
