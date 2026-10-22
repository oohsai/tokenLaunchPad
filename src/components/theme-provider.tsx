import { useEffect, useState, type ReactNode } from "react";
import {
  PALETTES,
  ThemeProviderContext,
  type Palette,
  type ResolvedTheme,
  type Theme,
} from "../hooks/use-theme";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  defaultPalette?: Palette;
  storageKey?: string;
  paletteStorageKey?: string;
};

function readStorage(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable (private mode); the choice just won't persist.
  }
}

function isPalette(value: string | null): value is Palette {
  return PALETTES.some((p) => p.id === value);
}

function systemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  defaultPalette = "aubergine",
  storageKey = "vite-ui-theme",
  paletteStorageKey = "vite-ui-palette",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (readStorage(storageKey) as Theme) || defaultTheme
  );
  const [palette, setPalette] = useState<Palette>(() => {
    // ?palette=mocha lets a specific version be linked or screenshotted.
    const fromUrl = new URLSearchParams(window.location.search).get("palette");
    if (isPalette(fromUrl)) return fromUrl;
    const stored = readStorage(paletteStorageKey);
    return isPalette(stored) ? stored : defaultPalette;
  });

  const resolvedTheme: ResolvedTheme =
    theme === "system" ? systemTheme() : theme;

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    window.document.documentElement.dataset.palette = palette;
  }, [palette]);

  const value = {
    theme,
    resolvedTheme,
    setTheme: (theme: Theme) => {
      writeStorage(storageKey, theme);
      setTheme(theme);
    },
    palette,
    setPalette: (palette: Palette) => {
      writeStorage(paletteStorageKey, palette);
      setPalette(palette);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
