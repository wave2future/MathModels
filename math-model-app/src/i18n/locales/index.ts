import type { LanguageCode } from "../languages";
import type { ModelTranslations, UiStrings } from "../types";

import enUi from "./en/ui.json";
import zhUi from "./zh/ui.json";
import jaUi from "./ja/ui.json";
import koUi from "./ko/ui.json";
import frUi from "./fr/ui.json";
import deUi from "./de/ui.json";
import ptUi from "./pt/ui.json";
import itUi from "./it/ui.json";
import thUi from "./th/ui.json";
import viUi from "./vi/ui.json";
import arUi from "./ar/ui.json";
import esUi from "./es/ui.json";
import hiUi from "./hi/ui.json";
import ruUi from "./ru/ui.json";
import bnUi from "./bn/ui.json";
import urUi from "./ur/ui.json";
import idUi from "./id/ui.json";
import msUi from "./ms/ui.json";
import taUi from "./ta/ui.json";
import jvUi from "./jv/ui.json";
import faUi from "./fa/ui.json";
import paUi from "./pa/ui.json";
import trUi from "./tr/ui.json";
import swUi from "./sw/ui.json";

import zhModels from "./zh/models.json";
import jaModels from "./ja/models.json";
import koModels from "./ko/models.json";
import frModels from "./fr/models.json";
import deModels from "./de/models.json";
import ptModels from "./pt/models.json";
import itModels from "./it/models.json";
import thModels from "./th/models.json";
import viModels from "./vi/models.json";
import arModels from "./ar/models.json";
import esModels from "./es/models.json";
import hiModels from "./hi/models.json";
import ruModels from "./ru/models.json";
import bnModels from "./bn/models.json";
import urModels from "./ur/models.json";
import idModels from "./id/models.json";
import msModels from "./ms/models.json";
import taModels from "./ta/models.json";
import jvModels from "./jv/models.json";
import faModels from "./fa/models.json";
import paModels from "./pa/models.json";
import trModels from "./tr/models.json";
import swModels from "./sw/models.json";

/** Per-language UI string bundles. Non-English entries fall back to English for missing keys. */
export const uiTranslations: Record<LanguageCode, UiStrings> = {
  en: enUi as UiStrings,
  zh: zhUi as UiStrings,
  ja: jaUi as UiStrings,
  ko: koUi as UiStrings,
  fr: frUi as UiStrings,
  de: deUi as UiStrings,
  pt: ptUi as UiStrings,
  it: itUi as UiStrings,
  th: thUi as UiStrings,
  vi: viUi as UiStrings,
  ar: arUi as UiStrings,
  es: esUi as UiStrings,
  hi: hiUi as UiStrings,
  ru: ruUi as UiStrings,
  bn: bnUi as UiStrings,
  ur: urUi as UiStrings,
  id: idUi as UiStrings,
  ms: msUi as UiStrings,
  ta: taUi as UiStrings,
  jv: jvUi as UiStrings,
  fa: faUi as UiStrings,
  pa: paUi as UiStrings,
  tr: trUi as UiStrings,
  sw: swUi as UiStrings,
};

/** Per-language model content overrides. Missing entries fall back to English. */
export const modelTranslations: Partial<Record<LanguageCode, ModelTranslations>> = {
  zh: zhModels as ModelTranslations,
  ja: jaModels as ModelTranslations,
  ko: koModels as ModelTranslations,
  fr: frModels as ModelTranslations,
  de: deModels as ModelTranslations,
  pt: ptModels as ModelTranslations,
  it: itModels as ModelTranslations,
  th: thModels as ModelTranslations,
  vi: viModels as ModelTranslations,
  ar: arModels as ModelTranslations,
  es: esModels as ModelTranslations,
  hi: hiModels as ModelTranslations,
  ru: ruModels as ModelTranslations,
  bn: bnModels as ModelTranslations,
  ur: urModels as ModelTranslations,
  id: idModels as ModelTranslations,
  ms: msModels as ModelTranslations,
  ta: taModels as ModelTranslations,
  jv: jvModels as ModelTranslations,
  fa: faModels as ModelTranslations,
  pa: paModels as ModelTranslations,
  tr: trModels as ModelTranslations,
  sw: swModels as ModelTranslations,
};
