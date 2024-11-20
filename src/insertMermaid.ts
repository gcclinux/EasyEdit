// src/insertMermaid.ts
interface TextAreaRef {
  current: HTMLTextAreaElement | null;
}

// Insert Mermaid classDiagram Syntax
export const insertClassSyntax = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void
) => {
  if (textareaRef.current) {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const checkText = `\`\`\`mermaid
  classDiagram
      Animal <|-- Duck
      Animal <|-- Fish
      Animal <|-- Zebra
      Animal : +int age
      Animal : +String gender
      Animal: +isMammal()
      Animal: +mate()
      class Duck{
        +String beakColor
        +swim()
        +quack()
      }
      class Fish{
        -int sizeInFeet
        -canEat()
      }
      class Zebra{
        +bool is_wild
        +run()
      }
  \`\`\``;
    const newText =
      editorContent.substring(0, start) +
      checkText +
      editorContent.substring(end);
    setEditorContent(newText);
    setTimeout(() => {
      const newCursorPosition = start + checkText.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      textarea.focus();
    }, 0);
  }
};

// Insert Mermaid GanttDiagram Syntax
export const insertGanttSyntax = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void
) => {
  if (textareaRef.current) {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const checkText = `\`\`\`mermaid
  gantt
      title A Gantt Diagram
      dateFormat  YYYY-MM-DD
      section Section
      A task           :a1, 2014-01-01, 30d
      Another task     :after a1  , 20d
      section Another
      Task in sec      :2014-01-12  , 12d
      another task      : 24d
  \`\`\``;
    const newText =
      editorContent.substring(0, start) +
      checkText +
      editorContent.substring(end);
    setEditorContent(newText);
    setTimeout(() => {
      const newCursorPosition = start + checkText.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      textarea.focus();
    }, 0);
  }
};

// Insert Mermaid GraphTD Syntax
export const insertGraphTDSyntax = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void
) => {
  if (textareaRef.current) {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const checkText = `\`\`\`mermaid
graph TD
    A[Start] --> B[Develop SmallTextMD]
    B --> C{Testing Phase}
    
    C -->|Passed| D[Quality Assurance]
    C -->|Failed| E[Identify and Fix Issues]
    E --> C
    
    D --> F[Approval for Release]
    F --> G[Marketing Strategy]
    
    G --> H[Manufacturing Start]
    H --> I[Production Setup]
    I -->|Ready| J[Product Manufacture]
    I -->|Not Ready| K[Delay in Production]
    K --> H
    
    J --> L[Market Release]
    L -->|Approved| M[Launch Campaign]
    L -->|Not Approved| N[Postponement Decision]
    
    M --> O[Product Launched]
    O -->|Success| P[Monitor Performance]
    O -->|Issues| Q[Review and Feedback]
    
    P --> R[Improve Product]
    Q --> N
    R --> G
    N --> M
\`\`\``;
    const newText =
      editorContent.substring(0, start) +
      checkText +
      editorContent.substring(end);
    setEditorContent(newText);
    setTimeout(() => {
      const newCursorPosition = start + checkText.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      textarea.focus();
    }, 0);
  }
};

// Insert Mermaid FlowchartR Syntax
export const insertFlowchartRLSyntax = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void
) => {
  if (textareaRef.current) {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const checkText = `\`\`\`mermaid
flowchart RL
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[fa:fa-car Car]

\`\`\`

\`\`\`mermaid
flowchart LR
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[fa:fa-car Car]
    
\`\`\``;
    const newText =
      editorContent.substring(0, start) +
      checkText +
      editorContent.substring(end);
    setEditorContent(newText);
    setTimeout(() => {
      const newCursorPosition = start + checkText.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      textarea.focus();
    }, 0);
  }
};

// Insert Mermaid Journey Syntax
export const insertJourneySyntax = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void
) => {
  if (textareaRef.current) {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const checkText = `\`\`\`mermaid
journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 3: Me
\`\`\``;
    const newText =
      editorContent.substring(0, start) +
      checkText +
      editorContent.substring(end);
    setEditorContent(newText);
    setTimeout(() => {
      const newCursorPosition = start + checkText.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      textarea.focus();
    }, 0);
  }
};

// Insert Mermaid Block example Syntax
export const inserterBlockSyntax = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void
) => {
  if (textareaRef.current) {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const checkText = `\`\`\`mermaid
block-beta
    columns 3
    doc>"Document"]:3
    space down1<[" "]>(down) space

  block:e:3
          l["left"]
          m("A wide one in the middle")
          r["right"]
  end
    space down2<[" "]>(down) space
    db[("DB")]:3
    space:3
    D space C
    db --> D
    C --> db
    D --> C
    style m fill:#d6d,stroke:#333,stroke-width:4px
    
\`\`\``;
    const newText =
      editorContent.substring(0, start) +
      checkText +
      editorContent.substring(end);
    setEditorContent(newText);
    setTimeout(() => {
      const newCursorPosition = start + checkText.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      textarea.focus();
    }, 0);
  }
};

// Insert Mermaid GitGraph Syntax
export const inserterGitSyntax = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void
) => {
  if (textareaRef.current) {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const checkText = `\`\`\`mermaid
gitGraph
    commit
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
    commit
\`\`\``;
    const newText =
      editorContent.substring(0, start) +
      checkText +
      editorContent.substring(end);
    setEditorContent(newText);
    setTimeout(() => {
      const newCursorPosition = start + checkText.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      textarea.focus();
    }, 0);
  }
};

// Insert Mermaid erDiagram Syntax
export const insertererDiagramSyntax = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void
) => {
  if (textareaRef.current) {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const checkText = `\`\`\`mermaid
erDiagram
    CUSTOMER }|..|{ DELIVERY-ADDRESS : has
    CUSTOMER ||--o{ ORDER : places
    CUSTOMER ||--o{ INVOICE : "liable for"
    DELIVERY-ADDRESS ||--o{ ORDER : receives
    INVOICE ||--|{ ORDER : covers
    ORDER ||--|{ ORDER-ITEM : includes
    PRODUCT-CATEGORY ||--|{ PRODUCT : contains
    PRODUCT ||--o{ ORDER-ITEM : "ordered in"
\`\`\``;
    const newText =
      editorContent.substring(0, start) +
      checkText +
      editorContent.substring(end);
    setEditorContent(newText);
    setTimeout(() => {
      const newCursorPosition = start + checkText.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      textarea.focus();
    }, 0);
  }
};