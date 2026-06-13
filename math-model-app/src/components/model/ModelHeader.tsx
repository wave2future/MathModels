import type { MathModel } from "@/types/model";
import { Katex } from "@/components/common/Katex";
import { useT } from "@/i18n/LanguageContext";

interface Props {
  model: MathModel;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function ModelHeader({ model, isFavorite, onToggleFavorite }: Props) {
  const { t } = useT();
  return (
    <header className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
            {model.name}
          </h1>
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{model.description}</p>
        <div className="mt-2 inline-block rounded-lg bg-blue-50 px-3 py-1.5 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          <Katex math={model.formula} display />
        </div>
      </div>
      <button
        type="button"
        onClick={onToggleFavorite}
        aria-label={isFavorite ? t("common.removeFavorite") : t("common.addFavorite")}
        className="flex-shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-amber-500 dark:hover:bg-slate-700"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill={isFavorite ? "#f59e0b" : "none"}
          stroke={isFavorite ? "#f59e0b" : "currentColor"}
          strokeWidth="2"
          strokeLinejoin="round"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </button>
    </header>
  );
}
