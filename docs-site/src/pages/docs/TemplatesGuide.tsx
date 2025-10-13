import { Link } from 'react-router-dom'

export default function TemplatesGuide() {
  return (
    <div className="docs-page">
      <section className="page-header">
        <div className="container">
          <h1>Using Templates</h1>
          <p>Quick-start your documents with pre-built templates</p>
        </div>
      </section>

      <section className="docs-content">
        <div className="container">
          <div className="guide-section">
            <h2>What are Templates?</h2>
            <p>
              EasyEdit provides ready-to-use templates that help you quickly create structured documents. 
              Templates include pre-formatted sections, headers, and placeholders to guide your content creation.
            </p>
          </div>

          <div className="guide-section">
            <h2>How to Use Templates</h2>
            <ol>
              <li>Click the <strong>Templates ▾</strong> button in the top menu bar</li>
              <li>Browse through the available template options</li>
              <li>Click on a template to insert it into your editor</li>
              <li>Replace the placeholder text with your own content</li>
              <li>Customize the structure as needed</li>
            </ol>
          </div>

          <div className="guide-section">
            <h2>Available Templates</h2>

            <h3>📔 Daily Journal</h3>
            <p>
              Perfect for daily reflection and tracking. Includes sections for mood, gratitude, tasks, 
              habits, highlights, and evening reflection.
            </p>
            <p><strong>Best for:</strong> Personal journaling, daily planning, habit tracking</p>

            <h3>📋 Meeting Notes</h3>
            <p>
              Structured format for capturing meeting details, attendees, discussion points, and action items. 
              Includes a table for tracking tasks and assignments.
            </p>
            <p><strong>Best for:</strong> Team meetings, client calls, project discussions</p>

            <h3>📊 Project Plan</h3>
            <p>
              Comprehensive project planning template with sections for objectives, scope, timeline, 
              resources, and risk management.
            </p>
            <p><strong>Best for:</strong> Project kickoffs, planning documents, proposals</p>

            <h3>📚 Study Notes</h3>
            <p>
              Organized structure for academic or learning notes with sections for key concepts, 
              definitions, examples, and review questions.
            </p>
            <p><strong>Best for:</strong> Course notes, research, learning new topics</p>

            <h3>✈️ Travel Log</h3>
            <p>
              Document your travels with sections for itinerary, accommodations, activities, 
              expenses, and memories.
            </p>
            <p><strong>Best for:</strong> Trip planning, travel journals, vacation documentation</p>

            <h3>💪 Workout Log</h3>
            <p>
              Track your fitness journey with sections for exercises, sets, reps, nutrition, 
              and progress notes.
            </p>
            <p><strong>Best for:</strong> Fitness tracking, workout planning, health monitoring</p>

            <h3>🐛 Bug Report</h3>
            <p>
              Technical template for documenting software bugs with sections for reproduction steps, 
              expected vs actual behavior, and environment details.
            </p>
            <p><strong>Best for:</strong> Software testing, issue tracking, QA documentation</p>

            <h3>📐 Diagram Examples</h3>
            <p>
              Collection of UML and Mermaid diagram examples to help you get started with 
              visual documentation.
            </p>
            <p><strong>Best for:</strong> Learning diagrams, technical documentation, system design</p>
          </div>

          <div className="guide-section">
            <h2>Tips for Using Templates</h2>
            <ul>
              <li><strong>Customize freely:</strong> Templates are starting points - modify them to fit your needs</li>
              <li><strong>Combine templates:</strong> Mix sections from different templates for custom documents</li>
              <li><strong>Save your favorites:</strong> Create your own template variations and save them as .md files</li>
              <li><strong>Use placeholders:</strong> Replace [bracketed text] with your actual content</li>
              <li><strong>Date formatting:</strong> Templates auto-insert the current date where applicable</li>
            </ul>
          </div>

          <div className="guide-section">
            <h2>Example: Using the Daily Journal Template</h2>
            <pre><code>{`## Daily Journal - 2024-01-15

## Today's Focus
**Main Goal:** Complete project documentation

**Priorities:**
1. Write user guide
2. Review code changes
3. Team standup meeting

## Morning Reflection
**Mood:** Energized
**Energy Level:** 8/10
**Weather:** Sunny

**Gratitude:**
- Great night's sleep
- Supportive team
- Coffee ☕`}</code></pre>
          </div>

          <div className="guide-section">
            <h2>Creating Your Own Templates</h2>
            <p>While EasyEdit provides built-in templates, you can create your own:</p>
            <ol>
              <li>Create a document with your desired structure</li>
              <li>Use placeholders like [Your Text Here] for customizable sections</li>
              <li>Save it as a .md file in a templates folder</li>
              <li>Open and copy the template whenever you need it</li>
            </ol>
          </div>

          <div className="doc-nav">
            <Link to="/docs" className="btn btn-outline">← Back to Documentation</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
