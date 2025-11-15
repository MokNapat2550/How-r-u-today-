/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pirata': ['PirataOne', 'cursive'], /* 💎 แก้ไข: ลบเว้นวรรคออก */
      }
    },
  },
  plugins: [],
}