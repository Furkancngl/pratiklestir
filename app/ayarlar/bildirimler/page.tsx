import { BellIcon } from "@/app/components/icons";
import ComingSoon from "../coming-soon";

export default function AyarlarBildirimlerPage() {
  return (
    <ComingSoon
      title="Bildirimler"
      description="Hangi konularda bildirim almak istediğini seç."
      icon={BellIcon}
    />
  );
}
