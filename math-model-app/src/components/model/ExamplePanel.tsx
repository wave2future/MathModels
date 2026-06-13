import type { MathModel } from "@/types/model";

interface Props {
  model: MathModel;
}

export function ExamplePanel({ model }: Props) {
  if (model.examples.length === 0) return null;
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Real-life Examples
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
