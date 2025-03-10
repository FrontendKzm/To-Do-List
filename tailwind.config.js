/** @type {import('tailwindcss').Config} */
export default {
  corePlugins: {
    preflight: false, // Bootstrap ile çakışmayı önlemek için
  },
  important: true,
  content: [ "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {},
  },
  plugins: [],
}

