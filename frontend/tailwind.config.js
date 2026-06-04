/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aegean: {
          50: '#f0f7fa',
          100: '#e0f0f5',
          200: '#b8deeb',
          300: '#7ec4db',
          400: '#3da3c4',
          500: '#2287a9',
          600: '#1d6d8c',
          700: '#1a5972',
          800: '#194b60',
          900: '#193f53',
          950: '#0b1d28',
        },
        gold: {
          DEFAULT: '#d4af37',
          50: '#fbf8eb',
          100: '#f4ebb9',
          200: '#ebd876',
          300: '#e0be3c',
          400: '#caa324',
          500: '#ab841b',
          600: '#866114',
          700: '#644411',
          800: '#472f0f',
          900: '#2b1c0a',
        }
      },
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        display: ['DM Serif Display', 'serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(11, 29, 40, 0.37)',
        'glass-lg': '0 12px 40px 0 rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [],
}