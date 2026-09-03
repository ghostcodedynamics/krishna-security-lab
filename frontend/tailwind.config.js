/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#05070f',
          secondary: '#0a0e1a',
          elevated: '#111827',
        },
        gold: {
          DEFAULT: '#d4af37',
          light: '#f0c75e',
          dark: '#b8860b',
        },
        cyan: {
          accent: '#22d3ee',
        },
        emerald: {
          accent: '#34d399',
        },
        rose: {
          accent: '#fb7185',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        gold: '0 0 20px rgba(212, 175, 55, 0.3)',
        cyan: '0 0 20px rgba(34, 211, 238, 0.3)',
      },
    },
  },
  plugins: [],
};
