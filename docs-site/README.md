# EasyEdit GitHub Pages Site

This is the official documentation and landing page for EasyEdit, built with Vite + React + TypeScript.

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Development

1. **Navigate to the docs-site directory:**
   ```bash
   cd docs-site
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
docs-site/
├── src/
│   ├── components/
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Footer.tsx          # Site footer
│   │   └── Layout.tsx          # Main layout wrapper
│   ├── pages/
│   │   ├── Home.tsx            # Landing page
│   │   ├── Features.tsx        # Features showcase
│   │   ├── Download.tsx        # Download page
│   │   ├── Docs.tsx            # Documentation hub
│   │   └── docs/
│   │       ├── UMLQuickStart.tsx
│   │       ├── UMLExamples.tsx
│   │       └── NomnomlGuide.tsx
│   ├── App.tsx                 # Main app with routing
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── public/                     # Static assets
├── index.html                  # HTML template
├── vite.config.ts             # Vite configuration
└── package.json               # Dependencies
```

## 🎨 Pages

- **Home (`/`)** - Landing page with hero section, feature highlights, and CTA
- **Features (`/features`)** - Detailed feature descriptions
- **Download (`/download`)** - Download options and installation instructions
- **Docs (`/docs`)** - Documentation hub
  - **UML Quick Start** - Getting started with UML diagrams
  - **UML Examples** - Real-world diagram examples
  - **Nomnoml Guide** - Complete Nomnoml syntax guide

## 🔧 Technologies

- **Vite** - Fast build tool and dev server
- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **React Markdown** - Markdown rendering with GFM support

## 🚢 Deployment

### GitHub Pages (Automatic)

The site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch in the `docs-site/` directory.

The workflow is defined in `.github/workflows/gh-pages.yml`

### Manual Deployment

1. Build the site:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` directory to your hosting provider

## 📝 Adding Content

### Adding a New Page

1. Create a new component in `src/pages/`:
   ```tsx
   // src/pages/NewPage.tsx
   export default function NewPage() {
     return (
       <div>
         <h1>New Page</h1>
       </div>
     )
   }
   ```

2. Add the route in `src/App.tsx`:
   ```tsx
   import NewPage from './pages/NewPage'
   
   // In the Routes component:
   <Route path="new-page" element={<NewPage />} />
   ```

3. Add navigation link in `src/components/Header.tsx` if needed

### Adding Documentation

1. Create a new component in `src/pages/docs/`:
   ```tsx
   import ReactMarkdown from 'react-markdown'
   import remarkGfm from 'remark-gfm'
   import '../DocsPage.css'
   
   const content = `# Your Documentation
   
   Content here...
   `
   
   export default function YourDoc() {
     return (
       <div className="docs-page-content">
         <div className="container">
           <div className="markdown-content">
             <ReactMarkdown remarkPlugins={[remarkGfm]}>
               {content}
             </ReactMarkdown>
           </div>
         </div>
       </div>
     )
   }
   ```

2. Add route in `src/App.tsx`
3. Add link in `src/pages/Docs.tsx`

## 🎨 Customization

### Colors

Edit CSS variables in `src/index.css`:

```css
:root {
  --primary-color: #4a90e2;
  --secondary-color: #50c878;
  /* ... other variables */
}
```

### Base URL

If deploying to a different repository, update `base` in `vite.config.ts`:

```ts
export default defineConfig({
  base: '/your-repo-name/',
  // ...
})
```

And update `basename` in `src/main.tsx`:

```tsx
<BrowserRouter basename="/your-repo-name">
```

## 🐛 Troubleshooting

### Routing Issues on GitHub Pages

If routes don't work after deployment:
1. Ensure `base` in `vite.config.ts` matches your repository name
2. Ensure `basename` in `src/main.tsx` matches
3. GitHub Pages serves from `/repo-name/` not root

### Build Errors

If you get TypeScript errors:
```bash
npm install --save-dev @types/react @types/react-dom
```

### Dependencies Not Installing

Delete `node_modules` and `package-lock.json`, then:
```bash
npm install
```

## 📄 License

This documentation site is part of the EasyEdit project and follows the same license.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📮 Support

- [GitHub Issues](https://github.com/gcclinux/EasyEdit/issues)
- [GitHub Discussions](https://github.com/gcclinux/EasyEdit/discussions)

---

Built with ❤️ using Vite + React + TypeScript
