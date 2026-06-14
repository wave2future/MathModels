import type { ReactNode } from "react";
import type { LayoutMode } from "@/hooks/useResponsiveLayout";
import type { Theme } from "@/hooks/useTheme";
import { useT } from "@/i18n/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface Props {
  layout: LayoutMode;
  theme: Theme;
  onToggleTheme: () => void;
  sidebar: ReactNode;
  topSelector: ReactNode;
  children: ReactNode;
}

function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const { t } = useT();
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={t("common.toggleDarkMode")}
      className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
    >
      {theme === "dark" ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}

function Brand() {
  const { t } = useT();
  return (
    <div className="flex items-center gap-2">
      <img src="./favicon.svg" alt="" width={26} height={26} className="rounded-md" />
      <div className="leading-tight">
        <span className="block text-sm font-bold text-slate-900 dark:text-white">MathModels</span>
        <span className="hidden text-[10px] text-slate-400 sm:block">{t("app.tagline")}</span>
      </div>
    </div>
  );
}

export function AppLayout({ layout, theme, onToggleTheme, sidebar, topSelector, children }: Props) {
  return (
    <div className="flex h-full flex-col bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      {/* Top bar */}
      <header
        className="flex flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-2 dark:border-slate-700 dark:bg-slate-800"
        style={{ paddingTop: "calc(0.5rem + var(--app-safe-top))" }}
      >
        <Brand />
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </header>

      {layout === "desktop" ? (
        <div className="flex min-h-0 flex-1">
          <aside className="w-72 flex-shrink-0 border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            {sidebar}
          </aside>
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex-shrink-0 border-b border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
            {topSelector}
          </div>
          <main
            className="scroll-thin min-h-0 flex-1 overflow-y-auto"
            style={{ paddingBottom: "var(--app-safe-bottom)" }}
          >
            {children}
          </main>
        </div>
      )}
    </div>
  );
}
