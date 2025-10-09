// React import not required with the new JSX transform

type Props = {
  onAutoTable: () => void;
  onAutoGantt: () => void;
  onAutoTimeline: () => void;
  onClose: () => void;
};

export default function AutoDropdown({ 
  onAutoTable, 
  onAutoGantt, 
  onAutoTimeline, 
  onClose 
}: Props) {
  return (
    <div className="header-dropdown format-dropdown">
      <button className="dropdown-item" onClick={() => { onAutoTable(); onClose(); }}>
        <div className="hdr-title">Auto Table</div>
        <div className="hdr-desc"><em>Generate markdown tables automatically</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onAutoGantt(); onClose(); }}>
        <div className="hdr-title">Auto Gantt</div>
        <div className="hdr-desc"><em>Generate Mermaid Gantt charts</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onAutoTimeline(); onClose(); }}>
        <div className="hdr-title">Auto Timeline</div>
        <div className="hdr-desc"><em>Generate Mermaid timeline charts</em></div>
        <div className="hdr-sep" />
      </button>
    </div>
  );
}
