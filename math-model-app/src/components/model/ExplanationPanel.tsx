import type { MathModel } from "@/types/model";
import { Katex } from "@/components/common/Katex";
import { useT } from "@/i18n/LanguageContext";

interface Props {
  model: MathModel;
}

export function ExplanationPanel({ model }: Props) {
  const { t } = useT();
  const explainedParams = model.parameters.filter((p) => p.explanation);
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {t("panels.explanation")}
      </h2>
      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{model.explanation}</p>
      {explainedParams.length > 0 && (
        <dl className="mt-3 space-y-1.5">
          {explainedParams.map((param) => (
            <div key={param.id} className="flex gap-2 text-sm">
              <dt className="flex-shrink-0 font-semibold text-blue-600 dark:text-blue-400">
                <Katex math={param.symbol} />
              </dt>
              <dd className="text-slate-600 dark:text-slate-400">{param.explanation}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
