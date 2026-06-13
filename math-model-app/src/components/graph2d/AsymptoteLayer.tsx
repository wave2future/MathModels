import type { Asymptote } from "@/types/model";
import type { Projection } from "./projection";
import { useT } from "@/i18n/LanguageContext";
import { translateGraphLabel } from "@/i18n/graphLabels";

interface Props {
  asymptotes: Asymptote[];
  proj: Projection;
  showLabels: boolean;
}

/** Draws dashed asymptote / axis-of-symmetry / directrix lines. */
export function AsymptoteLayer({ asymptotes, proj, showLabels }: Props) {
  const { toPx, toPy, width, height, view } = proj;
  const { strings } = useT();

  return (
    <g className="stroke-rose-400 dark:stroke-rose-400/80" strokeWidth={1.5} strokeDasharray="6 5">
      {asymptotes.map((a, i) => {
        let line: { x1: number; y1: number; x2: number; y2: number };
        let labelPos: { x: number; y: number } | null = null;

        if (a.kind === "vertical" && a.x !== undefined) {
          const px = toPx(a.x);
          line = { x1: px, y1: 0, x2: px, y2: height };
          labelPos = { x: px + 4, y: 14 };
        } else if (a.kind === "horizontal" && a.y !== undefined) {
          const py = toPy(a.y);
          line = { x1: 0, y1: py, x2: width, y2: py };
          labelPos = { x: width - 6, y: py - 4 };
        } else {
          // oblique: y = slope * x + intercept, clipped to the visible x-range
          const slope = a.slope ?? 0;
          const intercept = a.intercept ?? 0;
          const y1 = slope * view.xMin + intercept;
          const y2 = slope * view.xMax + intercept;
          line = { x1: toPx(view.xMin), y1: toPy(y1), x2: toPx(view.xMax), y2: toPy(y2) };
          labelPos = { x: toPx(view.xMax * 0.7), y: toPy(slope * view.xMax * 0.7 + intercept) - 4 };
        }

        return (
          <g key={`asym-${i}`}>
            <line {...line} />
            {showLabels && a.label && labelPos && (
              <text
                x={labelPos.x}
                y={labelPos.y}
                fontSize={10}
                className="fill-rose-500 dark:fill-rose-300"
                textAnchor={a.kind === "horizontal" ? "end" : "start"}
                strokeWidth={0}
              >
                {translateGraphLabel(a.label, strings)}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
