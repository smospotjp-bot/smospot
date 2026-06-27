import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1B4332", // base dark green
          dark: "#0E2A20",
          mid: "#2D6A4F",
          light: "#52B788",
          pale: "#D8F3DC",
        },
        canvas: "#F4F7F5", // clean light-gray app background
      },
      fontFamily: {
        sans: ["var(--font-noto)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,42,32,0.04), 0 4px 16px rgba(16,42,32,0.06)",
        "card-hover": "0 4px 8px rgba(16,42,32,0.06), 0 12px 28px rgba(16,42,32,0.12)",
        header: "0 6px 20px rgba(14,42,32,0.18)",
      },
      borderRadius: {
        "2xl": "1.1rem",
        "3xl": "1.5rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "sheet-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.35s ease both",
        "sheet-up": "sheet-up 0.28s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
