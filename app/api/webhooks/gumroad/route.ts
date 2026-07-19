import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/app/lib/db";
import { users } from "@/app/lib/db/schema";
import { getDailyCreditLimit } from "@/app/lib/credits";
import { checkRateLimit, getClientIp, webhookRateLimit } from "@/app/lib/rate-limit";

// Gumroad'un sadece "Ping" ayarına girilen olay: yeni satış. İptal/refund/
// abonelik bitişi bildirimlerini de almak için Gumroad API'sinde ayrıca
// resource_subscriptions (resource_name: refund, dispute, cancellation,
// subscription_ended) kaydı açılmalı - bkz. cevaptaki açıklama.
//
// "cancellation" ile "subscription_ended" AYNI ŞEY DEĞİL: cancellation,
// kullanıcı (veya biz) aboneliği iptal ettiğinde - ödediği dönem henüz
// bitmemiştir, hâlâ "pro" kalmalı, sadece dönem sonunda düşeceği
// işaretlenir. subscription_ended, dönem gerçekten bittiğinde gelir - asıl
// "free"ye düşürme burada olur. refund/dispute ise anlık iade/itiraz
// olduğu için hemen düşürülür.
const IMMEDIATE_DOWNGRADE_RESOURCE_NAMES = new Set(["refund", "dispute", "subscription_ended"]);

type GumroadSale = {
  email: string;
  refunded: boolean;
  disputed: boolean;
  product_id: string;
  subscription_id?: string | null;
};

// Gumroad Ping isteği imzalanmıyor (Stripe'taki gibi bir HMAC/imza başlığı
// yok) - gövdedeki alanlara (email, refunded...) doğrudan güvenmek, doğru
// seller_id'yi bilen herkesin sahte istekle bedava Pro açmasına izin verir.
// Bu yüzden "pro" açan satışları, gizli GUMROAD_ACCESS_TOKEN ile Gumroad
// API'sinden tekrar sorgulayıp doğruluyoruz; sadece bu çağrının sonucuna
// güveniyoruz.
async function verifySale(saleId: string): Promise<GumroadSale | null> {
  const accessToken = process.env.GUMROAD_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("GUMROAD_ACCESS_TOKEN tanımlı değil, satış doğrulanamıyor.");
    return null;
  }

  const url = new URL(`https://api.gumroad.com/v2/sales/${encodeURIComponent(saleId)}`);
  url.searchParams.set("access_token", accessToken);

  const res = await fetch(url, { cache: "no-store" }).catch(() => null);
  if (!res || !res.ok) return null;

  const data = (await res.json().catch(() => null)) as
    | { success: boolean; sale?: GumroadSale }
    | null;
  if (!data?.success || !data.sale) return null;

  return data.sale;
}

export async function POST(request: Request) {
  const { allowed } = await checkRateLimit(
    webhookRateLimit,
    `gumroad-webhook:${getClientIp(request.headers)}`
  );
  if (!allowed) {
    return NextResponse.json({ error: "Çok fazla istek." }, { status: 429 });
  }

  const form = await request.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const sellerId = form.get("seller_id")?.toString();
  if (!sellerId || sellerId !== process.env.GUMROAD_SELLER_ID) {
    return NextResponse.json({ error: "Yetkisiz satıcı." }, { status: 401 });
  }

  const productId = form.get("product_id")?.toString();
  if (
    process.env.GUMROAD_PRODUCT_ID &&
    productId &&
    productId !== process.env.GUMROAD_PRODUCT_ID
  ) {
    // Aynı Gumroad hesabından satılan başka bir ürüne ait bildirim - bu
    // ürünü ilgilendirmiyor, ama Gumroad'a 200 dönmezsek yeniden dener.
    return NextResponse.json({ ok: true });
  }

  const resourceName = form.get("resource_name")?.toString() || "sale";
  const isCancellationEvent = resourceName === "cancellation";
  const isImmediateDowngradeEvent = IMMEDIATE_DOWNGRADE_RESOURCE_NAMES.has(resourceName);
  const saleId = form.get("sale_id")?.toString();

  let email: string | null = null;
  let refunded = false;
  let subscriptionId: string | null = null;

  if (saleId) {
    const sale = await verifySale(saleId);
    if (!sale) {
      return NextResponse.json({ error: "Satış doğrulanamadı." }, { status: 401 });
    }
    if (
      process.env.GUMROAD_PRODUCT_ID &&
      sale.product_id !== process.env.GUMROAD_PRODUCT_ID
    ) {
      // Gövdedeki (doğrulanmamış) product_id'ye değil, API'den doğrulanan
      // gerçek satışın product_id'sine bakıyoruz - aksi halde hesapta
      // ileride başka bir ürün satılırsa, o ürünün gerçek ama alakasız bir
      // sale_id'siyle bedava Pro açılabilir.
      return NextResponse.json({ ok: true });
    }
    email = sale.email;
    refunded = sale.refunded || sale.disputed;
    subscriptionId = sale.subscription_id ?? null;
  } else if (isCancellationEvent || isImmediateDowngradeEvent) {
    // Abonelik iptali/bitişi bildirimlerinde sale_id bulunmayabilir (bkz.
    // cevaptaki açıklama) - bu olaylar bedava Pro erişimi vermediği
    // (sadece işaretleme/düşürme yaptığı) için gövdedeki email'e
    // güveniyoruz.
    email = form.get("email")?.toString() || null;
  } else {
    return NextResponse.json({ error: "sale_id eksik." }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ error: "E-posta eksik." }, { status: 400 });
  }
  // users.email her yerde (kayıt, giriş, şifre sıfırlama) küçük harfe
  // normalize edilip öyle saklanıyor - burada normalize etmezsek Gumroad'dan
  // farklı harf büyüklüğüyle gelen email hiç eşleşmez ve ödeme sessizce
  // plana yansımaz.
  email = email.trim().toLowerCase();

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) {
    // Alıcı Gumroad'da hesap e-postasından farklı bir e-posta ile ödeme
    // yapmış olabilir - eşleşme yoksa sessizce 200 dönüyoruz, aksi halde
    // Gumroad aynı bildirimi saatlik olarak yeniden dener.
    return NextResponse.json({ ok: true });
  }

  if (isCancellationEvent) {
    // Ödenen dönem henüz bitmedi - kullanıcı hâlâ "pro" kalır, sadece
    // dönem sonunda otomatik düşeceği işaretlenir. Gerçek düşürme
    // "subscription_ended" ping'i gelince aşağıdaki dalda yapılır.
    await db
      .update(users)
      .set({ cancelAtPeriodEnd: true })
      .where(eq(users.id, user.id));

    return NextResponse.json({ ok: true });
  }

  const nextPlan = isImmediateDowngradeEvent || refunded ? "free" : "pro";

  await db
    .update(users)
    .set({
      plan: nextPlan,
      planSelectedAt: new Date(),
      credits: getDailyCreditLimit(nextPlan),
      creditsResetAt: new Date(),
      cancelAtPeriodEnd: false,
      gumroadSubscriptionId: nextPlan === "pro" ? subscriptionId : null,
    })
    .where(eq(users.id, user.id));

  return NextResponse.json({ ok: true });
}
