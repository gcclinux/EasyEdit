import { useLanguage } from '../i18n/LanguageContext';

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

export default function FooterDropdown({ onInsertTemplate, onClose }: Props) {
  const { t } = useLanguage();

  const templates: FooterTemplate[] = [
    {
      name: t('footer.simple'),
      markdown: 'This is a sentence with a footnote[^1].\n\n[^1]: This is the footnote content.\n\n',
      description: t('footer.simple_desc'),
    },
    {
      name: t('footer.multiple'),
      markdown:
        'First footnote[^1] and second footnote[^2].\n\n[^1]: First footnote content.\n[^2]: Second footnote content.\n\n',
      description: t('footer.multiple_desc'),
    },
    {
      name: t('footer.numbered'),
      markdown: 'Reference with number[^note1].\n\n[^note1]: Detailed explanation or source.\n\n',
      description: t('footer.numbered_desc'),
    },
    {
      name: t('footer.academic'),
      markdown:
        'According to research[^research2025].\n\n[^research2025]: Smith, J. (2025). *Academic Paper Title*. Journal Name, 17(2), 123-140.\n\n',
      description: t('footer.academic_desc'),
    },
  ];

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
