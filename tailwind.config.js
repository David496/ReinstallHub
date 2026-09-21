/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        win: {
          bg: 'rgb(var(--win-bg) / <alpha-value>)',
          panel: 'rgb(var(--win-panel) / <alpha-value>)',
          card: 'rgb(var(--win-card) / <alpha-value>)',
          cardHover: 'rgb(var(--win-card-hover) / <alpha-value>)',
          border: 'rgb(var(--win-border) / <alpha-value>)',
          borderSubtle: 'rgb(var(--win-border-subtle) / <alpha-value>)',
          primary: 'rgb(var(--win-primary) / <alpha-value>)',
          primaryHover: 'rgb(var(--win-primary-hover) / <alpha-value>)',
          accent: 'rgb(var(--win-accent) / <alpha-value>)',
          text: 'rgb(var(--win-text) / <alpha-value>)',
          muted: 'rgb(var(--win-muted) / <alpha-value>)',
          success: 'rgb(var(--win-success) / <alpha-value>)',
          warning: 'rgb(var(--win-warning) / <alpha-value>)',
          danger: 'rgb(var(--win-danger) / <alpha-value>)',
        }
      },
      fontFamily: {
        sans: ['Segoe UI Variable Text', 'Segoe UI', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
