import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/app/lib/site";
import LegalPage, { LegalSection } from "@/app/components/legal-page";

export const metadata: Metadata = {
  title: { absolute: "Gizlilik Politikası | Pratikleştir" },
  description:
    "Pratikleştir'in araçlarınızı nasıl işlediği, hangi verileri neden topladığı ve verilerinizi nasıl silebileceğinize dair gizlilik politikası.",
  alternates: { canonical: `${SITE_URL}/gizlilik-politikasi` },
  robots: { index: false, follow: true },
};

const listClass = "list-disc space-y-1.5 pl-5";

export default function Page() {
  return (
    <LegalPage heading="Gizlilik Politikası" lastUpdated="13 Temmuz 2026">
      <LegalSection title="1. Genel Bakış">
        <p>
          {SITE_NAME}, kayıt gerektirmeden veya ücretsiz bir hesapla
          kullanabileceğiniz tarayıcı tabanlı pratik araçlar sunar (QR kod
          oluşturma, PDF birleştirme/sıkıştırma, görsel sıkıştırma, arka plan
          silme gibi). Bu sayfa, hangi verilerin toplandığını, verilerinizin
          nerede saklandığını ve haklarınızı ne şekilde kullanabileceğinizi
          açıklar.
        </p>
      </LegalSection>

      <LegalSection title="2. Araçların Çoğu Dosyanızı Hiç Sunucuya Göndermez">
        <p>
          Aşağıdaki araçlar tamamen tarayıcınız içinde çalışır; yüklediğiniz
          veya oluşturduğunuz dosya, görsel ya da metin hiçbir zaman
          sunucularımıza gönderilmez, sunucularımızda saklanmaz:
        </p>
        <ul className={listClass}>
          <li>QR Kod Oluşturucu ve QR Kod Oku</li>
          <li>Şifre Oluşturucu</li>
          <li>Kelime Sayacı</li>
          <li>PDF Birleştirici ve PDF Sıkıştırıcı</li>
          <li>Görsel Sıkıştırıcı</li>
          <li>
            Arka Plan Silici (Beta) — yapay zeka modeli tarayıcınıza indirilir
            ve fotoğrafınız işlemin tamamı boyunca cihazınızda kalır
          </li>
        </ul>
        <p>
          Bu araçlarda işlem tamamlandıktan sonra dosyanız yalnızca kendi
          cihazınızda bulunur; sekmeyi kapattığınızda tarayıcı belleğinden
          silinir.
        </p>
      </LegalSection>

      <LegalSection title="3. Yapay Zeka Destekli, API Tabanlı Araçlar">
        <p>
          Makale Hazırla gibi henüz aktif olmayan, ileride sunulacak bazı
          araçlar, işlemi tarayıcınızda değil bir yapay zeka servis
          sağlayıcısının API&apos;si üzerinden gerçekleştirecektir. Bu tür
          araçlar aktif edildiğinde, girdiğiniz metin yalnızca o istek için
          ilgili API sağlayıcısına iletilir, sonucu üretmek dışında bir
          amaçla kullanılmaz ve tarafımızca kalıcı olarak saklanmaz. Bu
          araçlardan herhangi biri kullanıma açıldığında bu politika
          güncellenerek ilgili sağlayıcı burada açıkça belirtilecektir.
        </p>
      </LegalSection>

      <LegalSection title="4. Hesap Oluşturduğunuzda Topladığımız Veriler">
        <p>
          Bazı özellikleri (günlük kredi, plan yükseltme gibi) kullanabilmeniz
          için bir hesap oluşturmanız gerekir. Hesabınızla ilişkili olarak şu
          verileri saklarız:
        </p>
        <ul className={listClass}>
          <li>E-posta adresiniz (giriş ve iletişim için)</li>
          <li>Adınız (belirttiyseniz)</li>
          <li>
            Şifreniz — düz metin olarak değil, geri döndürülemez şekilde
            şifrelenmiş (hash&apos;lenmiş) hâliyle saklanır
          </li>
          <li>Plan bilginiz (Free / Pro) ve plan seçim tarihiniz</li>
          <li>
            Kalan günlük kredi sayınız ve kredi yenileme tarihiniz — araçları
            adil ve dengeli şekilde sunabilmek için tutulur
          </li>
          <li>Hesabınızın oluşturulma tarihi</li>
        </ul>
        <p>
          Bu veriler yalnızca hizmeti size sunmak, plan/kredi limitlerinizi
          doğru şekilde uygulamak ve hesabınızla ilgili sizinle iletişim
          kurabilmek (örneğin şifre sıfırlama) için kullanılır; üçüncü
          taraflara satılmaz veya pazarlama amacıyla paylaşılmaz.
        </p>
      </LegalSection>

      <LegalSection title="5. Google ile Giriş Yaptığınızda">
        <p>
          Google hesabınızla giriş yapmayı tercih ederseniz, Google&apos;dan
          yalnızca e-posta adresinizi ve adınızı almamız için izin isteriz.
          Bu bilgiler yeni bir hesap oluşturmak veya mevcut hesabınızla
          eşleştirmek için kullanılır. Google hesabınızın şifresine, kişi
          listenize veya başka hiçbir verisine erişimimiz yoktur.
        </p>
      </LegalSection>

      <LegalSection title="6. Çerezler">
        <p>
          Oturumunuzu açık tutmak için yalnızca zorunlu, teknik bir oturum
          çerezi kullanılır; bu çerez giriş yaptığınızda tarayıcınıza
          yerleştirilir ve kimliğinizi doğrulamak dışında bir amaca hizmet
          etmez. Şu an reklam veya pazarlama amaçlı izleme çerezi
          kullanılmamaktadır. Detaylar için{" "}
          <a
            href="/cerez-politikasi"
            className="font-medium text-purple-600 underline underline-offset-2 dark:text-purple-400"
          >
            Çerez Politikası
          </a>{" "}
          sayfamıza bakabilirsiniz.
        </p>
      </LegalSection>

      <LegalSection title="7. Verileriniz Nerede Saklanır">
        <p>
          Hesap verileriniz, yönetilen bir PostgreSQL veritabanı hizmeti olan
          Neon üzerinde saklanır ve site Vercel altyapısında barındırılır.
          Şifreniz sektör standardı bir yöntemle (bcrypt) hash&apos;lenerek
          saklanır; şifre sıfırlama bağlantıları e-posta yoluyla Resend
          servisi üzerinden gönderilir. Arka Plan Silici aracının kullandığı
          yapay zeka modeli dosyaları, tarayıcınıza doğrudan bir içerik
          dağıtım ağından (staticimgly.com) indirilir; bu indirme sırasında
          kişisel verileriniz herhangi bir üçüncü tarafa iletilmez.
        </p>
      </LegalSection>

      <LegalSection title="8. Verilerinizi Silme Hakkınız">
        <p>
          Hesabınızı ve hesabınızla ilişkili tüm verilerinizi istediğiniz
          zaman kalıcı olarak silebilirsiniz: Ayarlar &gt; Hesap sayfasındaki
          &quot;Hesabımı Sil&quot; seçeneğini kullanmanız yeterlidir. Bu
          işlem geri alınamaz; onayladığınız anda hesabınız ve ilişkili tüm
          kayıtlar veritabanımızdan tamamen silinir.
        </p>
      </LegalSection>

      <LegalSection title="9. Politikadaki Değişiklikler">
        <p>
          Hizmetimiz geliştikçe bu politikayı güncelleyebiliriz. Önemli
          değişiklikler bu sayfada yayınlanır; sayfanın üst kısmındaki
          &quot;son güncelleme&quot; tarihi her revizyonda yenilenir.
        </p>
      </LegalSection>

      <LegalSection title="10. İletişim">
        <p>
          Gizlilikle ilgili sorularınız için bize{" "}
          <a
            href="mailto:iletisim@pratiklestir.com"
            className="font-medium text-purple-600 underline underline-offset-2 dark:text-purple-400"
          >
            iletisim@pratiklestir.com
          </a>{" "}
          adresinden ulaşabilirsiniz.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
