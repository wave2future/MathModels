import type { MathModel } from "@/types/model";
import { defineModel } from "@/utils/formatFormula";
import { functionCurves, safePow, parabolaVertexX } from "@/math/formulas";

const STD_VIEW = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };

export const functionModels: MathModel[] = [
  /* 1. Direct proportional function ------------------------------------ */
  defineModel({
    id: "direct-proportional",
    category: "functions",
    name: "Direct Proportional Function",
    description: "A straight line through the origin whose steepness is set by k.",
    visualizationType: "2d-function",
    formula: "y = kx",
    formulas: [
      { label: "Function", latex: "y = kx", description: "Passes through the origin (0, 0)." },
      { label: "Slope", latex: "k = \\dfrac{\\Delta y}{\\Delta x}", description: "Rise over run." },
    ],
    parameters: [
      { id: "k", label: "Slope", symbol: "k", defaultValue: 1, min: -5, max: 5, step: 0.1,
        explanation: "Controls the steepness and direction. k>0 rises, k<0 falls." },
    ],
    explanation:
      "Direct proportion means y changes at a constant rate with x. The graph is always a line through the origin; only its slope changes. Larger |k| means a steeper line; the sign of k flips the line between the rising and falling diagonals.",
    examples: [
      "Distance vs time at constant speed (d = vt).",
      "Total price vs quantity at a fixed unit price.",
    ],
    plot2d: {
      defaultView: STD_VIEW,
      curves: (p) => functionCurves((x) => p.k * x, STD_VIEW.xMin, STD_VIEW.xMax, { idPrefix: "line" }),
      markers: () => [{ x: 0, y: 0, label: "O", kind: "point" }],
    },
  }),

  /* 2. Linear function ------------------------------------------------- */
  defineModel({
    id: "linear",
    category: "functions",
    name: "Linear Function",
    description: "A straight line y = kx + b with adjustable slope and intercept.",
    visualizationType: "2d-function",
    formula: "y = kx + b",
    formulas: [
      { label: "Function", latex: "y = kx + b" },
      { label: "y-intercept", latex: "(0,\\, b)" },
      { label: "x-intercept", latex: "\\left(-\\dfrac{b}{k},\\, 0\\right)", description: "When k ≠ 0." },
    ],
    parameters: [
      { id: "k", label: "Slope", symbol: "k", defaultValue: 1, min: -5, max: 5, step: 0.1,
        explanation: "The slope: how fast y changes per unit x." },
      { id: "b", label: "y-intercept", symbol: "b", defaultValue: 2, min: -8, max: 8, step: 0.1,
        explanation: "Where the line crosses the y-axis." },
    ],
    explanation:
      "k controls the slope (steepness and direction) while b shifts the whole line up or down, setting where it crosses the y-axis. Changing b slides the line vertically without changing its tilt.",
    examples: [
      "Taxi fare = base fare + rate × distance.",
      "Temperature conversion: °F = 1.8·°C + 32.",
    ],
    plot2d: {
      defaultView: STD_VIEW,
      curves: (p) => functionCurves((x) => p.k * x + p.b, STD_VIEW.xMin, STD_VIEW.xMax, { idPrefix: "line" }),
      markers: (p) => {
        const m = [{ x: 0, y: p.b, label: `(0, ${round(p.b)})`, kind: "point" as const }];
        if (p.k !== 0) m.push({ x: -p.b / p.k, y: 0, label: "x-int", kind: "point" });
        return m;
      },
    },
  }),

  /* 3. Quadratic function --------------------------------------------- */
  defineModel({
    id: "quadratic",
    category: "functions",
    name: "Quadratic Function",
    description: "A parabola y = ax² + bx + c with vertex and axis of symmetry.",
    visualizationType: "2d-function",
    formula: "y = ax^2 + bx + c",
    formulas: [
      { label: "Function", latex: "y = ax^2 + bx + c" },
      { label: "Axis of symmetry", latex: "x = -\\dfrac{b}{2a}" },
      { label: "Vertex", latex: "\\left(-\\dfrac{b}{2a},\\; c - \\dfrac{b^2}{4a}\\right)" },
    ],
    parameters: [
      { id: "a", label: "a", symbol: "a", defaultValue: 1, min: -3, max: 3, step: 0.1,
        explanation: "Opening direction & width. a>0 opens up, a<0 opens down; larger |a| is narrower." },
      { id: "b", label: "b", symbol: "b", defaultValue: 0, min: -6, max: 6, step: 0.1,
        explanation: "Shifts the axis of symmetry left/right (together with a)." },
      { id: "c", label: "c", symbol: "c", defaultValue: -2, min: -8, max: 8, step: 0.1,
        explanation: "The y-intercept (value at x = 0)." },
    ],
    explanation:
      "The sign of a decides whether the parabola opens upward (a>0) or downward (a<0); the magnitude of a controls how narrow it is. The vertex is the turning point and the axis of symmetry is the vertical line through it. c is simply the height where the curve crosses the y-axis.",
    examples: [
      "Path of a thrown ball (projectile motion).",
      "Area of a rectangle as a function of one side with fixed perimeter.",
    ],
    plot2d: {
      defaultView: STD_VIEW,
      curves: (p) =>
        functionCurves((x) => p.a * x * x + p.b * x + p.c, STD_VIEW.xMin, STD_VIEW.xMax, {
          idPrefix: "parab",
          steps: 400,
        }),
      asymptotes: (p) =>
        p.a !== 0 ? [{ kind: "vertical", x: parabolaVertexX(p.a, p.b), label: "axis" }] : [],
      markers: (p) => {
        if (p.a === 0) return [];
        const vx = parabolaVertexX(p.a, p.b);
        const vy = p.a * vx * vx + p.b * vx + p.c;
        return [{ x: vx, y: vy, label: "vertex", kind: "point" }];
      },
    },
  }),

  /* 4. Inverse proportional function ---------------------------------- */
  defineModel({
    id: "inverse-proportional",
    category: "functions",
    name: "Inverse Proportional Function",
    description: "A hyperbola y = k/x with the axes as asymptotes.",
    visualizationType: "2d-function",
    formula: "y = \\dfrac{k}{x}",
    formulas: [
      { label: "Function", latex: "y = \\dfrac{k}{x}", description: "x ≠ 0." },
      { label: "Asymptotes", latex: "x = 0,\\quad y = 0" },
    ],
    parameters: [
      { id: "k", label: "Constant", symbol: "k", defaultValue: 3, min: -8, max: 8, step: 0.1,
        explanation: "k>0 puts the branches in quadrants I & III; k<0 in II & IV." },
    ],
    explanation:
      "As x grows the product xy stays equal to k, so y shrinks toward 0 — the curve hugs both axes (its asymptotes) but never touches them. The two branches sit in opposite quadrants depending on the sign of k.",
    examples: [
      "Speed vs travel time for a fixed distance.",
      "Pressure vs volume of a gas at constant temperature (Boyle's law).",
    ],
    plot2d: {
      defaultView: STD_VIEW,
      // maxJump prevents drawing a line across the x=0 asymptote between branches.
      curves: (p) =>
        functionCurves((x) => (x === 0 ? null : p.k / x), STD_VIEW.xMin, STD_VIEW.xMax, {
          idPrefix: "hyp",
          steps: 800,
          maxJump: 40,
        }),
      asymptotes: () => [
        { kind: "vertical", x: 0, label: "x = 0" },
        { kind: "horizontal", y: 0, label: "y = 0" },
      ],
    },
  }),

  /* 5. Absolute value function ---------------------------------------- */
  defineModel({
    id: "absolute-value",
    category: "functions",
    name: "Absolute Value Function",
    description: "A V-shaped graph y = a|x − h| + k.",
    visualizationType: "2d-function",
    formula: "y = a\\,|x - h| + k",
    formulas: [
      { label: "Basic", latex: "y = |x|" },
      { label: "Transformed", latex: "y = a\\,|x - h| + k" },
      { label: "Vertex", latex: "(h,\\, k)" },
    ],
    parameters: [
      { id: "a", label: "a", symbol: "a", defaultValue: 1, min: -3, max: 3, step: 0.1,
        explanation: "Steepness and direction of the V (a<0 makes it open downward)." },
      { id: "h", label: "h", symbol: "h", defaultValue: 0, min: -6, max: 6, step: 0.1,
        explanation: "Horizontal shift of the vertex." },
      { id: "k", label: "k", symbol: "k", defaultValue: 0, min: -6, max: 6, step: 0.1,
        explanation: "Vertical shift of the vertex." },
    ],
    explanation:
      "The absolute value forces all outputs above the vertex, producing a symmetric V. (h, k) is the corner of the V; a scales the arms and, if negative, flips the V upside-down.",
    examples: ["Distance from a target value.", "Error magnitude regardless of sign."],
    plot2d: {
      defaultView: STD_VIEW,
      curves: (p) =>
        functionCurves((x) => p.a * Math.abs(x - p.h) + p.k, STD_VIEW.xMin, STD_VIEW.xMax, {
          idPrefix: "abs",
        }),
      markers: (p) => [{ x: p.h, y: p.k, label: "vertex", kind: "point" }],
    },
  }),

  /* 6. Power function -------------------------------------------------- */
  defineModel({
    id: "power",
    category: "functions",
    name: "Power Function",
    description: "y = xᵃ — its shape depends on the exponent a.",
    visualizationType: "2d-function",
    formula: "y = x^{a}",
    formulas: [
      { label: "Function", latex: "y = x^{a}" },
      { label: "Note", latex: "x \\ge 0 \\text{ for non-integer } a", description: "Negative bases have no real value for fractional exponents." },
    ],
    parameters: [
      { id: "a", label: "Exponent", symbol: "a", defaultValue: 2, min: -3, max: 3, step: 0.1,
        explanation: "a=1 line, a=2 parabola, a=3 cubic, a=0.5 square root, a<0 hyperbola-like." },
    ],
    explanation:
      "A power function raises x to a fixed exponent. Integer exponents are defined for all x, but fractional exponents need x ≥ 0 to stay real, so the curve only appears on the right side there. Even exponents are symmetric about the y-axis; odd exponents are symmetric about the origin.",
    examples: ["Area ∝ side² (a = 2).", "Volume ∝ side³ (a = 3)."],
    plot2d: {
      defaultView: { xMin: -6, xMax: 6, yMin: -6, yMax: 6 },
      curves: (p) =>
        functionCurves((x) => safePow(x, p.a), -6, 6, { idPrefix: "pow", steps: 600, maxJump: 30 }),
    },
  }),

  /* 7. Exponential function ------------------------------------------- */
  defineModel({
    id: "exponential",
    category: "functions",
    name: "Exponential Function",
    description: "y = aˣ — rapid growth (a>1) or decay (0<a<1).",
    visualizationType: "2d-function",
    formula: "y = a^{x}",
    formulas: [
      { label: "Function", latex: "y = a^{x}", description: "a > 0, a ≠ 1." },
      { label: "Asymptote", latex: "y = 0" },
      { label: "Anchor point", latex: "(0,\\, 1)" },
    ],
    parameters: [
      { id: "a", label: "Base", symbol: "a", defaultValue: 2, min: 0.2, max: 4, step: 0.1,
        explanation: "a>1 grows; 0<a<1 decays. Every curve passes through (0, 1)." },
    ],
    explanation:
      "Exponential functions multiply by the base a for each step in x. When a>1 the output explodes upward; when 0<a<1 it decays toward the horizontal asymptote y = 0. All of them pass through (0, 1) because a⁰ = 1.",
    examples: ["Compound interest.", "Radioactive decay (0 < a < 1)."],
    plot2d: {
      defaultView: { xMin: -6, xMax: 6, yMin: -1, yMax: 10 },
      curves: (p) =>
        functionCurves((x) => safePow(p.a, x), -6, 6, { idPrefix: "exp", steps: 600, maxJump: 30 }),
      asymptotes: () => [{ kind: "horizontal", y: 0, label: "y = 0" }],
      markers: () => [{ x: 0, y: 1, label: "(0, 1)", kind: "point" }],
    },
  }),

  /* 8. Logarithmic function ------------------------------------------- */
  defineModel({
    id: "logarithmic",
    category: "functions",
    name: "Logarithmic Function",
    description: "y = logₐ(x) — the inverse of the exponential function.",
    visualizationType: "2d-function",
    formula: "y = \\log_{a}(x)",
    formulas: [
      { label: "Function", latex: "y = \\log_{a}(x)", description: "x > 0, a > 0, a ≠ 1." },
      { label: "Asymptote", latex: "x = 0" },
      { label: "Inverse of", latex: "y = a^{x}" },
    ],
    parameters: [
      { id: "a", label: "Base", symbol: "a", defaultValue: 2, min: 0.2, max: 4, step: 0.1,
        explanation: "a>1 rises; 0<a<1 falls. Every curve passes through (1, 0)." },
    ],
    explanation:
      "The logarithm answers 'a to what power gives x?'. It is the mirror image of y = aˣ across the line y = x, so its domain is x > 0 and it has a vertical asymptote at x = 0. All curves pass through (1, 0).",
    examples: ["pH scale.", "Decibel sound levels.", "Richter earthquake scale."],
    plot2d: {
      defaultView: { xMin: -1, xMax: 10, yMin: -5, yMax: 5 },
      curves: (p) =>
        functionCurves(
          (x) => (x > 0 && p.a > 0 && p.a !== 1 ? Math.log(x) / Math.log(p.a) : null),
          0.0001,
          10,
          { idPrefix: "log", steps: 600 },
        ),
      asymptotes: () => [{ kind: "vertical", x: 0, label: "x = 0" }],
      markers: () => [{ x: 1, y: 0, label: "(1, 0)", kind: "point" }],
    },
  }),

  /* 9. Sine function -------------------------------------------------- */
  defineModel({
    id: "sine",
    category: "functions",
    name: "Sine Function",
    description: "y = A·sin(Bx + C) + D with amplitude, period and shifts.",
    visualizationType: "2d-function",
    formula: "y = A\\sin(Bx + C) + D",
    formulas: [
      { label: "Basic", latex: "y = \\sin(x)" },
      { label: "Transformed", latex: "y = A\\sin(Bx + C) + D" },
      { label: "Amplitude", latex: "|A|" },
      { label: "Period", latex: "T = \\dfrac{2\\pi}{|B|}" },
      { label: "Phase shift", latex: "-\\dfrac{C}{B}" },
    ],
    parameters: [
      { id: "A", label: "Amplitude", symbol: "A", defaultValue: 1, min: -4, max: 4, step: 0.1,
        explanation: "Half the height between max and min." },
      { id: "B", label: "Frequency", symbol: "B", defaultValue: 1, min: 0.2, max: 4, step: 0.1,
        explanation: "Larger B squeezes the wave (shorter period)." },
      { id: "C", label: "Phase", symbol: "C", defaultValue: 0, min: -3.14, max: 3.14, step: 0.05,
        explanation: "Horizontal shift of the wave." },
      { id: "D", label: "Vertical shift", symbol: "D", defaultValue: 0, min: -4, max: 4, step: 0.1,
        explanation: "Moves the midline up or down." },
    ],
    explanation:
      "A stretches the wave vertically (amplitude); B compresses it horizontally, setting the period T = 2π/|B|; C slides it left/right (phase shift −C/B); D raises or lowers the midline.",
    examples: ["Sound waves.", "Alternating current.", "Tides and daylight hours over a year."],
    plot2d: {
      defaultView: { xMin: -6.5, xMax: 6.5, yMin: -6, yMax: 6 },
      curves: (p) =>
        functionCurves((x) => p.A * Math.sin(p.B * x + p.C) + p.D, -6.5, 6.5, {
          idPrefix: "sin",
          steps: 800,
        }),
      asymptotes: (p) => [{ kind: "horizontal", y: p.D, label: "midline" }],
    },
  }),

  /* 10. Cosine function ----------------------------------------------- */
  defineModel({
    id: "cosine",
    category: "functions",
    name: "Cosine Function",
    description: "y = A·cos(Bx + C) + D — a sine wave shifted by a quarter period.",
    visualizationType: "2d-function",
    formula: "y = A\\cos(Bx + C) + D",
    formulas: [
      { label: "Basic", latex: "y = \\cos(x)" },
      { label: "Transformed", latex: "y = A\\cos(Bx + C) + D" },
      { label: "Amplitude", latex: "|A|" },
      { label: "Period", latex: "T = \\dfrac{2\\pi}{|B|}" },
    ],
    parameters: [
      { id: "A", label: "Amplitude", symbol: "A", defaultValue: 1, min: -4, max: 4, step: 0.1,
        explanation: "Half the height between max and min." },
      { id: "B", label: "Frequency", symbol: "B", defaultValue: 1, min: 0.2, max: 4, step: 0.1,
        explanation: "Larger B squeezes the wave (shorter period)." },
      { id: "C", label: "Phase", symbol: "C", defaultValue: 0, min: -3.14, max: 3.14, step: 0.05,
        explanation: "Horizontal shift of the wave." },
      { id: "D", label: "Vertical shift", symbol: "D", defaultValue: 0, min: -4, max: 4, step: 0.1,
        explanation: "Moves the midline up or down." },
    ],
    explanation:
      "Cosine has the same shape as sine but starts at its maximum: cos(x) = sin(x + π/2). The parameters mean exactly the same things — amplitude A, period 2π/|B|, phase shift, and vertical shift D.",
    examples: ["Horizontal position of a point on a rotating wheel.", "Seasonal temperature cycles."],
    plot2d: {
      defaultView: { xMin: -6.5, xMax: 6.5, yMin: -6, yMax: 6 },
      curves: (p) =>
        functionCurves((x) => p.A * Math.cos(p.B * x + p.C) + p.D, -6.5, 6.5, {
          idPrefix: "cos",
          steps: 800,
        }),
      asymptotes: (p) => [{ kind: "horizontal", y: p.D, label: "midline" }],
    },
  }),

  /* 11. Tangent function ---------------------------------------------- */
  defineModel({
    id: "tangent",
    category: "functions",
    name: "Tangent Function",
    description: "y = A·tan(Bx + C) + D with repeating vertical asymptotes.",
    visualizationType: "2d-function",
    formula: "y = A\\tan(Bx + C) + D",
    formulas: [
      { label: "Basic", latex: "y = \\tan(x)" },
      { label: "Transformed", latex: "y = A\\tan(Bx + C) + D" },
      { label: "Period", latex: "T = \\dfrac{\\pi}{|B|}" },
      { label: "Asymptotes", latex: "Bx + C = \\tfrac{\\pi}{2} + n\\pi" },
    ],
    parameters: [
      { id: "A", label: "Vertical scale", symbol: "A", defaultValue: 1, min: -4, max: 4, step: 0.1,
        explanation: "Stretches the branches vertically." },
      { id: "B", label: "Frequency", symbol: "B", defaultValue: 1, min: 0.2, max: 3, step: 0.1,
        explanation: "Controls the spacing of the asymptotes (period π/|B|)." },
      { id: "C", label: "Phase", symbol: "C", defaultValue: 0, min: -3.14, max: 3.14, step: 0.05,
        explanation: "Horizontal shift." },
      { id: "D", label: "Vertical shift", symbol: "D", defaultValue: 0, min: -4, max: 4, step: 0.1,
        explanation: "Moves the curve up or down." },
    ],
    explanation:
      "Tangent repeats every π and shoots off to ±∞ at each asymptote, where cos = 0. The graph is drawn as separate branches — it is never connected across an asymptote. B sets how often the asymptotes occur.",
    examples: ["Slope of a line at a given angle.", "Modeling rapid blow-ups near a limit."],
    plot2d: {
      defaultView: { xMin: -6.5, xMax: 6.5, yMin: -8, yMax: 8 },
      // maxJump splits the polyline at each asymptote so branches stay separate.
      curves: (p) =>
        functionCurves((x) => p.A * Math.tan(p.B * x + p.C) + p.D, -6.5, 6.5, {
          idPrefix: "tan",
          steps: 1600,
          maxJump: 20,
        }),
      asymptotes: (p) => {
        const out: { kind: "vertical"; x: number }[] = [];
        // Solve B x + C = pi/2 + n pi  =>  x = (pi/2 + n pi - C) / B within view.
        for (let n = -8; n <= 8; n++) {
          const x = (Math.PI / 2 + n * Math.PI - p.C) / p.B;
          if (x >= -6.5 && x <= 6.5) out.push({ kind: "vertical", x });
        }
        return out;
      },
    },
  }),

  /* 12. Piecewise function -------------------------------------------- */
  defineModel({
    id: "piecewise",
    category: "functions",
    name: "Piecewise Function",
    description: "Different rules on different intervals, joined at a breakpoint.",
    visualizationType: "2d-function",
    formula: "f(x) = \\begin{cases} -x & x < 0 \\\\ x & x \\ge 0 \\end{cases}",
    formulas: [
      {
        label: "Definition",
        latex: "f(x) = \\begin{cases} -x, & x < 0 \\\\ x, & x \\ge 0 \\end{cases}",
        description: "Two linear rules meeting at x = 0.",
      },
    ],
    parameters: [
      { id: "scale", label: "Slope scale", symbol: "s", defaultValue: 1, min: 0.2, max: 3, step: 0.1,
        explanation: "Scales both arms so you can watch the pieces change together." },
    ],
    explanation:
      "A piecewise function applies a different formula on each interval of its domain. Here the left piece (x < 0) uses −sx and the right piece (x ≥ 0) uses sx. The two pieces are drawn separately and only meet at the breakpoint x = 0.",
    examples: ["Tax brackets.", "Shipping cost tiers by weight.", "Absolute value as two lines."],
    plot2d: {
      defaultView: STD_VIEW,
      curves: (p) => [
        ...functionCurves((x) => (x < 0 ? -p.scale * x : null), STD_VIEW.xMin, 0, { idPrefix: "left" }),
        ...functionCurves((x) => (x >= 0 ? p.scale * x : null), 0, STD_VIEW.xMax, { idPrefix: "right" }),
      ],
      markers: () => [{ x: 0, y: 0, label: "x = 0", kind: "point" }],
    },
  }),
];

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
