import React, { useState, useEffect } from 'react';
import './themeModal.css';
import { FaPalette, FaPlus, FaTrash } from 'react-icons/fa';
import { getCustomThemes, deleteCustomTheme, CustomTheme } from '../customThemeManager';
import { useLanguage } from '../i18n/LanguageContext';

interface ThemeModalProps {
  open: boolean;
  onClose: () => void;
  onSelectTheme: (theme: string, isCustom?: boolean) => void;
  currentTheme: string;
  onOpenImport: () => void;
}

const builtInThemes = [
  { id: 'default', name: 'Default', description: 'Original dark theme with purple/gray', isBuiltIn: true },
  { id: 'ocean-blue', name: 'Ocean Blue', description: 'Cool blue theme', isBuiltIn: true },
  { id: 'sunset-orange', name: 'Sunset Orange', description: 'Warm orange theme', isBuiltIn: true },
  { id: 'jade-green', name: 'Jade Green', description: 'Natural green theme', isBuiltIn: true },
  { id: 'dark-high-contrast', name: 'Dark High Contrast', description: 'High contrast black/white/bright', isBuiltIn: true },
  { id: 'black-white', name: 'Black & White', description: 'Pure black and white with 3px borders', isBuiltIn: true }
];

const ThemeModal: React.FC<ThemeModalProps> = ({ open, onClose, onSelectTheme, currentTheme, onOpenImport }) => {
  const { t } = useLanguage();
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);

  useEffect(() => {
    if (open) {
      setCustomThemes(getCustomThemes());
    }
  }, [open]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(t('modals.theme.delete_confirm'))) {
      deleteCustomTheme(id);
      setCustomThemes(getCustomThemes());
    }
  };

  if (!open) return null;

  const allThemes = [...builtInThemes, ...customThemes.map(t => ({ ...t, isBuiltIn: false }))];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content theme-modal" onClick={(e) => e.stopPropagation()}>
        <button className="theme-close" onClick={onClose}>✕</button>

        <div className="theme-hero">
          <div className="theme-hero-icon">
            <FaPalette size={48} />
          </div>
          <div>
            <h2 className="theme-title">{t('modals.theme.title')}</h2>
            <p className="theme-subtitle">{t('modals.theme.subtitle')}</p>
          </div>
        </div>

        <div className="theme-actions">
          <button className="btn-import" onClick={() => { onOpenImport(); onClose(); }}>
            <FaPlus /> {t('modals.theme.import')}
          </button>
        </div>

        <div className="theme-grid">
          {allThemes.map((theme) => (
            <button
              key={theme.id}
              className={`theme-card ${currentTheme === theme.id ? 'theme-active' : ''}`}
              onClick={() => {
                onSelectTheme(theme.id, !theme.isBuiltIn);
                onClose();
              }}
            >
              <div className="theme-card-header">
                <h3>{theme.name}</h3>
                <div className="theme-badges">
                  {currentTheme === theme.id && <span className="theme-badge">{t('modals.theme.active')}</span>}
                  {!theme.isBuiltIn && (
                    <button
                      className="theme-delete"
                      onClick={(e) => handleDelete(theme.id, e)}
                      title={t('modals.theme.delete_tooltip')}
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
              <p className="theme-card-desc">{theme.description}</p>
            </button>
          ))}
        </div>

        <div className="modal-actions">
          <button className="btn primary" onClick={onClose}>{t('actions.close')}</button>
        </div>
      </div>
    </div>
  );
};

export default ThemeModal;
