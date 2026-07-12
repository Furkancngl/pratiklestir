type BadgeIcon = "shield" | "device" | "check";

type Badge = {
  icon: BadgeIcon;
  label: string;
};

const badges: Badge[] = [
  { icon: "shield", label: "Verileriniz Bizde Saklanmaz" },
  { icon: "device", label: "Sunucuya Yüklenmez" },
  { icon: "check", label: "Kayıt Gerektirmez" },
];

function BadgeIconGlyph({ icon, className }: { icon: BadgeIcon; className?: string }) {
  const shared = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  switch (icon) {
    case "shield":
      return (
        <svg {...shared}>
          <path d="M12 3 4.5 6v6c0 4.5 3.2 7.4 7.5 9 4.3-1.6 7.5-4.5 7.5-9V6L12 3Z" />
        </svg>
      );
    case "device":
      return (
        <svg {...shared}>
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M8 20h8M12 16v4" />
        </svg>
      );
    case "check":
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8.5 12.5 2.5 2.5 4.5-5" />
        </svg>
      );
  }
}

export default function TrustBadges() {
  return (
    <div
      className="mt-8 flex flex-wrap items-center justify-center gap-2.5"
      aria-label="Güven rozetleri"
    >
      {badges.map((badge) => (
        <div
          key={badge.label}
          className="flex items-center gap-1.5 rounded-full border border-purple-500/[.12] bg-purple-500/[.04] px-3.5 py-1.5 dark:border-purple-400/[.15] dark:bg-purple-400/[.05]"
        >
          <BadgeIconGlyph
            icon={badge.icon}
            className="h-3.5 w-3.5 shrink-0 text-purple-400 dark:text-purple-300/80"
          />
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            {badge.label}
          </span>
        </div>
      ))}
    </div>
  );
}
