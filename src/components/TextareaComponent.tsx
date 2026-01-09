import React, { useEffect } from 'react';

interface TextareaComponentProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  editorContent: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleContextMenu: (e: React.MouseEvent) => void;
  isEditFull: boolean;
  isHorizontal: boolean;
  setEditorContent: (content: string) => void;
  cursorPositionRef: React.RefObject<number>;
}

const TextareaComponent: React.FC<TextareaComponentProps> = React.memo(({
  textareaRef,
  editorContent,
  handleChange,
  handleContextMenu,
  isEditFull,
  isHorizontal,
  setEditorContent,
  cursorPositionRef
}) => {
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
      onContextMenu={handleContextMenu}
      className={
        isEditFull
          ? 'textarea-horizontal-full'
          : isHorizontal
            ? 'textarea-horizontal'
            : 'textarea-parallel'
      }
      // Inside the onKeyDown event handler
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const target = e.target as HTMLTextAreaElement;
          const { selectionStart, selectionEnd } = target;

          // Get current line content
          const currentLine = editorContent.substring(
            editorContent.lastIndexOf('\n', selectionStart - 1) + 1,
            selectionStart
          );

          if (currentLine.startsWith('>>> ') || currentLine.startsWith('> > > ')) {
            const newValue = editorContent.substring(0, selectionStart) + '   \n>>> ' + editorContent.substring(selectionEnd);
            setEditorContent(newValue);
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.value = newValue;
                cursorPositionRef.current = selectionStart + 8;
                textareaRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
              }
            }, 0);
          } else if (currentLine.startsWith('>>') || currentLine.startsWith('> >')) {
            const newValue = editorContent.substring(0, selectionStart) + '   \n>> ' + editorContent.substring(selectionEnd);
            setEditorContent(newValue);
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.value = newValue;
                cursorPositionRef.current = selectionStart + 7;
                textareaRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
              }
            }, 0);
          } else if (currentLine.startsWith('> ')) {
            const newValue = editorContent.substring(0, selectionStart) + '   \n> ' + editorContent.substring(selectionEnd);
            setEditorContent(newValue);
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.value = newValue;
                cursorPositionRef.current = selectionStart + 6;
                textareaRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
              }
            }, 0);
          } else if (currentLine.startsWith('- - - ')) {
            const newValue = editorContent.substring(0, selectionStart) + '\n- - - ' + editorContent.substring(selectionEnd);
            setEditorContent(newValue);
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.value = newValue;
                cursorPositionRef.current = selectionStart + 7;
                textareaRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
              }
            }, 0);
          } else if (currentLine.startsWith('- - ')) {
            const newValue = editorContent.substring(0, selectionStart) + '\n- - ' + editorContent.substring(selectionEnd);
            setEditorContent(newValue);
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.value = newValue;
                cursorPositionRef.current = selectionStart + 5;
                textareaRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
              }
            }, 0);
          } else if (currentLine.startsWith('- ')) {
            const newValue = editorContent.substring(0, selectionStart) + '\n- ' + editorContent.substring(selectionEnd);
            setEditorContent(newValue);
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.value = newValue;
                cursorPositionRef.current = selectionStart + 3;
                textareaRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
              }
            }, 0);
          } else if (currentLine.trim().startsWith('|') && currentLine.trim().endsWith('|') && (currentLine.match(/\|/g) || []).length > 1) {
            const trimmedLine = currentLine.trim();
            const pipeCount = (trimmedLine.match(/\|/g) || []).length;
            const indentation = currentLine.substring(0, currentLine.indexOf('|'));
            const newRow = '\n' + indentation + Array(pipeCount).join('| ') + '|';
            const newValue = editorContent.substring(0, selectionStart) + newRow + editorContent.substring(selectionEnd);
            setEditorContent(newValue);
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.value = newValue;
                cursorPositionRef.current = selectionStart + 1 + indentation.length + 2;
                textareaRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
              }
            }, 0);
          } else {
            const newValue = editorContent.substring(0, selectionStart) + '   \n' + editorContent.substring(selectionEnd);
            setEditorContent(newValue);
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.value = newValue;
                cursorPositionRef.current = selectionStart + 4;
                textareaRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
              }
            }, 0);
          }
        } else if (e.key === 'Tab') {
          e.preventDefault();
          const target = e.target as HTMLTextAreaElement;
          const { selectionStart, selectionEnd } = target;
          const newValue = editorContent.substring(0, selectionStart) + '    ' + editorContent.substring(selectionEnd); // 4 spaces
          setEditorContent(newValue);
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.value = newValue; // Explicitly set the value of the textarea
              cursorPositionRef.current = selectionStart + 4; // Update cursor position
              textareaRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current); // Move cursor after the 4 spaces
            }
          }, 0);
        }
      }}
    />
  );
});

export default TextareaComponent;