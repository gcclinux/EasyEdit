import { Link } from 'react-router-dom'

export default function MermaidGuide() {
  return (
    <div className="docs-page">
      <section className="page-header">
        <div className="container">
          <h1>Mermaid Diagrams Guide</h1>
          <p>Create beautiful diagrams with simple text syntax</p>
        </div>
      </section>

      <section className="docs-content">
        <div className="container">
          <div className="guide-section">
            <h2>What is Mermaid?</h2>
            <p>
              Mermaid is a JavaScript-based diagramming tool that renders text definitions into diagrams. 
              EasyEditor supports Mermaid syntax, allowing you to create flowcharts, Gantt charts, class diagrams, 
              and more using simple text.
            </p>
          </div>

          <div className="guide-section">
            <h2>How to Use Mermaid in EasyEditor</h2>
            <ol>
              <li>Click the <strong>Mermaid ▾</strong> button in the toolbar</li>
              <li>Select the diagram type you want to create</li>
              <li>A template will be inserted into your editor</li>
              <li>Modify the template to match your needs</li>
              <li>View the rendered diagram in the preview pane</li>
            </ol>
          </div>

          <div className="guide-section">
            <h2>Available Diagram Types</h2>

            <h3>🔄 Flowchart</h3>
            <p>
              Create process flows and decision trees. Supports multiple directions (LR, RL, TD, BT) 
              and various node shapes.
            </p>
            <pre><code>{`\`\`\`mermaid
flowchart LR
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[Car]
\`\`\``}</code></pre>
            <p><strong>Best for:</strong> Process flows, decision trees, workflows</p>

            <h3>📊 Gantt Chart</h3>
            <p>
              Project planning and timeline visualization with tasks, sections, and dependencies.
            </p>
            <pre><code>{`\`\`\`mermaid
gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1, 20d
    section Another
    Task in sec      :2014-01-12, 12d
    another task     :24d
\`\`\``}</code></pre>
            <p><strong>Best for:</strong> Project timelines, task scheduling, milestone tracking</p>

            <h3>🏗️ Class Diagram</h3>
            <p>
              Object-oriented design visualization showing classes, attributes, methods, and relationships.
            </p>
            <pre><code>{`\`\`\`mermaid
classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    class Duck{
      +String beakColor
      +swim()
      +quack()
    }
\`\`\``}</code></pre>
            <p><strong>Best for:</strong> Software architecture, OOP design, system modeling</p>

            <h3>🗺️ User Journey</h3>
            <p>
              Map user experiences and interactions with satisfaction scores.
            </p>
            <pre><code>{`\`\`\`mermaid
journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 3: Me
\`\`\``}</code></pre>
            <p><strong>Best for:</strong> UX design, customer journey mapping, experience flows</p>

            <h3>🌳 Git Graph</h3>
            <p>
              Visualize Git branching strategies and version control workflows.
            </p>
            <pre><code>{`\`\`\`mermaid
gitGraph
    commit
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
\`\`\``}</code></pre>
            <p><strong>Best for:</strong> Git workflows, branching strategies, version control documentation</p>

            <h3>🗄️ ER Diagram</h3>
            <p>
              Database entity-relationship diagrams showing tables and their relationships.
            </p>
            <pre><code>{`\`\`\`mermaid
erDiagram
    CUSTOMER }|..|{ DELIVERY-ADDRESS : has
    CUSTOMER ||--o{ ORDER : places
    CUSTOMER ||--o{ INVOICE : "liable for"
    ORDER ||--|{ ORDER-ITEM : includes
    PRODUCT ||--o{ ORDER-ITEM : "ordered in"
\`\`\``}</code></pre>
            <p><strong>Best for:</strong> Database design, data modeling, schema documentation</p>

            <h3>📅 Timeline</h3>
            <p>
              Create chronological timelines with sections and events.
            </p>
            <pre><code>{`\`\`\`mermaid
timeline
section Q4 2024
    Dec 24 : Project Start : Requirements : Design
section Q1 2025
    Jan 25 : Development : Testing
    Feb 25 : Beta Testing : Bug Fixes
    Mar 25 : Production Release
\`\`\``}</code></pre>
            <p><strong>Best for:</strong> Project roadmaps, historical timelines, milestone planning</p>

            <h3>📦 Block Diagram</h3>
            <p>
              Create structured block layouts with custom styling and connections.
            </p>
            <pre><code>{`\`\`\`mermaid
block-beta
    columns 3
    doc>"Document"]:3
    space down1<[" "]>(down) space
    block:e:3
        l["left"]
        m("Middle")
        r["right"]
    end
    db[("DB")]:3
\`\`\``}</code></pre>
            <p><strong>Best for:</strong> System architecture, component layouts, infrastructure diagrams</p>

            <h3>📈 Graph Diagram</h3>
            <p>
              Complex process flows with multiple paths and decision points.
            </p>
            <pre><code>{`\`\`\`mermaid
graph LR
    A[Start] --> B[Process]
    B --> C{Decision}
    C -->|Yes| D[Action 1]
    C -->|No| E[Action 2]
    D --> F[End]
    E --> F
\`\`\``}</code></pre>
            <p><strong>Best for:</strong> Complex workflows, system processes, logic flows</p>
          </div>

          <div className="guide-section">
            <h2>Tips for Creating Mermaid Diagrams</h2>
            <ul>
              <li><strong>Start with templates:</strong> Use the built-in templates and modify them</li>
              <li><strong>Keep it simple:</strong> Break complex diagrams into smaller, focused ones</li>
              <li><strong>Use meaningful labels:</strong> Clear node names improve readability</li>
              <li><strong>Test incrementally:</strong> Add nodes gradually and check the preview</li>
              <li><strong>Syntax matters:</strong> Mermaid is sensitive to indentation and spacing</li>
              <li><strong>Add styling:</strong> Use style commands to customize colors and appearance</li>
            </ul>
          </div>

          <div className="guide-section">
            <h2>Common Syntax Elements</h2>
            
            <h3>Node Shapes</h3>
            <ul>
              <li><code>[Square brackets]</code> - Rectangle</li>
              <li><code>(Round brackets)</code> - Rounded rectangle</li>
              <li><code>&#123;Curly braces&#125;</code> - Diamond (decision)</li>
              <li><code>((Double round))</code> - Circle</li>
              <li><code>[("Database")]</code> - Cylinder</li>
            </ul>

            <h3>Arrows and Connections</h3>
            <ul>
              <li><code>--&gt;</code> - Arrow</li>
              <li><code>---</code> - Line</li>
              <li><code>-.-&gt;</code> - Dotted arrow</li>
              <li><code>==&gt;</code> - Thick arrow</li>
              <li><code>--&gt;|Label|</code> - Labeled arrow</li>
            </ul>
          </div>

          <div className="guide-section">
            <h2>Learn More</h2>
            <p>
              For complete Mermaid documentation and advanced features, visit the 
              <a href="https://mermaid.js.org/" target="_blank" rel="noopener noreferrer"> official Mermaid documentation</a>.
            </p>
          </div>

          <div className="doc-nav">
            <Link to="/docs" className="btn btn-outline">← Back to Documentation</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
