import type { MathModel } from "@/types/model";
import { ToggleControl } from "@/components/controls/ToggleControl";
import { useViewSettings } from "@/components/common/ViewSettings";
import { useT } from "@/i18n/LanguageContext";

interface Props {
  model: MathModel;
}

const is3D = (m: MathModel) =>
  m.visualizationType === "3d-solid" || m.visualizationType === "combined-solid";

/** Context-aware row of view toggles (grid, labels, markers, wireframe, formulas). */
export function ViewSettingsBar({ model }: Props) {
  const { settings, toggle } = useViewSettings();
  const { t } = useT();
  const threeD = is3D(model);

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800">
      <ToggleControl label={t("viewSettings.grid")} checked={settings.showGrid} onChange={() => toggle("showGrid")} />
      <ToggleControl label={t("viewSettings.labels")} checked={settings.showLabels} onChange={() => toggle("showLabels")} />
      {threeD ? (
        <ToggleControl
          label={t("viewSettings.wireframe")}
          checked={settings.showWireframe}
          onChange={() => toggle("showWireframe")}
        />
      ) : (
        <ToggleControl
          label={t("viewSettings.markers")}
          checked={settings.showMarkers}
          onChange={() => toggle("showMarkers")}
        />
      )}
      <ToggleControl
        label={t("panels.formulas")}
        checked={settings.showFormulas}
        onChange={() => toggle("showFormulas")}
      />
    </div>
  );
}
