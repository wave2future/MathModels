import type { Marker2D } from "@/types/model";
import type { Projection } from "./projection";

interface Props {
  markers: Marker2D[];
  proj: Projection;
  showLabels: boolean;
}

/** Draws important points (intercepts, vertex, center, foci...) with labels. */
export function MarkerLayer({ markers, proj, showLabels }: Props) {
  const { toPx, toPy, width, height } = proj;

  return (
    <g>
      {markers.map((m, i) => {
        const px = toPx(m.x);
        const py = toPy(m.y);
        // Skip markers that fall outside the visible area.
        if (px < -20 || px > width + 20 || py < -20 || py > height + 20) return null;
        const open = m.kind === "open";
        const color = m.color ?? "#2563eb";
        return (
          <g key={`mk-${i}`}>
            <circle
              cx={px}
              cy={py}
              r={4.5}
              fill={open ? "white" : color}
              stroke={color}
              strokeWidth={2}
            />
            {showLabels && m.label && (
              <text
                x={px + 7}
                y={py - 7}
                fontSize={11}
                className="fill-slate-700 dark:fill-slate-200"
                style={{ paintOrder: "stroke" }}
              >
                {m.label}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
