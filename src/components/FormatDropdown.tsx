// React import not required with the new JSX transform

type Props = {
  onCodeLine: () => void;
  onCodeBlock: () => void;
  onBold: () => void;
  onItalic: () => void;
  onStrike: () => void;
  onNewLine: () => void;
  onClose: () => void;
};

export default function FormatDropdown({ onCodeLine, onCodeBlock, onBold, onItalic, onStrike, onNewLine, onClose }: Props) {
  return (
    <div className="header-dropdown format-dropdown">
      <button className="dropdown-item" onClick={() => { onCodeLine(); onClose(); }}>
        <div className="hdr-title">CodeLine</div>
        <div className="hdr-desc"><em>Inline code: `code`</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onCodeBlock(); onClose(); }}>
        <div className="hdr-title">CodeBlock</div>
        <div className="hdr-desc"><em>Block code: ```code```</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onBold(); onClose(); }}>
        <div className="hdr-title">Bold</div>
        <div className="hdr-desc"><em>**Bold**</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onItalic(); onClose(); }}>
        <div className="hdr-title">Italic</div>
        <div className="hdr-desc"><em>*Italic*</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onStrike(); onClose(); }}>
        <div className="hdr-title">Strike</div>
        <div className="hdr-desc"><em>~~Strike~~</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onNewLine(); onClose(); }}>
        <div className="hdr-title">NewLine</div>
        <div className="hdr-desc"><em>Line 2 (two spaces + Enter)</em></div>
        <div className="hdr-sep" />
      </button>
    </div>
  );
}
