/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef5ff',
          100: '#d9e8ff', 
          200: '#bcd8ff',
          300: '#8dc1ff',
          400: '#589fff',
          500: '#3182ff',
          600: '#004EA2',
          700: '#003875',
          800: '#002c5a',
          900: '#002449',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ]
      },
      boxShadow: {
        'login': '0 4px 20px rgba(0, 0, 0, 0.15)'
      },
      spacing: {
        '18': '4.5rem',
      },
      borderRadius: {
        'login': '16px'
      },
      fontSize: {
        '28': '1.75rem'
      },
      backgroundColor: {
        'input': '#f8f9fa'
      },
      borderColor: {
        'input': '#e9ecef'
      },
      textColor: {
        'subtitle': '#666',
        'input': '#333',
        'placeholder': '#adb5bd'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}