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
        am: {
          onyx: "#0A0C0E",
          surface: "#121518",
          elevated: "#1A1E23",
          green: "#1A3C34",
          gold: "#C9A227",
          text: "#F5F5F0",
          secondary: "#A8B0B8",
        },
      },
      fontFamily: {
        display: ["Geist", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        'carbon-pattern': "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')",
      },
    },
  },
  plugins: [],
};
export default config;