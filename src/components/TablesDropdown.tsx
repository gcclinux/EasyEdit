// React import not required with the new JSX transform

type TableTemplate = {
  name: string;
  shortcut?: string;
  description?: string;
  markdown: string;
};

type Props = {
  onInsertTemplate: (tpl: string) => void;
  onClose: () => void;
};

const tableTemplates: TableTemplate[] = [
  {
    name: '𐄊 2x2 Table',
    shortcut: 'Alt+T+1',
    description: 'Insert 2x2 table',
    markdown: `| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |\n\n`,
  },
  {
    name: '𐄎 3x3 Table',
    shortcut: 'Alt+T+2',
    description: 'Insert 3x3 table',
    markdown: `| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n| Cell 7   | Cell 8   | Cell 9   |\n\n`,
  },
  {
    name: '𐄗 Task List Table',
    shortcut: 'Alt+T+3',
    description: 'Insert task list table',
    markdown: `| Task | Status | Priority | Due Date |\n|------|--------|----------|----------|\n| Task 1 | In Progress | High | 2024-01-15 |\n| Task 2 | Completed | Medium | 2024-01-10 |\n| Task 3 | Pending | Low | 2024-01-20 |\n\n`,
  },
  {
    name: '𐄳 Comparison Table',
    shortcut: 'Alt+T+4',
    description: 'Insert comparison table',
    markdown: `| Feature | Option A | Option B | Option C |\n|---------|----------|----------|----------|\n| Price | $10 | $15 | $20 |\n| Quality | Good | Better | Best |\n| Support | Basic | Standard | Premium |\n\n`,
  },
];

export default function TablesDropdown({ onInsertTemplate, onClose }: Props) {
  return (
    <div className="header-dropdown format-dropdown">
      {tableTemplates.map((tpl) => (
        <div key={tpl.name}>
          <button
            className="dropdown-item"
            onClick={() => {
              onInsertTemplate(tpl.markdown);
              onClose();
            }}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div className="hdr-title">{tpl.name}</div>
              {tpl.shortcut && <div className="hdr-desc" style={{fontStyle: 'normal'}}><em>{tpl.shortcut}</em></div>}
            </div>
            {tpl.description && <div className="hdr-desc"><em>{tpl.description}</em></div>}
            <div className="hdr-sep" />
          </button>
        </div>
      ))}
    </div>
  );
}
