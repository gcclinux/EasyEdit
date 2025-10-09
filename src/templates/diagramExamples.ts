export function buildDiagramExamplesTemplate(): string {
  return `
## Notes

- **Mermaid** diagrams are rendered with full interactive capabilities
- **PlantUML/Nomnoml** diagrams work offline and are lightweight
- Both diagram types can be exported in various formats
- Use the appropriate syntax based on your documentation needs

**Use Case Diagram (Mermaid Flowchart Style)**

\`\`\`mermaid
flowchart LR
    %% Define Use Cases (Circles/Ovals)
    subgraph System Functions
        A((Login))
        B((View Dashboard))
        C((Edit Profile))
        D((Manage Users))
        E((View Reports))
        F((System Settings))

    %% Define Actors (Square boxes)
    User[User]
    Admin[Admin]

    %% Actor-to-Use Case Associations
    User --- A
    User --- B
    User --- C

    Admin --- D
    Admin --- E
    Admin --- F

    %% Includes/Dependencies (Flow between Use Cases)
    D --> A
    E --> A
    end
\`\`\`
---
**Use Case Diagram (PlantUML/Nomnoml Style)**

\`\`\`plantuml
#title: Use Case Diagram Example
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
`;
}
