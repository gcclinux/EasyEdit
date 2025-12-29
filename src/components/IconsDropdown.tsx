import { useLanguage } from '../i18n/LanguageContext';

type IconItem = { icon: string; label: string; };

type Props = {
  onInsertIcon: (icon: string) => void;
  onClose: () => void;
};

// We keep the structure but labels are keys now or used to generate keys
const iconCategories: { name: string; icons: IconItem[] }[] = [
  {
    name: "status",
    icons: [
      { icon: "✅", label: "check" },
      { icon: "❌", label: "cross" },
      { icon: "⚠️", label: "warning" },
      { icon: "⭐", label: "star" },
      { icon: "🔥", label: "fire" },
      { icon: "💡", label: "bulb" }
    ]
  },
  {
    name: "actions",
    icons: [
      { icon: "📝", label: "memo" },
      { icon: "🚀", label: "rocket" },
      { icon: "🎯", label: "target" },
      { icon: "📊", label: "chart" },
      { icon: "🔧", label: "wrench" },
      { icon: "📅", label: "calendar" }
    ]
  },
  {
    name: "colors",
    icons: [
      { icon: "🔵", label: "blue" },
      { icon: "🟢", label: "green" },
      { icon: "🔴", label: "red" },
      { icon: "🟡", label: "yellow" },
      { icon: "🟣", label: "purple" },
      { icon: "🟠", label: "orange" }
    ]
  },
  {
    name: "symbols",
    icons: [
      { icon: "✨", label: "sparkles" },
      { icon: "🎉", label: "party" },
      { icon: "👍", label: "thumbs_up" },
      { icon: "👎", label: "thumbs_down" },
      { icon: "💰", label: "money" },
      { icon: "⏰", label: "clock" }
    ]
  }
];

export default function IconsDropdown({ onInsertIcon, onClose }: Props) {
  const { t } = useLanguage();
  // Flatten all icons into a single list (no grouping) and render 3 per line
  const flatIcons = iconCategories.flatMap(cat => cat.icons);

  return (
    <div className="header-dropdown format-dropdown icons-dropdown">
      <div className="icons-grid">
        {flatIcons.map((it) => (
          <button
            key={it.label}
            className="dropdown-item icon-item"
            onClick={() => { onInsertIcon(it.icon); onClose(); }}
            title={t(`icons.labels.${it.label}`)}
          >
            <span className="icon-glyph">{it.icon}</span>
            <span className="icon-label">{t(`icons.labels.${it.label}`)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
