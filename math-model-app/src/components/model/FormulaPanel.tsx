import type { MathModel } from "@/types/model";
import { Katex } from "@/components/common/Katex";

interface Props {
  model: MathModel;
}

export function FormulaPanel({ model }: Props) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Formulas
      </h2>
      <div className="space-y-2.5">
        {model.formulas.map((f, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{f.label}</span>
              <span className="text-lg text-slate-900 dark:text-slate-100">
                <Katex math={f.latex} />
              </span>
            </div>
            {f.description && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{f.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
