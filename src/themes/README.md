# EasyEdit Themes

This folder contains color theme files for EasyEdit. Themes control all color-related styling throughout the application.

## Current Themes

- **default.css** - The default dark theme with purple/gray gradients

## How to Use a Theme

The active theme is imported in `src/main.tsx`:

```typescript
import './themes/default.css';
```

To switch themes, simply change the import to point to a different theme file.

## Creating a New Theme

1. Copy `default.css` to a new file (e.g., `blue-theme.css`)
2. Modify the CSS variables in the `:root` section
3. Update the import in `src/main.tsx` to use your new theme

## Theme Variables Reference

### Primary Colors
- `--color-primary` - Main background color
- `--color-primary-light` - Lighter variant
- `--color-primary-dark` - Darker variant
- `--color-primary-darker` - Darkest variant
- `--color-primary-border` - Border color for primary elements

### Text Colors
- `--color-text-primary` - Main text color
- `--color-text-secondary` - Secondary text color
- `--color-text-muted` - Muted/disabled text
- `--color-text-light` - Light text for descriptions
- `--color-text-dark` - Dark text (for light backgrounds)
- `--color-text-code` - Code block text color

### Background Colors
- `--bg-root` - Root application background
- `--bg-editor` - Editor textarea background
- `--bg-preview` - Preview panel background
- `--bg-modal` - Modal dialog background
- `--bg-modal-overlay` - Modal overlay (semi-transparent)
- `--bg-dropdown` - Dropdown menu background
- `--bg-dropdown-hover` - Dropdown hover state
- `--bg-code-block` - Code block background
- `--bg-table-header` - Table header background
- `--bg-input` - Input field background
- `--bg-card` - Card/panel background
- `--bg-help-button` - Help button background

### Border Colors
- `--border-primary` - Primary border color
- `--border-secondary` - Secondary border color
- `--border-dark` - Dark borders
- `--border-input` - Input field borders
- `--border-card` - Card borders
- `--border-card-light` - Light card borders
- `--border-help` - Help button border

### Button Gradients & Colors

#### Menu Buttons (Gray Gradient)
- `--btn-menu-gradient-start` - Menu button gradient start
- `--btn-menu-gradient-end` - Menu button gradient end
- `--btn-menu-hover-gradient-start` - Menu button hover gradient start
- `--btn-menu-hover-gradient-end` - Menu button hover gradient end

#### Mermaid Button (Purple Gradient)
- `--btn-mermaid-gradient-start` - Mermaid button gradient start
- `--btn-mermaid-gradient-end` - Mermaid button gradient end
- `--btn-mermaid-hover-gradient-start` - Mermaid button hover gradient start
- `--btn-mermaid-hover-gradient-end` - Mermaid button hover gradient end

#### Standard Buttons
- `--btn-standard` - Standard button color
- `--btn-standard-hover` - Standard button hover
- `--btn-auto` - Auto generator button
- `--btn-html` - HTML button
- `--btn-format` - Format button
- `--btn-primary` - Primary action button
- `--btn-primary-modal` - Primary modal button
- `--btn-cancel` - Cancel button
- `--btn-submit` - Submit button

#### Help Button
- `--btn-help-bg` - Help button background
- `--btn-help-text` - Help button text
- `--btn-help-border` - Help button border

### Link Colors
- `--link-color` - Link color
- `--link-hover` - Link hover color
- `--link-hover-light` - Link hover (light mode)

### Shadow Colors
- `--shadow-sm` - Small shadow
- `--shadow-md` - Medium shadow
- `--shadow-lg` - Large shadow
- `--shadow-xl` - Extra large shadow
- `--shadow-mermaid` - Mermaid button shadow

### Other
- `--separator-gradient-start` - Separator gradient start
- `--separator-gradient-end` - Separator gradient end
- `--context-menu-bg` - Context menu background
- `--context-menu-border` - Context menu border
- `--context-menu-hover` - Context menu hover
- `--context-menu-shadow` - Context menu shadow
- `--focus-ring` - Focus ring color
- `--focus-border` - Focus border color

## Example: Creating a Blue Theme

```css
:root {
  /* Change primary colors to blue tones */
  --color-primary: #1a2332;
  --color-primary-light: #2a3342;
  --color-primary-dark: #0a1322;
  
  /* Change button gradients to blue */
  --btn-mermaid-gradient-start: #4a90e2;
  --btn-mermaid-gradient-end: #2e5c8a;
  --btn-mermaid-hover-gradient-start: #2e5c8a;
  --btn-mermaid-hover-gradient-end: #4a90e2;
  
  /* Keep other variables as needed */
}
```

## Notes

- Only color-related properties are in theme files
- Layout, spacing, and sizing remain in component CSS files
- Light mode overrides are included at the bottom of theme files
- All theme variables use CSS custom properties (CSS variables)
