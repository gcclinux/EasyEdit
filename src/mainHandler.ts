// src/mainHandler.ts
import { RefObject, MutableRefObject } from 'react';
import { saveAs } from 'file-saver';
import { marked } from 'marked';
import mermaid from 'mermaid';
import nomnoml from 'nomnoml';

export interface HistoryState {
  content: string;
  cursorPosition: number;
}


export const saveToHTML = async (editorContent: string): Promise<void> => {
    try {
      // Initialize mermaid with config
      mermaid.initialize({ 
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose'
      });
  
      // First convert markdown to HTML
      const htmlContent = await marked(editorContent);
      
      // Create a temporary div to render mermaid
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      
      // Find all mermaid code blocks
      const mermaidBlocks = tempDiv.querySelectorAll('code.language-mermaid');
      
      // Process each mermaid block
      await Promise.all(Array.from(mermaidBlocks).map(async (block) => {
        try {
          const mermaidCode = block.textContent || '';
          const uniqueId = `mermaid-${Math.random().toString(36).substring(7)}`;
          
          // Create a container for the diagram
          const container = document.createElement('div');
          container.className = 'mermaid';
          container.id = uniqueId;
          
          // Render the diagram
          const { svg } = await mermaid.render(uniqueId, mermaidCode);
          container.innerHTML = svg;
          
          // Replace the code block with rendered diagram
          const pre = block.closest('pre');
          if (pre?.parentElement) {
            pre.parentElement.replaceChild(container, pre);
          }
        } catch (error) {
          console.error('Mermaid rendering error:', error);
        }
      }));

      // Find all Nomnoml/UML code blocks
      const plantumlBlocks = tempDiv.querySelectorAll('code.language-plantuml');
      
      // Process each Nomnoml block (offline rendering)
      plantumlBlocks.forEach((block) => {
        try {
          const umlCode = block.textContent || '';
          const svg = nomnoml.renderSvg(umlCode);
          
          // Create a container for the diagram
          const container = document.createElement('div');
          container.className = 'plantuml-diagram';
          container.style.textAlign = 'center';
          container.style.margin = '1em 0';
          container.innerHTML = svg;
          
          // Replace the code block with rendered diagram
          const pre = block.closest('pre');
          if (pre?.parentElement) {
            pre.parentElement.replaceChild(container, pre);
          }
        } catch (error) {
          console.error('Nomnoml rendering error:', error);
        }
      });
  
      // Create final HTML with proper styling and mermaid script
      const finalHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Markdown Export</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              margin: 2em;
            }
            .mermaid { 
              text-align: center;
              margin: 1em 0;
            }
            .plantuml-diagram {
              text-align: center;
              margin: 1em 0;
            }
            svg, img {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          ${tempDiv.innerHTML}
        </body>
        </html>
      `;
  
      // Save the file
      const blob = new Blob([finalHTML], {
        type: "text/html;charset=utf-8",
      });
      saveAs(blob, "easyeditor.html");
    } catch (error) {
      console.error('Error saving HTML:', error);
    }
  };

export const handleOpenClick = (
    setEditorContent: (content: string) => void
  ): void => {
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

export const saveToFile = (editorContent: string): void => {
const blob = new Blob([editorContent], { type: "text/markdown;charset=utf-8" });
saveAs(blob, "easyeditor.md");
};

export const saveToTxT = (editorContent: string): void => {
const blob = new Blob([editorContent], { type: "text/plain;charset=utf-8" });
saveAs(blob, "easyeditor.txt");
};

export interface MainHandlerProps {
  textareaRef: RefObject<HTMLTextAreaElement>;
  documentHistory: HistoryState[];
  historyIndex: number;
  setHistoryIndex: (index: number) => void;
  setDocumentHistory: (history: HistoryState[]) => void;
  editorContent: string;
  setEditorContent: (content: string) => void;
  cursorPositionRef: MutableRefObject<number>; // Updated type
}

export const addToHistory = (
  content: string, 
  cursorPos: number,
  documentHistory: HistoryState[],
  historyIndex: number,
  setDocumentHistory: (history: HistoryState[]) => void,
  setHistoryIndex: (index: number) => void
): void => {
  const newHistory = documentHistory.slice(0, historyIndex + 1);
  setDocumentHistory([...newHistory, { content, cursorPosition: cursorPos }]);
  setHistoryIndex(newHistory.length);
};

export const handleUndo = (
  historyIndex: number,
  documentHistory: HistoryState[],
  setHistoryIndex: (index: number) => void,
  setEditorContent: (content: string) => void,
  cursorPositionRef: MutableRefObject<number> // Updated type
): void => {
  if (historyIndex > 0) {
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    const { content, cursorPosition } = documentHistory[newIndex];
    setEditorContent(content);
    cursorPositionRef.current = cursorPosition;
  }
};

export const handleClear = (
  setEditorContent: (content: string) => void
): void => {
  setEditorContent("");
};

export const handleRedo = (
  historyIndex: number,
  documentHistory: HistoryState[],
  setHistoryIndex: (index: number) => void,
  setEditorContent: (content: string) => void,
  cursorPositionRef: MutableRefObject<number> // Updated type
): void => {
  if (historyIndex < documentHistory.length - 1) {
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    const { content, cursorPosition } = documentHistory[newIndex];
    setEditorContent(content);
    cursorPositionRef.current = cursorPosition;
  }
};