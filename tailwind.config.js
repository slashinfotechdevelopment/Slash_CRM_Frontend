/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#1E2761',
          950: '#151B45',
        },
        brand: {
          primary: 'var(--color-primary)',
          'primary-hover': 'var(--color-primary-hover)',
          'primary-light': 'var(--color-primary-light)',
          accent: 'var(--color-accent)',
          'accent-hover': 'var(--color-accent-hover)',
          'accent-light': 'var(--color-accent-light)',
          canvas: 'var(--color-canvas)',
          surface: 'var(--color-surface)',
          border: 'var(--color-border)',
          'border-subtle': 'var(--color-border-subtle)',
          'text-strong': 'var(--color-text-strong)',
          'text-body': 'var(--color-text-body)',
          'text-muted': 'var(--color-text-muted)',
          // Semantic
          danger: 'var(--color-danger)',
          'danger-light': 'var(--color-danger-light)',
          warning: 'var(--color-warning)',
          'warning-light': 'var(--color-warning-light)',
          success: 'var(--color-success)',
          'success-light': 'var(--color-success-light)',
          info: 'var(--color-info)',
          'info-light': 'var(--color-info-light)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        dropdown: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
