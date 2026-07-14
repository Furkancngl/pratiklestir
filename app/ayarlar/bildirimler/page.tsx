import { requireCurrentUser } from "@/app/lib/current-user";
import NotificationSettings from "./notification-settings";

export default async function AyarlarBildirimlerPage() {
  const user = await requireCurrentUser();

  return (
    <NotificationSettings
      initialPreferences={{
        notifyNewFeatures: user.notifyNewFeatures,
        notifyMarketing: user.notifyMarketing,
      }}
    />
  );
}
