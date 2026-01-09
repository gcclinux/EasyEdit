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

const formatMarkdownTable = (rows: string[][]): string[] => {
  const colWidths: number[] = [];
  rows.forEach(row => {
    row.forEach((cell, i) => {
      if ((i === 0 && cell === '') || (i === row.length - 1 && cell === '')) return;
      const content = cell.trim();
      const isSeparator = /^[:\-]*-+[:\-]*$/.test(content);
      const width = isSeparator ? 3 : content.length;
      colWidths[i] = Math.max(colWidths[i] || 0, width);
    });
  });

  return rows.map(row => {
    return row.map((cell, i) => {
      if ((i === 0 && cell === '') || (i === row.length - 1 && cell === '')) return '';
      const content = cell.trim();
      const width = colWidths[i] || 0;
      const isSeparator = /^[:\-]*-+[:\-]*$/.test(content);

      if (isSeparator) {
        const left = content.startsWith(':');
        const right = content.endsWith(':');
        let dashes = '-'.repeat(Math.max(3, width));
        if (left && right) dashes = ':' + '-'.repeat(Math.max(1, width - 2)) + ':';
        else if (left) dashes = ':' + '-'.repeat(Math.max(2, width - 1));
        else if (right) dashes = '-'.repeat(Math.max(2, width - 1)) + ':';
        return dashes;
      } else {
        return ' ' + content + ' '.repeat(Math.max(0, width - content.length)) + ' ';
      }
    }).join('|');
  });
};

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
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          const target = e.target as HTMLTextAreaElement;
          const { selectionStart, selectionEnd } = target;
          const currentLine = editorContent.substring(
            editorContent.lastIndexOf('\n', selectionStart - 1) + 1,
            selectionStart
          );

          if (currentLine.trim().startsWith('|') && currentLine.trim().endsWith('|') && (currentLine.match(/\|/g) || []).length > 1) {
            e.preventDefault();

            // Find table bounds
            const lines = editorContent.split('\n');
            let lineIndex = 0;
            let currentPos = 0;
            for (let i = 0; i < lines.length; i++) {
              if (currentPos + lines[i].length + 1 > selectionStart) {
                lineIndex = i;
                break;
              }
              currentPos += lines[i].length + 1;
            }

            let startLine = lineIndex;
            while (startLine > 0 && lines[startLine - 1].trim().startsWith('|')) startLine--;

            let endLine = lineIndex;
            while (endLine < lines.length - 1 && lines[endLine + 1].trim().startsWith('|')) endLine++;

            const tableLines = lines.slice(startLine, endLine + 1);
            const tableRows = tableLines.map(line => line.split('|'));

            const formattedTableLines = formatMarkdownTable(tableRows);

            // Generate new row
            const lastRow = formattedTableLines[formattedTableLines.length - 1]; // or current row logic? 
            // Better to use current row structure for pipe count, but formattedTable is consistent.
            const pipeCount = (lastRow.match(/\|/g) || []).length;
            const newRow = '|' + Array(pipeCount - 1).fill('  ').join('|') + '|';

            // Insert new row into formatted block
            // However, we need to know where to insert relative to the formatted block.
            // If we pressed enter at end of lineIndex (which corresponds to formattedTableLines[lineIndex - startLine])
            const relativeIndex = lineIndex - startLine;
            formattedTableLines.splice(relativeIndex + 1, 0, newRow);

            // Reconstruct full content
            lines.splice(startLine, endLine - startLine + 1, ...formattedTableLines);
            const newValue = lines.join('\n');

            setEditorContent(newValue);
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.value = newValue;
                // Calculate cursor: Start of new row + 2 (first cell padding)
                // We need to find position of new row.
                // It's sum of lengths of lines up to startLine + formatted lines up to relativeIndex + 1
                const prefix = lines.slice(0, startLine + relativeIndex + 1).join('\n') + '\n';
                cursorPositionRef.current = prefix.length + 2; // Jump into first cell
                textareaRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
              }
            }, 0);
          } else if (currentLine.startsWith('>>> ') || currentLine.startsWith('> > > ')) {
            e.preventDefault();
            const newValue = editorContent.substring(0, selectionStart) + '   \n>>> ' + editorContent.substring(selectionEnd);
            setEditorContent(newValue);
            setTimeout(() => { if (textareaRef.current) { textareaRef.current.value = newValue; cursorPositionRef.current = selectionStart + 8; textareaRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current); } }, 0);
          } else if (currentLine.startsWith('>>') || currentLine.startsWith('> >')) {
            e.preventDefault();
            const newValue = editorContent.substring(0, selectionStart) + '   \n>> ' + editorContent.substring(selectionEnd);
            setEditorContent(newValue);
            setTimeout(() => { if (textareaRef.current) { textareaRef.current.value = newValue; cursorPositionRef.current = selectionStart + 7; textareaRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current); } }, 0);
          } else if (currentLine.startsWith('> ')) {
            e.preventDefault();
            const newValue = editorContent.substring(0, selectionStart) + '   \n> ' + editorContent.substring(selectionEnd);
            setEditorContent(newValue);
            setTimeout(() => { if (textareaRef.current) { textareaRef.current.value = newValue; cursorPositionRef.current = selectionStart + 6; textareaRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current); } }, 0);
          } else if (currentLine.startsWith('- - - ')) {
            e.preventDefault();
            const newValue = editorContent.substring(0, selectionStart) + '\n- - - ' + editorContent.substring(selectionEnd);
            setEditorContent(newValue);
            setTimeout(() => { if (textareaRef.current) { textareaRef.current.value = newValue; cursorPositionRef.current = selectionStart + 7; textareaRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current); } }, 0);
          } else if (currentLine.startsWith('- - ')) {
            e.preventDefault();
            const newValue = editorContent.substring(0, selectionStart) + '\n- - ' + editorContent.substring(selectionEnd);
            setEditorContent(newValue);
            setTimeout(() => { if (textareaRef.current) { textareaRef.current.value = newValue; cursorPositionRef.current = selectionStart + 5; textareaRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current); } }, 0);
          } else if (currentLine.startsWith('- ')) {
            e.preventDefault();
            const newValue = editorContent.substring(0, selectionStart) + '\n- ' + editorContent.substring(selectionEnd);
            setEditorContent(newValue);
            setTimeout(() => { if (textareaRef.current) { textareaRef.current.value = newValue; cursorPositionRef.current = selectionStart + 3; textareaRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current); } }, 0);
          } else {
            // Standard enter
            e.preventDefault();
            const newValue = editorContent.substring(0, selectionStart) + '\n' + editorContent.substring(selectionEnd);
            setEditorContent(newValue);
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.value = newValue;
                cursorPositionRef.current = selectionStart + 1;
                textareaRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
              }
            }, 0);
          }
        } else if (e.key === '|') {
          const target = e.target as HTMLTextAreaElement;
          const { selectionStart, selectionEnd } = target;
          const currentLine = editorContent.substring(
            editorContent.lastIndexOf('\n', selectionStart - 1) + 1,
            editorContent.indexOf('\n', selectionStart) === -1 ? editorContent.length : editorContent.indexOf('\n', selectionStart)
          );

          if (currentLine.trim().startsWith('|')) {
            e.preventDefault();

            // Count pipes before cursor to restore position
            const preCursorLine = editorContent.substring(editorContent.lastIndexOf('\n', selectionStart - 1) + 1, selectionStart);
            const pipeIndex = (preCursorLine.match(/\|/g) || []).length;

            const lines = editorContent.split('\n');
            let lineIndex = 0;
            let currentPos = 0;
            for (let i = 0; i < lines.length; i++) {
              if (currentPos + lines[i].length + 1 > selectionStart) {
                lineIndex = i;
                break;
              }
              currentPos += lines[i].length + 1;
            }

            // Insert pipe locally first to format table with it
            lines[lineIndex] = lines[lineIndex].substring(0, selectionStart - currentPos) + '|' + lines[lineIndex].substring(selectionStart - currentPos);

            let startLine = lineIndex;
            while (startLine > 0 && lines[startLine - 1].trim().startsWith('|')) startLine--;

            let endLine = lineIndex;
            while (endLine < lines.length - 1 && lines[endLine + 1].trim().startsWith('|')) endLine++;

            const tableLines = lines.slice(startLine, endLine + 1);
            const tableRows = tableLines.map(line => line.split('|'));
            const formattedTableLines = formatMarkdownTable(tableRows);

            lines.splice(startLine, endLine - startLine + 1, ...formattedTableLines);
            const newValue = lines.join('\n');

            setEditorContent(newValue);
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.value = newValue;
                // Restore cursor
                // Find formatted line
                const formattedLine = formattedTableLines[lineIndex - startLine];
                // Find Nth pipe
                let pipesFound = 0;
                let newColIndex = 0;
                for (let i = 0; i < formattedLine.length; i++) {
                  if (formattedLine[i] === '|') {
                    pipesFound++;
                    if (pipesFound === pipeIndex + 1) { // +1 because we inserted one
                      newColIndex = i + 1; // After pipe
                      break;
                    }
                  }
                }

                // Global cursor pos
                const prefix = lines.slice(0, lineIndex).join('\n') + '\n';
                cursorPositionRef.current = prefix.length + newColIndex;
                textareaRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
              }
            }, 0);
          }
        } else if (e.key === 'Tab') {
          e.preventDefault();
          const target = e.target as HTMLTextAreaElement;
          const { selectionStart, selectionEnd } = target;
          const newValue = editorContent.substring(0, selectionStart) + '    ' + editorContent.substring(selectionEnd);
          setEditorContent(newValue);
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.value = newValue;
              cursorPositionRef.current = selectionStart + 4;
              textareaRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
            }
          }, 0);
        }
      }}
    />
  );
});

export default TextareaComponent;