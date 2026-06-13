/** Supported UI/content languages. Each is shown in its own native script. */
export interface LanguageInfo {
  code: string;
  /** Name of the language, written in that language itself. */
  nativeName: string;
  /** Right-to-left script. */
  rtl?: boolean;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: "en", nativeName: "English" },
  { code: "zh", nativeName: "中文" },
  { code: "ja", nativeName: "日本語" },
  { code: "ko", nativeName: "한국어" },
  { code: "fr", nativeName: "Français" },
  { code: "de", nativeName: "Deutsch" },
  { code: "pt", nativeName: "Português" },
  { code: "it", nativeName: "Italiano" },
  { code: "th", nativeName: "ไทย" },
  { code: "vi", nativeName: "Tiếng Việt" },
  { code: "ar", nativeName: "العربية", rtl: true },
  { code: "es", nativeName: "Español" },
  { code: "hi", nativeName: "हिन्दी" },
  { code: "ru", nativeName: "Русский" },
  { code: "bn", nativeName: "বাংলা" },
  { code: "ur", nativeName: "اردو", rtl: true },
  { code: "id", nativeName: "Bahasa Indonesia" },
  { code: "ms", nativeName: "Bahasa Melayu" },
  { code: "ta", nativeName: "தமிழ்" },
  { code: "jv", nativeName: "Basa Jawa" },
  { code: "fa", nativeName: "فارسی", rtl: true },
  { code: "pa", nativeName: "ਪੰਜਾਬੀ" },
  { code: "tr", nativeName: "Türkçe" },
  { code: "sw", nativeName: "Kiswahili" },
];

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export const DEFAULT_LANGUAGE: LanguageCode = "en";

const LANGUAGE_CODES = new Set(LANGUAGES.map((l) => l.code));

export function isLanguageCode(value: string): value is LanguageCode {
  return LANGUAGE_CODES.has(value);
}

export function isRtl(code: LanguageCode): boolean {
  return LANGUAGES.find((l) => l.code === code)?.rtl ?? false;
}
