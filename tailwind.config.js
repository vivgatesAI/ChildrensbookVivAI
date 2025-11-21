/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#258cf4',
        'background-light': '#f5f7f8',
        'background-dark': '#101922',
        'sunny-yellow': '#FFD966',
        coral: '#FF8C69',
        'dark-navy': '#1A237E',
        'soft-cream': '#FAF3E0',
        'sky-blue': '#E3F2FD',
      },
      fontFamily: {
        display: ['Spline Sans', 'Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '1rem',
        lg: '2rem',
        xl: '3rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
}

