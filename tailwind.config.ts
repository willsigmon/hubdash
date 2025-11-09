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
        // HTI Brand Colors (from logo)
        hti: {
          // Logo gradient circles (left to right)
          orange: '#E67E50',        // Circle 1 (leftmost)
          amber: '#F19E3E',         // Circle 2
          gold: '#F5BB2D',          // Circle 3
          yellow: '#F9D71C',        // Circle 4 (rightmost/brightest)
          
          // Logo text and backgrounds
          navy: '#1B365D',          // Primary text color from logo
          white: '#FFFFFF',         // Background/contrast
          
          // Extended palette for UI needs
          'navy-light': '#2A4A7C',  // Lighter navy for borders
          'navy-dark': '#0F1F3D',   // Darker navy for depth
          'gray': '#6B7280',        // Neutral gray
          'gray-light': '#F3F4F6',  // Light backgrounds
        },
      },
      fontFamily: {
        sans: ['Geomanist', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderColor: {
        DEFAULT: 'rgba(27, 54, 93, 0.12)', // Subtle navy tint for default borders
      },
      divideColor: {
        DEFAULT: 'rgba(27, 54, 93, 0.12)',
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
