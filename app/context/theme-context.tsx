"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ThemePreference = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "theme";

type ThemeContextValue = {
  // O an ekrana uygulanan gerçek tema (her zaman light/dark, ikon vb. için).
  theme: ResolvedTheme;
  // Kullanıcının kayıtlı tercihi - Görünüm ayarlarındaki seçici bunu kullanır.
  preference: ThemePreference;
  // Hızlı geçiş (yüzen buton): açık/koyu arasında geçer, "sistem" tercihini
  // geçersiz kılıp somut bir seçime sabitler.
  toggleTheme: () => void;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredPreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // localStorage erişilemeyebilir (gizli sekme, izinler vb.)
  }
  return "system";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Sunucu ve hydration render'ının eşleşmesi için sabit bir başlangıç
  // değeri kullanılıyor (inline script zaten gerçek temayı boyamadan önce
  // uyguladı). Gerçek tercih, mount sonrası aşağıdaki effect ile okunup
  // state'e yansıtılıyor.
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [theme, setTheme] = useState<ResolvedTheme>("dark");

  useEffect(() => {
    const storedPreference = getStoredPreference();
    setPreferenceState(storedPreference);
    setTheme(
      storedPreference === "system" ? getSystemTheme() : storedPreference
    );
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // "Sistem" tercihi seçiliyken işletim sistemi teması değişirse canlı takip
  // eder (örn. gündüz/gece otomatik geçişi).
  useEffect(() => {
    if (preference !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? "dark" : "light");
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [preference]);

  const setPreference = (nextPreference: ThemePreference) => {
    setPreferenceState(nextPreference);
    try {
      window.localStorage.setItem(STORAGE_KEY, nextPreference);
    } catch {
      // localStorage erişilemeyebilir (gizli sekme, izinler vb.)
    }
    setTheme(
      nextPreference === "system" ? getSystemTheme() : nextPreference
    );
  };

  const toggleTheme = () => {
    setPreference(theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider
      value={{ theme, preference, toggleTheme, setPreference }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme, bir ThemeProvider içinde kullanılmalı.");
  }
  return context;
}
