You are an expert cross-platform full-stack frontend engineer, math visualization developer, React architect, and educational product designer.

I want to build a cross-platform interactive math model visualization application, similar in spirit to GeoGebra, but with one major difference:

Users should NOT need to manually input formulas.

All mathematical models should be predefined, categorized, selectable, and visually displayed. The app should help students intuitively understand function graphs, plane curves, solid geometry, and combined solids through interactive visualizations, formulas, parameter sliders, and concise explanations.

Add multilingual support: English(Default), Chinese, Japanese, Korean, French, German, Portuguese, Italian, Thai, Vietnamese, Arabic, Spanish, Hindi, Russian, Bengali, Urdu, Indonesian, Malay, German,  Tamil, Javanese, Persian, Punjabi, Turkish, Swahili. (The languages in the dropdown selection are each displayed in their own native language, so that native speakers can understand.)
    
The project must support:
1. Web version
2. Desktop version
3. Mobile app version

Use one shared core codebase as much as possible.

Recommended architecture:
- Web app: React + TypeScript + Vite
- Styling: Tailwind CSS
- Formula rendering: KaTeX or MathJax
- 2D graph rendering: SVG / Canvas / Plotly / D3 / function-plot
- 3D rendering: Three.js + React Three Fiber
- Desktop packaging: Tauri
- Mobile packaging: Capacitor for iOS and Android
- PWA support for installable web app experience

Do NOT build separate native apps from scratch.
Use a shared React + TypeScript codebase and package it for different platforms.

The final architecture should make it easy to reuse:
- math model data
- formulas
- parameter controls
- 2D graph rendering logic
- 3D geometry rendering logic
- UI components
- educational explanations

Suggested monorepo structure:

math-model-app/
  apps/
    web/
      # React + Vite web app
    desktop/
      # Tauri desktop wrapper
    mobile/
      # Capacitor mobile wrapper

  packages/
    core/
      # shared model registry, types, parameter definitions, formula metadata
    ui/
      # shared React UI components
    graph-2d/
      # shared 2D graph components
    graph-3d/
      # shared 3D geometry components
    formulas/
      # formula calculation utilities
    config/
      # shared Tailwind, TypeScript, ESLint config if needed

Main product goal:
Build a polished educational math visualization app where users can select a model from a sidebar or list, then immediately see:
- the model name
- the interactive graph or 3D model
- a concise explanation
- mathematical formulas
- parameter sliders
- real-time visual changes when parameters are adjusted
- related properties such as area, perimeter, base area, lateral area, surface area, and volume when applicable

Main layout requirements:

Desktop / Web layout:
- Use a left-right split screen.
- Left sidebar:
  - Search box
  - Collapsible categories
  - Model list
  - Highlight selected model
- Right panel:
  - Model title
  - Interactive visualization
  - Parameter sliders
  - Formula panel
  - Explanation panel
  - Real-life examples
  - Reset button
  - Toggles for formula visibility, labels, grid, wireframe, and helper markers

Mobile layout:
- Do NOT force the desktop split-screen layout onto mobile.
- Use a mobile-first responsive detail layout:
  - Top area: model category selector / search
  - Main area: graph or 3D model
  - Bottom area: tabs or accordion sections for Parameters, Formulas, Explanation, Examples
- The visualization should remain large enough on mobile.
- Parameter sliders should be touch-friendly.
- 3D controls should work with touch gestures.
- Make the UI suitable for phones and tablets.

Desktop app requirements:
- Package the same React app with Tauri.
- Support desktop window resizing.
- Keep the same desktop split-screen layout.
- Prepare for optional future desktop features:
  - export graph as PNG
  - export model screenshot
  - save favorite models locally
  - offline usage

Mobile app requirements:
- Package the same React app with Capacitor.
- Support iOS and Android.
- Use responsive layout.
- Prepare for optional future mobile features:
  - offline model library
  - favorites
  - learning progress
  - app-like navigation
  - safe-area handling
  - touch gestures

