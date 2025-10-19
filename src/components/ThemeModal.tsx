import React from 'react';
import './themeModal.css';
import { FaPalette } from 'react-icons/fa';

interface ThemeModalProps {
  open: boolean;
  onClose: () => void;
  onSelectTheme: (theme: string) => void;
  currentTheme: string;
}

const themes = [
  { id: 'default', name: 'Default', description: 'Original dark theme with purple/gray' },
  { id: 'ocean-blue', name: 'Ocean Blue', description: 'Cool blue theme' },
  { id: 'sunset-orange', name: 'Sunset Orange', description: 'Warm orange theme' },
  { id: 'jade-green', name: 'Jade Green', description: 'Natural green theme' },
  { id: 'dark-high-contrast', name: 'Dark High Contrast', description: 'High contrast black/white/bright' }
];

const ThemeModal: React.FC<ThemeModalProps> = ({ open, onClose, onSelectTheme, currentTheme }) => {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content theme-modal" onClick={(e) => e.stopPropagation()}>
        <button className="theme-close" onClick={onClose}>✕</button>
        
        <div className="theme-hero">
          <div className="theme-hero-icon">
            <FaPalette size={48} />
          </div>
          <div>
            <h2 className="theme-title">Select Theme</h2>
            <p className="theme-subtitle">Choose a color scheme for EasyEdit</p>
          </div>
        </div>

        <div className="theme-grid">
          {themes.map((theme) => (
            <button
              key={theme.id}
              className={`theme-card ${currentTheme === theme.id ? 'theme-active' : ''}`}
              onClick={() => {
                onSelectTheme(theme.id);
                onClose();
              }}
            >
              <div className="theme-card-header">
                <h3>{theme.name}</h3>
                {currentTheme === theme.id && <span className="theme-badge">Active</span>}
              </div>
              <p className="theme-card-desc">{theme.description}</p>
            </button>
          ))}
        </div>

        <div className="modal-actions">
          <button className="btn primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ThemeModal;
