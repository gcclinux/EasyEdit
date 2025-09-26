// React import not required with the new JSX transform

type Props = {
  onInsertH1: () => void;
  onInsertH2: () => void;
  onInsertH3: () => void;
  onInsertH4: () => void;
  onInsertH5: () => void;
  onInsertH6: () => void;
  onClose: () => void;
};

export default function HeaderDropdown({ onInsertH1, onInsertH2, onInsertH3, onInsertH4, onInsertH5, onInsertH6, onClose }: Props) {
  return (
    <div className="header-dropdown">
      <button
        className="dropdown-item header1-button"
        onClick={() => { onInsertH1(); onClose(); }}
      >
        <div className="hdr-title">Header 1</div>
        <div className="hdr-desc"><em># Header 1</em></div>
        <div className="hdr-sep" />
      </button>

      <button
        className="dropdown-item header2-button"
        onClick={() => { onInsertH2(); onClose(); }}
      >
        <div className="hdr-title">Header 2</div>
        <div className="hdr-desc"><em>## Header 2</em></div>
        <div className="hdr-sep" />
      </button>

      <button
        className="dropdown-item header3-button"
        onClick={() => { onInsertH3(); onClose(); }}
      >
        <div className="hdr-title">Header 3</div>
        <div className="hdr-desc"><em>### Header 3</em></div>
        <div className="hdr-sep" />
      </button>

      <button
        className="dropdown-item header4-button"
        onClick={() => { onInsertH4(); onClose(); }}
      >
        <div className="hdr-title">Header 4</div>
        <div className="hdr-desc"><em>#### Header 4</em></div>
        <div className="hdr-sep" />
      </button>

      <button
        className="dropdown-item header5-button"
        onClick={() => { onInsertH5(); onClose(); }}
      >
        <div className="hdr-title">Header 5</div>
        <div className="hdr-desc"><em>##### Header 5</em></div>
        <div className="hdr-sep" />
      </button>

      <button
        className="dropdown-item header6-button"
        onClick={() => { onInsertH6(); onClose(); }}
      >
        <div className="hdr-title">Header 6</div>
        <div className="hdr-desc"><em>###### Header 6</em></div>
        <div className="hdr-sep" />
      </button>
    </div>
  );
}
