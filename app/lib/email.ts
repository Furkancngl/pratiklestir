import "server-only";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Pratikleştir <noreply@pratiklestir.com>";

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
    // color-scheme/supported-color-schemes: bazı istemciler (Outlook,
    // Apple Mail) kullanıcı cihazı karanlık moddaysa yalnızca metin
    // renklerine bakıp arka planı otomatik koyulaştırıyor; bu iki meta
    // etiketi ve aşağıdaki explicit bgcolor'lar olmadan buton/metin
    // okunmaz hale gelebiliyor. Bu yüzden tema burada bilinçli olarak
    // sabit açık (light) tutuluyor.
    html: `
      <!DOCTYPE html>
      <html lang="tr">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="color-scheme" content="light" />
          <meta name="supported-color-schemes" content="light" />
          <title>Şifreni sıfırla</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f7;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7;">
            <tr>
              <td align="center" style="padding: 40px 16px;">
                <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width: 480px; width: 100%; background-color: #ffffff; border: 1px solid #ececef; border-radius: 16px;">
                  <tr>
                    <td style="padding: 32px 32px 0 32px; font-family: Arial, Helvetica, sans-serif;">
                      <table role="presentation" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="width: 10px; height: 10px; border-radius: 3px; background-color: #8b5cf6;">&nbsp;</td>
                          <td style="width: 8px;">&nbsp;</td>
                          <td style="font-size: 16px; font-weight: 800; color: #111111;">Pratikleştir</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 32px 32px 32px; font-family: Arial, Helvetica, sans-serif;">
                      <h2 style="margin: 0 0 12px 0; color: #111111; font-size: 20px;">Şifreni sıfırla</h2>
                      <p style="margin: 0 0 24px 0; color: #444444; font-size: 14px; line-height: 1.6;">
                        Pratikleştir hesabın için bir şifre sıfırlama talebi aldık. Aşağıdaki
                        butona tıklayarak yeni bir şifre belirleyebilirsin. Bu bağlantı 30
                        dakika içinde geçerliliğini yitirir ve yalnızca bir kez kullanılabilir.
                      </p>
                      <table role="presentation" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="border-radius: 10px; background-color: #7c6cf0; background: linear-gradient(90deg, #8b5cf6, #6366f1);">
                            <a href="${resetUrl}"
                               style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; border-radius: 10px;">
                              Şifreni Sıfırla
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin: 24px 0 0 0; color: #888888; font-size: 12.5px; line-height: 1.6;">
                        Bu talebi sen yapmadıysan bu e-postayı görmezden gelebilirsin,
                        şifren değişmeyecek.
                      </p>
                    </td>
                  </tr>
                </table>
                <p style="margin: 20px 0 0 0; color: #a1a1aa; font-size: 11.5px; font-family: Arial, Helvetica, sans-serif;">
                  Pratikleştir · pratiklestir.com
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });

  // resend.emails.send() API hatalarında THROW ETMEZ - { data, error }
  // döner. Bunu kontrol etmezsek gönderim sessizce başarısız olur.
  if (error) {
    console.error("Resend e-posta gönderme hatası:", error);
    return { ok: false, message: error.message };
  }

  console.log("Şifre sıfırlama e-postası gönderildi, Resend id:", data?.id);
  return { ok: true };
}
