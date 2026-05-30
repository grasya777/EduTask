/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f8ff',
          100: '#eaf0ff',
          200: '#d7e2ff',
          300: '#b8ccff',
          400: '#8aa8ff',
          500: '#5b7dff',
          600: '#4258e9',
          700: '#353fbc',
          800: '#2d368f',
          900: '#262f78',
        },
      },
      boxShadow: {
        card: '0 20px 60px rgba(15, 23, 42, 0.08)',
        soft: '0 8px 24px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
}

