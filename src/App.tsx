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
  insertTimeLineSyntax,
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
} from './insertSave.ts';
import { 
  insertBoldSyntax,
  inserth1Syntax,
  inserth2Syntax,
  inserth3Syntax,
  inserth4Syntax,
  inserth5Syntax,
  inserth6Syntax,
  insertURLSyntax,
  insertImageSyntax,
  insertCodeSyntax,
  insertRulerSyntax,
  insertCheckSyntax,
  insertFootSyntax,
  insertTableSyntax,
  insertItalicSyntax,
  insertList1Syntax,
  insertList2Syntax,
  insertIndent1Syntax,
  insertIndent2Syntax,
  insertNewLineSyntax,
  insertBlockquoteSyntax,
  inserterPlainFlowSyntax,
  insertStrikethroughSyntax
} from './insertMarkdown.ts';

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
  const [showHeaderDropdown, setShowHeaderDropdown] = useState(false);

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
      console.log('Cursor cursorPositionRef App.tsx insertion:', cursorPositionRef.current);
    }
  }, [editorContent]);

  const toggleLayout = () => {
    setIsHorizontal(!isHorizontal);
  };

  const insertSymbol = (symbol: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText =
        editorContent.substring(0, start) +
        symbol +
        editorContent.substring(end);
  
      setEditorContent(newText);
      cursorPositionRef.current = start + symbol.length; // Update cursor position ref
  
      setTimeout(() => {
        textarea.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
        textarea.focus();
      }, 0);
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
        //onChange={(e) => setEditorContent(e.target.value)}
        className={isHorizontal ? 'textarea-horizontal' : 'textarea-parallel'}
        // Inside the onKeyDown event handler
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const target = e.target as HTMLTextAreaElement;
            const { selectionStart, selectionEnd } = target;
            const newValue = editorContent.substring(0, selectionStart) + '   \n' + editorContent.substring(selectionEnd);
            setEditorContent(newValue);
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.value = newValue; // Explicitly set the value of the textarea
                cursorPositionRef.current = selectionStart + 4; // Update cursor position
                textareaRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current); // Move cursor after the new line
              }
            }, 0);
          }
        }}
      />
    );
  });

  // PreviewComponent is a memoized component that renders the preview of the Markdown content
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

