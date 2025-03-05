/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'primary-gradient': 'linear-gradient(to right, #37805afa, #92db32)',
      },
      colors: {
        primary: {
          DEFAULT: '#1B9644',
          light: '#B1F1C6'
        }
      },
    },
  },
  important: true,
  plugins: [
  ],
}