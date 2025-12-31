import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import '../DocsPage.css'

const content = `# Quick Start: UML Diagrams in EasyEditor

## Using the UML Feature

### Step 1: Find the UML Button
Look for the toolbar button labeled **"UML ▾"** - it's located right after the "Mermaid ▾" button.

### Step 2: Select a Diagram Type
Click the UML button to see these options:
- **Class Diagram** - Object-oriented class structures
- **Sequence Diagram** - Message flows between objects
- **Use Case Diagram** - Actor-system interactions
- **Activity Diagram** - Workflow and processes
- **Component Diagram** - System architecture
- **State Diagram** - State machines

### Step 3: Edit the Template
A code template will be inserted. It looks like this:

\`\`\`plantuml
#title: Animal Class
[Animal|
  age: int;
  gender: string|
  isMammal();
  mate()
]
\`\`\`

### Step 4: See It Rendered
The diagram appears instantly in the preview panel!

## Simple Examples

### Quick Class Diagram
\`\`\`plantuml
[User|
  username: String;
  email: String|
  login();
  logout()
]
\`\`\`

### Quick Sequence Diagram
\`\`\`plantuml
#direction: right
[User] -> [System]
[System] -> [Database]
[Database] --> [System]
[System] --> [User]
\`\`\`

### Quick Activity Flow
\`\`\`plantuml
#direction: down
[<start> Start] -> [Receive Request]
[Receive Request] -> [<choice> Valid?]
[Valid?] yes -> [Process]
[Valid?] no -> [Send Error]
[Process] -> [Send Response]
[Send Response] -> [<end> End]
[Send Error] -> [<end> End]
\`\`\`

## Pro Tips

1. **Always include** the code fence with \`plantuml\` language identifier
2. **Use directives** like \`#title:\` and \`#direction:\`
3. **Preview updates** automatically as you type
4. **Export works** - diagrams are included in exports
5. **100% Offline** - No internet connection required!

## Common Syntax

### Relationships
- \`->\` Association
- \`<:-\` Inheritance
- \`<->\` Bidirectional
- \`o->\` Aggregation
- \`o-o\` Composition

### Visual Types
- \`[<actor> Name]\` - Actor (stick figure)
- \`[<database> Name]\` - Database
- \`[<start> Name]\` - Start node
- \`[<end> Name]\` - End node
- \`[<choice> Name]\` - Decision diamond
- \`[<package> Name]\` - Package/container

### Directives
- \`#title: Your Title\` - Set diagram title
- \`#direction: down\` - Layout direction (down, right, left, up)
- \`#fontSize: 12\` - Font size
- \`#stroke: #33322E\` - Line color
- \`#fill: #eee8d5\` - Background color

## Troubleshooting

**Diagram not showing?**
- Check you have the code fence with \`plantuml\` language
- Verify the syntax is correct
- Make sure you're in the preview panel

**Syntax error?**
- Nomnoml syntax is strict about formatting
- Check for missing brackets or arrows
- Try simplifying to find the error

**Layout issues?**
- Try changing \`#direction:\` (down, right, left, up)
- Adjust \`#spacing:\` to spread elements
- Use \`#padding:\` for box sizing

---

That's it! You're ready to create professional UML diagrams in your markdown documents. 🎉
`

import { Link } from 'react-router-dom'

export default function UMLQuickStart() {
  return (
    <div className="docs-page-content">
      <div className="container">
        <div className="markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
        <div className="doc-nav">
          <Link to="/docs" className="btn btn-outline">← Back to Documentation</Link>
        </div>
      </div>
    </div>
  )
}
