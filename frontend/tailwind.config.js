export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#2563eb',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp'),require('@tailwindcss/typography')],
}