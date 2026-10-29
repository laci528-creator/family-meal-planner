import { useState, useEffect } from "react";
import { ThemeContext } from "./ThemeContext";
import { themes } from "./themes.js";

const STORAGE_KEY = "family-meal-planner-theme";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY);

    const isValidTheme = themes.some((item) => item.id === savedTheme);

    return isValidTheme ? savedTheme : "green";
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
