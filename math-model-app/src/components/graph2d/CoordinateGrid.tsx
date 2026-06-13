import { type Projection, niceStep } from "./projection";

interface Props {
  proj: Projection;
  showGrid: boolean;
  showLabels: boolean;
}

/** Draws grid lines, the x/y axes, tick labels and the origin. */
export function CoordinateGrid({ proj, showGrid, showLabels }: Props) {
  const { view, toPx, toPy, width, height } = proj;
  const stepX = niceStep(view.xMax - view.xMin);
  const stepY = niceStep(view.yMax - view.yMin);

  const xs: number[] = [];
  for (let x = Math.ceil(view.xMin / stepX) * stepX; x <= view.xMax; x += stepX) xs.push(x);
  const ys: number[] = [];
  for (let y = Math.ceil(view.yMin / stepY) * stepY; y <= view.yMax; y += stepY) ys.push(y);

  const axisX = toPy(0); // screen y of the x-axis (y = 0)
  const axisY = toPx(0); // screen x of the y-axis (x = 0)
  const fmt = (n: number) => (Math.abs(n) < 1e-9 ? "" : Number(n.toFixed(2)).toString());

  return (
    <g>
      {showGrid && (
        <g className="stroke-slate-200 dark:stroke-slate-700" strokeWidth={1}>
          {xs.map((x) => (
            <line key={`gx${x}`} x1={toPx(x)} y1={0} x2={toPx(x)} y2={height} />
          ))}
          {ys.map((y) => (
            <line key={`gy${y}`} x1={0} y1={toPy(y)} x2={width} y2={toPy(y)} />
          ))}
        </g>
      )}

      {/* Axes */}
      <g className="stroke-slate-400 dark:stroke-slate-500" strokeWidth={1.5}>
        {axisX >= 0 && axisX <= height && <line x1={0} y1={axisX} x2={width} y2={axisX} />}
        {axisY >= 0 && axisY <= width && <line x1={axisY} y1={0} x2={axisY} y2={height} />}
      </g>

      {showLabels && (
        <g className="fill-slate-500 dark:fill-slate-400 text-[10px]" fontSize={10}>
          {xs.map((x) => {
            const label = fmt(x);
            if (!label) return null;
            const px = toPx(x);
            const py = Math.min(Math.max(axisX, 10), height - 4);
            return (
              <text key={`lx${x}`} x={px} y={py + 12} textAnchor="middle">
                {label}
              </text>
            );
          })}
          {ys.map((y) => {
            const label = fmt(y);
            if (!label) return null;
            const py = toPy(y);
            const px = Math.min(Math.max(axisY, 4), width - 4);
            return (
              <text key={`ly${y}`} x={px + 5} y={py + 3}>
                {label}
              </text>
            );
          })}
          {/* Origin / axis names */}
          <text x={axisY + 5} y={axisX + 12} className="fill-slate-400">O</text>
          <text x={width - 10} y={axisX - 6} textAnchor="end" className="fill-slate-400">x</text>
          <text x={axisY + 8} y={12} className="fill-slate-400">y</text>
        </g>
      )}
    </g>
  );
}
