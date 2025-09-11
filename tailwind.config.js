/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E91E63",
        secondary: "#FF4081",
        dark: "#000",
        "dark-lighter": "#1a1a1a",
        "dark-card": "#000",
      },
      fontFamily: {
        vazir: ["Vazirmatn", "sans-serif"],
        arabic: ["Vazirmatn", "Cairo", "Tajawal", "sans-serif"],
      },
      gridTemplateColumns: {
        15: "repeat(15, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
};
