import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { loadTheme, getCurrentTheme, isCurrentThemeCustom } from './themeLoader';

// ============================================
// THEME SELECTION
// ============================================
// Import ONE theme file to set the color scheme:
// - './themes/default.css'           (Original dark theme with purple/gray)
// - './themes/ocean-blue.css'        (Cool blue theme)
// - './themes/sunset-orange.css'     (Warm orange theme)
// - './themes/jade-green.css'        (Natural green theme)
// - './themes/dark-high-contrast.css' (High contrast black/white/bright)
// Users can also import custom themes via File → Select Theme → Import
// To create your own theme, see: THEMING.md and CUSTOM-THEMES.md
// ============================================
import './themes/default.css';

import './index.css';

// Load saved theme on startup
const savedTheme = getCurrentTheme();
const isCustom = isCurrentThemeCustom();
if (savedTheme !== 'default' || isCustom) {
  loadTheme(savedTheme, isCustom);
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);