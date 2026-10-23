/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext } from 'react';

export interface FixedTheme {
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  surfaceColor: string;
  borderColor: string;
  primaryText: string;
  badgeBg: string;
  badgeText: string;
  heroGradient: string;
}

const DEFAULT_THEME: FixedTheme = {
  primaryColor: '#0F172A',
  accentColor: '#3B82F6',
  bgColor: '#F8FAFC',
  surfaceColor: '#FFFFFF',
  borderColor: '#E2E8F0',
  primaryText: '#0F172A',
  badgeBg: '#EFF6FF',
  badgeText: '#1D4ED8',
  heroGradient: 'from-slate-950 via-slate-900 to-indigo-950',
};

interface ThemeContextType {
  currentTheme: FixedTheme;
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: DEFAULT_THEME,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeContext.Provider value={{ currentTheme: DEFAULT_THEME }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