//TODO
  // insertBoldSyntax function inserts a bold syntax for Markdown
  const handleBoldSyntax = () => {
    insertBoldSyntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // insertNewLineSyntax function inserts a new line syntax for Markdown
  const handleNewLineSyntax = () => {
    insertNewLineSyntax(textareaRef, editorContent, setEditorContent);
  };

  // insertItalicSyntax function inserts an italic syntax for Markdown
  const handlerItalicSyntax = () => {
    insertItalicSyntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // insertStrikethroughSyntax function inserts a strikethrough syntax for Markdown
  const handlerStrikethroughSyntax = () => {
    insertStrikethroughSyntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // inserth1Syntax function inserts a h1 syntax for Markdown
  const handlerinserth1Syntax = () => {
    inserth1Syntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // inserth2Syntax function inserts a h2 syntax for Markdown
  const handlerinserth2Syntax = () => {
    inserth2Syntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // inserth3Syntax function inserts a h3 syntax for Markdown
  const handlerinserth3Syntax = () => {
    inserth3Syntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // inserth4Syntax function inserts a h4 syntax for Markdown
  const handlerinserth4Syntax = () => {
    inserth4Syntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // inserth5Syntax function inserts a h5 syntax for Markdown
  const handlerinserth5Syntax = () => {
    inserth5Syntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // inserth6Syntax function inserts a h6 syntax for Markdown
  const handlerinserth6Syntax = () => {
    inserth6Syntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // insertRulerSyntax function inserts a ruler syntax for Markdown
  const handlerinsertRulerSyntax = () => {
    insertRulerSyntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // insertCodeSyntax function inserts a code syntax for Markdown
  const handlerinsertCodeSyntax = () => {
    insertCodeSyntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // insertBlockquoteSyntax function inserts a blockquote syntax for Markdown
  const handlerinsertBlockCodeSyntax = () => {
    insertBlockquoteSyntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // insertIndent1Syntax function inserts an indent1 syntax for Markdown
  const handlerinsertIndent1Syntax = () => {
    insertIndent1Syntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // insertIndent2Syntax function inserts an indent2 syntax for Markdown
  const handlerinsertIndent2Syntax = () => {
    insertIndent2Syntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // insertList1Syntax function inserts a list2 syntax for Markdown
  const handlerinsertList1Syntax = () => {
    insertList1Syntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // insertList2Syntax function inserts a list2 syntax for Markdown
  const handlerinsertList2Syntax = () => {
    insertList2Syntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // insertImageSyntax function inserts a default and extended image syntax for Markdown
  const handlerImageSyntax = () => {
    insertImageSyntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // insertURLSyntax function inserts a default and extended URL syntax for Markdown
  const handlerURLSyntax = () => {
    insertURLSyntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // insertTableSyntax function inserts a default and extended table syntax for Markdown
  const handlerTableSyntax = () => {
    insertTableSyntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // insertCheckSyntax function inserts a default and extended check syntax for Markdown
  const handlerCheckSyntax = () => {
    insertCheckSyntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // insertFootSyntax function inserts a default and extended foot syntax for Markdown
  const handlerFootSyntax = () => {
    insertFootSyntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // Insert Mermaid classDiagram Syntax
  const handleInsertClass = () => {
    insertClassSyntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // Insert Mermaid GanttDiagram Syntax
  const handleGanttInsert = () => {
    insertGanttSyntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // Insert Mermaid GraphTD Syntax
  const handleGraphTDInsert = () => {
    insertGraphTDSyntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // Insert Mermaid FlowchartRL Syntax example
  const handleFlowchartRLInsert = () => {
    insertFlowchartRLSyntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // Insert Mermaid Journey Syntax
  const handleJourneyInsert = () => {
    insertJourneySyntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // Insert Mermaid Block example Syntax
  const handleBlockInsert = () => {
    inserterBlockSyntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // Insert Mermaid GitGraph Syntax
  const handleGitInsert = () => {
    inserterGitSyntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  // Insert Mermaid erDiagram Syntax
  const handleErDiagramInsert = () => {
    insertererDiagramSyntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  //
  const handleTimeLineSyntax = () => {
    insertTimeLineSyntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  }

  // inserterPlainFlowSyntax function inserts a plain flow syntax for Mermaid
  const handleInsertPlainFlow = () => {
    inserterPlainFlowSyntax(textareaRef, editorContent, setEditorContent, cursorPositionRef);
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
            onClick={() => window.location.reload()} title="Refresh"/>

            <div className="dropdown-container">
              <button 
                className="button-format"
                onClick={() => setShowHeaderDropdown(!showHeaderDropdown)}
                title="Header Options"
              >
                Headers
              </button>
              {showHeaderDropdown && (
                <div className="header-dropdown">
                  <button 
                    className="dropdown-item header1-button" 
                    onClick={() => {
                      handlerinserth1Syntax();
                      setShowHeaderDropdown(false);
                    }}> Header 1 </button>
                  <button 
                    className="dropdown-item header2-button" 
                    onClick={() => {
                      handlerinserth2Syntax();
                      setShowHeaderDropdown(false);
                    }}> Header 2 </button>
                  <button 
                    className="dropdown-item header3-button" 
                    onClick={() => {
                      handlerinserth3Syntax();
                      setShowHeaderDropdown(false);
                    }}> Header 3 </button>
                  <button 
                    className="dropdown-item header4-button" 
                    onClick={() => {
                      handlerinserth4Syntax();
                      setShowHeaderDropdown(false);
                    }}>Header 4 </button>
                  <button
                    className="dropdown-item header5-button"
                    onClick={() => {
                      handlerinserth5Syntax();
                      setShowHeaderDropdown(false);
                    }}>Header 5 </button>
                  <button
                    className="dropdown-item header6-button"
                    onClick={() => {
                      handlerinserth6Syntax();
                      setShowHeaderDropdown(false);
                    }}>Header 6 </button>
                </div>
              )}
            </div>

          <button className="button-format" onClick={handleBoldSyntax} title="Markdown make Text Bold">
            Bold
          </button>
          <button className="button-format" onClick={handlerItalicSyntax} title="Markdown make Text Italic">
            Italic
          </button>
          <button className="button-format" onClick={handlerStrikethroughSyntax} title="Markdown Strikethrough Text">
            <s>Strike</s>
          </button>
          <button className="button-format" onClick={handleNewLineSyntax} title="Markdown Strikethrough Text">
            NewLine &#11022;
          </button>
          &#8741;&nbsp;
          <button className="button" onClick={handlerinsertCodeSyntax} title="Markdown set text line as code">
            CodeLine &#10070;
          </button>
          <button className="button" onClick={handlerinsertBlockCodeSyntax} title="Markdown set text block as code">
            CodeBlock &#10070;
          </button>
          <button className="button" onClick={handlerinsertRulerSyntax} title="Markdown ruler / page split">
            Ruler &#8213;
          </button>
          <button className="button" onClick={handlerinsertIndent1Syntax} title="Markdown indent level 1">
            Indent &ge;
          </button>
          <button className="button" onClick={handlerinsertIndent2Syntax} title="Markdown indent level 2">
            Indent &gt;&gt;
          </button>
          <button className="button" onClick={handlerinsertList1Syntax} title="Markdown list level 1">
            List  &#10687;
          </button>
          <button className="button" onClick={handlerinsertList2Syntax} title="Markdown list level 2">
            List &#10687; &#10687;
          </button>
          <button className="button" onClick={handlerImageSyntax} title="Markdown insert image example">
            Image &#128443;
          </button>
          <button className="button" onClick={handlerURLSyntax} title="Markdown insert URL example">
            URL &#128279;
          </button>
          <button className="button" onClick={handlerTableSyntax} title="Markdown pre-defined table example">
            Table &#128196;
          </button>
          <button className="button" onClick={handlerFootSyntax} title="Markdown pre-defined foot note example">   
            FootNote &#9870;
          </button>
          <button className="button-mermaid" onClick={handleJourneyInsert} title="Insert Mermaid Journey example">
            Journey &#9948;
          </button>
          <button className="button-mermaid" onClick={handleFlowchartRLInsert} title="Insert Mermaid flowchartRL example">
            Flowchart &#8866; | &#8867;
          </button>
          <button className="button-mermaid" onClick={handleGanttInsert} title="Insert Mermaid Gantt chart" >
            Gantt &#8760;
          </button>
          <button className="button-mermaid" onClick={handleGraphTDInsert} title="Insert Mermaid GraphTD example of a product life cycle">
            GraphTD &#9797;
          </button>
          <button className="button-mermaid" onClick={handleErDiagramInsert} title="Insert Mermaid erDiagram">
            erDiag &#8757;
          </button>
          <button className="button-mermaid" onClick={handleTimeLineSyntax} title="Markdown pre-defined TimeLine example">
            TimeLine &#8868;
          </button>
          
          &#8741;&nbsp;
          <button className='button-mermaid' onClick={() => setTableModalOpen(true)} title="Support Creating a Markdown Table">
            Auto Table &#8711;
          </button>
          <TableGenerator
            isOpen={tableModalOpen}
            onClose={() => setTableModalOpen(false)}
            onInsert={(tableText) => {
              setEditorContent(editorContent + tableText);
              setTableModalOpen(false);
            }}
          />
          <button className='button-mermaid' onClick={() => setGanttModalOpen(true)} title="Support Creating a Mermaid Gantt Chart">
            Auto Gantt &#8711;
          </button>
          <GanttGenerator
            isOpen={ganttModalOpen}
            onClose={() => setGanttModalOpen(false)}
            onInsert={(ganttText) => {
              setEditorContent(editorContent + ganttText);
              setGanttModalOpen(false);
            }}/>
        </div>
        <div className="toolbar">
          <button className="button" onClick={handlerCheckSyntax} title="Markdown check / uncheck example">
          &#9744;&nbsp;&#8741;&nbsp;&#9745;
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
            className="button-mermaid" onClick={handleInsertPlainFlow} title="Insert Plaintext flowChart">
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
