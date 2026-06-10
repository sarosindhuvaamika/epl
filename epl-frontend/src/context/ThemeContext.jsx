import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('epl_theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('epl_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const isDark = theme === 'dark';

  // Color tokens
  const colors = isDark ? {
    bg: '#03001e',
    bgGradient: 'linear-gradient(180deg, #03001e 0%, #0a0520 50%, #120a2e 100%)',
    card: '#27253f',
    cardBorder: '#686678',
    text: '#ffffff',
    textSecondary: '#b4b2be',
    textMuted: '#686678',
    navBg: 'rgba(3,0,30,0.7)',
    navBgScrolled: 'rgba(3,0,30,0.95)',
    topBarBg: '#03001e',
    inputBg: '#03001e',
    inputBorder: '#686678',
  } : {
    bg: '#f8f7fc',
    bgGradient: 'linear-gradient(180deg, #f8f7fc 0%, #f0eef5 50%, #ebe8f2 100%)',
    card: '#ffffff',
    cardBorder: '#e1e0e4',
    text: '#03001e',
    textSecondary: '#686678',
    textMuted: '#b4b2be',
    navBg: 'rgba(27,25,63,0.9)',
    navBgScrolled: 'rgba(3,0,30,0.98)',
    topBarBg: '#03001e',
    inputBg: '#f8f7fc',
    inputBorder: '#e1e0e4',
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
