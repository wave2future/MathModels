import { useEffect, useState } from "react";

export type LayoutMode = "mobile" | "desktop";

/**
 * Reports whether we should use the mobile (stacked/tabbed) layout or the
 * desktop split-screen layout. Breakpoint at 768px (Tailwind's md).
 */
export function useResponsiveLayout(breakpoint = 768): LayoutMode {
  const getMode = (): LayoutMode =>
    typeof window !== "undefined" && window.innerWidth < breakpoint ? "mobile" : "desktop";

  const [mode, setMode] = useState<LayoutMode>(getMode);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = () => setMode(mql.matches ? "mobile" : "desktop");
    handler();
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);

  return mode;
}
