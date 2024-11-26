interface TextAreaRef {
    current: HTMLTextAreaElement | null;
  }


// insertBoldSyntax function inserts a bold syntax for Markdown
export const insertBoldSyntax = (
textareaRef: TextAreaRef,
editorContent: string,
setEditorContent: (content: string) => void
) => {
    if (textareaRef.current) {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = editorContent.substring(start, end);
        let listText = '';      
        if (selectedText === '') {
        listText = `**Bold Text**`;
        } else {
        listText = `**${selectedText}**`;
        }
        const newText =
        editorContent.substring(0, start) +
        listText +
        editorContent.substring(end);
        setEditorContent(newText);
        setTimeout(() => {
        const newCursorPosition = start + listText.length - 2;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        textarea.focus();
        }, 0);
    }
};

// insertBoldSyntax function inserts a bold syntax for Markdown
export const insertNewLineSyntax = (
    textareaRef: TextAreaRef,
    editorContent: string,
    setEditorContent: (content: string) => void
) => {
    if (textareaRef.current) {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const listText = '  ';
        const nextLineBreak = editorContent.indexOf('\n', end);
        
        const newText =
            editorContent.substring(0, start) +
            listText +
            editorContent.substring(end);
        
        setEditorContent(newText);
        
        setTimeout(() => {
            textarea.focus();
            if (nextLineBreak !== -1) {
                textarea.setSelectionRange(nextLineBreak + 1, nextLineBreak + 1);
            } else {
                const newPosition = start + listText.length;
                textarea.setSelectionRange(newPosition, newPosition);
                const withNewLine = newText + '\n';
                setEditorContent(withNewLine);
                textarea.setSelectionRange(newPosition + 1, newPosition + 1);
            }
        }, 0);
    }
};

  // insertItalicSyntax function inserts an italic syntax for Markdown
  export const insertItalicSyntax = (
    textareaRef: TextAreaRef,
    editorContent: string,
    setEditorContent: (content: string) => void
    ) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = editorContent.substring(start, end);
      let listText = '';      
      if (selectedText === '') {
        listText = `*Italic Text*`;
      } else {
        listText = `*${selectedText}*`;
      }
      const newText =
        editorContent.substring(0, start) +
        listText +
        editorContent.substring(end);
      setEditorContent(newText);
      setTimeout(() => {
        const newCursorPosition = start + listText.length - 1;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        textarea.focus();
      }, 0);
    }
  };

  // insertStrikethroughSyntax function inserts a strikethrough syntax for Markdown
  export const insertStrikethroughSyntax = (
    textareaRef: TextAreaRef,
    editorContent: string,
    setEditorContent: (content: string) => void
    ) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = editorContent.substring(start, end);
      let listText = '';      
      if (selectedText === '') {
        listText = `~~Strike Text~~`;
      } else {
        listText = `~~${selectedText}~~`;
      }
      const newText =
        editorContent.substring(0, start) +
        listText +
        editorContent.substring(end);
      setEditorContent(newText);
      setTimeout(() => {
        const newCursorPosition = start + listText.length - 2;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        textarea.focus();
      }, 0);
    }
  };

// inserth1Syntax function inserts a h1 syntax for Markdown
export const inserth1Syntax = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void
) => {
  if (textareaRef.current) {
    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorContent.substring(start, end);
    let listText = '';      
    if (selectedText === '') {
      listText = `# Header 1`;
    } else {
      listText = `# ${selectedText}`;
    }
    
    const beforeCursor = editorContent.substring(0, cursorPos);
    const afterCursor = editorContent.substring(cursorPos);
    
    const newText = beforeCursor + listText + afterCursor;
    setEditorContent(newText);
  }
};

  // inserth2Syntax function inserts a h2 syntax for Markdown
  export const inserth2Syntax = (
    textareaRef: TextAreaRef,
    editorContent: string,
    setEditorContent: (content: string) => void
    ) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = editorContent.substring(start, end);
      let listText = '';      
      if (selectedText === '') {
        listText = `## Header 2`;
      } else {
        listText = `## ${selectedText}`;
      }
      const newText =
        editorContent.substring(0, start) +
        listText +
        editorContent.substring(end);
      setEditorContent(newText);
      setTimeout(() => {
        const newCursorPosition = start + listText.length;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        textarea.focus();
      }, 0);
    }
  };

  // inserth3Syntax function inserts a h3 syntax for Markdown
  export const inserth3Syntax = (
    textareaRef: TextAreaRef,
    editorContent: string,
    setEditorContent: (content: string) => void
    ) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = editorContent.substring(start, end);
      let listText = '';      
      if (selectedText === '') {
        listText = `### Header 3`;
      } else {
        listText = `### ${selectedText}`;
      }
      const newText =
        editorContent.substring(0, start) +
        listText +
        editorContent.substring(end);
      setEditorContent(newText);
      setTimeout(() => {
        const newCursorPosition = start + listText.length;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        textarea.focus();
      }, 0);
    }
  };
// inserth4Syntax function inserts a h4 syntax for Markdown
export const inserth4Syntax = (
    textareaRef: TextAreaRef,
    editorContent: string,
    setEditorContent: (content: string) => void
) => {
    if (textareaRef.current) {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = editorContent.substring(start, end);
        let listText = '';      
        if (selectedText === '') {
            listText = `#### Header 4`;
        } else {
            listText = `#### ${selectedText}`;
        }
        const newText =
            editorContent.substring(0, start) +
            listText +
            editorContent.substring(end);
        setEditorContent(newText);
        setTimeout(() => {
            const newCursorPosition = start + listText.length;
            textarea.setSelectionRange(newCursorPosition, newCursorPosition);
            textarea.focus();
        }, 0);
    }
};

// inserth5Syntax function inserts a h5 syntax for Markdown
export const inserth5Syntax = (
    textareaRef: TextAreaRef,
    editorContent: string,
    setEditorContent: (content: string) => void
) => {
    if (textareaRef.current) {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = editorContent.substring(start, end);
        let listText = '';      
        if (selectedText === '') {
            listText = `##### Header 5`;
        } else {
            listText = `##### ${selectedText}`;
        }
        const newText =
            editorContent.substring(0, start) +
            listText +
            editorContent.substring(end);
        setEditorContent(newText);
        setTimeout(() => {
            const newCursorPosition = start + listText.length;
            textarea.setSelectionRange(newCursorPosition, newCursorPosition);
            textarea.focus();
        }, 0);
    }
};

// inserth6Syntax function inserts a h6 syntax for Markdown
export const inserth6Syntax = (
    textareaRef: TextAreaRef,
    editorContent: string,
    setEditorContent: (content: string) => void
) => {
    if (textareaRef.current) {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = editorContent.substring(start, end);
        let listText = '';      
        if (selectedText === '') {
            listText = `###### Header 6`;
        } else {
            listText = `###### ${selectedText}`;
        }
        const newText =
            editorContent.substring(0, start) +
            listText +
            editorContent.substring(end);
        setEditorContent(newText);
        setTimeout(() => {
            const newCursorPosition = start + listText.length;
            textarea.setSelectionRange(newCursorPosition, newCursorPosition);
            textarea.focus();
        }, 0);
    }
};