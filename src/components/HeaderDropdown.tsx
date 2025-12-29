import { useLanguage } from '../i18n/LanguageContext';

type Props = {
  onInsertH1: () => void;
  onInsertH2: () => void;
  onInsertH3: () => void;
  onInsertH4: () => void;
  onInsertH5: () => void;
  onInsertH6: () => void;
  onClose: () => void;
};

export default function HeaderDropdown({ onInsertH1, onInsertH2, onInsertH3, onInsertH4, onInsertH5, onInsertH6, onClose }: Props) {
  const { t } = useLanguage();

  return (
    <div className="header-dropdown">
      <button
        className="dropdown-item header1-button"
        onClick={() => { onInsertH1(); onClose(); }}
      >
        <div className="hdr-title">{t('headers.h1')}</div>
        <div className="hdr-desc"><em>{t('headers.h1_desc')}</em></div>
        <div className="hdr-sep" />
      </button>

      <button
        className="dropdown-item header2-button"
        onClick={() => { onInsertH2(); onClose(); }}
      >
        <div className="hdr-title">{t('headers.h2')}</div>
        <div className="hdr-desc"><em>{t('headers.h2_desc')}</em></div>
        <div className="hdr-sep" />
      </button>

      <button
        className="dropdown-item header3-button"
        onClick={() => { onInsertH3(); onClose(); }}
      >
        <div className="hdr-title">{t('headers.h3')}</div>
        <div className="hdr-desc"><em>{t('headers.h3_desc')}</em></div>
        <div className="hdr-sep" />
      </button>

      <button
        className="dropdown-item header4-button"
        onClick={() => { onInsertH4(); onClose(); }}
      >
        <div className="hdr-title">{t('headers.h4')}</div>
        <div className="hdr-desc"><em>{t('headers.h4_desc')}</em></div>
        <div className="hdr-sep" />
      </button>

      <button
        className="dropdown-item header5-button"
        onClick={() => { onInsertH5(); onClose(); }}
      >
        <div className="hdr-title">{t('headers.h5')}</div>
        <div className="hdr-desc"><em>{t('headers.h5_desc')}</em></div>
        <div className="hdr-sep" />
      </button>

      <button
        className="dropdown-item header6-button"
        onClick={() => { onInsertH6(); onClose(); }}
      >
        <div className="hdr-title">{t('headers.h6')}</div>
        <div className="hdr-desc"><em>{t('headers.h6_desc')}</em></div>
        <div className="hdr-sep" />
      </button>
    </div>
  );
}
