// React import not required with the new JSX transform

type Props = {
  onSymbol3: () => void;
  onSymbol4: () => void;
  onSymbol5: () => void;
  onSymbol6: () => void;
  onSymbol7: () => void;
  onSymbol8: () => void;
  onSymbol9: () => void;
  onSymbol11: () => void;
  onSymbol12: () => void;
  onSymbol17: () => void;
  onSymbol18: () => void;
  onSymbol19: () => void;
  onSymbol20: () => void;
  onSymbol21: () => void;
  onSymbol22: () => void;
  onSymbol23: () => void;
  onSymbol24: () => void;
  onSymbol25: () => void;
  onSymbol26: () => void;
  onSymbol27: () => void;
  onClose: () => void;
};

export default function SymbolsDropdown({
  onSymbol3,
  onSymbol4,
  onSymbol5,
  onSymbol6,
  onSymbol7,
  onSymbol8,
  onSymbol9,
  onSymbol11,
  onSymbol12,
  onSymbol17,
  onSymbol18,
  onSymbol19,
  onSymbol20,
  onSymbol21,
  onSymbol22,
  onSymbol23,
  onSymbol24,
  onSymbol25,
  onSymbol26,
  onSymbol27,
  onClose
}: Props) {
  return (
    <div className="header-dropdown format-dropdown symbols-dropdown">
      <button className="dropdown-item" onClick={() => { onSymbol3(); onClose(); }}>
        <div className="hdr-title">&#8710;</div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onSymbol4(); onClose(); }}>
        <div className="hdr-title">&#8711;</div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onSymbol5(); onClose(); }}>
        <div className="hdr-title">&#8721;</div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onSymbol6(); onClose(); }}>
        <div className="hdr-title">&#8730;</div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onSymbol7(); onClose(); }}>
        <div className="hdr-title">&#8734;</div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onSymbol8(); onClose(); }}>
        <div className="hdr-title">&#8470;</div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onSymbol9(); onClose(); }}>
        <div className="hdr-title">&#8736;</div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onSymbol11(); onClose(); }}>
        <div className="hdr-title">&#8743;</div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onSymbol12(); onClose(); }}>
        <div className="hdr-title">&#8744;</div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onSymbol17(); onClose(); }}>
        <div className="hdr-title">&#8756;</div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onSymbol18(); onClose(); }}>
        <div className="hdr-title">&#8757;</div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onSymbol19(); onClose(); }}>
        <div className="hdr-title">&#8758;</div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onSymbol20(); onClose(); }}>
        <div className="hdr-title">&#8759;</div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onSymbol21(); onClose(); }}>
        <div className="hdr-title">&#8760;</div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onSymbol22(); onClose(); }}>
        <div className="hdr-title">&#8761;</div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onSymbol23(); onClose(); }}>
        <div className="hdr-title">&#8866;</div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onSymbol24(); onClose(); }}>
        <div className="hdr-title">&#8867;</div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onSymbol25(); onClose(); }}>
        <div className="hdr-title">&#8868;</div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onSymbol26(); onClose(); }}>
        <div className="hdr-title">&#8869;</div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onSymbol27(); onClose(); }}>
        <div className="hdr-title">&#169;</div>
        <div className="hdr-sep" />
      </button>
    </div>
  );
}
