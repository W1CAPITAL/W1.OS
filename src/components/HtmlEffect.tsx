// This file is no longer needed and will be replaced by ThemeHandler.tsx
"use client";
import { useEffect } from "react";

export default function HtmlEffect() {
  useEffect(() => {
    // Aplica o filtro depois da hidratação (sem SSR mismatch)
    document.documentElement.style.filter = "saturate(1.3)";
  }, []);

  return null; // não renderiza nada visualmente
}
