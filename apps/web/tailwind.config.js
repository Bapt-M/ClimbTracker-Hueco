/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette mono (Zinc scale)
        "mono-950": "#09090b", // Zinc 950
        "mono-900": "#18181b", // Zinc 900
        "mono-800": "#27272a", // Zinc 800
        "mono-700": "#3f3f46", // Zinc 700
        "mono-600": "#52525b", // Zinc 600
        "mono-500": "#71717a", // Zinc 500
        "mono-400": "#a1a1aa", // Zinc 400
        "mono-300": "#d4d4d8", // Zinc 300
        "mono-200": "#e4e4e7", // Zinc 200
        "mono-100": "#f4f4f5", // Zinc 100
        "mono-50": "#fafafa",  // Zinc 50

        // Couleurs d'accent
        "highlight": "#2563eb", // Royal Blue
        "highlight-hover": "#1d4ed8",
        "success": "#10b981", // Emerald 500
        "accent": "#f59e0b", // Amber 500
        "urgent": "#ef4444", // Red 500
      },
      fontFamily: {
        'display': ['Lexend', 'sans-serif'],
      },
      borderRadius: {
        'DEFAULT': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      maxWidth: {
        'mobile': '100%',
        'md': '448px', // max-w-md from template
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'card': '0 2px 4px -1px rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        'glow': '0 0 15px rgba(37, 99, 235, 0.2)',
      }
    },
  },
  plugins: [],
}
