import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        GillSans: "var(--font-gill)",
        Mitra: "var(--font-mitra)",
        Kanit: "var(--font-kanit)",
        Jaro: "var(--font-jaro)",
      },
      fontWeight: {
        medium: "500",
        sem: "600",
        bold: "700",
      },
      colors: {
        primary: "var(--primary-color)",
        secondary: "var(--secondary-color)",
      },
    },
  },
  plugins: [],
} satisfies Config;
