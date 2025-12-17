import React from 'react';
import { FaStickyNote, FaFileAlt, FaDownload } from 'react-icons/fa';

interface EasyNotesSidebarProps {
  showEasyNotesSidebar: boolean;
  setShowEasyNotesSidebar: (show: boolean) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

const EasyNotesSidebar: React.FC<EasyNotesSidebarProps> = ({
  showEasyNotesSidebar,
  setShowEasyNotesSidebar,
  showToast
}) => {
  return (
    <div 
      className={`easynotes-sidebar ${showEasyNotesSidebar ? 'easynotes-sidebar-open' : ''}`}
      style={{
        position: 'fixed',
        top: '120px', // Below the menu bars
        left: showEasyNotesSidebar ? '0' : '-435px',
        width: '400px', // Fixed width instead of percentage
        height: 'calc(100vh - 120px)',
        backgroundColor: 'var(--bg-dropdown)',
        color: 'var(--color-text-dropdown)',
        zIndex: 1000,
        transition: 'left 0.3s ease-in-out',
        borderRight: '2px solid var(--border-secondary)',
        padding: '20px',
        boxShadow: showEasyNotesSidebar ? '2px 0 10px var(--shadow-md)' : 'none',
        overflow: 'auto'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
          <FaStickyNote style={{ marginRight: '10px' }} />
          EasyNotes
        </h2>
        <button
          onClick={() => setShowEasyNotesSidebar(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-dropdown)',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '5px'
          }}
          title="Close EasyNotes"
        >
          ×
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => {
            showToast('Quick Note feature coming soon!', 'info');
          }}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '10px',
            backgroundColor: 'var(--bg-dropdown-hover)',
            color: 'var(--color-text-dropdown)',
            border: '1px solid var(--border-secondary)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FaStickyNote /> Quick Note
        </button>
        
        <button
          onClick={() => {
            showToast('Note Templates feature coming soon!', 'info');
          }}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '10px',
            backgroundColor: 'var(--bg-dropdown-hover)',
            color: 'var(--color-text-dropdown)',
            border: '1px solid var(--border-secondary)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FaFileAlt /> Note Templates
        </button>
        
        <button
          onClick={() => {
            showToast('Save Note feature coming soon!', 'info');
          }}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'var(--bg-dropdown-hover)',
            color: 'var(--color-text-dropdown)',
            border: '1px solid var(--border-secondary)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FaDownload /> Save Note
        </button>
      </div>
      
      <div style={{ borderTop: '1px solid var(--border-secondary)', paddingTop: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', color: 'var(--color-text-dropdown)' }}>Recent Notes</h3>
        <p style={{ color: 'var(--color-text-light)', fontSize: '14px' }}>No notes yet. Create your first note!</p>
      </div>
    </div>
  );
};

export default EasyNotesSidebar;