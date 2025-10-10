import './Download.css'

const GITHUB_RELEASE = 'https://github.com/gcclinux/EasyEdit/releases/download/v1.4.2'

export default function Download() {
  return (
    <div className="download-page">
      <section className="page-header">
        <div className="container">
          <h1>Download EasyEdit</h1>
          <p>Get the latest version for Linux, Windows, and more</p>
        </div>
      </section>

      <section className="download-content">
        <div className="container">
          <div className="version-info">
            <h2>Latest Version: 1.4.2</h2>
            <p>Available for multiple platforms and architectures</p>
          </div>

          {/* Linux Downloads */}
          <div className="platform-section">
            <h2 className="platform-title">🐧 Linux</h2>
            
            <div className="download-options">
              <div className="download-card featured">
                <div className="featured-badge">Recommended</div>
                <div className="download-icon">📦</div>
                <h3>AppImage (x86_64)</h3>
                <p>Universal Linux package - works on most distributions</p>
                <div className="file-info">
                  <span className="file-size">288 MB</span>
                </div>
                <a 
                  href={`${GITHUB_RELEASE}/EasyEdit-1.4.2-x86_64.AppImage`}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download AppImage
                </a>
              </div>

              <div className="download-card">
                <div className="download-icon">📀</div>
                <h3>Debian/Ubuntu (.deb)</h3>
                <p>For Debian, Ubuntu, and derivatives</p>
                <div className="file-info">
                  <span className="file-size">187 MB</span>
                </div>
                <a 
                  href={`${GITHUB_RELEASE}/EasyEdit-1.4.2-amd64.deb`}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download .deb
                </a>
              </div>

              <div className="download-card">
                <div className="download-icon">🎩</div>
                <h3>Red Hat/Fedora (.rpm)</h3>
                <p>For RHEL, Fedora, CentOS, and derivatives</p>
                <div className="file-info">
                  <span className="file-size">189 MB</span>
                </div>
                <a 
                  href={`${GITHUB_RELEASE}/EasyEdit-1.4.2-x86_64.rpm`}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download .rpm
                </a>
              </div>
            </div>

            <div className="download-options">
              <div className="download-card">
                <div className="download-icon">📱</div>
                <h3>Snap (x86_64)</h3>
                <p>Universal Linux package with auto-updates</p>
                <div className="file-info">
                  <span className="file-size">247 MB</span>
                </div>
                <a 
                  href={`${GITHUB_RELEASE}/EasyEdit-1.4.2-amd64.snap`}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Snap
                </a>
              </div>

              <div className="download-card">
                <div className="download-icon">💪</div>
                <h3>Snap (ARM64)</h3>
                <p>For 64-bit ARM devices (Raspberry Pi 4, etc.)</p>
                <div className="file-info">
                  <span className="file-size">239 MB</span>
                </div>
                <a 
                  href={`${GITHUB_RELEASE}/EasyEdit-1.4.2-arm64.snap`}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download ARM64
                </a>
              </div>

              <div className="download-card">
                <div className="download-icon">�</div>
                <h3>Snap (ARMhf)</h3>
                <p>For 32-bit ARM devices</p>
                <div className="file-info">
                  <span className="file-size">228 MB</span>
                </div>
                <a 
                  href={`${GITHUB_RELEASE}/EasyEdit-1.4.2-armhf.snap`}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download ARMhf
                </a>
              </div>
            </div>
          </div>

          {/* Windows Downloads */}
          <div className="platform-section">
            <h2 className="platform-title">🪟 Windows</h2>
            
            <div className="download-options">
              <div className="download-card featured">
                <div className="featured-badge">Installer</div>
                <div className="download-icon">💻</div>
                <h3>Windows Setup (.exe)</h3>
                <p>Standard installer for Windows</p>
                <div className="file-info">
                  <span className="file-size">227 MB</span>
                </div>
                <a 
                  href={`${GITHUB_RELEASE}/EasyEdit-Setup-1.4.2.exe`}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Installer
                </a>
              </div>

              <div className="download-card">
                <div className="download-icon">📦</div>
                <h3>Windows MSI</h3>
                <p>MSI installer package</p>
                <div className="file-info">
                  <span className="file-size">239 MB</span>
                </div>
                <a 
                  href={`${GITHUB_RELEASE}/EasyEdit-Setup-1.4.2.msi`}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download MSI
                </a>
              </div>

              <div className="download-card">
                <div className="download-icon">🎒</div>
                <h3>Portable (.exe)</h3>
                <p>No installation required - run from USB</p>
                <div className="file-info">
                  <span className="file-size">226 MB</span>
                </div>
                <a 
                  href={`${GITHUB_RELEASE}/EasyEdit-Portable-1.4.2.exe`}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Portable
                </a>
              </div>
            </div>

            <div className="download-options">
              <div className="download-card">
                <div className="download-icon">�</div>
                <h3>Portable (.zip)</h3>
                <p>Windows portable version as ZIP archive</p>
                <div className="file-info">
                  <span className="file-size">294 MB</span>
                </div>
                <a 
                  href={`${GITHUB_RELEASE}/EasyEdit-Portable-1.4.2.zip`}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download ZIP
                </a>
              </div>

              <div className="download-card">
                <div className="download-icon">📦</div>
                <h3>Cross-Platform (.zip)</h3>
                <p>Universal package for all platforms</p>
                <div className="file-info">
                  <span className="file-size">273 MB</span>
                </div>
                <a 
                  href={`${GITHUB_RELEASE}/EasyEdit-1.4.2-x64.zip`}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download x64 ZIP
                </a>
              </div>

              <div className="download-card">
                <div className="download-icon">🔧</div>
                <h3>Source Code</h3>
                <p>Build from source or contribute</p>
                <a 
                  href="https://github.com/gcclinux/EasyEdit" 
                  className="btn btn-secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Checksums Section */}
          <div className="checksums-section">
            <h2>🔒 SHA256 Checksums</h2>
            <p>Verify your download integrity:</p>
            <details className="checksums-details">
              <summary>View SHA256 Checksums</summary>
              <div className="checksums-list">
                <div className="checksum-item">
                  <strong>EasyEdit-1.4.2-x86_64.AppImage</strong>
                  <code>caf4c699c2b7f7aacf977a4fde60dabe928107f4800300676bb8434646e30242</code>
                </div>
                <div className="checksum-item">
                  <strong>EasyEdit-1.4.2-amd64.deb</strong>
                  <code>203eb80b02885d9a29a6811b0882dcba21dd711a7af38cf709dd5517f189d9d2</code>
                </div>
                <div className="checksum-item">
                  <strong>EasyEdit-1.4.2-x86_64.rpm</strong>
                  <code>b57f37a397e75377db595bcff3402895c856ec7ecc16007d6b44800118f391a3</code>
                </div>
                <div className="checksum-item">
                  <strong>EasyEdit-1.4.2-amd64.snap</strong>
                  <code>7a2ed2b24c86e3b224b2d988b8dfd5cb866b3630668500af03c5e245219cef30</code>
                </div>
                <div className="checksum-item">
                  <strong>EasyEdit-1.4.2-arm64.snap</strong>
                  <code>413d6c5303787029cecf33ac713993450c9af3d0466f3c6a50bf8e831dd97fb6</code>
                </div>
                <div className="checksum-item">
                  <strong>EasyEdit-1.4.2-armhf.snap</strong>
                  <code>4bab1df4170cfc9ecac56625db5f5782a172f2788abca56d1357d999aaed5c24</code>
                </div>
                <div className="checksum-item">
                  <strong>EasyEdit-Setup-1.4.2.exe</strong>
                  <code>57c52740604aded2ba9cf00c78064626b0e7ad9ef0d6ff3a37c4bf40eb0e280d</code>
                </div>
                <div className="checksum-item">
                  <strong>EasyEdit-Setup-1.4.2.msi</strong>
                  <code>eec6448a571efe9ded83937ffb195d3687df6535757fb978ef7df99a6162170c</code>
                </div>
                <div className="checksum-item">
                  <strong>EasyEdit-Portable-1.4.2.exe</strong>
                  <code>b3a5dffffe72d3b5641b4ed39134ce7644730576c20e8cb15cb1e8922762d28b</code>
                </div>
                <div className="checksum-item">
                  <strong>EasyEdit-Portable-1.4.2.zip</strong>
                  <code>9186f43faf6c1d9db6bd2a5db81c38cf8ce487c9eaf71cead70387fb17f8799f</code>
                </div>
                <div className="checksum-item">
                  <strong>EasyEdit-1.4.2-x64.zip</strong>
                  <code>b08a2d0839b3658a7080da4a5decd683090738fa2b37a166fc063e7589dc37f7</code>
                </div>
              </div>
              <div className="verify-instructions">
                <h4>How to verify:</h4>
                <p>Linux/Mac: <code>sha256sum filename</code></p>
                <p>Windows: <code>certUtil -hashfile filename SHA256</code></p>
              </div>
            </details>
          </div>

          <div className="system-requirements">
            <h2>System Requirements</h2>
            <div className="requirements-grid">
              <div className="requirement-item">
                <strong>Operating System:</strong>
                <p>Linux (x86_64, ARM64, ARMhf) • Windows 10/11</p>
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
                <li>Download the .AppImage file</li>
                <li>Make it executable: <code>chmod +x EasyEdit-1.4.2-x86_64.AppImage</code></li>
                <li>Run it: <code>./EasyEdit-1.4.2-x86_64.AppImage</code></li>
              </ol>
            </div>

            <div className="install-section">
              <h3>🐧 Linux - .deb (Debian/Ubuntu)</h3>
              <ol>
                <li>Download the .deb file</li>
                <li>Install: <code>sudo dpkg -i EasyEdit-1.4.2-amd64.deb</code></li>
                <li>Fix dependencies if needed: <code>sudo apt-get install -f</code></li>
                <li>Launch from applications menu or run: <code>easyedit</code></li>
              </ol>
            </div>

            <div className="install-section">
              <h3>🐧 Linux - .rpm (Red Hat/Fedora)</h3>
              <ol>
                <li>Download the .rpm file</li>
                <li>Install: <code>sudo rpm -i EasyEdit-1.4.2-x86_64.rpm</code></li>
                <li>Or use dnf: <code>sudo dnf install EasyEdit-1.4.2-x86_64.rpm</code></li>
                <li>Launch from applications menu or run: <code>easyedit</code></li>
              </ol>
            </div>

            <div className="install-section">
              <h3>🐧 Linux - Snap</h3>
              <ol>
                <li>Download the .snap file</li>
                <li>Install: <code>sudo snap install EasyEdit-1.4.2-amd64.snap --dangerous</code></li>
                <li>Run: <code>easyedit</code></li>
                <li>For ARM devices, use the arm64 or armhf snap file</li>
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
              <h3>🔧 Build from Source</h3>
              <ol>
                <li>Clone the repository: <code>git clone https://github.com/gcclinux/EasyEdit.git</code></li>
                <li>Install dependencies: <code>npm install</code></li>
                <li>Build: <code>npm run build</code></li>
                <li>Package: <code>npm run package</code></li>
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
