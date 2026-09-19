"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Default to clean Light theme
    document.documentElement.classList.remove("dark");
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    // Pure light theme lock for pristine professional look
    setTheme("light");
    document.documentElement.classList.remove("dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="bg-bubble-bg text-bubble-text min-h-screen">{children}</div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
