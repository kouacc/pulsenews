/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Forma DJR Display, sans-serif'],
      serif: ['Acumin Pro, serif']
    },
    extend: {
      boxShadow: {
        'shadow-2xl': '0px 10px 41px rgba(0, 0, 0, 0.25);'
      },
      colors: {
        gray: {
          100: 'F9F9F9'
        }
      }
    }
  },
  plugins: []
}