PWA requirements:
- Add basic PWA support.
- Make the web app installable.
- Add app name, icon placeholder, manifest, and service worker if reasonable.
- Prepare for offline caching of static model data.

Core data-driven design:

Create a central model registry. Do not hard-code models directly inside UI components.

Each model should be defined as structured data, for example:

{
  id: string;
  category: string;
  name: string;
  chineseName?: string;
  description: string;
  visualizationType: "2d-function" | "2d-implicit" | "3d-solid" | "combined-solid";
  formula: string;
  formulas: FormulaItem[];
  parameters: ParameterDefinition[];
  defaultValues: Record<string, number>;
  explanation: string;
  parameterExplanations: Record<string, string>;
  examples: string[];
  renderConfig?: object;
}

Each parameter should include:
- id
- label
- symbol
- defaultValue
- min
- max
- step
- unit if applicable
- explanation

Each formula item should include:
- label
- latex
- description

Suggested files:

src/
  App.tsx
  main.tsx

  components/
    layout/
      AppLayout.tsx
      Sidebar.tsx
      MobileModelSelector.tsx
      ResponsiveModelPage.tsx

    model/
      ModelViewer.tsx
      ModelHeader.tsx
      ParameterPanel.tsx
      FormulaPanel.tsx
      ExplanationPanel.tsx
      ExamplePanel.tsx

    controls/
      ParameterSlider.tsx
      ToggleControl.tsx
      ResetButton.tsx

    graph2d/
      TwoDGraphViewer.tsx
      FunctionGraph.tsx
      ImplicitCurveGraph.tsx
      CoordinateGrid.tsx
      AsymptoteLayer.tsx
      MarkerLayer.tsx

    graph3d/
      ThreeDModelViewer.tsx
      SolidScene.tsx
      SolidControls.tsx
      DimensionLabels.tsx

  models/
    functionModels.ts
    planeCurveModels.ts
    solidGeometryModels.ts
    combinedSolidModels.ts
    index.ts

  math/
    formulas.ts
    geometryUtils.ts
    graphUtils.ts
    conicUtils.ts

  types/
    model.ts

  hooks/
    useModelParameters.ts
    useResponsiveLayout.ts

  utils/
    formatFormula.ts
    numberFormat.ts

Required math models:

A. Common function graphs

1. Direct proportional function
   - Formula: y = kx
   - Parameter: k
   - Graph: straight line through the origin
   - Explain how k controls slope.

2. Linear function
   - Formula: y = kx + b
   - Parameters: k, b
   - Graph: straight line
   - Explain how k controls slope and b controls the y-intercept.

3. Quadratic function
   - Formula: y = ax² + bx + c
   - Parameters: a, b, c
   - Graph: parabola
   - Show vertex and axis of symmetry if possible.
   - Explain opening direction and width.

4. Inverse proportional function
   - Formula: y = k / x
   - Parameter: k
   - Graph: hyperbola
   - Show asymptotes x = 0 and y = 0.
   - Explain quadrants and asymptotes.

5. Absolute value function
   - Basic formula: y = |x|
   - Transformed formula: y = a|x - h| + k
   - Parameters: a, h, k
   - Graph: V-shaped graph
   - Show vertex.

6. Power function
   - Formula: y = x^a
   - Parameter: a
   - Graph changes depending on exponent.
   - Handle valid domains carefully.

7. Exponential function
   - Formula: y = a^x
   - Parameter: a
   - Graph: rapid growth or decay
   - Explain a > 1 and 0 < a < 1.

8. Logarithmic function
   - Formula: y = log_a(x)
   - Parameter: a
   - Domain: x > 0
   - Show vertical asymptote x = 0.
   - Explain relationship with exponential function.

9. Sine function
   - Basic formula: y = sin(x)
   - Transformed formula: y = A sin(Bx + C) + D
   - Parameters: A, B, C, D
   - Explain amplitude, period, phase shift, and vertical shift.

10. Cosine function
   - Basic formula: y = cos(x)
   - Transformed formula: y = A cos(Bx + C) + D
   - Parameters: A, B, C, D
   - Explain amplitude, period, phase shift, and vertical shift.

