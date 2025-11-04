// src/context/ThemeContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDayMode, setIsDayMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("isDayMode");
    if (savedTheme !== null) setIsDayMode(savedTheme === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("isDayMode", isDayMode);
    document.documentElement.classList.toggle("dark", !isDayMode);
  }, [isDayMode]);

  const toggleTheme = () => setIsDayMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDayMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
