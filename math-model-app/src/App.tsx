import { useEffect, useState } from "react";
import type { MathModel } from "@/types/model";
import { allModels, getModelById } from "@/models";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useTheme } from "@/hooks/useTheme";
import { useFavorites } from "@/hooks/useFavorites";
import { useModelParameters } from "@/hooks/useModelParameters";
import { ViewSettingsProvider } from "@/components/common/ViewSettings";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { AppLayout } from "@/components/layout/AppLayout";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileModelSelector } from "@/components/layout/MobileModelSelector";
import { ResponsiveModelPage } from "@/components/layout/ResponsiveModelPage";
import { LanguageProvider, useLanguage, useT } from "@/i18n/LanguageContext";
import { localizeModel } from "@/i18n/localizeModel";

const FIRST_MODEL = allModels[0].id;
const LAST_SELECTED_KEY = "mathmodels.lastSelected";

/** Resolve the initial model from the URL hash, then localStorage, then default. */
function getInitialModelId(): string {
  if (typeof window !== "undefined") {
    const fromHash = window.location.hash.replace(/^#\/?/, "");
    if (fromHash && getModelById(fromHash)) return fromHash;
    const stored = localStorage.getItem(LAST_SELECTED_KEY);
    if (stored && getModelById(stored)) return stored;
  }
  return FIRST_MODEL;
}

/**
 * Inner page: separated so {@link useModelParameters} can key its state to the
 * selected model and reset cleanly when the selection changes.
 */
function ModelPage({
  model,
  layout,
  isFavorite,
  onToggleFavorite,
}: {
  model: MathModel;
  layout: ReturnType<typeof useResponsiveLayout>;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const { values, setOne, reset, isDefault } = useModelParameters(model);
  return (
    <ResponsiveModelPage
      model={model}
      values={values}
      onChange={setOne}
      onReset={reset}
      isDefault={isDefault}
      layout={layout}
      isFavorite={isFavorite}
      onToggleFavorite={onToggleFavorite}
    />
  );
}

function AppInner() {
  const layout = useResponsiveLayout();
  const { theme, toggle: toggleTheme } = useTheme();
  const { isFavorite, toggle: toggleFavorite, favorites } = useFavorites();
  const { language } = useLanguage();
  const { t } = useT();

  const [selectedId, setSelectedId] = useState<string>(getInitialModelId);

  // Persist selection and keep it in the URL hash (shareable, back-button aware).
  useEffect(() => {
    localStorage.setItem(LAST_SELECTED_KEY, selectedId);
    if (window.location.hash.replace(/^#\/?/, "") !== selectedId) {
      window.history.replaceState(null, "", `#${selectedId}`);
    }
  }, [selectedId]);

  // React to manual hash changes / browser navigation.
  useEffect(() => {
    const onHashChange = () => {
      const id = window.location.hash.replace(/^#\/?/, "");
      if (id && getModelById(id)) setSelectedId(id);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const model = localizeModel(getModelById(selectedId) ?? allModels[0], language);

  return (
    <ViewSettingsProvider>
      <AppLayout
        layout={layout}
        theme={theme}
        onToggleTheme={toggleTheme}
        sidebar={
          <Sidebar
            selectedId={selectedId}
            onSelect={setSelectedId}
            isFavorite={isFavorite}
            favorites={favorites}
          />
        }
        topSelector={<MobileModelSelector selectedId={selectedId} onSelect={setSelectedId} />}
      >
        <ErrorBoundary
          message={t("common.somethingWrongIn", { label: t("errorLabels.modelPage") })}
          retryLabel={t("common.tryAgain")}
        >
          {/* key forces a fresh parameter state when switching models. */}
          <ModelPage
            key={model.id}
            model={model}
            layout={layout}
            isFavorite={isFavorite(model.id)}
            onToggleFavorite={() => toggleFavorite(model.id)}
          />
        </ErrorBoundary>
      </AppLayout>
    </ViewSettingsProvider>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  );
}
