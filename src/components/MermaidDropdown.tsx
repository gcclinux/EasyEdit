import { useLanguage } from '../i18n/LanguageContext';

type Props = {
  onJourney: () => void;
  onFlowchart: () => void;
  onGantt: () => void;
  onGraphTD: () => void;
  onErDiag: () => void;
  onTimeLine: () => void;
  onClassDiag: () => void;
  onGitGraph: () => void;
  onBlock: () => void;
  onClose: () => void;
};

export default function MermaidDropdown({ onJourney, onFlowchart, onGantt, onGraphTD, onErDiag, onTimeLine, onClassDiag, onGitGraph, onBlock, onClose }: Props) {
  const { t } = useLanguage();

  return (
    <div className="header-dropdown format-dropdown">
      <button className="dropdown-item" onClick={() => { onJourney(); onClose(); }}>
        <div className="hdr-title">{t('mermaid.journey')}</div>
        <div className="hdr-desc"><em>{t('mermaid.journey_desc')}</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onFlowchart(); onClose(); }}>
        <div className="hdr-title">{t('mermaid.flowchart')}</div>
        <div className="hdr-desc"><em>{t('mermaid.flowchart_desc')}</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onGantt(); onClose(); }}>
        <div className="hdr-title">{t('mermaid.gantt')}</div>
        <div className="hdr-desc"><em>{t('mermaid.gantt_desc')}</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onGraphTD(); onClose(); }}>
        <div className="hdr-title">{t('mermaid.graphtd')}</div>
        <div className="hdr-desc"><em>{t('mermaid.graphtd_desc')}</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onErDiag(); onClose(); }}>
        <div className="hdr-title">{t('mermaid.erdiag')}</div>
        <div className="hdr-desc"><em>{t('mermaid.erdiag_desc')}</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onTimeLine(); onClose(); }}>
        <div className="hdr-title">{t('mermaid.timeline')}</div>
        <div className="hdr-desc"><em>{t('mermaid.timeline_desc')}</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onClassDiag(); onClose(); }}>
        <div className="hdr-title">{t('mermaid.classdiag')}</div>
        <div className="hdr-desc"><em>{t('mermaid.classdiag_desc')}</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onGitGraph(); onClose(); }}>
        <div className="hdr-title">{t('mermaid.gitgraph')}</div>
        <div className="hdr-desc"><em>{t('mermaid.gitgraph_desc')}</em></div>
        <div className="hdr-sep" />
      </button>
      <button className="dropdown-item" onClick={() => { onBlock(); onClose(); }}>
        <div className="hdr-title">{t('mermaid.block')}</div>
        <div className="hdr-desc"><em>{t('mermaid.block_desc')}</em></div>
        <div className="hdr-sep" />
      </button>
    </div>
  );
}
