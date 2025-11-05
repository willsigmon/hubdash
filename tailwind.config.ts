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
        // HTI Brand Colors - Official Palette
        hti: {
          navy: '#191347',        // Primary dark navy
          red: '#E45927',         // Power button red
          orange: '#F58420',      // Orange accent
          yellow: '#FDB715',      // Primary yellow
          'yellow-bright': '#FAD506', // Bright yellow
          gray: '#282829',        // Dark gray
          'gray-light': '#f5f5f5', // Light gray
        },
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
