import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        "surface-soft": "var(--surface-soft)",
        "surface-strong": "var(--surface-strong)",
        muted: "var(--muted)",
        line: "var(--line)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          disabled: "var(--primary-disabled)",
        },
        error: "var(--error)",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 0 0 1px rgb(0 0 0 / 0.02), 0 2px 6px 0 rgb(0 0 0 / 0.04), 0 4px 8px 0 rgb(0 0 0 / 0.1)",
      },
      borderRadius: {
        sm: "8px",
        md: "14px",
        lg: "20px",
        xl: "32px",
      },
    },
  },
  plugins: [],
};
export default config;
