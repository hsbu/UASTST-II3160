/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FEFAE0',
          100: '#FAEDCD',
          200: '#E9EDC9',
          300: '#CCD5AE',
          400: '#D4A373',
          500: '#D4A373',
          600: '#C89563',
          700: '#B88753',
          800: '#A77943',
          900: '#8B6638',
        },
      },
    },
  },
  plugins: [],
};
