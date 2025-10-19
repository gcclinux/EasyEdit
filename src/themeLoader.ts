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
    // Use relative path for production builds
    const base = import.meta.env.BASE_URL || '/';
    link.href = `${base}src/themes/${themeName}.css`;
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
