import type { MathModel } from "@/types/model";
import type { LanguageCode } from "./languages";
import { modelTranslations } from "./locales";

/**
 * Returns a copy of `model` with any available translations for `lang`
 * overlaid on top of the canonical English content. Missing fields (or a
 * missing translation entirely) fall back to the original English value.
 *
 * Pure function (not a hook) so it can be called freely inside `.map()`.
 */
export function localizeModel(model: MathModel, lang: LanguageCode): MathModel {
  if (lang === "en") return model;

  const t = modelTranslations[lang]?.[model.id];
  if (!t) return model;

  const parameters = model.parameters.map((param) => {
    const override = t.parameters?.[param.id];
    if (!override) return param;
    return {
      ...param,
      label: override.label ?? param.label,
      explanation: override.explanation ?? param.explanation,
    };
  });

  const formulas = model.formulas.map((formula, i) => {
    const override = t.formulas?.[i];
    if (!override) return formula;
    return {
      ...formula,
      label: override.label ?? formula.label,
      description: override.description ?? formula.description,
    };
  });

  const properties = model.properties?.map((property, i) => {
    const override = t.properties?.[i];
    if (!override) return property;
    return {
      ...property,
      label: override.label ?? property.label,
    };
  });

  const parameterExplanations = Object.fromEntries(
    parameters.filter((p) => p.explanation).map((p) => [p.id, p.explanation as string]),
  );

  return {
    ...model,
    name: t.name ?? model.name,
    description: t.description ?? model.description,
    explanation: t.explanation ?? model.explanation,
    examples: t.examples ?? model.examples,
    parameters,
    formulas,
    properties,
    parameterExplanations,
  };
}
