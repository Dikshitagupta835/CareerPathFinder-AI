/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          lightBg: '#F8FAFC',
          darkBg: '#0F172A',
          primary: '#4F46E5', // Indigo
          secondary: '#7C3AED', // Purple
          accent: '#10B981', // Emerald
          warning: '#F59E0B', // Amber
          danger: '#EF4444', // Rose
          cardLight: '#FFFFFF',
          cardDark: '#1E293B',
          sidebarLight: '#F1F5F9',
          sidebarDark: '#0F172A',
        }
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'glass': '20px',
      },
      boxShadow: {
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
