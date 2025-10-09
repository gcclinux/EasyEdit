// src/insertUML.ts
interface TextAreaRef {
  current: HTMLTextAreaElement | null;
}

// Insert Nomnoml Class Diagram Syntax
export const insertUMLClassDiagram = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void,
  cursorPositionRef: React.MutableRefObject<number>
) => {
  if (textareaRef.current) {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const checkText = `\`\`\`plantuml
#title: Class Diagram Example
#direction: down

[Animal|
  age: int;
  gender: string|
  isMammal();
  mate()
]

[Duck|
  beakColor: string|
  swim();
  quack()
]

[Fish|
  sizeInFeet: int|
  canEat()
]

[Zebra|
  is_wild: bool|
  run()
]

[Animal] <:- [Duck]
[Animal] <:- [Fish]
[Animal] <:- [Zebra]
\`\`\``;
    const newText =
      editorContent.substring(0, start) +
      checkText +
      editorContent.substring(end);
    setEditorContent(newText);
    cursorPositionRef.current = start + checkText.length;
  }
};

// Insert Nomnoml Sequence Diagram Syntax
export const insertUMLSequenceDiagram = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void,
  cursorPositionRef: React.MutableRefObject<number>
) => {
  if (textareaRef.current) {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const checkText = `\`\`\`plantuml
#title: Sequence Diagram Example
#direction: right

[User] -> [Browser]
[Browser] -> [Server]
[Server] -> [Database]
[Database] --> [Server]
[Server] --> [Browser]
[Browser] --> [User]
\`\`\``;
    const newText =
      editorContent.substring(0, start) +
      checkText +
      editorContent.substring(end);
    setEditorContent(newText);
    cursorPositionRef.current = start + checkText.length;
  }
};

// Insert Nomnoml Use Case Diagram Syntax
export const insertUMLUseCaseDiagram = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void,
  cursorPositionRef: React.MutableRefObject<number>
) => {
  if (textareaRef.current) {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const checkText = `\`\`\`plantuml
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
\`\`\``;
    const newText =
      editorContent.substring(0, start) +
      checkText +
      editorContent.substring(end);
    setEditorContent(newText);
    cursorPositionRef.current = start + checkText.length;
  }
};

// Insert Nomnoml Activity Diagram Syntax
export const insertUMLActivityDiagram = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void,
  cursorPositionRef: React.MutableRefObject<number>
) => {
  if (textareaRef.current) {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const checkText = `\`\`\`plantuml
#title: Activity Diagram Example
#direction: down

[<start> Start] -> [User Login]
[User Login] -> [<choice> Valid?]
[Valid?] yes -> [Load Dashboard]
[Valid?] no -> [Show Error]
[Load Dashboard] -> [Display Data]
[Display Data] -> [User Action]
[User Action] -> [<choice> Success?]
[Success?] yes -> [Update DB]
[Success?] no -> [Show Error]
[Update DB] -> [<end> End]
[Show Error] -> [<end> End]
\`\`\``;
    const newText =
      editorContent.substring(0, start) +
      checkText +
      editorContent.substring(end);
    setEditorContent(newText);
    cursorPositionRef.current = start + checkText.length;
  }
};

// Insert Nomnoml Component Diagram Syntax
export const insertUMLComponentDiagram = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void,
  cursorPositionRef: React.MutableRefObject<number>
) => {
  if (textareaRef.current) {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const checkText = `\`\`\`plantuml
#title: Component Diagram Example
#direction: right

[<package> Frontend|
  [React App]
  [UI Components]
]

[<package> Backend|
  [API Server]
  [Business Logic]
]

[<database> Database|
  [PostgreSQL]
]

[React App] -> [UI Components]
[React App] --> [API Server]
[API Server] -> [Business Logic]
[Business Logic] -> [PostgreSQL]
\`\`\``;
    const newText =
      editorContent.substring(0, start) +
      checkText +
      editorContent.substring(end);
    setEditorContent(newText);
    cursorPositionRef.current = start + checkText.length;
  }
};

// Insert Nomnoml State Diagram Syntax
export const insertUMLStateDiagram = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void,
  cursorPositionRef: React.MutableRefObject<number>
) => {
  if (textareaRef.current) {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const checkText = `\`\`\`plantuml
#title: State Diagram Example
#direction: right

[<start> Start] -> [Idle]
[Idle] -> [Processing]
[Processing] -> [Idle]
[Processing] -> [Completed]
[Processing] -> [Error]
[Error] -> [Processing]
[Error] -> [Idle]
[Completed] -> [<end> End]
\`\`\``;
    const newText =
      editorContent.substring(0, start) +
      checkText +
      editorContent.substring(end);
    setEditorContent(newText);
    cursorPositionRef.current = start + checkText.length;
  }
};
