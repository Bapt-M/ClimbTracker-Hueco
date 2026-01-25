/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fond principal
        "cream": "#FDFCF0",
        "cream-dark": "#F5F4E8",

        // Texte principal
        "climb-dark": "#252A34",
        "ink": "#1A1A1A",

        // Couleurs des prises (pastels vibrantes)
        "hold-pink": "#FF2E63",
        "hold-blue": "#08D9D6",
        "hold-yellow": "#FFD700",
        "hold-green": "#2ECC71",
        "hold-orange": "#FF8C00",
        "hold-purple": "#9B59B6",
        "hold-red": "#EF4444",
        "hold-white": "#F8F8F8",
        "hold-black": "#1A1A1A",

        // Couleurs d'état
        "success": "#2ECC71",
        "warning": "#FFD700",
        "error": "#FF2E63",

        // Grades (couleurs ludiques)
        "grade": {
          "green-light": "#86efac",
          "green": "#22c55e",
          "blue-light": "#7dd3fc",
          "blue": "#3b82f6",
          "purple": "#a855f7",
          "pink": "#ec4899",
          "red": "#ef4444",
          "orange": "#f97316",
          "yellow": "#eab308",
          "white": "#f3f4f6",
          "gray": "#6b7280",
        },
      },
      fontFamily: {
        'display': ['Lexend', 'sans-serif'],
      },
      fontWeight: {
        '800': '800',
      },
      borderRadius: {
        'DEFAULT': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        'ios': '1.25rem',
        'bento': '1.5rem',
      },
      maxWidth: {
        'mobile': '100%',
        'md': '448px',
      },
      boxShadow: {
        // Neo-brutalist shadows
        'neo': '4px 4px 0px 0px rgba(37, 42, 52, 1)',
        'neo-sm': '2px 2px 0px 0px rgba(37, 42, 52, 1)',
        'neo-lg': '6px 6px 0px 0px rgba(37, 42, 52, 1)',
        'vibrant': '0 4px 0 0 rgba(0,0,0,0.1)',
        // Couleurs
        'neo-pink': '4px 4px 0px 0px #FF2E63',
        'neo-blue': '4px 4px 0px 0px #08D9D6',
        'neo-yellow': '4px 4px 0px 0px #FFD700',
        'neo-green': '4px 4px 0px 0px #2ECC71',
      },
      borderWidth: {
        '3': '3px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
