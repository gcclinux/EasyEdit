import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>EasyEdit</h3>
            <p>A powerful Markdown editor with UML and Mermaid diagram support for Linux.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/features">Features</a></li>
              <li><a href="/docs">Documentation</a></li>
              <li><a href="/download">Download</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="https://github.com/gcclinux/EasyEdit" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="https://github.com/gcclinux/EasyEdit/issues" target="_blank" rel="noopener noreferrer">Report Issues</a></li>
              <li><a href="https://github.com/gcclinux/EasyEdit/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">License</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} EasyEdit. Open source project.</p>
        </div>
      </div>
    </footer>
  )
}
