import { useMemo, useState } from "react";
import { categories } from "@/models";
import { useLanguage, useT } from "@/i18n/LanguageContext";
import { searchLocalizedModels, localizedModelsByCategory, getLocalizedModelById } from "@/i18n/search";

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
}

/** Mobile top selector: shows the current model and opens a searchable picker. */
export function MobileModelSelector({ selectedId, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { language } = useLanguage();
  const { t } = useT();
  const current = getLocalizedModelById(selectedId, language);
  const results = useMemo(() => searchLocalizedModels(query, language), [query, language]);
  const searching = query.trim().length > 0;

  const pick = (id: string) => {
    onSelect(id);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-left shadow-sm dark:border-slate-600 dark:bg-slate-800"
      >
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">
            {current?.name ?? t("common.selectModel")}
          </span>
          <span className="block truncate text-xs text-slate-400">
            {current && t(`categories.${current.category}.name`)}
          </span>
        </span>
        <svg
          width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
          className={`flex-shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/30"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-[70vh] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
            <div className="p-3">
              <input
                autoFocus
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("common.searchPlaceholder")}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="scroll-thin max-h-[55vh] overflow-y-auto px-3 pb-4">
              {searching
                ? results.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => pick(m.id)}
                      className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                        m.id === selectedId
                          ? "bg-blue-600 text-white"
                          : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {m.name}
                    </button>
                  ))
                : categories.map((cat) => (
                    <div key={cat.id} className="mb-2">
                      <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {t(`categories.${cat.id}.name`)}
                      </p>
                      {localizedModelsByCategory(cat.id, language).map((m) => (
                        <button
                          key={m.id}
                          onClick={() => pick(m.id)}
                          className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                            m.id === selectedId
                              ? "bg-blue-600 text-white"
                              : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                          }`}
                        >
                          {m.name}
                        </button>
                      ))}
                    </div>
                  ))}
              {searching && results.length === 0 && (
                <p className="px-2 py-4 text-sm text-slate-400">{t("common.noResults", { query })}</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
