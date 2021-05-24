module.exports = {
  purge: ['./*.html',],
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
