import type { UiStrings } from "./types";

/**
 * Marker/asymptote labels emitted by `plot2d` functions in `src/models/*.ts`
 * that are plain English words rather than math notation (coordinates,
 * symbols like "x = 0", "O", "a", "b", "r" are left untouched).
 */
const GRAPH_LABEL_KEYS: Record<string, keyof UiStrings["graphLabels"]> = {
  center: "center",
  vertex: "vertex",
  focus: "focus",
  directrix: "directrix",
  axis: "axis",
  midline: "midline",
  asymptote: "asymptote",
  "x-int": "xIntercept",
};

/** Translates a marker/asymptote label if it's a known word; otherwise returns it unchanged. */
export function translateGraphLabel(label: string, t: UiStrings): string {
  const key = GRAPH_LABEL_KEYS[label];
  return key ? t.graphLabels[key] : label;
}
