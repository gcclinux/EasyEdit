import { Link } from 'react-router-dom'
import '../Docs.css'

export default function GitIntegration() {
    return (
        <div className="docs-page doc-content">
            <section className="page-header">
                <div className="container">
                    <h1>Git Integration</h1>
                    <p>Clone, edit, commit, and push Markdown files to Git repositories</p>
                </div>
            </section>

            <section className="docs-content">
                <div className="container">
                    <nav className="doc-breadcrumb">
                        <Link to="/docs">Documentation</Link> / <span>Git Integration</span>
                    </nav>

                    <div className="doc-section">
                        <h2>Overview</h2>
                        <p>
                            EasyEdit features built-in Git integration, allowing you to manage your Markdown documents
                            directly within version control. You can clone repositories, edit files, stage changes,
                            commit with messages, and push to remote servers like GitHub or GitLab.
                        </p>
                        <p>
                            This functionality turns EasyEdit into a powerful tool for maintaining documentation sites,
                            wikis, or personal notes stored in Git.
                        </p>
                    </div>

                    <div className="doc-section">
                        <h2>Features</h2>
                        <ul>
                            <li><strong>Clone:</strong> Download repositories from remote URLs.</li>
                            <li><strong>File Browser:</strong> Navigate the repository structure and open .md files.</li>
                            <li><strong>Stage & Commit:</strong> Select files to stage and create commits with messages.</li>
                            <li><strong>Push & Pull:</strong> Sync changes with the remote server.</li>
                            <li><strong>Branching:</strong> View the current branch (basic support).</li>
                        </ul>
                    </div>

                    <div className="doc-section">
                        <h2>How to use</h2>

                        <h3>1. Cloning a Repository</h3>
                        <ol>
                            <li>Go to <strong>File → Git → Clone Repository</strong>.</li>
                            <li>Enter the <strong>Repository URL</strong> (HTTPS).</li>
                            <li>Enter the <strong>Target Directory</strong> where you want to save it locally.</li>
                            <li>(Optional) Provide <strong>Username</strong> and <strong>Personal Access Token (PAT)</strong> if the repo is private or requires authentication for pushing.</li>
                            <li>Click <strong>Clone</strong>.</li>
                        </ol>

                        <h3>2. Opening and Editing Files</h3>
                        <p>
                            Once cloned, use the <strong>File Browser</strong> to navigate files. Double-click any Markdown file
                            to open it in the editor. Changes are saved to the local file system.
                        </p>

                        <h3>3. Staging and Committing</h3>
                        <ol>
                            <li>After making edits, go to the <strong>Git</strong> menu or panel.</li>
                            <li>You will see a list of changed files.</li>
                            <li>Select the files you want to stage.</li>
                            <li>Enter a <strong>Commit Message</strong>.</li>
                            <li>Click <strong>Commit</strong>.</li>
                        </ol>

                        <h3>4. Pushing Changes</h3>
                        <p>
                            To send your commits to the remote server, use the <strong>Push</strong> button.
                            Ensure you have set up your credentials correctly (using a PAT is recommended for GitHub).
                        </p>
                    </div>

                    <div className="doc-section">
                        <h2>Authentication</h2>
                        <p>
                            For security, we recommend using <strong>Personal Access Tokens (PAT)</strong> instead of passwords.
                        </p>
                        <ul>
                            <li>
                                <strong>GitHub:</strong> Go to Settings → Developer settings → Personal access tokens.
                                Generate a token with <code>repo</code> scope.
                            </li>
                            <li>
                                <strong>GitLab:</strong> Go to User Settings → Access Tokens.
                            </li>
                        </ul>
                    </div>

                    <div className="doc-section">
                        <h2>Troubleshooting</h2>
                        <ul>
                            <li>
                                <strong>Push Rejected:</strong> Usually happens if the remote has changes you don't have.
                                Try <strong>Pulling</strong> first to sync.
                            </li>
                            <li>
                                <strong>Authentication Failed:</strong> Double-check your PAT and username. Ensure the token hasn't expired.
                            </li>
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
