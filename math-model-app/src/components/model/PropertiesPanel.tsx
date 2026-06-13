import type { MathModel, ParamValues } from "@/types/model";
import { Katex } from "@/components/common/Katex";
import { formatWithUnit } from "@/utils/numberFormat";

interface Props {
  model: MathModel;
  values: ParamValues;
}

/** Live computed properties (area, surface area, volume, ...) for the model. */
export function PropertiesPanel({ model, values }: Props) {
  if (!model.properties || model.properties.length === 0) return null;
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Calculated Properties
      </h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {model.properties.map((prop, i) => {
          const value = prop.compute(values);
          return (
            <div
              key={i}
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900/60 dark:bg-emerald-950/30"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  {prop.label}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  <Katex math={prop.symbol} />
                </span>
              </div>
              <div className="mt-1 text-lg font-semibold tabular-nums text-emerald-900 dark:text-emerald-100">
                {formatWithUnit(value, prop.unit)}
              </div>
              <div className="mt-0.5 text-xs text-emerald-600/80 dark:text-emerald-400/80">
                <Katex math={prop.latex} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
