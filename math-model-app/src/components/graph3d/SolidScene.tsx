import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { Edges } from "@react-three/drei";
import type { SolidPart, SolidScene as SolidSceneData } from "@/types/model";
import { buildPrismGeometry, buildPyramidGeometry } from "./solidGeometry";
import { DimensionLabels } from "./DimensionLabels";

const DEFAULT_COLOR = "#60a5fa";

function SolidMesh({ part, wireframe }: { part: SolidPart; wireframe: boolean }) {
  // Custom geometries (prism/pyramid) are built imperatively and disposed on change.
  const customGeometry = useMemo(() => {
    if (part.type === "prism") return buildPrismGeometry(part.base, part.height);
    if (part.type === "pyramid") return buildPyramidGeometry(part.base, part.height, part.topScale ?? 0);
    return null;
  }, [part]);

  useEffect(() => {
    return () => customGeometry?.dispose();
  }, [customGeometry]);

  const color = part.color ?? DEFAULT_COLOR;

  return (
    <mesh position={part.position} rotation={part.rotation} castShadow receiveShadow>
      {part.type === "box" && <boxGeometry args={part.size} />}
      {part.type === "cylinder" && (
        <cylinderGeometry
          args={[part.radiusTop, part.radiusBottom, part.height, part.radialSegments]}
        />
      )}
      {part.type === "sphere" && (
        <sphereGeometry
          args={[part.radius, 48, 32, 0, Math.PI * 2, part.thetaStart ?? 0, part.thetaLength ?? Math.PI]}
        />
      )}
      {customGeometry && <primitive object={customGeometry} attach="geometry" />}
      <meshStandardMaterial
        color={color}
        roughness={0.55}
        metalness={0.05}
        transparent={part.opacity !== undefined && part.opacity < 1}
        opacity={part.opacity ?? 1}
        side={THREE.DoubleSide}
        flatShading
      />
      {wireframe && <Edges threshold={20} color="#1e293b" />}
    </mesh>
  );
}

interface Props {
  scene: SolidSceneData;
  wireframe: boolean;
  showLabels: boolean;
}

/** Renders all parts of a solid (or combined solid) plus dimension labels. */
export function SolidScene({ scene, wireframe, showLabels }: Props) {
  return (
    <group>
      {scene.parts.map((part, i) => (
        <SolidMesh key={part.name ?? i} part={part} wireframe={wireframe} />
      ))}
      {showLabels && scene.labels && scene.labels.length > 0 && (
        <DimensionLabels labels={scene.labels} />
      )}
    </group>
  );
}
