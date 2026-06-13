import * as THREE from "three";
import type { Vec2 } from "@/types/model";

/**
 * Build a non-indexed BufferGeometry from a list of triangles. Because vertices
 * are not shared, computeVertexNormals() yields flat (faceted) normals — exactly
 * what we want for prisms and pyramids with crisp edges.
 */
function geometryFromTriangles(tris: THREE.Vector3[][]): THREE.BufferGeometry {
  const positions: number[] = [];
  for (const t of tris) {
    for (const v of t) positions.push(v.x, v.y, v.z);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.computeVertexNormals();
  return geo;
}

/** Fan-triangulate a convex polygon (list of vertices) → triangles. */
function fanTriangulate(verts: THREE.Vector3[], reverse = false): THREE.Vector3[][] {
  const tris: THREE.Vector3[][] = [];
  for (let i = 1; i < verts.length - 1; i++) {
    const tri = [verts[0], verts[i], verts[i + 1]];
    tris.push(reverse ? [tri[0], tri[2], tri[1]] : tri);
  }
  return tris;
}

/** Prism: extrude a convex base polygon (on XZ) by `height` along Y, centered. */
export function buildPrismGeometry(base: Vec2[], height: number): THREE.BufferGeometry {
  const hy = height / 2;
  const bottom = base.map(([x, z]) => new THREE.Vector3(x, -hy, z));
  const top = base.map(([x, z]) => new THREE.Vector3(x, hy, z));
  const tris: THREE.Vector3[][] = [];

  // Side quads (split into two triangles each).
  for (let i = 0; i < base.length; i++) {
    const j = (i + 1) % base.length;
    tris.push([bottom[i], bottom[j], top[j]]);
    tris.push([bottom[i], top[j], top[i]]);
  }
  // Caps.
  tris.push(...fanTriangulate(bottom, true));
  tris.push(...fanTriangulate(top, false));

  return geometryFromTriangles(tris);
}

/**
 * Pyramid: convex base polygon (on XZ) tapering up to an apex (topScale = 0) or
 * to a scaled top polygon (topScale > 0, a pyramid frustum). Centered on Y.
 */
export function buildPyramidGeometry(
  base: Vec2[],
  height: number,
  topScale = 0,
): THREE.BufferGeometry {
  const hy = height / 2;
  const bottom = base.map(([x, z]) => new THREE.Vector3(x, -hy, z));
  const tris: THREE.Vector3[][] = [];

  if (topScale <= 0) {
    const apex = new THREE.Vector3(0, hy, 0);
    for (let i = 0; i < base.length; i++) {
      const j = (i + 1) % base.length;
      tris.push([bottom[i], bottom[j], apex]);
    }
  } else {
    const top = base.map(([x, z]) => new THREE.Vector3(x * topScale, hy, z * topScale));
    for (let i = 0; i < base.length; i++) {
      const j = (i + 1) % base.length;
      tris.push([bottom[i], bottom[j], top[j]]);
      tris.push([bottom[i], top[j], top[i]]);
    }
    tris.push(...fanTriangulate(top, false));
  }
  // Bottom cap.
  tris.push(...fanTriangulate(bottom, true));

  return geometryFromTriangles(tris);
}
