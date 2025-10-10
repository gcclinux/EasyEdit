# Quick Reference - GitHub Pages Site

## 🚀 Quick Commands

```bash
# Navigate to site directory
cd docs-site

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
# → Opens at http://localhost:5173/EasyEdit/

# Build for production
npm run build
# → Creates dist/ folder

# Preview production build
npm run preview
```

## 📁 Key Files to Edit

| File | Purpose |
|------|---------|
| `src/pages/Home.tsx` | Landing page content |
| `src/pages/Features.tsx` | Features descriptions |
| `src/pages/Download.tsx` | Download links & version |
| `src/pages/Docs.tsx` | Documentation hub |
| `src/components/Header.tsx` | Navigation menu |
| `src/components/Footer.tsx` | Footer content |
| `src/index.css` | Colors & global styles |
| `vite.config.ts` | Base URL configuration |

## 🎨 Quick Customizations

### Change Colors
Edit `src/index.css`:
```css
:root {
  --primary-color: #4a90e2;
  --secondary-color: #50c878;
}
```

### Update Version
Edit `src/pages/Download.tsx`:
```tsx
<h2>Latest Version: 1.4.2</h2>
```

### Change Repository Name
If you rename the repo, update:
1. `vite.config.ts` → `base: '/new-name/'`
2. `src/main.tsx` → `basename="/new-name"`
3. `.github/workflows/gh-pages.yml` (if needed)

### Add Navigation Link
Edit `src/components/Header.tsx`:
```tsx
<li><Link to="/new-page">New Page</Link></li>
```

## 🌐 Deployment Checklist

- [ ] Enable GitHub Pages in repo settings
- [ ] Set Source to "GitHub Actions"
- [ ] Push code to main branch
- [ ] Wait for workflow to complete
- [ ] Visit `https://gcclinux.github.io/EasyEdit/`

## 📝 Adding New Pages

1. **Create component:**
   ```tsx
   // src/pages/NewPage.tsx
   export default function NewPage() {
     return <div><h1>New Page</h1></div>
   }
   ```

2. **Add route in App.tsx:**
   ```tsx
   import NewPage from './pages/NewPage'
   // ...
   <Route path="new-page" element={<NewPage />} />
   ```

3. **Add navigation link in Header.tsx**

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5173 in use | Run `npm run dev -- --port 3000` |
| 404 on GitHub Pages | Check base URL matches repo name |
| Routing doesn't work | Ensure BrowserRouter basename is correct |
| Changes not showing | Hard refresh (Ctrl+Shift+R) |
| Build fails | Delete node_modules, run `npm install` |

## 📦 Project Stats

- **Framework:** React 18 + Vite 5
- **Language:** TypeScript
- **Routing:** React Router 6
- **Bundle Size:** ~150KB (optimized)
- **Pages:** 5 main + 3 docs = 8 total
- **Components:** Header, Footer, Layout
- **Dependencies:** 6 runtime, 4 dev

## 🔗 Important URLs

- **Local Dev:** http://localhost:5173/EasyEdit/
- **Production:** https://gcclinux.github.io/EasyEdit/
- **GitHub Repo:** https://github.com/gcclinux/EasyEdit
- **Workflow:** .github/workflows/gh-pages.yml

## 📚 Documentation

- Full docs: `docs-site/README.md`
- Setup guide: `docs-site/SETUP.md`
- This reference: `docs-site/QUICK-REFERENCE.md`

---

**Tip:** Keep this file bookmarked for quick access to common tasks!
