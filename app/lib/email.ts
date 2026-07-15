import "server-only";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Kendi domain'ini Resend'de doğrulayana kadar bu paylaşımlı test adresi
// kullanılıyor - Resend sandbox modunda bu adresten sadece hesap sahibinin
// kendi e-postasına gönderim yapılabiliyor. Domain doğrulanınca
// RESEND_FROM_EMAIL ortam değişkenini ayarla.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Pratikleştir <onboarding@resend.dev>";

export type SendEmailResult = { ok: true } | { ok: false; message: string };

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string
): Promise<SendEmailResult> {
  if (!resend) {
    console.error(
      "RESEND_API_KEY tanımlı değil, şifre sıfırlama e-postası gönderilemedi."
    );
    return { ok: false, message: "E-posta servisi yapılandırılmamış." };
  }

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Şifreni sıfırla - Pratikleştir",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #111;">Şifreni sıfırla</h2>
        <p style="color: #444; font-size: 14px; line-height: 1.6;">
          Pratikleştir hesabın için bir şifre sıfırlama talebi aldık. Aşağıdaki
          butona tıklayarak yeni bir şifre belirleyebilirsin. Bu bağlantı 30
          dakika içinde geçerliliğini yitirir ve yalnızca bir kez kullanılabilir.
        </p>
        <p style="margin: 28px 0;">
          <a href="${resetUrl}"
             style="background: linear-gradient(90deg, #8b5cf6, #6366f1); color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block;">
            Şifreni Sıfırla
          </a>
        </p>
        <p style="color: #888; font-size: 12.5px; line-height: 1.6;">
          Bu talebi sen yapmadıysan bu e-postayı görmezden gelebilirsin,
          şifren değişmeyecek.
        </p>
      </div>
    `,
  });

  // resend.emails.send() API hatalarında THROW ETMEZ - { data, error }
  // döner. Bunu kontrol etmezsek gönderim sessizce başarısız olur. En sık
  // görülen hata: domain doğrulanmadan (Resend sandbox modu) yalnızca
  // hesap sahibinin kendi Resend e-postasına gönderim yapılabiliyor,
  // başka adreslere "You can only send testing emails to your own email
  // address" mesajıyla reddediliyor.
  if (error) {
    console.error("Resend e-posta gönderme hatası:", error);
    return { ok: false, message: error.message };
  }

  console.log("Şifre sıfırlama e-postası gönderildi, Resend id:", data?.id);
  return { ok: true };
}
