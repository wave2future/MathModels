import { createContext, useContext, useState, type ReactNode } from "react";

/** Visual toggles shared across the viewer and the toggle controls. */
export interface ViewSettings {
  showFormulas: boolean;
  showLabels: boolean;
  showGrid: boolean;
  showWireframe: boolean;
  showMarkers: boolean;
}

const DEFAULTS: ViewSettings = {
  showFormulas: true,
  showLabels: true,
  showGrid: true,
  showWireframe: false,
  showMarkers: true,
};

interface ViewSettingsContextValue {
  settings: ViewSettings;
  toggle: (key: keyof ViewSettings) => void;
}

const ViewSettingsContext = createContext<ViewSettingsContextValue | null>(null);

export function ViewSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ViewSettings>(DEFAULTS);
  const toggle = (key: keyof ViewSettings) =>
    setSettings((s) => ({ ...s, [key]: !s[key] }));
  return (
    <ViewSettingsContext.Provider value={{ settings, toggle }}>
      {children}
    </ViewSettingsContext.Provider>
  );
}

export function useViewSettings(): ViewSettingsContextValue {
  const ctx = useContext(ViewSettingsContext);
  if (!ctx) throw new Error("useViewSettings must be used within ViewSettingsProvider");
  return ctx;
}
