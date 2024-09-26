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
          DEFAULT: '#1b9644'
        }
      },
    },
  },
  plugins: [
  ],
}

