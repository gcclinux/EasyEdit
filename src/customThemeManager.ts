// Custom theme manager for user-installed themes
export interface CustomTheme {
  id: string;
  name: string;
  description: string;
  css: string;
}

const CUSTOM_THEMES_KEY = 'easyedit-custom-themes';

export const getCustomThemes = (): CustomTheme[] => {
  const stored = localStorage.getItem(CUSTOM_THEMES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveCustomTheme = (theme: CustomTheme): void => {
  const themes = getCustomThemes();
  const existing = themes.findIndex(t => t.id === theme.id);
  if (existing >= 0) {
    themes[existing] = theme;
  } else {
    themes.push(theme);
  }
  localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(themes));
};

export const deleteCustomTheme = (id: string): void => {
  const themes = getCustomThemes().filter(t => t.id !== id);
  localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(themes));
};

export const applyCustomTheme = (css: string): void => {
  // Remove existing custom theme style
  const existing = document.getElementById('custom-theme-style');
  if (existing) existing.remove();

  // Create and inject new style element
  const style = document.createElement('style');
  style.id = 'custom-theme-style';
  style.textContent = css;
  document.head.appendChild(style);
};

export const removeCustomThemeStyle = (): void => {
  const existing = document.getElementById('custom-theme-style');
  if (existing) existing.remove();
};
