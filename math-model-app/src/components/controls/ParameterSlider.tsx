import type { ParameterDefinition } from "@/types/model";
import { Katex } from "@/components/common/Katex";
import { formatNumber } from "@/utils/numberFormat";

interface Props {
  param: ParameterDefinition;
  value: number;
  onChange: (value: number) => void;
}

/** A touch-friendly labeled slider for a single model parameter. */
export function ParameterSlider({ param, value, onChange }: Props) {
  return (
    <div className="select-none">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <label className="flex items-baseline gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
          <Katex math={param.symbol} className="text-blue-600 dark:text-blue-400" />
          <span className="text-slate-500 dark:text-slate-400">{param.label}</span>
        </label>
        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-sm tabular-nums text-slate-800 dark:bg-slate-700 dark:text-slate-100">
          {formatNumber(value)}
          {param.unit ? ` ${param.unit}` : ""}
        </span>
      </div>
      <input
        type="range"
        min={param.min}
        max={param.max}
        step={param.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={param.label}
        className="h-6 touch-pan-y"
      />
      <div className="mt-0.5 flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
        <span>{param.min}</span>
        <span>{param.max}</span>
      </div>
      {param.explanation && (
        <p className="mt-1 text-xs leading-snug text-slate-500 dark:text-slate-400">
          {param.explanation}
        </p>
      )}
    </div>
  );
}
