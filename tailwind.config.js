/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          navy: '#0F172A',     // Primary deep navy identity
          dark: '#1E293B',     // Card headers & text dark
          blue: '#1E3A8A',     // Deep civic blue
          accent: '#2563EB',   // Interactive blue
          light: '#F8FAFC',    // App background neutral slate
          surface: '#FFFFFF',  // Clean white card background
          border: '#E2E8F0',   // Subtle border slate
        },
        semantic: {
          green: '#16A34A',   // Resolved / Success
          amber: '#D97706',   // Under Review / Warning
          red: '#DC2626',     // Critical / High Severity
          blue: '#2563EB',    // Active / Information
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        civic: '0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        'civic-lg': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.03)',
      }
    },
  },
  plugins: [],
}
