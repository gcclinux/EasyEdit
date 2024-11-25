import { useState } from 'react';
import './StyleGenerator.css';

interface TableGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (tableText: string) => void;
}

export const TableGenerator: React.FC<TableGeneratorProps> = ({ isOpen, onClose, onInsert }) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [headers, setHeaders] = useState<string[]>(['Header 1', 'Header 2', 'Header 3']);
  const [alignments, setAlignments] = useState<string[]>(['left', 'left', 'left']);

  const createTable = () => {
    let table = '|' + headers.join(' | ') + '|\n';
    table += '|' + alignments.map(align => {
      switch(align) {
        case 'left': return ':---';
        case 'center': return ':---:';
        case 'right': return '---:';
        default: return '---';
      }
    }).join(' | ') + '|\n';
    
    for (let i = 0; i < rows; i++) {
      table += '|' + Array(cols).fill('Cell').join(' | ') + '|\n';
    }
    return table;
  };

  return isOpen ? (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Table Generator</h2>
        
        <div className="input-group">
          <label>
            Rows:
            <input 
              type="number" 
              min="1" 
              value={rows} 
              onChange={e => setRows(parseInt(e.target.value))} 
            />
          </label>
          
          <label>
            Columns:
            <input 
              type="number" 
              min="1" 
              value={cols} 
              onChange={e => {
                setCols(parseInt(e.target.value));
                setHeaders(Array(parseInt(e.target.value)).fill('Header'));
                setAlignments(Array(parseInt(e.target.value)).fill('left'));
              }} 
            />
          </label>
        </div>

        <div className="headers-section">
          {headers.map((header, index) => (
            <div key={index} className="header-group">
              <input
                value={header}
                onChange={e => {
                  const newHeaders = [...headers];
                  newHeaders[index] = e.target.value;
                  setHeaders(newHeaders);
                }}
              />
              <select
                value={alignments[index]}
                onChange={e => {
                  const newAlignments = [...alignments];
                  newAlignments[index] = e.target.value;
                  setAlignments(newAlignments);
                }}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          ))}
        </div>

        <div className="preview">
          <h3>Preview:</h3>
          <pre>{createTable()}</pre>
        </div>

        <div className="button-group">
          <button onClick={() => onInsert(createTable())}>Insert</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  ) : null;
};