import { useLanguage, useT } from "@/i18n/LanguageContext";
import { isLanguageCode } from "@/i18n/languages";

/** Dropdown to pick the UI/content language, each option shown in its own script. */
export function LanguageSwitcher() {
  const { language, setLanguage, languages } = useLanguage();
  const { t } = useT();

  return (
    <select
      value={language}
      onChange={(e) => {
        if (isLanguageCode(e.target.value)) setLanguage(e.target.value);
      }}
      aria-label={t("common.changeLanguage")}
      className="rounded-lg border border-transparent bg-transparent py-2 pl-2 pr-1 text-sm text-slate-500 transition hover:bg-slate-100 focus:outline-none dark:text-slate-300 dark:hover:bg-slate-700"
    >
      {languages.map((l) => (
        <option key={l.code} value={l.code} className="text-slate-900 dark:bg-slate-800 dark:text-slate-100">
          {l.nativeName}
        </option>
      ))}
    </select>
  );
}
