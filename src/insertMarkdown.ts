interface TextAreaRef {
    current: HTMLTextAreaElement | null;
  }

// insertItalicSyntax function inserts an italic syntax for Markdown
export const insertItalicSyntax = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void,
  cursorPositionRef: React.MutableRefObject<number>
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
    cursorPositionRef.current = start + listText.length;
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

  // insertStrikethroughSyntax function inserts a strikethrough syntax for Markdown
  export const insertStrikethroughSyntax = (
    textareaRef: TextAreaRef,
    editorContent: string,
    setEditorContent: (content: string) => void,
    cursorPositionRef: React.MutableRefObject<number>
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
      cursorPositionRef.current = start + listText.length;
    }
  };

// insertBoldSyntax function inserts a bold syntax for Markdown
export const insertBoldSyntax = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void,
  cursorPositionRef: React.MutableRefObject<number>
  ) => {
      if (textareaRef.current) {
          const textarea = textareaRef.current;
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const selectedText = editorContent.substring(start, end);

          console.log('Textarea:', textarea);
          console.log('Selection start:', start);
          console.log('Selection end:', end);
          console.log('Selected text:', selectedText);
  
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
          cursorPositionRef.current = start + listText.length;
      }
  };

// inserth1Syntax function inserts a h1 syntax for Markdown
export const inserth1Syntax = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void,
  cursorPositionRef: React.MutableRefObject<number>,  
  selectionStart: number,
  selectionEnd: number
  ) => {
  if (textareaRef.current) {
    const start = selectionStart;
    const end = selectionEnd;
    const selectedText = editorContent.substring(start, end);
            
    let listText = '';      
    if (selectedText === '') {
      listText = `# Header 1`;
    } else {
      listText = `# ${selectedText}`;
    }
    const newText =
      editorContent.substring(0, start) +
      listText +
      editorContent.substring(end);
    setEditorContent(newText);
    cursorPositionRef.current = start + listText.length;
  }
};

  // inserth2Syntax function inserts a h2 syntax for Markdown
  export const inserth2Syntax = (
    textareaRef: TextAreaRef,
    editorContent: string,
    setEditorContent: (content: string) => void,
    cursorPositionRef: React.MutableRefObject<number>,  
    selectionStart: number,
    selectionEnd: number
    ) => {
    if (textareaRef.current) {
      const start = selectionStart;
      const end = selectionEnd;
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
      cursorPositionRef.current = start + listText.length;
    }
  };

  // inserth3Syntax function inserts a h3 syntax for Markdown
  export const inserth3Syntax = (
    textareaRef: TextAreaRef,
    editorContent: string,
    setEditorContent: (content: string) => void,
    cursorPositionRef: React.MutableRefObject<number>, 
    selectionStart: number,
    selectionEnd: number
    ) => {
    if (textareaRef.current) {
      const start = selectionStart;
      const end = selectionEnd;
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
      cursorPositionRef.current = start + listText.length;
    }
  };
// inserth4Syntax function inserts a h4 syntax for Markdown
export const inserth4Syntax = (
    textareaRef: TextAreaRef,
    editorContent: string,
    setEditorContent: (content: string) => void,
    cursorPositionRef: React.MutableRefObject<number>,  
    selectionStart: number,
    selectionEnd: number
) => {
    if (textareaRef.current) {
        const start = selectionStart;
        const end = selectionEnd;
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
        cursorPositionRef.current = start + listText.length;
    }
};

// inserth5Syntax function inserts a h5 syntax for Markdown
export const inserth5Syntax = (
    textareaRef: TextAreaRef,
    editorContent: string,
    setEditorContent: (content: string) => void,
    cursorPositionRef: React.MutableRefObject<number>,  
    selectionStart: number,
    selectionEnd: number
) => {
    if (textareaRef.current) {
        const start = selectionStart;
        const end = selectionEnd;
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
        cursorPositionRef.current = start + listText.length;
    }
};

