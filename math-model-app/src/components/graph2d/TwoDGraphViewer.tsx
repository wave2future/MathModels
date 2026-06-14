import { useEffect, useMemo, useState } from "react";
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

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 8;

/** Distance in pixels between the first two touch points. */
function touchDistance(touches: TouchList): number {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
}

/** Responsive SVG plotter for 2D function and plane-curve models. */
export function TwoDGraphViewer({ model, values }: Props) {
  const { ref, width, height } = useElementSize<HTMLDivElement>();
  const { settings } = useViewSettings();
  const cfg = model.plot2d;
  const [zoom, setZoom] = useState(1);

  const baseView = cfg?.defaultView ?? { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };

  // Mouse wheel and two-finger pinch both zoom the view in/out around its
  // center. Native listeners are required so we can preventDefault the page
  // scroll/pinch-zoom gesture.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.001);
      setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z * factor)));
    };

    let pinchDistance: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        pinchDistance = touchDistance(e.touches);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinchDistance !== null) {
        e.preventDefault();
        const distance = touchDistance(e.touches);
        const factor = distance / pinchDistance;
        setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z * factor)));
        pinchDistance = distance;
      }
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) pinchDistance = null;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [ref]);

  const view = useMemo(() => {
    const cx = (baseView.xMin + baseView.xMax) / 2;
    const cy = (baseView.yMin + baseView.yMax) / 2;
    const halfW = (baseView.xMax - baseView.xMin) / 2 / zoom;
    const halfH = (baseView.yMax - baseView.yMin) / 2 / zoom;
    return { xMin: cx - halfW, xMax: cx + halfW, yMin: cy - halfH, yMax: cy + halfH };
  }, [baseView, zoom]);

  const proj = useMemo(
    () => makeProjection(width || 600, height || 400, view),
    [width, height, view],
  );

  // Recompute geometry whenever parameters or the visible range change → curves
  // are resampled to fill the current viewport at every zoom level.
  const curves = useMemo(() => cfg?.curves(values, proj.view) ?? [], [cfg, values, proj.view]);
  const asymptotes = useMemo(() => cfg?.asymptotes?.(values, proj.view) ?? [], [cfg, values, proj.view]);
  const markers = useMemo(() => cfg?.markers?.(values) ?? [], [cfg, values]);

  return (
    <div ref={ref} className="relative h-full w-full" onDoubleClick={() => setZoom(1)}>
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
      {zoom !== 1 && (
        <div className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-slate-900/60 px-2 py-0.5 text-xs font-medium text-white">
          {Math.round(zoom * 100)}%
        </div>
      )}
    </div>
  );
}
