import type { MathModel, ParamValues } from "@/types/model";
import { ParameterSlider } from "@/components/controls/ParameterSlider";
import { ResetButton } from "@/components/controls/ResetButton";
import { useT } from "@/i18n/LanguageContext";

interface Props {
  model: MathModel;
  values: ParamValues;
  onChange: (id: string, value: number) => void;
  onReset: () => void;
  isDefault: boolean;
}

export function ParameterPanel({ model, values, onChange, onReset, isDefault }: Props) {
  const { t } = useT();
  if (model.parameters.length === 0) return null;
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {t("panels.parameters")}
        </h2>
        <ResetButton onClick={onReset} disabled={isDefault} />
      </div>
      <div className="space-y-4">
        {model.parameters.map((param) => (
          <ParameterSlider
            key={param.id}
            param={param}
            value={values[param.id] ?? param.defaultValue}
            onChange={(v) => onChange(param.id, v)}
          />
        ))}
      </div>
    </section>
  );
}
