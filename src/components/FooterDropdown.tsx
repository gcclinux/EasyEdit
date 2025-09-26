// React import not required with the new JSX transform

type FooterTemplate = {
  name: string;
  markdown: string;
  description?: string;
};

type Props = {
  onInsertTemplate: (tpl: string) => void;
  onClose: () => void;
};

const templates: FooterTemplate[] = [
  {
    name: 'Simple Footnote',
    markdown: 'This is a sentence with a footnote[^1].\n\n[^1]: This is the footnote content.\n\n',
    description: 'Single reference with one footnote definition',
  },
  {
    name: 'Multiple Footnotes',
    markdown:
      'First footnote[^1] and second footnote[^2].\n\n[^1]: First footnote content.\n[^2]: Second footnote content.\n\n',
    description: 'Two references and two definitions',
  },
  {
    name: 'Numbered Footnote',
    markdown: 'Reference with number[^note1].\n\n[^note1]: Detailed explanation or source.\n\n',
    description: 'Custom label/numbered footnote reference',
  },
  {
    name: 'Academic Style',
    markdown:
      'According to research[^research2025].\n\n[^research2025]: Smith, J. (2025). *Academic Paper Title*. Journal Name, 17(2), 123-140.\n\n',
    description: 'Citation-style footnote with bibliographic example',
  },
];

export default function FooterDropdown({ onInsertTemplate, onClose }: Props) {
  return (
    <div className="header-dropdown format-dropdown">
      {templates.map((tpl) => (
        <button
          key={tpl.name}
          className="dropdown-item"
          onClick={() => {
            onInsertTemplate(tpl.markdown);
            onClose();
          }}
        >
          <div className="hdr-title">{tpl.name}</div>
          {tpl.description && <div className="hdr-desc"><em>{tpl.description}</em></div>}
          <div className="hdr-sep" />
        </button>
      ))}
    </div>
  );
}
