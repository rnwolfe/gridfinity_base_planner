"use client";

import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { type Color } from "three";
import { useMemo } from "react";
import type * as THREE from "three";
interface GridfinityBaseProps {
  position: [number, number, number];
  color: Color | string;
  width: number;
  height: number;
  materialProps: {
    roughness: number;
    metalness: number;
    clearcoat: number;
  };
}

export default function GridfinityBase({
  position,
  color,
  width,
  height,
  materialProps,
}: GridfinityBaseProps) {
  const geometry = useLoader(STLLoader, "/frame-1x1.stl");
  const scale = 0.001; // Convert mm to meters
  const cellSize = 0.042; // 42mm in meters

  // Create an array of cell positions for the grid
  const cells = useMemo(() => {
    const cellPositions: [number, number, number][] = [];
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        cellPositions.push([
          position[0] + x * cellSize,
          position[1],
          position[2] + y * cellSize,
        ]);
      }
    }
    return cellPositions;
  }, [position, width, height]);

  return (
    <group>
      {cells.map((cellPosition, index) =>
        geometry ? (
          <mesh
            key={index}
            position={cellPosition}
            geometry={geometry as THREE.BufferGeometry}
            scale={[scale, scale, scale]}
            rotation={[-Math.PI / 2, 0, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              color={color}
              roughness={materialProps.roughness}
              metalness={materialProps.metalness}
            />
          </mesh>
        ) : null,
      )}
    </group>
  );
}
