import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import '../DocsPage.css'

const content = `# Nomnoml Guide - Offline UML Support

## What is Nomnoml?

Nomnoml is a **lightweight, offline JavaScript library** for creating UML diagrams. Unlike PlantUML which requires a server or Java runtime, Nomnoml renders diagrams instantly in your browser with zero dependencies.

## Why Nomnoml?

✅ **100% Offline** - No internet connection required  
✅ **Lightweight** - Pure JavaScript, ~20KB  
✅ **Fast** - Renders instantly in the browser  
✅ **No Dependencies** - No Java, no external servers  
✅ **SVG Output** - Clean, scalable vector graphics  

## Basic Syntax

### Structure

Every Nomnoml diagram uses this basic structure:

\`\`\`
\`\`\`plantuml
#title: Diagram Title
#direction: down

[Component A]
[Component B]
[Component A] -> [Component B]
\`\`\`

### Directives

Directives customize the diagram appearance:

- \`#title: Your Title\` - Sets diagram title
- \`#direction: down|right|left|up\` - Layout direction
- \`#fontSize: 12\` - Font size
- \`#leading: 1.25\` - Line height
- \`#lineWidth: 3\` - Line thickness
- \`#padding: 8\` - Box padding
- \`#spacing: 40\` - Element spacing
- \`#stroke: #33322E\` - Line color
- \`#fill: #eee8d5\` - Background color
- \`#arrowSize: 1\` - Arrow size (0.5 to 2)
- \`#bendSize: 0.3\` - Curve radius

## Class Diagrams

### Basic Class

\`\`\`
\`\`\`plantuml
[ClassName|
  attribute1: type;
  attribute2: type|
  method1();
  method2()
]
\`\`\`

### Relationships

- \`[A] -> [B]\` - Association
- \`[A] <:- [B]\` - Inheritance (B inherits from A)
- \`[A] <-> [B]\` - Bidirectional
- \`[A] o-> [B]\` - Aggregation
- \`[A] o-o [B]\` - Composition

### Example
\`\`\`
\`\`\`plantuml
#title: Class Relationships

[Vehicle|
  speed: number|
  move()
]

[Car|
  doors: int|
  drive()
]

[Bike|
  gears: int|
  pedal()
]

[Vehicle] <:- [Car]
[Vehicle] <:- [Bike]
\`\`\`

## Sequence Diagrams
\`\`\`
\`\`\`plantuml
#title: Message Flow
#direction: right

[User] -> [Browser]
[Browser] -> [Server]
[Server] -> [Database]
[Database] --> [Server]
[Server] --> [Browser]
[Browser] --> [User]
\`\`\`

**Arrow Types:**
- \`->\` - Solid arrow (request)
- \`-->\` - Dashed arrow (response)
- \`<->\` - Bidirectional

## Visual Types

Nomnoml supports special visual representations:

- \`[<actor> Name]\` - Stick figure (for actors/users)
- \`[<usecase> Name]\` - Oval (for use cases)
- \`[<package> Name]\` - Package/container
- \`[<database> Name]\` - Database cylinder
- \`[<start> Name]\` - Start circle (state diagrams)
- \`[<end> Name]\` - End circle (state diagrams)
- \`[<choice> Name]\` - Decision diamond
- \`[<frame> Name]\` - Frame/boundary

### Example with Visual Types
\`\`\`
\`\`\`plantuml
#title: System Overview

[<actor> User]
[<database> PostgreSQL]
[<package> Application|
  [Web Server]
  [API]
]

[User] -> [Web Server]
[Web Server] -> [API]
[API] -> [PostgreSQL]
\`\`\`

## Component Diagrams
\`\`\`
\`\`\`plantuml
#title: Microservices Architecture
#direction: right

[<package> Frontend|
  [React App]
  [Components]
  [State Management]
]

[<package> Backend|
  [API Gateway]
  [Auth Service]
  [Data Service]
]

[<database> Database|
  [PostgreSQL]
  [Redis Cache]
]

[React App] -> [Components]
[React App] --> [API Gateway]
[API Gateway] -> [Auth Service]
[API Gateway] -> [Data Service]
[Data Service] -> [PostgreSQL]
[Data Service] -> [Redis Cache]
\`\`\`

## Activity/State Diagrams
\`\`\`
\`\`\`plantuml
#title: Order Processing
#direction: down

[<start> Start] -> [Receive Order]
[Receive Order] -> [<choice> Valid?]
[Valid?] yes -> [Process Payment]
[Valid?] no -> [Reject Order]
[Process Payment] -> [<choice> Success?]
[Success?] yes -> [Ship Order]
[Success?] no -> [Refund]
[Ship Order] -> [<end> Complete]
[Reject Order] -> [<end> Complete]
[Refund] -> [<end> Complete]
\`\`\`

## Nested Containers

You can nest components within packages:
\`\`\`
\`\`\`plantuml
#title: Layered Architecture

[<package> Presentation Layer|
  [<package> Web|
    [Controllers]
    [Views]
  ]
  [<package> Mobile|
    [API Client]
    [UI]
  ]
]

[<package> Business Layer|
  [Services]
  [Business Logic]
]

[<package> Data Layer|
  [<database> Database]
  [Repositories]
]

[Controllers] -> [Services]
[API Client] -> [Services]
[Services] -> [Business Logic]
[Business Logic] -> [Repositories]
[Repositories] -> [Database]
\`\`\`

## Styling Tips

### Custom Colors
\`\`\`
\`\`\`plantuml
#stroke: #4488ff
#fill: #fff8dc
#fontSize: 14

[Styled Component]
\`\`\`

### Better Layouts
\`\`\`
\`\`\`plantuml
#direction: right
#spacing: 60
#padding: 16

[Component A] -> [Component B]
\`\`\`

## Common Patterns

### MVC Pattern
\`\`\`
\`\`\`plantuml
#title: MVC Architecture
#direction: down

[Model|
  data: object|
  update();
  notify()
]

[View|
  elements: array|
  render();
  update()
]

[Controller|
  handle();
  route()
]

[Controller] -> [Model]
[Controller] -> [View]
[Model] --> [View]
\`\`\`

### Database Schema
\`\`\`
\`\`\`plantuml
#title: Database Relationships

[Users|
  id: int;
  username: string;
  email: string
]

[Posts|
  id: int;
  user_id: int;
  title: string;
  content: text
]

[Comments|
  id: int;
  post_id: int;
  user_id: int;
  comment: text
]

[Users] o-> [Posts]
[Users] o-> [Comments]
[Posts] o-> [Comments]
\`\`\`

## Best Practices

1. **Use Titles**: Always add \`#title:\` for context
2. **Set Direction**: Choose the best layout direction
3. **Keep it Simple**: Don't overcrowd diagrams
4. **Use Visual Types**: Makes diagrams more intuitive
5. **Consistent Spacing**: Use directives for uniform look
6. **Compartments**: Use pipe \`|\` to organize class members
7. **Meaningful Names**: Clear, descriptive component names

## Troubleshooting

### Diagram Not Rendering?
- Check code fence uses \`plantuml\` language
- Verify all brackets are closed
- Check arrow syntax is correct

### Layout Issues?
- Try different \`#direction:\` values
- Adjust \`#spacing:\` for more room
- Use nested packages to organize

### Arrows Not Connecting?
- Ensure component names match exactly
- Check for typos in names
- Verify arrow syntax (\`->\`, \`<->\`, etc.)

## Resources

- [Nomnoml Official Site](https://nomnoml.com/)
- [Try Nomnoml Online](https://nomnoml.com/)
- [GitHub Repository](https://github.com/skanaar/nomnoml)
- [Syntax Reference](https://github.com/skanaar/nomnoml#directives)

---

**Enjoy creating beautiful UML diagrams offline!** 🎉
`

export default function NomnomlGuide() {
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
