const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "page-bg": "#01010c",
        "card-bg": "#060612",
        "holo-orange": "#fdc094",
        "holo-blue": "#5e72eb",
      },
    },
    fontFamily: {
      "clover-semibold": ['"Clover Semibold"', "sans-serif"],
      "clover-regular": ['"Clover Regular"', "sans-serif"],
      "clover-medium": ['"Clover Medium"', "sans-serif"],
    },
  },
  plugins: [],
};