11. Tangent function
   - Basic formula: y = tan(x)
   - Transformed formula: y = A tan(Bx + C) + D
   - Parameters: A, B, C, D
   - Show vertical asymptotes.
   - Do not connect graph segments across discontinuities.

12. Piecewise function
   - Provide at least one predefined piecewise function.
   - Example:
     f(x) = -x, x < 0
     f(x) = x, x >= 0
   - Graph should show separate pieces clearly.
   - Explain that different formulas apply to different intervals.

B. Plane curves

13. Circle
   - Formula: x² + y² = r²
   - General formula: (x - h)² + (y - k)² = r²
   - Parameters: h, k, r
   - Show center and radius.
   - Circumference: C = 2πr
   - Area: A = πr²

14. Ellipse
   - Formula: x²/a² + y²/b² = 1
   - Parameters: a, b
   - Show major axis and minor axis.
   - Area: A = πab

15. Hyperbola
   - Formula: x²/a² - y²/b² = 1
   - Parameters: a, b
   - Show two branches and asymptotes.
   - Explain relationship to inverse proportional function.

16. Parabola as conic section
   - Formula: y² = 2px or y = ax²
   - Parameters: p or a
   - Show focus and directrix if possible.
   - Explain opening direction.

C. Solid geometry models

Each 3D model should include:
- Interactive 3D visualization
- Orbit controls
- Rotation, zoom, and pan
- Optional wireframe
- Optional dimension labels
- Formulas for base area, lateral area, surface area, and volume when applicable
- Parameter sliders
- Real-time geometry updates

17. Cuboid / Rectangular prism
   - Parameters: length l, width w, height h
   - Surface area: S = 2(lw + lh + wh)
   - Volume: V = lwh

18. Cube
   - Parameter: side length a
   - Surface area: S = 6a²
   - Volume: V = a³

19. Cylinder
   - Parameters: radius r, height h
   - Base area: B = πr²
   - Lateral area: L = 2πrh
   - Surface area: S = 2πr² + 2πrh
   - Volume: V = πr²h

20. Triangular prism
   - Parameters: triangle base length, triangle height, prism height
   - Base area: B = 1/2 × base × triangle height
   - Volume: V = B × prism height

21. Quadrangular prism
   - Parameters: base length, base width, prism height
   - Base area: B = lw
   - Volume: V = B × h

22. Pentagonal prism
   - Regular pentagonal base
   - Parameters: side length a, prism height h
   - Base area: B = n × a² / (4tan(π/n)), where n = 5
   - Volume: V = B × h

23. Hexagonal prism
   - Regular hexagonal base
   - Parameters: side length a, prism height h
   - Base area: B = 3√3/2 × a²
   - Volume: V = B × h

24. Triangular pyramid
   - Parameters: base dimensions and height
   - Volume: V = 1/3 × B × h

25. Quadrangular pyramid
   - Parameters: base length, base width, height
   - Volume: V = 1/3 × B × h

26. Pentagonal pyramid
   - Regular pentagonal base
   - Parameters: side length a, height h
   - Volume: V = 1/3 × B × h

27. Hexagonal pyramid
   - Regular hexagonal base
   - Parameters: side length a, height h
   - Volume: V = 1/3 × B × h

28. Cone
   - Parameters: radius r, height h
   - Base area: B = πr²
   - Slant height: l = √(r² + h²)
   - Lateral area: L = πrl
   - Surface area: S = πr² + πrl
   - Volume: V = 1/3πr²h

29. Sphere
   - Parameter: radius r
   - Surface area: S = 4πr²
   - Volume: V = 4/3πr³

30. Frustum of a cone
   - Parameters: top radius r, bottom radius R, height h
   - Slant height: l = √((R - r)² + h²)
   - Lateral area: L = π(R + r)l
   - Surface area: S = πR² + πr² + π(R + r)l
   - Volume: V = 1/3πh(R² + Rr + r²)

