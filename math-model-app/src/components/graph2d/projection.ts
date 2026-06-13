import type { ViewBox2D } from "@/types/model";

/**
 * Maps math coordinates to screen pixels using a single uniform scale on both
 * axes (so circles stay round). The requested view is centered, and the actual
 * visible range is widened to fill the container's aspect ratio.
 */
export interface Projection {
  toPx: (x: number) => number;
  toPy: (y: number) => number;
  scale: number;
  width: number;
  height: number;
  /** The math range actually visible after aspect-ratio adjustment. */
  view: ViewBox2D;
}

export function makeProjection(width: number, height: number, view: ViewBox2D): Projection {
  const vw = Math.max(view.xMax - view.xMin, 1e-6);
  const vh = Math.max(view.yMax - view.yMin, 1e-6);
  const scale = Math.min(width / vw, height / vh);
  const cx = (view.xMin + view.xMax) / 2;
  const cy = (view.yMin + view.yMax) / 2;

  const toPx = (x: number) => width / 2 + (x - cx) * scale;
  const toPy = (y: number) => height / 2 - (y - cy) * scale;

  const halfW = width / 2 / scale;
  const halfH = height / 2 / scale;
  const actualView: ViewBox2D = {
    xMin: cx - halfW,
    xMax: cx + halfW,
    yMin: cy - halfH,
    yMax: cy + halfH,
  };

  return { toPx, toPy, scale, width, height, view: actualView };
}

/** Choose a "nice" grid step (1, 2, 5 × 10ⁿ) so a range shows ~`target` lines. */
export function niceStep(range: number, target = 10): number {
  const rough = range / target;
  const pow = Math.pow(10, Math.floor(Math.log10(rough)));
  const norm = rough / pow;
  let step: number;
  if (norm < 1.5) step = 1;
  else if (norm < 3) step = 2;
  else if (norm < 7) step = 5;
  else step = 10;
  return step * pow;
}
