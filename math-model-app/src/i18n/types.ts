/** Shape of a per-language UI string bundle (src/i18n/locales/<code>/ui.json). */
export interface UiStrings {
  app: {
    tagline: string;
  };
  common: {
    toggleDarkMode: string;
    changeLanguage: string;
    searchPlaceholder: string;
    /** "{query}" placeholder is substituted with the search text. */
    noResults: string;
    /** "{count}" placeholder is substituted with the result count. */
    resultsCount: string;
    favorites: string;
    selectModel: string;
    reset: string;
    addFavorite: string;
    removeFavorite: string;
    /** "{label}" placeholder is substituted with a value from errorLabels. */
    somethingWrongIn: string;
    somethingWrong: string;
    tryAgain: string;
  };
  errorLabels: {
    graph: string;
    viewer3d: string;
    modelPage: string;
  };
  panels: {
    parameters: string;
    formulas: string;
    properties: string;
    explanation: string;
    examples: string;
  };
  viewSettings: {
    grid: string;
    labels: string;
    wireframe: string;
    markers: string;
  };
  /** Short words used as marker/asymptote labels on the 2D graph. */
  graphLabels: {
    center: string;
    vertex: string;
    focus: string;
    directrix: string;
    axis: string;
    midline: string;
    asymptote: string;
    xIntercept: string;
  };
  categories: {
    functions: CategoryStrings;
    "plane-curves": CategoryStrings;
    solids: CategoryStrings;
    combined: CategoryStrings;
  };
}

export interface CategoryStrings {
  name: string;
  description: string;
}

/* ------------------------------------------------------------------ */
/* Model content translations (src/i18n/locales/<code>/models.json)    */
/* ------------------------------------------------------------------ */

export interface ModelFieldTranslation {
  name?: string;
  description?: string;
  explanation?: string;
  examples?: string[];
  /** Keyed by parameter id (matches MathModel.parameters[].id). */
  parameters?: Record<string, { label?: string; explanation?: string }>;
  /** Same order/length as MathModel.formulas. */
  formulas?: Array<{ label?: string; description?: string } | null>;
  /** Same order/length as MathModel.properties. */
  properties?: Array<{ label?: string } | null>;
}

/** Keyed by model id (matches MathModel.id). */
export type ModelTranslations = Record<string, ModelFieldTranslation>;
