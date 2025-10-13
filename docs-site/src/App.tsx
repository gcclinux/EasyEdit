import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import Features from './pages/Features'
import Download from './pages/Download'
import Docs from './pages/Docs'
import ProjectSummary from './pages/docs/ProjectSummary'
import UMLQuickStart from './pages/docs/UMLQuickStart'
import UMLExamples from './pages/docs/UMLExamples'
import NomnomlGuide from './pages/docs/NomnomlGuide'
import TemplatesGuide from './pages/docs/TemplatesGuide'
import MermaidGuide from './pages/docs/MermaidGuide'

function App() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="features" element={<Features />} />
        <Route path="download" element={<Download />} />
        <Route path="docs" element={<Docs />} />
        <Route path="docs/project-summary" element={<ProjectSummary />} />
        <Route path="docs/uml-quick-start" element={<UMLQuickStart />} />
        <Route path="docs/uml-examples" element={<UMLExamples />} />
        <Route path="docs/nomnoml-guide" element={<NomnomlGuide />} />
        <Route path="docs/templates-guide" element={<TemplatesGuide />} />
        <Route path="docs/mermaid-guide" element={<MermaidGuide />} />
      </Route>
    </Routes>
  )
}

export default App
