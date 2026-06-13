/**
 * Geometry helpers shared by 3D solid models and their derived properties.
 */

export const PI = Math.PI;

/** Area of a regular n-gon given side length a:  n·a² / (4·tan(π/n)). */
export function regularPolygonArea(n: number, a: number): number {
  return (n * a * a) / (4 * Math.tan(Math.PI / n));
}

/** Circumradius of a regular n-gon given side length a:  a / (2·sin(π/n)). */
export function circumradiusFromSide(n: number, a: number): number {
  return a / (2 * Math.sin(Math.PI / n));
}

/** Side length of a regular n-gon given circumradius R. */
export function sideFromCircumradius(n: number, R: number): number {
  return 2 * R * Math.sin(Math.PI / n);
}

/** Perimeter of a regular n-gon given side length a. */
export function regularPolygonPerimeter(n: number, a: number): number {
  return n * a;
}

/** Volume of a frustum (truncated cone/pyramid) from the two base areas. */
export function frustumVolume(baseArea1: number, baseArea2: number, height: number): number {
  return (height / 3) * (baseArea1 + baseArea2 + Math.sqrt(baseArea1 * baseArea2));
}

/** Hypotenuse / slant helper. */
export function hypot(...vals: number[]): number {
  return Math.sqrt(vals.reduce((s, v) => s + v * v, 0));
}
