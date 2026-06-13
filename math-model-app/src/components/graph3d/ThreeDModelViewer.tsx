import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, Grid } from "@react-three/drei";
import type { MathModel, ParamValues } from "@/types/model";
import { useViewSettings } from "@/components/common/ViewSettings";
import { SolidScene } from "./SolidScene";
import { SolidControls } from "./SolidControls";

interface Props {
  model: MathModel;
  values: ParamValues;
}

/** React Three Fiber canvas for 3D solids and combined solids. */
export function ThreeDModelViewer({ model, values }: Props) {
  const { settings } = useViewSettings();
  const scene = useMemo(() => model.solid3d?.build(values), [model, values]);

  if (!scene) return null;

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [9, 7, 11], fov: 45, near: 0.1, far: 200 }}
      className="touch-none"
    >
      <color attach="background" args={["#f1f5f9"]} />
      <hemisphereLight args={["#ffffff", "#9ca3af", 1.0]} />
      <directionalLight
        position={[8, 12, 8]}
        intensity={1.6}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-6, 4, -6]} intensity={0.4} />

      {/* Refit the camera when the model changes (keyed by id), not on every slider move. */}
      <Bounds key={model.id} fit clip observe margin={1.3}>
        <SolidScene scene={scene} wireframe={settings.showWireframe} showLabels={settings.showLabels} />
      </Bounds>

      {settings.showGrid && (
        <Grid
          position={[0, -0.001, 0]}
          args={[40, 40]}
          cellSize={1}
          cellThickness={0.6}
          cellColor="#cbd5e1"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#94a3b8"
          fadeDistance={40}
          fadeStrength={1}
          infiniteGrid
          followCamera={false}
        />
      )}

      <SolidControls />
    </Canvas>
  );
}
