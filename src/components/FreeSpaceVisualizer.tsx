import * as THREE from "three";
import type { Space } from "~/lib/gridPlacement";

interface FreeSpaceVisualizerProps {
  spaces: Space[];
  cellSize: number;
}

export function FreeSpaceVisualizer({ spaces, cellSize }: FreeSpaceVisualizerProps) {
  return (
    <group>
      {spaces.map((space, index) => (
        <mesh
          key={index}
          position={[
            space.x * cellSize + (space.width * cellSize) / 2,
            0.001, // Slightly above the base plane
            space.y * cellSize + (space.height * cellSize) / 2,
          ]}
        >
          <planeGeometry args={[space.width * cellSize, space.height * cellSize]} />
          <meshBasicMaterial
            color="#ff0000"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
