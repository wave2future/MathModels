import type { MathModel, SolidPart } from "@/types/model";
import { defineModel } from "@/utils/formatFormula";
import { PI } from "@/math/formulas";
import { trianglePolygon } from "@/math/solidParts";

const HALF_PI = Math.PI / 2;

export const combinedSolidModels: MathModel[] = [
  /* 32a. House -------------------------------------------------------- */
  defineModel({
    id: "house",
    category: "combined",
    name: "House",
    chineseName: "房子模型",
    description: "A cuboid body with a triangular-prism roof.",
    visualizationType: "combined-solid",
    formula: "V = V_{body} + V_{roof}",
    formulas: [
      { label: "Body (cuboid)", latex: "V_{body} = l\\,w\\,h" },
      { label: "Roof (triangular prism)", latex: "V_{roof} = \\tfrac{1}{2}\\,l\\,h_r\\,w" },
      { label: "Total", latex: "V = V_{body} + V_{roof}" },
    ],
    parameters: [
      { id: "l", label: "Length", symbol: "l", defaultValue: 4, min: 1, max: 8, step: 0.1, unit: "u",
        explanation: "Width of the house (and roof span)." },
      { id: "w", label: "Depth", symbol: "w", defaultValue: 3, min: 1, max: 8, step: 0.1, unit: "u",
        explanation: "Depth of the house." },
      { id: "h", label: "Wall height", symbol: "h", defaultValue: 3, min: 0.5, max: 6, step: 0.1, unit: "u",
        explanation: "Height of the cuboid walls." },
      { id: "hr", label: "Roof height", symbol: "h_r", defaultValue: 2, min: 0.5, max: 5, step: 0.1, unit: "u",
        explanation: "Height of the triangular roof." },
    ],
    explanation:
      "To find the volume of a combined solid, split it into basic solids, compute each, then add. A house is a cuboid (the walls) plus a triangular prism (the roof). Add the two volumes for the total; the contact face where they meet is internal and is not part of the outside surface.",
    examples: ["Simple house and shed shapes.", "Barns.", "Birdhouses."],
    properties: [
      { label: "Body volume", symbol: "V_b", unit: "u³", latex: "lwh", compute: (p) => p.l * p.w * p.h },
      { label: "Roof volume", symbol: "V_r", unit: "u³", latex: "\\tfrac12 l h_r w", compute: (p) => 0.5 * p.l * p.hr * p.w },
      { label: "Total volume", symbol: "V", unit: "u³", latex: "V_b + V_r",
        compute: (p) => p.l * p.w * p.h + 0.5 * p.l * p.hr * p.w },
    ],
    solid3d: {
      build: (p) => ({
        parts: [
          { type: "box", size: [p.l, p.h, p.w], color: "#e0c9a6", name: "body" },
          // Triangular prism roof: build a vertical triangular prism (triangle in XZ,
          // extruded along Y by the house depth), then rotate -90° about X so it lies
          // horizontally on top of the walls.
          {
            type: "prism",
            base: trianglePolygon(p.l, p.hr),
            height: p.w,
            rotation: [-HALF_PI, 0, 0],
            position: [0, p.h / 2 + p.hr / 2, 0],
            color: "#c0573e",
            name: "roof",
          },
        ],
      }),
    },
  }),

  /* 32b. Pencil ------------------------------------------------------- */
  defineModel({
    id: "pencil",
    category: "combined",
    name: "Pencil",
    chineseName: "铅笔模型",
    description: "A cylinder body topped by a cone tip.",
    visualizationType: "combined-solid",
    formula: "V = V_{cyl} + V_{cone}",
    formulas: [
      { label: "Body (cylinder)", latex: "V_{cyl} = \\pi r^2 h" },
      { label: "Tip (cone)", latex: "V_{cone} = \\tfrac{1}{3}\\pi r^2 h_t" },
      { label: "Total", latex: "V = \\pi r^2 h + \\tfrac{1}{3}\\pi r^2 h_t" },
    ],
    parameters: [
      { id: "r", label: "Radius", symbol: "r", defaultValue: 0.8, min: 0.2, max: 2, step: 0.05, unit: "u",
        explanation: "Radius of the pencil." },
      { id: "h", label: "Body length", symbol: "h", defaultValue: 5, min: 1, max: 9, step: 0.1, unit: "u",
        explanation: "Length of the cylindrical body." },
      { id: "ht", label: "Tip length", symbol: "h_t", defaultValue: 1.5, min: 0.3, max: 4, step: 0.1, unit: "u",
        explanation: "Length of the sharpened cone tip." },
    ],
    explanation:
      "A pencil is a cylinder (the body) with a cone (the sharpened tip) sharing the same radius. The total volume is the cylinder plus the cone. Since both share the circular contact face, no outer surface passes through it.",
    examples: ["Pencils and crayons.", "Rockets (body + nose cone).", "Some bottles."],
    properties: [
      { label: "Body volume", symbol: "V_b", unit: "u³", latex: "\\pi r^2 h", compute: (p) => PI * p.r * p.r * p.h },
      { label: "Tip volume", symbol: "V_t", unit: "u³", latex: "\\tfrac13\\pi r^2 h_t", compute: (p) => (1 / 3) * PI * p.r * p.r * p.ht },
      { label: "Total volume", symbol: "V", unit: "u³", latex: "V_b + V_t",
        compute: (p) => PI * p.r * p.r * p.h + (1 / 3) * PI * p.r * p.r * p.ht },
    ],
    solid3d: {
      build: (p) => ({
        parts: [
          { type: "cylinder", radiusTop: p.r, radiusBottom: p.r, height: p.h, radialSegments: 40,
            position: [0, 0, 0], color: "#f0b429", name: "body" },
          { type: "cylinder", radiusTop: 0, radiusBottom: p.r, height: p.ht, radialSegments: 40,
            position: [0, p.h / 2 + p.ht / 2, 0], color: "#b08968", name: "tip" },
        ],
      }),
    },
  }),

  /* 32c. Ice cream --------------------------------------------------- */
  defineModel({
    id: "ice-cream",
    category: "combined",
    name: "Ice Cream",
    chineseName: "冰淇淋模型",
    description: "A cone holding a spherical scoop.",
    visualizationType: "combined-solid",
    formula: "V = V_{cone} + V_{ball}",
    formulas: [
      { label: "Cone", latex: "V_{cone} = \\tfrac{1}{3}\\pi r^2 h" },
      { label: "Scoop (sphere)", latex: "V_{ball} = \\tfrac{4}{3}\\pi R^3" },
      { label: "Total", latex: "V = \\tfrac{1}{3}\\pi r^2 h + \\tfrac{4}{3}\\pi R^3" },
    ],
    parameters: [
      { id: "r", label: "Cone radius", symbol: "r", defaultValue: 1.2, min: 0.5, max: 3, step: 0.05, unit: "u",
        explanation: "Radius of the cone's open top." },
      { id: "h", label: "Cone height", symbol: "h", defaultValue: 3.5, min: 1, max: 7, step: 0.1, unit: "u",
        explanation: "Length of the cone (tip points down)." },
      { id: "R", label: "Scoop radius", symbol: "R", defaultValue: 1.4, min: 0.5, max: 3, step: 0.05, unit: "u",
        explanation: "Radius of the spherical scoop." },
    ],
    explanation:
      "An ice cream is a cone (point down) with a sphere resting on top. Add the cone and sphere volumes for the total. In reality part of the scoop sits inside the cone's mouth, so a careful answer would subtract that overlap — a good example of when to subtract.",
    examples: ["Ice-cream cones.", "Decorative finials.", "Spinning tops."],
    properties: [
      { label: "Cone volume", symbol: "V_c", unit: "u³", latex: "\\tfrac13\\pi r^2 h", compute: (p) => (1 / 3) * PI * p.r * p.r * p.h },
      { label: "Scoop volume", symbol: "V_s", unit: "u³", latex: "\\tfrac43\\pi R^3", compute: (p) => (4 / 3) * PI * p.R ** 3 },
      { label: "Total volume", symbol: "V", unit: "u³", latex: "V_c + V_s",
        compute: (p) => (1 / 3) * PI * p.r * p.r * p.h + (4 / 3) * PI * p.R ** 3 },
    ],
    solid3d: {
      build: (p) => ({
        parts: [
          // Cone with the apex pointing down (radiusTop = mouth, radiusBottom = 0).
          { type: "cylinder", radiusTop: p.r, radiusBottom: 0, height: p.h, radialSegments: 40,
            position: [0, 0, 0], color: "#d9a066", name: "cone" },
          { type: "sphere", radius: p.R, position: [0, p.h / 2 + p.R * 0.55, 0], color: "#f7c1d9", name: "scoop" },
        ],
      }),
    },
  }),

  /* 32d. Water tower ------------------------------------------------- */
  defineModel({
    id: "water-tower",
    category: "combined",
    name: "Water Tower",
    chineseName: "水塔模型",
    description: "A cylinder capped with a hemispherical dome.",
    visualizationType: "combined-solid",
    formula: "V = V_{cyl} + V_{hemi}",
    formulas: [
      { label: "Body (cylinder)", latex: "V_{cyl} = \\pi r^2 h" },
      { label: "Dome (hemisphere)", latex: "V_{hemi} = \\tfrac{2}{3}\\pi r^3" },
      { label: "Total", latex: "V = \\pi r^2 h + \\tfrac{2}{3}\\pi r^3" },
    ],
    parameters: [
      { id: "r", label: "Radius", symbol: "r", defaultValue: 2, min: 0.5, max: 4, step: 0.1, unit: "u",
        explanation: "Radius of the cylinder and the dome." },
      { id: "h", label: "Body height", symbol: "h", defaultValue: 4, min: 1, max: 8, step: 0.1, unit: "u",
        explanation: "Height of the cylindrical body." },
    ],
    explanation:
      "A water tower is a cylinder with a hemisphere (half a sphere) on top, sharing the same radius. The total volume adds the cylinder and the hemisphere. A hemisphere is exactly half a sphere, so its volume is ⅔πr³.",
    examples: ["Water towers and silos.", "Observatory domes.", "Storage tanks."],
    properties: [
      { label: "Body volume", symbol: "V_b", unit: "u³", latex: "\\pi r^2 h", compute: (p) => PI * p.r * p.r * p.h },
      { label: "Dome volume", symbol: "V_d", unit: "u³", latex: "\\tfrac23\\pi r^3", compute: (p) => (2 / 3) * PI * p.r ** 3 },
      { label: "Total volume", symbol: "V", unit: "u³", latex: "V_b + V_d",
        compute: (p) => PI * p.r * p.r * p.h + (2 / 3) * PI * p.r ** 3 },
    ],
    solid3d: {
      build: (p) => ({
        parts: [
          { type: "cylinder", radiusTop: p.r, radiusBottom: p.r, height: p.h, radialSegments: 48,
            position: [0, 0, 0], color: "#7fb3d5", name: "body" },
          // Top hemisphere: polar sweep from the north pole down to the equator.
          { type: "sphere", radius: p.r, thetaStart: 0, thetaLength: HALF_PI,
            position: [0, p.h / 2, 0], color: "#2e86c1", name: "dome" },
        ],
      }),
    },
  }),

  /* 32e. Castle ------------------------------------------------------ */
  defineModel({
    id: "castle",
    category: "combined",
    name: "Castle",
    chineseName: "城堡模型",
    description: "A central keep with four corner towers and conical roofs.",
    visualizationType: "combined-solid",
    formula: "V = V_{keep} + 4V_{tower} + 4V_{roof}",
    formulas: [
      { label: "Keep (cuboid)", latex: "V_{keep} = s^2 h_k" },
      { label: "Tower (cylinder)", latex: "V_{tower} = \\pi r^2 h_t" },
      { label: "Roof (cone)", latex: "V_{roof} = \\tfrac{1}{3}\\pi r^2 h_c" },
      { label: "Total", latex: "V = V_{keep} + 4V_{tower} + 4V_{roof}" },
    ],
    parameters: [
      { id: "s", label: "Keep size", symbol: "s", defaultValue: 4, min: 2, max: 7, step: 0.1, unit: "u",
        explanation: "Side length of the square central keep." },
      { id: "hk", label: "Keep height", symbol: "h_k", defaultValue: 3, min: 1, max: 6, step: 0.1, unit: "u",
        explanation: "Height of the central keep." },
      { id: "r", label: "Tower radius", symbol: "r", defaultValue: 0.8, min: 0.3, max: 1.6, step: 0.05, unit: "u",
        explanation: "Radius of each corner tower." },
      { id: "ht", label: "Tower height", symbol: "h_t", defaultValue: 4.5, min: 2, max: 8, step: 0.1, unit: "u",
        explanation: "Height of each corner tower." },
    ],
    explanation:
      "A castle combines several basic solids: a cuboid keep, four cylindrical towers, and four conical roofs. The strategy is the same as always — break it into known pieces, compute each volume, then add them all up. By symmetry the four towers and four roofs are identical, so we multiply by four.",
    examples: ["Toy castles.", "Chess rooks.", "Fortress and tower architecture."],
    properties: [
      { label: "Keep volume", symbol: "V_k", unit: "u³", latex: "s^2 h_k", compute: (p) => p.s * p.s * p.hk },
      { label: "All towers", symbol: "4V_t", unit: "u³", latex: "4\\pi r^2 h_t", compute: (p) => 4 * PI * p.r * p.r * p.ht },
      { label: "All roofs", symbol: "4V_r", unit: "u³", latex: "4\\cdot\\tfrac13\\pi r^2 h_c",
        compute: (p) => 4 * (1 / 3) * PI * p.r * p.r * (p.r * 1.6) },
      {
        label: "Total volume", symbol: "V", unit: "u³", latex: "V_k + 4V_t + 4V_r",
        compute: (p) =>
          p.s * p.s * p.hk + 4 * PI * p.r * p.r * p.ht + 4 * (1 / 3) * PI * p.r * p.r * (p.r * 1.6),
      },
    ],
    solid3d: {
      build: (p) => {
        const hc = p.r * 1.6; // cone roof height scales with tower radius
        const off = p.s / 2; // towers sit at the keep's corners
        const corners: [number, number][] = [
          [off, off],
          [off, -off],
          [-off, off],
          [-off, -off],
        ];
        const parts: SolidPart[] = [
          { type: "box", size: [p.s, p.hk, p.s], position: [0, p.hk / 2, 0], color: "#b8b8b8", name: "keep" },
        ];
        corners.forEach(([x, z], i) => {
          parts.push({
            type: "cylinder",
            radiusTop: p.r,
            radiusBottom: p.r,
            height: p.ht,
            radialSegments: 32,
            position: [x, p.ht / 2, z],
            color: "#9aa0a6",
            name: `tower-${i}`,
          });
          parts.push({
            type: "cylinder",
            radiusTop: 0,
            radiusBottom: p.r * 1.25,
            height: hc,
            radialSegments: 32,
            position: [x, p.ht + hc / 2, z],
            color: "#7e3f3f",
            name: `roof-${i}`,
          });
        });
        return { parts };
      },
    },
  }),
];
