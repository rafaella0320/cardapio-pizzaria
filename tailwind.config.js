/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        customRed: '#ED1C0D',
        customOrange: '#F99B1C',
        customGreen: '#27AE60',
      },
     
      fontFamily: {
        'sans': ['Poppins', 'sans-serif']
      },
      backgroundImage: {
        'home': "url('/assets/banner.png')"
      }
    },
  },
  plugins: [],
}