31. Frustum of a pyramid
   - Parameters: top base size, bottom base size, height, number of sides
   - Use a regular polygon base.
   - Volume:
     V = h/3 × (B1 + B2 + √(B1B2))
   - Explain that B1 and B2 are the areas of the two parallel bases.

D. Combined solids

32. Combined solid examples

Include at least these predefined combined models:

- House model:
  - cuboid body + triangular prism roof

- Pencil model:
  - cylinder + cone

- Ice cream model:
  - cone + sphere

- Water tower model:
  - cylinder + hemisphere

- Castle model:
  - cuboids + cylinders + cones

For combined solids:
- Show each component with subtle different materials or wireframe outlines.
- Show formula logic:
  - Total volume = sum of component volumes
  - Visible surface area may need subtracting hidden contact faces
- Explain the general solving method:
  - split the combined solid into basic solids
  - calculate separately
  - add or subtract as needed

2D visualization requirements:
- Show coordinate axes.
- Show grid lines.
- Show labels.
- Render smooth curves.
- Show important points when applicable:
  - intercepts
  - vertex
  - center
  - radius
  - asymptotes
  - major/minor axes
- Avoid graphing invalid domain values.
- For discontinuous functions, never connect across asymptotes.
- Make graphs responsive.

3D visualization requirements:
- Use React Three Fiber and Three.js.
- Use orbit controls.
- Allow rotate, zoom, and pan.
- Use clean lighting.
- Use simple educational materials.
- Show optional wireframe edges.
- Show optional dimension labels.
- Keep 3D models visually clear and suitable for students.

UI / UX requirements:
- Clean educational style.
- Light background by default.
- Optional dark mode.
- Cards, rounded corners, soft shadows.
- Large readable formulas.
- Clear sliders.
- Desktop split-screen layout.
- Mobile tab or accordion layout.
- The app should feel like a polished learning tool for middle school and high school students.

Important implementation requirements:
- Use TypeScript strictly.
- Define reusable interfaces and types.
- Use model registry instead of hard-coded UI logic.
- Keep formulas in LaTeX format.
- Use reusable components for:
  - sidebar
  - model viewer
  - parameter sliders
  - formula panel
  - explanation panel
  - 2D graph viewer
  - 3D model viewer
- Parameter values should live in React state.
- Changing parameter values should update graph, formulas, and 3D model immediately.
- Add reset-to-default button.
- Add responsive layout detection.
- Add basic error boundaries or fallback UI.
- Add comments where the math or geometry logic is non-trivial.

Build priority:
1. Create the monorepo or scalable project structure.
2. Build the shared model registry and TypeScript model schema.
3. Build the responsive layout for desktop and mobile.
4. Implement the sidebar / search / model selection.
5. Implement formula rendering.
6. Implement parameter sliders.
7. Implement 2D graph rendering for the function models.
8. Implement plane curve rendering.
9. Implement 3D rendering for basic solids:
   - cuboid
   - cube
   - cylinder
   - cone
   - sphere
10. Add prisms, pyramids, frustums, and combined solids.
11. Add PWA support.
12. Add Tauri desktop wrapper.
13. Add Capacitor mobile wrapper.
14. Polish UI and test responsiveness.

MVP requirement:
If the full app is too large for one response, first implement a working MVP with:
- full architecture
- model registry
- responsive layout
- working sidebar
- formula panel
- parameter sliders
- one working function graph
- one working plane curve
- one working 3D solid
- one working combined solid

Then continue expanding the model registry until all required models are represented.

Deliverables:
- Complete working React + TypeScript project.
- Web app runs locally with npm install and npm run dev.
- Include setup instructions.
- Include README.
- Include instructions for:
  - running the web app
  - building the web app
  - packaging desktop app with Tauri
  - packaging mobile app with Capacitor
  - adding a new math model
- Make sure there are no TypeScript errors.
- Prefer a working, extensible educational prototype over an over-engineered incomplete system.

Do not only give a high-level plan.
Actually create the project files and code.