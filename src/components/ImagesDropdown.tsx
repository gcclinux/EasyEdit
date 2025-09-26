// React import not required with the new JSX transform

type Props = {
  onInsertTemplate: (template: string) => void;
  onClose: () => void;
};

const templates: Array<{ title: string; desc: string; tpl: string }> = [
  { title: 'Image', desc: 'Inline image', tpl: '![EasyEdit](https://raw.githubusercontent.com/gcclinux/EasyEdit/refs/heads/main/public/easyedit128.png)\n\n' },
  { title: 'Image (link)', desc: 'Image wrapped in a link', tpl: '[![EasyEdit](https://raw.githubusercontent.com/gcclinux/EasyEdit/refs/heads/main/public/easyedit128.png)](https://github.com/gcclinux/easyedit)\n\n' },
  { title: 'Figure with caption', desc: 'Image with caption below', tpl: '![](https://raw.githubusercontent.com/gcclinux/EasyEdit/refs/heads/main/public/easyedit128.png)\n\n*Figure: caption*\n\n' },
  { title: 'Image + Link (new tab)', desc: 'Image linking to URL', tpl: '[![EasyEdit](https://raw.githubusercontent.com/gcclinux/EasyEdit/refs/heads/main/public/easyedit128.png)](https://github.com/gcclinux/easyedit "EasyEdit HomePage")\n\n' },
];

export default function ImagesDropdown({ onInsertTemplate, onClose }: Props) {
  return (
    <div className="header-dropdown format-dropdown">
      {templates.map((t) => (
        <button
          key={t.title}
          className="dropdown-item"
          onClick={() => {
            onInsertTemplate(t.tpl);
            onClose();
          }}
        >
          <div className="hdr-title">{t.title}</div>
          <div className="hdr-desc"><em>{t.desc}</em></div>
          <div className="hdr-sep" />
        </button>
      ))}
    </div>
  );
}
