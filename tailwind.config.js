/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sage': {
          50: '#f5f9f6',
          100: '#e8f4ea',
          200: '#d4e4d4',
          300: '#a8c5a8',
          400: '#7db88e',
          500: '#6b9e78',
          600: '#4a7c59',
          700: '#2d3e2d',
        },
      },
    },
  },
  plugins: [],
}