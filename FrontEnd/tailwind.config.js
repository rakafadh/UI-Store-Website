/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // blue-500
        secondary: '#10B981', // emerald-500
        accent: '#8B5CF6', // violet-500
        dark: '#1F2937',
      }
    },
  },
  plugins: [],
}