import { OrbitControls } from "@react-three/drei";
import { TOUCH } from "three";

/** Orbit / zoom / pan controls tuned for both mouse and touch gestures. */
export function SolidControls() {
  return (
    <OrbitControls
      makeDefault
      enablePan
      enableZoom
      enableRotate
      enableDamping
      dampingFactor={0.1}
      rotateSpeed={0.8}
      zoomSpeed={0.9}
      minDistance={2}
      maxDistance={60}
      // Touch: one finger rotates, two fingers dolly + pan.
      touches={{ ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN }}
    />
  );
}