// inserth6Syntax function inserts a h6 syntax for Markdown
export const inserth6Syntax = (
    textareaRef: TextAreaRef,
    editorContent: string,
    setEditorContent: (content: string) => void,
    cursorPositionRef: React.MutableRefObject<number>,  
    selectionStart: number,
    selectionEnd: number
) => {
    if (textareaRef.current) {
        const start = selectionStart;
        const end = selectionEnd;
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
        cursorPositionRef.current = start + listText.length;
    }
};

  // insertRulerSyntax function inserts a ruler syntax for Markdown
  export const insertRulerSyntax = (
    textareaRef: TextAreaRef,
    editorContent: string,
    setEditorContent: (content: string) => void,
    cursorPositionRef: React.MutableRefObject<number>
) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const listText = `- - -`;
      const newText =
        editorContent.substring(0, start) +
        listText +
        editorContent.substring(end);
      setEditorContent(newText);
      cursorPositionRef.current = start + listText.length;
    }
};

// insertCodeSyntax function inserts a blockquote syntax for Markdown
export const insertCodeSyntax = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void,
  cursorPositionRef: React.MutableRefObject<number>
) => {
  if (textareaRef.current) {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorContent.substring(start, end);
    let codeText = '';      
    if (selectedText === '') {
      codeText = `\`Code Example!\``;
    } else {
      codeText = `\`${selectedText}\``;
    }
    const newText =
      editorContent.substring(0, start) +
      codeText +
      editorContent.substring(end);
    setEditorContent(newText);
    cursorPositionRef.current = start + codeText.length;
  }
};

// insertBlockquoteSyntax function inserts a blockquote syntax for Markdown
export const insertBlockquoteSyntax = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void,
  cursorPositionRef: React.MutableRefObject<number>
) => {
  if (textareaRef.current) {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorContent.substring(start, end);
    let codeText = '';      
    if (selectedText === '') {
      codeText = `\`\`\`\nBlock Code Example!\n\`\`\``;
    } else {
      codeText = `\`\`\`\n${selectedText}\n\`\`\``;
    }
    const newText =
      editorContent.substring(0, start) +
      codeText +
      editorContent.substring(end);
    setEditorContent(newText);
    cursorPositionRef.current = start + codeText.length;
  }
};

// insertIndent1Syntax function inserts a blockquote syntax for Markdown
export const insertIndent1Syntax = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void,
  cursorPositionRef: React.MutableRefObject<number>
) => {
  if (textareaRef.current) {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorContent.substring(start, end);
    let listText = '';      
    if (selectedText === '') {
      listText = `> Indent 1`;
    } else {
      listText = `> ${selectedText}`;
    }
    const newText =
      editorContent.substring(0, start) +
      listText +
      editorContent.substring(end);
    setEditorContent(newText);
    cursorPositionRef.current = start + listText.length;
  }
};

// insertIndent2Syntax function inserts a blockquote syntax for Markdown
export const insertIndent2Syntax = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void,
  cursorPositionRef: React.MutableRefObject<number>
) => {
  if (textareaRef.current) {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorContent.substring(start, end);
    let listText = '';      
    if (selectedText === '') {
      listText = `>> Indent 2`;
    } else {
      listText = `>> ${selectedText}`;
    }
    const newText =
      editorContent.substring(0, start) +
      listText +
      editorContent.substring(end);
    setEditorContent(newText);
    cursorPositionRef.current = start + listText.length;
  }
};

// insertList1Syntax function inserts a list1 syntax for Markdown
export const insertList1Syntax = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void,
  cursorPositionRef: React.MutableRefObject<number>
) => {
  if (textareaRef.current) {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorContent.substring(start, end);
    let listText = '';      
    if (selectedText === '') {
      listText = `- List 1`;
    } else {
      listText = `- ${selectedText}`;
    }
    const newText =
      editorContent.substring(0, start) +
      listText +
      editorContent.substring(end);
    setEditorContent(newText);
    cursorPositionRef.current = start + listText.length;
  }
};

// insertList2Syntax function inserts a list2 syntax for Markdown
export const insertList2Syntax = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void,
  cursorPositionRef: React.MutableRefObject<number>
) => {
  if (textareaRef.current) {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorContent.substring(start, end);
    let listText = '';      
    if (selectedText === '') {
      listText = `- - List 2`;
    } else {
      listText = `- - ${selectedText}`;
    }
    const newText =
      editorContent.substring(0, start) +
      listText +
      editorContent.substring(end);
    setEditorContent(newText);
    cursorPositionRef.current = start + listText.length;
  }
};

