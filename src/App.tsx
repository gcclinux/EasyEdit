import React, { useRef, useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import rehypeRaw from 'rehype-raw';
import debounce from 'lodash.debounce';
import './App.css';
import markdownMarkWhite from './assets/md.svg';
import { IpcRendererEvent } from 'electron';
const { ipcRenderer } = window.require('electron');
import { saveAsPDF } from './saveAsPDF.tsx';
import {
  insertClassSyntax,
  insertGanttSyntax,
  insertGraphTDSyntax,
  insertFlowchartRLSyntax,
  insertJourneySyntax,
  inserterBlockSyntax,
  inserterGitSyntax,
  insertererDiagramSyntax
} from './insertMermaid.ts';
import { TableGenerator } from './autoGenerator/TableGenerator.tsx';
import { GanttGenerator } from './autoGenerator/GanttGenerator.tsx';
import { 
  HistoryState, 
  addToHistory, 
  handleUndo, 
  handleClear, 
  handleRedo,
  handleOpenClick,
  saveToFile,
  saveToTxT,
  saveToHTML 
} from './mainHandler.ts';

const App = () => {
  const [documentHistory, setDocumentHistory] = useState<HistoryState[]>([]);
  const [editorContent, setEditorContent] = useState<string>('');
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isHorizontal, setIsHorizontal] = useState<boolean>(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cursorPositionRef = useRef<number>(0);
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [ganttModalOpen, setGanttModalOpen] = useState(false);

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

  const insertSymbol3 = () => insertSymbol("&#8710;");
  const insertSymbol4 = () => insertSymbol("&#8711;");
  const insertSymbol5 = () => insertSymbol("&#8721;");
  const insertSymbol6 = () => insertSymbol("&#8730;");
  const insertSymbol7 = () => insertSymbol("&#8734;");
  const insertSymbol8 = () => insertSymbol("&#8735;");
  const insertSymbol9 = () => insertSymbol("&#8736;");
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

  // insertImageSyntax function inserts a default and extended image syntax for Markdown
  const insertImageSyntax = () => {
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
      setTimeout(() => {
        const newCursorPosition = start + imageText.length;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        textarea.focus();
      }, 0);
    }
  };

  // insertURLSyntax function inserts a url example syntax for Markdown
  const insertURLSyntax = () => {
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

  // Insert Mermaid classDiagram Syntax
  const handleInsertClass = () => {
    insertClassSyntax(textareaRef, editorContent, setEditorContent);
  };

  // Insert Mermaid GanttDiagram Syntax
  const handleGanttInsert = () => {
    insertGanttSyntax(textareaRef, editorContent, setEditorContent);
  };

  // Insert Mermaid GraphTD Syntax
  const handleGraphTDInsert = () => {
    insertGraphTDSyntax(textareaRef, editorContent, setEditorContent);
  };

  // Insert Mermaid FlowchartRL Syntax example
  const handleFlowchartRLInsert = () => {
    insertFlowchartRLSyntax(textareaRef, editorContent, setEditorContent);
  };

  // Insert Mermaid Journey Syntax
  const handleJourneyInsert = () => {
    insertJourneySyntax(textareaRef, editorContent, setEditorContent);
  };

  // Insert Mermaid Block example Syntax
  const handleBlockInsert = () => {
    inserterBlockSyntax(textareaRef, editorContent, setEditorContent);
  };

  // Insert Mermaid GitGraph Syntax
  const handleGitInsert = () => {
    inserterGitSyntax(textareaRef, editorContent, setEditorContent);
  };

  // Insert Mermaid erDiagram Syntax
  const handleErDiagramInsert = () => {
    insertererDiagramSyntax(textareaRef, editorContent, setEditorContent);
  };


  const inserterPlainFlowSyntax = () => {
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
      setTimeout(() => {
        const newCursorPosition = start + checkText.length;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        textarea.focus();
      }, 0);
    }
  };

  // SaveAsPDF function
  const handleSaveAsPDF = () => {
    saveAsPDF(editorContent);
  };

  // Update effect to include cursor position
  useEffect(() => {
    if (editorContent !== documentHistory[historyIndex]?.content) {
      addToHistory(
        editorContent, 
        cursorPositionRef.current,
        documentHistory,
        historyIndex,
        setDocumentHistory,
        setHistoryIndex
      );
    }
  }, [editorContent]);

  // Update cursor position effect
  useEffect(() => {
    if (textareaRef.current) {
      const pos = cursorPositionRef.current;
      textareaRef.current.setSelectionRange(pos, pos);
      textareaRef.current.focus();
    }
  }, [editorContent, historyIndex]);

  return (
    <div className="container">
      <div className="menubar">
      <button className="menu-item" onClick={toggleLayout}>
          Toggle Layout &#8646;
        </button>
          <button className="menu-item" onClick={() => handleOpenClick(setEditorContent)}>
            Load Document &#128194;
          </button>  
          <button 
            className="menu-item" 
            onClick={() => handleUndo(historyIndex, documentHistory, setHistoryIndex, setEditorContent, cursorPositionRef)}
            disabled={historyIndex <= 0}
          >
            Undo &#8630;
          </button>
          <button
            className="menu-item"
            onClick={() => handleClear(setEditorContent)}
          >
            Clear &#128465;
          </button>
          <button 
            className="menu-item" 
            onClick={() => handleRedo(historyIndex, documentHistory, setHistoryIndex, setEditorContent, cursorPositionRef)}
            disabled={historyIndex >= documentHistory.length - 1}
          >
            Redo &#8631;
          </button>
          <button className="menu-item" onClick={() => saveToFile(editorContent)}>
            Save as MD &#128190;
          </button>
          <button className="menu-item" onClick={() => saveToTxT(editorContent)}>
            Save as Text &#128462;
          </button>
          <button className="menu-item" onClick={() => saveToHTML(editorContent)}>
            Save as HTML &#128462;
          </button>
          <button className="menu-item" onClick={handleSaveAsPDF}>
            Save as PDF &#128462;
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
            Ruler &#8213;
          </button>
          <button className="button" onClick={insertIndent1Syntax}>
            Indent &ge;
          </button>
          <button className="button" onClick={insertIndent2Syntax}>
            Indent &ge;&gt;
          </button>
          <button className="button" onClick={insertList1Syntax}>
            List  &#10687;
          </button>
          <button className="button" onClick={insertList2Syntax}>
            List &#10687; &#10687;
          </button>
          <button className="button" onClick={insertImageSyntax}>
            Image &#128443;
          </button>
          <button className="button" onClick={insertTableSyntax}>
            Table &#128196;
          </button>
          <button className="button" onClick={insertURLSyntax}>
            URL &#128279;
          </button>
          <button
            className='button'
            onClick={() => setTableModalOpen(true)}
            title="Support Creating a Markdown Table"
          >
            Custom Table &#8711;
          </button>
          <TableGenerator
            isOpen={tableModalOpen}
            onClose={() => setTableModalOpen(false)}
            onInsert={(tableText) => {
              setEditorContent(editorContent + tableText);
              setTableModalOpen(false);
            }}
          />
          <button className="button" onClick={insertFootSyntax}>
            FootNote &#9870;
          </button>
          <button
            className="button-mermaid"
            onClick={handleFlowchartRLInsert}
            title="Insert Mermaid flowchartRL example"
          >
            Flowchart &#8866; | &#8867;
          </button>
          <button
            className="button-mermaid"
            onClick={handleGanttInsert}
            title="Insert Mermaid Gantt chart"
          >
            Gantt &#8760;
          </button>
          <button
            className="button-mermaid"
            onClick={handleGraphTDInsert}
            title="Insert Mermaid GraphTD example of a product life cycle"
          >
            GraphTD &#9797;
          </button>
          <button
            className="button-mermaid"
            onClick={handleErDiagramInsert}
            title="Insert Mermaid erDiagram"
          >
            erDiag &#8757;
          </button>
          <button
            className='button-mermaid'
            onClick={() => setGanttModalOpen(true)}
            title="Support Creating a Mermaid Gantt Chart"
          >
            Custom Gantt &#8711;
          </button>
          <GanttGenerator
            isOpen={ganttModalOpen}
            onClose={() => setGanttModalOpen(false)}
            onInsert={(ganttText) => {
              setEditorContent(editorContent + ganttText);
              setGanttModalOpen(false);
            }}
          />
        </div>
        <div className="toolbar">
          <button className="button" onClick={insertCheckSyntax}>
            &#9745;
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
            onClick={inserterPlainFlowSyntax}
            title="Insert Plaintext flowChart"
          >
            TextChart &#9781;
          </button>
          <button
            className="button-mermaid"
            onClick={handleInsertClass}
            title="Insert Mermaid classDiag"
          >
            ClassDiag &#8756;
          </button>
          <button
            className="button-mermaid"
            onClick={handleGitInsert}
            title="Insert Mermaid gitGraph example"
          >
            gitGraph &#9903;
          </button>
          <button
            className="button-mermaid"
            onClick={handleBlockInsert}
            title="Insert Mermaid Block (beta) example"
          >
            Block &#8759;
          </button>
          <button
            className="button-mermaid"
            onClick={handleJourneyInsert}
            title="Insert Mermaid Journey example"
          >
            Journey &#9948;
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
