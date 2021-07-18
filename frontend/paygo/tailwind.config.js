const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      'xs': '400px',
      ...defaultTheme.screens,
    },
    extend: {
      // Custom linear gradient with hard/split stop
      backgroundImage: {
        'hsplit-green-yellow-50-50': 'linear-gradient(90deg, #6EE7B7 50%, #FDE68A 50%);',
        'vsplit-green-yellow-33-67': 'linear-gradient(180deg, #6EE7B7 33%, #FDE68A 67%);',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
