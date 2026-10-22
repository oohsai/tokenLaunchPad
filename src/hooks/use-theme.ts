import { createContext, useContext } from "react";

export type Theme = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

export type Palette = "aubergine" | "mocha";

export const PALETTES: {
  id: Palette;
  label: string;
  swatches: [string, string, string];
}[] = [
  {
    id: "aubergine",
    label: "Aubergine",
    swatches: ["#c9cad3", "#3d1445", "#f0a30a"],
  },
  {
    id: "mocha",
    label: "Mocha",
    swatches: ["#5b3d2e", "#c3c4cc", "#e4dcf4"],
  },
];

export type ThemeProviderState = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  palette: Palette;
  setPalette: (palette: Palette) => void;
};

export const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => null,
  palette: "aubergine",
  setPalette: () => null,
});

export function useTheme() {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
}
