import type { Curve2D, Point2D } from "@/types/model";

/**
 * Sample a single-valued function y = f(x) across [xMin, xMax] and split it into
 * separate polyline segments wherever the function is undefined (returns null /
 * NaN / Infinity) or jumps discontinuously (e.g. tan asymptotes).
 *
 * `maxJump` guards against connecting two points across a vertical asymptote: if
 * |Δy| between consecutive samples exceeds it, we start a new segment.
 */
export function sampleFunction(
  fn: (x: number) => number | null,
  xMin: number,
  xMax: number,
  options: { steps?: number; maxJump?: number } = {},
): Point2D[][] {
  const steps = options.steps ?? 600;
  const maxJump = options.maxJump ?? Infinity;
  const dx = (xMax - xMin) / steps;

  const segments: Point2D[][] = [];
  let current: Point2D[] = [];
  let prevY: number | null = null;

  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    const raw = fn(x);
    const y = raw === null ? NaN : raw;

    if (!Number.isFinite(y)) {
      if (current.length > 0) {
        segments.push(current);
        current = [];
      }
      prevY = null;
      continue;
    }

    // Break the line when there is a large vertical jump (likely an asymptote).
    if (prevY !== null && Math.abs(y - prevY) > maxJump) {
      if (current.length > 0) {
        segments.push(current);
        current = [];
      }
    }

    current.push({ x, y });
    prevY = y;
  }
  if (current.length > 0) segments.push(current);
  return segments;
}

/**
 * Convenience wrapper that turns a function into ready-to-render {@link Curve2D}s.
 */
export function functionCurves(
  fn: (x: number) => number | null,
  xMin: number,
  xMax: number,
  opts: { steps?: number; maxJump?: number; color?: string; idPrefix?: string } = {},
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
