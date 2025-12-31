import { Link } from 'react-router-dom'
import '../Docs.css'

export default function CustomThemes() {
  return (
    <div className="docs-page doc-content">
      <section className="page-header">
        <div className="container">
          <h1>Custom Themes</h1>
          <p>Create and import custom color themes for EasyEditor</p>
        </div>
      </section>

      <section className="docs-content">
        <div className="container">
          <nav className="doc-breadcrumb">
            <Link to="/docs">Documentation</Link> / <span>Custom Themes</span>
          </nav>

          <div className="doc-section">
            <h2>Overview</h2>
            <p>
              Themes control all color-related styling in EasyEditor. You can create new themes by
              adding a CSS file that defines the CSS variables used by the application, and then
              import it from the app or select it via File → Themes → Import Theme.
            </p>
          </div>

          <div className="doc-section">
            <h2>Where to put your theme</h2>
            <p>
              For the desktop app use the app's theme importer (File → Themes → Import Theme). For
              the web app (GitHub Pages) themes live under <code>/themes/</code> and are loaded at
              runtime, so add your theme file to <code>public/themes/</code> and ensure it defines
              the required CSS variables.
            </p>
          </div>

          <div className="doc-section">
            <h2>Required variables</h2>
            <p>At minimum, define the following variables in your theme <code>:root</code>:</p>
            <pre><code>{`--bg-root
--bg-editor
--bg-preview
--bg-modal
--bg-modal-overlay
--bg-card
--border-card
--border-card-light
--color-text-primary
--color-text-modal
--color-text-muted
--btn-primary-modal
--btn-primary-modal-text`}</code></pre>
            <p>
              The new <code>--color-text-modal</code> variable is important: it controls text color
              specifically for modal dialogs (About, Features, Password, Import Theme, etc.) and
              ensures readable contrast on modal backgrounds. If you forget to define it, the app
              falls back to <code>--color-text-primary</code>.
            </p>
          </div>

          <div className="doc-section">
            <h2>Example theme</h2>
            <pre><code>{`/* example-theme.css */
:root {
  --bg-root: #0f1724;
  --bg-editor: #0b1220;
  --bg-preview: #ffffff;
  --bg-modal: #0c1520;
  --bg-modal-overlay: rgba(0,0,0,0.6);
  --bg-card: rgba(255,255,255,0.03);
  --border-card: rgba(255,255,255,0.08);
  --border-card-light: rgba(255,255,255,0.04);
  --color-text-primary: #e8eef6;
  --color-text-modal: #e8eef6;
  --color-text-muted: #bcd0df;
  --btn-primary-modal: #5aa0f2;
  --btn-primary-modal-text: #ffffff;
}`}</code></pre>
          </div>

          <div className="doc-section">
            <h2>Importing & activating</h2>
            <ol>
              <li>Open File → Themes → Import Theme</li>
              <li>Paste your theme CSS or upload the file</li>
              <li>Choose the imported theme from the theme selector</li>
            </ol>
            <p>
              For the web app, upload the theme to <code>public/themes/</code> and ensure
              <code>src/main.tsx</code> imports your theme or the app loads it via the theme
              selector (themeLoader will resolve themes using the configured base URL).
            </p>
          </div>

          <div className="doc-section">
            <h2>Tips</h2>
            <ul>
              <li>Set <code>--color-text-modal</code> to a high-contrast color for modal dialogs.</li>
              <li>Test in both dark and light system colour schemes; modals sometimes keep dark
                backgrounds intentionally, so modal text should remain light.</li>
              <li>Use <code>--bg-card</code> and <code>--border-card</code> for badge and card
                backgrounds to maintain consistent contrast inside modals.</li>
            </ul>
          </div>

          <div className="doc-nav">
            <Link to="/docs" className="btn btn-outline">← Back to Documentation</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
