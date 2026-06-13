import type { Curve2D } from "@/types/model";
import type { Projection } from "./projection";

interface Props {
  curves: Curve2D[];
  proj: Projection;
  defaultColor?: string;
}

/**
 * Renders each curve as an SVG polyline path. Points outside the visible band
 * are kept (so lines extend to the edges) but extreme values are clamped to
 * avoid gigantic path coordinates.
 */
export function FunctionGraph({ curves, proj, defaultColor = "#2563eb" }: Props) {
  const { toPx, toPy, height } = proj;
  const clampY = (py: number) => Math.min(Math.max(py, -height * 4), height * 5);

  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      {curves.map((curve) => {
        if (curve.points.length < 2) return null;
        const d = curve.points
          .map((p, i) => `${i === 0 ? "M" : "L"} ${toPx(p.x).toFixed(2)} ${clampY(toPy(p.y)).toFixed(2)}`)
          .join(" ");
        return (
          <path
            key={curve.id}
            d={d}
            stroke={curve.color ?? defaultColor}
            strokeWidth={curve.width ?? 2.5}
            strokeDasharray={curve.dashed ? "6 5" : undefined}
          />
        );
      })}
    </g>
  );
}
