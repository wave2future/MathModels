import { Html } from "@react-three/drei";
import type { DimensionLabel } from "@/types/model";

interface Props {
  labels: DimensionLabel[];
}

/** Floating dimension labels (l, w, h, r ...) anchored in 3D space. */
export function DimensionLabels({ labels }: Props) {
  return (
    <>
      {labels.map((label, i) => (
        <Html
          key={i}
          position={label.position}
          center
          distanceFactor={12}
          zIndexRange={[10, 0]}
          style={{ pointerEvents: "none" }}
        >
          <span className="pointer-events-none whitespace-nowrap rounded bg-slate-900/80 px-1.5 py-0.5 text-[11px] font-medium text-white shadow">
            {label.text}
          </span>
        </Html>
      ))}
    </>
  );
}
