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
          const date = new Date();
          const parts = date.toString().split(' ');
          // parts: ['Sun', 'Dec', '21', '2025', '22:05:41', 'GMT+0000', '(Coordinated', 'Universal', 'Time)']
          // We need time in AM/PM.
          const time = date.toLocaleTimeString('en-US', { hour12: true }); // "10:05:29 PM"
          // We need timezone. 'GMT' is hardcoded in user request example but might imply local. 
          // If we want exactly "Sun Dec 21 10:05:29 PM GMT 2025":
          // Let's assume the user wants their local time representation but formatted this way.
          // Getting explicit "GMT" or "EST" is flaky in JS without libraries. 
          // However, `date.toString()` usually gives `GMT-0500` or similar.

          // Let's try to stick to a slightly cleaner native string if possible, or build it.
          // User asked for: Sun Dec 21 10:05:29 PM GMT 2025

          const dayName = parts[0]; // Sun
          const month = parts[1];   // Dec
          const day = parts[2];     // 21
          const year = parts[3];    // 2025

          // To format nicely:
          const dateStr = `${dayName} ${month} ${day} ${time} GMT ${year}`;
          onInsertTemplate(dateStr);
          onClose();
        }}
      >
        <div className="hdr-title">Date</div>
        <div className="hdr-desc"><em>Today's date</em></div>
        <div className="hdr-sep" />
      </button>
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
