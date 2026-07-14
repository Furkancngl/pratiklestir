"use client";

export default function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  label,
}: {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  // Opacity, üstteki <button>'a değil doğrudan renk sınıflarına
  // uygulanıyor - böylece devre dışıyken sadece dolgu soluklaşır, beyaz
  // nokta her zaman tam opak/net kalır (aksi halde nokta da soluyup
  // grimsi bir tona dönüşüyor, bu da "farklı bir renk kombinasyonu"
  // gibi görünmesine sebep oluyordu).
  const trackClass = checked
    ? disabled
      ? "bg-linear-to-r from-violet-500/60 to-indigo-500/60"
      : "bg-linear-to-r from-violet-500 to-indigo-500"
    : disabled
      ? "bg-zinc-200/60 dark:bg-zinc-700/60"
      : "bg-zinc-200 dark:bg-zinc-700";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative h-6 w-11 shrink-0 touch-manipulation rounded-full transition-colors ${trackClass} ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
