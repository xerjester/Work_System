import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const themes = ['dark', 'light', 'cyberpunk', 'nature', 'sakura'];

const themeEmojis = {
  dark: '🌙',
  light: '☀️',
  cyberpunk: '👾',
  nature: '🌿',
  sakura: '🌸'
};

export const ThemeProvider = ({ children }) => {
  const [themeIndex, setThemeIndex] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themes[themeIndex]);
  }, [themeIndex]);

  const cycleTheme = () => {
    setThemeIndex((prev) => (prev + 1) % themes.length);
  };

  const currentTheme = themes[themeIndex];
  const themeEmoji = themeEmojis[currentTheme];

  return (
    <ThemeContext.Provider value={{ currentTheme, cycleTheme, themeEmoji }}>
      {children}
    </ThemeContext.Provider>
  );
};
