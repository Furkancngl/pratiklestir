"use client";

import { useState } from "react";
import CreditErrorNotice from "../components/credit-error-notice";
import { useCreditGate } from "../hooks/use-credit-gate";
import { tools } from "../lib/tools";

const accentClassName =
  tools.find((tool) => tool.href === "/sifre-olusturucu")?.accentClassName ??
  "bg-rose-500";

const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

type OptionKey = keyof typeof CHAR_SETS;

const options: { key: OptionKey; label: string }[] = [
  { key: "uppercase", label: "Büyük Harf (A-Z)" },
  { key: "lowercase", label: "Küçük Harf (a-z)" },
  { key: "numbers", label: "Rakam (0-9)" },
  { key: "symbols", label: "Sembol (!@#...)" },
];

// crypto.getRandomValues + reddetme örneklemesi: modulo yanlılığı olmadan
// [0, max) aralığında güvenli rastgele tam sayı üretir.
function secureRandomInt(max: number): number {
  const range = 256 - (256 % max);
  const bytes = new Uint8Array(1);
  let value: number;
  do {
    crypto.getRandomValues(bytes);
    value = bytes[0];
  } while (value >= range);
  return value % max;
}

function generatePassword(length: number, selected: OptionKey[]): string {
  const charset = selected.map((key) => CHAR_SETS[key]).join("");
  if (!charset) return "";

  const chars: string[] = [];

  // Seçilen her kategoriden en az bir karakter garanti edilir.
  for (const key of selected) {
    const set = CHAR_SETS[key];
    chars.push(set[secureRandomInt(set.length)]);
  }

  while (chars.length < length) {
    chars.push(charset[secureRandomInt(charset.length)]);
  }

  // Fisher-Yates ile karıştır (garanti edilen karakterler hep başta olmasın).
  for (let i = chars.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.slice(0, length).join("");
}

function getStrength(length: number, selected: OptionKey[]): { label: string; className: string } {
  const score = selected.length + (length >= 16 ? 2 : length >= 12 ? 1 : 0);
  if (score >= 5) return { label: "Güçlü", className: "text-green-600 dark:text-green-400" };
  if (score >= 3) return { label: "Orta", className: "text-yellow-600 dark:text-yellow-400" };
  return { label: "Zayıf", className: "text-red-600 dark:text-red-400" };
}

export default function SifreOlusturucuPage() {
  const [length, setLength] = useState(16);
  const [selected, setSelected] = useState<OptionKey[]>(["uppercase", "lowercase", "numbers"]);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const { checkAndConsume, creditError } = useCreditGate("/sifre-olusturucu");

  const toggleOption = (key: OptionKey) => {
    setSelected((current) =>
      current.includes(key) ? current.filter((k) => k !== key) : [...current, key]
    );
  };

  const handleGenerate = async () => {
    if (selected.length === 0) {
      setError("Lütfen en az bir karakter türü seçin.");
      setPassword("");
      return;
    }

    const allowed = await checkAndConsume();
    if (!allowed) return;

    setError("");
    setCopied(false);
    setPassword(generatePassword(length, selected));
  };

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Panoya kopyalanamadı.");
    }
  };

  const strength = getStrength(length, selected);

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-zinc-900">
      <div className="w-full max-w-2xl">
        <div className={`h-1 w-full rounded-full ${accentClassName}`} />

        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Şifre Oluşturucu
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Güçlü ve rastgele şifreler üret, tamamen tarayıcında kalır.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-black/[.08] bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between">
            <label
              htmlFor="length"
              className="text-sm font-medium text-black dark:text-zinc-50"
            >
              Uzunluk
            </label>
            <span className="text-sm font-semibold text-black dark:text-zinc-50">
              {length}
            </span>
          </div>
          <input
            id="length"
            type="range"
            min={8}
            max={32}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="mt-3 w-full accent-black dark:accent-white"
          />

          <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {options.map((option) => (
              <label
                key={option.key}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-black/[.08] px-3 py-2.5 text-sm text-zinc-700 transition-colors hover:bg-black/[.04] dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option.key)}
                  onChange={() => toggleOption(option.key)}
                  className="h-4 w-4 accent-black dark:accent-white"
                />
                {option.label}
              </label>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            className="mt-6 flex h-11 w-full items-center justify-center rounded-full bg-foreground text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Oluştur
          </button>

          {error && (
            <p className="mt-3 text-center text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <CreditErrorNotice error={creditError} />

          {password && (
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 rounded-lg border border-black/[.08] bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="break-all font-mono text-sm text-black dark:text-zinc-50">
                  {password}
                </p>
                <span className={`shrink-0 text-xs font-semibold ${strength.className}`}>
                  {strength.label}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="flex h-11 w-full items-center justify-center rounded-full border border-solid border-black/[.08] text-sm font-medium transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-zinc-800 dark:hover:bg-zinc-800"
              >
                {copied ? "Kopyalandı ✓" : "Kopyala"}
              </button>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
          İşlem tamamen tarayıcınızda yapılır, şifreniz hiçbir yere gönderilmez.
        </p>
      </div>
    </div>
  );
}
