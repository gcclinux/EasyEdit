# Offline UML Support - Nomnoml Implementation

## What Changed?

We've switched from PlantUML (online-only) to **Nomnoml** (offline JavaScript library) for UML diagram rendering.

## Why Nomnoml?

✅ **100% Offline** - No internet connection required  
✅ **Lightweight** - Pure JavaScript, ~20KB (vs Java runtime + PlantUML JAR ~10MB+)  
✅ **Fast** - Renders instantly in the browser  
✅ **No Dependencies** - No Java, no external servers  
✅ **SVG Output** - Clean, scalable vector graphics  

## Nomnoml Syntax

Nomnoml uses a simpler, more concise syntax than PlantUML:

### Basic Structure

```plantuml
#title: Your Diagram Title
#direction: down|right|left|up

[Class Name]
[Class A] -> [Class B]
```

### Directives

- `#title: Title Text` - Sets diagram title
- `#direction: down` - Sets layout direction (down, right, up, left)
- `#arrowSize: 1` - Arrow size (0.5 to 2)
- `#bendSize: 0.3` - Curve radius
- `#fontSize: 12` - Font size
- `#leading: 1.25` - Line height
- `#lineWidth: 3` - Line thickness
- `#padding: 8` - Box padding
- `#spacing: 40` - Element spacing
- `#stroke: #33322E` - Line color
- `#fill: #eee8d5` - Background color

### Class Diagrams

```plantuml
#title: Class Diagram
#direction: down

[ClassName|
  attribute1: type;
  attribute2: type|
  method1();
  method2()
]
```

**Relationships:**
- `[A] -> [B]` - Association
- `[A] <:- [B]` - Inheritance (B inherits from A)
- `[A] <-> [B]` - Bidirectional
- `[A] o-> [B]` - Aggregation
- `[A] o-o [B]` - Composition

### Sequence Diagrams

```plantuml
#title: Sequence Flow
#direction: right

[User] -> [Browser]
[Browser] -> [Server]
[Server] --> [Browser]
[Browser] --> [User]
```

**Arrows:**
- `->` - Solid arrow
- `-->` - Dashed arrow
- `<->` - Bidirectional

### Use Case Diagrams

```plantuml
#title: Use Cases

[<actor> User]
[Login]
[View Profile]

[User] - [Login]
[User] - [View Profile]
```

**Visual Types:**
- `[<actor> Name]` - Stick figure
- `[<usecase> Name]` - Oval
- `[<package> Name]` - Package/container
- `[<database> Name]` - Database symbol
- `[<start> Name]` - Start circle
- `[<end> Name]` - End circle
- `[<choice> Name]` - Decision diamond
- `[<frame> Name]` - Frame/boundary

### Component Diagrams

```plantuml
#title: System Components

[<package> Frontend|
  [React App]
  [Components]
]

[<package> Backend|
  [API]
  [Logic]
]

[<database> DB|
  [PostgreSQL]
]

[React App] -> [Components]
[React App] --> [API]
[API] -> [Logic]
[Logic] -> [PostgreSQL]
```

### Activity/State Diagrams

```plantuml
#title: Process Flow
#direction: right

[<start> Start] -> [Init]
[Init] -> [<choice> Valid?]
[Valid?] yes -> [Process]
[Valid?] no -> [Error]
[Process] -> [<end> End]
[Error] -> [<end> End]
```

## Comparison: PlantUML vs Nomnoml

| Feature | PlantUML | Nomnoml |
|---------|----------|---------|
| **Offline** | ❌ Requires server or Java | ✅ Pure JavaScript |
| **Size** | 10MB+ (with Java) | ~20KB |
| **Speed** | Slower (server call or JVM) | Instant |
| **Syntax** | Complex, verbose | Simple, concise |
| **Diagrams** | 20+ types | Core UML types |
| **Customization** | Extensive | Moderate |
| **Best For** | Complex enterprise UML | Quick, clean diagrams |

## Migration Guide

### PlantUML to Nomnoml Conversion

#### Class Diagram

**PlantUML:**
```
@startuml
class Animal {
  +int age
  +isMammal()
}
Animal <|-- Duck
@enduml
```

**Nomnoml:**
```
[Animal|
  age: int|
  isMammal()
]
[Animal] <:- [Duck]
```

#### Sequence Diagram

**PlantUML:**
```
@startuml
User -> Server: Request
Server --> User: Response
@enduml
```

**Nomnoml:**
```
[User] -> [Server]
[Server] --> [User]
```

## Advanced Features

### Nested Containers

```plantuml
[<package> Outer|
  [<package> Inner|
    [Component A]
    [Component B]
  ]
  [Component C]
]
```

### Custom Styles

```plantuml
#stroke: #4488ff
#fill: #fff8dc
#fontSize: 14
#padding: 16

[Styled Component]
```

### Multiple Compartments

```plantuml
[ClassName|
  Properties|
  Methods|
  Events
]
```

## Tips for Better Diagrams

1. **Use Titles**: Always add `#title:` for context
2. **Set Direction**: Choose layout direction for clarity
3. **Keep it Simple**: Don't overcrowd diagrams
4. **Use Visual Types**: `<actor>`, `<database>`, etc. for clarity
5. **Consistent Spacing**: Use `#spacing:` for uniform look
6. **Color Coding**: Use `#stroke:` and `#fill:` for emphasis

## Resources

- [Nomnoml Official Site](https://nomnoml.com/)
- [Nomnoml GitHub](https://github.com/skanaar/nomnoml)
- [Try Nomnoml Online](https://nomnoml.com/)
- [Syntax Reference](https://github.com/skanaar/nomnoml#directives)

## Examples in EasyEditor

See `UML-Examples.md` for working examples of all diagram types!

---

**Bottom Line**: Nomnoml gives you 90% of PlantUML's functionality with 1% of the complexity and size - perfect for an offline Electron app! 🎉
