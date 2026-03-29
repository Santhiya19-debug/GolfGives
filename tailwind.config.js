/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Reference image color palette - soft teal/mint
        brand: {
          50:  '#f0f9f8',
          100: '#d9f0ed',
          200: '#b3e1db',
          300: '#80ccc4',
          400: '#4db0a6',
          500: '#2d9d92',  // primary teal
          600: '#1f7d74',
          700: '#196360',
          800: '#164f4d',
          900: '#134240',
        },
        // Dark navy for headings (from reference)
        navy: {
          700: '#1a2e2d',
          800: '#122120',
          900: '#0d1817',
        },
        // Soft background tones
        mist: {
          50:  '#f5f9f9',
          100: '#e8f3f2',
          200: '#d1e8e6',
        },
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'serif'],
        body: ['system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(45,157,146,0.08), 0 10px 20px -2px rgba(45,157,146,0.04)',
        card: '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(45,157,146,0.06)',
        'card-hover': '0 4px 12px rgba(45,157,146,0.12), 0 16px 32px rgba(45,157,146,0.08)',
      },
    },
  },
  plugins: [],
};