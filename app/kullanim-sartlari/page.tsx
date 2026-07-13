import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/app/lib/site";
import LegalPage, { LegalSection } from "@/app/components/legal-page";

export const metadata: Metadata = {
  title: { absolute: "Kullanım Şartları | Pratikleştir" },
  description:
    "Pratikleştir'i kullanırken geçerli olan kurallar, Free ve Pro plan farkları, ücretlendirme ve sorumluluk sınırları.",
  alternates: { canonical: `${SITE_URL}/kullanim-sartlari` },
  robots: { index: false, follow: true },
};

const listClass = "list-disc space-y-1.5 pl-5";

export default function Page() {
  return (
    <LegalPage heading="Kullanım Şartları" lastUpdated="13 Temmuz 2026">
      <LegalSection title="1. Hizmetin Tanımı">
        <p>
          {SITE_NAME}, QR kod oluşturma, PDF birleştirme/sıkıştırma, görsel
          sıkıştırma, arka plan silme gibi günlük ihtiyaçlara yönelik
          tarayıcı tabanlı araçlar sunan bir web platformudur. Araçların bir
          kısmı kayıt gerektirmeden kullanılabilir; bir kısmı ise günlük
          kredi sistemine bağlı olduğu için hesap oluşturmanızı gerektirir.
          Siteyi kullanarak bu şartları kabul etmiş sayılırsınız.
        </p>
      </LegalSection>

      <LegalSection title="2. Free ve Pro Plan Farkları">
        <p>Hesabınız, aşağıdaki iki plandan birine tabidir:</p>
        <ul className={listClass}>
          <li>
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              Free
            </span>{" "}
            — günde 30 kredi, aynı anda 1 dosya işleme, normal işlem
            önceliği, ücretsizdir.
          </li>
          <li>
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              Pro
            </span>{" "}
            — günde 200 kredi, aynı anda 10 dosya işleme, toplu işlem,
            öncelikli işlem hızı ve öncelikli destek içerir; güncel fiyatı{" "}
            <a
              href="/planlar"
              className="font-medium text-purple-600 underline underline-offset-2 dark:text-purple-400"
            >
              Planlar
            </a>{" "}
            sayfasında gösterilir.
          </li>
        </ul>
        <p>
          Kredi limitleri, araçların adil ve sürdürülebilir şekilde
          herkese sunulabilmesi için uygulanır ve her gün otomatik olarak
          yenilenir.
        </p>
      </LegalSection>

      <LegalSection title="3. Hesap Oluşturma ve Sorumluluğunuz">
        <ul className={listClass}>
          <li>
            Hesap oluştururken verdiğiniz bilgilerin (e-posta, ad) doğru
            olmasından siz sorumlusunuz.
          </li>
          <li>
            Şifrenizin gizliliğini korumak ve hesabınız üzerinden
            gerçekleştirilen tüm işlemlerden siz sorumlusunuz.
          </li>
          <li>
            Hesabınızda yetkisiz bir kullanım fark ederseniz, şifrenizi
            değiştirmenizi veya bizimle iletişime geçmenizi öneririz.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Kabul Edilebilir Kullanım">
        <p>Hizmeti kullanırken aşağıdakileri yapmamayı kabul edersiniz:</p>
        <ul className={listClass}>
          <li>
            Araçları bot, script veya otomatik istek gönderen sistemlerle
            (rate limit veya kredi sınırlarını aşmak amacıyla) kötüye
            kullanmak,
          </li>
          <li>
            Sunucularımıza veya altyapımıza zarar verecek, aşırı yük
            bindirecek veya güvenliğini tehdit edecek şekilde davranmak,
          </li>
          <li>
            Araçları yasa dışı içerik üretmek, işlemek veya dağıtmak amacıyla
            kullanmak,
          </li>
          <li>
            Sitenin veya araçların kaynak kodunu, model dosyalarını ya da
            altyapısını izinsiz kopyalamak, tersine mühendislik yapmak veya
            yeniden dağıtmak.
          </li>
        </ul>
        <p>
          Bu kurallara aykırı kullanım tespit edildiğinde ilgili hesabı
          askıya alma veya kalıcı olarak kapatma hakkımız saklıdır.
        </p>
      </LegalSection>

      <LegalSection title="5. Ücretlendirme ve İptal">
        <ul className={listClass}>
          <li>
            Pro plana geçiş ve fiyatlandırma bilgisi{" "}
            <a
              href="/planlar"
              className="font-medium text-purple-600 underline underline-offset-2 dark:text-purple-400"
            >
              Planlar
            </a>{" "}
            sayfasında şeffaf şekilde gösterilir; gizli ücret uygulanmaz.
          </li>
          <li>
            Pro üyeliğinizi istediğiniz zaman, aynı sayfadan tekrar Free
            planı seçerek iptal edebilirsiniz; iptal işlemi anında geçerli
            olur ve ek bir işlem gerektirmez.
          </li>
          <li>
            Fiyatlandırma değişiklikleri önceden Planlar sayfasında
            duyurulur; mevcut plan seçiminiz siz değiştirmediğiniz sürece
            aynı şartlarla devam eder.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Sorumluluğun Sınırlandırılması">
        <p>
          Araçlar &quot;olduğu gibi&quot; sunulur. Elimizden gelen özeni
          göstersek de, araçların kesintisiz, hatasız çalışacağını veya
          işlem sonucunun her durumda beklentinizi tam olarak karşılayacağını
          garanti edemeyiz. İşlediğiniz dosya ve metinlerin içeriğinden ve bu
          içeriği kullanma hakkınızın bulunmasından siz sorumlusunuz.
          Yasaların izin verdiği azami ölçüde, hizmetin kullanımından
          doğabilecek dolaylı zararlardan sorumlu tutulamayız.
        </p>
      </LegalSection>

      <LegalSection title="7. Hizmette Değişiklik ve Sonlandırma">
        <p>
          Araçları, özellikleri veya kredi limitlerini zaman içinde
          geliştirebilir, değiştirebilir ya da (yeterli süre önceden
          bildirmeye özen göstererek) kaldırabiliriz. Bu şartları ihlal eden
          hesapları askıya alma veya kapatma hakkımız saklıdır.
        </p>
      </LegalSection>

      <LegalSection title="8. Şartlardaki Değişiklikler">
        <p>
          Bu kullanım şartlarını zaman zaman güncelleyebiliriz. Güncel sürüm
          her zaman bu sayfada yer alır; sayfanın üst kısmındaki &quot;son
          güncelleme&quot; tarihi her revizyonda yenilenir.
        </p>
      </LegalSection>

      <LegalSection title="9. İletişim">
        <p>
          Bu şartlarla ilgili sorularınız için bize{" "}
          <a
            href="mailto:destek@pratiklestir.com"
            className="font-medium text-purple-600 underline underline-offset-2 dark:text-purple-400"
          >
            destek@pratiklestir.com
          </a>{" "}
          adresinden ulaşabilirsiniz. (Bu adres, alan adımız kesinleştiğinde
          güncellenecektir.)
        </p>
      </LegalSection>
    </LegalPage>
  );
}
