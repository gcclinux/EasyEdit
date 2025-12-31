import { useLanguage } from '../i18n/LanguageContext';

type LinkTemplate = {
  name: string;
  markdown: string;
  description: string;
};

type Props = {
  onInsertTemplate: (tpl: string) => void;
  onClose: () => void;
};

export default function LinksDropdown({ onInsertTemplate, onClose }: Props) {
  const { t } = useLanguage();

  const linkTemplates: LinkTemplate[] = [
    {
      name: t('links.inline'),
      markdown: '[Link text](https://example.com)\n\n',
      description: t('links.inline_desc'),
    },
    {
      name: t('links.title'),
      markdown: '[Link text](https://example.com "Link title")\n\n',
      description: t('links.title_desc'),
    },
    {
      name: t('links.reference'),
      markdown: '[Link text][ref-name]\n\n[ref-name]: https://example.com "Optional title"\n\n',
      description: t('links.reference_desc'),
    },
    {
      name: t('links.autolink'),
      markdown: '<https://example.com>\n\n',
      description: t('links.autolink_desc'),
    },
    {
      name: t('links.email'),
      markdown: '[Contact me](mailto:user@example.com)\n\n',
      description: t('links.email_desc'),
    },
    {
      name: t('links.phone'),
      markdown: '[Call us](tel:+1234567890)\n\n',
      description: t('links.phone_desc'),
    },
    {
      name: t('links.internal'),
      markdown: '[Go to section](#section-name)\n\n',
      description: t('links.internal_desc'),
    },
    {
      name: t('links.download'),
      markdown: '[Download file](./path/to/file.pdf)\n\n',
      description: t('links.download_desc'),
    },
    {
      name: t('links.markdown_img'),
      markdown: '#### *Markdown Image URL Example*\n\n[![GitHub Project](https://raw.githubusercontent.com/gcclinux/EasyEditor/refs/heads/main/public/easyeditor128.png "EasyEditor")](https://github.com/gcclinux/EasyEditor)\n\n',
      description: t('links.markdown_img_desc'),
    },
  ];

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
