module.exports = {
  purge: ['./*.html',
  './src/**/*.js',
  './src/**/*.jsx',
],
  darkMode: false, // or 'media' or 'class'
  mode: 'jit',
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
