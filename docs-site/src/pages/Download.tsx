import './Download.css'

const GITHUB_LATEST = 'https://github.com/gcclinux/EasyEdit/releases/latest'

export default function Download() {
  return (
    <div className="download-page">
      <section className="page-header">
        <div className="container">
          <h1>Download EasyEdit</h1>
          <p>Get the latest version for Linux, Windows, and macOS</p>
        </div>
      </section>

      <section className="download-content">
        <div className="container">
          <div className="version-info">
            <h2>Latest Release</h2>
            <p>Download the latest version for your platform from GitHub Releases</p>
            <a 
              href={GITHUB_LATEST}
              className="btn btn-outline"
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginTop: '1rem' }}
            >
              View All Releases on GitHub
            </a>
          </div>

          {/* Linux Downloads */}
          <div className="platform-section">
            <h2 className="platform-title">🐧 Linux</h2>
            <p className="platform-description">Choose the package format that works best for your distribution</p>
            
            <div className="download-options">
              <div className="download-card featured">
                <div className="featured-badge">Recommended</div>
                <div className="download-icon">📦</div>
                <h3>AppImage</h3>
                <p>Universal Linux package - works on most distributions without installation</p>
                <a 
                  href={GITHUB_LATEST}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download AppImage
                </a>
              </div>

              <div className="download-card">
                <div className="download-icon">📀</div>
                <h3>Debian/Ubuntu</h3>
                <p>DEB package for Debian, Ubuntu, Linux Mint, and derivatives</p>
                <a 
                  href={GITHUB_LATEST}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download .deb
                </a>
              </div>

              <div className="download-card">
                <div className="download-icon">🎩</div>
                <h3>Red Hat/Fedora</h3>
                <p>RPM package for RHEL, Fedora, CentOS, and derivatives</p>
                <a 
                  href={GITHUB_LATEST}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download .rpm
                </a>
              </div>

              <div className="download-card">
                <div className="download-icon">📱</div>
                <h3>Snap Package</h3>
                <p>Universal package with auto-updates (x86_64, ARM64, ARMhf)</p>
                <a 
                  href={GITHUB_LATEST}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Snap
                </a>
              </div>
            </div>
          </div>

          {/* Windows Downloads */}
          <div className="platform-section">
            <h2 className="platform-title">🪟 Windows</h2>
            <p className="platform-description">Choose between installer or portable versions</p>
            
            <div className="download-options">
              <div className="download-card featured">
                <div className="featured-badge">Recommended</div>
                <div className="download-icon">💻</div>
                <h3>Windows Installer</h3>
                <p>Standard setup wizard for Windows 10/11 (EXE or MSI)</p>
                <a 
                  href={GITHUB_LATEST}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Installer
                </a>
              </div>

              <div className="download-card">
                <div className="download-icon">🎒</div>
                <h3>Portable Version</h3>
                <p>No installation required - run from anywhere, including USB drives</p>
                <a 
                  href={GITHUB_LATEST}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Portable
                </a>
              </div>

              <div className="download-card">
                <div className="download-icon">📦</div>
                <h3>ZIP Archive</h3>
                <p>Portable version as ZIP archive for manual extraction</p>
                <a 
                  href={GITHUB_LATEST}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download ZIP
                </a>
              </div>
            </div>
          </div>

          {/* macOS Downloads */}
          <div className="platform-section">
            <h2 className="platform-title"> macOS</h2>
            <p className="platform-description">For Apple Silicon (M1, M2, M3) Macs</p>

            <div className="download-options">
              <div className="download-card featured">
                <div className="featured-badge">Recommended</div>
                <div className="download-icon">🖥️</div>
                <h3>DMG Installer</h3>
                <p>Standard macOS disk image for Apple Silicon (ARM64)</p>
                <a
                  href={GITHUB_LATEST}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download DMG
                </a>
              </div>

              <div className="download-card">
                <div className="download-icon">📦</div>
                <h3>ZIP Archive</h3>
                <p>Zipped macOS application for Apple Silicon (ARM64)</p>
                <a
                  href={GITHUB_LATEST}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download ZIP
                </a>
              </div>
            </div>
          </div>

          {/* Source Code */}
          <div className="platform-section">
            <h2 className="platform-title">🔧 Source Code</h2>
            <p className="platform-description">Build from source or contribute to the project</p>

            <div className="download-options">
              <div className="download-card">
                <div className="download-icon">💻</div>
                <h3>GitHub Repository</h3>
                <p>Access the source code, report issues, and contribute</p>
                <a 
                  href="https://github.com/gcclinux/EasyEdit" 
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </a>
              </div>

              <div className="download-card">
                <div className="download-icon">📥</div>
                <h3>Source Archive</h3>
                <p>Download the latest source code as ZIP or TAR.GZ</p>
                <a 
                  href={GITHUB_LATEST}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Source
                </a>
              </div>
            </div>
          </div>

          <div className="system-requirements">
            <h2>System Requirements</h2>
            <div className="requirements-grid">
              <div className="requirement-item">
                <strong>Operating System:</strong>
                <p>Linux (x86_64, ARM64) • Windows 10/11 • macOS (Apple Silicon)</p>
              </div>
              <div className="requirement-item">
                <strong>Memory:</strong>
                <p>Minimum 2GB RAM</p>
              </div>
              <div className="requirement-item">
                <strong>Storage:</strong>
                <p>300MB free disk space</p>
              </div>
              <div className="requirement-item">
                <strong>Display:</strong>
                <p>1024x768 or higher</p>
              </div>
            </div>
          </div>

          <div className="installation-guide">
            <h2>Installation Instructions</h2>
            
            <div className="install-section">
              <h3>🐧 Linux - AppImage</h3>
              <ol>
                <li>Download the .AppImage file from the releases page</li>
                <li>Make it executable: <code>chmod +x EasyEdit-*.AppImage</code></li>
                <li>Run it: <code>./EasyEdit-*.AppImage</code></li>
              </ol>
            </div>

            <div className="install-section">
              <h3>🐧 Linux - DEB Package</h3>
              <ol>
                <li>Download the .deb file</li>
                <li>Install: <code>sudo dpkg -i EasyEdit-*.deb</code></li>
                <li>Fix dependencies if needed: <code>sudo apt-get install -f</code></li>
                <li>Launch from applications menu or run: <code>easyedit</code></li>
              </ol>
            </div>

            <div className="install-section">
              <h3>🐧 Linux - RPM Package</h3>
              <ol>
                <li>Download the .rpm file</li>
                <li>Install: <code>sudo rpm -i EasyEdit-*.rpm</code></li>
                <li>Or use dnf: <code>sudo dnf install EasyEdit-*.rpm</code></li>
                <li>Launch from applications menu or run: <code>easyedit</code></li>
              </ol>
            </div>

            <div className="install-section">
              <h3>🐧 Linux - Snap</h3>
              <ol>
                <li>Download the .snap file</li>
                <li>Install: <code>sudo snap install EasyEdit-*.snap --dangerous</code></li>
                <li>Run: <code>easyedit</code></li>
              </ol>
            </div>

            <div className="install-section">
              <h3>🪟 Windows - Installer</h3>
              <ol>
                <li>Download the .exe or .msi installer</li>
                <li>Double-click to run the installer</li>
                <li>Follow the installation wizard</li>
                <li>Launch from Start Menu or desktop shortcut</li>
              </ol>
            </div>

            <div className="install-section">
              <h3>🪟 Windows - Portable</h3>
              <ol>
                <li>Download the portable .exe or .zip file</li>
                <li>Extract if ZIP (no installation needed for .exe)</li>
                <li>Run EasyEdit.exe directly</li>
                <li>Can be run from USB or any folder</li>
              </ol>
            </div>

            <div className="install-section">
              <h3> macOS - DMG</h3>
              <ol>
                <li>Download the .dmg file</li>
                <li>Open the downloaded .dmg file to mount it</li>
                <li>Drag the EasyEdit app icon into the Applications folder</li>
                <li>Eject the mounted image and launch EasyEdit from Applications</li>
                <li>If macOS blocks the app, go to System Settings → Privacy & Security and allow it</li>
              </ol>
            </div>

            <div className="install-section">
              <h3> macOS - ZIP</h3>
              <ol>
                <li>Download the .zip file</li>
                <li>Unzip the archive</li>
                <li>Move the extracted EasyEdit.app to your Applications folder</li>
                <li>If macOS warns about an unverified developer, right-click and choose Open</li>
              </ol>
            </div>

            <div className="install-section">
              <h3>🔧 Build from Source</h3>
              <ol>
                <li>Clone the repository: <code>git clone https://github.com/gcclinux/EasyEdit.git</code></li>
                <li>Install dependencies: <code>npm install</code></li>
                <li>Build: <code>npm run build</code></li>
                <li>Package: <code>npm run electron:build</code></li>
              </ol>
            </div>
          </div>

          <div className="support-section">
            <h2>Need Help?</h2>
            <p>If you encounter any issues during installation or usage:</p>
            <div className="support-links">
              <a href="https://github.com/gcclinux/EasyEdit/issues" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                Report an Issue
              </a>
              <a href="https://github.com/gcclinux/EasyEdit/discussions" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                Community Discussions
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
