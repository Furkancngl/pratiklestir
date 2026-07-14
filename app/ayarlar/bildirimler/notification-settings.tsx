"use client";

import { useState } from "react";
import { updateNotificationPreferences } from "@/app/actions/notifications";
import ToggleSwitch from "@/app/components/toggle-switch";

type Preferences = {
  notifyNewFeatures: boolean;
  notifyMarketing: boolean;
};

export default function NotificationSettings({
  initialPreferences,
}: {
  initialPreferences: Preferences;
}) {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function persist(next: Preferences) {
    setPreferences(next);
    setSaved(false);
    setError("");
    setPending(true);

    const result = await updateNotificationPreferences(next);

    setPending(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setSaved(true);
  }

  return (
    <div>
      <h1 className="mb-1.5 text-2xl font-extrabold tracking-tight text-black dark:text-white">
        Bildirimler
      </h1>
      <p className="mb-8 text-[13.5px] text-zinc-500 dark:text-zinc-400">
        Hangi konularda e-posta bildirimi almak istediğini seç.
      </p>

      <div className="max-w-[520px] divide-y divide-black/[.06] rounded-2xl border border-black/[.08] dark:divide-white/[.06] dark:border-white/[.08]">
        <div className="flex items-center justify-between gap-4 p-5">
          <div>
            <p className="text-[13.5px] font-semibold text-black dark:text-zinc-50">
              Yeni özellik duyuruları
            </p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Yeni araçlar ve önemli güncellemeler yayınlandığında haber ver.
            </p>
          </div>
          <ToggleSwitch
            label="Yeni özellik duyuruları"
            checked={preferences.notifyNewFeatures}
            onChange={(checked) => persist({ ...preferences, notifyNewFeatures: checked })}
          />
        </div>

        <div className="flex items-center justify-between gap-4 p-5">
          <div>
            <p className="text-[13.5px] font-semibold text-black dark:text-zinc-50">
              Hesap güvenlik uyarıları
            </p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Şifre değişikliği ve şüpheli giriş gibi güvenlik bildirimleri.
              Hesabının güvenliği için kapatılamaz.
            </p>
          </div>
          <ToggleSwitch label="Hesap güvenlik uyarıları" checked disabled />
        </div>

        <div className="flex items-center justify-between gap-4 p-5">
          <div>
            <p className="text-[13.5px] font-semibold text-black dark:text-zinc-50">
              Pazarlama e-postaları
            </p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Kampanya, indirim ve tanıtım içerikli e-postalar.
            </p>
          </div>
          <ToggleSwitch
            label="Pazarlama e-postaları"
            checked={preferences.notifyMarketing}
            onChange={(checked) => persist({ ...preferences, notifyMarketing: checked })}
          />
        </div>
      </div>

      <div className="mt-3 max-w-[520px] text-xs">
        {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
        {pending && !error && (
          <p className="text-zinc-400 dark:text-zinc-500">Kaydediliyor...</p>
        )}
        {saved && !pending && !error && (
          <p className="text-emerald-600 dark:text-emerald-400">Kaydedildi.</p>
        )}
      </div>
    </div>
  );
}
