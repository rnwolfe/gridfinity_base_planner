import * as THREE from "three";

// Helper component for grid outline
export function GridOutline({
  position,
  width,
  height,
  color,
}: {
  position: [number, number, number];
  width: number;
  height: number;
  color: THREE.Color | string;
}) {
  const borderThickness = 0.002; // 2mm border thickness
  const boxHeight = 0.01; // 10mm tall box

  return (
    <group position={position}>
      <mesh position={[width / 2, boxHeight / 2, height / 2]}>
        <boxGeometry
          args={[width + borderThickness, boxHeight, height + borderThickness]}
        />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.15}
          roughness={0.2}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
