/** @type {import('tailwindcss').Config} */
export default {
  /* --- นี่คือจุดตรวจสอบที่ 2 --- */
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <-- บรรทัดนี้สำคัญมาก!
  ],
  /* ------------------------- */
  theme: {
    extend: {
      colors: {
        'theme-pink': '#F8BBD0',
        'theme-blue': '#D9F3FF',
      },
    },
  },
  plugins: [],
}

