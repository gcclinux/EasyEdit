import React from 'react';
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
  const [version, setVersion] = React.useState<string>('');
  const [availableVersion, setAvailableVersion] = React.useState<string>('');

  React.useEffect(() => {
    // Try common sources for app version: injected env, fetch package.json, else unknown
    try {
      const envVersion = (window as any)?.process?.env?.npm_package_version;
      if (envVersion) {
        setVersion(envVersion);
        return;
      }
    } catch (e) {
      // ignore
    }

    // Try to use the electron preload API when available (packaged apps).
    (async () => {
      const electronAPI = (window as any).electronAPI;
      if (electronAPI && typeof electronAPI.getVersionInfo === 'function') {
        try {
          const info = await electronAPI.getVersionInfo();
          setVersion(info.version || 'unknown');
          setAvailableVersion(info.latest || 'unknown');
          return;
        } catch (e) {
          // fallback to fetch-based approach
        }
      }

      // Try fetching package.json (works if app serves it) and also try to fetch
      // the latest available version info (local release/latest.json or remote fallback).
      
      try {
        const resp = await fetch('/package.json');
        if (resp.ok) {
          const pkg = await resp.json();
          setVersion(pkg.version || 'unknown');
        } else {
          setVersion('unknown');
        }
      } catch (e) {
        setVersion('unknown');
      }
      // get running version
      try {
        const resp = await fetch('/package.json');
        if (resp.ok) {
          const pkg = await resp.json();
          setVersion(pkg.version || 'unknown');
        } else {
          setVersion('unknown');
        }
      } catch (e) {
        setVersion('unknown');
      }

      // try local packaged latest.json first (some builds include this), then remote fallback
      try {
        // try a local path first
        let remoteVer = '';
        try {
          const localResp = await fetch('/release/latest.json');
          if (localResp.ok) {
            const localData = await localResp.json();
            remoteVer = localData.version || '';
          }
        } catch (e) {
          // ignore local fetch error and try remote
        }

        if (!remoteVer) {
          const ghResp = await fetch('https://raw.githubusercontent.com/gcclinux/EasyEdit/refs/heads/main/release/latest.json');
          if (ghResp.ok) {
            const ghData = await ghResp.json();
            remoteVer = ghData.version || '';
          }
        }

        setAvailableVersion(remoteVer || 'unknown');
      } catch (e) {
        setAvailableVersion('unknown');
      }
    })();
  }, []);

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
              <strong>EasyEdit</strong> is an easy Markdown editor that lets you write Markdown and
              preview it in real-time. You can save and load .md files, export your notes to PDF,
              and quickly share or copy rendered output. It’s lightweight, works offline, and
              stays out of the way so you can focus on writing.
            </p>
            <p>
              Support & discussions: <a href="https://github.com/gcclinux/EasyEdit/discussions" target="_blank" rel="noopener noreferrer">GitHub Discussions</a>
            </p>
          </div>
          <div className="about-card">
            <h3>What it does</h3>
            <ul>
              <li>Use ready-made templates for meetings, projects, study, travel, and workouts.</li>
              <li>Insert tables, icons, images, links, tasks, footnotes, and Mermaid diagrams.</li>
              <li>Export to <strong>Markdown</strong> or <strong>TXT</strong>, or print the rendered preview.</li>
              <li>Resize the editor/preview split and switch themes on the fly.</li>
              <li>Small, offline-first footprint — works standalone or hosted</li>
            </ul>
          </div>
          <div className="about-card">
            <h3>Why you’ll like it</h3>
            <p>
              EasyEdit focuses on speed and simplicity while giving you the tools you need to
              capture, structure, and export notes quickly. It combines a lightweight editor with
              a live preview, reusable templates, and one-click exports so you can stay productive
              without distraction.
            </p>
            <p>Great for journaling, meeting notes, planning, and any quick-capture workflow.</p>
          </div>
          <div className="about-card">
            <h3>Credits</h3>
            <p>Built with care by <strong>Ricardo Wagemaker</strong>.<br />
              <span className="muted">Last updated: {lastUpdated}</span>
            </p>
            <p>Contributions: <a href="https://github.com/Lewish1998" target="_blank">Lewis Halstead</a></p>
        
            <p>License: MIT<br />Running Version: <strong>{version || '...'}</strong><br />Available Version: <strong>{availableVersion || '...'}</strong></p>
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
