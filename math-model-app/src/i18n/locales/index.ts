import type { LanguageCode } from "../languages";
import type { ModelTranslations, UiStrings } from "../types";
import enUi from "./en/ui.json";

/** Per-language UI string bundles. Non-English entries are added as translations land. */
export const uiTranslations: Record<LanguageCode, UiStrings> = {
  en: enUi as UiStrings,
} as Record<LanguageCode, UiStrings>;

/** Per-language model content overrides. Missing entries fall back to English. */
export const modelTranslations: Partial<Record<LanguageCode, ModelTranslations>> = {};
