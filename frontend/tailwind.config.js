/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fbf8f1',
          100: '#f5eedc',
          200: '#ead9b5',
          300: '#dec088',
          400: '#d4af37',
          500: '#c59b27',
          600: '#a87d1e',
          700: '#865f1b',
          800: '#6f4d1c',
          900: '#5d401b',
        },
        obsidian: {
          950: '#05070B',
          900: '#0A0E17',
          800: '#111726',
          700: '#1A2235',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F3E5AB 50%, #AA7C11 100%)',
      },
    },
  },
  plugins: [],
};
