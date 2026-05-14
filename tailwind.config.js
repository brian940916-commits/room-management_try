/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#e8f0f7',
          100: '#c5d8eb',
          200: '#9fbddd',
          300: '#79a2cf',
          400: '#5c8ec5',
          500: '#3f7abb',
          600: '#2e6aaa',
          700: '#1B4F72',
          800: '#154060',
          900: '#0e2f48',
        },
        accent: {
          50:  '#fef0e8',
          100: '#fcd8c5',
          200: '#f9be9f',
          300: '#f5a378',
          400: '#f28d59',
          500: '#E8590C',
          600: '#d14d09',
          700: '#b54108',
          800: '#983506',
          900: '#7c2a04',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', '"Noto Sans TC"', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.08)',
        'card-hover': '0 6px 24px rgba(0,0,0,0.14)',
      },
    },
  },
  plugins: [],
}
