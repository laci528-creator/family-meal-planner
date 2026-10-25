import { useState, useEffect } from "react";
import { ThemeContext } from "./ThemeContext";

const STORAGE_KEY = "family-meal-planner-theme";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || "green";
  });

    useEffect(() => {
    document.documentElement.dataset.theme = theme;
      localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}