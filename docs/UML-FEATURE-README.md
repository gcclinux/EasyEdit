# UML Diagram Support in EasyEdit

EasyEdit now supports UML (Unified Modeling Language) diagrams using PlantUML syntax!

## Overview

This feature allows you to create professional UML diagrams directly in your markdown documents. The diagrams are rendered in real-time in the preview panel, just like Mermaid diagrams.

## Supported UML Diagram Types

1. **Class Diagrams** - Show classes, attributes, methods, and relationships
2. **Sequence Diagrams** - Illustrate object interactions in a time sequence
3. **Use Case Diagrams** - Depict actors and their interactions with the system
4. **Activity Diagrams** - Show workflow and business process flows
5. **Component Diagrams** - Display system components and their dependencies
6. **State Diagrams** - Represent state machines and transitions

## How to Use

### Option 1: Using the UML Dropdown Menu

1. Click on the "UML ▾" button in the toolbar
2. Select the type of diagram you want to insert
3. A template will be inserted at your cursor position
4. Modify the template code to create your diagram

### Option 2: Manual Code Blocks

Create a code block with the `plantuml` language identifier:

\`\`\`plantuml
@startuml
' Your UML code here
@enduml
\`\`\`

## Example Syntax

### Class Diagram
\`\`\`plantuml
@startuml
class Vehicle {
  +String brand
  +int year
  +start()
  +stop()
}

class Car {
  +int doors
  +openTrunk()
}

class Motorcycle {
  +String type
}

Vehicle <|-- Car
Vehicle <|-- Motorcycle
@enduml
\`\`\`

### Sequence Diagram
\`\`\`plantuml
@startuml
User -> System: Login Request
System -> Database: Validate Credentials
Database --> System: Return Result
System --> User: Login Response
@enduml
\`\`\`

## Technical Details

### Implementation

- **Package**: `plantuml-encoder`
- **Rendering**: Diagrams are rendered using the PlantUML server API
- **Format**: SVG (with PNG fallback)
- **Preview**: Real-time rendering in the preview panel
- **Export**: UML diagrams are included when exporting to HTML

### Files Modified

1. **PreviewComponent.tsx** - Added PlantUML rendering logic
2. **insertUML.ts** - UML diagram insertion templates
3. **UMLDropdown.tsx** - Dropdown menu component
4. **App.tsx** - Integration with main application
5. **insertSave.ts** & **mainHandler.ts** - HTML export support

### How It Works

1. When you write PlantUML code in a markdown code block
2. The code is encoded using `plantuml-encoder`
3. An image URL is generated pointing to the PlantUML server
4. The diagram is displayed as an embedded image in the preview
5. On HTML export, the diagrams are embedded as images

## PlantUML Syntax Reference

### Basic Elements

- `@startuml` / `@enduml` - Start and end markers
- `+` - Public visibility
- `-` - Private visibility
- `#` - Protected visibility
- `~` - Package visibility

### Relationships

- `<|--` - Extension/Inheritance
- `*--` - Composition
- `o--` - Aggregation
- `-->` - Association
- `..>` - Dependency
- `..|>` - Realization

### Colors and Styling

\`\`\`plantuml
@startuml
class MyClass {
  +method()
}

class MyClass #lightblue
MyClass : attribute
@enduml
\`\`\`

## Resources

- [PlantUML Official Documentation](https://plantuml.com/)
- [PlantUML Class Diagram Guide](https://plantuml.com/class-diagram)
- [PlantUML Sequence Diagram Guide](https://plantuml.com/sequence-diagram)
- [PlantUML Activity Diagram Guide](https://plantuml.com/activity-diagram-beta)

## Tips

1. **Start Simple** - Use the dropdown templates as starting points
2. **Test Incrementally** - Build your diagram step by step
3. **Use Comments** - Add `'` at the start of a line for comments
4. **Check Syntax** - PlantUML has strict syntax requirements
5. **Preview Live** - The diagram updates as you type

## Troubleshooting

### Diagram Not Showing
- Check that your code block starts with \`\`\`plantuml
- Ensure you have `@startuml` and `@enduml` markers
- Verify your syntax is correct

### Slow Loading
- Large diagrams may take longer to render
- The diagram is fetched from plantUML.com server
- Check your internet connection

### Export Issues
- When exporting to HTML, diagrams are embedded as images
- Ensure you have an internet connection during export
- The export process fetches images from the PlantUML server

## Future Enhancements

Potential improvements for future versions:

- [ ] Local PlantUML server option
- [ ] Diagram caching for faster loading
- [ ] More diagram types (Deployment, Object, etc.)
- [ ] Syntax highlighting in code editor
- [ ] Offline mode support
- [ ] Custom PlantUML server URL configuration

---

**Note**: UML diagrams require an internet connection as they are rendered using the PlantUML public server at plantUML.com.
