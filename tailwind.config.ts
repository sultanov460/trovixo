import type { Config } from "tailwindcss";

// Design tokens for the brand's visual identity.
// See README-DESIGN.md for the rationale behind these choices.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FFF8EF", // base background
        ink: "#35241F", // primary text, warm near-black
        "ink-soft": "#5C5349", // secondary text
        forest: {
          DEFAULT: "#971E30",
          dark: "#741322",
          light: "#AF3143",
        },
        sand: {
          DEFAULT: "#EDE3D3",
          dark: "#E1D3BC",
        },
        clay: {
          DEFAULT: "#971E30",
          dark: "#741322",
        },
        gold: "#B8923F",
        line: "#E4D9C7", // hairline borders
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-karla)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "12px",
        pill: "999px",
      },
      boxShadow: {
        soft: "0 8px 24px -8px rgba(42, 37, 33, 0.18)",
        lift: "0 4px 14px -4px rgba(42, 37, 33, 0.15)",
      },
      maxWidth: {
        container: "1200px",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
