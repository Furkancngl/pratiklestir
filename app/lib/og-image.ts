import { SITE_URL } from "./site";

const MAX_TITLE_LENGTH = 60;
const MAX_DESCRIPTION_LENGTH = 140;

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value;
}

// tools.ts / categories.ts tabanlı her sayfa (bkz. tool-metadata.ts,
// category-metadata.ts) OG görseli için statik tek bir dosya yerine bu
// fonksiyonla kendi başlık/açıklamasını taşıyan bir /api/og linki üretir;
// gerçek görsel istek anında app/api/og/route.tsx içinde ImageResponse ile
// oluşturulur - yeni bir araç eklendiğinde elle görsel tasarlamaya gerek
// kalmaz.
export function buildOgImageUrl({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const params = new URLSearchParams({
    title: truncate(title, MAX_TITLE_LENGTH),
    description: truncate(description, MAX_DESCRIPTION_LENGTH),
  });

  return {
    url: `${SITE_URL}/api/og?${params.toString()}`,
    width: 1200,
    height: 630,
  };
}
