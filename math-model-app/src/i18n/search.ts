import type { MathModel } from "@/types/model";
import { allModels, getModelById, modelsByCategory } from "@/models";
import type { LanguageCode } from "./languages";
import { localizeModel } from "./localizeModel";

/** Case-insensitive search over the localized name, description, id and category. */
export function searchLocalizedModels(query: string, lang: LanguageCode): MathModel[] {
  const localized = allModels.map((m) => localizeModel(m, lang));
  const q = query.trim().toLowerCase();
  if (!q) return localized;
  return localized.filter((m) => {
    return (
      m.name.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
    );
  });
}

export function localizedModelsByCategory(categoryId: string, lang: LanguageCode): MathModel[] {
  return modelsByCategory(categoryId).map((m) => localizeModel(m, lang));
}

export function getLocalizedModelById(id: string, lang: LanguageCode): MathModel | undefined {
  const model = getModelById(id);
  return model ? localizeModel(model, lang) : undefined;
}
