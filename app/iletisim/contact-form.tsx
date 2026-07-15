"use client";

import { useState, type FormEvent } from "react";

const SUPPORT_EMAIL = "destek@pratiklestir.com";

const inputClass =
  "w-full rounded-[10px] border border-black/[.12] bg-black/[.02] px-3.5 py-2.75 text-sm text-black placeholder:text-zinc-400 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] dark:border-white/[.12] dark:bg-white/[.04] dark:text-white dark:placeholder:text-zinc-600";

const labelClass =
  "mb-1.5 block text-[12.5px] font-medium text-zinc-600 dark:text-zinc-400";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    const subject = encodeURIComponent(
      `Pratikleştir iletişim formu${name ? ` - ${name}` : ""}`
    );
    const body = encodeURIComponent(
      `${message}\n\n---\nGönderen: ${name || "belirtilmedi"} (${email})`
    );

    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="mb-4">
        <label htmlFor="name" className={labelClass}>
          Ad Soyad
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Adın Soyadın"
          className={inputClass}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className={labelClass}>
          E-posta
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="ornek@email.com"
          className={inputClass}
        />
      </div>

      <div className="mb-5">
        <label htmlFor="message" className={labelClass}>
          Mesajın
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Sorunu veya önerini buraya yazabilirsin."
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        className="w-full touch-manipulation rounded-xl bg-linear-to-r from-violet-500 to-indigo-500 p-3.25 text-[14.5px] font-bold text-white shadow-[0_10px_26px_rgba(99,102,241,0.4)] transition-all! duration-200! hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(99,102,241,0.55)]"
      >
        Gönder
      </button>

      <p className="mt-3 text-center text-[12.5px] text-zinc-500 dark:text-zinc-500">
        {sent
          ? "E-posta uygulamanı açtık; oradan göndermeyi tamamlayabilirsin."
          : `Gönder'e tıkladığında mesajın, e-posta uygulaman üzerinden ${SUPPORT_EMAIL} adresine hazır şekilde açılır.`}
      </p>
    </form>
  );
}
