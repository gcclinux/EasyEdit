import { Link } from 'react-router-dom'
import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link to="/" className="logo">
            <span className="logo-text">EasyEdit</span>
          </Link>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/features">Features</Link></li>
            <li><Link to="/docs">Docs</Link></li>
            <li><Link to="/download">Download</Link></li>
            <li>
              <a 
                href="/EasyEdit/webapp/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="webapp-link"
              >
                🚀 Web App
              </a>
            </li>
            <li>
              <a 
                href="https://github.com/gcclinux/EasyEdit" 
                target="_blank" 
                rel="noopener noreferrer"
                className="github-link"
              >
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
