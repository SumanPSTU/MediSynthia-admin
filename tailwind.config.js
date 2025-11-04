/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  darkMode: "class", // Enables dark mode manually (via toggling 'class')

  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: "#3B82F6", // Tailwind blue-500
          dark: "#2563EB",    // blue-600
        },
        secondary: {
          DEFAULT: "#9333EA", // purple-600
          dark: "#7E22CE",
        },
        accent: {
          DEFAULT: "#10B981", // emerald-500
          dark: "#059669",
        },
        card: {
          light: "#ffffff",
          dark: "#1F2937",
        },
        text: {
          light: "#1F2937",
          dark: "#F3F4F6",
        },
      },
      boxShadow: {
        'card': '0 4px 10px rgba(0, 0, 0, 0.08)',
        'hover': '0 8px 20px rgba(0, 0, 0, 0.12)',
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
