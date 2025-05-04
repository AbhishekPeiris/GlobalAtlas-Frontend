import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  // 1️⃣ load saved preference or system preference
  const getInitial = () => {
    // If running in browser environment
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light"; // Default for SSR
  };

  const [theme, setTheme] = useState(getInitial);
  const [isInitialized, setIsInitialized] = useState(false);

  // 2️⃣ keep <html> class in sync
  useEffect(() => {
    const root = document.documentElement; // <html>

    if (theme === "dark") {
      root.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      root.classList.remove("dark");
      document.body.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
    setIsInitialized(true);

    // Debug info
    console.log("Theme updated to:", theme);
  }, [theme]);

  // 3️⃣ toggle helper
  const toggle = () => {
    setTheme((current) => {
      const newTheme = current === "dark" ? "light" : "dark";
      console.log("Toggling theme from", current, "to", newTheme);
      return newTheme;
    });
  };

  // 4️⃣ Ensure theme matches system preferences if changed
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle, isInitialized }}>
      {children}
    </ThemeContext.Provider>
  );
}
