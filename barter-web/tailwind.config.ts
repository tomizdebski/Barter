import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00262b",
        orange: "#d64000",
        green: "#d64000",
        red: "#d64000",
        lightBlue: "#03c7e8",
        lightGray: "#696969",
        lightRed: "#03c7e8",
      },
    },
  },
  plugins: [],
};

export default config;
