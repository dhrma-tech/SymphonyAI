"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemePalette {
  background: string;
  section: string;
  primary: string;
  text: string;
  accent: string;
}

interface ThemeContextType {
  currentPalette: ThemePalette | null;
  setPreviewPalette: (palette: ThemePalette | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const DEFAULT_PALETTE: ThemePalette = {
  background: "#ffffff",
  section: "#f5f5f5",
  primary: "#000000",
  text: "#000000",
  accent: "#FF5C00"
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentPalette, setCurrentPalette] = useState<ThemePalette | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const palette = currentPalette || DEFAULT_PALETTE;

    root.style.setProperty("--color-background", palette.background);
    root.style.setProperty("--color-section", palette.section);
    root.style.setProperty("--color-primary", palette.primary);
    root.style.setProperty("--color-text", palette.text);
    root.style.setProperty("--color-accent", palette.accent);
  }, [currentPalette]);

  return (
    <ThemeContext.Provider value={{ currentPalette, setPreviewPalette: setCurrentPalette }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
