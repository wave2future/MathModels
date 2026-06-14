import { useState } from "react";
import type { MathModel, ParamValues } from "@/types/model";
import type { LayoutMode } from "@/hooks/useResponsiveLayout";
import { useViewSettings } from "@/components/common/ViewSettings";
import { ModelViewer } from "@/components/model/ModelViewer";
import { ModelHeader } from "@/components/model/ModelHeader";
import { ParameterPanel } from "@/components/model/ParameterPanel";
import { FormulaPanel } from "@/components/model/FormulaPanel";
import { PropertiesPanel } from "@/components/model/PropertiesPanel";
import { ExplanationPanel } from "@/components/model/ExplanationPanel";
import { ExamplePanel } from "@/components/model/ExamplePanel";
import { ViewSettingsBar } from "@/components/model/ViewSettingsBar";
import { useT } from "@/i18n/LanguageContext";

interface Props {
  model: MathModel;
  values: ParamValues;
  onChange: (id: string, value: number) => void;
  onReset: () => void;
  isDefault: boolean;
  layout: LayoutMode;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

type MobileTab = "parameters" | "formulas" | "explanation" | "examples";

export function ResponsiveModelPage(props: Props) {
  const { model, values, onChange, onReset, isDefault, layout, isFavorite, onToggleFavorite } = props;
  const { settings } = useViewSettings();
  const { t } = useT();
  const [tab, setTab] = useState<MobileTab>("parameters");

  const MOBILE_TABS: { id: MobileTab; label: string }[] = [
    { id: "parameters", label: t("panels.parameters") },
    { id: "formulas", label: t("panels.formulas") },
    { id: "explanation", label: t("panels.explanation") },
    { id: "examples", label: t("panels.examples") },
  ];

  /* ---------------- Desktop: split viewer + info column ---------------- */
  if (layout === "desktop") {
    return (
      <div className="flex h-full flex-col gap-3 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <ModelHeader model={model} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />
          </div>
          <ViewSettingsBar model={model} />
        </div>

        <div className="flex min-h-0 flex-1 gap-4">
          <div className="min-w-0 flex-1">
            <ModelViewer model={model} values={values} />
          </div>
          <aside className="scroll-thin w-[360px] flex-shrink-0 space-y-5 overflow-y-auto pr-1">
            <ParameterPanel
              model={model}
              values={values}
              onChange={onChange}
              onReset={onReset}
              isDefault={isDefault}
            />
            <PropertiesPanel model={model} values={values} />
            {settings.showFormulas && <FormulaPanel model={model} />}
            <ExplanationPanel model={model} />
            <ExamplePanel model={model} />
          </aside>
        </div>
      </div>
    );
  }

  /* ---------------- Mobile: viewer on top, tabbed info below ----------- */
  return (
    <div className="flex flex-col">
      <div className="px-3 pt-2">
        <ModelHeader model={model} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />
      </div>

      <div className="px-3 pt-2">
        <div className="h-[42vh] min-h-64">
          <ModelViewer model={model} values={values} />
        </div>
        <div className="mt-2">
          <ViewSettingsBar model={model} />
        </div>
      </div>

      {/* Tab bar */}
      <div className="scroll-thin mt-3 flex gap-1 overflow-x-auto border-b border-slate-200 px-3 dark:border-slate-700">
        {MOBILE_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition ${
              tab === t.id
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 dark:text-slate-400"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-5 p-4">
        {tab === "parameters" && (
          <>
            <ParameterPanel
              model={model}
              values={values}
              onChange={onChange}
              onReset={onReset}
              isDefault={isDefault}
            />
            <PropertiesPanel model={model} values={values} />
          </>
        )}
        {tab === "formulas" && <FormulaPanel model={model} />}
        {tab === "explanation" && <ExplanationPanel model={model} />}
        {tab === "examples" && <ExamplePanel model={model} />}
      </div>
    </div>
  );
}
