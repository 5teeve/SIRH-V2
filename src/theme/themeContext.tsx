/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ColorThemeId = 'navy' | 'emerald' | 'burgundy' | 'cobalt' | 'graphite';

export interface ColorTheme {
  id: ColorThemeId;
  name: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  surfaceColor: string;
  borderColor: string;
  primaryText: string;
  badgeBg: string;
  badgeText: string;
  heroGradient: string;
  swatches: string[];
}

export const COLOR_THEMES: Record<ColorThemeId, ColorTheme> = {
  navy: {
    id: 'navy',
    name: 'Élégance Marine & Ardoise',
    tagline: 'Sobriété exécutive, autorité institutionnelle et tons bleus nuit profonds',
    primaryColor: '#0F172A', // Slate 900
    accentColor: '#2563EB',  // Royal Blue
    bgColor: '#F8FAFC',      // Slate 50
    surfaceColor: '#FFFFFF',
    borderColor: '#E2E8F0',  // Slate 200
    primaryText: '#0F172A',
    badgeBg: '#EFF6FF',
    badgeText: '#1D4ED8',
    heroGradient: 'from-slate-950 via-slate-900 to-indigo-950',
    swatches: ['#0F172A', '#1E3A8A', '#2563EB', '#64748B', '#F8FAFC'],
  },
  emerald: {
    id: 'emerald',
    name: 'Forêt Émeraude & Sauge',
    tagline: 'Harmonie naturelle, sérénité managériale et accents jade prestigieux',
    primaryColor: '#064E3B', // Emerald 900
    accentColor: '#059669',  // Emerald 600
    bgColor: '#F6F9F7',      // Very light sage
    surfaceColor: '#FFFFFF',
    borderColor: '#D1FAE5',  // Emerald 100
    primaryText: '#064E3B',
    badgeBg: '#ECFDF5',
    badgeText: '#047857',
    heroGradient: 'from-emerald-950 via-teal-950 to-slate-950',
    swatches: ['#064E3B', '#047857', '#059669', '#10B981', '#F6F9F7'],
  },
  burgundy: {
    id: 'burgundy',
    name: 'Bordeaux Impérial & Vin',
    tagline: 'Prestige des grandes institutions, élégance feutrée et chaleur haut de gamme',
    primaryColor: '#4C0519', // Rose 950
    accentColor: '#BE123C',  // Rose 700
    bgColor: '#FAF7F7',      // Warm light rose/stone
    surfaceColor: '#FFFFFF',
    borderColor: '#FFE4E6',  // Rose 100
    primaryText: '#4C0519',
    badgeBg: '#FFF1F2',
    badgeText: '#9F1239',
    heroGradient: 'from-rose-950 via-pink-950 to-slate-950',
    swatches: ['#4C0519', '#881337', '#BE123C', '#FB7185', '#FAF7F7'],
  },
  cobalt: {
    id: 'cobalt',
    name: 'Cobalt Moderne & Azur',
    tagline: 'Pureté technologique contemporaine, contrastes vifs et clarté scandinave',
    primaryColor: '#1E40AF', // Blue 800
    accentColor: '#0284C7',  // Sky 600
    bgColor: '#F0F9FF',      // Sky 50
    surfaceColor: '#FFFFFF',
    borderColor: '#BAE6FD',  // Sky 200
    primaryText: '#0C4A6E',
    badgeBg: '#E0F2FE',
    badgeText: '#0369A1',
    heroGradient: 'from-blue-950 via-indigo-950 to-sky-950',
    swatches: ['#1E40AF', '#0369A1', '#0284C7', '#38BDF8', '#F0F9FF'],
  },
  graphite: {
    id: 'graphite',
    name: 'Graphite Titane & Monochrome',
    tagline: 'Minimalisme suisse rigoureux, contrastes francs et typographie épurée',
    primaryColor: '#18181B', // Zinc 900
    accentColor: '#3F3F46',  // Zinc 700
    bgColor: '#F4F4F5',      // Zinc 100
    surfaceColor: '#FFFFFF',
    borderColor: '#E4E4E7',  // Zinc 200
    primaryText: '#09090B',
    badgeBg: '#F4F4F5',
    badgeText: '#18181B',
    heroGradient: 'from-zinc-950 via-neutral-900 to-stone-950',
    swatches: ['#09090B', '#18181B', '#3F3F46', '#71717A', '#F4F4F5'],
  },
};

interface ThemeContextType {
  currentTheme: ColorTheme;
  themeId: ColorThemeId;
  setTheme: (id: ColorThemeId) => void;
  availableThemes: ColorTheme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'sirh_color_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState<ColorThemeId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ColorThemeId;
      if (saved && COLOR_THEMES[saved]) return saved;
    } catch (e) {}
    return 'navy';
  });

  const setTheme = (id: ColorThemeId) => {
    if (COLOR_THEMES[id]) {
      setThemeId(id);
      try {
        localStorage.setItem(STORAGE_KEY, id);
      } catch (e) {}
    }
  };

  const currentTheme = COLOR_THEMES[themeId];

  // Update root document CSS variables for background & primary tints
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', currentTheme.primaryColor);
    root.style.setProperty('--color-accent', currentTheme.accentColor);
    root.style.setProperty('--color-bg', currentTheme.bgColor);
    document.body.style.backgroundColor = currentTheme.bgColor;
  }, [currentTheme]);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        themeId,
        setTheme,
        availableThemes: Object.values(COLOR_THEMES),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
