import { Link } from 'react-router-dom'
import './Docs.css'

export default function Docs() {
  return (
    <div className="docs-page">
      <section className="page-header">
        <div className="container">
          <h1>Documentation</h1>
          <p>Learn how to use EasyEdit effectively</p>
        </div>
      </section>

      <section className="docs-content">
        <div className="container">
          <div className="docs-grid">
            <Link to="/docs/project-summary" className="doc-card">
              <div className="doc-icon">🎉</div>
              <h3>Project Summary</h3>
              <p>Complete overview of the GitHub Pages site and its features</p>
            </Link>

            <Link to="/docs/uml-quick-start" className="doc-card">
              <div className="doc-icon">🚀</div>
              <h3>UML Quick Start</h3>
              <p>Get started with UML diagrams quickly using Nomnoml syntax</p>
            </Link>

            <Link to="/docs/uml-examples" className="doc-card">
              <div className="doc-icon">📊</div>
              <h3>UML Examples</h3>
              <p>Explore real-world UML diagram examples and use cases</p>
            </Link>

            <Link to="/docs/templates-guide" className="doc-card">
              <div className="doc-icon">📝</div>
              <h3>Templates Guide</h3>
              <p>Learn how to use pre-built templates for quick document creation</p>
            </Link>

            <Link to="/docs/mermaid-guide" className="doc-card">
              <div className="doc-icon">🧜‍♀️</div>
              <h3>Mermaid Guide</h3>
              <p>Create flowcharts, Gantt charts, and diagrams with Mermaid syntax</p>
            </Link>

            <Link to="/docs/nomnoml-guide" className="doc-card">
              <div className="doc-icon">📖</div>
              <h3>Nomnoml Guide</h3>
              <p>Complete guide to Nomnoml syntax and features</p>
            </Link>

          </div>

          <div className="getting-started">
            <h2>Getting Started</h2>
            <div className="guide-section">
              <h3>Basic Usage</h3>
              <ol>
                <li>Launch EasyEdit from your application menu or terminal</li>
                <li>Start typing Markdown content in the editor</li>
                <li>See live preview on the right panel</li>
                <li>Use the toolbar for quick formatting options</li>
                <li>Save your work with Ctrl+S or from the File menu</li>
              </ol>
            </div>

            <div className="guide-section">
              <h3>Creating Diagrams</h3>
              <p>EasyEdit supports two types of diagrams:</p>
              <ul>
                <li><strong>UML Diagrams (Nomnoml):</strong> Use the UML dropdown to insert diagram templates</li>
                <li><strong>Mermaid Diagrams:</strong> Use the Mermaid dropdown for flowcharts, Gantt charts, and more</li>
              </ul>
            </div>

            <div className="guide-section">
              <h3>Using Templates</h3>
              <p>Access pre-built templates from the Insert menu:</p>
              <ul>
                <li>Meeting Notes</li>
                <li>Project Plans</li>
                <li>Daily Journal</li>
                <li>Study Notes</li>
                <li>And more...</li>
              </ul>
            </div>

            <div className="guide-section">
              <h3>Keyboard Shortcuts</h3>
              <div className="shortcuts-grid">
                <div className="shortcut-item">
                  <kbd>Ctrl + S</kbd>
                  <span>Save file</span>
                </div>
                <div className="shortcut-item">
                  <kbd>Ctrl + O</kbd>
                  <span>Open file</span>
                </div>
                <div className="shortcut-item">
                  <kbd>Ctrl + B</kbd>
                  <span>Bold text</span>
                </div>
                <div className="shortcut-item">
                  <kbd>Ctrl + I</kbd>
                  <span>Italic text</span>
                </div>
              </div>
            </div>
          </div>

          <div className="additional-resources">
            <h2>Additional Resources</h2>
            <div className="resources-grid">
              <a href="https://github.com/gcclinux/EasyEdit" target="_blank" rel="noopener noreferrer" className="resource-card">
                <h4>GitHub Repository</h4>
                <p>Access the source code and contribute</p>
              </a>
              <a href="https://github.com/gcclinux/EasyEdit/issues" target="_blank" rel="noopener noreferrer" className="resource-card">
                <h4>Report Issues</h4>
                <p>Found a bug? Let us know</p>
              </a>
              <a href="https://www.markdownguide.org/" target="_blank" rel="noopener noreferrer" className="resource-card">
                <h4>Markdown Guide</h4>
                <p>Learn Markdown syntax</p>
              </a>
              <a href="https://mermaid.js.org/" target="_blank" rel="noopener noreferrer" className="resource-card">
                <h4>Mermaid Docs</h4>
                <p>Explore Mermaid diagram types</p>
              </a>
            </div>
          </div>

          <div className="try-it-section">
            <h2>Try EasyEdit Online</h2>
            <p>Experience EasyEdit directly in your browser without downloading anything!</p>
            <div className="hero-buttons">
              <Link to="/docs" className="btn btn-secondary">📚 Documentation</Link>
              <a href="https://easyedit-web.web.app/" target="_blank" rel="noopener noreferrer" className="btn btn-primary">🚀 Try It Online</a>
              <Link to="/download" className="btn btn-secondary">⬇️ Download</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
