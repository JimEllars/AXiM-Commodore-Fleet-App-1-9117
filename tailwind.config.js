/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#030712', // Ultra dark background
        'axim-teal': '#2dd4bf', // Teal 400
        'axim-teal-dim': 'rgba(45, 212, 191, 0.1)',
        'axim-panel': '#111827', // Gray 900
        'axim-border': '#1f2937', // Gray 800
        'axim-alert': '#f43f5e', // Rose 500
        'axim-warn': '#fbbf24', // Amber 400
        'axim-success': '#10b981', // Emerald 500
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace'],
      }
    },
  },
  plugins: [],
}