import './featuresModal.css';
import logo from '../assets/logo.png';
import { createPortal } from 'react-dom';

interface FeaturesModalProps {
  open: boolean;
  onClose: () => void;
}

export function FeaturesModal({ open, onClose }: FeaturesModalProps) {
  if (!open) return null;

  const content = (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="features-title">
      <div className="modal-content features-modal">
        <div className="features-hero">
          <div className="features-hero-logo">
            <img src={logo} alt="EasyEdit" />
          </div>
          <div className="features-hero-text">
            <h2 id="features-title" className="features-title">Features</h2>
            <div className="features-subtitle">Everything you need to write, structure, and share notes—fast.</div>
          </div>
        </div>
        <button className="icon-btn about-close" aria-label="Close features" title="Close" onClick={onClose}>✕</button>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Templates</h3>
            <p>Kickstart with ready-made templates: Meeting Notes, Project Plan, Study Notes, Travel Log, Workout Log, and a Daily Journal & Diagrams </p>
          </div>
          <div className="feature-card">
            <h3>Formatting</h3>
            <p>Bold, Italic, Strikethrough, Inline Code, Code Blocks, Blockquotes, Headers—apply, Icons in a click with live preview.</p>
          </div>
          <div className="feature-card">
            <h3>Tables & Media</h3>
            <p>Manual or automatic insert tables, icons, images, links, tasks, and footnotes. Build rich notes that stay readable.</p>
          </div>
          <div className="feature-card">
            <h3>Diagrams</h3>
            <p>Use Mermaid or UML or even both together to create flowcharts, sequence diagrams, ER diagrams, and more—right inside your notes.</p>
          </div>
          <div className="feature-card">
            <h3>Export & Security</h3>
            <p>Export any note to Markdown (md) or (txt). Print a clean, styled preview whenever you need a hard copy, Encrypt your notes for added security (sstp).</p>
          </div>
          <div className="feature-card">
            <h3>Flexible Layout</h3>
            <p>Resizable split view between editor and preview, with dark/light themes and an optional collapsible sidebar.</p>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

export default FeaturesModal;
