import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import '../DocsPage.css'

const content = `# UML Diagram Examples

This document demonstrates various UML diagram types using Nomnoml (offline rendering).

## Class Diagram Example

\`\`\`plantuml
#title: Animal Class Hierarchy
#direction: down

[Animal|
  age: int;
  gender: string|
  isMammal();
  mate()
]

[Duck|
  beakColor: string|
  swim();
  quack()
]

[Fish|
  sizeInFeet: int|
  canEat()
]

[Zebra|
  is_wild: bool|
  run()
]

[Animal] <:- [Duck]
[Animal] <:- [Fish]
[Animal] <:- [Zebra]
\`\`\`

## Sequence Diagram Example

\`\`\`plantuml
#title: Web Request Flow
#direction: right

[User] -> [Browser]
[Browser] -> [Server]
[Server] -> [Database]
[Database] --> [Server]
[Server] --> [Browser]
[Browser] --> [User]
\`\`\`

## Use Case Diagram Example

\`\`\`plantuml
#title: Application Use Cases
#direction: right

[<actor> User]
[<actor> Admin]

[User] - [Login]
[User] - [View Dashboard]
[User] - [Edit Profile]

[Admin] - [Manage Users]
[Admin] - [View Reports]
[Admin] - [System Settings]

[Manage Users] --> [Login]
[View Reports] --> [Login]
\`\`\`

## Activity Diagram Example

\`\`\`plantuml
#title: User Login Activity
#direction: down

[<start> Start] -> [User Login]
[User Login] -> [<choice> Valid?]
[Valid?] yes -> [Load Dashboard]
[Valid?] no -> [Show Error]
[Load Dashboard] -> [Display Data]
[Display Data] -> [User Action]
[User Action] -> [<choice> Success?]
[Success?] yes -> [Update DB]
[Success?] no -> [Show Error]
[Update DB] -> [<end> End]
[Show Error] -> [<end> End]
\`\`\`

## Component Diagram Example

\`\`\`plantuml
#title: System Architecture
#direction: right

[<package> Frontend|
  [React App]
  [UI Components]
]

[<package> Backend|
  [API Server]
  [Business Logic]
]

[<database> Database|
  [PostgreSQL]
]

[React App] -> [UI Components]
[React App] --> [API Server]
[API Server] -> [Business Logic]
[Business Logic] -> [PostgreSQL]
\`\`\`

## State Diagram Example

\`\`\`plantuml
#title: Process State Machine
#direction: right

[<start> Start] -> [Idle]
[Idle] -> [Processing]
[Processing] -> [Idle]
[Processing] -> [Completed]
[Processing] -> [Error]
[Error] -> [Processing]
[Error] -> [Idle]
[Completed] -> [<end> End]
\`\`\`

## Real-World Example: E-Commerce System

\`\`\`plantuml
#title: E-Commerce Class Structure
#direction: down

[Customer|
  id: string;
  name: string;
  email: string|
  register();
  login();
  placeOrder()
]

[Order|
  orderId: string;
  date: Date;
  total: number|
  addItem();
  removeItem();
  checkout()
]

[Product|
  productId: string;
  name: string;
  price: number;
  stock: int|
  updatePrice();
  checkStock()
]

[ShoppingCart|
  items: array|
  addProduct();
  removeProduct();
  calculateTotal()
]

[Customer] -> [ShoppingCart]
[Customer] -> [Order]
[ShoppingCart] -> [Product]
[Order] o-> [Product]
\`\`\`

---

**Note:** These UML diagrams are rendered using Nomnoml - a lightweight, offline JavaScript library. No internet connection required!
`

export default function UMLExamples() {
  return (
    <div className="docs-page-content">
      <div className="container">
        <div className="markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
