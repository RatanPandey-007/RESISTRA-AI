/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#03070d',
          900: '#07111d',
          850: '#0b1626',
          800: '#0e1d32',
          750: '#14253e',
          700: '#1c3152',
          600: '#27446f',
        },
        res: {
          base: '#03070D',
          navy: '#07111D',
          panel: 'rgba(8, 18, 30, 0.72)',
          cyan: '#18BFFF',
          blue: '#4D8DFF',
          green: '#25E6B0',
          amber: '#FFB020',
          red: '#FF3B4E',
          white: '#F4F8FC',
          muted: '#718096',
        },
        cyan: {
          300: '#67e8f9',
          400: '#18BFFF',
          500: '#0284c7',
          glow: '#18BFFF',
        },
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#0284c7',
          600: '#0369a1',
          700: '#075985',
          800: '#0c4a6e',
          900: '#0a3651',
        },
        slate: {
          850: '#1e293b',
        }
      },
      boxShadow: {
        'glass': '0 20px 60px rgba(0, 0, 0, 0.45)',
        'glass-glow': '0 0 25px -5px rgba(24, 191, 255, 0.3)',
        'rose-glow': '0 0 25px -5px rgba(255, 59, 78, 0.35)',
        'cyan-glow': '0 0 20px 0 rgba(24, 191, 255, 0.35)',
        'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Roboto Mono', 'ui-monospace', 'monospace'],
      }
    },
  },
  plugins: [],
}
