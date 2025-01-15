import React from 'react';

interface ContextMenuProps {
  contextMenu: { visible: boolean; x: number; y: number };
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  editorContent: string;
  setEditorContent: (content: string) => void;
  cursorPositionRef: React.MutableRefObject<number>;
  setContextMenu: (contextMenu: { visible: boolean; x: number; y: number }) => void;
  setCachedSelection: (selection: { start: number; end: number } | null) => void;
  setSelectionStart: (start: number | null) => void;
  setSelectionEnd: (end: number | null) => void;
  cachedSelection: { start: number; end: number } | null;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  contextMenu,
  textareaRef,
  editorContent,
  setEditorContent,
  cursorPositionRef,
  setContextMenu,
  setCachedSelection,
  setSelectionStart,
  setSelectionEnd,
  cachedSelection
}) => {
  return (
    <div 
      className="context-menu-container"
      style={{
        top: contextMenu.y,
        left: contextMenu.x,
      }}
    >
      {/* <div
        className="context-menu-item"
        onMouseDown={(e) => {
          e.preventDefault();
          if (textareaRef.current) {
            const newText = editorContent + "Menu Testing";
            setEditorContent(newText);
            cursorPositionRef.current = newText.length + 1;
          }
          setContextMenu({ visible: false, x: 0, y: 0 });
          textareaRef.current?.focus();
        }}
      >
        Testing
      </div> */}

        {/* Menu entry for Copy */}
      <div className="context-menu-item"
        onMouseDown={(e) => {
          e.preventDefault();
          if (textareaRef.current && cachedSelection) {
            const selectedText = editorContent.substring(
              cachedSelection.start,
              cachedSelection.end
            );
            if (selectedText) {
              navigator.clipboard.writeText(selectedText);
            }
          }
          setContextMenu({ visible: false, x: 0, y: 0 });
          textareaRef.current?.focus();
        }}
      >
        Copy
      </div>
      
      {/* Menu entry for Paste */}
      <div className="context-menu-item"
        onMouseDown={async (e) => {
          e.preventDefault();
          if (textareaRef.current) {
            try {
              const clipText = await navigator.clipboard.readText();
              const start = textareaRef.current.selectionStart;
              const end = textareaRef.current.selectionEnd;
              const newText = 
                editorContent.substring(0, start) + 
                clipText + 
                editorContent.substring(end);
              setEditorContent(newText);
              cursorPositionRef.current = start + clipText.length;
            } catch (err) {
              console.error('Failed to read clipboard:', err);
            }
          }
          setContextMenu({ visible: false, x: 0, y: 0 });
          textareaRef.current?.focus();
        }}
      >
        Paste
      </div>
      
      {/* Menu entry for Select All */}
      <div
        className="context-menu-item"
        onMouseDown={(e) => {
          e.preventDefault();
          if (textareaRef.current) {
            setCachedSelection({
              start: 0,
              end: editorContent.length
            });
            setSelectionStart(0);
            setSelectionEnd(editorContent.length);
            
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(0, editorContent.length);
              }
            }, 0);
          }
          setContextMenu({ visible: false, x: 0, y: 0 });
        }}
      >
        Select All
      </div>
    </div>
  );
};

export default ContextMenu;