/**
 * Re-export of math helpers so model files can import everything math-related
 * from a single module, plus a few small algebraic helpers used by 2D models.
 */
export * from "./geometryUtils";
export * from "./graphUtils";
export * from "./conicUtils";

/** Safe power that returns null for invalid real results (e.g. (-2)^0.5). */
export function safePow(base: number, exp: number): number | null {
  if (base < 0 && !Number.isInteger(exp)) return null;
  const v = Math.pow(base, exp);
  return Number.isFinite(v) ? v : null;
}

/** Vertex x-coordinate of a parabola y = ax² + bx + c. */
export function parabolaVertexX(a: number, b: number): number {
  return a === 0 ? 0 : -b / (2 * a);
}
