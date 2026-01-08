module.exports = {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores DPSP baseadas na imagem
        dpsp: {
          dark: '#1f2937',      // Dark gray
          'dark-blue': '#1e3a8a', // Dark blue (texto)
          'light-blue': '#60a5fa', // Light blue (background central)
          red: '#dc2626',       // Red (destaques)
          white: '#ffffff',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto'],
      },
      container: {
        center: true,
        padding: '1rem'
      },
      borderRadius: {
        xl: '0.75rem'
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'
      }
    }
  },
  plugins: [],
};