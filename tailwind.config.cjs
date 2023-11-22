const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        farmers: ["FarmerStandard", "Inter var"],
        farmerr: ["FarmerRounded", "Inter var"],
        farmerv: ["FarmerVintage", "Inter var"],
        inter: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        "theme-1": "#ffc99b",
        "theme-2": "#c99c83",
        "theme-3": "#ffb595",
        "theme-4": "#ffd8b1",
        "theme-5": "#ddb790",
      },
    },
  },
  plugins: [],
};
