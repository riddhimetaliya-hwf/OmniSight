
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";
type ColorScheme = "default" | "blue" | "purple" | "green" | "orange" | "accent";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultColorScheme?: ColorScheme;
  storageKey?: string;
  colorStorageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  colorScheme: ColorScheme;
  setTheme: (theme: Theme) => void;
  setColorScheme: (colorScheme: ColorScheme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  colorScheme: "default",
  setTheme: () => null,
  setColorScheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColorScheme = "default",
  storageKey = "omni-theme",
  colorStorageKey = "omni-color-scheme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    () => (localStorage.getItem(colorStorageKey) as ColorScheme) || defaultColorScheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove existing color scheme classes
    root.classList.remove("color-default", "color-blue", "color-purple", "color-green", "color-orange", "color-accent");
    
    // Add the new color scheme class
    root.classList.add(`color-${colorScheme}`);

    // Update CSS variables for the selected color scheme
    switch(colorScheme) {
      case "blue":
        root.style.setProperty('--primary', '214 80% 59%');
        root.style.setProperty('--secondary', '217 71% 53%');
        break;
      case "purple":
        root.style.setProperty('--primary', '270 50% 60%');
        root.style.setProperty('--secondary', '280 70% 50%');
        break;
      case "green":
        root.style.setProperty('--primary', '142 76% 36%');
        root.style.setProperty('--secondary', '160 84% 39%');
        break;
      case "orange":
        root.style.setProperty('--primary', '24 94% 50%');
        root.style.setProperty('--secondary', '32 100% 49%');
        break;
      case "accent":
        // Gradient-friendly colors
        root.style.setProperty('--primary', '174 100% 29%');
        root.style.setProperty('--secondary', '189 100% 50%');
        break;
      default:
        // Reset to default colors
        root.style.removeProperty('--primary');
        root.style.removeProperty('--secondary');
    }
  }, [colorScheme]);

  const value = {
    theme,
    colorScheme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    setColorScheme: (colorScheme: ColorScheme) => {
      localStorage.setItem(colorStorageKey, colorScheme);
      setColorScheme(colorScheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
