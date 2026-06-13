import type { MathModel, ParamValues } from "@/types/model";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { TwoDGraphViewer } from "@/components/graph2d/TwoDGraphViewer";
import { ThreeDModelViewer } from "@/components/graph3d/ThreeDModelViewer";

interface Props {
  model: MathModel;
  values: ParamValues;
}

const is3D = (m: MathModel) =>
  m.visualizationType === "3d-solid" || m.visualizationType === "combined-solid";

/** Picks the right renderer for a model and isolates it behind an error boundary. */
export function ModelViewer({ model, values }: Props) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <ErrorBoundary label={is3D(model) ? "3D viewer" : "graph"}>
        {is3D(model) ? (
          <ThreeDModelViewer model={model} values={values} />
        ) : (
          <TwoDGraphViewer model={model} values={values} />
        )}
      </ErrorBoundary>
    </div>
  );
}
