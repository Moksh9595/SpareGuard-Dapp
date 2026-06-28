export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 24px 80px rgba(15, 23, 42, 0.12)',
      },
      colors: {
        brand: {
          950: '#0b1120',
          900: '#111827',
          800: '#1f2937',
          600: '#2563eb',
          500: '#3b82f6',
          400: '#60a5fa',
        },
      },
    },
  },
  plugins: [],
}
