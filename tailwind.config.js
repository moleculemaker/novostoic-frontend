/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,scss}"],
  theme: {
    extend: {
      colors: {
        gray: {
          50: "#f8f9fa",
        },
        bluegray: {
          100: "#dadee3",
        },
      },
    },
  },
  plugins: [],
};
