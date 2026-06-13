import type { MathModel } from "@/types/model";
import { defineModel } from "@/utils/formatFormula";
import {
  circlePoints,
  ellipsePoints,
  hyperbolaBranches,
  parabolaHorizontalPoints,
  PI,
} from "@/math/formulas";

export const planeCurveModels: MathModel[] = [
  /* 13. Circle -------------------------------------------------------- */
  defineModel({
    id: "circle",
    category: "plane-curves",
    name: "Circle",
    chineseName: "圆",
    description: "All points at distance r from a center (h, k).",
    visualizationType: "2d-implicit",
    formula: "(x - h)^2 + (y - k)^2 = r^2",
    formulas: [
      { label: "Standard form", latex: "(x - h)^2 + (y - k)^2 = r^2" },
      { label: "Centered at origin", latex: "x^2 + y^2 = r^2" },
      { label: "Circumference", latex: "C = 2\\pi r" },
      { label: "Area", latex: "A = \\pi r^2" },
    ],
    parameters: [
      { id: "h", label: "Center x", symbol: "h", defaultValue: 0, min: -6, max: 6, step: 0.1,
        explanation: "Horizontal position of the center." },
      { id: "k", label: "Center y", symbol: "k", defaultValue: 0, min: -6, max: 6, step: 0.1,
        explanation: "Vertical position of the center." },
      { id: "r", label: "Radius", symbol: "r", defaultValue: 3, min: 0.5, max: 6, step: 0.1,
        explanation: "Distance from the center to the edge." },
    ],
    explanation:
      "A circle is the set of points a fixed distance r (the radius) from its center (h, k). Moving h and k slides the whole circle; changing r grows or shrinks it. Its circumference and area depend only on r.",
    examples: ["Wheels and gears.", "Ripples on water.", "Circular running tracks."],
    properties: [
      { label: "Circumference", symbol: "C", unit: "units", latex: "C = 2\\pi r", compute: (p) => 2 * PI * p.r },
      { label: "Area", symbol: "A", unit: "units²", latex: "A = \\pi r^2", compute: (p) => PI * p.r * p.r },
      { label: "Diameter", symbol: "d", unit: "units", latex: "d = 2r", compute: (p) => 2 * p.r },
    ],
    plot2d: {
      defaultView: { xMin: -8, xMax: 8, yMin: -8, yMax: 8 },
      curves: (p) => [{ id: "circle", points: circlePoints(p.h, p.k, p.r) }],
      markers: (p) => [
        { x: p.h, y: p.k, label: "center", kind: "point" },
        { x: p.h + p.r, y: p.k, label: "r", kind: "point" },
      ],
    },
  }),

  /* 14. Ellipse ------------------------------------------------------- */
  defineModel({
    id: "ellipse",
    category: "plane-curves",
    name: "Ellipse",
    chineseName: "椭圆",
    description: "A stretched circle with semi-axes a and b.",
    visualizationType: "2d-implicit",
    formula: "\\dfrac{x^2}{a^2} + \\dfrac{y^2}{b^2} = 1",
    formulas: [
      { label: "Standard form", latex: "\\dfrac{x^2}{a^2} + \\dfrac{y^2}{b^2} = 1" },
      { label: "Area", latex: "A = \\pi a b" },
      { label: "Foci (a>b)", latex: "c = \\sqrt{a^2 - b^2}" },
    ],
    parameters: [
      { id: "a", label: "Semi-axis a", symbol: "a", defaultValue: 4, min: 0.5, max: 7, step: 0.1,
        explanation: "Half the width along the x-axis." },
      { id: "b", label: "Semi-axis b", symbol: "b", defaultValue: 2.5, min: 0.5, max: 7, step: 0.1,
        explanation: "Half the height along the y-axis." },
    ],
    explanation:
      "An ellipse is a circle scaled by different amounts along the two axes. a and b are the semi-major and semi-minor axes (whichever is larger is 'major'). When a = b the ellipse becomes a circle. Its area is π·a·b.",
    examples: ["Planetary orbits.", "Whispering galleries.", "Elliptical gears."],
    properties: [
      { label: "Area", symbol: "A", unit: "units²", latex: "A = \\pi a b", compute: (p) => PI * p.a * p.b },
      {
        label: "Focal distance",
        symbol: "c",
        unit: "units",
        latex: "c = \\sqrt{|a^2 - b^2|}",
        compute: (p) => Math.sqrt(Math.abs(p.a * p.a - p.b * p.b)),
      },
    ],
    plot2d: {
      defaultView: { xMin: -8, xMax: 8, yMin: -8, yMax: 8 },
      curves: (p) => [{ id: "ellipse", points: ellipsePoints(0, 0, p.a, p.b) }],
      markers: (p) => [
        { x: 0, y: 0, label: "center", kind: "point" },
        { x: p.a, y: 0, label: "a", kind: "point" },
        { x: 0, y: p.b, label: "b", kind: "point" },
      ],
    },
  }),

  /* 15. Hyperbola ----------------------------------------------------- */
  defineModel({
    id: "hyperbola",
    category: "plane-curves",
    name: "Hyperbola",
    chineseName: "双曲线",
    description: "Two opposing branches with straight-line asymptotes.",
    visualizationType: "2d-implicit",
    formula: "\\dfrac{x^2}{a^2} - \\dfrac{y^2}{b^2} = 1",
    formulas: [
      { label: "Standard form", latex: "\\dfrac{x^2}{a^2} - \\dfrac{y^2}{b^2} = 1" },
      { label: "Asymptotes", latex: "y = \\pm \\dfrac{b}{a} x" },
      { label: "Vertices", latex: "(\\pm a,\\, 0)" },
    ],
    parameters: [
      { id: "a", label: "a", symbol: "a", defaultValue: 2, min: 0.5, max: 5, step: 0.1,
        explanation: "Sets the vertices at (±a, 0) and the asymptote slope." },
      { id: "b", label: "b", symbol: "b", defaultValue: 2, min: 0.5, max: 5, step: 0.1,
        explanation: "Together with a sets the asymptote slope ±b/a." },
    ],
    explanation:
      "A hyperbola has two mirror-image branches that open left and right, each approaching the asymptotes y = ±(b/a)x without touching them. The simple inverse-proportional curve y = k/x is a hyperbola too — just rotated so the axes themselves are its asymptotes.",
    examples: ["Long-range navigation (LORAN).", "The path of an object escaping gravity.", "Shadow of a lamp cone on a wall."],
    properties: [
      {
        label: "Asymptote slope",
        symbol: "m",
        latex: "m = \\dfrac{b}{a}",
        compute: (p) => p.b / p.a,
      },
    ],
    plot2d: {
      defaultView: { xMin: -8, xMax: 8, yMin: -8, yMax: 8 },
      curves: (p) => hyperbolaBranches(p.a, p.b),
      asymptotes: (p) => [
        { kind: "oblique", slope: p.b / p.a, intercept: 0, label: "asymptote" },
        { kind: "oblique", slope: -p.b / p.a, intercept: 0, label: "asymptote" },
      ],
      markers: (p) => [
        { x: p.a, y: 0, label: "vertex", kind: "point" },
        { x: -p.a, y: 0, label: "vertex", kind: "point" },
      ],
    },
  }),

  /* 16. Parabola (conic) ---------------------------------------------- */
  defineModel({
    id: "parabola-conic",
    category: "plane-curves",
    name: "Parabola (Conic)",
    chineseName: "抛物线",
    description: "The conic y² = 2px with a focus and directrix.",
    visualizationType: "2d-implicit",
    formula: "y^2 = 2px",
    formulas: [
      { label: "Standard form", latex: "y^2 = 2px" },
      { label: "Focus", latex: "\\left(\\dfrac{p}{2},\\, 0\\right)" },
      { label: "Directrix", latex: "x = -\\dfrac{p}{2}" },
    ],
    parameters: [
      { id: "p", label: "Parameter p", symbol: "p", defaultValue: 2, min: 0.5, max: 6, step: 0.1,
        explanation: "Distance-related parameter; p>0 opens to the right." },
    ],
    explanation:
      "Every point on a parabola is equidistant from a fixed point (the focus) and a fixed line (the directrix). For y² = 2px the curve opens to the right, the focus sits at (p/2, 0), and the directrix is the vertical line x = −p/2. Larger p makes a wider opening.",
    examples: ["Satellite dishes and headlight reflectors.", "Suspension bridge cables.", "Projectile paths."],
    properties: [
      {
        label: "Focus x",
        symbol: "f",
        latex: "f = \\dfrac{p}{2}",
        compute: (p) => p.p / 2,
      },
    ],
    plot2d: {
      defaultView: { xMin: -6, xMax: 10, yMin: -8, yMax: 8 },
      curves: (p) => [{ id: "parabola", points: parabolaHorizontalPoints(p.p) }],
      asymptotes: (p) => [{ kind: "vertical", x: -p.p / 2, label: "directrix" }],
      markers: (p) => [
        { x: p.p / 2, y: 0, label: "focus", kind: "point" },
        { x: 0, y: 0, label: "vertex", kind: "point" },
      ],
    },
  }),
];
