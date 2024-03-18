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
        green: {
          primary: "#00A907",
        },
        blue: {
          primary: "#3B82F6",
        },
      },
      spacing: {
        "screen-lg": "1180px",
      },
      screens: {
        lg: "1180px",
      },
    },
  },
  plugins: [],
};
