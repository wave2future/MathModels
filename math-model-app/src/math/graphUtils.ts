import type { Curve2D, Point2D } from "@/types/model";

/**
 * Bisects between a known finite point and a break point (where `fn` returns
 * null/non-finite) to find a point just shy of the break where |y| reaches
 * `targetY`. Used to extend curves all the way to the visible edge near a
 * vertical asymptote, regardless of how coarse the regular sampling grid is.
 */
function refineNearAsymptote(
  fn: (x: number) => number | null,
  xKnown: number,
  yKnown: number,
  xBreak: number,
  targetY: number,
): Point2D | null {
  if (!Number.isFinite(yKnown) || Math.abs(yKnown) >= targetY) return null;
  let lo = xKnown;
  let hi = xBreak;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    const raw = fn(mid);
    const y = raw === null ? NaN : raw;
    if (!Number.isFinite(y) || Math.abs(y) >= targetY) hi = mid;
    else lo = mid;
  }
  const raw = fn(lo);
  const y = raw === null ? NaN : raw;
  return Number.isFinite(y) ? { x: lo, y } : null;
}

/** Closest value in `xs` to `x` that is within `tol`, or null if none qualifies. */
function nearestAsymptoteX(xs: number[] | undefined, x: number, tol: number): number | null {
  if (!xs) return null;
  let best: number | null = null;
  let bestDist = Infinity;
  for (const x0 of xs) {
    const d = Math.abs(x0 - x);
    if (d <= tol && d < bestDist) {
      best = x0;
      bestDist = d;
    }
  }
  return best;
}

/**
 * Sample a single-valued function y = f(x) across [xMin, xMax] and split it into
 * separate polyline segments wherever the function is undefined (returns null /
 * NaN / Infinity) or jumps discontinuously (e.g. tan asymptotes).
 *
 * `maxJump` guards against connecting two points across a vertical asymptote: if
 * |Δy| between consecutive samples exceeds it, we start a new segment.
 *
 * `refineTargetY`, if given, extends segments that end/start at a null/non-finite
 * break by bisecting toward the break point until |y| reaches it — so curves
 * with vertical asymptotes (e.g. y = k/x) still reach the visible top/bottom
 * edge even when the regular sampling grid is too coarse near the asymptote.
 *
 * `asymptoteXs`, if given alongside `refineTargetY`, additionally extends any
 * segment endpoint that lands near one of these known asymptote x-positions by
 * bisecting toward that exact x — for functions like tan(x) whose breaks happen
 * via `maxJump` (both samples finite) rather than a null/non-finite value, so
 * the regular null-based refinement above never fires.
 */
export function sampleFunction(
  fn: (x: number) => number | null,
  xMin: number,
  xMax: number,
  options: { steps?: number; maxJump?: number; refineTargetY?: number; asymptoteXs?: number[] } = {},
): Point2D[][] {
  const steps = options.steps ?? 600;
  const maxJump = options.maxJump ?? Infinity;
  const refineTargetY = options.refineTargetY;
  const dx = (xMax - xMin) / steps;

  const segments: Point2D[][] = [];
  let current: Point2D[] = [];
  let prevY: number | null = null;
  let prevX: number | null = null;

  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    const raw = fn(x);
    const y = raw === null ? NaN : raw;

    if (!Number.isFinite(y)) {
      if (current.length > 0) {
        if (refineTargetY !== undefined) {
          const last = current[current.length - 1];
          const refined = refineNearAsymptote(fn, last.x, last.y, x, refineTargetY);
          if (refined) current.push(refined);
        }
        segments.push(current);
        current = [];
      }
      prevY = null;
      prevX = x;
      continue;
    }

    // Break the line when there is a large vertical jump (likely an asymptote).
    if (prevY !== null && Math.abs(y - prevY) > maxJump) {
      if (current.length > 0) {
        segments.push(current);
        current = [];
      }
    }

    // Starting a fresh segment right after a null/non-finite break: extend it
    // backward toward that break point too, so both sides reach the edge.
    if (current.length === 0 && prevY === null && prevX !== null && refineTargetY !== undefined) {
      const refined = refineNearAsymptote(fn, x, y, prevX, refineTargetY);
      if (refined) current.push(refined);
    }

    current.push({ x, y });
    prevY = y;
    prevX = x;
  }
  if (current.length > 0) segments.push(current);

  // Extend any segment endpoint that lands near a known asymptote x-position
  // (e.g. tan's periodic asymptotes) toward that exact x until |y| reaches
  // refineTargetY, even though both samples either side are finite.
  if (refineTargetY !== undefined && options.asymptoteXs) {
    const tol = dx * 1.5;
    for (const seg of segments) {
      if (seg.length === 0) continue;
      const first = seg[0];
      if (Math.abs(first.y) < refineTargetY) {
        const x0 = nearestAsymptoteX(options.asymptoteXs, first.x, tol);
        if (x0 !== null) {
          const refined = refineNearAsymptote(fn, first.x, first.y, x0, refineTargetY);
          if (refined) seg.unshift(refined);
        }
      }
      const last = seg[seg.length - 1];
      if (Math.abs(last.y) < refineTargetY) {
        const x0 = nearestAsymptoteX(options.asymptoteXs, last.x, tol);
        if (x0 !== null) {
          const refined = refineNearAsymptote(fn, last.x, last.y, x0, refineTargetY);
          if (refined) seg.push(refined);
        }
      }
    }
  }

  return segments;
}

/**
 * Convenience wrapper that turns a function into ready-to-render {@link Curve2D}s.
 */
export function functionCurves(
  fn: (x: number) => number | null,
  xMin: number,
  xMax: number,
  opts: {
    steps?: number;
    maxJump?: number;
    refineTargetY?: number;
    asymptoteXs?: number[];
    color?: string;
    idPrefix?: string;
  } = {},
): Curve2D[] {
  const segments = sampleFunction(fn, xMin, xMax, opts);
  const prefix = opts.idPrefix ?? "seg";
  return segments
    .filter((s) => s.length >= 2)
    .map((points, i) => ({
      id: `${prefix}-${i}`,
      points,
      color: opts.color,
    }));
}

/** Clamp a number to a range. */
export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}
