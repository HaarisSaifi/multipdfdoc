import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bubble: {
          bg: "#F8FAFC",
          card: "#FFFFFF",
          cardHover: "#FFFFFF",
          surface: "#F1F5F9",
          border: "#E2E8F0",
          borderLight: "#EDF2F7",
          text: "#0F172A",
          muted: "#64748B",
          // Refined Professional Palette
          violet: "#7C3AED",
          violetLight: "#6D28D9",
          violetPastel: "#F5F3FF",
          violetBorder: "#DDD6FE",
          cyan: "#0284C7",
          cyanLight: "#0369A1",
          cyanPastel: "#F0F9FF",
          cyanBorder: "#BAE6FD",
          emerald: "#059669",
          emeraldLight: "#047857",
          emeraldPastel: "#ECFDF5",
          emeraldBorder: "#A7F3D0",
          amber: "#D97706",
          amberPastel: "#FFFBEB",
          amberBorder: "#FDE68A",
          rose: "#E11D48",
          rosePastel: "#FFF1F2",
          roseBorder: "#FECDD3",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
      },
      borderRadius: {
        bubble: "28px",
        pill: "9999px",
        card: "22px",
      },
      boxShadow: {
        "clay-card": "0 10px 30px -5px rgba(100, 116, 139, 0.08), 0 4px 6px -2px rgba(100, 116, 139, 0.04), inset 0 1px 1px rgba(255, 255, 255, 1), inset 0 -2px 4px rgba(0, 0, 0, 0.03)",
        "clay-card-hover": "0 20px 40px -10px rgba(124, 58, 237, 0.14), 0 8px 12px -4px rgba(124, 58, 237, 0.06), inset 0 1px 1px rgba(255, 255, 255, 1), inset 0 -2px 4px rgba(0, 0, 0, 0.03)",
        "clay-nav": "0 12px 32px -8px rgba(100, 116, 139, 0.12), 0 2px 6px -1px rgba(100, 116, 139, 0.06), inset 0 1px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(0, 0, 0, 0.02)",
        "clay-pill": "0 6px 18px -3px rgba(124, 58, 237, 0.4), inset 0 2px 2px rgba(255, 255, 255, 0.45), inset 0 -2px 3px rgba(0, 0, 0, 0.15)",
        "clay-pill-cyan": "0 6px 18px -3px rgba(2, 132, 199, 0.4), inset 0 2px 2px rgba(255, 255, 255, 0.45), inset 0 -2px 3px rgba(0, 0, 0, 0.15)",
        "clay-pill-emerald": "0 6px 18px -3px rgba(5, 150, 105, 0.4), inset 0 2px 2px rgba(255, 255, 255, 0.45), inset 0 -2px 3px rgba(0, 0, 0, 0.15)",
        "clay-pill-secondary": "0 4px 12px -2px rgba(100, 116, 139, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.9), inset 0 -2px 2px rgba(0, 0, 0, 0.04)",
        "glow-violet": "0 0 25px -3px rgba(124, 58, 237, 0.25)",
        "glow-cyan": "0 0 25px -3px rgba(2, 132, 199, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
