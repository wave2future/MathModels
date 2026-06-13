import type { MathModel, ModelCategory } from "@/types/model";
import { functionModels } from "./functionModels";
import { planeCurveModels } from "./planeCurveModels";
import { solidGeometryModels } from "./solidGeometryModels";
import { combinedSolidModels } from "./combinedSolidModels";

/**
 * Central model registry. UI components consume these arrays/maps and never
 * hard-code an individual model. Adding a model = adding an entry to one of the
 * imported files; it then automatically appears in the sidebar and renders.
 */

export const categories: ModelCategory[] = [
  { id: "functions", name: "Common Functions", description: "Function graphs in the coordinate plane" },
  { id: "plane-curves", name: "Plane Curves", description: "Conic sections and other curves" },
  { id: "solids", name: "Solid Geometry", description: "3D solids: prisms, pyramids, round solids" },
  { id: "combined", name: "Combined Solids", description: "Composite shapes built from basic solids" },
];

export const allModels: MathModel[] = [
  ...functionModels,
  ...planeCurveModels,
  ...solidGeometryModels,
  ...combinedSolidModels,
];

// Fail fast in dev if two models share an id (would break selection/routing).
const seen = new Set<string>();
for (const m of allModels) {
  if (seen.has(m.id)) {
    console.error(`Duplicate model id detected: "${m.id}"`);
  }
  seen.add(m.id);
}

export const modelsById: Record<string, MathModel> = Object.fromEntries(
  allModels.map((m) => [m.id, m]),
);

export function getModelById(id: string): MathModel | undefined {
  return modelsById[id];
}

export function modelsByCategory(categoryId: string): MathModel[] {
  return allModels.filter((m) => m.category === categoryId);
}
