import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#020617",
        foreground: "#f9fafb",
        "glass-dark": "rgba(15,23,42,0.85)"
      },
      borderRadius: {
        "3xl": "1.5rem"
      },
      boxShadow: {
        "glass-soft":
          "0 24px 80px rgba(15,23,42,0.85), 0 0 0 1px rgba(148, 163, 184, 0.15)"
      }
    }
  },
  plugins: []
};

export default config;

