import type { MathModel } from "@/types/model";
import { defineModel } from "@/utils/formatFormula";
import {
  PI,
  regularPolygonArea,
  frustumVolume,
  hypot,
} from "@/math/formulas";
import { regularPolygon, rectanglePolygon, trianglePolygon } from "@/math/solidParts";

const BODY = "#60a5fa";

export const solidGeometryModels: MathModel[] = [
  /* 17. Cuboid -------------------------------------------------------- */
  defineModel({
    id: "cuboid",
    category: "solids",
    name: "Cuboid (Rectangular Prism)",
    description: "A box with length, width and height.",
    visualizationType: "3d-solid",
    formula: "V = lwh",
    formulas: [
      { label: "Surface area", latex: "S = 2(lw + lh + wh)" },
      { label: "Volume", latex: "V = lwh" },
      { label: "Space diagonal", latex: "d = \\sqrt{l^2 + w^2 + h^2}" },
    ],
    parameters: [
      { id: "l", label: "Length", symbol: "l", defaultValue: 4, min: 0.5, max: 8, step: 0.1, unit: "u",
        explanation: "Size along the x-axis." },
      { id: "w", label: "Width", symbol: "w", defaultValue: 3, min: 0.5, max: 8, step: 0.1, unit: "u",
        explanation: "Size along the z-axis." },
      { id: "h", label: "Height", symbol: "h", defaultValue: 2, min: 0.5, max: 8, step: 0.1, unit: "u",
        explanation: "Size along the y-axis." },
    ],
    explanation:
      "A cuboid has three pairs of identical rectangular faces. Its volume multiplies the three edge lengths; its surface area sums the areas of all six faces.",
    examples: ["Bricks and boxes.", "Rooms and buildings.", "Aquariums."],
    properties: [
      { label: "Surface area", symbol: "S", unit: "u²", latex: "2(lw+lh+wh)",
        compute: (p) => 2 * (p.l * p.w + p.l * p.h + p.w * p.h) },
      { label: "Volume", symbol: "V", unit: "u³", latex: "lwh", compute: (p) => p.l * p.w * p.h },
    ],
    solid3d: {
      build: (p) => ({
        parts: [{ type: "box", size: [p.l, p.h, p.w], color: BODY }],
        labels: [
          { position: [0, -p.h / 2 - 0.4, p.w / 2 + 0.2], text: `l = ${p.l}` },
          { position: [p.l / 2 + 0.4, -p.h / 2 - 0.2, 0], text: `w = ${p.w}` },
          { position: [p.l / 2 + 0.4, 0, p.w / 2 + 0.2], text: `h = ${p.h}` },
        ],
      }),
    },
  }),

  /* 18. Cube ---------------------------------------------------------- */
  defineModel({
    id: "cube",
    category: "solids",
    name: "Cube",
    description: "A cuboid with all edges equal.",
    visualizationType: "3d-solid",
    formula: "V = a^3",
    formulas: [
      { label: "Surface area", latex: "S = 6a^2" },
      { label: "Volume", latex: "V = a^3" },
      { label: "Space diagonal", latex: "d = a\\sqrt{3}" },
    ],
    parameters: [
      { id: "a", label: "Edge", symbol: "a", defaultValue: 3, min: 0.5, max: 8, step: 0.1, unit: "u",
        explanation: "Length of every edge." },
    ],
    explanation:
      "A cube is the most symmetric cuboid: all 12 edges are equal and all 6 faces are congruent squares. Doubling the edge multiplies the volume by 8.",
    examples: ["Dice.", "Rubik's cube.", "Sugar cubes."],
    properties: [
      { label: "Surface area", symbol: "S", unit: "u²", latex: "6a^2", compute: (p) => 6 * p.a * p.a },
      { label: "Volume", symbol: "V", unit: "u³", latex: "a^3", compute: (p) => p.a ** 3 },
    ],
    solid3d: {
      build: (p) => ({
        parts: [{ type: "box", size: [p.a, p.a, p.a], color: BODY }],
        labels: [{ position: [0, -p.a / 2 - 0.4, p.a / 2 + 0.2], text: `a = ${p.a}` }],
      }),
    },
  }),

  /* 19. Cylinder ------------------------------------------------------ */
  defineModel({
    id: "cylinder",
    category: "solids",
    name: "Cylinder",
    description: "Two circular bases joined by a curved surface.",
    visualizationType: "3d-solid",
    formula: "V = \\pi r^2 h",
    formulas: [
      { label: "Base area", latex: "B = \\pi r^2" },
      { label: "Lateral area", latex: "L = 2\\pi r h" },
      { label: "Surface area", latex: "S = 2\\pi r^2 + 2\\pi r h" },
      { label: "Volume", latex: "V = \\pi r^2 h" },
    ],
    parameters: [
      { id: "r", label: "Radius", symbol: "r", defaultValue: 2, min: 0.5, max: 5, step: 0.1, unit: "u",
        explanation: "Radius of the circular base." },
      { id: "h", label: "Height", symbol: "h", defaultValue: 4, min: 0.5, max: 8, step: 0.1, unit: "u",
        explanation: "Distance between the two bases." },
    ],
    explanation:
      "Unrolling a cylinder's curved side gives a rectangle of width 2πr and height h, which is why the lateral area is 2πrh. Adding the two circular ends gives the total surface area.",
    examples: ["Cans and pipes.", "Drinking glasses.", "Roller drums."],
    properties: [
      { label: "Base area", symbol: "B", unit: "u²", latex: "\\pi r^2", compute: (p) => PI * p.r * p.r },
      { label: "Lateral area", symbol: "L", unit: "u²", latex: "2\\pi r h", compute: (p) => 2 * PI * p.r * p.h },
      { label: "Surface area", symbol: "S", unit: "u²", latex: "2\\pi r^2 + 2\\pi r h",
        compute: (p) => 2 * PI * p.r * p.r + 2 * PI * p.r * p.h },
      { label: "Volume", symbol: "V", unit: "u³", latex: "\\pi r^2 h", compute: (p) => PI * p.r * p.r * p.h },
    ],
    solid3d: {
      build: (p) => ({
        parts: [{ type: "cylinder", radiusTop: p.r, radiusBottom: p.r, height: p.h, radialSegments: 48, color: BODY }],
        labels: [
          { position: [p.r + 0.3, -p.h / 2, 0], text: `r = ${p.r}` },
          { position: [p.r + 0.4, 0, 0], text: `h = ${p.h}` },
        ],
      }),
    },
  }),

  /* 20. Triangular prism --------------------------------------------- */
  defineModel({
    id: "triangular-prism",
    category: "solids",
    name: "Triangular Prism",
    description: "A triangle swept along its length.",
    visualizationType: "3d-solid",
    formula: "V = B\\,H",
    formulas: [
      { label: "Base area", latex: "B = \\tfrac{1}{2}\\,b\\,h_t" },
      { label: "Volume", latex: "V = B \\cdot H" },
    ],
    parameters: [
      { id: "b", label: "Triangle base", symbol: "b", defaultValue: 3, min: 0.5, max: 7, step: 0.1, unit: "u",
        explanation: "Base length of the triangular cross-section." },
      { id: "ht", label: "Triangle height", symbol: "h_t", defaultValue: 3, min: 0.5, max: 7, step: 0.1, unit: "u",
        explanation: "Height of the triangular cross-section." },
      { id: "H", label: "Prism length", symbol: "H", defaultValue: 4, min: 0.5, max: 8, step: 0.1, unit: "u",
        explanation: "How far the triangle is swept." },
    ],
    explanation:
      "A prism keeps the same cross-section all along its length, so its volume is simply the base area times the length. Here the base is a triangle of area ½·b·hₜ.",
    examples: ["Toblerone bars.", "Roof trusses.", "Optical glass prisms."],
    properties: [
      { label: "Base area", symbol: "B", unit: "u²", latex: "\\tfrac{1}{2} b\\,h_t", compute: (p) => 0.5 * p.b * p.ht },
      { label: "Volume", symbol: "V", unit: "u³", latex: "B\\,H", compute: (p) => 0.5 * p.b * p.ht * p.H },
    ],
    solid3d: {
      build: (p) => ({
        parts: [{ type: "prism", base: trianglePolygon(p.b, p.ht), height: p.H, color: BODY }],
        labels: [
          { position: [0, -p.H / 2 - 0.4, 0], text: `b = ${p.b}` },
          { position: [p.b / 2 + 0.4, 0, 0], text: `H = ${p.H}` },
        ],
      }),
    },
  }),

  /* 21. Quadrangular prism ------------------------------------------- */
  defineModel({
    id: "quadrangular-prism",
    category: "solids",
    name: "Quadrangular Prism",
    description: "A rectangular base swept into a prism.",
    visualizationType: "3d-solid",
    formula: "V = B\\,H",
    formulas: [
      { label: "Base area", latex: "B = lw" },
      { label: "Volume", latex: "V = B \\cdot H" },
    ],
    parameters: [
      { id: "l", label: "Base length", symbol: "l", defaultValue: 3, min: 0.5, max: 7, step: 0.1, unit: "u",
        explanation: "Length of the rectangular base." },
      { id: "w", label: "Base width", symbol: "w", defaultValue: 2, min: 0.5, max: 7, step: 0.1, unit: "u",
        explanation: "Width of the rectangular base." },
      { id: "H", label: "Prism height", symbol: "H", defaultValue: 4, min: 0.5, max: 8, step: 0.1, unit: "u",
        explanation: "Height of the prism." },
    ],
    explanation:
      "A quadrangular prism has a rectangular (quadrilateral) base. Like every prism its volume is the base area times the height. With a rectangular base this is the same as a cuboid: B = lw.",
    examples: ["Beams and posts.", "Packaging boxes.", "Building columns."],
    properties: [
      { label: "Base area", symbol: "B", unit: "u²", latex: "lw", compute: (p) => p.l * p.w },
      { label: "Volume", symbol: "V", unit: "u³", latex: "B\\,H", compute: (p) => p.l * p.w * p.H },
    ],
    solid3d: {
      build: (p) => ({
        parts: [{ type: "prism", base: rectanglePolygon(p.l, p.w), height: p.H, color: BODY }],
        labels: [
          { position: [0, -p.H / 2 - 0.4, p.w / 2 + 0.2], text: `l = ${p.l}` },
          { position: [p.l / 2 + 0.4, 0, 0], text: `H = ${p.H}` },
        ],
      }),
    },
  }),

  /* 22. Pentagonal prism --------------------------------------------- */
  defineModel({
    id: "pentagonal-prism",
    category: "solids",
    name: "Pentagonal Prism",
    description: "A regular pentagon swept into a prism.",
    visualizationType: "3d-solid",
    formula: "V = B\\,h",
    formulas: [
      { label: "Base area", latex: "B = \\dfrac{n a^2}{4\\tan(\\pi/n)},\\; n=5" },
      { label: "Volume", latex: "V = B \\cdot h" },
    ],
    parameters: [
      { id: "a", label: "Side length", symbol: "a", defaultValue: 2, min: 0.5, max: 5, step: 0.1, unit: "u",
        explanation: "Side length of the regular pentagon." },
      { id: "h", label: "Prism height", symbol: "h", defaultValue: 4, min: 0.5, max: 8, step: 0.1, unit: "u",
        explanation: "Height of the prism." },
    ],
    explanation:
      "The base is a regular pentagon, whose area uses the general regular-polygon formula with n = 5. Multiplying by the height gives the prism's volume.",
    examples: ["Pencils with a pentagonal cross-section.", "Some nuts and bolts.", "Architectural columns."],
    properties: [
      { label: "Base area", symbol: "B", unit: "u²", latex: "\\dfrac{5a^2}{4\\tan(36°)}",
        compute: (p) => regularPolygonArea(5, p.a) },
      { label: "Volume", symbol: "V", unit: "u³", latex: "B\\,h", compute: (p) => regularPolygonArea(5, p.a) * p.h },
    ],
    solid3d: {
      build: (p) => ({
        parts: [{ type: "prism", base: regularPolygon(5, p.a), height: p.h, color: BODY }],
        labels: [{ position: [0, p.h / 2 + 0.4, 0], text: `a = ${p.a}` }],
      }),
    },
  }),

  /* 23. Hexagonal prism ---------------------------------------------- */
  defineModel({
    id: "hexagonal-prism",
    category: "solids",
    name: "Hexagonal Prism",
    description: "A regular hexagon swept into a prism.",
    visualizationType: "3d-solid",
    formula: "V = B\\,h",
    formulas: [
      { label: "Base area", latex: "B = \\dfrac{3\\sqrt{3}}{2}\\,a^2" },
      { label: "Volume", latex: "V = B \\cdot h" },
    ],
    parameters: [
      { id: "a", label: "Side length", symbol: "a", defaultValue: 2, min: 0.5, max: 5, step: 0.1, unit: "u",
        explanation: "Side length of the regular hexagon." },
      { id: "h", label: "Prism height", symbol: "h", defaultValue: 4, min: 0.5, max: 8, step: 0.1, unit: "u",
        explanation: "Height of the prism." },
    ],
    explanation:
      "A regular hexagon is six equilateral triangles, giving the tidy base-area formula (3√3/2)·a². Hexagonal prisms tile space efficiently, which is why bees build hexagonal cells.",
    examples: ["Pencils.", "Honeycomb cells.", "Nuts and bolts."],
    properties: [
      { label: "Base area", symbol: "B", unit: "u²", latex: "\\tfrac{3\\sqrt3}{2}a^2",
        compute: (p) => (3 * Math.sqrt(3) / 2) * p.a * p.a },
      { label: "Volume", symbol: "V", unit: "u³", latex: "B\\,h",
        compute: (p) => (3 * Math.sqrt(3) / 2) * p.a * p.a * p.h },
    ],
    solid3d: {
      build: (p) => ({
        parts: [{ type: "prism", base: regularPolygon(6, p.a), height: p.h, color: BODY }],
        labels: [{ position: [0, p.h / 2 + 0.4, 0], text: `a = ${p.a}` }],
      }),
    },
  }),

  /* 24. Triangular pyramid (tetrahedron) ----------------------------- */
  defineModel({
    id: "triangular-pyramid",
    category: "solids",
    name: "Triangular Pyramid",
    description: "A regular triangular base tapering to an apex.",
    visualizationType: "3d-solid",
    formula: "V = \\tfrac{1}{3} B h",
    formulas: [
      { label: "Base area", latex: "B = \\dfrac{\\sqrt{3}}{4} a^2" },
      { label: "Volume", latex: "V = \\tfrac{1}{3} B h" },
    ],
    parameters: [
      { id: "a", label: "Base side", symbol: "a", defaultValue: 3, min: 0.5, max: 6, step: 0.1, unit: "u",
        explanation: "Side length of the equilateral base." },
      { id: "h", label: "Height", symbol: "h", defaultValue: 4, min: 0.5, max: 8, step: 0.1, unit: "u",
        explanation: "Perpendicular height from base to apex." },
    ],
    explanation:
      "A pyramid's volume is always one third of the prism with the same base and height. Here the base is an equilateral triangle of area (√3/4)·a².",
    examples: ["Tetrahedral dice (d4).", "Molecular shapes (methane).", "Pyramid roofs."],
    properties: [
      { label: "Base area", symbol: "B", unit: "u²", latex: "\\tfrac{\\sqrt3}{4}a^2",
        compute: (p) => (Math.sqrt(3) / 4) * p.a * p.a },
      { label: "Volume", symbol: "V", unit: "u³", latex: "\\tfrac{1}{3}Bh",
        compute: (p) => (1 / 3) * (Math.sqrt(3) / 4) * p.a * p.a * p.h },
    ],
    solid3d: {
      build: (p) => ({
        parts: [{ type: "pyramid", base: regularPolygon(3, p.a), height: p.h, color: BODY }],
        labels: [
          { position: [0, -p.h / 2 - 0.4, 0], text: `a = ${p.a}` },
          { position: [0.4, 0, 0], text: `h = ${p.h}` },
        ],
      }),
    },
  }),

  /* 25. Quadrangular pyramid ----------------------------------------- */
  defineModel({
    id: "quadrangular-pyramid",
    category: "solids",
    name: "Quadrangular Pyramid",
    description: "A rectangular base tapering to an apex.",
    visualizationType: "3d-solid",
    formula: "V = \\tfrac{1}{3} B h",
    formulas: [
      { label: "Base area", latex: "B = lw" },
      { label: "Volume", latex: "V = \\tfrac{1}{3} B h" },
    ],
    parameters: [
      { id: "l", label: "Base length", symbol: "l", defaultValue: 3, min: 0.5, max: 6, step: 0.1, unit: "u",
        explanation: "Length of the rectangular base." },
      { id: "w", label: "Base width", symbol: "w", defaultValue: 3, min: 0.5, max: 6, step: 0.1, unit: "u",
        explanation: "Width of the rectangular base." },
      { id: "h", label: "Height", symbol: "h", defaultValue: 4, min: 0.5, max: 8, step: 0.1, unit: "u",
        explanation: "Perpendicular height from base to apex." },
    ],
    explanation:
      "This is the classic 'Egyptian' pyramid shape: a rectangular base rising to a single apex. Its volume is one third of the matching cuboid (base area × height).",
    examples: ["The Great Pyramid of Giza.", "Pyramid-shaped roofs.", "Tent shapes."],
    properties: [
      { label: "Base area", symbol: "B", unit: "u²", latex: "lw", compute: (p) => p.l * p.w },
      { label: "Volume", symbol: "V", unit: "u³", latex: "\\tfrac{1}{3}lwh", compute: (p) => (1 / 3) * p.l * p.w * p.h },
    ],
    solid3d: {
      build: (p) => ({
        parts: [{ type: "pyramid", base: rectanglePolygon(p.l, p.w), height: p.h, color: BODY }],
        labels: [
          { position: [0, -p.h / 2 - 0.4, p.w / 2 + 0.2], text: `l = ${p.l}` },
          { position: [0.4, 0, 0], text: `h = ${p.h}` },
        ],
      }),
    },
  }),

  /* 26. Pentagonal pyramid ------------------------------------------- */
  defineModel({
    id: "pentagonal-pyramid",
    category: "solids",
    name: "Pentagonal Pyramid",
    description: "A regular pentagon base tapering to an apex.",
    visualizationType: "3d-solid",
    formula: "V = \\tfrac{1}{3} B h",
    formulas: [
      { label: "Base area", latex: "B = \\dfrac{5a^2}{4\\tan(36°)}" },
      { label: "Volume", latex: "V = \\tfrac{1}{3} B h" },
    ],
    parameters: [
      { id: "a", label: "Side length", symbol: "a", defaultValue: 2, min: 0.5, max: 5, step: 0.1, unit: "u",
        explanation: "Side length of the regular pentagon base." },
      { id: "h", label: "Height", symbol: "h", defaultValue: 4, min: 0.5, max: 8, step: 0.1, unit: "u",
        explanation: "Perpendicular height from base to apex." },
    ],
    explanation:
      "A pyramid on a regular pentagon. The base area uses the regular-polygon formula with n = 5; the volume is one third of base area times height, like every pyramid.",
    examples: ["Decorative spires.", "Crystal forms.", "Game dice variants."],
    properties: [
      { label: "Base area", symbol: "B", unit: "u²", latex: "\\dfrac{5a^2}{4\\tan(36°)}",
        compute: (p) => regularPolygonArea(5, p.a) },
      { label: "Volume", symbol: "V", unit: "u³", latex: "\\tfrac{1}{3}Bh",
        compute: (p) => (1 / 3) * regularPolygonArea(5, p.a) * p.h },
    ],
    solid3d: {
      build: (p) => ({
        parts: [{ type: "pyramid", base: regularPolygon(5, p.a), height: p.h, color: BODY }],
        labels: [{ position: [0.4, 0, 0], text: `h = ${p.h}` }],
      }),
    },
  }),

  /* 27. Hexagonal pyramid -------------------------------------------- */
  defineModel({
    id: "hexagonal-pyramid",
    category: "solids",
    name: "Hexagonal Pyramid",
    description: "A regular hexagon base tapering to an apex.",
    visualizationType: "3d-solid",
    formula: "V = \\tfrac{1}{3} B h",
    formulas: [
      { label: "Base area", latex: "B = \\dfrac{3\\sqrt{3}}{2} a^2" },
      { label: "Volume", latex: "V = \\tfrac{1}{3} B h" },
    ],
    parameters: [
      { id: "a", label: "Side length", symbol: "a", defaultValue: 2, min: 0.5, max: 5, step: 0.1, unit: "u",
        explanation: "Side length of the regular hexagon base." },
      { id: "h", label: "Height", symbol: "h", defaultValue: 4, min: 0.5, max: 8, step: 0.1, unit: "u",
        explanation: "Perpendicular height from base to apex." },
    ],
    explanation:
      "A pyramid on a regular hexagonal base. As always for pyramids, V = ⅓·B·h, with B the hexagon area (3√3/2)·a².",
    examples: ["Pencil tips.", "Spires and finials.", "Crystal terminations."],
    properties: [
      { label: "Base area", symbol: "B", unit: "u²", latex: "\\tfrac{3\\sqrt3}{2}a^2",
        compute: (p) => (3 * Math.sqrt(3) / 2) * p.a * p.a },
      { label: "Volume", symbol: "V", unit: "u³", latex: "\\tfrac{1}{3}Bh",
        compute: (p) => (1 / 3) * (3 * Math.sqrt(3) / 2) * p.a * p.a * p.h },
    ],
    solid3d: {
      build: (p) => ({
        parts: [{ type: "pyramid", base: regularPolygon(6, p.a), height: p.h, color: BODY }],
        labels: [{ position: [0.4, 0, 0], text: `h = ${p.h}` }],
      }),
    },
  }),

  /* 28. Cone ---------------------------------------------------------- */
  defineModel({
    id: "cone",
    category: "solids",
    name: "Cone",
    description: "A circular base tapering to a point.",
    visualizationType: "3d-solid",
    formula: "V = \\tfrac{1}{3}\\pi r^2 h",
    formulas: [
      { label: "Base area", latex: "B = \\pi r^2" },
      { label: "Slant height", latex: "l = \\sqrt{r^2 + h^2}" },
      { label: "Lateral area", latex: "L = \\pi r l" },
      { label: "Surface area", latex: "S = \\pi r^2 + \\pi r l" },
      { label: "Volume", latex: "V = \\tfrac{1}{3}\\pi r^2 h" },
    ],
    parameters: [
      { id: "r", label: "Radius", symbol: "r", defaultValue: 2, min: 0.5, max: 5, step: 0.1, unit: "u",
        explanation: "Radius of the circular base." },
      { id: "h", label: "Height", symbol: "h", defaultValue: 4, min: 0.5, max: 8, step: 0.1, unit: "u",
        explanation: "Perpendicular height from base to apex." },
    ],
    explanation:
      "A cone is a pyramid with a circular base, so its volume is also one third of the matching cylinder. The slant height l (not the vertical height) is what determines the curved lateral surface area πrl.",
    examples: ["Ice-cream cones.", "Traffic cones.", "Funnels."],
    properties: [
      { label: "Base area", symbol: "B", unit: "u²", latex: "\\pi r^2", compute: (p) => PI * p.r * p.r },
      { label: "Slant height", symbol: "l", unit: "u", latex: "\\sqrt{r^2+h^2}", compute: (p) => hypot(p.r, p.h) },
      { label: "Lateral area", symbol: "L", unit: "u²", latex: "\\pi r l", compute: (p) => PI * p.r * hypot(p.r, p.h) },
      { label: "Surface area", symbol: "S", unit: "u²", latex: "\\pi r^2 + \\pi r l",
        compute: (p) => PI * p.r * p.r + PI * p.r * hypot(p.r, p.h) },
      { label: "Volume", symbol: "V", unit: "u³", latex: "\\tfrac{1}{3}\\pi r^2 h",
        compute: (p) => (1 / 3) * PI * p.r * p.r * p.h },
    ],
    solid3d: {
      build: (p) => ({
        parts: [{ type: "cylinder", radiusTop: 0, radiusBottom: p.r, height: p.h, radialSegments: 48, color: BODY }],
        labels: [
          { position: [p.r + 0.3, -p.h / 2, 0], text: `r = ${p.r}` },
          { position: [0.3, 0, 0], text: `h = ${p.h}` },
        ],
      }),
    },
  }),

  /* 29. Sphere -------------------------------------------------------- */
  defineModel({
    id: "sphere",
    category: "solids",
    name: "Sphere",
    description: "All points at distance r from a center, in 3D.",
    visualizationType: "3d-solid",
    formula: "V = \\tfrac{4}{3}\\pi r^3",
    formulas: [
      { label: "Surface area", latex: "S = 4\\pi r^2" },
      { label: "Volume", latex: "V = \\tfrac{4}{3}\\pi r^3" },
    ],
    parameters: [
      { id: "r", label: "Radius", symbol: "r", defaultValue: 2.5, min: 0.5, max: 5, step: 0.1, unit: "u",
        explanation: "Distance from the center to the surface." },
    ],
    explanation:
      "A sphere is the 3D analogue of a circle. Its surface area is exactly four times the area of its 'shadow' circle (4πr²), and its volume grows with the cube of the radius.",
    examples: ["Balls and planets.", "Bubbles.", "Ball bearings."],
    properties: [
      { label: "Surface area", symbol: "S", unit: "u²", latex: "4\\pi r^2", compute: (p) => 4 * PI * p.r * p.r },
      { label: "Volume", symbol: "V", unit: "u³", latex: "\\tfrac{4}{3}\\pi r^3", compute: (p) => (4 / 3) * PI * p.r ** 3 },
    ],
    solid3d: {
      build: (p) => ({
        parts: [{ type: "sphere", radius: p.r, color: BODY }],
        labels: [{ position: [p.r + 0.3, 0, 0], text: `r = ${p.r}` }],
      }),
    },
  }),

  /* 30. Frustum of a cone -------------------------------------------- */
  defineModel({
    id: "cone-frustum",
    category: "solids",
    name: "Frustum of a Cone",
    description: "A cone with its tip sliced off parallel to the base.",
    visualizationType: "3d-solid",
    formula: "V = \\tfrac{1}{3}\\pi h (R^2 + Rr + r^2)",
    formulas: [
      { label: "Slant height", latex: "l = \\sqrt{(R-r)^2 + h^2}" },
      { label: "Lateral area", latex: "L = \\pi (R + r) l" },
      { label: "Surface area", latex: "S = \\pi R^2 + \\pi r^2 + \\pi(R+r)l" },
      { label: "Volume", latex: "V = \\tfrac{1}{3}\\pi h (R^2 + Rr + r^2)" },
    ],
    parameters: [
      { id: "R", label: "Bottom radius", symbol: "R", defaultValue: 3, min: 0.5, max: 5, step: 0.1, unit: "u",
        explanation: "Radius of the larger (bottom) circle." },
      { id: "r", label: "Top radius", symbol: "r", defaultValue: 1.5, min: 0.2, max: 5, step: 0.1, unit: "u",
        explanation: "Radius of the smaller (top) circle." },
      { id: "h", label: "Height", symbol: "h", defaultValue: 3.5, min: 0.5, max: 8, step: 0.1, unit: "u",
        explanation: "Vertical distance between the two circles." },
    ],
    explanation:
      "A frustum is what remains of a cone after the top is cut off parallel to the base. Its volume blends the two radii with the cross-term Rr. The slant height uses the difference R − r, not R + r.",
    examples: ["Buckets and lampshades.", "Drinking cups.", "Cooling towers (lower part)."],
    properties: [
      { label: "Slant height", symbol: "l", unit: "u", latex: "\\sqrt{(R-r)^2+h^2}",
        compute: (p) => hypot(p.R - p.r, p.h) },
      { label: "Lateral area", symbol: "L", unit: "u²", latex: "\\pi(R+r)l",
        compute: (p) => PI * (p.R + p.r) * hypot(p.R - p.r, p.h) },
      { label: "Surface area", symbol: "S", unit: "u²", latex: "\\pi R^2+\\pi r^2+\\pi(R+r)l",
        compute: (p) => PI * p.R * p.R + PI * p.r * p.r + PI * (p.R + p.r) * hypot(p.R - p.r, p.h) },
      { label: "Volume", symbol: "V", unit: "u³", latex: "\\tfrac{1}{3}\\pi h(R^2+Rr+r^2)",
        compute: (p) => (1 / 3) * PI * p.h * (p.R * p.R + p.R * p.r + p.r * p.r) },
    ],
    solid3d: {
      build: (p) => ({
        parts: [{ type: "cylinder", radiusTop: p.r, radiusBottom: p.R, height: p.h, radialSegments: 48, color: BODY }],
        labels: [
          { position: [p.R + 0.3, -p.h / 2, 0], text: `R = ${p.R}` },
          { position: [p.r + 0.3, p.h / 2, 0], text: `r = ${p.r}` },
        ],
      }),
    },
  }),

  /* 31. Frustum of a pyramid ----------------------------------------- */
  defineModel({
    id: "pyramid-frustum",
    category: "solids",
    name: "Frustum of a Pyramid",
    description: "A regular polygonal pyramid with its top sliced off.",
    visualizationType: "3d-solid",
    formula: "V = \\tfrac{h}{3}\\left(B_1 + B_2 + \\sqrt{B_1 B_2}\\right)",
    formulas: [
      { label: "Volume", latex: "V = \\tfrac{h}{3}\\left(B_1 + B_2 + \\sqrt{B_1 B_2}\\right)" },
      { label: "Bases", latex: "B_1,\\, B_2 \\text{ are the two parallel base areas}" },
    ],
    parameters: [
      { id: "n", label: "Number of sides", symbol: "n", defaultValue: 4, min: 3, max: 8, step: 1,
        explanation: "Number of sides of the regular polygon base." },
      { id: "aBottom", label: "Bottom side", symbol: "a_1", defaultValue: 3, min: 0.5, max: 6, step: 0.1, unit: "u",
        explanation: "Side length of the larger (bottom) polygon." },
      { id: "aTop", label: "Top side", symbol: "a_2", defaultValue: 1.5, min: 0.2, max: 6, step: 0.1, unit: "u",
        explanation: "Side length of the smaller (top) polygon." },
      { id: "h", label: "Height", symbol: "h", defaultValue: 3.5, min: 0.5, max: 8, step: 0.1, unit: "u",
        explanation: "Vertical distance between the two bases." },
    ],
    explanation:
      "Slicing the top off a pyramid parallel to its base leaves a frustum with two similar polygonal faces. The volume formula averages the two base areas B₁ and B₂ together with their geometric mean √(B₁B₂).",
    examples: ["Lampshades.", "Plant pots.", "Stepped building tops."],
    properties: [
      { label: "Bottom base area", symbol: "B_1", unit: "u²", latex: "\\dfrac{n a_1^2}{4\\tan(\\pi/n)}",
        compute: (p) => regularPolygonArea(p.n, p.aBottom) },
      { label: "Top base area", symbol: "B_2", unit: "u²", latex: "\\dfrac{n a_2^2}{4\\tan(\\pi/n)}",
        compute: (p) => regularPolygonArea(p.n, p.aTop) },
      { label: "Volume", symbol: "V", unit: "u³", latex: "\\tfrac{h}{3}(B_1+B_2+\\sqrt{B_1 B_2})",
        compute: (p) =>
          frustumVolume(regularPolygonArea(p.n, p.aBottom), regularPolygonArea(p.n, p.aTop), p.h) },
    ],
    solid3d: {
      build: (p) => {
        const n = Math.round(p.n);
        return {
          parts: [
            {
              type: "pyramid",
              base: regularPolygon(n, p.aBottom),
              height: p.h,
              topScale: p.aTop / p.aBottom,
              color: BODY,
            },
          ],
          labels: [
            { position: [0, -p.h / 2 - 0.4, 0], text: `a₁ = ${p.aBottom}` },
            { position: [0, p.h / 2 + 0.4, 0], text: `a₂ = ${p.aTop}` },
          ],
        };
      },
    },
  }),
];
