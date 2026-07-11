
"use client";
import { useEffect } from "react";

export default function ThemeHandler() {
  useEffect(() => {
    const root = document.documentElement;
    const storedTheme = localStorage.getItem("theme");

    const applyTheme = (theme: string) => {
      if (theme === "dark") {
        root.classList.add("dark");
        root.style.filter = "saturate(1.3)";
      } else {
        root.classList.remove("dark");
        root.style.filter = "saturate(1.0)";
      }
    };

    if (storedTheme) {
      applyTheme(storedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = prefersDark ? "dark" : "light";
      applyTheme(initialTheme);
      localStorage.setItem("theme", initialTheme);
    }
  }, []);

  return null;
}
