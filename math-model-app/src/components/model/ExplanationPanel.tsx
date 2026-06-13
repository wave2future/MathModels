import type { MathModel } from "@/types/model";
import { Katex } from "@/components/common/Katex";

interface Props {
  model: MathModel;
}

export function ExplanationPanel({ model }: Props) {
  const paramEntries = Object.entries(model.parameterExplanations);
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Explanation
      </h2>
      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{model.explanation}</p>
      {paramEntries.length > 0 && (
        <dl className="mt-3 space-y-1.5">
          {paramEntries.map(([id, text]) => {
            const param = model.parameters.find((p) => p.id === id);
            return (
              <div key={id} className="flex gap-2 text-sm">
                <dt className="flex-shrink-0 font-semibold text-blue-600 dark:text-blue-400">
                  <Katex math={param?.symbol ?? id} />
                </dt>
                <dd className="text-slate-600 dark:text-slate-400">{text}</dd>
              </div>
            );
          })}
        </dl>
      )}
    </section>
  );
}
