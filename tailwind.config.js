/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // 👈 VERY IMPORTANT
  theme: {
    extend: {
      colors: {
        'light-bg': '#f2f3f5',
        'light-card': '#e8e6e6',
        'dark-bg': '#020714',
        'dark-card': '#050000',
        'brand-orange': '#FF7401',
        'brand-orange-hover': '#e86500',
        'text-light': '#1f1f1f',
        'text-dark': '#f5f5f5'
      }
    },
  },
  plugins: [],
}
