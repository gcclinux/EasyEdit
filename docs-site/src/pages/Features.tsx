import './Features.css'

export default function Features() {
  return (
    <div className="features-page">
      <section className="page-header">
        <div className="container">
          <h1>Features</h1>
          <p>Discover all the powerful features that make EasyEdit the perfect Markdown editor</p>
        </div>
      </section>

      <section className="features-detailed">
        <div className="container">
          <div className="feature-detail">
            <div className="feature-detail-content">
              <h2>📝 Advanced Markdown Editor</h2>
              <p>
                EasyEdit provides a full-featured Markdown editor with syntax highlighting, 
                live preview, and support for GitHub Flavored Markdown (GFM).
              </p>
              <ul>
                <li>Real-time preview as you type</li>
                <li>Syntax highlighting for better readability</li>
                <li>Support for tables, task lists, and code blocks</li>
                <li>Auto-save functionality</li>
                <li>Multiple text formatting options</li>
              </ul>
            </div>
          </div>

          <div className="feature-detail reverse">
            <div className="feature-detail-content">
              <h2>📊 UML Diagram Support</h2>
              <p>
                Create professional UML diagrams using Nomnoml syntax. Perfect for 
                documenting software architecture and design patterns.
              </p>
              <ul>
                <li>Class diagrams</li>
                <li>Sequence diagrams</li>
                <li>Activity diagrams</li>
                <li>Component diagrams</li>
                <li>Simple and intuitive syntax</li>
                <li>Instant preview</li>
              </ul>
            </div>
          </div>

          <div className="feature-detail">
            <div className="feature-detail-content">
              <h2>🎨 Mermaid Diagram Integration</h2>
              <p>
                Generate a wide variety of diagrams using Mermaid syntax, including 
                flowcharts, Gantt charts, sequence diagrams, and more.
              </p>
              <ul>
                <li>Flowcharts and process diagrams</li>
                <li>Sequence and state diagrams</li>
                <li>Gantt charts for project planning</li>
                <li>Timeline visualizations</li>
                <li>Entity relationship diagrams</li>
                <li>Git graphs and journey maps</li>
              </ul>
            </div>
          </div>

          <div className="feature-detail reverse">
            <div className="feature-detail-content">
              <h2>⚡ Auto-Generators</h2>
              <p>
                Save time with powerful auto-generators that create formatted content 
                with just a few clicks.
              </p>
              <ul>
                <li><strong>Table Generator:</strong> Create formatted tables with custom rows and columns</li>
                <li><strong>Gantt Chart Generator:</strong> Build project timelines quickly</li>
                <li><strong>Timeline Generator:</strong> Create event timelines effortlessly</li>
                <li>Context menu integration for easy access</li>
              </ul>
            </div>
          </div>

          <div className="feature-detail">
            <div className="feature-detail-content">
              <h2>📄 Export & Save Options</h2>
              <p>
                Export your documents in various formats and save them securely.
              </p>
              <ul>
                <li>Export to PDF with beautiful formatting</li>
                <li>Save as Markdown (.md)</li>
                <li>Encrypted file format (.stp)</li>
                <li>Preserve formatting and diagrams</li>
                <li>Quick save and auto-save features</li>
              </ul>
            </div>
          </div>

          <div className="feature-detail reverse">
            <div className="feature-detail-content">
              <h2>🔒 Security & Encryption</h2>
              <p>
                Keep your sensitive documents secure with built-in encryption support.
              </p>
              <ul>
                <li>Password-protected files</li>
                <li>Secure encryption algorithm</li>
                <li>Easy encryption/decryption workflow</li>
                <li>Protected .stp file format</li>
              </ul>
            </div>
          </div>

          <div className="feature-detail">
            <div className="feature-detail-content">
              <h2>📋 Templates Library</h2>
              <p>
                Jump-start your work with pre-built templates for common use cases.
              </p>
              <ul>
                <li>Meeting Notes</li>
                <li>Project Plans</li>
                <li>Daily Journal</li>
                <li>Study Notes</li>
                <li>Bug Reports</li>
                <li>Travel Logs</li>
                <li>Workout Logs</li>
                <li>Task Lists</li>
              </ul>
            </div>
          </div>

          <div className="feature-detail reverse">
            <div className="feature-detail-content">
              <h2>🎯 User-Friendly Interface</h2>
              <p>
                Intuitive interface designed for productivity and ease of use.
              </p>
              <ul>
                <li>Clean and modern design</li>
                <li>Dropdown menus for quick access</li>
                <li>Keyboard shortcuts</li>
                <li>Customizable toolbar</li>
                <li>Context menus for common actions</li>
                <li>Responsive layout</li>
              </ul>
            </div>
          </div>

          <div className="feature-detail">
            <div className="feature-detail-content">
              <h2>🔀 Git Integration</h2>
              <p>
                Built-in Git support for managing documentation and notes stored in repositories.
                Work seamlessly with GitHub, GitLab, and other Git hosting services.
              </p>
              <ul>
                <li>Clone repositories directly from the app</li>
                <li>Browse and open Markdown files from repositories</li>
                <li>Stage and commit changes with descriptive messages</li>
                <li>Push commits to remote servers</li>
                <li>View commit history with author and timestamp details</li>
                <li>Credential management with secure storage</li>
                <li>Perfect for documentation workflows</li>
              </ul>
            </div>
          </div>

          <div className="feature-detail reverse">
            <div className="feature-detail-content">
              <h2>🎨 Customizable Themes</h2>
              <p>
                Personalize your editing experience with a variety of beautiful, modern themes.
                Choose color schemes that match your style and reduce eye strain.
              </p>
              <ul>
                <li>Multiple pre-built themes</li>
                <li>Light and dark mode options</li>
                <li>Vibrant color palettes</li>
                <li>Switch themes instantly</li>
                <li>Custom theme support</li>
                <li>Carefully crafted designs for optimal readability</li>
              </ul>
            </div>
          </div>

          <div className="feature-detail">
            <div className="feature-detail-content">
              <h2>🐧 Built for Linux</h2>
              <p>
                Native Linux application built with Electron, optimized for performance.
              </p>
              <ul>
                <li>AppImage format for easy installation</li>
                <li>Flatpak support</li>
                <li>ARM64 architecture support</li>
                <li>Low resource consumption</li>
                <li>Regular updates and improvements</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
