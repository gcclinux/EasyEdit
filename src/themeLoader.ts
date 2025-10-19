// Theme loader utility
export const loadTheme = (themeName: string) => {
  // Remove all existing theme stylesheets
  const existingThemes = document.querySelectorAll('link[data-theme]');
  existingThemes.forEach(link => link.remove());

  // Create and append new theme stylesheet
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `/src/themes/${themeName}.css`;
  link.setAttribute('data-theme', themeName);
  document.head.appendChild(link);

  // Save to localStorage
  localStorage.setItem('easyedit-theme', themeName);
};

export const getCurrentTheme = (): string => {
  return localStorage.getItem('easyedit-theme') || 'default';
};
