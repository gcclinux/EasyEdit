import React, { useState, useRef } from 'react';
import './importThemeModal.css';
import { FaUpload, FaExclamationTriangle, FaFileUpload } from 'react-icons/fa';

interface ImportThemeModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (name: string, description: string, css: string) => void;
}

const ImportThemeModal: React.FC<ImportThemeModalProps> = ({ open, onClose, onImport }) => {
  const [themeName, setThemeName] = useState('');
  const [themeDesc, setThemeDesc] = useState('');
  const [themeCss, setThemeCss] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.css')) {
      setError('Please select a .css file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const css = event.target?.result as string;
      setThemeCss(css);
      
      // Auto-fill name from filename if empty
      if (!themeName) {
        const name = file.name.replace('.css', '').replace(/-/g, ' ');
        setThemeName(name.charAt(0).toUpperCase() + name.slice(1));
      }
      
      setError('');
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsText(file);
  };

  const handleClose = () => {
    setThemeName('');
    setThemeDesc('');
    setThemeCss('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  if (!open) return null;

  const handleImport = () => {
    setError('');
    
    if (!themeName.trim()) {
      setError('Theme name is required');
      return;
    }
    
    if (!themeCss.trim()) {
      setError('Theme CSS is required');
      return;
    }

    // Basic validation - check if it looks like CSS
    if (!themeCss.includes(':root') && !themeCss.includes('--')) {
      setError('Invalid CSS: Must contain CSS variables (:root and --)');
      return;
    }

    onImport(themeName.trim(), themeDesc.trim(), themeCss.trim());
    handleClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content import-theme-modal" onClick={(e) => e.stopPropagation()}>
        <button className="theme-close" onClick={handleClose}>✕</button>
        
        <div className="theme-hero">
          <div className="theme-hero-icon">
            <FaUpload size={48} />
          </div>
          <div>
            <h2 className="theme-title">Import Custom Theme</h2>
            <p className="theme-subtitle">Paste theme CSS code to install</p>
          </div>
        </div>

        <div className="import-form">
          <div className="form-group">
            <label>Theme Name *</label>
            <input
              type="text"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              placeholder="My Custom Theme"
              className="theme-input"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              value={themeDesc}
              onChange={(e) => setThemeDesc(e.target.value)}
              placeholder="A beautiful custom theme"
              className="theme-input"
            />
          </div>

          <div className="form-group">
            <label>Theme CSS Code *</label>
            <div className="file-upload-section">
              <button 
                type="button"
                className="btn-file-upload" 
                onClick={() => fileInputRef.current?.click()}
              >
                <FaFileUpload /> Load from .css file
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".css"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>
            <textarea
              value={themeCss}
              onChange={(e) => setThemeCss(e.target.value)}
              placeholder=":root {&#10;  --bg-root: #1a1a1a;&#10;  --color-text-primary: #ffffff;&#10;  ...&#10;}"
              className="theme-textarea"
              rows={12}
            />
          </div>

          {error && (
            <div className="import-error">
              <FaExclamationTriangle /> {error}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn secondary" onClick={handleClose}>Cancel</button>
          <button className="btn primary" onClick={handleImport}>Import Theme</button>
        </div>
      </div>
    </div>
  );
};

export default ImportThemeModal;
