import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// ============================================
// THEME SELECTION
// ============================================
// Import ONE theme file to set the color scheme:
// - './themes/default.css'           (Original dark theme with purple/gray)
// - './themes/ocean-blue.css'        (Cool blue theme)
// - './themes/sunset-orange.css'     (Warm orange theme)
// - './themes/jade-green.css'        (Natural green theme)
// - './themes/dark-high-contrast.css' (High contrast black/white/bright)
// To create your own theme, see: THEMING.md
// ============================================
import './themes/jade-green.css';


import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);