import type { MathModel } from "@/types/model";
import { ToggleControl } from "@/components/controls/ToggleControl";
import { useViewSettings } from "@/components/common/ViewSettings";

interface Props {
  model: MathModel;
}

const is3D = (m: MathModel) =>
  m.visualizationType === "3d-solid" || m.visualizationType === "combined-solid";

/** Context-aware row of view toggles (grid, labels, markers, wireframe, formulas). */
export function ViewSettingsBar({ model }: Props) {
  const { settings, toggle } = useViewSettings();
  const threeD = is3D(model);

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800">
      <ToggleControl label="Grid" checked={settings.showGrid} onChange={() => toggle("showGrid")} />
      <ToggleControl label="Labels" checked={settings.showLabels} onChange={() => toggle("showLabels")} />
      {threeD ? (
        <ToggleControl
          label="Wireframe"
          checked={settings.showWireframe}
          onChange={() => toggle("showWireframe")}
        />
      ) : (
        <ToggleControl
          label="Markers"
          checked={settings.showMarkers}
          onChange={() => toggle("showMarkers")}
        />
      )}
      <ToggleControl
        label="Formulas"
        checked={settings.showFormulas}
        onChange={() => toggle("showFormulas")}
      />
    </div>
  );
}
