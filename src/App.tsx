import React, { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  FaUndo,
  FaRedo,
  FaTrash,
  FaExchangeAlt,
  FaFileImport,
  FaInfoCircle,
  FaGithub,
  FaHeart,
  FaStar,
  FaTable,
  FaLink,
  FaImage,
  FaStickyNote,
  FaDownload,
  FaFilePdf,
  FaFileCode,
  FaFileAlt,
  FaLock
} from 'react-icons/fa';
import { VscSymbolKeyword } from "react-icons/vsc";
import { GoTasklist } from "react-icons/go";
import { GrDocumentText } from "react-icons/gr";
import { AiOutlineLayout } from "react-icons/ai";
import { BsFileEarmarkLockFill, BsJournalBookmarkFill, BsKanban, BsClipboard2Check, BsPersonWorkspace, BsTropicalStorm, BsFillBugFill, BsDiagram3 } from "react-icons/bs";
import { GiJourney } from "react-icons/gi";
import { SiMermaid } from "react-icons/si";
import { CgFormatText, CgFormatHeading } from "react-icons/cg";
import { MdAutoAwesome, MdOutlineInsertChartOutlined } from "react-icons/md";

import mermaid from 'mermaid';
import debounce from 'lodash.debounce';
import './App.css';
// import { IpcRendererEvent } from 'electron';
// const electronAPI = (window as any).electronAPI;
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
import {
  insertUMLClassDiagram,
  insertUMLSequenceDiagram,
  insertUMLUseCaseDiagram,
  insertUMLActivityDiagram,
  insertUMLComponentDiagram,
  insertUMLStateDiagram
} from './insertUML.ts';
import { TableGenerator } from './autoGenerator/TableGenerator.tsx';
import { GanttGenerator } from './autoGenerator/GanttGenerator.tsx';
import { TimelineGenerator } from './autoGenerator/TimelineGenerator.tsx';
import ContextMenu from './autoGenerator/ContextMenu.tsx';
import { 
  HistoryState, 
  addToHistory, 
  handleUndo, 
  handleClear, 
  handleRedo,
  handleOpenClick,
  saveToHTML,
  saveToFile,
  saveToTxT
} from './insertSave.ts';
import { 
  insertBoldSyntax,
  inserth1Syntax,
  inserth2Syntax,
  inserth3Syntax,
  inserth4Syntax,
  inserth5Syntax,
  inserth6Syntax,
  insertCodeSyntax,
  insertRulerSyntax,
  insertItalicSyntax,
  insertList1Syntax,
  insertList2Syntax,
  insertIndent1Syntax,
  insertIndent2Syntax,
  insertNewLineSyntax,
  insertBlockquoteSyntax,
  insertStrikethroughSyntax
} from './insertMarkdown.ts';
import TextareaComponent from './components/TextareaComponent.tsx';
import PreviewComponent from './components/PreviewComponent.tsx';
import HeaderDropdown from './components/HeaderDropdown';
import FormatDropdown from './components/FormatDropdown';
import MermaidDropdown from './components/MermaidDropdown';
import UMLDropdown from './components/UMLDropdown';
import InsertDropdown from './components/InsertDropdown';
import ImagesDropdown from './components/ImagesDropdown';
import LinksDropdown from './components/LinksDropdown';
import TablesDropdown from './components/TablesDropdown';
import FooterDropdown from './components/FooterDropdown';
import SymbolsDropdown from './components/SymbolsDropdown';
import IconsDropdown from './components/IconsDropdown';
import AutoDropdown from './components/AutoDropdown';
import { buildDailyJournalTemplate } from './templates/dailyJournal';
import { buildMeetingNotesTemplate } from './templates/meetingNotes';
import { buildProjectPlanTemplate } from './templates/projectPlan';
import { buildStudyNotesTemplate } from './templates/studyNotes';
import { buildTravelLogsTemplate } from './templates/travelLogs';
import { buildWorkoutLogTemplate } from './templates/workoutLog';
import { buildBugReportTemplate } from './templates/bugReport';
import { buildDiagramExamplesTemplate } from './templates/diagramExamples';
import AboutModal from './components/AboutModal';
import FeaturesModal from './components/FeaturesModal';
import taskTemplates from './templates/tasks';
import { encryptContent, decryptFile } from './cryptoHandler';
import PasswordModal from './components/PasswordModal';

