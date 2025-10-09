// React import not required with the new JSX transform

type LinkTemplate = {
  name: string;
  markdown: string;
  description: string;
};

type Props = {
  onInsertTemplate: (tpl: string) => void;
  onClose: () => void;
};

const linkTemplates: LinkTemplate[] = [
  {
    name: 'Inline Link',
    markdown: '[Link text](https://example.com)\n\n',
    description: 'Standard inline markdown link',
  },
  {
    name: 'Link with Title',
    markdown: '[Link text](https://example.com "Link title")\n\n',
    description: 'Inline link that includes a title (tooltip)',
  },
  {
    name: 'Reference Style Link',
    markdown: '[Link text][ref-name]\n\n[ref-name]: https://example.com "Optional title"\n\n',
    description: 'Reference-style link with separate definition block',
  },
  {
    name: 'Auto Link',
    markdown: '<https://example.com>\n\n',
    description: 'Angle-bracket autolink',
  },
  {
    name: 'Email Link',
    markdown: '[Contact me](mailto:user@example.com)\n\n',
    description: 'Mailto link that opens the email client',
  },
  {
    name: 'Phone Link',
    markdown: '[Call us](tel:+1234567890)\n\n',
    description: 'Telephone link for clickable dialing on supported devices',
  },
  {
    name: 'Internal Link',
    markdown: '[Go to section](#section-name)\n\n',
    description: 'Anchor link to a heading within the current document',
  },
  {
    name: 'Download Link',
    markdown: '[Download file](./path/to/file.pdf)\n\n',
    description: 'Relative path link for downloadable assets',
  },
  {
    name: 'Markdown Img URL',
    markdown: '#### *Markdown Image URL Example*\n\n[![GitHub Project](https://raw.githubusercontent.com/gcclinux/EasyEdit/refs/heads/main/public/easyedit128.png "EasyEdit")](https://github.com/gcclinux/EasyEdit)\n\n',
    description: 'Embed an image that links to the EasyEdit project',
  },
];

export default function LinksDropdown({ onInsertTemplate, onClose }: Props) {
  return (
    <div className="header-dropdown format-dropdown">
      {linkTemplates.map((tpl) => (
        <button
          key={tpl.name}
          className="dropdown-item"
          onClick={() => {
            onInsertTemplate(tpl.markdown);
            onClose();
          }}
        >
          <div className="hdr-title">{tpl.name}</div>
          <div className="hdr-desc"><em>{tpl.description}</em></div>
          <div className="hdr-sep" />
        </button>
      ))}
    </div>
  );
}
