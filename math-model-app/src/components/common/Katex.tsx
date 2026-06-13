import { useMemo } from "react";
import katex from "katex";

interface KatexProps {
  math: string;
  display?: boolean;
  className?: string;
}

/** Renders a LaTeX string to HTML using KaTeX. Falls back to raw text on error. */
export function Katex({ math, display = false, className }: KatexProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: display,
        throwOnError: false,
        output: "html",
      });
    } catch {
      return math;
    }
  }, [math, display]);

  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
