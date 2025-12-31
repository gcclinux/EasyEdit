import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">EasyEditor</h1>
            <p className="hero-subtitle">
              A Powerful Markdown Editor with UML & Mermaid Diagram Support
            </p>
            <p className="hero-description">
              Create beautiful documents, diagrams, and notes with ease.
              Built for Linux with advanced features for developers and writers.
            </p>
            <div className="hero-buttons">
              <Link to="/docs" className="btn btn-secondary">
                📚 Documentation
              </Link>
              <a href="/easyeditor/webapp/" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-webapp">
                🚀 WebApp
              </a>
              <Link to="/download" className="btn btn-secondary">
                ⬇️ Download
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="features-preview">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Markdown Editor</h3>
              <p>Full-featured Markdown editor with live preview and syntax highlighting</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>UML Diagrams</h3>
              <p>Create UML diagrams using Nomnoml with intuitive syntax</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Mermaid Support</h3>
              <p>Generate flowcharts, sequence diagrams, Gantt charts, and more</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔀</div>
              <h3>Git Integration</h3>
              <p>Clone, edit, commit, and push Markdown files to Git repositories</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Encryption</h3>
              <p>Secure your documents with built-in encryption support</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Templates</h3>
              <p>Pre-built templates for meetings, projects, journals, and more</p>
            </div>
          </div>
          <div className="text-center" style={{ marginTop: '2rem' }}>
            <Link to="/features" className="btn btn-outline">
              View All Features
            </Link>
          </div>
        </div>
      </section>

      {/* Auto Generators Section */}
      <section className="auto-generators">
        <div className="container">
          <h2 className="section-title">Powerful Auto-Generators</h2>
          <div className="generators-grid">
            <div className="generator-card">
              <h3>📊 Table Generator</h3>
              <p>Quickly create formatted tables with customizable rows and columns</p>
            </div>
            <div className="generator-card">
              <h3>📅 Gantt Chart Generator</h3>
              <p>Build project timelines and Gantt charts effortlessly</p>
            </div>
            <div className="generator-card">
              <h3>⏱️ Timeline Generator</h3>
              <p>Create beautiful timelines for events and milestones</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>Download EasyEditor now and start creating amazing documents</p>
          <Link to="/download" className="btn btn-primary btn-large">
            Download for Linux
          </Link>
        </div>
      </section>
    </div>
  )
}
