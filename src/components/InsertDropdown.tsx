// React import not required with the new JSX transform

type Props = {
  onRuler: () => void;
  onIndent1: () => void;
  onIndent2: () => void;
  onList1: () => void;
  onList2: () => void;
  onInsertTemplate: (tpl: string) => void;
  onClose: () => void;
};

export default function InsertDropdown({ onRuler, onIndent1, onIndent2, onList1, onList2, onInsertTemplate, onClose }: Props) {
  return (
    <div className="header-dropdown format-dropdown">
      <button
        className="dropdown-item"
        onClick={() => {
              // insert a simple link to the project homepage
              onInsertTemplate('[EasyEdit HomePage](https://github.com/gcclinux/easyedit)');
          onClose();
        }}
      >
        <div className="hdr-title">Link</div>
        <div className="hdr-desc"><em>Simple link</em></div>
        <div className="hdr-sep" />
      </button>
          <button
            className="dropdown-item"
            onClick={() => {
              // insert a checklist example
              onInsertTemplate('- [ ] This item is unchecked\n- [X] This item is checked\n');
              onClose();
            }}
          >
            <div className="hdr-title">Checklist</div>
            <div className="hdr-desc"><em>Insert a checked / unchecked list</em></div>
            <div className="hdr-sep" />
          </button>
      <button className="dropdown-item" onClick={() => { onRuler(); onClose(); }}>
        <div className="hdr-title">Ruler</div>
        <div className="hdr-desc"><em>Markdown ruler / page split</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onIndent1(); onClose(); }}>
        <div className="hdr-title">Indent &gt;</div>
        <div className="hdr-desc"><em>Markdown indent level 1</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onIndent2(); onClose(); }}>
        <div className="hdr-title">Indent &gt;&gt;</div>
        <div className="hdr-desc"><em>Markdown indent level 2</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onList1(); onClose(); }}>
        <div className="hdr-title">List 1</div>
        <div className="hdr-desc"><em>Markdown list level 1</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onList2(); onClose(); }}>
        <div className="hdr-title">List 2</div>
        <div className="hdr-desc"><em>Markdown list level 2</em></div>
        <div className="hdr-sep" />
      </button>
    </div>
  );
}