const App = () => {
  const [documentHistory, setDocumentHistory] = useState<HistoryState[]>([]);
  const [editorContent, setEditorContent] = useState<string>('');
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isHorizontal, setIsHorizontal] = useState<boolean>(false);
  const previewRef = useRef<HTMLDivElement>(null!);
  const textareaRef = useRef<HTMLTextAreaElement>(null!);
  const cursorPositionRef = useRef<number>(0);
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [ganttModalOpen, setGanttModalOpen] = useState(false);
  const [timelineModalOpen, setTimelineModalOpen] = useState(false);
  const [showHeaderDropdown, setShowHeaderDropdown] = useState(false);
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  const [showMermaidDropdown, setShowMermaidDropdown] = useState(false);
  const [showUMLDropdown, setShowUMLDropdown] = useState(false);
  const [showSymbolsDropdown, setShowSymbolsDropdown] = useState(false);
  const [showIconsDropdown, setShowIconsDropdown] = useState(false);
  const [showAutoDropdown, setShowAutoDropdown] = useState(false);
  const [showLinksDropdown, setShowLinksDropdown] = useState(false);
  const [showTablesDropdown, setShowTablesDropdown] = useState(false);
  const [showFooterDropdown, setShowFooterDropdown] = useState(false);
  const [showInsertDropdown, setShowInsertDropdown] = useState(false);
  const [showImagesDropdown, setShowImagesDropdown] = useState(false);
  const [showExportsDropdown, setShowExportsDropdown] = useState(false);
  const exportsButtonRef = useRef<HTMLButtonElement | null>(null);
  const [exportsPos, setExportsPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const [showTemplatesDropdown, setShowTemplatesDropdown] = useState(false);
  const templatesButtonRef = useRef<HTMLButtonElement | null>(null);
  const [templatesPos, setTemplatesPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const [showHelpDropdown, setShowHelpDropdown] = useState(false);
  const helpButtonRef = useRef<HTMLButtonElement | null>(null);
  const [helpPos, setHelpPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [showTasksDropdown, setShowTasksDropdown] = useState(false);
  const tasksButtonRef = useRef<HTMLButtonElement | null>(null);
  const [tasksPos, setTasksPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const [isEditFull, setIsEditFull] = useState<boolean>(false);
  
  const [isPreviewFull, setIsPreviewFull] = useState<boolean>(false);
  const [passwordModalConfig, setPasswordModalConfig] = useState<{
    open: boolean;
    title: string;
    promptText: string;
    onSubmit: (password: string) => void;
  }>({
    open: false,
    title: '',
    promptText: '',
    onSubmit: () => {},
  });
  const lineHeightValue = useRef<number>(1);

  // Detect Electron environment and add class to body for CSS targeting
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      document.body.classList.add('electron-app');
    }
  }, []);

  // Selection state fixing the issue with the Headers selection
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);
  const cacheSelection = () => {
    if (textareaRef.current) {
      setSelectionStart(textareaRef.current.selectionStart);
      setSelectionEnd(textareaRef.current.selectionEnd);
    }
  };

  // Add these state declarations near your other states
  const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number }>({
    visible: false,
    x: 0,
    y: 0
  });

  // Add state for cached selection
  const [cachedSelection, setCachedSelection] = useState<{start: number, end: number} | null>(null);

  // Add this handler function
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    if (textareaRef.current) {
      setCachedSelection({
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd
      });
    }
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY
    });
    textareaRef.current?.focus(); // Ensure textarea remains focused
  };

  // Add this effect to handle clicking outside
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (textareaRef.current && !textareaRef.current.contains(event.target as Node)) {
        setContextMenu({ visible: false, x: 0, y: 0 });
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleClosePasswordModal = () => {
    setPasswordModalConfig({ ...passwordModalConfig, open: false });
  };

  const showPasswordPrompt = (
    title: string,
    promptText: string,
    onSubmit: (password: string) => void
  ) => {
    setPasswordModalConfig({
      open: true,
      title,
      promptText,
      onSubmit: (password) => {
        onSubmit(password);
        handleClosePasswordModal();
      },
    });
  };

  

  // Initialize Mermaid diagrams
  const initializeMermaid = useCallback(
    debounce(() => {
      if (previewRef.current) {
        mermaid.initialize({
          startOnLoad: true,
          theme: 'default',
        });
        const mermaidElements = previewRef.current.querySelectorAll('.mermaid');
        mermaidElements.forEach((element) => {
          mermaid.init(undefined, element as HTMLElement);
        });
      }
    }, 300),
    []
  );

  // Add event listener for Mermaid diagram rendering
  useEffect(() => {
    initializeMermaid();
  }, [editorContent, initializeMermaid]);

  // Handle change function for the textarea
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    cursorPositionRef.current = e.target.selectionStart;
    setEditorContent(e.target.value);
  };

  // First, define the interface for electronAPI
  interface ElectronAPI {
    handleFileOpened?: (callback: any) => void;
    handlePreviewSpacing?: (callback: any) => void;
    getLineHeight?: () => void;
    setLineHeight?: (callback: any) => void;
    openExternal?: (url: string) => Promise<any>;
  }

  // Update the electronAPI declaration
  const electronAPI = (window as any).electronAPI as ElectronAPI | undefined;

  // Add event listeners for file-opened and update-paragraph-spacing for rendering
  useEffect(() => {
    if (!electronAPI) {
      console.log('Running in browser mode - some features disabled');
      return;
    }

    const fileOpenedHandler = (_event: any, content: string) => {
      setEditorContent(content);
    };

    const previewSpacingHandler = (_event: any, { action }: { action: string }) => {
      let previewLineHeight = 1.1;
      let newLineHeight = previewLineHeight;
      if (action === 'increase' && previewLineHeight < 1.9) {
        newLineHeight = Math.min(1.9, previewLineHeight + 0.1);
        lineHeightValue.current = newLineHeight;
      } else if (action === 'decrease' && previewLineHeight > 0.9) {
        newLineHeight = Math.max(1.0, previewLineHeight - 0.1);
        lineHeightValue.current = newLineHeight;
      }

      newLineHeight = Math.round(newLineHeight * 10) / 10;
      if (newLineHeight !== previewLineHeight) {
        const previewElements = document.querySelectorAll(
          '.preview-horizontal, .preview-parallel, .preview-horizontal-full'
        );
        previewElements.forEach((element) => {
          const htmlElement = element as HTMLElement;
          htmlElement.style.lineHeight = newLineHeight.toString();
        });
      }
    };

    const lineHeightHandler = (value: number) => {
      lineHeightValue.current = value;
    };

    // Set up event listeners if available
    if (electronAPI.handleFileOpened) {
      electronAPI.handleFileOpened(fileOpenedHandler);
    }
    if (electronAPI.handlePreviewSpacing) {
      electronAPI.handlePreviewSpacing(previewSpacingHandler);
    }
    if (electronAPI.getLineHeight && electronAPI.setLineHeight) {
      electronAPI.getLineHeight();
      electronAPI.setLineHeight(lineHeightHandler);
    }

    // Cleanup: if the electron API provided deregister functions they'd be called here.
    return () => {
      // no-op cleanup (electron handlers are assumed to be one-shot registrations)
    };
  }, [lineHeightValue]);

  // Restore cursor position effect
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
      textareaRef.current.focus();
    }
  }, [editorContent]);
  
  // toggleEdit function
  const toggleEdit = () => {
    setIsEditFull(!isEditFull);
    setIsPreviewFull(false);
    if (!isEditFull) {
      // No change needed when entering full mode
    } else {
      // When exiting full mode (isEditFull becoming false)
      setIsHorizontal(false);
    }
  };

  // togglePreview function
  const togglePreview = () => {
    setIsPreviewFull(!isPreviewFull);
    setIsEditFull(false);
    if (!isPreviewFull) {
      // No change needed when entering full mode
    } else {
      // When exiting full mode
      setIsHorizontal(false);
    }
  };

  // insertSymbol function inserts a symbol into the textarea
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

  // Templates moved to src/templates/*.ts


