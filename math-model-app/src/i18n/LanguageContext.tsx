import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_LANGUAGE, LANGUAGES, isLanguageCode, isRtl, type LanguageCode } from "./languages";
import { uiTranslations } from "./locales";
import type { UiStrings } from "./types";

const STORAGE_KEY = "mathmodels.language";

function getInitialLanguage(): LanguageCode {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && isLanguageCode(stored)) return stored;
  const browser = window.navigator.language.split("-")[0];
  if (isLanguageCode(browser)) return browser;
  return DEFAULT_LANGUAGE;
}

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  languages: typeof LANGUAGES;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/** Provides the active UI/content language; persists to localStorage and sets <html lang/dir>. */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl(language) ? "rtl" : "ltr";
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = vars[key];
    return value === undefined ? match : String(value);
  });
}

/** Translate UI strings for the current language, with English fallback and `{placeholder}` interpolation. */
export function useT(): {
  t: (path: string, vars?: Record<string, string | number>) => string;
  strings: UiStrings;
  language: LanguageCode;
} {
  const { language } = useLanguage();
  const strings = uiTranslations[language] ?? uiTranslations[DEFAULT_LANGUAGE];

  const t = (path: string, vars?: Record<string, string | number>): string => {
    const value = getPath(strings, path) ?? getPath(uiTranslations[DEFAULT_LANGUAGE], path);
    return typeof value === "string" ? interpolate(value, vars) : path;
  };

  return { t, strings, language };
}
