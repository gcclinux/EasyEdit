import { useLanguage } from '../i18n/LanguageContext';

type Props = {
  onAutoTable: () => void;
  onAutoGantt: () => void;
  onAutoTimeline: () => void;
  onClose: () => void;
};

export default function AutoDropdown({
  onAutoTable,
  onAutoGantt,
  onAutoTimeline,
  onClose
}: Props) {
  const { t } = useLanguage();

  return (
    <div className="header-dropdown format-dropdown">
      <button className="dropdown-item" onClick={() => { onAutoTable(); onClose(); }}>
        <div className="hdr-title">{t('auto_generate.table')}</div>
        <div className="hdr-desc"><em>{t('auto_generate.table_desc')}</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onAutoGantt(); onClose(); }}>
        <div className="hdr-title">{t('auto_generate.gantt')}</div>
        <div className="hdr-desc"><em>{t('auto_generate.gantt_desc')}</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onAutoTimeline(); onClose(); }}>
        <div className="hdr-title">{t('auto_generate.timeline')}</div>
        <div className="hdr-desc"><em>{t('auto_generate.timeline_desc')}</em></div>
        <div className="hdr-sep" />
      </button>
    </div>
  );
}
