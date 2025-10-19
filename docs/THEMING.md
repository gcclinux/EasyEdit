# EasyEdit Theming System

## Overview

EasyEdit now includes a comprehensive theming system that allows you to customize all colors throughout the application. All color-related styles have been extracted into theme files located in `src/themes/`.

## Quick Start

### Using a Different Theme

1. Open `src/main.tsx`
2. Change the theme import line:
   ```typescript
   // Change from:
   import './themes/default.css';
   
   // To:
   import './themes/ocean-blue.css';
   ```
3. Restart the development server or rebuild the app

### Available Themes

- **default.css** - Original dark theme with purple/gray gradients
- **ocean-blue.css** - Cool blue-themed color scheme

## Creating Your Own Theme

1. **Copy an existing theme:**
   ```bash
   cp src/themes/default.css src/themes/my-theme.css
   ```

2. **Edit the CSS variables** in your new theme file. All color values are defined in the `:root` section.

3. **Update the import** in `src/main.tsx`:
   ```typescript
   import './themes/my-theme.css';
   ```

## Theme Structure

All themes use CSS custom properties (variables) organized into categories:

### Color Categories

- **Primary Colors** - Main application backgrounds and borders
- **Text Colors** - All text throughout the app
- **Background Colors** - Specific component backgrounds (editor, modals, dropdowns, etc.)
- **Border Colors** - All border colors
- **Button Colors** - Gradients and solid colors for all button types
- **Link Colors** - Hyperlink colors and hover states
- **Shadow Colors** - Box shadow colors with various opacities
- **Context Menu** - Right-click menu colors
- **Focus States** - Focus ring and border colors

### Key Variables to Customize

For a quick theme change, focus on these main variables:

```css
:root {
  /* Main backgrounds */
  --color-primary: #242424;
  --bg-editor: #000000;
  
  /* Main text */
  --color-text-primary: #ffffff;
  
  /* Button gradients */
  --btn-menu-gradient-start: #374151;
  --btn-menu-gradient-end: #1f2937;
  --btn-mermaid-gradient-start: #667eea;
  --btn-mermaid-gradient-end: #764ba2;
  
  /* Borders */
  --border-primary: #ccc;
}
```

## What's Themed

The theming system covers:

- ✅ All button colors and gradients
- ✅ Editor and preview panel backgrounds
- ✅ Text colors throughout the app
- ✅ Modal dialogs and overlays
- ✅ Dropdown menus
- ✅ Code blocks and inline code
- ✅ Tables and borders
- ✅ Input fields
- ✅ Context menus
- ✅ Shadows and focus states

## What's NOT Themed

The following remain in component CSS files:

- ❌ Layout and positioning
- ❌ Spacing (padding, margins)
- ❌ Font sizes and families
- ❌ Border radius and widths
- ❌ Transitions and animations

## Example: Creating a Green Theme

```css
/* src/themes/forest-green.css */
:root {
  --color-primary: #1a2e1a;
  --bg-editor: #0a150a;
  --color-text-primary: #e8f8e8;
  
  --btn-menu-gradient-start: #2e5c2e;
  --btn-menu-gradient-end: #1a3a1a;
  --btn-mermaid-gradient-start: #4a9e4a;
  --btn-mermaid-gradient-end: #2e6c2e;
  
  --border-primary: #4a9e4a;
  /* ... other variables ... */
}
```

## Tips for Theme Creation

1. **Start with an existing theme** - Copy `default.css` or `ocean-blue.css` as a starting point
2. **Use a color palette generator** - Tools like coolors.co can help create harmonious color schemes
3. **Test contrast** - Ensure text is readable against backgrounds (use tools like WebAIM Contrast Checker)
4. **Consider gradients** - Button gradients should have related colors for smooth transitions
5. **Test both modes** - Include light mode overrides if needed
6. **Use opacity for shadows** - rgba() values work best for shadows and overlays

## File Structure

```
src/
├── themes/
│   ├── README.md           # Detailed theme documentation
│   ├── default.css         # Default dark theme
│   └── ocean-blue.css      # Example blue theme
├── main.tsx                # Theme import location
├── App.css                 # Uses theme variables
├── index.css               # Uses theme variables
└── components/
    └── *.css               # All use theme variables
```

## Contributing Themes

If you create a theme you'd like to share:

1. Place it in `src/themes/`
2. Follow the naming convention: `theme-name.css`
3. Include all required CSS variables
4. Test thoroughly in both light and dark modes
5. Submit a pull request with your theme

## Troubleshooting

**Theme not applying:**
- Ensure the import in `main.tsx` is correct
- Restart the development server
- Clear browser cache

**Colors look wrong:**
- Check that all CSS variables are defined
- Verify variable names match exactly (case-sensitive)
- Look for typos in color values

**Some elements not themed:**
- Check if the element uses hardcoded colors in its CSS
- Report missing theme variables as an issue

## Documentation

For a complete list of all theme variables and their purposes, see `src/themes/README.md`.

## Version

Theme system added in EasyEdit v1.x
