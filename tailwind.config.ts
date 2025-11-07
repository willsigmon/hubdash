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
        // Official HTI Brand Palette
        hti: {
          navy: "#1e3a5f",
          "navy-dark": "#142a45",
          teal: "#4a9b9f",
          "teal-light": "#6db3b7",
          "teal-dark": "#3f8084",
          red: "#ff6b6b",
          "red-dark": "#e24e4e",
          yellow: "#ffeb3b",
          "yellow-light": "#fff9c4",
          sand: "#f4f1ea",
          stone: "#2b2829",
          fog: "#dce4e8",
          sky: "#e6f2f3",
          white: "#ffffff",

          // Semantic mappings
          primary: "#4a9b9f",
          "primary-dark": "#1e3a5f",
          secondary: "#1e3a5f",
          accent: "#ffeb3b",

          // Legacy aliases – map to updated palette so existing classes don’t break
          orange: "#4a9b9f",
          "orange-yellow": "#6db3b7",
          "yellow-orange": "#ffeb3b",
          redwood: "#ff6b6b",
          midnight: "#1e3a5f",
          plum: "#1e3a5f",
          fig: "#1e3a5f",
          ember: "#4a9b9f",
          sunset: "#6db3b7",
          gold: "#ffeb3b",
          soleil: "#ffeb3b",
          "yellow-bright": "#ffeb3b",
          gray: "#2b2829",
          "gray-light": "#f4f1ea",
        },
      },
      borderColor: {
        DEFAULT: 'rgba(30, 58, 95, 0.16)',
      },
      divideColor: {
        DEFAULT: 'rgba(30, 58, 95, 0.16)',
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
