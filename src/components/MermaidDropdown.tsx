// React import not required with the new JSX transform

type Props = {
  onJourney: () => void;
  onFlowchart: () => void;
  onGantt: () => void;
  onGraphTD: () => void;
  onErDiag: () => void;
  onTimeLine: () => void;
  onClassDiag: () => void;
  onGitGraph: () => void;
  onBlock: () => void;
  onClose: () => void;
};

export default function MermaidDropdown({ onJourney, onFlowchart, onGantt, onGraphTD, onErDiag, onTimeLine, onClassDiag, onGitGraph, onBlock, onClose }: Props) {
  return (
    <div className="header-dropdown format-dropdown">
      <button className="dropdown-item" onClick={() => { onJourney(); onClose(); }}>
        <div className="hdr-title">Journey</div>
        <div className="hdr-desc"><em>Mermaid Journey example</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onFlowchart(); onClose(); }}>
        <div className="hdr-title">Flowchart</div>
        <div className="hdr-desc"><em>Mermaid Flowchart example</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onGantt(); onClose(); }}>
        <div className="hdr-title">Gantt</div>
        <div className="hdr-desc"><em>Mermaid Gantt chart</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onGraphTD(); onClose(); }}>
        <div className="hdr-title">GraphTD</div>
        <div className="hdr-desc"><em>Mermaid GraphTD example</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onErDiag(); onClose(); }}>
        <div className="hdr-title">erDiag</div>
        <div className="hdr-desc"><em>Mermaid ER diagram</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onTimeLine(); onClose(); }}>
        <div className="hdr-title">TimeLine</div>
        <div className="hdr-desc"><em>Mermaid Timeline example</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onClassDiag(); onClose(); }}>
        <div className="hdr-title">ClassDiag</div>
        <div className="hdr-desc"><em>Mermaid class diagram</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onGitGraph(); onClose(); }}>
        <div className="hdr-title">gitGraph</div>
        <div className="hdr-desc"><em>Mermaid gitGraph example</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onBlock(); onClose(); }}>
        <div className="hdr-title">Block (beta)</div>
        <div className="hdr-desc"><em>Mermaid Block (beta)</em></div>
        <div className="hdr-sep" />
      </button>
    </div>
  );
}
