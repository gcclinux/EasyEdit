// React import not required with the new JSX transform

type Props = {
  onClassDiagram: () => void;
  onSequenceDiagram: () => void;
  onUseCaseDiagram: () => void;
  onActivityDiagram: () => void;
  onComponentDiagram: () => void;
  onStateDiagram: () => void;
  onClose: () => void;
};

export default function UMLDropdown({ 
  onClassDiagram, 
  onSequenceDiagram, 
  onUseCaseDiagram, 
  onActivityDiagram, 
  onComponentDiagram, 
  onStateDiagram, 
  onClose 
}: Props) {
  return (
    <div className="header-dropdown format-dropdown">
      <button className="dropdown-item" onClick={() => { onClassDiagram(); onClose(); }}>
        <div className="hdr-title">Class Diagram</div>
        <div className="hdr-desc"><em>PlantUML Class diagram</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onSequenceDiagram(); onClose(); }}>
        <div className="hdr-title">Sequence Diagram</div>
        <div className="hdr-desc"><em>PlantUML Sequence diagram</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onUseCaseDiagram(); onClose(); }}>
        <div className="hdr-title">Use Case Diagram</div>
        <div className="hdr-desc"><em>PlantUML Use Case diagram</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onActivityDiagram(); onClose(); }}>
        <div className="hdr-title">Activity Diagram</div>
        <div className="hdr-desc"><em>PlantUML Activity diagram</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onComponentDiagram(); onClose(); }}>
        <div className="hdr-title">Component Diagram</div>
        <div className="hdr-desc"><em>PlantUML Component diagram</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onStateDiagram(); onClose(); }}>
        <div className="hdr-title">State Diagram</div>
        <div className="hdr-desc"><em>PlantUML State diagram</em></div>
        <div className="hdr-sep" />
      </button>
    </div>
  );
}
