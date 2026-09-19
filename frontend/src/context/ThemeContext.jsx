import { jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
const ThemeContext = createContext(void 0);
export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("nexhire_theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme;
      }
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    return "light";
  });
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("nexhire_theme", theme);
  }, [theme]);
  const toggleTheme = () => {
    setThemeState((prev) => prev === "light" ? "dark" : "light");
  };
  const setTheme = (newTheme) => {
    setThemeState(newTheme);
  };
  return /* @__PURE__ */ jsx(ThemeContext.Provider, { value: { theme, toggleTheme, setTheme }, children });
};
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
