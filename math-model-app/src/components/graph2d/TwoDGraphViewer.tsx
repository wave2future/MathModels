import { useMemo } from "react";
import type { MathModel, ParamValues } from "@/types/model";
import { useElementSize } from "@/hooks/useElementSize";
import { useViewSettings } from "@/components/common/ViewSettings";
import { makeProjection } from "./projection";
import { CoordinateGrid } from "./CoordinateGrid";
import { FunctionGraph } from "./FunctionGraph";
import { AsymptoteLayer } from "./AsymptoteLayer";
import { MarkerLayer } from "./MarkerLayer";

interface Props {
  model: MathModel;
  values: ParamValues;
}

/** Responsive SVG plotter for 2D function and plane-curve models. */
export function TwoDGraphViewer({ model, values }: Props) {
  const { ref, width, height } = useElementSize<HTMLDivElement>();
  const { settings } = useViewSettings();
  const cfg = model.plot2d;

  const view = cfg?.defaultView ?? { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };
  const proj = useMemo(
    () => makeProjection(width || 600, height || 400, view),
    [width, height, view],
  );

  // Recompute geometry whenever parameters change → real-time updates.
  const curves = useMemo(() => cfg?.curves(values) ?? [], [cfg, values]);
  const asymptotes = useMemo(() => cfg?.asymptotes?.(values) ?? [], [cfg, values]);
  const markers = useMemo(() => cfg?.markers?.(values) ?? [], [cfg, values]);

  return (
    <div ref={ref} className="h-full w-full">
      {width > 0 && height > 0 && (
        <svg width={width} height={height} className="block touch-none">
          <CoordinateGrid proj={proj} showGrid={settings.showGrid} showLabels={settings.showLabels} />
          {asymptotes.length > 0 && (
            <AsymptoteLayer asymptotes={asymptotes} proj={proj} showLabels={settings.showLabels} />
          )}
          <FunctionGraph curves={curves} proj={proj} />
          {settings.showMarkers && (
            <MarkerLayer markers={markers} proj={proj} showLabels={settings.showLabels} />
          )}
        </svg>
      )}
    </div>
  );
}
