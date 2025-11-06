import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // HTI Brand Colors (2025 Palette)
        hti: {
          // Core Palette
          midnight: '#0F0C11',      // Deep anchor
          plum: '#2F2D4C',          // Primary brand tone
          fig: '#433D58',           // Secondary depth
          dusk: '#4D4965',          // Muted accent
          ember: '#C05F37',         // Warm accent
          sunset: '#C65B32',        // Secondary warm accent
          gold: '#E2A835',          // Signature gold
          soleil: '#EACF3A',        // Highlight gold
          clay: '#B4ABA3',          // Neutral midtone
          sand: '#EEE6DF',          // Soft background neutral
          mist: '#757A87',          // Muted typographic support
          stone: '#615E5C',         // Dark neutral

          // Legacy aliases mapped to new palette (for existing classes)
          navy: '#2F2D4C',          // Alias → plum
          red: '#C05F37',           // Alias → ember
          orange: '#C65B32',        // Alias → sunset
          yellow: '#E2A835',        // Alias → gold
          'yellow-bright': '#EACF3A', // Alias → soleil
          gray: '#615E5C',          // Alias → stone
          'gray-light': '#EEE6DF',  // Alias → sand
          teal: '#433D58',          // Alias → fig
          'teal-light': '#615C7B',  // Softened secondary
        },
      },
      borderColor: {
        DEFAULT: '#433D5829', // Subtle plum tint for default borders
      },
      divideColor: {
        DEFAULT: '#433D5829',
      },
      animation: {
        'counter': 'counter 2s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        counter: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
