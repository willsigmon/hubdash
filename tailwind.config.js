/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        hti: {
          navy: '#0E2240',
          blue: '#6FC3DF',
          white: '#FFFFFF',
        },
      },
    },
  },
  plugins: [],
}
