import './aboutModal.css';
import { createPortal } from 'react-dom';
import logo from '../assets/logo.png';

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
}

export function AboutModal({ open, onClose }: AboutModalProps) {
  if (!open) return null;

  const lastUpdated = '26 September 2025';

  const content = (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="about-title">
      <div className="modal-content about-modal">
        <div className="about-hero">
          <div className="about-hero-logo">
            <img src={logo} alt="EasyEdit" />
          </div>
          <div className="about-hero-text">
            <h2 id="about-title" className="about-title">EasyEdit</h2>
            <div className="about-subtitle">Simple. Fast. Markdown-first notes with live preview.</div>
            <div className="about-badges">
              <span className="badge">Markdown</span>
              <span className="badge">Templates</span>
              <span className="badge">Mermaid</span>
              <span className="badge">Export</span>
              <span className="badge">Standalone or Hosted</span>
            </div>
          </div>
        </div>
        <button className="icon-btn about-close" aria-label="Close about" title="Close" onClick={onClose}>✕</button>
        <div className="about-grid">
          <div className="about-card">
            <h3>What it is</h3>
            <p>
              <strong>EasyEdit</strong> helps you capture thoughts quickly using familiar Markdown.
              See your formatting instantly in the live preview and keep focus with a clean layout.
            </p>
          </div>
          <div className="about-card">
            <h3>What it does</h3>
            <ul>
              <li>Use ready-made templates for meetings, projects, study, travel, and workouts.</li>
              <li>Insert tables, icons, images, links, tasks, footnotes, and Mermaid diagrams.</li>
              <li>Export to <strong>Markdown</strong> or <strong>TXT</strong>, or print the rendered preview.</li>
              <li>Resize the editor/preview split and switch themes on the fly.</li>
            </ul>
          </div>
          <div className="about-card">
            <h3>Why you’ll like it</h3>
            <p>
              It’s fast, minimal, and gets out of your way. Perfect for daily journaling, structured
              meeting notes, and planning.
            </p>
          </div>
          <div className="about-card">
            <h3>Credits</h3>
            <p>
              Built with care by <strong>Ricardo Wagemaker</strong>.
              <br />
              <span className="muted">Last updated: {lastUpdated}</span>
            </p>
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

export default AboutModal;
