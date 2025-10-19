import { getCustomThemes, applyCustomTheme, removeCustomThemeStyle } from './customThemeManager';

// Theme loader utility
export const loadTheme = (themeName: string, isCustom: boolean = false) => {
  // Remove custom theme style if exists
  removeCustomThemeStyle();
  
  // Remove all existing theme stylesheets
  const existingThemes = document.querySelectorAll('link[data-theme]');
  existingThemes.forEach(link => link.remove());

  if (isCustom) {
    // Load custom theme from localStorage
    const customThemes = getCustomThemes();
    const theme = customThemes.find(t => t.id === themeName);
    if (theme) {
      applyCustomTheme(theme.css);
    }
  } else {
    // Load built-in theme
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    // Build URL using Vite base so it works both locally and on GitHub Pages (/EasyEdit/webapp/).
    // Avoid URL() constructor because BASE_URL may be relative (e.g. '/'), which is invalid as a base.
    const base = (import.meta.env.BASE_URL || '/');
    const normalizedBase = base.endsWith('/') ? base : `${base}/`;
    link.href = `${normalizedBase}themes/${themeName}.css`;
    link.setAttribute('data-theme', themeName);
    document.head.appendChild(link);
  }

  // Save to localStorage
  localStorage.setItem('easyedit-theme', themeName);
  localStorage.setItem('easyedit-theme-custom', isCustom.toString());
};

export const getCurrentTheme = (): string => {
  return localStorage.getItem('easyedit-theme') || 'default';
};

export const isCurrentThemeCustom = (): boolean => {
  return localStorage.getItem('easyedit-theme-custom') === 'true';
};
