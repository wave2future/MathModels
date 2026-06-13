import type { Vec2 } from "@/types/model";
import { circumradiusFromSide } from "./geometryUtils";

/**
 * Vertices of a regular n-gon (on the XZ plane) given the side length `a`.
 * Centered at the origin; first vertex placed so prisms look upright.
 */
export function regularPolygon(n: number, sideLength: number): Vec2[] {
  const R = circumradiusFromSide(n, sideLength);
  const pts: Vec2[] = [];
  // Offset so a flat edge faces the viewer for even n, a point up for odd n.
  const offset = Math.PI / 2 + (n % 2 === 0 ? Math.PI / n : 0);
  for (let i = 0; i < n; i++) {
    const t = offset + (i / n) * Math.PI * 2;
    pts.push([R * Math.cos(t), R * Math.sin(t)]);
  }
  return pts;
}

/** Rectangle base (l along x, w along z) centered at the origin. */
export function rectanglePolygon(l: number, w: number): Vec2[] {
  const hx = l / 2;
  const hz = w / 2;
  return [
    [-hx, -hz],
    [hx, -hz],
    [hx, hz],
    [-hx, hz],
  ];
}

/** Isosceles triangle base: width `base` along x, `height` along z, centered. */
export function trianglePolygon(base: number, height: number): Vec2[] {
  const hx = base / 2;
  const hz = height / 2;
  return [
    [-hx, -hz],
    [hx, -hz],
    [0, hz],
  ];
}
