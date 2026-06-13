import type { Curve2D, Point2D, ViewBox2D } from "@/types/model";

const TAU = Math.PI * 2;

/** Parametric points of a circle centered at (h, k) with radius r. */
export function circlePoints(h: number, k: number, r: number, steps = 240): Point2D[] {
  const pts: Point2D[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * TAU;
    pts.push({ x: h + r * Math.cos(t), y: k + r * Math.sin(t) });
  }
  return pts;
}

/** Parametric points of an axis-aligned ellipse centered at (h, k). */
export function ellipsePoints(
  h: number,
  k: number,
  a: number,
  b: number,
  steps = 240,
): Point2D[] {
  const pts: Point2D[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * TAU;
    pts.push({ x: h + a * Math.cos(t), y: k + b * Math.sin(t) });
  }
  return pts;
}

/**
 * The two branches of a hyperbola x²/a² - y²/b² = 1, generated with the
 * cosh/sinh parametrization so points spread smoothly along each branch.
 * `tMax` is sized to the visible view so the branches always reach its edges.
 */
export function hyperbolaBranches(a: number, b: number, view: ViewBox2D, steps = 200): Curve2D[] {
  const xExtent = Math.max(Math.abs(view.xMin), Math.abs(view.xMax));
  const yExtent = Math.max(Math.abs(view.yMin), Math.abs(view.yMax));
  const tMax = Math.max(Math.acosh(Math.max(xExtent / a, 1)), Math.asinh(yExtent / b)) + 0.3;
  const right: Point2D[] = [];
  const left: Point2D[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = -tMax + (i / steps) * (2 * tMax);
    const ch = Math.cosh(t);
    const sh = Math.sinh(t);
    right.push({ x: a * ch, y: b * sh });
    left.push({ x: -a * ch, y: b * sh });
  }
  return [
    { id: "hyp-right", points: right },
    { id: "hyp-left", points: left },
  ];
}

/**
 * Parabola y² = 2px (opens right for p>0) as a single smooth curve.
 * `yMax` is sized to the visible view so the curve always reaches its edges.
 */
export function parabolaHorizontalPoints(p: number, view: ViewBox2D, steps = 200): Point2D[] {
  const yExtent = Math.max(Math.abs(view.yMin), Math.abs(view.yMax));
  const xReach = Math.sqrt(2 * Math.abs(p) * Math.max(view.xMax, 0));
  const yMax = Math.max(yExtent, xReach) + 0.5;
  const pts: Point2D[] = [];
  for (let i = 0; i <= steps; i++) {
    const y = -yMax + (i / steps) * (2 * yMax);
    pts.push({ x: (y * y) / (2 * p), y });
  }
  return pts;
}
