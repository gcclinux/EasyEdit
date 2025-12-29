import { useLanguage } from '../i18n/LanguageContext';

type Props = {
  onCodeLine: () => void;
  onCodeBlock: () => void;
  onBold: () => void;
  onItalic: () => void;
  onStrike: () => void;
  onNewLine: () => void;
  onClose: () => void;
};

export default function FormatDropdown({ onCodeLine, onCodeBlock, onBold, onItalic, onStrike, onNewLine, onClose }: Props) {
  const { t } = useLanguage();

  return (
    <div className="header-dropdown format-dropdown">
      <button className="dropdown-item" onClick={() => { onCodeLine(); onClose(); }}>
        <div className="hdr-title">{t('format.codeline')}</div>
        <div className="hdr-desc"><em>{t('format.codeline_desc')}</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onCodeBlock(); onClose(); }}>
        <div className="hdr-title">{t('format.codeblock')}</div>
        <div className="hdr-desc"><em>{t('format.codeblock_desc')}</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onBold(); onClose(); }}>
        <div className="hdr-title">{t('format.bold')}</div>
        <div className="hdr-desc"><em>{t('format.bold_desc')}</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onItalic(); onClose(); }}>
        <div className="hdr-title">{t('format.italic')}</div>
        <div className="hdr-desc"><em>{t('format.italic_desc')}</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onStrike(); onClose(); }}>
        <div className="hdr-title">{t('format.strike')}</div>
        <div className="hdr-desc"><em>{t('format.strike_desc')}</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onNewLine(); onClose(); }}>
        <div className="hdr-title">{t('format.newline')}</div>
        <div className="hdr-desc"><em>{t('format.newline_desc')}</em></div>
        <div className="hdr-sep" />
      </button>
    </div>
  );
}
