import React, { useRef, useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import rehypeRaw from 'rehype-raw';
import debounce from 'lodash.debounce';
import './App.css';
import markdownMarkWhite from './assets/md.svg';
import { IpcRendererEvent } from 'electron';
const { ipcRenderer } = window.require('electron');
import { marked } from 'marked';
import { renderToString } from 'react-dom/server';

const App = () => {
  const [editorContent, setEditorContent] = useState<string>('');
  const [isHorizontal, setIsHorizontal] = useState<boolean>(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cursorPositionRef = useRef<number>(0);

  const initializeMermaid = useCallback(
    debounce(() => {
      if (previewRef.current) {
        const mermaidElements = previewRef.current.querySelectorAll('.mermaid');
        mermaidElements.forEach((element) => {
          mermaid.init(undefined, element as HTMLElement);
        });
      }
    }, 300),
    [editorContent]
  );

  useEffect(() => {
    initializeMermaid();
  }, [editorContent, initializeMermaid]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    cursorPositionRef.current = e.target.selectionStart;
    setEditorContent(e.target.value);
  };

  useEffect(() => {
    ipcRenderer.on('file-opened', (_event: IpcRendererEvent, content: string) => {
      setEditorContent(content);
    });

    // Cleanup listener
    return () => {
      ipcRenderer.removeAllListeners('file-opened');
    };
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
      textareaRef.current.focus();
    }
  }, [editorContent]);

  const toggleLayout = () => {
    setIsHorizontal(!isHorizontal);
  };

  const insertSymbol = (symbol: string) => {
    const newText = editorContent + symbol;
    setEditorContent(newText);

    if (textareaRef.current) {
      textareaRef.current.value = newText;
      textareaRef.current.setSelectionRange(newText.length, newText.length);
      textareaRef.current.focus();
    }
  };

  const TextareaComponent = React.memo(() => {
    useEffect(() => {
      if (textareaRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = textareaRef.current;
        const isAtBottom = scrollHeight - scrollTop === clientHeight;
        if (isAtBottom) {
          textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
      }
    }, [editorContent]);

    return (
      <textarea
        ref={textareaRef}
        value={editorContent}
        onChange={handleChange}
        className={isHorizontal ? 'textarea-horizontal' : 'textarea-parallel'}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const target = e.target as HTMLTextAreaElement;
            const { selectionStart, selectionEnd } = target;
            const newValue =
              editorContent.substring(0, selectionStart) +
              '\n' +
              editorContent.substring(selectionEnd);
            cursorPositionRef.current = selectionStart + 1;
            setEditorContent(newValue);
          }
        }}
      />
    );
  });

  const PreviewComponent = React.memo(() => {
    useEffect(() => {
      initializeMermaid();
    }, [editorContent, initializeMermaid]);

    // Add new useEffect for auto-scrolling
    useEffect(() => {
      if (!previewRef.current) return;
    
      // Create observer to watch for Mermaid diagram changes
      const observer = new MutationObserver(() => {
        if (previewRef.current) {
          // Add small delay to ensure diagrams are fully rendered
          setTimeout(() => {
            previewRef.current!.scrollTop = previewRef.current!.scrollHeight;
          }, 100);
        }
      });
    
      // Observe changes in the preview div
      observer.observe(previewRef.current, {
        childList: true,
        subtree: true,
        attributes: true
      });
    
      // Initial scroll
      setTimeout(() => {
        if (previewRef.current) {
          previewRef.current.scrollTop = previewRef.current.scrollHeight;
        }
      }, 100);
    
      // Cleanup
      return () => observer.disconnect();
    }, [editorContent]);

    return (
      <div
        className={isHorizontal ? 'preview-horizontal' : 'preview-parallel'}
        ref={previewRef}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-mermaid/.test(className || "");
              return match ? (
                <div className="mermaid">
                  {String(children).replace(/\n$/, "")}
                </div>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {editorContent}
        </ReactMarkdown>
      </div>
    );
  });

  const insertSymbol1 = () => insertSymbol("&#8894;");
  const insertSymbol2 = () => insertSymbol("&#8704;");
  const insertSymbol3 = () => insertSymbol("&#8710;");
  const insertSymbol4 = () => insertSymbol("&#8711;");
  const insertSymbol5 = () => insertSymbol("&#8721;");
  const insertSymbol6 = () => insertSymbol("&#8730;");
  const insertSymbol7 = () => insertSymbol("&#8734;");
  const insertSymbol8 = () => insertSymbol("&#8735;");
  const insertSymbol9 = () => insertSymbol("&#8736;");
  const insertSymbol10 = () => insertSymbol("&#8737;");
  const insertSymbol11 = () => insertSymbol("&#8743;");
  const insertSymbol12 = () => insertSymbol("&#8744;");
  const insertSymbol17 = () => insertSymbol("&#8756;");
  const insertSymbol18 = () => insertSymbol("&#8757;");
  const insertSymbol19 = () => insertSymbol("&#8758;");
  const insertSymbol20 = () => insertSymbol("&#8759;");
  const insertSymbol21 = () => insertSymbol("&#8760;");
  const insertSymbol22 = () => insertSymbol("&#8761;");
  const insertSymbol23 = () => insertSymbol("&#8866;");
  const insertSymbol24 = () => insertSymbol("&#8867;");
  const insertSymbol25 = () => insertSymbol("&#8868;");
  const insertSymbol26 = () => insertSymbol("&#8869;");

  const insertBoldSyntax = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = editorContent.substring(start, end);
      const listText = `**${selectedText}**`;
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

  const insertItalicSyntax = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = editorContent.substring(start, end);
      const listText = `*${selectedText}*`;
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

  const insertStrikethroughSyntax = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = editorContent.substring(start, end);
      const listText = `~~${selectedText}~~`;
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

  const inserth1Syntax = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = editorContent.substring(start, end);
      const listText = `# ${selectedText}`;
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

  const inserth2Syntax = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = editorContent.substring(start, end);
      const listText = `## ${selectedText}`;
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

  const inserth3Syntax = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = editorContent.substring(start, end);
      const listText = `### ${selectedText}`;
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

  const insertRulerSyntax = () => {
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
      setTimeout(() => {
        const newCursorPosition = start + listText.length;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        textarea.focus();
      }, 0);
    }
  };

  const insertCodeSyntax = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = editorContent.substring(start, end);
      const codeText = `\`\`\`\n${selectedText}\n\`\`\``;
      const newText =
        editorContent.substring(0, start) +
        codeText +
        editorContent.substring(end);
      setEditorContent(newText);
      setTimeout(() => {
        const newCursorPosition = start + codeText.length;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        textarea.focus();
      }, 0);
    }
  };

  const insertIndent1Syntax = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = editorContent.substring(start, end);
      const listText = `> ${selectedText}`;
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

  const insertIndent2Syntax = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = editorContent.substring(start, end);
      const listText = `>> ${selectedText}`;
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

  const insertList1Syntax = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = editorContent.substring(start, end);
      const listText = `- ${selectedText}`;
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

  const insertList2Syntax = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = editorContent.substring(start, end);
      const listText = `- - ${selectedText}`;
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

  const insertImageSyntax = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const imageText = `Default MarkDown Example\n![alt text](image url)\n\nExtended HTML Example\n<img src="image url" alt="alt text" width="300" height="200">\n\n`;
      const newText =
        editorContent.substring(0, start) +
        imageText +
        editorContent.substring(end);
      setEditorContent(newText);

      // Move cursor to the end of the inserted image syntax
      setTimeout(() => {
        const newCursorPosition = start + imageText.length;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        textarea.focus();
      }, 0);
    }
  };

  const insertCheckSyntax = () => {
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
      setTimeout(() => {
        const newCursorPosition = start + checkText.length;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        textarea.focus();
      }, 0);
    }
  };

  const insertFootSyntax = () => {
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
      setTimeout(() => {
        const newCursorPosition = start + footnoteText.length;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        textarea.focus();
      }, 0);
    }
  };

  const insertTableSyntax = () => {
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

      // Move cursor to the end of the inserted table
      setTimeout(() => {
        const newCursorPosition = start + tableText.length;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        textarea.focus();
      }, 0);
    }
  };

  const insertClassSyntax = () => {
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

  const insertGanttSyntax = () => {
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

  const insertmindmapSyntax = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const checkText = `\`\`\`mermaid
mindmap
  root((mindmap))
    Origins
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectivness<br/>and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid
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

  const insertMermaidSyntax = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const checkText = `\`\`\`mermaid
flowchart TD
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

  const insertjourneySyntax = () => {
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

  const inserterBlockSyntax = () => {
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

  const inserterGitSyntax = () => {
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

  const inserterDiagramSyntax = () => {
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

  const saveToFile = () => {
    const blob = new Blob([editorContent], {
      type: "text/markdown;charset=utf-8",
    });
    saveAs(blob, "easyedit.md");
  };

  const saveAsPDF = async () => {
    try {
      const pdf = new jsPDF();
      let currentY = 10;
  
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      document.body.appendChild(container);
  
      const sections = editorContent.split(/(```mermaid[\s\S]*?```)/);
  
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
  
        if (section.startsWith('```mermaid')) {
          // Pre-calculate mermaid diagram height
          const diagramContent = section
            .replace('```mermaid', '')
            .replace('```', '')
            .trim();
  
          const svg = await mermaid.render('mermaid-' + i, diagramContent);
          const mermaidDiv = document.createElement('div');
          mermaidDiv.innerHTML = svg.svg;
          container.appendChild(mermaidDiv);
  
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const diagramCanvas = await html2canvas(mermaidDiv, {
            logging: false,
            scale: 2
          });
  
          const imageHeight = (diagramCanvas.height * 190) / diagramCanvas.width;
  
          // Check if diagram needs new page
          if (currentY + imageHeight > pdf.internal.pageSize.height - 10) {
            pdf.addPage();
            currentY = 10;
          }
  
          pdf.addImage(
            diagramCanvas.toDataURL('image/png'),
            'PNG',
            10,
            currentY,
            190,
            imageHeight
          );
          currentY += imageHeight + 10;
          container.removeChild(mermaidDiv);
        } else if (section.trim()) {
          const markdownDiv = document.createElement('div');
          markdownDiv.className = 'markdown-body';
          markdownDiv.style.width = '800px';
          markdownDiv.style.padding = '20px';
          markdownDiv.style.backgroundColor = 'white';
          
          const styleElement = document.createElement('style');
          styleElement.textContent = `
            .markdown-body table {
              border-collapse: collapse;
              width: 100%;
              margin: 10px 0;
            }
            .markdown-body th, .markdown-body td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            .markdown-body pre {
              background-color: #f6f8fa;
              padding: 16px;
              border-radius: 6px;
              overflow: auto;
            }
            .markdown-body img {
              max-width: 100%;
            }
          `;
          markdownDiv.appendChild(styleElement);
  
          const markdownHtml = renderToString(
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {section}
            </ReactMarkdown>
          );
          markdownDiv.innerHTML += markdownHtml;
          container.appendChild(markdownDiv);
  
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const mdCanvas = await html2canvas(markdownDiv, {
            logging: false,
            scale: 2,
            width: 800,
            windowWidth: 800
          });
  
          const contentHeight = (mdCanvas.height * 190) / mdCanvas.width;
  
          // Check if content needs new page
          if (currentY + contentHeight > pdf.internal.pageSize.height - 10) {
            pdf.addPage();
            currentY = 10;
          }
  
          pdf.addImage(
            mdCanvas.toDataURL('image/png'),
            'PNG',
            10,
            currentY,
            190,
            contentHeight
          );
          currentY += contentHeight + 10;
          container.removeChild(markdownDiv);
        }
      }
  
      document.body.removeChild(container);
      pdf.save('easyedit.pdf');
    } catch (err) {
      console.error('PDF generation error:', err);
    }
  };


  const saveToHTML = async () => {
    // Convert markdown to HTML
    const htmlContent = await marked(editorContent);
    
    // Create blob with HTML content
    const blob = new Blob([htmlContent], {
      type: "text/html;charset=utf-8",
    });
    
    // Save with .html extension
    saveAs(blob, "easyedit.html");
  };

  const handleOpenClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".md";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const contents = e.target?.result;
          if (typeof contents === "string") {
            setEditorContent(contents);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="container">
      <div className="menubar">
        <button className="menu-item" onClick={toggleLayout}>
          Toggle Layout
        </button>
        <button className="menu-item" onClick={handleOpenClick}>
          Load Document
        </button>
        <button className="menu-item" onClick={saveToFile}>
          Save as MD
        </button>
        <button className="menu-item" onClick={saveToHTML}>
          Save as HTML
        </button>
        <button className="menu-item" onClick={saveAsPDF}>
          Save as PDF
        </button>
      </div>
      <div className="editor">
        <div className="toolbar">
          <img
            className="markdown-mark"
            src={markdownMarkWhite}
            alt="MD"
            onClick={() => window.location.reload()}
          />
          <button className="button-format" onClick={inserth1Syntax}>
            H1
          </button>
          <button className="button-format" onClick={inserth2Syntax}>
            H2
          </button>
          <button className="button-format" onClick={inserth3Syntax}>
            H3
          </button>
          <button className="button-format" onClick={insertBoldSyntax}>
            Bold
          </button>
          <button className="button-format" onClick={insertItalicSyntax}>
            Italic
          </button>
          <button className="button-format" onClick={insertStrikethroughSyntax}>
            <s>Strike</s>
          </button>

          <button className="button" onClick={insertCodeSyntax}>
            &lt;code&gt;
          </button>
          <button className="button" onClick={insertRulerSyntax}>
            --Ruler--
          </button>
          <button className="button" onClick={insertIndent1Syntax}>
            Indent &ge;
          </button>
          <button className="button" onClick={insertIndent2Syntax}>
            Indent &ge;&gt;
          </button>
          <button className="button" onClick={insertList1Syntax}>
            List &#10625;
          </button>
          <button className="button" onClick={insertList2Syntax}>
            List &#10625; &#10625;
          </button>
          <button className="button" onClick={insertImageSyntax}>
            Image
          </button>
          <button className="button" onClick={insertTableSyntax}>
            Table
          </button>
          <button className="button" onClick={insertFootSyntax}>
            FootNote
          </button>
          <button
            className="button-mermaid"
            onClick={insertMermaidSyntax}
            title="Insert Mermaid flowchart"
          >
            flowchart
          </button>
          <button
            className="button-mermaid"
            onClick={insertGanttSyntax}
            title="Insert Mermaid Gantt chart"
          >
            Gantt
          </button>
          <button
            className="button-mermaid"
            onClick={insertmindmapSyntax}
            title="Insert Mermaid MindMap"
          >
            MindMap
          </button>
          <button
            className="button-mermaid"
            onClick={inserterDiagramSyntax}
            title="Insert Mermaid erDiagram"
          >
            erDiag
          </button>
        </div>
        <div className="toolbar">
          <button className="button" onClick={insertCheckSyntax}>
            &#9745;
          </button>
          <button className="button-html" onClick={insertSymbol1}>
            &#8894;
          </button>
          <button className="button-html" onClick={insertSymbol2}>
            &#8704;
          </button>
          <button className="button-html" onClick={insertSymbol3}>
            &#8710;
          </button>
          <button className="button-html" onClick={insertSymbol4}>
            &#8711;
          </button>
          <button className="button-html" onClick={insertSymbol5}>
            &#8721;
          </button>
          <button className="button-html" onClick={insertSymbol6}>
            &#8730;
          </button>
          <button className="button-html" onClick={insertSymbol7}>
            &#8734;
          </button>
          <button className="button-html" onClick={insertSymbol8}>
            &#8735;
          </button>
          <button className="button-html" onClick={insertSymbol9}>
            &#8736;
          </button>
          <button className="button-html" onClick={insertSymbol10}>
            &#8737;
          </button>
          <button className="button-html" onClick={insertSymbol11}>
            &#8743;
          </button>
          <button className="button-html" onClick={insertSymbol12}>
            &#8744;
          </button>
          <button className="button-html" onClick={insertSymbol17}>
            &#8756;
          </button>
          <button className="button-html" onClick={insertSymbol18}>
            &#8757;
          </button>
          <button className="button-html" onClick={insertSymbol19}>
            &#8758;
          </button>
          <button className="button-html" onClick={insertSymbol20}>
            &#8759;
          </button>
          <button className="button-html" onClick={insertSymbol21}>
            &#8760;
          </button>
          <button className="button-html" onClick={insertSymbol22}>
            &#8761;
          </button>
          <button className="button-html" onClick={insertSymbol23}>
            &#8866;
          </button>
          <button className="button-html" onClick={insertSymbol24}>
            &#8867;
          </button>
          <button className="button-html" onClick={insertSymbol25}>
            &#8868;
          </button>
          <button className="button-html" onClick={insertSymbol26}>
            &#8869;
          </button>
          <button
            className="button-mermaid"
            onClick={insertClassSyntax}
            title="Insert Mermaid classDiag"
          >
            ClassDiag
          </button>
          <button
            className="button-mermaid"
            onClick={inserterGitSyntax}
            title="Insert Mermaid gitGraph"
          >
            gitGraph
          </button>
          <button
            className="button-mermaid"
            onClick={inserterBlockSyntax}
            title="Insert Mermaid Block"
          >
            Block
          </button>
          <button
            className="button-mermaid"
            onClick={insertjourneySyntax}
            title="Insert Mermaid Journey"
          >
            Journey
          </button>
        </div>
        <div
          className={
            isHorizontal
              ? "editor-preview-container-horizontal"
              : "editor-preview-container-parallel"
          }
        >
          <TextareaComponent />
          <PreviewComponent />
        </div>
      </div>
    </div>
  );
};

export default App;
