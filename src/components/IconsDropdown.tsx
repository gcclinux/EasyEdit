// React import not required with the new JSX transform

type IconItem = { icon: string; label: string; };

type Props = {
  onInsertIcon: (icon: string) => void;
  onClose: () => void;
};

const iconCategories: { name: string; icons: IconItem[] }[] = [
  {
    name: "Status",
    icons: [
      { icon: "✅", label: "Check" },
      { icon: "❌", label: "Cross" },
      { icon: "⚠️", label: "Warning" },
      { icon: "⭐", label: "Star" },
      { icon: "🔥", label: "Fire" },
      { icon: "💡", label: "Bulb" }
    ]
  },
  {
    name: "Actions",
    icons: [
      { icon: "📝", label: "Memo" },
      { icon: "🚀", label: "Rocket" },
      { icon: "🎯", label: "Target" },
      { icon: "📊", label: "Chart" },
      { icon: "🔧", label: "Wrench" },
      { icon: "📅", label: "Calendar" }
    ]
  },
  {
    name: "Colors",
    icons: [
      { icon: "🔵", label: "Blue" },
      { icon: "🟢", label: "Green" },
      { icon: "🔴", label: "Red" },
      { icon: "🟡", label: "Yellow" },
      { icon: "🟣", label: "Purple" },
      { icon: "🟠", label: "Orange" }
    ]
  },
  {
    name: "Symbols",
    icons: [
      { icon: "✨", label: "Sparkles" },
      { icon: "🎉", label: "Party" },
      { icon: "👍", label: "Thumbs Up" },
      { icon: "👎", label: "Thumbs Down" },
      { icon: "💰", label: "Money" },
      { icon: "⏰", label: "Clock" }
    ]
  }
];

export default function IconsDropdown({ onInsertIcon, onClose }: Props) {
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
            title={it.label}
          >
            <span className="icon-glyph">{it.icon}</span>
            <span className="icon-label">{it.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
