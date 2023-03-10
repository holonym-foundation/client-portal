/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/frontend/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // dark
        // "page-bg": "#01010c",
        // "card-bg": "#060612",
        // "holo-orange": "#fdc094",
        // "holo-blue": "#5e72eb",
        // light
        "page-bg": "#fff",
        "card-bg": "#f7f7f7",
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
