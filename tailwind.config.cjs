/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0052A5',
          red: '#FF0000',
        },
        primary: {
          50: '#E6EFF8',
          100: '#CCDFF1',
          200: '#99BFE3',
          300: '#669FD5',
          400: '#337FC7',
          500: '#0052A5',
          600: '#004A94',
          700: '#003D7A',
          800: '#002F5F',
          900: '#002245',
        },
        secondary: {
          50: '#FFE6E6',
          100: '#FFCCCC',
          200: '#FF9999',
          300: '#FF6666',
          400: '#FF3333',
          500: '#FF0000',
          600: '#E60000',
          700: '#CC0000',
          800: '#990000',
          900: '#660000',
        },
      },
    },
  },
  plugins: [],
} 