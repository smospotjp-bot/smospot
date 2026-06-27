import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2D6A4F",
          dark: "#1B4332",
          light: "#52B788",
          pale: "#D8F3DC",
        },
      },
    },
  },
  plugins: [],
};

export default config;