// insertImageSyntax function inserts a default and extended image syntax for Markdown
export const insertImageSyntax = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void,
  cursorPositionRef: React.MutableRefObject<number>
) => {
  if (textareaRef.current) {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const imageText = `
### *Markdown Image*
![alt text](image url "Image Title")

#### Example:
![EasyEdit](https://raw.githubusercontent.com/gcclinux/EasyEdit/refs/heads/main/public/easyedit128.png  "EasyEdit")
`;
    const newText =
      editorContent.substring(0, start) +
      imageText +
      editorContent.substring(end);
    setEditorContent(newText);
    cursorPositionRef.current = start + imageText.length;
  }
};

// insertURLSyntax function inserts a url example syntax for Markdown
  export const insertURLSyntax = (
    textareaRef: TextAreaRef,
    editorContent: string,
    setEditorContent: (content: string) => void,
    cursorPositionRef: React.MutableRefObject<number>
  ) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const imageText = `
### *Markdown Text URL Example*
[GitHub Project Link](https://github.com/gcclinux/EasyEdit)

### *Markdown Image URL Example*
[![GitHub Project](https://raw.githubusercontent.com/gcclinux/EasyEdit/refs/heads/main/public/easyedit128.png "EasyEdit")](https://github.com/gcclinux/EasyEdit)
`;
      const newText =
        editorContent.substring(0, start) +
        imageText +
        editorContent.substring(end);
      setEditorContent(newText);
      cursorPositionRef.current = start + imageText.length;
    }
  };

// insertCheckSyntax function inserts a check syntax for Markdown
export const insertCheckSyntax = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void,
  cursorPositionRef: React.MutableRefObject<number>
) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const checkText = `- [ ] This item is unchecked 
- [X] This item is checked`;
      const newText =
        editorContent.substring(0, start) +
        checkText +
        editorContent.substring(end);
      setEditorContent(newText);
      cursorPositionRef.current = start + checkText.length;
    }
  };

// insertFootSyntax function inserts a footnote syntax for Markdown
export const insertFootSyntax = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void,
  cursorPositionRef: React.MutableRefObject<number>
) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const footnoteText = `Example of a footnote[^1] within text.
  [^1]: Description of footnote text`;
      const newText =
        editorContent.substring(0, start) +
        footnoteText +
        editorContent.substring(end);
      setEditorContent(newText);
      cursorPositionRef.current = start + footnoteText.length;
    }
  };

// insertTableSyntax function inserts a table syntax for Markdown
export const insertTableSyntax = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void,
  cursorPositionRef: React.MutableRefObject<number>
) => {
  if (textareaRef.current) {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const tableText = `| header1 | header2 | header3 |
| :--- | :--- | :--- |
| row1 | col2 | col3 |
| row2 | col2 | col3 |`;
    const newText =
      editorContent.substring(0, start) +
      tableText +
      editorContent.substring(end);
    setEditorContent(newText);
    cursorPositionRef.current = start + tableText.length;
  }
};

// inserterPlainFlowSyntax function inserts a plain flow syntax for Markdown
export const inserterPlainFlowSyntax = (
  textareaRef: TextAreaRef,
  editorContent: string,
  setEditorContent: (content: string) => void,
  cursorPositionRef: React.MutableRefObject<number>
) => {
  if (textareaRef.current) {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const checkText = `\`\`\`plaintext
                   Start
                     |
              +------------+
              |            |
        Enter Username   Is username valid?
              /                 Yes /               No  -> No     Yes -> Password entered
+--------------+                      |                |
| Check if password is correct for the given user. +---------+
+------------------+                                   |
              |                                      |
             Yes                   No --> Display "Invalid username or password."
             /\                    |          |
      Access granted              End     Retry login?
     (User logged in)              |
                                   |
                                  Yes -> Continue user session.
                                  No         +---------+
                                   |              |
                                 Display "Retried, please try again."
\`\`\``;
    const newText =
      editorContent.substring(0, start) +
      checkText +
      editorContent.substring(end);
    setEditorContent(newText);
    cursorPositionRef.current = start + checkText.length;
  }
};