// insertSymbol function inserts a symbol into the textarea
  const insertSymbol3 = () => insertSymbol("&#8710;");
  const insertSymbol4 = () => insertSymbol("&#8711;");
  const insertSymbol5 = () => insertSymbol("&#8721;");
  const insertSymbol6 = () => insertSymbol("&#8730;");
  const insertSymbol7 = () => insertSymbol("&#8734;");
  const insertSymbol8 = () => insertSymbol("&#8470;");
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
  const insertSymbol27 = () => insertSymbol("&#8482;");
  // insertIcon inserts an emoji/icon into the editor
  const insertIcon = (icon: string) => insertSymbol(icon);

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

  //TODO
  // inserth1Syntax function inserts a h1 syntax for Markdown
  const handlerinserth1Syntax = () => {
      if (selectionStart !== null && selectionEnd !== null) {
        inserth1Syntax(textareaRef, editorContent, setEditorContent, cursorPositionRef, selectionStart, selectionEnd);
      }
  };

  // inserth2Syntax function inserts a h2 syntax for Markdown
  const handlerinserth2Syntax = () => {
    if (selectionStart !== null && selectionEnd !== null) {
      inserth2Syntax(textareaRef, editorContent, setEditorContent, cursorPositionRef, selectionStart, selectionEnd);
    }
  };

  // inserth3Syntax function inserts a h3 syntax for Markdown
  const handlerinserth3Syntax = () => {
    if (selectionStart !== null && selectionEnd !== null) {
      inserth3Syntax(textareaRef, editorContent, setEditorContent, cursorPositionRef, selectionStart, selectionEnd);
    }
  };

  // inserth4Syntax function inserts a h4 syntax for Markdown
  const handlerinserth4Syntax = () => {
    if (selectionStart !== null && selectionEnd !== null) {
      inserth4Syntax(textareaRef, editorContent, setEditorContent, cursorPositionRef, selectionStart, selectionEnd);
    }
  };

  // inserth5Syntax function inserts a h5 syntax for Markdown
  const handlerinserth5Syntax = () => {
    if (selectionStart !== null && selectionEnd !== null) {
      inserth5Syntax(textareaRef, editorContent, setEditorContent, cursorPositionRef, selectionStart, selectionEnd);
    }
  };

  // inserth6Syntax function inserts a h6 syntax for Markdown
  const handlerinserth6Syntax = () => {
    if (selectionStart !== null && selectionEnd !== null) {
      inserth6Syntax(textareaRef, editorContent, setEditorContent, cursorPositionRef, selectionStart, selectionEnd);
    }
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
  

  // Insert an arbitrary image/link markdown template into the editor
  const handleInsertImageTemplate = (markdownTemplate: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = editorContent.substring(0, start) + markdownTemplate + editorContent.substring(end);
    setEditorContent(newText);
    // Place cursor after inserted template
    cursorPositionRef.current = start + markdownTemplate.length;
    setTimeout(() => {
      textarea.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
      textarea.focus();
    }, 0);
  };



  

  

  // insertFootSyntax function inserts a default and extended foot syntax for Markdown
  

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

  // UML Diagram Handlers
  const handleUMLClassDiagram = () => {
    insertUMLClassDiagram(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  const handleUMLSequenceDiagram = () => {
    insertUMLSequenceDiagram(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  const handleUMLUseCaseDiagram = () => {
    insertUMLUseCaseDiagram(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  const handleUMLActivityDiagram = () => {
    insertUMLActivityDiagram(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  const handleUMLComponentDiagram = () => {
    insertUMLComponentDiagram(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  const handleUMLStateDiagram = () => {
    insertUMLStateDiagram(textareaRef, editorContent, setEditorContent, cursorPositionRef);
  };

  

  // SaveAsPDF function
  const handleSaveAsPDF = () => {
    saveAsPDF(editorContent);
  };

  // Save to HTML wrapper
  const handleSaveToHTML = () => {
    saveToHTML(editorContent);
  };

  // Save to Markdown wrapper
  const handleSaveToMarkdown = () => {
    saveToFile(editorContent);
  };

  // Save to TXT wrapper
  const handleSaveToTXT = () => {
    saveToTxT(editorContent);
  };

  // Save Encrypted wrapper
  const handleSaveEncrypted = () => {
    encryptContent(editorContent, (onSubmit) => {
      showPasswordPrompt(
        'Encrypt Content',
        'Enter a password to encrypt the file (min 8 characters):',
        onSubmit
      );
    });
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

  // Add this function near other utility functions
  const getEditorPreviewContainerClass = () => {
    if (isEditFull) {
      return "editor-preview-container-horizontal"; // Always use horizontal container in full mode
    }
    return isHorizontal 
      ? "editor-preview-container-horizontal"
      : "editor-preview-container-parallel";
  };

  return (
    <div className="container">
      <div className="menubar">
        <div className="dropdown-container">
            <button
              className="help-menubar-btn"
              ref={el => { helpButtonRef.current = el; }}
              onMouseDown={(e) => {
                e.preventDefault();
                const willShow = !showHelpDropdown;
                setShowHelpDropdown(willShow);
                if (willShow && helpButtonRef.current) {
                  const rect = helpButtonRef.current.getBoundingClientRect();
                  const scrollX = window.scrollX || window.pageXOffset || 0;
                  const scrollY = window.scrollY || window.pageYOffset || 0;
                  const dropdownMin = 140; // same minWidth used in portal
                  const dropdownWidth = Math.max(rect.width, dropdownMin);
                  // Center the dropdown under the button
                  let leftPos = rect.left + scrollX + (rect.width - dropdownWidth) / 2;
                  // Clamp to keep on-screen
                  leftPos = Math.max(0, leftPos);
                  setHelpPos({ top: rect.bottom + scrollY, left: leftPos, width: dropdownWidth });
                } else {
                  setHelpPos(null);
                }
              }}
              title="Help"
            >
              <FaFileImport /> &nbsp; File ▾
            </button>
            {showHelpDropdown && helpPos && createPortal(
              <div className="header-dropdown format-dropdown" style={{ position: 'absolute', top: helpPos.top + 'px', left: helpPos.left + 'px', zIndex: 999999, minWidth: helpPos.width + 'px' }}>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    handleOpenClick(setEditorContent);
                    setShowHelpDropdown(false);
                  }}
                >
                  <div className="hdr-title"><FaFileImport /> Open MarkDown</div>
                  <div className="hdr-desc">Open markdown .md file</div>
                </button>
                <div className="hdr-sep" />
                <button
                  className="dropdown-item"
                  onClick={() => {
                    const showPrompt = (onSubmit: (password: string) => void) => 
                      showPasswordPrompt('Decrypt File', 'Enter the password for the .sstp file.', onSubmit);
                    decryptFile(setEditorContent, showPrompt);
                    setShowHelpDropdown(false);
                  }}
                >
                  <div className="hdr-title"><BsFileEarmarkLockFill /> Open Encrypted</div>
                  <div className="hdr-desc">Open encrypted .sstp file</div>
                </button>
                <div className="hdr-sep" />
                <button className="dropdown-item" onClick={() => { setFeaturesOpen(true); setShowHelpDropdown(false); }}>
                  <div className="hdr-title"><FaStar /> Features</div>
                  <div className="hdr-desc">View latest features</div>
                </button>
                <div className="hdr-sep" />
                  <button className="dropdown-item" onClick={async () => {
                    const url = 'https://github.com/gcclinux/EasyEdit/discussions';
                    let opened = false;
                    try {
                      if (electronAPI && electronAPI.openExternal) {
                        const res = await electronAPI.openExternal(url);
                        if (res && res.success) opened = true;
                        else console.warn('openExternal returned failure:', res);
                      } else {
                        const w = window.open(url, '_blank', 'noopener');
                        if (w) opened = true;
                      }
                    } catch (e) {
                      console.warn('openExternal/window.open threw:', e);
                    }

                    if (!opened) {
                      // Try to copy to clipboard as a last-resort fallback and inform the user
                      try {
                        await navigator.clipboard.writeText(url);
                        alert('Unable to open link automatically. The URL has been copied to your clipboard:\n' + url);
                      } catch (e) {
                        // If clipboard isn't available, just show the URL to the user
                        alert('Unable to open or copy link automatically. Please open this URL manually:\n' + url);
                      }
                    }

                    setShowHelpDropdown(false);
                  }}>
                    <div className="hdr-title"><FaGithub /> Support</div>
                    <div className="hdr-desc">Support & Discussion</div>
                  </button>
                <div className="hdr-sep" />
                <button className="dropdown-item" onClick={async () => {
                    const url = 'https://buymeacoffee.com/gcclinux';
                    let opened = false;
                    try {
                      if (electronAPI && electronAPI.openExternal) {
                        const res = await electronAPI.openExternal(url);
                        if (res && res.success) opened = true;
                        else console.warn('openExternal returned failure:', res);
                      } else {
                        const w = window.open(url, '_blank', 'noopener');
                        if (w) opened = true;
                      }
                    } catch (e) {
                      console.warn('openExternal/window.open threw:', e);
                    }

                    if (!opened) {
                      // Try to copy to clipboard as a last-resort fallback and inform the user
                      try {
                        await navigator.clipboard.writeText(url);
                        alert('Unable to open link automatically. The URL has been copied to your clipboard:\n' + url);
                      } catch (e) {
                        // If clipboard isn't available, just show the URL to the user
                        alert('Unable to open or copy link automatically. Please open this URL manually:\n' + url);
                      }
                    }

                    setShowHelpDropdown(false);
                  }}>
                    <div className="hdr-title"><FaHeart /> Buy me a coffee ★</div>
                    <div className="hdr-desc">Sponsor the project</div>
                  </button>
                <div className="hdr-sep" />
                <button className="dropdown-item" onClick={() => { setAboutOpen(true); setShowHelpDropdown(false); }}>
                  <div className="hdr-title"><FaInfoCircle /> About</div>
                  <div className="hdr-desc">EasyEdit version and info</div>
                </button>
              </div>, document.body
            )}
          </div>
        <button className="menu-item fixed-menubar-btn" onClick={toggleEdit}>
          <FaExchangeAlt /> &nbsp; Toggle Edit
        </button>
        <button className="menu-item fixed-menubar-btn" onClick={togglePreview}>
          <FaExchangeAlt /> &nbsp; Toggle Preview
        </button>
          <button 
            className="menu-item fixed-menubar-btn" 
            onClick={() => handleUndo(historyIndex, documentHistory, setHistoryIndex, setEditorContent, cursorPositionRef)}
            disabled={historyIndex <= 0}
          >
            <FaUndo /> &nbsp; Undo
          </button>
          <button
            className="menu-item fixed-menubar-btn"
            onClick={() => handleClear(setEditorContent)}
          >
            <FaTrash /> &nbsp; Clear
          </button>
          <button 
            className="menu-item fixed-menubar-btn" 
            onClick={() => handleRedo(historyIndex, documentHistory, setHistoryIndex, setEditorContent, cursorPositionRef)}
            disabled={historyIndex >= documentHistory.length - 1}
          >
            <FaRedo /> &nbsp; Redo
          </button>
          <div className="dropdown-container">
            <button
              className="menu-item fixed-menubar-btn"
              ref={el => { tasksButtonRef.current = el; }}
              onMouseDown={(e) => {
                e.preventDefault();
                cacheSelection();
                const willShow = !showTasksDropdown;
                setShowTasksDropdown(willShow);
                if (willShow && tasksButtonRef.current) {
                  const rect = tasksButtonRef.current.getBoundingClientRect();
                  setTasksPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
                } else {
                  setTasksPos(null);
                }
              }}
              title="Tasks"
            >
              <GoTasklist /> &nbsp; Tasks ▾
            </button>
            {showTasksDropdown && tasksPos && createPortal(
              <div
                className="header-dropdown format-dropdown"
                style={{ position: 'absolute', top: tasksPos.top + 'px', left: tasksPos.left + 'px', zIndex: 999999, minWidth: tasksPos.width + 'px' }}
              >
                {taskTemplates.map((t, idx) => (
                  <div key={idx}>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        handleInsertImageTemplate(t.markdown + '\n\n');
                        setShowTasksDropdown(false);
                        setTasksPos(null);
                      }}
                    >
                      <div className="hdr-title"><GoTasklist /> {t.label}</div>
                      <div className="hdr-desc">{t.description}</div>
                    </button>
                    <div className="hdr-sep" />
                  </div>
                ))}
              </div>,
              document.body
            )}
          </div>
          <div className="dropdown-container">
            <button
              className="menu-item fixed-menubar-btn"
              ref={el => { templatesButtonRef.current = el; }}
              onMouseDown={(e) => {
                e.preventDefault();
                cacheSelection();
                const willShow = !showTemplatesDropdown;
                setShowTemplatesDropdown(willShow);
                if (willShow && templatesButtonRef.current) {
                  const rect = templatesButtonRef.current.getBoundingClientRect();
                  setTemplatesPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
                } else {
                  setTemplatesPos(null);
                }
              }}
              title="Templates"
            >
              <GrDocumentText /> &nbsp; Templates ▾
            </button>
            {showTemplatesDropdown && templatesPos && createPortal(
              <div
                className="header-dropdown format-dropdown"
                style={{ position: 'absolute', top: templatesPos.top + 'px', left: templatesPos.left + 'px', zIndex: 999999, minWidth: templatesPos.width + 'px' }}
              >
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      const tpl = buildDailyJournalTemplate(new Date());
                      handleInsertImageTemplate(tpl + '\n\n');
                      setShowTemplatesDropdown(false);
                      setTemplatesPos(null);
                    }}
                  >
                    <div className="hdr-title"><BsJournalBookmarkFill />  Daily Journal</div>
                    <div className="hdr-desc">Start a daily journal</div>
                  </button>
                  <div className="hdr-sep" />
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      const tpl = buildMeetingNotesTemplate(new Date());
                      handleInsertImageTemplate(tpl + '\n\n');
                      setShowTemplatesDropdown(false);
                      setTemplatesPos(null);
                    }}
                  >
                    <div className="hdr-title"><BsKanban /> Meeting Notes</div>
                    <div className="hdr-desc">Structured meeting notes</div>
                  </button>
                  <div className="hdr-sep" />
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      const tpl = buildProjectPlanTemplate(new Date());
                      handleInsertImageTemplate(tpl + '\n\n');
                      setShowTemplatesDropdown(false);
                      setTemplatesPos(null);
                    }}
                  >
                    <div className="hdr-title"><BsClipboard2Check /> Project Plan</div>
                    <div className="hdr-desc">High-level project plan</div>
                  </button>
                  <div className="hdr-sep" />
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      const tpl = buildStudyNotesTemplate(new Date());
                      handleInsertImageTemplate(tpl + '\n\n');
                      setShowTemplatesDropdown(false);
                      setTemplatesPos(null);
                    }}
                  >
                    <div className="hdr-title"><BsPersonWorkspace /> Study Notes</div>
                    <div className="hdr-desc">Organized study template</div>
                  </button>
                  <div className="hdr-sep" />
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      const tpl = buildTravelLogsTemplate(new Date());
                      handleInsertImageTemplate(tpl + '\n\n');
                      setShowTemplatesDropdown(false);
                      setTemplatesPos(null);
                    }}
                  >
                    <div className="hdr-title"><GiJourney /> Travel Log</div>
                    <div className="hdr-desc">Capture trip itineraries</div>
                  </button>
                  <div className="hdr-sep" />
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      const tpl = buildWorkoutLogTemplate(new Date());
                      handleInsertImageTemplate(tpl + '\n\n');
                      setShowTemplatesDropdown(false);
                      setTemplatesPos(null);
                    }}
                  >
                    <div className="hdr-title"><BsTropicalStorm /> Workout Log</div>
                    <div className="hdr-desc">Log workouts notes</div>
                  </button>
                  <div className="hdr-sep" />
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      const tpl = buildBugReportTemplate(new Date());
                      handleInsertImageTemplate(tpl + '\n\n');
                      setShowTemplatesDropdown(false);
                      setTemplatesPos(null);
                    }}
                  >
                    <div className="hdr-title"><BsFillBugFill /> Bug Report</div>
                    <div className="hdr-desc">Report issues tracker</div>
                  </button>
                  <div className="hdr-sep" />
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      const tpl = buildDiagramExamplesTemplate();
                      handleInsertImageTemplate(tpl + '\n\n');
                      setShowTemplatesDropdown(false);
                      setTemplatesPos(null);
                    }}
                  >
                    <div className="hdr-title"><BsDiagram3 /> Diagram Example</div>
                    <div className="hdr-desc">UML & Mermaid diagram</div>
                  </button>
                  <div className="hdr-sep" />
              </div>,
              document.body
            )}
          </div>
          <div className="dropdown-container">
            <button
              className="menu-item fixed-menubar-btn"
              ref={exportsButtonRef}
              onMouseDown={(e) => {
                e.preventDefault();
                cacheSelection();
                const willShow = !showExportsDropdown;
                setShowExportsDropdown(willShow);
                if (willShow && exportsButtonRef.current) {
                  const rect = exportsButtonRef.current.getBoundingClientRect();
                  setExportsPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
                } else {
                  setExportsPos(null);
                }
              }}
              title="Exports"
            >
              <FaDownload /> &nbsp; Exports ▾
            </button>
            {showExportsDropdown && exportsPos && createPortal(
              <div
                className="header-dropdown format-dropdown"
                style={{ position: 'absolute', top: exportsPos.top + 'px', left: exportsPos.left + 'px', zIndex: 999999, minWidth: exportsPos.width + 'px' }}
              >
                <button
                  className="dropdown-item"
                  onClick={() => {
                    handleSaveAsPDF();
                    setShowExportsDropdown(false);
                    setExportsPos(null);
                  }}
                >
                  <div className="hdr-title"><FaFilePdf /> Export to PDF</div>
                  <div className="hdr-desc">Save as a PDF file</div>
                </button>
                <div className="hdr-sep" />
                <button
                  className="dropdown-item"
                  onClick={() => {
                    handleSaveToHTML();
                    setShowExportsDropdown(false);
                    setExportsPos(null);
                  }}
                >
                  <div className="hdr-title"><FaFileCode /> Export to HTML</div>
                  <div className="hdr-desc">Save as an HTML file</div>
                </button>
                <div className="hdr-sep" />
                <button
                  className="dropdown-item"
                  onClick={() => {
                    handleSaveToMarkdown();
                    setShowExportsDropdown(false);
                    setExportsPos(null);
                  }}
                >
                  <div className="hdr-title"><FaFileAlt /> Export to Markdown</div>
                  <div className="hdr-desc">Save as a Markdown (.md) file</div>
                </button>
                <div className="hdr-sep" />
                <button
                  className="dropdown-item"
                  onClick={() => {
                    handleSaveToTXT();
                    setShowExportsDropdown(false);
                    setExportsPos(null);
                  }}
                >
                  <div className="hdr-title"><FaFileAlt /> Export to TXT</div>
                  <div className="hdr-desc">Save as a plain text (.txt) file</div>
                </button>
                <div className="hdr-sep" />
                <button
                  className="dropdown-item"
                  onClick={() => {
                    handleSaveEncrypted();
                    setShowExportsDropdown(false);
                    setExportsPos(null);
                  }}
                >
                  <div className="hdr-title"><FaLock /> Export Encrypted</div>
                  <div className="hdr-desc">Save as encrypted (.sstp) file</div>
                </button>
              </div>,
              document.body
            )}
          </div>

          {/* About & Features Modals */}
          <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
          <FeaturesModal open={featuresOpen} onClose={() => setFeaturesOpen(false)} />
          <PasswordModal
            open={passwordModalConfig.open}
            onClose={handleClosePasswordModal}
            onSubmit={passwordModalConfig.onSubmit}
            title={passwordModalConfig.title}
            promptText={passwordModalConfig.promptText}
          />

          <div className="menubar-bottom">
          <div className="dropdown-container">
            <button className="button-mermaid" onMouseDown={() => { cacheSelection(); setShowHeaderDropdown(!showHeaderDropdown); }} title="Headers"><CgFormatHeading />Headers</button>
            {showHeaderDropdown && (
              <HeaderDropdown
                onInsertH1={handlerinserth1Syntax}
                onInsertH2={handlerinserth2Syntax}
                onInsertH3={handlerinserth3Syntax}
                onInsertH4={handlerinserth4Syntax}
                onInsertH5={handlerinserth5Syntax}
                onInsertH6={handlerinserth6Syntax}
                onClose={() => setShowHeaderDropdown(false)}
              />
            )}
          </div>
          <div className="dropdown-container">
            <button className="button-mermaid" onMouseDown={() => { cacheSelection(); setShowFormatDropdown(!showFormatDropdown); }} title="Text Formatting"><CgFormatText />&nbsp;Formatting</button>
            {showFormatDropdown && (
              <FormatDropdown
                onBold={handleBoldSyntax}
                onItalic={handlerItalicSyntax}
                onStrike={handlerStrikethroughSyntax}
                onCodeLine={handlerinsertCodeSyntax}
                onCodeBlock={handlerinsertBlockCodeSyntax}
                onNewLine={handleNewLineSyntax}
                onClose={() => setShowFormatDropdown(false)}
              />
            )}
          </div>
          &#8741;
          <div className="dropdown-container">
            <button className="button-mermaid" onMouseDown={() => { cacheSelection(); setShowInsertDropdown(!showInsertDropdown); }} title="Insert Elements"><MdOutlineInsertChartOutlined />&nbsp;Insert</button>
            {showInsertDropdown && (
              <InsertDropdown
                onRuler={handlerinsertRulerSyntax}
                onIndent1={handlerinsertIndent1Syntax}
                onIndent2={handlerinsertIndent2Syntax}
                onList1={handlerinsertList1Syntax}
                onList2={handlerinsertList2Syntax}
                onInsertTemplate={handleInsertImageTemplate}
                onClose={() => setShowInsertDropdown(false)}
              />
            )}
          </div>
          <div className="dropdown-container">
            <button className="button-mermaid" onMouseDown={() => { cacheSelection(); setShowLinksDropdown(!showLinksDropdown); }} title="Insert Links"><FaLink />&nbsp;Links</button>
            {showLinksDropdown && (
              <LinksDropdown
                onInsertTemplate={handleInsertImageTemplate}
                onClose={() => setShowLinksDropdown(false)}
              />
            )}
          </div>
          <div className="dropdown-container">
            <button className="button-mermaid" onMouseDown={() => { cacheSelection(); setShowImagesDropdown(!showImagesDropdown); }} title="Insert Images"><FaImage />&nbsp;Images</button>
            {showImagesDropdown && (
              <ImagesDropdown
                onInsertTemplate={handleInsertImageTemplate}
                onClose={() => setShowImagesDropdown(false)}
              />
            )}
          </div>
          <div className="dropdown-container">
            <button className="button-mermaid" onMouseDown={() => { cacheSelection(); setShowTablesDropdown(!showTablesDropdown); }} title="Insert Tables"><FaTable />&nbsp;Tables</button>
            {showTablesDropdown && (
              <TablesDropdown
                onInsertTemplate={handleInsertImageTemplate}
                onClose={() => setShowTablesDropdown(false)}
              />
            )}
          </div>
          <div className="dropdown-container">
            <button className="button-mermaid" onMouseDown={() => { cacheSelection(); setShowFooterDropdown(!showFooterDropdown); }} title="Insert Footnotes"><FaStickyNote />&nbsp;FootNote</button>
            {showFooterDropdown && (
              <FooterDropdown
                onInsertTemplate={handleInsertImageTemplate}
                onClose={() => setShowFooterDropdown(false)}
              />
            )}
          </div>
          &#8741;
          <div className="dropdown-container">
            <button
              className="button-mermaid"
              onMouseDown={(e) => {
                e.preventDefault();
                cacheSelection();
                setShowAutoDropdown(!showAutoDropdown);
              }}
              title="Auto Generate Options"
            >
              <MdAutoAwesome /> &nbsp; Auto ▾
            </button>
            {showAutoDropdown && (
              <AutoDropdown
                onAutoTable={() => setTableModalOpen(true)}
                onAutoGantt={() => setGanttModalOpen(true)}
                onAutoTimeline={() => setTimelineModalOpen(true)}
                onClose={() => setShowAutoDropdown(false)}
              />
            )}
          </div>
          &#8741;
          <div className="dropdown-container">
            <button
              className="button-mermaid"
              onMouseDown={(e) => {
                e.preventDefault();
                cacheSelection();
                setShowMermaidDropdown(!showMermaidDropdown);
              }}
              title="Mermaid Options"
            >
              <SiMermaid /> &nbsp; Mermaid ▾
            </button>
            {showMermaidDropdown && (
              <MermaidDropdown
                onJourney={handleJourneyInsert}
                onFlowchart={handleFlowchartRLInsert}
                onGantt={handleGanttInsert}
                onGraphTD={handleGraphTDInsert}
                onErDiag={handleErDiagramInsert}
                onTimeLine={handleTimeLineSyntax}
                onClassDiag={handleInsertClass}
                onGitGraph={handleGitInsert}
                onBlock={handleBlockInsert}
                onClose={() => setShowMermaidDropdown(false)}
              />
            )}
          </div>
          <div className="dropdown-container">
            <button
              className="button-mermaid"
              onMouseDown={(e) => {
                e.preventDefault();
                cacheSelection();
                setShowUMLDropdown(!showUMLDropdown);
              }}
              title="UML Diagram Options"
            >
              <AiOutlineLayout /> &nbsp; UML ▾
            </button>
            {showUMLDropdown && (
              <UMLDropdown
                onClassDiagram={handleUMLClassDiagram}
                onSequenceDiagram={handleUMLSequenceDiagram}
                onUseCaseDiagram={handleUMLUseCaseDiagram}
                onActivityDiagram={handleUMLActivityDiagram}
                onComponentDiagram={handleUMLComponentDiagram}
                onStateDiagram={handleUMLStateDiagram}
                onClose={() => setShowUMLDropdown(false)}
              />
            )}
          </div>
          <div className="dropdown-container">
            <button
              className="button-mermaid"
              onMouseDown={(e) => {
                e.preventDefault();
                cacheSelection();
                setShowSymbolsDropdown(!showSymbolsDropdown);
              }}
              title="Symbol Options"
            >
              <VscSymbolKeyword /> &nbsp; Symbols ▾
            </button>
            {showSymbolsDropdown && (
              <SymbolsDropdown
                onSymbol3={insertSymbol3}
                onSymbol4={insertSymbol4}
                onSymbol5={insertSymbol5}
                onSymbol6={insertSymbol6}
                onSymbol7={insertSymbol7}
                onSymbol8={insertSymbol8}
                onSymbol9={insertSymbol9}
                onSymbol11={insertSymbol11}
                onSymbol12={insertSymbol12}
                onSymbol17={insertSymbol17}
                onSymbol18={insertSymbol18}
                onSymbol19={insertSymbol19}
                onSymbol20={insertSymbol20}
                onSymbol21={insertSymbol21}
                onSymbol22={insertSymbol22}
                onSymbol23={insertSymbol23}
                onSymbol24={insertSymbol24}
                onSymbol25={insertSymbol25}
                onSymbol26={insertSymbol26}
                onSymbol27={insertSymbol27}
                onClose={() => setShowSymbolsDropdown(false)}
              />
            )}
          </div>
          <div className="dropdown-container">
            <button
              className="button-mermaid"
              onMouseDown={(e) => {
                e.preventDefault();
                cacheSelection();
                setShowIconsDropdown(!showIconsDropdown);
              }}
              title="Icons"
            >
              <FaImage /> &nbsp; Icons ▾
            </button>
            {showIconsDropdown && (
              <IconsDropdown
                onInsertIcon={(icon) => { insertIcon(icon); }}
                onClose={() => setShowIconsDropdown(false)}
              />
            )}
          </div>
        </div>

        {/* Modal Generators */}
        <TableGenerator
          isOpen={tableModalOpen}
          onClose={() => setTableModalOpen(false)}
          onInsert={(tableText) => {
            setEditorContent(editorContent + tableText);
            setTableModalOpen(false);
          }}
        />
        <GanttGenerator
          isOpen={ganttModalOpen}
          onClose={() => setGanttModalOpen(false)}
          onInsert={(ganttText) => {
            setEditorContent(editorContent + ganttText);
            setGanttModalOpen(false);
          }}
        />
        <TimelineGenerator
          isOpen={timelineModalOpen}
          onClose={() => setTimelineModalOpen(false)}
          onInsert={(timelineText) => {
            setEditorContent(editorContent + timelineText);
            setTimelineModalOpen(false);
          }}
        />

        
        <p></p>
        
        <div
          className={getEditorPreviewContainerClass()}
        >
        {/* TextareaComponent is a memoized component that renders the textarea for Markdown editing */}
        {!isPreviewFull && (
          <TextareaComponent
            textareaRef={textareaRef}
            editorContent={editorContent}
            handleChange={handleChange}
            handleContextMenu={handleContextMenu}
            isEditFull={isEditFull}
            isHorizontal={isHorizontal}
            setEditorContent={setEditorContent}
            cursorPositionRef={cursorPositionRef}
          />
        )}
        
        {/* PreviewComponent is a memoized component that renders the preview for Markdown editing */}
        {!isEditFull && (
          <PreviewComponent
            previewRef={previewRef}
            editorContent={editorContent}
            isPreviewFull={isPreviewFull}
            isHorizontal={isHorizontal}
            initializeMermaid={initializeMermaid}
          />
          )}
        </div>

        {contextMenu.visible && (
          <ContextMenu
            contextMenu={contextMenu}
            textareaRef={textareaRef}
            editorContent={editorContent}
            setEditorContent={setEditorContent}
            cursorPositionRef={cursorPositionRef}
            setContextMenu={setContextMenu}
            setCachedSelection={setCachedSelection}
            setSelectionStart={setSelectionStart}
            setSelectionEnd={setSelectionEnd}
            cachedSelection={cachedSelection}
          />
        )}

      </div>
    </div>
  );
};

export default App;