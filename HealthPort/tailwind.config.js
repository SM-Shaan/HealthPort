/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A76D8',
        primaryHover: '#006dd3',
        btnNice: '#D8EBFA',
        btnNiceText: '#1b62b3',
      },
    },
  },
  plugins: [],
}
