import { useLanguage } from '../i18n/LanguageContext';

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
  const { t } = useLanguage();

  return (
    <div className="header-dropdown format-dropdown">
      <button
        className="dropdown-item"
        onClick={() => {
          const date = new Date();
          const parts = date.toString().split(' ');
          const time = date.toLocaleTimeString('en-US', { hour12: true });
          const dayName = parts[0];
          const month = parts[1];
          const day = parts[2];
          const year = parts[3];

          const dateStr = `${dayName} ${month} ${day} ${time} GMT ${year}`;
          onInsertTemplate(dateStr);
          onClose();
        }}
      >
        <div className="hdr-title">{t('insert.date')}</div>
        <div className="hdr-desc"><em>{t('insert.date_desc')}</em></div>
        <div className="hdr-sep" />
      </button>
      <button
        className="dropdown-item"
        onClick={() => {
          // insert a simple link to the project homepage
          onInsertTemplate('[EasyEditor HomePage](https://github.com/gcclinux/easyeditor)');
          onClose();
        }}
      >
        <div className="hdr-title">{t('insert.link')}</div>
        <div className="hdr-desc"><em>{t('insert.link_desc')}</em></div>
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
        <div className="hdr-title">{t('insert.checklist')}</div>
        <div className="hdr-desc"><em>{t('insert.checklist_desc')}</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onRuler(); onClose(); }}>
        <div className="hdr-title">{t('insert.ruler')}</div>
        <div className="hdr-desc"><em>{t('insert.ruler_desc')}</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onIndent1(); onClose(); }}>
        <div className="hdr-title">{t('insert.indent1')}</div>
        <div className="hdr-desc"><em>{t('insert.indent1_desc')}</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onIndent2(); onClose(); }}>
        <div className="hdr-title">{t('insert.indent2')}</div>
        <div className="hdr-desc"><em>{t('insert.indent2_desc')}</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onList1(); onClose(); }}>
        <div className="hdr-title">{t('insert.list1')}</div>
        <div className="hdr-desc"><em>{t('insert.list1_desc')}</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onList2(); onClose(); }}>
        <div className="hdr-title">{t('insert.list2')}</div>
        <div className="hdr-desc"><em>{t('insert.list2_desc')}</em></div>
        <div className="hdr-sep" />
      </button>
    </div>
  );
}
