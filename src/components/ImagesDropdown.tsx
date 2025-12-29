import { useLanguage } from '../i18n/LanguageContext';

type Props = {
  onInsertTemplate: (template: string) => void;
  onClose: () => void;
};

export default function ImagesDropdown({ onInsertTemplate, onClose }: Props) {
  const { t } = useLanguage();

  const templates: Array<{ title: string; desc: string; tpl: string }> = [
    { title: t('images.image'), desc: t('images.inline'), tpl: '![EasyEdit](https://raw.githubusercontent.com/gcclinux/EasyEdit/refs/heads/main/public/easyedit128.png)\n\n' },
    { title: t('images.image_link'), desc: t('images.image_link_desc'), tpl: '[![EasyEdit](https://raw.githubusercontent.com/gcclinux/EasyEdit/refs/heads/main/public/easyedit128.png)](https://github.com/gcclinux/easyedit)\n\n' },
    { title: t('images.figure'), desc: t('images.figure_desc'), tpl: '![](https://raw.githubusercontent.com/gcclinux/EasyEdit/refs/heads/main/public/easyedit128.png)\n\n*Figure: caption*\n\n' },
    { title: t('images.link_new_tab'), desc: t('images.link_new_tab_desc'), tpl: '[![EasyEdit](https://raw.githubusercontent.com/gcclinux/EasyEdit/refs/heads/main/public/easyedit128.png)](https://github.com/gcclinux/easyedit "EasyEdit HomePage")\n\n' },
  ];

  return (
    <div className="header-dropdown format-dropdown">
      {templates.map((tpl) => (
        <button
          key={tpl.title}
          className="dropdown-item"
          onClick={() => {
            onInsertTemplate(tpl.tpl);
            onClose();
          }}
        >
          <div className="hdr-title">{tpl.title}</div>
          <div className="hdr-desc"><em>{tpl.desc}</em></div>
          <div className="hdr-sep" />
        </button>
      ))}
    </div>
  );
}
