/**
 * Core type definitions for the data-driven math model registry.
 *
 * Every model in the app is a plain data object that conforms to {@link MathModel}.
 * UI components never hard-code a specific model; they read these structures and
 * render generically. This keeps "add a new model" a data-only change.
 */

export type VisualizationType =
  | "2d-function"
  | "2d-implicit"
  | "3d-solid"
  | "combined-solid";

/** A bag of live parameter values keyed by parameter id. */
export type ParamValues = Record<string, number>;

export interface ParameterDefinition {
  id: string;
  label: string;
  /** Math symbol shown next to the slider, e.g. "k", "a", "r". */
  symbol: string;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  explanation?: string;
}

export interface FormulaItem {
  label: string;
  /** LaTeX source (without surrounding $...$). */
  latex: string;
  description?: string;
}

/**
 * A derived geometric/algebraic property (area, perimeter, volume, ...).
 * `latex` is the symbolic formula; `compute` returns the numeric value for the
 * current parameter values; the result is formatted by the UI.
 */
export interface DerivedProperty {
  label: string;
  symbol: string;
  unit?: string;
  latex: string;
  compute: (p: ParamValues) => number;
}

/* ------------------------------------------------------------------ */
/* 2D rendering config                                                  */
/* ------------------------------------------------------------------ */

export interface Point2D {
  x: number;
  y: number;
}

/** A single polyline. Discontinuities are represented as separate curves. */
export interface Curve2D {
  id: string;
  points: Point2D[];
  color?: string;
  dashed?: boolean;
  width?: number;
}

export interface Asymptote {
  kind: "vertical" | "horizontal" | "oblique";
  /** for vertical: x = value */
  x?: number;
  /** for horizontal: y = value */
  y?: number;
  /** for oblique: y = slope * x + intercept */
  slope?: number;
  intercept?: number;
  label?: string;
}

export interface Marker2D {
  x: number;
  y: number;
  label?: string;
  /** "open" draws a hollow circle (used for excluded points). */
  kind?: "point" | "open";
  color?: string;
}

export interface ViewBox2D {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface Plot2DConfig {
  /** Build the curve(s) to draw for the given parameter values and visible range. */
  curves: (p: ParamValues, view: ViewBox2D) => Curve2D[];
  asymptotes?: (p: ParamValues, view: ViewBox2D) => Asymptote[];
  markers?: (p: ParamValues) => Marker2D[];
  defaultView?: ViewBox2D;
}

/* ------------------------------------------------------------------ */
/* 3D rendering config                                                  */
/* ------------------------------------------------------------------ */

export type Vec3 = [number, number, number];
/** A 2D point on the XZ ground plane, used for polygon bases of prisms/pyramids. */
export type Vec2 = [number, number];

interface SolidPartBase {
  position?: Vec3;
  rotation?: Vec3;
  color?: string;
  opacity?: number;
  /** Optional label for combined solids (e.g. "roof", "body"). */
  name?: string;
}

/**
 * Primitive types that together cover every required solid:
 *  - `box`      : cuboid / cube
 *  - `cylinder` : cylinder, cone (radiusTop 0) and round frustum
 *  - `sphere`   : sphere and hemisphere (via thetaStart / thetaLength)
 *  - `prism`    : extrude an arbitrary convex polygon base along Y
 *                 (triangular / quadrangular / regular n-gon prisms)
 *  - `pyramid`  : polygon base tapering to an apex, or to a scaled top
 *                 (`topScale`) for a pyramid frustum
 */
export type SolidPart =
  | (SolidPartBase & { type: "box"; size: Vec3 })
  | (SolidPartBase & {
      type: "cylinder";
      radiusTop: number;
      radiusBottom: number;
      height: number;
      radialSegments: number;
    })
  | (SolidPartBase & {
      type: "sphere";
      radius: number;
      /** Polar start/sweep — use thetaStart 0, thetaLength PI/2 for a top hemisphere. */
      thetaStart?: number;
      thetaLength?: number;
    })
  | (SolidPartBase & {
      type: "prism";
      /** Convex base polygon on the XZ plane, centered near the origin. */
      base: Vec2[];
      height: number;
    })
  | (SolidPartBase & {
      type: "pyramid";
      base: Vec2[];
      height: number;
      /** 0 = apex (true pyramid); >0 scales the top polygon for a frustum. */
      topScale?: number;
    });

export interface DimensionLabel {
  position: Vec3;
  text: string;
}

export interface SolidScene {
  parts: SolidPart[];
  labels?: DimensionLabel[];
}

export interface Solid3DConfig {
  build: (p: ParamValues) => SolidScene;
}

/* ------------------------------------------------------------------ */
/* Model                                                               */
/* ------------------------------------------------------------------ */

export interface MathModel {
  id: string;
  category: string;
  name: string;
  description: string;
  visualizationType: VisualizationType;
  /** Primary formula in LaTeX, shown in the header. */
  formula: string;
  formulas: FormulaItem[];
  parameters: ParameterDefinition[];
  defaultValues: ParamValues;
  explanation: string;
  parameterExplanations: Record<string, string>;
  examples: string[];
  properties?: DerivedProperty[];
  /** 2D models use plot2d; 3D / combined solids use solid3d. */
  plot2d?: Plot2DConfig;
  solid3d?: Solid3DConfig;
}

/** Input accepted by {@link defineModel} — defaultValues & parameterExplanations are derived. */
export type ModelInput = Omit<MathModel, "defaultValues" | "parameterExplanations"> & {
  defaultValues?: ParamValues;
  parameterExplanations?: Record<string, string>;
};

export interface ModelCategory {
  id: string;
  name: string;
  description?: string;
}
