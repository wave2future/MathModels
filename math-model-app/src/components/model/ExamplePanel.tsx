import type { MathModel } from "@/types/model";
import { useT } from "@/i18n/LanguageContext";

interface Props {
  model: MathModel;
}

export function ExamplePanel({ model }: Props) {
  const { t } = useT();
  if (model.examples.length === 0) return null;
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {t("panels.examples")}
      </h2>
      <ul className="space-y-1.5">
        {model.examples.map((ex, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
            {ex}
          </li>
        ))}
      </ul>
    </section>
  );
}
