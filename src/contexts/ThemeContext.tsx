import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Theme = "dark" | "negroni";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first, then default to "dark"
    // If "blue" is saved, convert it to "dark" since blue theme is removed
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "blue") {
      localStorage.setItem("theme", "dark");
      return "dark";
    }
    return (savedTheme as Theme) || "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-dark", "theme-negroni");
    if (theme === "negroni") {
      root.classList.add("theme-negroni");
    } else {
      root.classList.add("theme-dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((current) => {
      if (current === "dark") return "negroni";
      return "dark";
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
